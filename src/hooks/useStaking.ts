import { useState } from "react";
import { Address, encodeFunctionData } from "viem";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import {
  CONTRACTS,
  TOKEN_DECIMALS,
  isCorrectChain,
} from "@/services/web3/contracts/addresses";
import { SupportedChainId } from "@/services/web3/contracts/types";
import { MOCK_USDC_ABI } from "@/services/web3/contracts/abis/MockUSDC";
import { SUPERCLUSTER_ABI } from "@/services/web3/contracts/abis/SuperCluster";
import type { ConnectedWallet } from "@privy-io/react-auth";

const STORAGE_KEY = "supercluster.selectedPilot";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const err = error as Record<string, unknown>;
    if (typeof err.shortMessage === "string") return err.shortMessage;
    if (typeof err.message === "string") return err.message;
  }

  return "Failed to stake. Please try again.";
}

export function useStaking(
  accountAddress?: Address,
  accountChainId?: number,
  embeddedWallet?: ConnectedWallet
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const { address: wagmiAddress, chainId: wagmiChainId } = useAccount();
  const address = accountAddress || wagmiAddress;
  const chainId = accountChainId || wagmiChainId;
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const stake = async (amount: string, pilotAddress?: Address) => {
    if (!address || !chainId) {
      throw new Error("Please connect your wallet");
    }

    if (!isCorrectChain(chainId as SupportedChainId)) {
      throw new Error("Please switch to the correct network");
    }

    if (!amount || Number(amount) <= 0) {
      throw new Error("Please enter a valid amount");
    }

    try {
      setError(null);
      setIsSubmitting(true);
      setTxHash(null);

      const amountBigInt = parseUnits(amount, TOKEN_DECIMALS.USDC);

      let targetPilot: Address = pilotAddress ?? CONTRACTS.pilot;
      if (!pilotAddress && typeof window !== "undefined") {
        const savedAddress = window.localStorage.getItem(STORAGE_KEY);
        if (savedAddress && savedAddress.startsWith("0x")) {
          targetPilot = savedAddress as Address;
        }
      }

      let approveTx: `0x${string}`;
      let depositTx: `0x${string}`;

      // If using Privy embedded wallet, use wallet client directly
      if (embeddedWallet) {
        const walletClient = await embeddedWallet.getEthereumProvider();
        const [userAddress] = (await walletClient.request({
          method: "eth_accounts",
        })) as [string];

        console.log("Approving USDC...");
        const approveData = encodeFunctionData({
          abi: MOCK_USDC_ABI,
          functionName: "approve",
          args: [CONTRACTS.superCluster, amountBigInt],
        });

        approveTx = (await walletClient.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: userAddress,
              to: CONTRACTS.mockUSDC,
              data: approveData,
            },
          ],
        })) as `0x${string}`;

        await publicClient?.waitForTransactionReceipt({ hash: approveTx });
        console.log("USDC approved:", approveTx);

        console.log("Depositing to SuperCluster...");
        const depositData = encodeFunctionData({
          abi: SUPERCLUSTER_ABI,
          functionName: "deposit",
          args: [targetPilot, CONTRACTS.mockUSDC, amountBigInt],
        });

        depositTx = (await walletClient.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: userAddress,
              to: CONTRACTS.superCluster,
              data: depositData,
            },
          ],
        })) as `0x${string}`;
      } else {
        // Use Wagmi for external wallets
        console.log("Approving USDC...");
        approveTx = await writeContractAsync({
          address: CONTRACTS.mockUSDC,
          abi: MOCK_USDC_ABI,
          functionName: "approve",
          args: [CONTRACTS.superCluster, amountBigInt],
        });

        await publicClient?.waitForTransactionReceipt({ hash: approveTx });
        console.log("USDC approved:", approveTx);

        console.log("Depositing to SuperCluster...");
        depositTx = await writeContractAsync({
          address: CONTRACTS.superCluster,
          abi: SUPERCLUSTER_ABI,
          functionName: "deposit",
          args: [targetPilot, CONTRACTS.mockUSDC, amountBigInt],
        });
      }

      await publicClient?.waitForTransactionReceipt({ hash: depositTx });
      console.log("Deposit successful:", depositTx);

      setTxHash(depositTx);
      setError(null);
    } catch (err: unknown) {
      console.error("Staking error:", err);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetError = () => setError(null);

  return {
    stake,
    isSubmitting,
    error,
    txHash,
    resetError,
  };
}
