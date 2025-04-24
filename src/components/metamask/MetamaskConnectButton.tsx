import metamaskIcon from "@/assets/icons/metamask/MetaMask-icon-fox.svg";
import { Button } from "@/components/ui/button";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

export function MetaMaskConnectButton() {
  const { isConnected, address } = useAccount();
  const { connectAsync } = useConnect();
  const { disconnect } = useDisconnect();

  const handleClick = async () => {
    if (isConnected) {
      disconnect();
    } else {
      try {
        await connectAsync({ connector: injected() });
      } catch (err) {
        console.error("MetaMask connection error:", err);
      }
    }
  };

  return (
    <Button onClick={handleClick} className="flex items-center justify-center gap-2 p-4 h-12 min-w-[200px]">
      <img src={metamaskIcon} alt="MetaMask" className="w-6 h-6 object-contain" />
      {isConnected
        ? `Disconnect (${address?.slice(0, 6)}...)`
        : "Connect MetaMask"}
    </Button>
  );
}
