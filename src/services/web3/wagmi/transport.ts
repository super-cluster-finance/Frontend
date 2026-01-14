import { http } from "wagmi";

/**
 * Get RPC URL with proxy for production
 * Uses /api/rpc in production to avoid CORS issues
 */
export function getRpcUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_RPC_URL || "";

  // Server-side: always use direct RPC
  if (typeof window === "undefined") {
    return baseUrl;
  }

  // Client-side: use proxy in production
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  if (isLocalhost) {
    return baseUrl;
  }

  // Production: use full URL to proxy
  return `${window.location.origin}/api/rpc`;
}

/**
 * Create HTTP transport with dynamic RPC URL
 */
export function createTransport() {
  return http(getRpcUrl());
}
