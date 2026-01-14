"use client";
import Image from "next/image";
import { Copy, Check } from "lucide-react";

interface WalletInfoProps {
  address: string;
  copied: boolean;
  onCopyAddress: () => void;
  sUSDCBalance: string;
  wsUSDCBalance: string;
  formattedConversionRate: string;
  isConnected: boolean;
}

export default function WalletInfo({
  address,
  copied,
  onCopyAddress,
  sUSDCBalance,
  wsUSDCBalance,
  formattedConversionRate,
  isConnected,
}: WalletInfoProps) {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected || !address) return null;

  return (
    <div className="mb-6 p-6 bg-white/2 border border-white/10 rounded">
      <div className="grid grid-cols-1 gap-5">
        {/* Wallet Address Header */}
        <div className="pb-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-xs text-slate-400 block mb-1">
                  Connected Wallet
                </span>
                <button
                  onClick={onCopyAddress}
                  className="flex items-center gap-2 text-sm font-mono text-slate-300 hover:text-slate-400 transition-colors group"
                >
                  <span className="font-semibold">
                    {formatAddress(address)}
                  </span>
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 opacity-50" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Token Balances Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* sUSDC Balance */}
          <div className="relative group">
            <div className="absolute inset-0" />
            <div className="relative p-4 bg-white/5 border border-white/10 rounded transition-all">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 p-1 rounded-full overflow-hidden bg-white/10 flex items-center justify-center border border-white/10">
                  <Image
                    src="/usdc.png"
                    alt="USDC"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <span className="text-sm text-slate-300 font-medium">
                  sUSDC
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-sm md:text-lg font-medium text-white">
                  {sUSDCBalance}
                </div>
                <div className="text-xs text-slate-500">
                  ≈{" "}
                  {sUSDCBalance && formattedConversionRate
                    ? (
                        parseFloat(sUSDCBalance.replace(/,/g, "")) /
                        parseFloat(formattedConversionRate.replace(/,/g, ""))
                      ).toFixed(4)
                    : "0.0000"}{" "}
                  wsUSDC
                </div>
              </div>
            </div>
          </div>

          {/* wsUSDC Balance */}
          <div className="relative group">
            <div className="absolute inset-0" />
            <div className="relative p-4 bg-white/5 border border-white/10 rounded transition-all">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-white/10 flex items-center justify-center border border-white/10">
                  <Image
                    src="/wsusdc.png"
                    alt="wsUSDC"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <span className="text-sm text-slate-300 font-medium">
                  wsUSDC
                </span>
              </div>
              <div className="space-y-1">
                <div className="text-sm md:text-lg font-medium text-white">
                  {wsUSDCBalance}
                </div>
                <div className="text-xs text-slate-500">
                  ≈{" "}
                  {wsUSDCBalance && formattedConversionRate
                    ? (
                        parseFloat(wsUSDCBalance.replace(/,/g, "")) *
                        parseFloat(formattedConversionRate.replace(/,/g, ""))
                      ).toFixed(4)
                    : "0.0000"}{" "}
                  sUSDC
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
