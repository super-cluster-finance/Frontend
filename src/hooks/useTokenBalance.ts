import { useAccount, useBalance, useReadContract } from "wagmi";
import { useMemo } from "react";
import { CONTRACTS, TOKEN_DECIMALS } from "@/services/web3/contracts/addresses";
import { STOKEN_ABI } from "@/services/web3/contracts/abis/SToken";
import { WSTOKEN_ABI } from "@/services/web3/contracts/abis/WsToken";

export function useUSDCBalance(accountAddress?: `0x${string}`) {
  const formatTokenBalanceFloor = (raw: bigint, decimals: number) => {
    if (raw === BigInt(0)) return "0";

    const base = BigInt(10) ** BigInt(decimals);
    const integerPart = raw / base;
    const remainder = raw % base;

    let fractionDigits = 6;
    if (integerPart > BigInt(0)) fractionDigits = 4;
    else {
      const twoDecimalBase = base / BigInt(10) ** BigInt(2);
      const fourDecimalBase = base / BigInt(10) ** BigInt(4);
      if (remainder >= twoDecimalBase) fractionDigits = 5;
      else if (remainder >= fourDecimalBase) fractionDigits = 6;
    }
    let scaled = (remainder * BigInt(10) ** BigInt(fractionDigits)) / base;
    if (
      scaled === BigInt(0) &&
      remainder > BigInt(0) &&
      fractionDigits < Math.min(decimals, 6)
    ) {
      fractionDigits = Math.min(decimals, 6);
      scaled = (remainder * BigInt(10) ** BigInt(fractionDigits)) / base;
    }

    const whole = Number(integerPart).toLocaleString("en-US");
    const padded = scaled.toString().padStart(fractionDigits, "0");
    let fraction = padded.replace(/0+$/, "");

    if (fraction === "" && remainder > BigInt(0)) {
      fraction = "0".repeat(fractionDigits);
    }

    return fraction ? `${whole}.${fraction}` : whole;
  };

  const { address: wagmiAddress } = useAccount();
  const address = accountAddress || wagmiAddress;

  const {
    data: balance,
    isLoading,
    refetch,
  } = useBalance({
    address,
    token: CONTRACTS.mockUSDC,
    query: {
      enabled: Boolean(address),
      refetchInterval: 10000,
    },
  });

  const formatted = useMemo(() => {
    if (!balance) return "0.0000";
    return formatTokenBalanceFloor(balance.value, balance.decimals);
  }, [balance]);

  return {
    balance,
    formatted,
    isLoading,
    refetch,
    raw: balance?.value ?? BigInt(0),
  };
}

export function useSTokenBalance(accountAddress?: `0x${string}`) {
  const formatTokenBalanceFloor = (raw: bigint, decimals: number) => {
    if (raw === BigInt(0)) return "0";

    const base = BigInt(10) ** BigInt(decimals);
    const integerPart = raw / base;
    const remainder = raw % base;

    let fractionDigits = 6;
    if (integerPart > BigInt(0)) fractionDigits = 4;
    else {
      const twoDecimalBase = base / BigInt(10) ** BigInt(2);
      const fourDecimalBase = base / BigInt(10) ** BigInt(4);
      if (remainder >= twoDecimalBase) fractionDigits = 5;
      else if (remainder >= fourDecimalBase) fractionDigits = 6;
    }
    let scaled = (remainder * BigInt(10) ** BigInt(fractionDigits)) / base;
    if (
      scaled === BigInt(0) &&
      remainder > BigInt(0) &&
      fractionDigits < Math.min(decimals, 6)
    ) {
      fractionDigits = Math.min(decimals, 6);
      scaled = (remainder * BigInt(10) ** BigInt(fractionDigits)) / base;
    }

    const whole = Number(integerPart).toLocaleString("en-US");
    const padded = scaled.toString().padStart(fractionDigits, "0");
    let fraction = padded.replace(/0+$/, "");

    if (fraction === "" && remainder > BigInt(0)) {
      fraction = "0".repeat(fractionDigits);
    }

    return fraction ? `${whole}.${fraction}` : whole;
  };
  const { address: wagmiAddress } = useAccount();
  const address = accountAddress || wagmiAddress;

  // Get sToken address from SuperCluster
  const { data: sTokenAddress } = useReadContract({
    address: CONTRACTS.superCluster,
    abi: [
      {
        type: "function",
        name: "sToken",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "", type: "address" }],
      },
    ] as const,
    functionName: "sToken",
  });

  // Get decimals
  const { data: decimals } = useReadContract({
    address: sTokenAddress,
    abi: STOKEN_ABI,
    functionName: "decimals",
    query: {
      enabled: Boolean(sTokenAddress),
    },
  });

  // Get balance
  const { data: rawBalance, refetch } = useReadContract({
    address: sTokenAddress,
    abi: STOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address && sTokenAddress),
      refetchInterval: 10000,
    },
  });

  const formatted = useMemo(() => {
    if (!rawBalance || decimals == null) return "0.0000";
    return formatTokenBalanceFloor(rawBalance, decimals);
  }, [rawBalance, decimals]);

  return {
    balance: rawBalance ?? BigInt(0),
    formatted,
    decimals: decimals ?? TOKEN_DECIMALS.SUSDC,
    sTokenAddress,
    refetch,
  };
}

export function useWsTokenBalance(accountAddress?: `0x${string}`) {
  const formatTokenBalanceFloor = (raw: bigint, decimals: number) => {
    if (raw === BigInt(0)) return "0";

    const base = BigInt(10) ** BigInt(decimals);
    const integerPart = raw / base;
    const remainder = raw % base;

    let fractionDigits = 6;
    if (integerPart > BigInt(0)) fractionDigits = 4;
    else {
      const twoDecimalBase = base / BigInt(10) ** BigInt(2);
      const fourDecimalBase = base / BigInt(10) ** BigInt(4);
      if (remainder >= twoDecimalBase) fractionDigits = 5;
      else if (remainder >= fourDecimalBase) fractionDigits = 6;
    }
    let scaled = (remainder * BigInt(10) ** BigInt(fractionDigits)) / base;
    if (
      scaled === BigInt(0) &&
      remainder > BigInt(0) &&
      fractionDigits < Math.min(decimals, 6)
    ) {
      fractionDigits = Math.min(decimals, 6);
      scaled = (remainder * BigInt(10) ** BigInt(fractionDigits)) / base;
    }

    const whole = Number(integerPart).toLocaleString("en-US");
    const padded = scaled.toString().padStart(fractionDigits, "0");
    let fraction = padded.replace(/0+$/, "");

    if (fraction === "" && remainder > BigInt(0)) {
      fraction = "0".repeat(fractionDigits);
    }

    return fraction ? `${whole}.${fraction}` : whole;
  };

  const { address: wagmiAddress } = useAccount();
  const address = accountAddress || wagmiAddress;

  // Get decimals
  const { data: decimals } = useReadContract({
    address: CONTRACTS.wsToken,
    abi: WSTOKEN_ABI,
    functionName: "decimals",
  });

  // Get balance
  const { data: rawBalance, refetch } = useReadContract({
    address: CONTRACTS.wsToken,
    abi: WSTOKEN_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address),
      refetchInterval: 10000,
    },
  });

  // Get conversion rate (stTokenPerWsToken)
  const { data: conversionRate } = useReadContract({
    address: CONTRACTS.wsToken,
    abi: WSTOKEN_ABI,
    functionName: "stTokenPerWsToken",
    query: {
      refetchInterval: 10000,
    },
  });

  const formatted = useMemo(() => {
    if (!rawBalance || decimals == null) return "0.0000";
    return formatTokenBalanceFloor(rawBalance, decimals);
  }, [rawBalance, decimals]);

  const formattedConversionRate = useMemo(() => {
    if (!conversionRate || decimals == null) return "1.0000";
    return formatTokenBalanceFloor(conversionRate, decimals);
  }, [conversionRate, decimals]);

  return {
    balance: rawBalance ?? BigInt(0),
    formatted,
    decimals: decimals ?? TOKEN_DECIMALS.SUSDC,
    conversionRate: conversionRate ?? BigInt(0),
    formattedConversionRate,
    refetch,
  };
}

// New hook for withdrawal balances
export function useWithdrawalBalances(accountAddress?: `0x${string}`) {
  const formatTokenBalanceFloor = (raw: bigint, decimals: number) => {
    if (raw === BigInt(0)) return "0";

    const base = BigInt(10) ** BigInt(decimals);
    const integerPart = raw / base;
    const remainder = raw % base;

    let fractionDigits = 6;
    if (integerPart > BigInt(0)) fractionDigits = 4;
    else {
      const twoDecimalBase = base / BigInt(10) ** BigInt(2);
      const fourDecimalBase = base / BigInt(10) ** BigInt(4);
      if (remainder >= twoDecimalBase) fractionDigits = 5;
      else if (remainder >= fourDecimalBase) fractionDigits = 6;
    }
    let scaled = (remainder * BigInt(10) ** BigInt(fractionDigits)) / base;
    if (
      scaled === BigInt(0) &&
      remainder > BigInt(0) &&
      fractionDigits < Math.min(decimals, 6)
    ) {
      fractionDigits = Math.min(decimals, 6);
      scaled = (remainder * BigInt(10) ** BigInt(fractionDigits)) / base;
    }

    const whole = Number(integerPart).toLocaleString("en-US");
    const padded = scaled.toString().padStart(fractionDigits, "0");
    let fraction = padded.replace(/0+$/, "");

    if (fraction === "" && remainder > BigInt(0)) {
      fraction = "0".repeat(fractionDigits);
    }

    return fraction ? `${whole}.${fraction}` : whole;
  };

  const { address: wagmiAddress } = useAccount();
  const address = accountAddress || wagmiAddress;

  // USDC wallet balance
  const { data: usdcBalance, refetch: refetchUSDC } = useBalance({
    address,
    token: CONTRACTS.mockUSDC,
    query: {
      enabled: Boolean(address),
      refetchInterval: 10000,
    },
  });

  // sToken balance
  const {
    formatted: sTokenFormatted,
    balance: sTokenBalance,
    refetch: refetchSToken,
  } = useSTokenBalance(address);

  const usdcFormatted = useMemo(() => {
    if (!usdcBalance) return "0";
    return formatTokenBalanceFloor(usdcBalance.value, usdcBalance.decimals);
  }, [usdcBalance]);

  const refetchAll = async () => {
    await Promise.all([refetchUSDC(), refetchSToken()]);
  };

  return {
    usdcBalance: usdcBalance?.value ?? BigInt(0),
    usdcFormatted,
    sTokenBalance,
    sTokenFormatted,
    refetchUSDC,
    refetchSToken,
    refetchAll,
  };
}
