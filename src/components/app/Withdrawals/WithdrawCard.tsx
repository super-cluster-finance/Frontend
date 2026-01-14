"use client";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Copy, Check } from "lucide-react";
import TransactionInfo from "./TransactionInfo";

interface WithdrawCardProps {
  amount: string;
  setAmount: (amount: string) => void;
  isConnected: boolean;
  isSubmitting: boolean;
  sTokenFormatted: string;
  selectedMethod: "superCluster" | "dex";
  setSelectedMethod: (method: "superCluster" | "dex") => void;
  handleMaxClick: () => void;
  address?: string;
  copied: boolean;
  handleCopyAddress: () => void;
  readyToClaimCount: number;
  pendingRequestsCount: number;
  totalClaimableAmount: string;
  children?: React.ReactNode;
}

export default function WithdrawCard({
  amount,
  setAmount,
  isConnected,
  isSubmitting,
  sTokenFormatted,
  selectedMethod,
  setSelectedMethod,
  handleMaxClick,
  address,
  copied,
  handleCopyAddress,
  totalClaimableAmount,
  children,
}: WithdrawCardProps) {
  return (
    <div className="bg-white/10 border border-white/10 rounded p-4 md:p-8 backdrop-blur-sm mb-6">
      {/* amount */}
      <div className="mb-6">
        <label className="text-sm text-slate-400 mb-2 block">
          Amount to be withdrawn
        </label>
        <div className="relative">
          <div className="flex items-center gap-4 bg-white/2 border border-white/10 rounded p-4 hover:border-white/20 transition-all duration-300">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Image
                src="/susdc.png"
                alt="sUSDC"
                width={40}
                height={40}
                className="flex-shrink-0 rounded-full"
              />
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!isConnected || isSubmitting}
                className="bg-transparent border-none text-sm md:text-lg font-semibold focus-visible:ring-0 p-1 h-auto text-white placeholder:text-slate-600 min-w-0 disabled:opacity-60"
              />
            </div>
            <button
              onClick={handleMaxClick}
              disabled={!isConnected || isSubmitting}
              className="px-2 md:px-4 py-1 md:py-2 bg-white/20 hover:bg-white/10 border border-white/10 rounded text-slate-300 text-xs md:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Max
            </button>
          </div>
        </div>
      </div>

      {/* method */}
      <div className="mb-6">
        <label className="text-sm text-slate-400 mb-3 block">
          Withdrawal method
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setSelectedMethod("superCluster")}
            disabled={!isConnected || isSubmitting}
            className={`p-5 rounded border transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              selectedMethod === "superCluster"
                ? "border-white/10 bg-white/5 hover:border-white/20"
                : "border-white/10 bg-white/5 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-300">
                  superCluster Queue
                </span>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === "superCluster"
                    ? "border-white/10 bg-white/10 flex items-center justify-center"
                    : "border-slate-500"
                }`}
              >
                {selectedMethod === "superCluster" && (
                  <div className="w-2.5 h-2.5 bg-blue-400 rounded-full" />
                )}
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Rate:</span>
                <span className="text-slate-200 font-medium">1 : 1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Estimated duration:</span>
                <span className="text-slate-200 font-medium">3–10 days</span>
              </div>
            </div>
          </button>

          <button
            onClick={() => setSelectedMethod("dex")}
            disabled
            className="p-5 rounded border-2 border-white/10 bg-white/5 opacity-50 cursor-not-allowed"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="font-medium text-slate-300">
                  DEX Instant Coming Soon!
                </span>
              </div>
              <div className="w-5 h-5 rounded-full border-2 border-slate-500" />
            </div>
            <p className="text-sm text-start text-slate-400">
              Instant swaps via DEX with third-party liquidity. This feature is
              not yet available.
            </p>
          </button>
        </div>
      </div>

      {isConnected && address && (
        <div className="mb-6 p-5 bg-white/2 border border-white/10 rounded">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">sUSDC balance</span>
              </div>
              <div className="text-sm md:text-lg text-slate-200">
                {sTokenFormatted} sUSDC
              </div>
            </div>

            <div className="space-y-1">
              <span className="text-sm text-slate-400 block">
                Wallet address
              </span>
              <button
                onClick={handleCopyAddress}
                className="flex items-center gap-2 text-sm font-mono text-slate-200 hover:text-slate-400 transition-colors group"
              >
                <span>{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-green-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 " />
                )}
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-400">Total claimable</span>
              </div>
              <div className="text-sm md:text-lg text-slate-200">
                {totalClaimableAmount} USDC
              </div>
            </div>
          </div>
        </div>
      )}
      {children}
      <TransactionInfo />
    </div>
  );
}
