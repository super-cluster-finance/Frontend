import { Address } from "viem";

export type SupportedChainId = 1 | 11155111 | 8453 | 84532;

export type ContractName =
  | "superCluster"
  | "pilot"
  | "mockUSDC"
  | "faucet"
  | "withdrawManager"
  | "sToken"
  | "wsToken";

export interface StakeParams {
  pilot: Address;
  token: Address;
  amount: bigint;
}

export interface WithdrawParams {
  token: Address;
  amount: bigint;
}

export interface TokenBalance {
  value: bigint;
  decimals: number;
  formatted: string;
  symbol: string;
}

export interface StakingStats {
  totalStaked: string;
  activeStakers: string;
  apr: string;
  marketCap: string;
}

export interface Market {
  id: string;
  name: string;
  tvl: string;
  apy: string;
}

export interface PilotAsset {
  id: string;
  name: string;
  symbol: string;
  chain: string;
  logo: string;
  pools: number;
  bestFixedAPY: number;
  isactive: boolean;
  marketsCount: number;
  category: string;
  totalLiquidity: number;
  focus: string;
  address: string;
  status: string;
  description: string;
  markets: Market[];
}
