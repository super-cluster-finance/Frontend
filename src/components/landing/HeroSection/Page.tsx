"use client";
import Geometri from "@/components/landing/Geometri";
import Link from "next/link";
import { useNetworkInfo } from "@/contexts/NetworkInfoContext";
import { motion, AnimatePresence } from "framer-motion";

export default function HeroSection() {
  const { isOpen } = useNetworkInfo();

  return (
    <>
      <section id="hero">
        <Geometri>
          <div className="relative h-[80vh] max-w-7xl mx-auto">
            <AnimatePresence>
              {!isOpen && (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {/* Total Value Locked - Kanan Atas */}
                  <div className="absolute top-3 md:top-6 right-4 md:right-6 text-right">
                    <p className="text-sm md:text-lg text-slate-400 mb-1">
                      TVL*
                    </p>
                    <h3 className="text-lg md:text-2xl font-bold text-[#0b84ba]">
                      $22,203,123,87
                    </h3>
                  </div>

                  {/* Main Content - Center */}
                  <div className="flex flex-col justify-center items-center h-full text-center px-4 md:px-4">
                    <span className="text-gray-400 text-sm md:text-base md:flex hidden ">
                      Decentralized liquid stablecoin savings protocol with
                      auto-compounding yields and full DeFi composability
                    </span>
                    <h1 className="text-3xl md:text-5xl max-w-full md:max-w-4xl font-normal text-gray-300">
                      Optimized yield for stablecoin holders Designed for
                      performance and risk control
                    </h1>
                  </div>

                  {/* Active Positions - Kiri Bawah */}
                  <div className="absolute bottom-3 md:bottom-6 left-4 md:left-6 text-left">
                    <p className="text-sm md:text-lg text-slate-400 mb-1">
                      APR*
                    </p>
                    <h3 className="text-lg md:text-2xl font-bold text-[#0b84ba]">
                      12.34%
                    </h3>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Geometri>
      </section>
      <section
        id="about"
        className="py-12 flex items-center justify-center"
      ></section>
      <section className="py-20 flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 rounded border border-slate-700 p-8 md:p-12 gap-12 w-full">
            <div className="flex flex-col justify-center items-start w-full">
              <h1 className="text-3xl md:text-6xl font-normal text-slate-200">
                Liquid <span className="text-[#0b84ba]">Stablecoin</span>
                <br />
                <span className="text-slate-200">Savings Protocol</span>
              </h1>

              <p className="text-lg md:text-lg text-start text-slate-400 max-w-3xl mb-12 mt-4">
                Earn yields on your USDC while maintaining full liquidity and
                composability across DeFi ecosystems
              </p>

              <div className="flex flex-col w-full sm:flex-row gap-3 sm:gap-4 mb-12 lg:mb-16">
                <Link
                  href="/app/deposit"
                  target="_blank"
                  className="w-full sm:w-auto flex items-center font-medium justify-center primary-button text-white px-6 py-3 md:text-lg text-sm rounded transition-all"
                >
                  Deposit Now
                </Link>
                <Link
                  href={`${process.env.NEXT_PUBLIC_DOCUMENTATION_URL || "#"}`}
                  target="_blank"
                  className="w-full sm:w-auto flex items-center justify-center border border-white/10 bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white px-6 py-3 md:text-lg text-sm font-normal rounded transition-all"
                >
                  Read Documentation
                </Link>
              </div>
            </div>
            <div className="flex items-center border border-slate-700 bg-black rounded justify-center md:justify-center">
              <img
                src="/icons/about.png"
                alt="USDC Logo"
                className="w-64 h-auto md:w-[500px] md:h-auto opacity-80"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
