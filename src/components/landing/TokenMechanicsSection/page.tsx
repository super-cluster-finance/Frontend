"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ReactFlow, Background, Position, Handle } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

/* =========================
   TYPES & DATA
========================= */
type TokenType = "sUSDC" | "wsUSDC";

interface TokenData {
  id: TokenType;
  title: string;
  image: string;
  shortDesc: string;
  fullDesc: string;
  nodes: Array<{
    id: string;
    position: { x: number; y: number };
    data: { label: string; description?: string };
    type: string;
    style: Record<string, string | number>;
    sourcePosition: Position;
    targetPosition: Position;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    animated: boolean;
    style: Record<string, string | number>;
  }>;
}

const CustomNode = ({
  data,
}: {
  data: { label: string; description?: string };
}) => (
  <div style={{ textAlign: "center", minWidth: "140px" }}>
    <div style={{ fontWeight: "600", fontSize: "12px", minHeight: "16px" }}>
      {data.label}
    </div>
    {data.description && (
      <div
        style={{
          fontSize: "9px",
          opacity: 0.8,
          marginTop: "2px",
          fontWeight: "400",
          minHeight: "14px",
        }}
      >
        {data.description}
      </div>
    )}
    <Handle type="target" position={Position.Left} />
    <Handle type="source" position={Position.Right} />
  </div>
);

const nodeDefaults = {
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  type: "custom",
};

const nodeTypes = {
  custom: CustomNode,
};

/* =========================
   TOKEN DATA
========================= */
const tokensData: TokenData[] = [
  {
    id: "sUSDC",
    title: "sUSDC - Liquid Savings Token",
    image: "/icons/sUSDC-Overflow.png",
    shortDesc: "Rebasing token that auto-compounds yield in your wallet",
    fullDesc:
      "sUSDC is a rebasing token that represents your staked USDC in the SuperCluster protocol. Your balance automatically increases as yield accrues, providing a seamless savings experience without manual claims.",
    nodes: [
      {
        id: "sToken-root",
        position: { x: 0, y: 150 },
        data: { label: "sUSDC", description: "Liquid Savings Token" },
        ...nodeDefaults,
        style: {
          background: "#1e293b",
          border: "2px solid #0b84ba",
          borderRadius: "8px",
          padding: "10px 15px",
          fontSize: "12px",
          fontWeight: "600",
          color: "#ffffff",
          minWidth: "140px",
        },
      },
      {
        id: "deposit-stoken",
        position: { x: 250, y: 50 },
        data: { label: "Deposit USDC", description: "1:1 mint ratio" },
        ...nodeDefaults,
        style: {
          background: "#1e293b",
          border: "2px solid #0b84ba",
          borderRadius: "8px",
          padding: "10px 15px",
          fontSize: "11px",
          fontWeight: "600",
          color: "#ffffff",
          minWidth: "140px",
        },
      },
      {
        id: "rebase",
        position: { x: 250, y: 150 },
        data: { label: "Auto Rebase", description: "Balance increases" },
        ...nodeDefaults,
        style: {
          background: "#1e293b",
          border: "2px solid #0b84ba",
          borderRadius: "8px",
          padding: "10px 15px",
          fontSize: "11px",
          fontWeight: "600",
          color: "#ffffff",
          minWidth: "140px",
        },
      },
      {
        id: "yield-stoken",
        position: { x: 500, y: 120 },
        data: { label: "Yield Sources" },
        ...nodeDefaults,
        style: {
          background: "#1e293b",
          border: "1px solid #0b84ba",
          borderRadius: "6px",
          padding: "8px 12px",
          fontSize: "10px",
          color: "#e0e7ff",
          minWidth: "140px",
        },
      },
      {
        id: "balance",
        position: { x: 500, y: 170 },
        data: { label: "Balance Growth" },
        ...nodeDefaults,
        style: {
          background: "#1e293b",
          border: "1px solid #0b84ba",
          borderRadius: "6px",
          padding: "8px 12px",
          fontSize: "10px",
          color: "#e0e7ff",
          minWidth: "140px",
        },
      },
      {
        id: "withdraw-stoken",
        position: { x: 250, y: 250 },
        data: { label: "Withdraw", description: "Burn sUSDC" },
        ...nodeDefaults,
        style: {
          background: "#1e293b",
          border: "2px solid #0b84ba",
          borderRadius: "8px",
          padding: "10px 15px",
          fontSize: "11px",
          fontWeight: "600",
          color: "#ffffff",
          minWidth: "140px",
        },
      },
    ],
    edges: [
      {
        id: "e-root-deposit",
        source: "sToken-root",
        target: "deposit-stoken",
        animated: true,
        style: { stroke: "#0b84ba", strokeWidth: 2 },
      },
      {
        id: "e-root-rebase",
        source: "sToken-root",
        target: "rebase",
        animated: true,
        style: { stroke: "#0b84ba", strokeWidth: 2 },
      },
      {
        id: "e-rebase-yield",
        source: "rebase",
        target: "yield-stoken",
        animated: true,
        style: { stroke: "#0b84ba", strokeOpacity: 2 },
      },
      {
        id: "e-rebase-balance",
        source: "rebase",
        target: "balance",
        animated: true,
        style: { stroke: "#0b84ba", strokeOpacity: 2 },
      },
      {
        id: "e-root-withdraw",
        source: "sToken-root",
        target: "withdraw-stoken",
        animated: true,
        style: { stroke: "#0b84ba", strokeWidth: 2 },
      },
    ],
  },
  {
    id: "wsUSDC",
    title: "wsUSDC - Wrapped Savings Token",
    image: "/icons/wsUSDC-Overflow.png",
    shortDesc: "Fixed balance token optimized for DeFi integrations",
    fullDesc:
      "wsUSDC is a wrapped version of sUSDC with a fixed balance that increases in value over time. Perfect for DeFi protocols requiring predictable token amounts, it maintains full yield exposure through an exchange rate mechanism.",
    nodes: [
      {
        id: "wsToken-root",
        position: { x: 0, y: 150 },
        data: { label: "wsUSDC", description: "Wrapped Savings Token" },
        ...nodeDefaults,
        style: {
          background: "#1e293b",
          border: "2px solid #0b84ba",
          borderRadius: "8px",
          padding: "10px 15px",
          fontSize: "12px",
          fontWeight: "600",
          color: "#ffffff",
          minWidth: "140px",
        },
      },
      {
        id: "wrap",
        position: { x: 250, y: 50 },
        data: { label: "Wrap sUSDC", description: "Lock balance" },
        ...nodeDefaults,
        style: {
          background: "#1e293b",
          border: "2px solid #0b84ba",
          borderRadius: "8px",
          padding: "10px 15px",
          fontSize: "11px",
          fontWeight: "600",
          color: "#ffffff",
          minWidth: "140px",
        },
      },
      {
        id: "rate",
        position: { x: 250, y: 150 },
        data: { label: "Exchange Rate", description: "Value increases" },
        ...nodeDefaults,
        style: {
          background: "#1e293b",
          border: "2px solid #0b84ba",
          borderRadius: "8px",
          padding: "10px 15px",
          fontSize: "11px",
          fontWeight: "600",
          color: "#ffffff",
          minWidth: "140px",
        },
      },
      {
        id: "defi-comp",
        position: { x: 500, y: 80 },
        data: { label: "Lending/Borrowing" },
        ...nodeDefaults,
        style: {
          background: "#1e293b",
          border: "1px solid #0b84ba",
          borderRadius: "6px",
          padding: "8px 12px",
          fontSize: "10px",
          color: "#e0e7ff",
          minWidth: "140px",
        },
      },
      {
        id: "lp",
        position: { x: 500, y: 130 },
        data: { label: "Liquidity Pools" },
        ...nodeDefaults,
        style: {
          background: "#1e293b",
          border: "1px solid #0b84ba",
          borderRadius: "6px",
          padding: "8px 12px",
          fontSize: "10px",
          color: "#e0e7ff",
          minWidth: "140px",
        },
      },
      {
        id: "collateral",
        position: { x: 500, y: 180 },
        data: { label: "Collateral" },
        ...nodeDefaults,
        style: {
          background: "#1e293b",
          border: "1px solid #0b84ba",
          borderRadius: "6px",
          padding: "8px 12px",
          fontSize: "10px",
          color: "#e0e7ff",
          minWidth: "140px",
        },
      },
      {
        id: "unwrap",
        position: { x: 250, y: 250 },
        data: { label: "Unwrap", description: "Get sUSDC back" },
        ...nodeDefaults,
        style: {
          background: "#1e293b",
          border: "2px solid #0b84ba",
          borderRadius: "8px",
          padding: "10px 15px",
          fontSize: "11px",
          fontWeight: "600",
          color: "#ffffff",
          minWidth: "140px",
        },
      },
    ],
    edges: [
      {
        id: "e-root-wrap",
        source: "wsToken-root",
        target: "wrap",
        animated: true,
        style: { stroke: "#0b84ba", strokeWidth: 2 },
      },
      {
        id: "e-root-rate",
        source: "wsToken-root",
        target: "rate",
        animated: true,
        style: { stroke: "#0b84ba", strokeWidth: 2 },
      },
      {
        id: "e-wrap-defi",
        source: "wrap",
        target: "defi-comp",
        animated: true,
        style: { stroke: "#0b84ba", strokeOpacity: 2 },
      },
      {
        id: "e-wrap-lp",
        source: "wrap",
        target: "lp",
        animated: true,
        style: { stroke: "#0b84ba", strokeOpacity: 2 },
      },
      {
        id: "e-wrap-collateral",
        source: "wrap",
        target: "collateral",
        animated: true,
        style: { stroke: "#0b84ba", strokeOpacity: 2 },
      },
      {
        id: "e-root-unwrap",
        source: "wsToken-root",
        target: "unwrap",
        animated: true,
        style: { stroke: "#0b84ba", strokeWidth: 2 },
      },
    ],
  },
];

/* =========================
   MAIN COMPONENT
========================= */
export default function TokenMechanicsSection() {
  const [activeToken, setActiveToken] = useState<TokenType>("sUSDC");
  const currentData = tokensData.find((t) => t.id === activeToken)!;

  return (
    <section id="token-mechanics" className="w-full py-32 ">
      <div className="mx-auto 2xl:max-w-9/12 max-w-full md:px-0 px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-6xl text-white mb-4">
            Token <span className="text-[#0b84ba]">Mechanics</span>
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto text-base md:text-lg">
            Understand the unique functionalities of sUSDC and wsUSDC, and how
            they optimize yield and DeFi integration for stablecoin holders.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* LEFT: Image & Short Description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`left-${activeToken}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6 flex flex-col border border-slate-700 rounded max-w-full justify-center items-center h-full"
            >
              {/* Token Image */}
              <div className="relative w-full aspect-square max-w-sm mx-auto rounded p-8 flex items-center justify-center overflow-hidden">
                <Image
                  src={currentData.image}
                  alt={currentData.title}
                  width={300}
                  height={300}
                  className="object-contain opacity-80"
                />
              </div>

              {/* Short Description Card */}
              <div className="bg-none p-6 max-w-full md:max-w-xl flex-grow rounded">
                <h3 className="text-xl md:text-2xl text-gray-200 mb-3 font-normal">
                  {currentData.title}
                </h3>
                <p className="text-[#0b84ba] text-lg font-normal mb-4">
                  {currentData.shortDesc}
                </p>
                <p className="text-gray-400 text-base leading-relaxed">
                  {currentData.fullDesc}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* RIGHT: Tab Menu & Detailed Mechanics */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`right-${activeToken}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6 flex flex-col h-full"
            >
              {/* Tab Menu */}
              <div className="flex gap-4">
                {tokensData.map((token) => (
                  <button
                    key={token.id}
                    onClick={() => setActiveToken(token.id)}
                    className={`
                px-8 py-3 rounded cursor-pointer font-medium text-sm transition-all
                ${
                  activeToken === token.id
                    ? "bg-[#0b84ba] text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10 border border-slate-700"
                }
              `}
                  >
                    {token.id}
                  </button>
                ))}
              </div>

              {/* Detailed Mechanics */}
              <div className="md:border md:border-slate-700 rounded p-0 md:p-6 flex-grow">
                <h4 className="text-xl md:text-2xl text-gray-200 mb-4 font-normal">
                  How It Works
                </h4>
                <div className="space-y-3">
                  {activeToken === "sUSDC" ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-3 border border-slate-700 w-full h-44 rounded p-4">
                          <span className="text-gray-100 text-2xl font-normal">
                            01
                          </span>
                          <p className="text-gray-400 text-sm">
                            Deposit USDC and receive sUSDC at a 1:1 ratio
                          </p>
                        </div>

                        <div className="flex flex-col gap-3 border border-slate-700 w-full h-44 rounded p-4">
                          <span className="text-gray-100 text-2xl font-normal">
                            02
                          </span>
                          <p className="text-gray-400 text-sm">
                            sUSDC balance automatically increases through
                            rebasing as yield compounds
                          </p>
                        </div>

                        <div className="flex flex-col gap-3 border border-slate-700 w-full h-44 rounded p-4">
                          <span className="text-gray-100 text-2xl font-normal">
                            03
                          </span>
                          <p className="text-gray-400 text-sm">
                            Transfer, use, or withdraw anytime yield keeps
                            growing
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-3 border border-slate-700 w-full h-44 rounded p-4">
                          <span className="text-gray-100 text-2xl font-normal">
                            01
                          </span>
                          <p className="text-gray-400 text-sm">
                            Wrap sUSDC into wsUSDC - balance stays fixed
                          </p>
                        </div>

                        <div className="flex flex-col gap-3 border border-slate-700 w-full h-44 rounded p-4">
                          <span className="text-gray-100 text-2xl font-normal">
                            02
                          </span>
                          <p className="text-gray-400 text-sm">
                            Exchange rate increases over time, reflecting
                            accrued yield
                          </p>
                        </div>

                        <div className="flex flex-col gap-3 border border-slate-700 w-full h-44 rounded p-4">
                          <span className="text-gray-100 text-2xl font-normal">
                            03
                          </span>
                          <p className="text-gray-400 text-sm">
                            Use in DeFi protocols, then unwrap to claim your
                            rewards
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Mind Map */}
              <div className="bg-black border border-slate-700 rounded overflow-hidden">
                <div className="h-100">
                  <ReactFlow
                    nodes={currentData.nodes}
                    edges={currentData.edges}
                    nodeTypes={nodeTypes}
                    fitView
                    fitViewOptions={{ padding: 0.2 }}
                    attributionPosition="bottom-right"
                    proOptions={{ hideAttribution: true }}
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={false}
                    panOnDrag={false}
                    zoomOnScroll={false}
                    zoomOnPinch={false}
                  >
                    <Background color="#0b84ba" gap={16} size={1} />
                  </ReactFlow>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
