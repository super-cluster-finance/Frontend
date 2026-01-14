"use client";
import React, { useState, useEffect } from "react";
import { Wallet, Menu, X, Clipboard, ExternalLink, Power } from "lucide-react";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useDisconnect } from "wagmi";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePrivy } from "@privy-io/react-auth";
import LoginButton from "./LoginButton";

export interface NavLink {
  name: string;
  href: string;
  active?: boolean;
  icon?: React.ElementType;
  dropdown?: {
    label: string;
    items: { name: string; href: string; icon?: React.ElementType }[];
  };
}

interface NavbarProps {
  links: NavLink[];
}

export function Navbar({ links }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { open } = useWeb3Modal();
  const { address, isConnected, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const { user, authenticated, logout } = usePrivy();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const update = () => {
        const current = window.scrollY;

        setScrolled(current > 10);

        if (current > lastScrollY && current > 100) {
          setVisible(false);
        } else {
          setVisible(true);
        }

        setLastScrollY(current);
        ticking = false;
      };

      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleConnect = async () => {
    try {
      await open();
    } catch (error) {
      console.error("Wallet connection error:", error);
    }
  };

  return (
    <>
      <nav
        className={`sticky top-0 left-0 w-full z-50 transition-all duration-600 ${
          scrolled ? "backdrop-blur-xl " : "bg-transparent"
        } ${visible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Left Section: Logo + Menu */}
            <div className="flex items-center gap-8">
              {/* Logo */}
              <div className="flex items-center gap-2 group">
                <Image src="/logo1.png" alt="Logo" width={60} height={60} />
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-6">
                {links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative px-1 py-2 text-sm font-medium uppercase transition-colors ${
                      link.active
                        ? "text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {link.icon &&
                        React.createElement(link.icon, {
                          className: "w-4 h-4",
                        })}
                      <span>{link.name}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Section: Connect Wallet + Mobile Menu */}
            <div className="flex items-center gap-3">
              {/* Connect Wallet - Desktop */}
              {(isConnected && address) ||
              (authenticated && user?.wallet?.address) ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="hidden md:flex items-center cursor-pointer gap-2 px-4 py-3 primary-button rounded text-center font-medium text-white text-sm transition-all duration-300 outline-none">
                    {typeof window !== "undefined" && (
                      <span>
                        {formatAddress(address || user?.wallet?.address || "")}
                      </span>
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-black border border-white/20 p-4 rounded mt-2 min-w-[280px]">
                    <div className="px-4 py-3">
                      <p className="text-sm text-slate-400">Wallet Address</p>
                      <p className="text-sm text-slate-200 font-mono mt-1">
                        {formatAddress(address || user?.wallet?.address || "")}
                      </p>
                      {authenticated && user?.google?.email && (
                        <p className="text-xs text-slate-400 mt-2">
                          Google: {user.google.email}
                        </p>
                      )}
                    </div>
                    <DropdownMenuItem
                      onClick={() =>
                        navigator.clipboard.writeText(
                          address || user?.wallet?.address || ""
                        )
                      }
                      className="flex items-center gap-2 px-3 py-3 text-sm text-slate-200 hover:text-slate-100 hover:bg-white/20 border border-white/20 cursor-pointer transition-all duration-300 rounded m-1"
                    >
                      <Clipboard className="w-4 h-4" />
                      Copy Address
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        window.open(
                          `https://etherscan.io/address/${
                            address || user?.wallet?.address
                          }`,
                          "_blank"
                        )
                      }
                      className="flex items-center gap-2 px-3 py-3 text-sm text-slate-200 hover:text-slate-100 hover:bg-white/20 border border-white/20 cursor-pointer transition-all duration-300 rounded m-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Explorer
                    </DropdownMenuItem>
                    <div className="mt-1 pt-1">
                      {isConnected && (
                        <DropdownMenuItem
                          onClick={() => disconnect()}
                          className="flex items-center gap-2 px-3 py-3 border border-white/20 text-sm text-slate-200 hover:text-red-300 hover:bg-red-500/20 cursor-pointer transition-colors rounded m-1"
                        >
                          <Power className="w-4 h-4" />
                          Disconnect Wallet
                        </DropdownMenuItem>
                      )}
                      {authenticated && (
                        <DropdownMenuItem
                          onClick={() => logout()}
                          className="flex items-center gap-2 px-3 py-3 border border-white/20 text-sm text-slate-200 hover:text-red-300 hover:bg-red-500/20 cursor-pointer transition-colors rounded m-1"
                        >
                          <Power className="w-4 h-4" />
                          Logout Google
                        </DropdownMenuItem>
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="hidden md:flex items-center cursor-pointer justify-center px-4 py-3 primary-button rounded  text-center font-medium gap-1 text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Wallet className="w-4 h-4" />
                    {isConnecting ? "Connecting..." : "Connect Wallet"}
                  </button>
                  <div className="hidden md:block">
                    <LoginButton />
                  </div>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
                aria-label="Toggle menu"
              >
                {menuOpen ? (
                  <X className="w-6 h-6 text-white" />
                ) : (
                  <Menu className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-16 left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-slate-800 z-40"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
              {/* Mobile Navigation Links */}
              {links.map((link) =>
                link.dropdown ? (
                  <div key={link.name} className="space-y-2">
                    <div className="px-4 py-2 text-slate-300 font-medium flex items-center gap-2">
                      {link.icon &&
                        React.createElement(link.icon, {
                          className: "w-4 h-4",
                        })}
                      <span>{link.name}</span>
                    </div>
                    <div className="pl-4 space-y-1">
                      {link.dropdown.items.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMenuOpen(false)}
                          className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            {item.icon &&
                              React.createElement(item.icon, {
                                className: "w-4 h-4",
                              })}
                            <span>{item.name}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      {link.icon &&
                        React.createElement(link.icon, {
                          className: "w-4 h-4",
                        })}
                      <span>{link.name}</span>
                    </span>
                  </Link>
                )
              )}

              {/* Mobile Connect Section */}
              <div className="pt-3 border-t border-slate-800">
                {/* Check if EITHER wallet is connected OR Google is authenticated */}
                {(isConnected && address) ||
                (authenticated && user?.wallet?.address) ? (
                  <div className="space-y-2">
                    {/* Wallet Info */}
                    <div className="px-4 py-2.5 bg-slate-800/50 rounded-lg">
                      <p className="text-xs text-slate-400">
                        {isConnected ? "Wallet Connected" : "Google Wallet"}
                      </p>
                      <p className="text-sm text-white font-mono mt-1">
                        {formatAddress(address || user?.wallet?.address || "")}
                      </p>
                      {authenticated && user?.google?.email && (
                        <p className="text-xs text-slate-400 mt-2">
                          Google: {user.google.email}
                        </p>
                      )}
                    </div>

                    {/* Copy Address */}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          address || user?.wallet?.address || ""
                        );
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                    >
                      <Clipboard className="w-4 h-4" />
                      Copy Address
                    </button>

                    {/* View Explorer */}
                    <button
                      onClick={() => {
                        window.open(
                          `https://etherscan.io/address/${
                            address || user?.wallet?.address
                          }`,
                          "_blank"
                        );
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Explorer
                    </button>

                    {/* Disconnect Buttons */}
                    {isConnected && (
                      <button
                        onClick={() => {
                          disconnect();
                          setMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Power className="w-4 h-4" />
                        Disconnect Wallet
                      </button>
                    )}

                    {authenticated && (
                      <button
                        onClick={() => {
                          logout();
                          setMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Power className="w-4 h-4" />
                        Logout Google
                      </button>
                    )}
                  </div>
                ) : (
                  /* Show both buttons when not connected */
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        handleConnect();
                        setMenuOpen(false);
                      }}
                      disabled={isConnecting}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 primary-button rounded text-center font-medium text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Wallet className="w-4 h-4" />
                      {isConnecting ? "Connecting..." : "Connect Wallet"}
                    </button>

                    {/* Google Login Button with full width */}
                    <div className="">
                      <LoginButton />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
