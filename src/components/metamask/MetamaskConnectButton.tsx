import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
// @ts-ignore
import MetamaskLogo from "@metamask/logo";

export function MetaMaskConnectButton() {
  const { isConnected, address } = useAccount();
  const { connectAsync } = useConnect();
  const { disconnect } = useDisconnect();
  const logoRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    if (!logoRef.current) return;
    // Remove all children to avoid duplication
    logoRef.current.innerHTML = "";
    viewerRef.current = MetamaskLogo({
      pxNotRatio: true,
      width: 64, // Render at 64 for clarity
      height: 64,
      followMouse: true,
      slowDrift: false,
    });
    logoRef.current.appendChild(viewerRef.current.container);
    viewerRef.current.setFollowMouse(true);

    // Scale up the canvas to visually match Phantom icon
    const canvas = logoRef.current.querySelector('canvas');
    if (canvas) {
      canvas.style.transform = 'scale(1.35)';
      canvas.style.transformOrigin = 'center';
    }

    // Slow down the head movement by patching the lookAt method
    const origLookAt = viewerRef.current.lookAt;
    let current = { x: 0, y: 0 };
    let animFrame: number;
    viewerRef.current.lookAt = (target: { x: number; y: number }) => {
      cancelAnimationFrame(animFrame);
      const animate = () => {
        current.x += (target.x - current.x) * 0.035;
        current.y += (target.y - current.y) * 0.035;
        origLookAt(current);
        if (Math.abs(target.x - current.x) > 0.5 || Math.abs(target.y - current.y) > 0.5) {
          animFrame = requestAnimationFrame(animate);
        }
      };
      animate();
    };

    // Add floating effect for MetaMask icon on hover
    const handleMove = (e: MouseEvent) => {
      if (!logoRef.current) return;
      const btn = logoRef.current.closest("button");
      if (!btn) return;
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const moveX = ((x - rect.width / 2) / rect.width) * 12;
      const moveY = ((y - rect.height / 2) / rect.height) * 12;
      logoRef.current.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };
    const btn = logoRef.current.closest("button");
    if (btn) {
      btn.addEventListener("mousemove", handleMove);
      btn.addEventListener("mouseleave", () => {
        if (logoRef.current) logoRef.current.style.transform = "translate(0,0)";
      });
    }
    return () => {
      if (viewerRef.current) {
        viewerRef.current.stopAnimation();
        if (logoRef.current?.contains(viewerRef.current.container)) {
          logoRef.current.removeChild(viewerRef.current.container);
        }
        viewerRef.current = null;
      }
      if (btn) {
        btn.removeEventListener("mousemove", handleMove);
        btn.removeEventListener("mouseleave", () => {
          if (logoRef.current) logoRef.current.style.transform = "translate(0,0)";
        });
      }
    };
  }, []);

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
    <Button onClick={handleClick} className="flex items-center justify-center gap-2 p-4 h-12 min-w-[200px] relative overflow-hidden metamask-btn">
      <span ref={logoRef} style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", position: 'relative', zIndex: 1, marginLeft: '-0.25rem', transition: 'transform 0.2s' }} />
      {isConnected
        ? `Disconnect (${address?.slice(0, 6)}...)`
        : "Connect MetaMask"}
    </Button>
  );
}
