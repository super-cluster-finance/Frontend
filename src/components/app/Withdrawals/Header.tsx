interface WithdrawHeaderProps {
  activeTab: string;
}

export default function WithdrawHeader({ activeTab }: WithdrawHeaderProps) {
  return (
    <div className="text-center mb-12 relative">
      <h1 className="text-2xl md:text-4xl mb-2">
        {activeTab === "claim" ? "Claim Withdrawals" : "Request Withdrawals"}
      </h1>
      <p className="text-md text-slate-400 max-w-2xl mx-auto mb-8">
        {activeTab === "claim"
          ? "View and claim your withdrawal requests"
          : "Submit withdrawal requests for your staked tokens"}
      </p>
    </div>
  );
}
