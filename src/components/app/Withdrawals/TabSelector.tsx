interface TabSelectorProps {
  activeTab: string;
  onTabChange: (tab: "request" | "claim") => void;
}

export default function TabSelector({
  activeTab,
  onTabChange,
}: TabSelectorProps) {
  return (
    <div className="relative mb-6">
      <div className="flex gap-2 p-1.5 bg-white/10 border border-white/10 rounded backdrop-blur-sm">
        <button
          onClick={() => onTabChange("request")}
          className={`flex-1 relative py-3 px-6 rounded font-medium text-sm transition-all duration-300 ${
            activeTab === "request"
              ? "text-white"
              : "text-slate-400 hover:text-white"
          }`}
        >
          {activeTab === "request" && (
            <div className="absolute inset-0 primary-button rounded"></div>
          )}
          <span className="relative z-10">Request Withdrawal</span>
        </button>
        <button
          onClick={() => onTabChange("claim")}
          className={`flex-1 relative py-3 px-6 rounded font-medium text-sm transition-all duration-300 ${
            activeTab === "claim"
              ? "text-white"
              : "text-slate-400 hover:text-white"
          }`}
        >
          {activeTab === "claim" && (
            <div className="absolute inset-0 primary-button rounded"></div>
          )}
          <span className="relative z-10">Claim Withdrawals</span>
        </button>
      </div>
    </div>
  );
}
