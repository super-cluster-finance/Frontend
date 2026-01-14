import { Info } from "lucide-react";

interface TransactionInfoProps {
  activeTab: string;
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
}

export default function TransactionInfo({
  activeTab,
  wrapDetails,
  unwrapDetails,
}: TransactionInfoProps) {
  return (
    <div className="mt-6 space-y-3 p-4 bg-white/5 border border-white/10 rounded">
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
              <Info className="w-3.5 h-3.5" />
            </span>
            <span className="text-slate-200 font-medium">
              {wrapDetails.allowance}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
