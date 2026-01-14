import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function TransactionInfo() {
  return (
    <div className="mt-6 space-y-3 p-4 bg-white/0 border border-white/10 rounded text-sm">
      <div className="flex justify-between">
        <span className="text-slate-400">Withdrawal mode</span>
        <span className="text-[#0b84ba] font-medium">Free</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-400">Network fee</span>
        <span className="text-slate-200 font-medium">~$0.20</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-400 flex items-center gap-1">
          Time estimate
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="w-3.5 h-3.5 text-slate-500 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="bg-slate-800 border-slate-700">
                <p className="text-xs text-slate-200">
                  Times may vary depending on queue conditions and operator
                  actions.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </span>
        <span className="text-slate-200 font-medium">3–10 days</span>
      </div>
    </div>
  );
}
