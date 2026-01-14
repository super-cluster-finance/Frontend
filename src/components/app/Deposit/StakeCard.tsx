"use client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Info, Check, Copy } from "lucide-react";

export interface StakeCardProps {
  isConnected: boolean;
  isConnecting: boolean;
  address: string;
  usdcBalance: string | number;
  sUSDCBalance: string | number;
  stats: {
    apr: string | number;
    [key: string]: string | number | undefined;
  };
  selectedPilotInfo?: {
    name?: string;
    address?: string;
    [key: string]: string | undefined;
  };
  onCopyAddress: () => void;
  copied: boolean;
  pilotCopied: boolean;
  onCopyPilot: () => void;
  usdcAmount: string | number;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onMax: () => void;
  onStake: () => void;
  onConnect: () => void;
  isStakeDisabled: () => boolean;
  getStakeButtonText: () => string;
  error?: string;
}

export function StakeCard({
  isConnected,
  isConnecting,
  address,
  usdcBalance,
  sUSDCBalance,
  stats,
  selectedPilotInfo,
  onCopyAddress,
  copied,
  pilotCopied,
  onCopyPilot,
  usdcAmount,
  onAmountChange,
  onMax,
  onStake,
  onConnect,
  isStakeDisabled,
  getStakeButtonText,
  error,
}: StakeCardProps) {
  function formatAddress(address?: string | null) {
    if (!address) return "—";
    return `${address.slice(0, 12)}...${address.slice(-12)}`;
  }
  const formattedTokenAddress = address;
  const formattedPilotAddress = selectedPilotInfo?.address;
  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="bg-white/10 border border-white/10 rounded p-4 md:p-8 backdrop-blur-sm">
        <div className="mb-6">
          <label className="text-sm text-slate-400 mb-2 block">
            Amount to Deposit
          </label>
          <div className="relative">
            <div className="flex items-center gap-4 bg-white/2 border border-white/10 rounded p-4 hover:border-white/20 transition-all duration-300">
              <div className="flex items-center gap-3 flex-1">
                <Image src="/usdc.png" alt="USDC" width={48} height={48} />
                <Input
                  type="text"
                  placeholder="0.00"
                  value={usdcAmount}
                  onChange={onAmountChange}
                  disabled={!isConnected}
                  className="bg-transparent border-none text-sm md:text-lg font-semibold focus-visible:ring-0 p-1 h-auto text-white placeholder:text-slate-600 disabled:opacity-50"
                />
              </div>
              <button
                onClick={onMax}
                disabled={!isConnected}
                className="px-2 md:px-4 py-1 md:py-2 bg-white/20 hover:bg-white/10 border border-white/10 rounded text-slate-300 text-xs md:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Max
              </button>
            </div>
          </div>
        </div>

        {isConnected && address && (
          <div className="mb-6 p-5 bg-white/3 border border-white/10 rounded">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">
                    Available to Deposit
                  </span>
                </div>
                <div className="text-sm md:text-lg text-slate-300">
                  {usdcBalance} USDC
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">
                    Deposited amount
                  </span>
                </div>
                <div className="text-sm md:text-lg text-slate-300">
                  {sUSDCBalance} sUSDC
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-slate-400 block">
                  Wallet Address
                </span>
                {formattedTokenAddress ? (
                  <button
                    onClick={onCopyAddress}
                    className="flex items-center gap-2 text-sm font-mono text-slate-300 hover:text-slate-400 transition-colors group"
                  >
                    {formatAddress(formattedTokenAddress)}
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-slate-300" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                ) : (
                  "Loading..."
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">sUSDC APR</span>
                </div>
                <div className="text-sm md:text-lg text-[#0b84ba]">
                  {stats.apr}
                </div>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-400">Selected pilot</span>
                </div>
                <div className="flex flex-col gap-3 rounded border border-white/10 bg-black/20 p-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-lg text-gray-200">
                      {selectedPilotInfo?.name}
                    </span>
                    <Link
                      href="/app/pilot"
                      className="text-sm mb-4 w-auto text-[#0b84ba] transition-colors hover:text-[#0b84ba]/80"
                    >
                      Manage pilots
                    </Link>

                    <button
                      onClick={onCopyPilot}
                      className="custom-pointer flex items-center gap-2 font-mono text-sm text-slate-300 transition-all hover:text-slate-400 duration-300 self-start"
                    >
                      <span>{formatAddress(formattedPilotAddress)}</span>
                      {pilotCopied ? (
                        <Check className="h-3.5 w-3.5 text-slate-300" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8">
          <label className="text-sm text-slate-400 mb-2 block">
            You will receive
          </label>
          <div className="bg-white/10 border border-white/10 rounded p-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Image
                src="/susdc.png"
                alt="sUSDC"
                width={48}
                height={48}
                className="flex-shrink-0 rounded-full"
              />
              <div className="text-sm md:text-lg text-white truncate">
                {usdcAmount || "0.0000"} sUSDC
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {isConnected ? (
          <Button
            onClick={onStake}
            disabled={isStakeDisabled()}
            className={`w-full px-4 py-2 bg-white/20 h-14 text-sm rounded transition-all disabled:cursor-not-allowed disabled:shadow-none ${
              isStakeDisabled()
                ? "bg-slate-700 text-slate-400 border border-slate-600"
                : "w-full primary-button text-white text-sm cursor-pointer rounded transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            }`}
          >
            {getStakeButtonText()}
          </Button>
        ) : (
          <Button
            onClick={onConnect}
            disabled={isConnecting}
            className="w-full px-4 py-2 h-14 primary-button text-white font-medium text-sm rounded transition-all duration-300 disabled:opacity-50"
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        )}

        <div className="mt-6 space-y-3 p-4 bg-white/0 border border-white/10 rounded">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Exchange Rate</span>
            <span className="text-slate-200 font-medium">1 USDC = 1 sUSDC</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Network Fee</span>
            <span className="text-slate-200 font-medium">~$0.92</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400 flex items-center gap-1">
              Reward Fee <Info className="w-3.5 h-3.5" />
            </span>
            <span className="text-slate-200 font-medium">10%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
