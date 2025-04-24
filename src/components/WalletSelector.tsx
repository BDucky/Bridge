import React from "react";
import MetaMaskLogo from "@metamask/logo";
import phantomIcon from "@/assets/icons/phantom/Phantom-Icon_Transparent_Purple.svg";
import { useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { connectPhantom } from "@/lib/solana";
import { useCallback } from "react";

interface WalletOption {
  label: string;
  value: 'metamask' | 'phantom';
  icon: React.ReactNode;
  chain: string;
}

const WALLET_OPTIONS: WalletOption[] = [
  {
    label: 'MetaMask',
    value: 'metamask',
    icon: <span style={{display:'inline-block',width:24,height:24}} ref={(el) => {
      if (el && typeof window !== 'undefined') {
        el.innerHTML = '';
        const viewer = MetaMaskLogo({ pxNotRatio: true, width: 24, height: 24, followMouse: false });
        el.appendChild(viewer.container);
      }
    }} />,
    chain: 'Ethereum',
  },
  {
    label: 'Phantom',
    value: 'phantom',
    icon: <img src={phantomIcon} alt="Phantom" className="w-6 h-6 object-contain" />,
    chain: 'Solana',
  },
];

interface WalletSelectorProps {
  onSelect: (value: 'metamask' | 'phantom') => void;
  onConnected?: () => void;
}

export function WalletSelector({ onSelect, onConnected }: WalletSelectorProps) {
  const { connectAsync } = useConnect();

  const handleConnect = useCallback(async (value: 'metamask' | 'phantom') => {
    onSelect(value);
    if (value === 'metamask') {
      try {
        await connectAsync({ connector: injected() });
      } catch (err) {
        console.error("MetaMask connection error:", err);
      }
    } else if (value === 'phantom') {
      try {
        await connectPhantom();
      } catch (err) {
        alert("Phantom not detected or failed to connect");
      }
    }
    if (onConnected) onConnected();
  }, [connectAsync, onSelect, onConnected]);

  return (
    <div className="space-y-3">
      <div className="font-bold text-lg mb-2 text-center text-white">Select Wallet</div>
      {WALLET_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-black/70 border border-purple-800 hover:bg-purple-900/70 transition-colors text-white font-medium shadow"
          onClick={() => handleConnect(opt.value)}
        >
          {opt.icon}
          <span>{opt.label}</span>
          <span className="ml-auto text-xs text-purple-300">{opt.chain}</span>
        </button>
      ))}
    </div>
  );
}
