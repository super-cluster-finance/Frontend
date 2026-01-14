"use client";
import React from "react";

export function StatsGrid({
  stats,
}: {
  stats: { totalStaked: string; stakers: string; marketCap: string };
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white/10 border border-white/10 rounded p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm text-slate-400">Total Staked</span>
        </div>
        <p className="text-2xl font-medium text-slate-200">
          {stats.totalStaked}
        </p>
      </div>
      <div className="bg-white/10 border border-white/10 rounded p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm text-slate-400">Active Stakers</span>
        </div>
        <p className="text-2xl font-medium text-slate-200">{stats.stakers}</p>
      </div>
      <div className="bg-white/10 border border-white/10 rounded p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm text-slate-400">Market Cap</span>
        </div>
        <p className="text-2xl font-medium text-slate-200">{stats.marketCap}</p>
      </div>
    </div>
  );
}
