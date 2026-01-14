import type { Metadata } from "next";
import AppNavbar from "@/components/app/Navbar";
import WagmiProviderComp from "@/services/web3/wagmi/provider";
import { headers } from "next/headers";
import { cookieToInitialState } from "wagmi";
import { config } from "@/services/web3/wagmi/config";
import Footer from "@/components/Footer";
import PrivyClientProvider from "@/services/auth/PrivyClientProvider";

export const metadata: Metadata = {
  title: "SuperCluster App - DeFi Dashboard",
  description: "Manage your stablecoin savings and DeFi positions",
};

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const initialState = cookieToInitialState(config, headersList.get("cookie"));

  return (
    <WagmiProviderComp initialState={initialState}>
      <PrivyClientProvider>
        <AppNavbar />
        <main className="w-full min-h-screen max-w-7xl mx-auto px-4">
          {children}
        </main>
        <Footer />
      </PrivyClientProvider>
    </WagmiProviderComp>
  );
}
