"use client";
import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export type SortField = "name" | "markets";
export type SortDirection = "asc" | "desc" | null;

export function AssetTableHeader({
  sortField,
  sortDirection,
  onSort,
}: {
  sortField: SortField | null;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
}) {
  const SortHeader = ({
    label,
    field,
  }: {
    label: string;
    field: SortField;
  }) => {
    const getIcon = () => {
      if (sortField !== field)
        return <ArrowUpDown className="w-3 h-3 ml-1 opacity-40" />;
      if (sortDirection === "asc") return <ArrowUp className="w-3 h-3 ml-1" />;
      return <ArrowDown className="w-3 h-3 ml-1" />;
    };

    return (
      <div
        className="flex items-center cursor-pointer text-gray-400 hover:text-gray-200 transition"
        onClick={() => onSort(field)}
      >
        <span className="text-xs font-semibold uppercase">{label}</span>
        {getIcon()}
      </div>
    );
  };

  return (
    <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_auto] px-6 py-4 bg-black/20 border border-white/10 rounded">
      <SortHeader label="Asset Name" field="name" />
      <SortHeader label="Markets" field="markets" />
      <div className="text-xs font-semibold uppercase text-slate-400">
        Actions
      </div>
    </div>
  );
}
