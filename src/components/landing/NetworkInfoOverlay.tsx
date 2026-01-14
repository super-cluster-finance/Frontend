"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNetworkInfo } from "@/contexts/NetworkInfoContext";
import TrueFocus from "./TrueFocus";

export default function NetworkInfoOverlay() {
  const { isOpen } = useNetworkInfo();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 flex flex-col justify-center items-start z-30 pointer-events-none"
        >
          {/* Title dengan TrueFocus Effect */}
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-normal text-white w-full max-w-7xl mx-auto mb-6 px-4 text-start"
          >
            Network Information{" "}
            <span className="text-[#0b84ba]">
              <TrueFocus
                sentence="Super Cluster"
                manualMode={false}
                blurAmount={5}
                borderColor="none"
                animationDuration={2}
                pauseBetweenAnimations={1}
              />
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-300 w-full max-w-7xl mx-auto px-4 text-start"
          >
            Explore detailed information about the Super Cluster network,
            including RPC endpoints, <br /> chain ID, and quick access to
            essential tools and resources.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
