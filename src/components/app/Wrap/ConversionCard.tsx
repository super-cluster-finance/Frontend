"use client";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { ArrowRightLeft } from "lucide-react";

interface ConversionCardProps {
  activeTab: string;
  amount: string;
  setAmount: (amount: string) => void;
  isConnected: boolean;
  sUSDCBalance: string;
  wsUSDCBalance: string;
  wrapDetails: {
    youWillReceive: string;
    maxUnlockCost: string;
    maxTransactionCost: string;
    exchangeRate: string;
    allowance: string;
  };
  unwrapDetails: {
    youWillReceive: string;
    maxTransactionCost: string;
    exchangeRate: string;
  };
  handleMaxClick: () => void;
  error?: string;
  children?: React.ReactNode;
}

export default function ConversionCard({
  activeTab,
  amount,
  setAmount,
  isConnected,
  wrapDetails,
  unwrapDetails,
  handleMaxClick,
  error,
  children,
}: ConversionCardProps) {
  return (
    <div className="bg-white/10 border border-white/10 rounded p-4 md:p-8 backdrop-blur-sm">
      {/* From Section */}
      <div className="mb-6">
        <label className="text-sm text-slate-400 mb-2 block">You send</label>
        <div className="relative">
          <div className="flex items-center gap-4 bg-white/2 border border-white/10 rounded p-4 hover:border-white/20 transition-all duration-300">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 overflow-hidden flex items-center justify-center rounded-full">
                <Image
                  height={40}
                  width={40}
                  src={activeTab === "wrap" ? "/susdc.png" : "/wsusdc.png"}
                  alt={activeTab === "wrap" ? "sUSDC" : "wsUSDC"}
                  className="rounded-full"
                />
              </div>

              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!isConnected}
                className="bg-transparent border-none text-sm md:text-lg font-semibold focus-visible:ring-0 p-1 h-auto text-white placeholder:text-slate-600 disabled:opacity-50"
              />
            </div>
            <button
              onClick={handleMaxClick}
              disabled={!isConnected}
              className="px-2 md:px-4 py-1 md:py-2 bg-white/20 hover:bg-white/10 border border-white/10 rounded text-slate-300 text-xs md:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Max
            </button>
          </div>
        </div>
      </div>

      {/* Swap Arrow */}
      <div className="flex justify-center -my-2 relative z-10">
        <div className="w-10 h-10 bg-white/10 border border-white/10 rounded-full flex items-center justify-center">
          <ArrowRightLeft className="w-5 h-5 text-[#0b84ba]" />
        </div>
      </div>

      {/* To Section */}
      <div className="mb-6">
        <label className="text-sm text-slate-400 mb-2 block">You receive</label>
        <div className="bg-white/10 border border-white/10 rounded p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
              <Image
                height={40}
                width={40}
                src={activeTab === "wrap" ? "/wsusdc.png" : "/susdc.png"}
                alt={activeTab === "wrap" ? "wsUSDC" : "sUSDC"}
                className="rounded-full"
              />
            </div>
            <div className="text-sm md:text-lg font-semibold text-white">
              {activeTab === "wrap"
                ? wrapDetails.youWillReceive
                : unwrapDetails.youWillReceive}{" "}
              <span className="text-slate-400 text-sm md:text-lg">
                {activeTab === "wrap" ? "wsUSDC" : "sUSDC"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Action Button - Will be passed as children */}
      {children}

      {/* Transaction Info */}
      <div className="mt-6 space-y-3 p-4 bg-white/0 border border-white/10 rounded">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Exchange Rate</span>
          <span className="text-slate-200 font-medium">
            {activeTab === "wrap"
              ? wrapDetails.exchangeRate
              : unwrapDetails.exchangeRate}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Network Fee</span>
          <span className="text-slate-200 font-medium">
            {activeTab === "wrap"
              ? wrapDetails.maxTransactionCost
              : unwrapDetails.maxTransactionCost}
          </span>
        </div>
        {activeTab === "wrap" && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Unlock Cost</span>
              <span className="text-slate-200 font-medium">
                {wrapDetails.maxUnlockCost}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400 flex items-center gap-1">
                Allowance
              </span>
              <span className="text-slate-200 font-medium">
                {wrapDetails.allowance}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
