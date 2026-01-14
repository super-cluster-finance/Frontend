interface TabSelectorProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabSelector({
  activeTab,
  onTabChange,
}: TabSelectorProps) {
  return (
    <div className="relative mb-6">
      <div className="flex gap-2 p-1.5 bg-white/10 border border-white/10 rounded backdrop-blur-sm">
        <button
          onClick={() => onTabChange("wrap")}
          className={`flex-1 relative py-3 px-6 rounded font-medium text-sm transition-all duration-300 ${
            activeTab === "wrap"
              ? "text-white"
              : "text-slate-400 hover:text-white"
          }`}
        >
          {activeTab === "wrap" && (
            <div className="absolute inset-0 primary-button rounded"></div>
          )}
          <span className="relative z-10">Wrap sUSDC</span>
        </button>
        <button
          onClick={() => onTabChange("unwrap")}
          className={`flex-1 relative py-3 px-6 rounded font-medium text-sm transition-all duration-300 ${
            activeTab === "unwrap"
              ? "text-white"
              : "text-slate-400 hover:text-white"
          }`}
        >
          {activeTab === "unwrap" && (
            <div className="absolute inset-0 primary-button rounded"></div>
          )}
          <span className="relative z-10">Unwrap wsUSDC</span>
        </button>
      </div>
    </div>
  );
}
