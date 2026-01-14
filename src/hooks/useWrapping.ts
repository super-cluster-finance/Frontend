import { useState } from "react";
import { Address, encodeFunctionData, parseUnits } from "viem";
import { useAccount, usePublicClient, useWriteContract } from "wagmi";
import {
  CONTRACTS,
  TOKEN_DECIMALS,
  isCorrectChain,
} from "@/services/web3/contracts/addresses";
import { STOKEN_ABI } from "@/services/web3/contracts/abis/SToken";
import { WSTOKEN_ABI } from "@/services/web3/contracts/abis/WsToken";
import type { ConnectedWallet } from "@privy-io/react-auth";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const err = error as Record<string, unknown>;
    if (typeof err.shortMessage === "string") return err.shortMessage;
    if (typeof err.message === "string") return err.message;
  }

  return "Transaction failed. Please try again.";
}

export function useWrapping(
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

  const wrap = async (amount: string) => {
    if (!address || !chainId) {
      throw new Error("Please connect your wallet");
    }

    if (!isCorrectChain(chainId)) {
      throw new Error(
        `Please switch to ${process.env.NEXT_PUBLIC_NETWORK_NAME} network`
      );
    }

    if (!amount || Number(amount) <= 0) {
      throw new Error("Please enter a valid amount");
    }

    try {
      setError(null);
      setIsSubmitting(true);
      setTxHash(null);

      const amountBigInt = parseUnits(amount, TOKEN_DECIMALS.SUSDC);

      let approveTx: `0x${string}`;
      let wrapTx: `0x${string}`;

      // If using Privy embedded wallet, use wallet client directly
      if (embeddedWallet) {
        const walletClient = await embeddedWallet.getEthereumProvider();
        const [userAddress] = (await walletClient.request({
          method: "eth_accounts",
        })) as [string];

        console.log("Approving sToken for wrapping...");
        const approveData = encodeFunctionData({
          abi: STOKEN_ABI,
          functionName: "approve",
          args: [CONTRACTS.wsToken, amountBigInt],
        });

        approveTx = (await walletClient.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: userAddress,
              to: CONTRACTS.sToken,
              data: approveData,
            },
          ],
        })) as `0x${string}`;

        await publicClient?.waitForTransactionReceipt({ hash: approveTx });
        console.log("sToken approved:", approveTx);

        console.log("Wrapping sToken to wsToken...");
        const wrapData = encodeFunctionData({
          abi: WSTOKEN_ABI,
          functionName: "wrap",
          args: [amountBigInt],
        });

        wrapTx = (await walletClient.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: userAddress,
              to: CONTRACTS.wsToken,
              data: wrapData,
            },
          ],
        })) as `0x${string}`;
      } else {
        // Use Wagmi for external wallets
        console.log("Approving sToken for wrapping...");
        approveTx = await writeContractAsync({
          address: CONTRACTS.sToken,
          abi: STOKEN_ABI,
          functionName: "approve",
          args: [CONTRACTS.wsToken, amountBigInt],
        });

        await publicClient?.waitForTransactionReceipt({ hash: approveTx });
        console.log("sToken approved:", approveTx);

        console.log("Wrapping sToken to wsToken...");
        wrapTx = await writeContractAsync({
          address: CONTRACTS.wsToken,
          abi: WSTOKEN_ABI,
          functionName: "wrap",
          args: [amountBigInt],
        });
      }

      await publicClient?.waitForTransactionReceipt({ hash: wrapTx });
      console.log("Wrap successful:", wrapTx);

      setTxHash(wrapTx);
      setError(null);
    } catch (err: unknown) {
      console.error("Wrap error:", err);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const unwrap = async (amount: string) => {
    if (!address || !chainId) {
      throw new Error("Please connect your wallet");
    }

    if (!isCorrectChain(chainId)) {
      throw new Error(
        `Please switch to ${process.env.NEXT_PUBLIC_NETWORK_NAME} network`
      );
    }

    if (!amount || Number(amount) <= 0) {
      throw new Error("Please enter a valid amount");
    }

    try {
      setError(null);
      setIsSubmitting(true);
      setTxHash(null);

      const amountBigInt = parseUnits(amount, TOKEN_DECIMALS.SUSDC);

      let unwrapTx: `0x${string}`;

      // If using Privy embedded wallet, use wallet client directly
      if (embeddedWallet) {
        const walletClient = await embeddedWallet.getEthereumProvider();
        const [userAddress] = (await walletClient.request({
          method: "eth_accounts",
        })) as [string];

        console.log("Unwrapping wsToken to sToken...");
        const unwrapData = encodeFunctionData({
          abi: WSTOKEN_ABI,
          functionName: "unwrap",
          args: [amountBigInt],
        });

        unwrapTx = (await walletClient.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: userAddress,
              to: CONTRACTS.wsToken,
              data: unwrapData,
            },
          ],
        })) as `0x${string}`;
      } else {
        // Use Wagmi for external wallets
        console.log("Unwrapping wsToken to sToken...");
        unwrapTx = await writeContractAsync({
          address: CONTRACTS.wsToken,
          abi: WSTOKEN_ABI,
          functionName: "unwrap",
          args: [amountBigInt],
        });
      }

      await publicClient?.waitForTransactionReceipt({ hash: unwrapTx });
      console.log("Unwrap successful:", unwrapTx);

      setTxHash(unwrapTx);
      setError(null);
    } catch (err: unknown) {
      console.error("Unwrap error:", err);
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetError = () => setError(null);

  return {
    wrap,
    unwrap,
    isSubmitting,
    error,
    txHash,
    resetError,
  };
}
