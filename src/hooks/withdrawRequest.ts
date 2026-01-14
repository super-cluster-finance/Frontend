import { useState, useCallback, useMemo, useEffect } from "react";
import { usePublicClient, useAccount } from "wagmi";
import { formatUnits } from "viem";
import { CONTRACTS, TOKEN_DECIMALS } from "@/services/web3/contracts/addresses";
import { WITHDRAW_MANAGER_ABI } from "@/services/web3/contracts/abis/WithdrawManager";

type WithdrawStatus = "pending" | "finalizing" | "ready" | "claimed";

type WithdrawRequest = {
  id: bigint;
  user: `0x${string}`;
  sAmount: bigint;
  baseAmount: bigint;
  requestedAt: bigint;
  availableAt: bigint;
  finalized: boolean;
  claimed: boolean;
};

type DisplayRequest = WithdrawRequest & {
  status: WithdrawStatus;
  sAmountFormatted: string;
  baseAmountFormatted: string;
  requestedAtMs: number;
  availableAtMs: number;
  secondsToUnlock: number;
  progress: number;
};

export function useWithdrawRequests() {
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const [requests, setRequests] = useState<WithdrawRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nowSeconds, setNowSeconds] = useState(() =>
    Math.floor(Date.now() / 1000)
  );

  // Update current time every 30 seconds
  useEffect(() => {
    const interval = setInterval(
      () => setNowSeconds(Math.floor(Date.now() / 1000)),
      30000
    );
    return () => clearInterval(interval);
  }, []);

  const fetchRequests = useCallback(async () => {
    if (!address || !publicClient) return;

    setIsLoading(true);
    try {
      const idsRaw = (await publicClient.readContract({
        address: CONTRACTS.withdrawManager,
        abi: WITHDRAW_MANAGER_ABI,
        functionName: "getRequestsOf",
        args: [address as `0x${string}`],
      })) as bigint[] | undefined;

      const ids = Array.isArray(idsRaw) ? idsRaw : [];

      const uniqueIds = Array.from(new Set(ids.map((id) => id.toString())))
        .map((id) => BigInt(id))
        .sort((a, b) => (a > b ? -1 : 1));

      const results = await Promise.all(
        uniqueIds.map(async (id) => {
          const response = await publicClient.readContract({
            address: CONTRACTS.withdrawManager,
            abi: WITHDRAW_MANAGER_ABI,
            functionName: "requests",
            args: [id],
          });

          const [
            user,
            sAmount,
            baseAmount,
            requestedAt,
            availableAt,
            finalized,
            claimed,
          ] = response as [
            `0x${string}`,
            bigint,
            bigint,
            bigint,
            bigint,
            boolean,
            boolean
          ];

          return {
            id,
            user,
            sAmount,
            baseAmount,
            requestedAt,
            availableAt,
            finalized,
            claimed,
          } satisfies WithdrawRequest;
        })
      );

      setRequests(results);
    } catch (error) {
      console.error("Failed to retrieve withdrawal data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [address, publicClient]);

  // Auto-fetch on mount and when dependencies change
  useEffect(() => {
    if (address && publicClient) {
      fetchRequests();
    }
  }, [address, publicClient, fetchRequests]);

  const displayRequests: DisplayRequest[] = useMemo(() => {
    return requests.map((request) => {
      const requestedAtMs = Number(request.requestedAt) * 1000;
      const availableAtMs = Number(request.availableAt) * 1000;

      let status: WithdrawStatus = "pending";
      if (request.claimed) {
        status = "claimed";
      } else if (
        request.finalized &&
        Number(request.availableAt) <= nowSeconds
      ) {
        status = "ready";
      } else if (request.finalized) {
        status = "finalizing";
      }

      const sAmountFormatted = formatUnits(
        request.sAmount,
        TOKEN_DECIMALS.SUSDC
      );
      const baseAmountFormatted =
        request.baseAmount > BigInt(0)
          ? formatUnits(request.baseAmount, TOKEN_DECIMALS.USDC)
          : "0.00";

      const secondsToUnlock =
        status === "ready"
          ? 0
          : Math.max(Number(request.availableAt) - nowSeconds, 0);

      let progress = 0;
      if (status === "claimed" || status === "ready") {
        progress = 100;
      } else if (request.finalized) {
        const total = Math.max(
          Number(request.availableAt - request.requestedAt),
          1
        );
        const elapsed = Math.min(
          Math.max(nowSeconds - Number(request.requestedAt), 0),
          total
        );
        progress = Math.max(Math.round((elapsed / total) * 100), 5);
      }

      return {
        ...request,
        status,
        sAmountFormatted,
        baseAmountFormatted,
        requestedAtMs,
        availableAtMs,
        secondsToUnlock,
        progress,
      };
    });
  }, [requests, nowSeconds]);

  const readyToClaimCount = useMemo(
    () => displayRequests.filter((req) => req.status === "ready").length,
    [displayRequests]
  );

  const pendingRequestsCount = useMemo(
    () =>
      displayRequests.filter(
        (req) => req.status === "pending" || req.status === "finalizing"
      ).length,
    [displayRequests]
  );

  const claimedCount = useMemo(
    () => displayRequests.filter((req) => req.status === "claimed").length,
    [displayRequests]
  );

  const totalClaimableAmount = useMemo(() => {
    const total = displayRequests.reduce((acc, req) => {
      if (req.status === "ready") {
        return acc + req.baseAmount;
      }
      return acc;
    }, BigInt(0));
    return formatUnits(total, TOKEN_DECIMALS.USDC);
  }, [displayRequests]);

  const totalPendingAmount = useMemo(() => {
    const total = displayRequests.reduce((acc, req) => {
      if (req.status !== "claimed") {
        return acc + req.sAmount;
      }
      return acc;
    }, BigInt(0));
    return formatUnits(total, TOKEN_DECIMALS.SUSDC);
  }, [displayRequests]);

  return {
    requests: displayRequests,
    isLoading,
    fetchRequests,
    readyToClaimCount,
    pendingRequestsCount,
    claimedCount,
    totalClaimableAmount,
    totalPendingAmount,
    displayRequests,
  };
}
