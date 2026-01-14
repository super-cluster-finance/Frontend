"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PilotAsset } from "@/services/web3/contracts/types";
import { AssetModal } from "@/components/app/Modal";
import {
  AssetTableHeader,
  SortField,
  SortDirection,
} from "@/components/app/Pilot/TableComponents/TableHeader";
import {
  AssetRowDesktop,
  AssetCardMobile,
} from "@/components/app/Pilot/TableComponents/TableRow";
import { MarketList } from "@/components/app/MarketList";

interface AssetTableProps {
  assets: PilotAsset[];
  expandedAssets: string[];
  toggleAssetExpansion: (assetId: string) => void;
  selectedPilotId?: string;
  onSelectPilot?: (asset: PilotAsset) => void;
}

export function AssetTable({
  assets,
  expandedAssets,
  toggleAssetExpansion,
  selectedPilotId,
  onSelectPilot,
}: AssetTableProps) {
  const [selectedAsset, setSelectedAsset] = useState<PilotAsset | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (field: SortField) => {
    setSortDirection(
      sortField === field
        ? sortDirection === "asc"
          ? "desc"
          : sortDirection === "desc"
          ? null
          : "asc"
        : "asc"
    );

    setSortField(
      sortField === field && sortDirection === "desc" ? null : field
    );
  };

  const openModal = (a: PilotAsset) => {
    setSelectedAsset(a);
    setModalOpen(true);
  };

  const sortedAssets = [...assets].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;

    let valA: string | number;
    let valB: string | number;

    if (sortField === "name") {
      valA = a.name.toLowerCase();
      valB = b.name.toLowerCase();
    } else {
      valA = a.marketsCount;
      valB = b.marketsCount;
    }

    if (valA < valB) return sortDirection === "asc" ? -1 : 1;
    if (valA > valB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <>
      <div className="space-y-2 p-2 bg-white/10 rounded border border-white/10">
        <AssetTableHeader
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />

        {sortedAssets.map((asset) => {
          const disabled = !asset.isactive;
          const isExpanded = expandedAssets.includes(asset.id);

          return (
            <div key={asset.id} className="space-y-2">
              <AssetRowDesktop
                asset={asset}
                isSelected={selectedPilotId === asset.id}
                isExpanded={isExpanded}
                disabled={disabled}
                onSelect={() => onSelectPilot?.(asset)}
                onExpand={() => toggleAssetExpansion(asset.id)}
                onOpenModal={() => openModal(asset)}
              />
              <AssetCardMobile
                asset={asset}
                isSelected={selectedPilotId === asset.id}
                isExpanded={isExpanded}
                disabled={disabled}
                onSelect={() => onSelectPilot?.(asset)}
                onExpand={() => toggleAssetExpansion(asset.id)}
                onOpenModal={() => openModal(asset)}
              />
              {isExpanded && <MarketList markets={asset.markets ?? []} />}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedAsset && (
        <AssetModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <ModalContent
            asset={selectedAsset}
            onSelect={() => {
              if (selectedAsset.isactive) {
                onSelectPilot?.(selectedAsset);
                setModalOpen(false);
              }
            }}
            onClose={() => setModalOpen(false)}
          />
        </AssetModal>
      )}
    </>
  );
}

interface ModalContentProps {
  asset: PilotAsset;
  onSelect: () => void;
  onClose: () => void;
}

function ModalContent({ asset, onSelect, onClose }: ModalContentProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex gap-4">
        <div className="flex items-center justify-center">
          <Image
            src={asset.logo}
            alt={asset.name}
            width={64}
            height={64}
            className="object-contain"
          />
        </div>

        <div>
          <div className="flex gap-2">
            <h3 className="text-lg text-gray-200 font-medium">{asset.name}</h3>
          </div>

          <p className="text-gray-400 text-sm">{asset.description}</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4">
        <ModalStat label="Symbol" value={asset.symbol} />
        <ModalStat label="Chain" value={asset.chain} />
        <ModalStat label="Category" value={asset.category} />
        <ModalStat
          label="Status"
          value={asset.status}
          accent={asset.isactive}
        />
        <ModalStat
          label="Total Liquidity"
          value={`$${(asset.totalLiquidity / 1e6).toFixed(2)}M`}
        />
        <ModalStat label="Best APY" value={`${asset.bestFixedAPY}%`} accent />
      </div>

      {/* Focus */}
      <div className="bg-white/5 border border-white/10 rounded p-4">
        <div className="text-slate-400 text-xs mb-2">Strategy Focus</div>
        <div className="text-sm text-gray-200">{asset.focus}</div>
      </div>

      {/* Address */}
      <div className="bg-white/5 border border-white/10 rounded p-4">
        <div className="text-slate-400 text-xs mb-2">Contract Address</div>
        <div className="text-xs text-gray-200 font-mono break-all">
          {asset.address}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <Link href="/app/deposit" className="flex-1">
          <button
            disabled={!asset.isactive}
            onClick={onSelect}
            className={`w-full py-3 rounded text-sm font-medium transition
            ${
              asset.isactive
                ? "bg-[#0b84ba] hover:bg-[#0b84ba]/80 cursor-pointer text-white"
                : "bg-white/5 text-slate-500 cursor-not-allowed border border-white/10"
            }`}
          >
            {asset.isactive ? "Select Pilot" : "Pilot Inactive"}
          </button>
        </Link>

        <button
          onClick={onClose}
          className="flex-1 bg-white/5 hover:bg-white/10 border text-sm cursor-pointer border-white/10 py-3 rounded font-medium text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}

interface ModalStatProps {
  label: string;
  value: string | number;
  accent?: boolean;
}

function ModalStat({ label, value, accent }: ModalStatProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded p-4">
      <div className="text-gray-400 text-xs uppercase">{label}</div>
      <div
        className={` ${accent ? "text-[#0b84ba]" : "text-gray-200 text-sm"}`}
      >
        {value}
      </div>
    </div>
  );
}
