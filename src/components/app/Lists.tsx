import React from "react";

export interface AssetListItemProps {
  icon?: React.ReactNode;
  name: string;
  duration: string;
  apy: string;
  apyLabel?: string;
}

export function AssetListItem({
  icon,
  name,
  duration,
  apy,
  apyLabel = "fixed APY",
}: AssetListItemProps) {
  return (
    <div className="py-2 px-4 rounded bg-gray-500/10">
      <div className="flex flex-row justify-between mx-auto">
        <div className="flex flex-row gap-1 items-center justify-start">
          <div className="flex flex-row gap-2">
            {icon}
            <h1 className="font-semibold">{name}</h1>
          </div>
          <p className="text-xs text-white/60">{duration}</p>
        </div>
        <div className="flex flex-row gap-1 items-center justify-start">
          <h1 className="font-semibold text-blue-500">{apy}</h1>
          <p className="text-xs text-white/60">{apyLabel}</p>
        </div>
      </div>
    </div>
  );
}

export interface AssetListProps {
  items: AssetListItemProps[];
}

export function AssetList({ items }: AssetListProps) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item, idx) => (
        <AssetListItem key={idx} {...item} />
      ))}
    </div>
  );
}
