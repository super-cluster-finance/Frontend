"use client";
import { Button } from "@/components/ui/button";
import {
  Clock,
  FileText,
  Check,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

interface WithdrawalRequest {
  id: bigint;
  sAmountFormatted: string;
  baseAmountFormatted: string;
  status: "pending" | "ready" | "finalizing" | "claimed";
  requestedAtMs: number;
  availableAtMs: number;
  secondsToUnlock: number;
  progress: number;
}

interface RequestsListProps {
  displayRequests: WithdrawalRequest[];
  claimingId: string | null;
  handleClaim: (id: bigint) => Promise<void>;
  isLoadingRequests: boolean;
  usdcFormatted: string;
  fetchRequests: () => void;
  claimError: string | null;
  readyToClaimCount: number;
  totalClaimableAmount: string;
  totalPendingAmount: string;
  claimedCount: number;
}

function formatCountdown(seconds: number): string {
  if (seconds <= 0) return "Ready to be claimed";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}h ${hours}j`;
  if (hours > 0) return `${hours}j ${minutes}m`;
  return `${minutes}m`;
}

export default function RequestsList({
  displayRequests,
  claimingId,
  handleClaim,
  isLoadingRequests,
  usdcFormatted,
  fetchRequests,
  claimError,
  readyToClaimCount,
  totalClaimableAmount,
  totalPendingAmount,
  claimedCount,
}: RequestsListProps) {
  return (
    <div className="bg-white/10 border border-white/10 rounded p-4 md:p-8 backdrop-blur-sm mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg md:text-2xl text-slate-300">
            Your withdrawal request
          </h2>
          <p className="text-sm text-slate-400">
            Claim USDC when the request has been finalized by the operator.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded bg-white/5 border border-white/10 px-4 py-2 text-sm text-slate-300">
            USDC Balance: {parseFloat(usdcFormatted || "0").toFixed(4)}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchRequests}
            className="border border-white/10 cursor-pointer rounded hover:text-slate-300 hover:bg-white/5"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {claimError && (
        <div className="mb-4 flex items-start gap-3 rounded border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{claimError}</span>
        </div>
      )}

      <div className="bg-black/20 border border-white/10 rounded p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="text-slate-300 mb-2 border-b border-slate-200/10 pb-4">
              Withdrawal summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400 block">
                  Total ready to claim
                </span>
                <span className="text-slate-200 text-sm md:text-lg">
                  {totalClaimableAmount} USDC
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Total waiting</span>
                <span className="text-slate-200 text-sm md:text-lg">
                  {parseFloat(totalPendingAmount || "0").toFixed(4)} sUSDC
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">
                  Ready-to-claim requests
                </span>
                <span className="text-slate-200 text-sm md:text-lg">
                  {readyToClaimCount.toString().padStart(2, "0")}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Completed requests</span>
                <span className="text-slate-200 text-sm md:text-lg">
                  {claimedCount.toString().padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLoadingRequests ? (
        <div className="rounded border border-white/10 bg-white/5 p-8 text-center text-slate-400">
          Loading withdrawal request...
        </div>
      ) : displayRequests.length === 0 ? (
        <div className="rounded border border-white/10 bg-white/5 p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded flex items-center justify-center">
            <Clock className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No requests yet
          </h3>
          <p className="text-sm text-slate-400">
            Submit your withdrawal request in the Request tab first. Once the
            operator has processed it, you can make your claim here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayRequests.map((request) => (
            <div
              key={request.id.toString()}
              className="border border-white/10 bg-white/5 rounded p-6"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-wide">
                    <FileText className="w-4 h-4" />
                    Request #{request.id.toString()}
                  </div>
                  <div className="mt-2 text-lg md:text-xl font-semibold text-slate-200">
                    {parseFloat(request.sAmountFormatted || "0").toFixed(4)}{" "}
                    sUSDC
                    <span className="text-sm font-normal text-slate-400 ml-2">
                      ↔{" "}
                      {parseFloat(request.baseAmountFormatted || "0").toFixed(
                        4
                      )}{" "}
                      USDC
                    </span>
                  </div>
                </div>
                <div>
                  {request.status === "ready" && (
                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded bg-white/10 text-white text-xs border border-white/10">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Ready to claim
                    </span>
                  )}
                  {request.status === "pending" && (
                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded bg-white/20 text-white text-xs border border-white/10">
                      <Clock className="w-3.5 h-3.5" />
                      Waiting for the operator
                    </span>
                  )}
                  {request.status === "finalizing" && (
                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded bg-white/30 text-white text-xs border border-white/10">
                      <Clock className="w-3.5 h-3.5" />
                      Processed
                    </span>
                  )}
                  {request.status === "claimed" && (
                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded bg-white/40 text-white text-xs border border-white/10">
                      <Check className="w-3.5 h-3.5" />
                      Completed
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-300 mb-4">
                <div>
                  <span className="text-slate-400 block">Requested on</span>
                  <span className="text-slate-200">
                    {new Date(request.requestedAtMs).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Ready estimate</span>
                  <span className="text-slate-200">
                    {request.availableAtMs > 0
                      ? new Date(request.availableAtMs).toLocaleString()
                      : "-"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Remaining time</span>
                  <span className="text-slate-200">
                    {request.status === "ready" || request.status === "claimed"
                      ? "Ready to claim"
                      : formatCountdown(request.secondsToUnlock)}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>Progress</span>
                  <span className="text-slate-200">{request.progress}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded overflow-hidden">
                  <div
                    className="h-full bg-[#0b84ba] rounded transition-all duration-500"
                    style={{ width: `${request.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-xs text-slate-400">
                  ID request: {request.id.toString()}
                </div>
                {request.status === "ready" && (
                  <Button
                    onClick={() => handleClaim(request.id)}
                    disabled={claimingId === request.id.toString()}
                    className="primary-button text-white font-medium px-6 py-2 cursor-pointer rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {claimingId === request.id.toString()
                      ? "Processing..."
                      : "Claim USDC"}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
