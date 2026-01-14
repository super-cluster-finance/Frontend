import { Button } from "@/components/ui/button";

interface ButtonState {
  disabled: boolean;
  text: string;
}

interface ActionButtonProps {
  buttonState: ButtonState;
  isConnecting: boolean;
  onWrap: () => Promise<void>;
  onConnect: () => Promise<void>;
  isConnected: boolean;
}

export default function ActionButton({
  buttonState,
  isConnecting,
  onWrap,
  onConnect,
  isConnected,
}: ActionButtonProps) {
  return (
    <>
      {isConnected ? (
        <Button
          onClick={onWrap}
          disabled={buttonState.disabled}
          className="w-full px-4 py-2 h-14 primary-button cursor-pointer text-white font-medium text-sm rounded transition-all duration-300 disabled:opacity-50"
        >
          {buttonState.text}
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
