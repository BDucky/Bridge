import { useAccount, useBalance, useChainId } from 'wagmi';
import { useEffect, useState } from 'react';
import type { SolanaProvider } from '@/lib/solana';

interface PhantomStatus {
  address: string | null;
  solBalance: number | null;
  network: string | null;
}

// Use the same SolanaProvider type as in lib/solana.ts
declare global {
  interface Window {
    solana?: SolanaProvider;
  }
}

function usePhantomStatus() {
  const [status, setStatus] = useState<PhantomStatus>({ address: null, solBalance: null, network: null });

  useEffect(() => {
    const getStatus = async () => {
      if (window.solana && window.solana.isPhantom && window.solana.publicKey) {
        const address = window.solana.publicKey.toString();
        let solBalance = null;
        let network = null;
        try {
          // Use Solana JSON RPC directly for balance
          const response = await fetch('https://api.mainnet-beta.solana.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: 1,
              method: 'getBalance',
              params: [address],
            })
          });
          const result = await response.json();
          solBalance = result.result?.value ? result.result.value / 1e9 : null;
          network = 'mainnet-beta';
        } catch {}
        setStatus({ address, solBalance, network });
      } else {
        setStatus({ address: null, solBalance: null, network: null });
      }
    };
    getStatus();
    const interval = setInterval(getStatus, 5000);
    return () => clearInterval(interval);
  }, []);
  return status;
}

export function WalletStatusCard() {
  // EVM
  const { isConnected, address } = useAccount();
  const { data: balanceData } = useBalance({ address });
  const chainId = useChainId();

  // Phantom
  const phantom = usePhantomStatus();

  if (!isConnected && !phantom.address) {
    return null; // Hide card if nothing connected
  }

  return (
    <div className="w-full max-w-xl bg-black/60 border border-purple-900 rounded-xl p-5 flex flex-col md:flex-row gap-6 shadow-lg">
      {/* EVM */}
      {isConnected && (
        <div className="flex-1 min-w-[220px]">
          <div className="text-purple-300 font-semibold mb-1">MetaMask (EVM)</div>
          <div className="text-xs opacity-70">Address:</div>
          <div className="break-all mb-1">{address}</div>
          <div className="text-xs opacity-70">Network:</div>
          <div className="mb-1">{chainId}</div>
          <div className="text-xs opacity-70">Balance:</div>
          <div>{balanceData ? `${balanceData.formatted} ${balanceData.symbol}` : '...'}</div>
        </div>
      )}
      {/* Divider */}
      {isConnected && phantom.address && (
        <div className="w-px bg-purple-800/30 mx-2" style={{minHeight: 80}} />
      )}
      {/* Phantom */}
      {phantom.address && (
        <div className="flex-1 min-w-[220px]">
          <div className="text-purple-400 font-semibold mb-1">Phantom (Solana)</div>
          <div className="text-xs opacity-70">Address:</div>
          <div className="break-all mb-1">{phantom.address}</div>
          <div className="text-xs opacity-70">Network:</div>
          <div className="mb-1">{phantom.network}</div>
          <div className="text-xs opacity-70">Balance:</div>
          <div>{phantom.solBalance !== null ? `${phantom.solBalance} SOL` : '...'}</div>
        </div>
      )}
    </div>
  );
}
