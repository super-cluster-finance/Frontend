"use client";

import { AlertTriangle, Check, Copy } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLogin, usePrivy, useWallets } from "@privy-io/react-auth";
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWriteContract,
} from "wagmi";
import { encodeFunctionData } from "viem";

import { Button } from "@/components/ui/button";
import { useUSDCBalance, useSTokenBalance } from "@/hooks/useTokenBalance";
import {
  CONTRACTS,
  NETWORK_INFO,
  isCorrectChain,
} from "@/services/web3/contracts/addresses";
import { FAUCET_ABI } from "@/services/web3/contracts/abis/Faucet";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Check for insufficient funds
    if (error.message.includes("insufficient funds")) {
      return `Insufficient ETH for gas fees. Please get ${process.env.NEXT_PUBLIC_NETWORK_NAME} ETH first from the faucet linked below.`;
    }
    return error.message;
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "shortMessage" in error &&
    typeof (error as { shortMessage: unknown }).shortMessage === "string"
  ) {
    const msg = (error as { shortMessage: string }).shortMessage;
    if (msg.includes("insufficient funds")) {
      return `Insufficient ETH for gas fees. Please get ${process.env.NEXT_PUBLIC_NETWORK_NAME} ETH first from the faucet linked below.`;
    }
    return msg;
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    const msg = (error as { message: string }).message;
    if (msg.includes("insufficient funds")) {
      return `Insufficient ETH for gas fees. Please get ${process.env.NEXT_PUBLIC_NETWORK_NAME} ETH first from the faucet linked below.`;
    }
    return msg;
  }
  return "Failed to request tokens. Please try again.";
}

function formatAddress(address?: string | null) {
  if (!address) return "—";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function FaucetPage() {
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { login } = useLogin();
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const { address: wagmiAddress, chainId: wagmiChainId } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  // Get embedded wallet from Privy
  const embeddedWallet = wallets.find(
    (wallet) => wallet.walletClientType === "privy"
  );
  // Get address from Privy embedded wallet or fallback to Wagmi
  const address = embeddedWallet?.address || wagmiAddress;

  const { formatted: usdcBalance, refetch: refetchUSDC } = useUSDCBalance(
    address as `0x${string}`
  );
  const { formatted: sUSDCBalance, refetch: refetchSToken } = useSTokenBalance(
    address as `0x${string}`
  );

  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Parse chainId properly - handle both string and number formats
  const parseChainId = (
    chain: string | number | undefined
  ): number | undefined => {
    if (!chain) return undefined;
    if (typeof chain === "number") return chain;
    if (typeof chain === "string") {
      const cleaned = chain.replace("eip155:", "");
      return parseInt(cleaned);
    }
    return undefined;
  };

  // Use chainId from embedded wallet if available, otherwise from Wagmi
  const rawChainId = embeddedWallet?.chainId;
  const chainId = parseChainId(rawChainId) ?? wagmiChainId;

  console.log("🔗 Chain detection:", {
    embeddedWalletChainId: rawChainId,
    wagmiChainId,
    finalChainId: chainId,
    expectedChainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || ""),
    isCorrect: chainId === parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || ""),
  });

  // Check if user is authenticated via Privy (has embedded wallet) or connected via Wagmi
  const isConnected = ready && (authenticated || !!address);

  // Auto-connect embedded wallet to Wagmi when user authenticates
  useEffect(() => {
    const connectWallet = async () => {
      if (authenticated && embeddedWallet && !address) {
        try {
          await embeddedWallet.switchChain(
            parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "")
          );
        } catch (err) {
          console.error("Failed to switch chain:", err);
        }
      }
    };
    connectWallet();
  }, [authenticated, embeddedWallet, address]);

  const { data: faucetTokenAddress } = useReadContract({
    address: CONTRACTS.faucet,
    abi: FAUCET_ABI,
    functionName: "usdc",
  });

  const formattedTokenAddress = useMemo(() => {
    return typeof faucetTokenAddress === "string"
      ? faucetTokenAddress
      : undefined;
  }, [faucetTokenAddress]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const handleConnect = async () => {
    try {
      setError(null);
      await login();
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
    }
  };

  const handleCopyAddress = () => {
    if (!formattedTokenAddress) return;

    navigator.clipboard.writeText(formattedTokenAddress).then(() => {
      setCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleRequestTokens = async () => {
    if (!isConnected) {
      await handleConnect();
      return;
    }

    if (!isCorrectChain(chainId)) {
      const message = "Please switch to the correct network to use the faucet.";
      setError(message);
      return;
    }

    try {
      setError(null);
      setIsRequesting(true);
      setTxHash(null);

      let hash: `0x${string}`;

      // If using Privy embedded wallet, use wallet client directly
      if (embeddedWallet) {
        const walletClient = await embeddedWallet.getEthereumProvider();
        const [userAddress] = (await walletClient.request({
          method: "eth_accounts",
        })) as [string];

        const data = encodeFunctionData({
          abi: FAUCET_ABI,
          functionName: "requestTokens",
        });

        hash = (await walletClient.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: userAddress,
              to: CONTRACTS.faucet,
              data,
            },
          ],
        })) as `0x${string}`;
      } else {
        // Use Wagmi for external wallets modal
        hash = await writeContractAsync({
          address: CONTRACTS.faucet,
          abi: FAUCET_ABI,
          functionName: "requestTokens",
        });
      }

      setTxHash(hash);
      await publicClient?.waitForTransactionReceipt({ hash });
      await refetchUSDC();
      await refetchSToken();
    } catch (err) {
      console.error("Faucet request failed", err);
      const message = getErrorMessage(err);
      setError(message);
    } finally {
      setIsRequesting(false);
    }
  };

  const explorerUrl =
    txHash && NETWORK_INFO.explorer
      ? `${NETWORK_INFO.explorer}/tx/${txHash}`
      : null;

  return (
    <div className="min-h-screen py-20 text-white">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-2xl md:text-4xl mb-2">
            Request Mock USDC for Testing
          </h1>
          <p className="text-md text-slate-400 max-w-2xl mx-auto mb-8">
            Use this faucet to mint a small amount of Mock USDC on Mantle
            Sepolia Testnet.
          </p>
        </header>

        <section className="grid lg:grid-cols-[1fr] gap-6 lg:gap-8 items-start">
          <div className="space-y-6">
            <div className="bg-white/10 border border-white/10 rounded p-4 md:p-8 backdrop-blur-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-lg md:text-xl font-semibold text-slate-300">
                    Faucet Status
                  </h2>
                  <p className="text-sm text-slate-400">
                    Connected wallet will receive Mock USDC on{" "}
                    {process.env.NEXT_PUBLIC_NETWORK_NAME}.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="rounded bg-white/5 border border-white/10 px-4 py-3 text-sm text-slate-300">
                    Network: {process.env.NEXT_PUBLIC_NETWORK_NAME}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="rounded border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-400 tracking-wide">
                    Your Wallet
                  </div>
                  <div className="mt-2 text-sm text-slate-200 font-mono">
                    {address ? formatAddress(address) : "Not connected"}
                  </div>
                </div>

                <div className="rounded border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-400 tracking-wide">
                    Wallet USDC Balance
                  </div>
                  <div className="mt-2 text-sm md:text-xl font-semibold text-slate-200">
                    {usdcBalance} USDC
                  </div>
                </div>

                <div className="rounded border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-400 tracking-wide">
                    Faucet Token
                  </div>
                  <div className="mt-2 text-sm text-slate-200 font-mono">
                    {formattedTokenAddress ? (
                      <button
                        onClick={handleCopyAddress}
                        className="inline-flex items-center gap-2 text-slate-200 hover:text-slate-400 transition-colors"
                      >
                        {formatAddress(formattedTokenAddress)}
                        {copied ? (
                          <Check className="w-3.5 h-3.5 text-slate-200" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 opacity-70" />
                        )}
                      </button>
                    ) : (
                      "Loading..."
                    )}
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-6 flex items-start gap-3 rounded border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {txHash && (
                <div className="mb-6 flex items-start gap-3 rounded border border-white/10 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>Tokens requested successfully.</p>
                    {explorerUrl && (
                      <Link
                        href={explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-emerald-100"
                      >
                        View transaction
                      </Link>
                    )}
                  </div>
                </div>
              )}

              <div className="rounded border border-white/10 bg-white/2 p-5">
                <div className="grid gap-3 text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded bg-white/2 text-slate-200 text-sm border border-white/10">
                      1
                    </span>
                    <div>
                      <p className="text-slate-200">Connect your wallet</p>
                      <p className="text-slate-400">
                        Use {process.env.NEXT_PUBLIC_NETWORK_NAME} network.
                        Switching is required before requesting tokens.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded bg-white/2 text-slate-200 text-sm border border-white/10">
                      2
                    </span>
                    <div>
                      <p className="text-slate-200">Request Mock USDC</p>
                      <p className="text-slate-400">
                        Each call mints a fixed batch of Mock USDC to your
                        wallet for testing.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded bg-white/2 text-slate-200 text-sm border border-white/10">
                      3
                    </span>
                    <div>
                      <p className="text-slate-200">
                        Start staking in SuperCluster
                      </p>
                      <p className="text-slate-400">
                        {" Use the newly minted tokens on the"}
                        <Link
                          href="/app/deposit"
                          className=" text-[#0b84ba] hover:text-[#0973a3] underline"
                        >
                          Deposit
                        </Link>
                        {"  page to test pilots and strategies."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                {isConnected ? (
                  <Button
                    onClick={handleRequestTokens}
                    disabled={isRequesting}
                    className="w-full primary-button text-white cursor-pointer px-6 py-2 h-14 text-sm font-semibold rounded transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isRequesting ? "Requesting..." : "Get Test USDC"}
                  </Button>
                ) : (
                  <Button
                    onClick={handleConnect}
                    className="w-full primary-button text-white cursor-pointer px-6 py-2 h-14 text-sm font-semibold rounded transition-all"
                  >
                    Connect Wallet
                  </Button>
                )}
              </div>
              <aside className="space-y-4 mt-6">
                <div className="rounded p-8 bg-white/0 border border-white/10">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-lg font-semibold text-slate-300">
                      Why do I need Mock USDC?
                    </h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    SuperCluster’s staking flow uses USDC as the underlying
                    asset. On testnet, this faucet distributes a
                    token-compatible mock so you can simulate deposits, pilot
                    allocation, and withdrawals without risking real funds.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
