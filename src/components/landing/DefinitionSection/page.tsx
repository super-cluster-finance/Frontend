"use client";

import React, { useEffect, useRef, useState } from "react";
import { RefreshCcw, ShieldCheck, TrendingUp } from "lucide-react";

export default function DefinitionSection() {
  const items = [
    {
      id: "stable",
      icon: <ShieldCheck className="w-8 h-8 text-[#0b84ba]" />,
      title: "Stable Principal",
      desc: "All deposits are in stablecoins. No market volatility deposit 1,000 USDC, retain 1,000 units.",
    },
    {
      id: "yield",
      icon: <TrendingUp className="w-8 h-8 text-[#0b84ba]" />,
      title: "Consistent Yield",
      desc: "Yield sourced from Morpho, Nusa, and Beefy through the Pilot Strategy Layer sustainable, predictable.",
    },
    {
      id: "liquidity",
      icon: <RefreshCcw className="w-8 h-8 text-[#0b84ba]" />,
      title: "Full Liquidity",
      desc: "Deposits mint sToken. They remain tradable, usable as collateral, LP-able, and wrappable (wsToken).",
    },
  ];

  const [, setActiveId] = useState("stable");
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const id = e.target.getAttribute("data-id")!;
            setActiveId(id);
          }
        });
      },
      { threshold: 0.5 }
    );

    refs.current.forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, []);

  return (
    <section id="core-principles" className="w-full py-32">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* LEFT SIDE */}
        <div className="lg:sticky lg:top-24 self-start">
          <h1 className="text-3xl md:text-6xl text-white mb-8">
            Core <span className="text-[#0b84ba]">Principles</span>
          </h1>

          <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
            SuperCluster is a DeFi Liquid Saving Protocol a stablecoin-based
            saving system enabling sustainable yield without losing liquidity or
            ownership, it brings these mechanisms to USDC and IDRX.
            <br />
            <br />
            Users earn passive yield, preserve stable principal, and maintain
            full liquidity across DeFi.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="relative pl-10">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-0 top-0 h-full w-[2px] bg-gradient-to-b from-[#0b84ba] to-transparent"></div>

          <div className="space-y-32">
            {items.map((item, i) => (
              <div
                key={i}
                data-id={item.id}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className="relative bg-white/5 p-6 rounded border border-slate-700"
              >
                {/* icon bubble */}
                <div className="absolute -left-[52px] md:-left-[4.3rem] top-0 bg-white/5 backdrop-blur-xl p-3 rounded-full border border-white/20 shadow-lg">
                  {item.icon}
                </div>

                <h3 className="text-2xl md:text-4xl text-white mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
