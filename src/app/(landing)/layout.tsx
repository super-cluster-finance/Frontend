import type { Metadata } from "next";
import LandingNavbar from "@/components/landing/Navbar";
import Footer from "@/components/Footer";
import { NetworkInfoProvider } from "@/contexts/NetworkInfoContext";

export const metadata: Metadata = {
  title: "SuperCluster - Liquid Stablecoin Savings Protocol",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NetworkInfoProvider>
      <LandingNavbar />
      <main className="w-full min-h-screen">{children}</main>
      <Footer />
    </NetworkInfoProvider>
  );
}
