"use client";

import React, { useCallback } from "react";
import {
  ReactFlow,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Position,
  Handle,
  Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Custom Node Component

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

const initialNodes = [
  // Root node
  {
    id: "root",
    position: { x: 0, y: 180 },
    data: { label: "SuperCluster", description: "Liquid Stablecoin Savings" },
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
  // Deposit branch
  {
    id: "deposit",
    position: { x: 250, y: 10 },
    data: { label: "Deposit", description: "Stake your assets" },
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
    id: "usdc",
    position: { x: 500, y: -15 },
    data: { label: "USDC" },
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
    id: "idrx",
    position: { x: 500, y: 30 },
    data: { label: "IDRX" },
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
  // Earn Yield branch
  {
    id: "earn",
    position: { x: 250, y: 125 },
    data: { label: "Earn Yield", description: "Multi-protocol yields" },
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
    id: "init",
    position: { x: 500, y: 75 },
    data: { label: "Init" },
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
    id: "compound",
    position: { x: 500, y: 125 },
    data: { label: "Compound" },
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
    id: "dolomite",
    position: { x: 500, y: 175 },
    data: { label: "Dolomite" },
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
  // DeFi Composability branch
  {
    id: "defi",
    position: { x: 250, y: 245 },
    data: { label: "DeFi Composability", description: "Wrap & compose" },
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
    id: "wrap",
    position: { x: 500, y: 220 },
    data: { label: "Wrap Tokens" },
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
    id: "pilot",
    position: { x: 500, y: 265 },
    data: { label: "Pilot Strategy" },
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
  // Withdraw branch
  {
    id: "withdraw",
    position: { x: 250, y: 350 },
    data: { label: "Withdraw", description: "Request or claim" },
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
    id: "request",
    position: { x: 500, y: 325 },
    data: { label: "Request" },
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
    id: "claim",
    position: { x: 500, y: 370 },
    data: { label: "Instant Claim" },
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
];

const initialEdges = [
  // Root to main branches
  {
    id: "e-root-deposit",
    source: "root",
    target: "deposit",
    animated: true,
    style: { stroke: "#0b84ba", strokeWidth: 2 },
  },
  {
    id: "e-root-earn",
    source: "root",
    target: "earn",
    animated: true,
    style: { stroke: "#0b84ba", strokeWidth: 2 },
  },
  {
    id: "e-root-defi",
    source: "root",
    target: "defi",
    animated: true,
    style: { stroke: "#0b84ba", strokeWidth: 2 },
  },
  {
    id: "e-root-withdraw",
    source: "root",
    target: "withdraw",
    animated: true,
    style: { stroke: "#0b84ba", strokeWidth: 2 },
  },

  // Deposit sub-branches
  {
    id: "e-deposit-usdc",
    source: "deposit",
    target: "usdc",
    animated: true,
    style: { stroke: "#0b84ba", strokeOpacity: 2 },
  },
  {
    id: "e-deposit-idrx",
    source: "deposit",
    target: "idrx",
    animated: true,
    style: { stroke: "#0b84ba", strokeOpacity: 2 },
  },
  // Earn sub-branches
  {
    id: "e-earn-init",
    source: "earn",
    target: "init",
    animated: true,
    style: { stroke: "#0b84ba", strokeOpacity: 2 },
  },
  {
    id: "e-earn-compound",
    source: "earn",
    target: "compound",
    animated: true,
    style: { stroke: "#0b84ba", strokeOpacity: 2 },
  },
  {
    id: "e-earn-dolomite",
    source: "earn",
    target: "dolomite",
    animated: true,
    style: { stroke: "#0b84ba", strokeOpacity: 2 },
  },

  // DeFi sub-branches
  {
    id: "e-defi-wrap",
    source: "defi",
    target: "wrap",
    animated: true,
    style: { stroke: "#0b84ba", strokeOpacity: 2 },
  },
  {
    id: "e-defi-pilot",
    source: "defi",
    target: "pilot",
    animated: true,
    style: { stroke: "#0b84ba", strokeOpacity: 2 },
  },
  // Withdraw sub-branches
  {
    id: "e-withdraw-request",
    source: "withdraw",
    target: "request",
    animated: true,
    style: { stroke: "#0b84ba", strokeOpacity: 2 },
  },
  {
    id: "e-withdraw-claim",
    source: "withdraw",
    target: "claim",
    animated: true,
    style: { stroke: "#0b84ba", strokeOpacity: 2 },
  },
];

export default function MindMapSection() {
  const [nodes, _, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((els) => addEdge(params, els)),
    [setEdges]
  );

  const nodeTypes = {
    custom: CustomNode,
  };

  return (
    <section
      id="how-it-works"
      className="relative w-full py-16 sm:py-20 md:py-32 px-2 md:px-8"
    >
      <div className="max-w-7xl px-6 mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-3xl md:text-6xl font-normal text-slate-200 mb-4">
            Application <span className="text-[#0b84ba]">Flow Map</span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            SuperCluster seamlessly integrates deposit mechanisms, yield
            generation, DeFi composability, and flexible withdrawals into a
            unified protocol experience.
          </p>
        </div>

        {/* ReactFlow Container - Responsive */}
        <div className="relative w-full max-w-7xl mx-auto border border-slate-700 overflow-hidden rounded">
          <div className="h-[60vh] sm:h-[70vh] lg:h-[80vh] w-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
              zoomOnScroll={false}
              zoomOnDoubleClick={false}
              zoomOnPinch={true}
              panOnDrag={true}
              panOnScroll={false}
            >
              <Background />
            </ReactFlow>
          </div>
        </div>
      </div>
    </section>
  );
}
