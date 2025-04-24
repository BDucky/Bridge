// src/components/PhantomConnectButton.tsx
import { Button } from "@/components/ui/button";
import { connectPhantom } from "@/lib/solana";
import { useState } from "react";
import phantomIcon from "@/assets/icons/phantom/Phantom-Icon_Transparent_Purple.svg";

export function PhantomConnectButton() {
  const [address, setAddress] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      const addr = await connectPhantom();
      setAddress(addr);
    } catch (err) {
      console.error(err);
      alert("Phantom not detected or failed to connect");
    }
  };

  return (
    <Button onClick={handleConnect} className="flex items-center justify-center gap-2 p-4 h-12 min-w-[200px]">
      <img src={phantomIcon} alt="Phantom" className="w-6 h-6 object-contain" />
      {address ? `Connected: ${address.slice(0, 6)}...` : "Connect Phantom"}
    </Button>
  );
}
