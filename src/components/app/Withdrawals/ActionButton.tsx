import { Button } from "@/components/ui/button";

interface ActionButtonProps {
  isConnected: boolean;
  isConnecting: boolean;
  isSubmitting: boolean;
  amount: string;
  selectedMethod: "superCluster" | "dex";
  onWithdraw: () => Promise<void>;
  onConnect: () => Promise<void>;
}

export default function ActionButton({
  isConnected,
  isConnecting,
  isSubmitting,
  amount,
  selectedMethod,
  onWithdraw,
  onConnect,
}: ActionButtonProps) {
  return (
    <>
      {isConnected ? (
        <Button
          onClick={onWithdraw}
          disabled={
            isSubmitting ||
            !amount ||
            Number(amount.trim()) <= 0 ||
            selectedMethod !== "superCluster"
          }
          className="w-full px-4 py-2 h-14 primary-button cursor-pointer text-white font-medium text-sm rounded transition-all duration-300 disabled:opacity-50"
        >
          {isSubmitting ? "Processing..." : "Request Withdrawal"}
        </Button>
      ) : (
        <Button
          onClick={onConnect}
          disabled={isConnecting}
          className="w-full px-4 py-2 h-14 primary-button cursor-pointer text-white font-medium text-sm rounded transition-all duration-300 disabled:opacity-50"
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      )}
    </>
  );
}
