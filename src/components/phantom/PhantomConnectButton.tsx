// src/components/PhantomConnectButton.tsx
import { Button } from "@/components/ui/button";
import { connectPhantom } from "@/lib/solana";
import { useState, useRef, useEffect } from "react";
import phantomIcon from "@/assets/icons/phantom/Phantom-Icon_Transparent_Purple.svg";

export function PhantomConnectButton() {
  const [address, setAddress] = useState<string | null>(null);
  const iconRef = useRef<HTMLImageElement>(null);

  // Add floating effect to the Phantom icon
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!iconRef.current) return;
      const btn = iconRef.current.closest("button");
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Move the icon slightly based on cursor inside the button
      const moveX = ((x - rect.width / 2) / rect.width) * 12;
      const moveY = ((y - rect.height / 2) / rect.height) * 12;
      iconRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };
    const btn = iconRef.current?.closest("button");
    if (btn) {
      btn.addEventListener("mousemove", handleMove);
      btn.addEventListener("mouseleave", () => {
        if (iconRef.current) iconRef.current.style.transform = "translate(0,0)";
      });
    }
    return () => {
      if (btn) {
        btn.removeEventListener("mousemove", handleMove);
        btn.removeEventListener("mouseleave", () => {
          if (iconRef.current) iconRef.current.style.transform = "translate(0,0)";
        });
      }
    };
  }, []);

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
    <Button onClick={handleConnect} className="flex items-center justify-center gap-2 p-4 h-12 min-w-[200px] phantom-btn">
      <img ref={iconRef} src={phantomIcon} alt="Phantom" className="w-6 h-6 object-contain transition-transform duration-200" />
      {address ? `Connected: ${address.slice(0, 6)}...` : "Connect Phantom"}
    </Button>
  );
}
