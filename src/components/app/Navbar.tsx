"use client";
import { usePathname } from "next/navigation";
import { Navbar, NavLink } from "@/components/app/AssetNavbar";
import { Rocket, UploadCloud, WrapText, Wallet, Droplet } from "lucide-react";

export default function AppNavbar() {
  const pathname = usePathname();
  const links: NavLink[] = [
    {
      name: "Pilot",
      href: "/app/pilot",
      active: pathname === "/app/pilot",
      icon: Rocket,
    },
    {
      name: "Deposit",
      href: "/app/deposit",
      active: pathname === "/app/deposit",
      icon: UploadCloud,
    },
    {
      name: "Wrap",
      href: "/app/wrap",
      active: pathname.startsWith("/app/wrap"),
      icon: WrapText,
    },
    {
      name: "Withdrawals",
      href: "/app/withdraw/request",
      active: pathname.startsWith("/app/withdraw"),
      icon: Wallet,
    },
    {
      name: "Faucet",
      href: "/app/faucet",
      active: pathname === "/app/faucet",
      icon: Droplet,
    },
  ];
  return <Navbar links={links} />;
}
