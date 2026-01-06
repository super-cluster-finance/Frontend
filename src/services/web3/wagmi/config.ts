import { createConfig, http } from "wagmi";
import { walletConnect, injected, coinbaseWallet } from "wagmi/connectors";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import type { Chain } from "viem";
import { getRpcUrl } from "./transport";

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;
if (!projectId) {
  throw new Error("NEXT_PUBLIC_PROJECT_ID is not set");
}

// Dynamic chain configuration from environment variables
const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "");
const chainName = process.env.NEXT_PUBLIC_CHAIN_NAME || "";
const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "";
const blockExplorerName = process.env.NEXT_PUBLIC_BLOCK_EXPLORER_NAME || "";
const blockExplorerUrl = process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL || "";

// Simple RPC URL - let the client handle it dynamically
export const defaultChain = {
  id: chainId,
  name: chainName,
  nativeCurrency: {
    name: process.env.NEXT_PUBLIC_NETWORK_NAME || "",
    symbol: process.env.NEXT_PUBLIC_CURRENCY || "",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: [rpcUrl] },
    public: { http: [rpcUrl] },
  },
  blockExplorers: {
    default: {
      name: blockExplorerName,
      url: blockExplorerUrl,
    },
  },
  testnet: true,
} as const satisfies Chain;

export const config = createConfig({
  chains: [defaultChain],
  connectors: [
    injected(),
    walletConnect({ projectId }),
    coinbaseWallet({ appName: "SuperCluster" }),
  ],
  transports: {
    [defaultChain.id]: http(getRpcUrl()),
  },
});

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  defaultChain: defaultChain,
  themeVariables: {
    "--w3m-accent": "#3b82f6",
  },
});

export { projectId };
