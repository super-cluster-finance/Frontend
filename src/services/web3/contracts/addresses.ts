import { Address } from "viem";

const requiredAddresses = {
  SUPERCLUSTER_ADDRESS: process.env.NEXT_PUBLIC_SUPERCLUSTER_ADDRESS,
  PILOT_ADDRESS: process.env.NEXT_PUBLIC_PILOT_ADDRESS,
  MOCK_USDC_ADDRESS: process.env.NEXT_PUBLIC_MOCK_USDC_ADDRESS,
  FAUCET_ADDRESS: process.env.NEXT_PUBLIC_FAUCET_ADDRESS,
  WITHDRAW_MANAGER_ADDRESS: process.env.NEXT_PUBLIC_WITHDRAW_MANAGER_ADDRESS,
  STOKEN_ADDRESS: process.env.NEXT_PUBLIC_STOKEN_ADDRESS,
  WSTOKEN_ADDRESS: process.env.NEXT_PUBLIC_WSTOKEN_ADDRESS,
};

// Check for missing addresses
const missingAddresses = Object.entries(requiredAddresses)
  .filter(([, value]) => !value)
  .map(([key]) => `NEXT_PUBLIC_${key}`);

if (missingAddresses.length > 0) {
  throw new Error(
    `Missing required contract addresses: ${missingAddresses.join(", ")}`
  );
}

// Testnet - Primary network
export const CONTRACTS = {
  superCluster: process.env.NEXT_PUBLIC_SUPERCLUSTER_ADDRESS as Address,
  pilot: process.env.NEXT_PUBLIC_PILOT_ADDRESS as Address,
  mockUSDC: process.env.NEXT_PUBLIC_MOCK_USDC_ADDRESS as Address,
  faucet: process.env.NEXT_PUBLIC_FAUCET_ADDRESS as Address,
  withdrawManager: process.env.NEXT_PUBLIC_WITHDRAW_MANAGER_ADDRESS as Address,
  sToken: process.env.NEXT_PUBLIC_STOKEN_ADDRESS as Address,
  wsToken: process.env.NEXT_PUBLIC_WSTOKEN_ADDRESS as Address,
} as const;

export const TOKEN_DECIMALS = {
  USDC: 18,
  SUSDC: 18,
  WSUSDC: 18,
} as const;

// Current Chain ID from env
export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "");

// Helper function - simplified
export function getContractAddress(
  contractName: keyof typeof CONTRACTS
): Address {
  return CONTRACTS[contractName];
}

// Validation helpers
export function isCorrectChain(chainId: number | undefined): boolean {
  console.log("🔍 Chain validation:", {
    userChainId: chainId,
    expectedChainId: CHAIN_ID,
    isValid: chainId === CHAIN_ID,
    env: process.env.NEXT_PUBLIC_CHAIN_ID,
  });
  return chainId === CHAIN_ID;
}

export function isSupportedChain(chainId: number | undefined): boolean {
  return isCorrectChain(chainId);
}

// Network info
export const NETWORK_INFO = {
  name: process.env.NEXT_PUBLIC_CHAIN_NAME || "",
  chainId: CHAIN_ID,
  currency: "ETH",
  rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || "",
  explorer: process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL || "",
} as const;
