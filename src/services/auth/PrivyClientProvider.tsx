"use client";

import React, { useEffect, useState } from "react";
import { PrivyProvider } from "@privy-io/react-auth";

type Props = {
  children: React.ReactNode;
};

export default function PrivyClientProvider({ children }: Props) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const chainId = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "");
  const chainName = process.env.NEXT_PUBLIC_CHAIN_NAME || "";
  const chainNetwork = process.env.NEXT_PUBLIC_CHAIN_NETWORK || "";
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "";
  const blockExplorerName = process.env.NEXT_PUBLIC_BLOCK_EXPLORER_NAME || "";
  const blockExplorerUrl = process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL || "";

  // Use proxy in production to avoid CORS
  const isProduction =
    typeof window !== "undefined" && window.location.hostname !== "localhost";
  const effectiveRpcUrl = isProduction
    ? `${window.location.origin}/api/rpc`
    : rpcUrl;

  // Validation
  if (!isClient) {
    return <>{children}</>;
  }

  if (!appId) {
    console.error(
      "NEXT_PUBLIC_PRIVY_APP_ID is not set in environment variables"
    );
    return <>{children}</>;
  }

  const chainConfig = {
    id: chainId,
    name: chainName,
    network: chainNetwork,
    nativeCurrency: {
      name: process.env.NEXT_PUBLIC_NETWORK_NAME || "",
      symbol: process.env.NEXT_PUBLIC_CURRENCY || "",
      decimals: 18,
    },
    rpcUrls: {
      default: { http: [effectiveRpcUrl] },
      public: { http: [effectiveRpcUrl] },
    },
    blockExplorers: {
      default: {
        name: blockExplorerName,
        url: blockExplorerUrl,
      },
    },
    testnet: true,
  } as const;

  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ["google"],
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
        },
        defaultChain: chainConfig,
        supportedChains: [chainConfig],
        appearance: {
          theme: "dark",
          accentColor: "#3b82f6",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
