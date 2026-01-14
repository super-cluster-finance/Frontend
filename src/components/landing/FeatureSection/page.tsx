"use client";
import React from "react";
import {
  Droplet,
  Puzzle,
  Gauge,
  ArrowDownToLine,
  LucideIcon,
} from "lucide-react";

export default function FeatureSection() {
  const cards: Array<{
    icon: LucideIcon;
    title: string;
    desc: string;
  }> = [
    {
      icon: Droplet,
      title: "Liquid Saving Tokens",
      desc: "Deposit USDC and mint sUSDC 1:1. Your yield auto-compounds through an increasing exchange rate and remains fully transferable and composable.",
    },
    {
      icon: Puzzle,
      title: "Smart Yield Adapters",
      desc: "Modular adapters connect SuperCluster to multiple lending markets, enabling diversified yield sources and seamless protocol integrations.",
    },
    {
      icon: Gauge,
      title: "Pilot Strategy Layer",
      desc: "A dynamic allocation engine that manages yield, liquidity, and risk across markets automatically optimizing your stablecoin portfolio.",
    },
    {
      icon: ArrowDownToLine,
      title: "Two-Step Withdrawal",
      desc: "Request withdrawals anytime while the protocol prepares liquidity from its positions. Claim once ready ensuring smooth redemptions even under high demand.",
    },
  ];

  return (
    <section id="features" className="flex items-center justify-center py-20">
      <div className="w-full max-w-7xl mx-auto px-4">
        {/* Title & Description */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-6xl mb-4 text-slate-200">
            Smarter Yield for Stablecoin Savers
          </h2>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={i}
                className="bg-[#0b84ba]/5 border border-slate-700 rounded p-6 flex flex-col justify-between hover:shadow-xl transition"
              >
                <div>
                  <div className="flex justify-center items-center h-32 mb-6">
                    <Icon
                      size={80}
                      className="text-[#0b84ba] stroke-[1.5]"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <h3 className="text-xl text-center font-medium mb-2">
                      {card.title}
                    </h3>
                    <p className="text-gray-400 text-center text-lg">
                      {card.desc}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
