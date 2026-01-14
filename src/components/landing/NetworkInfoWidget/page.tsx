"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, ExternalLink, Droplets, X } from "lucide-react";
import Link from "next/link";
import { useNetworkInfo } from "@/contexts/NetworkInfoContext";

export default function NetworkInfoWidget() {
  const { isOpen, setIsOpen } = useNetworkInfo();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollPositionRef = useRef(0);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      scrollPositionRef.current = window.pageYOffset;

      // Lock body scroll
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPositionRef.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
    } else {
      // Restore body scroll
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";

      // Restore scroll position
      window.scrollTo(0, scrollPositionRef.current);
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const networkInfo = [
    {
      label: "Network",
      value: process.env.NEXT_PUBLIC_NETWORK_NAME || "",
      icon: Network,
    },
    {
      label: "Chain ID",
      value: process.env.NEXT_PUBLIC_CHAIN_ID || "",
      copyable: true,
    },
    {
      label: "Currency",
      value: process.env.NEXT_PUBLIC_CURRENCY || "",
    },
    {
      label: "RPC URL",
      value: process.env.NEXT_PUBLIC_RPC_URL || "",
      copyable: true,
    },
  ];

  const quickLinks = [
    {
      name: "Block Explorer",
      url: process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL || "",
      icon: ExternalLink,
    },
    {
      name: "Get Test Tokens",
      url: "/app/faucet",
      icon: Droplets,
      internal: true,
    },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 2 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-8 z-40 w-12 h-12 md:w-14 md:h-14 bg-[#0b84ba] hover:bg-[#0b84ba]/80 rounded-full shadow-lg flex items-center justify-center transition-all group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Network className="w-6 h-6 text-white" />

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="bg-black/90 text-white text-xs px-3 py-2 rounded whitespace-nowrap">
            Network Info
          </div>
        </div>

        {/* Pulse Animation */}
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 bg-[#0b84ba] rounded-full"
        />
      </motion.button>

      {/* Sidebar Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/30 z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white/10 backdrop-blur-2xl border-l border-white/10 z-50 flex flex-col"
            >
              {/* Content - Scrollable */}
              <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto p-6 space-y-6"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onScroll={(e) => e.stopPropagation()}
              >
                {/* Network Details */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 mb-3">
                    Network Details
                  </h4>
                  <div className="space-y-3">
                    {networkInfo.map((info) => (
                      <div
                        key={info.label}
                        className="bg-white/5 border border-white/10 rounded p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-400">
                              {info.label}
                            </span>
                          </div>
                          {info.copyable && (
                            <button
                              onClick={() => handleCopy(info.value)}
                              className="text-xs text-[#0b84ba] hover:text-[#0b84ba]/80 transition-colors"
                            >
                              Copy
                            </button>
                          )}
                        </div>
                        <p className="text-gray-200 font-mono text-sm mt-1 break-all">
                          {info.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Links */}
                <div>
                  <h4 className="text-sm font-semibold text-slate-400 mb-3">
                    Quick Links
                  </h4>
                  <div className="space-y-2">
                    {quickLinks.map((link) => {
                      const LinkComponent = link.internal ? Link : "a";
                      return (
                        <LinkComponent
                          key={link.name}
                          href={link.url}
                          target={link.internal ? undefined : "_blank"}
                          rel={
                            link.internal ? undefined : "noopener noreferrer"
                          }
                          className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded hover:bg-white/10 hover:border-white/20 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8  rounded border border-white/20 flex items-center justify-center">
                              <link.icon className="w-4 h-4 text-gray-200" />
                            </div>
                            <span className="text-gray-200 font-normal">
                              {link.name}
                            </span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                        </LinkComponent>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
