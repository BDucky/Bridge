import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from './lib/evm';
import { WalletStatusCard } from './components/WalletStatusCard';
import { useEffect, useState } from 'react';
import './App.css'
import WalletIcon from '@/assets/icons/wallet.svg'; // Use a generic wallet icon or create one
import { Modal } from './components/ui/Modal';
import { WalletSelector } from './components/WalletSelector';

function Stars() {
  useEffect(() => {
    const count = 80;
    const container = document.getElementById('stars');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const star = document.createElement('div');
      star.className = 'galaxy-star';
      star.style.top = Math.random() * 100 + 'vh';
      star.style.left = Math.random() * 100 + 'vw';
      star.style.animationDuration = (1.5 + Math.random()) + 's';
      container.appendChild(star);
    }
  }, []);
  return <div id="stars" className="stars" />;
}

function App() {
  const [walletType, setWalletType] = useState<'metamask' | 'phantom' | null>(null);
  const [selectorOpen, setSelectorOpen] = useState(false);

  return (
    <WagmiProvider config={wagmiConfig}>
      <Stars />
      {/* Top Navigation Bar */}
      <header className="w-full flex items-center justify-between px-8 py-4 fixed top-0 left-0 z-10 bg-gradient-to-b from-black/70 to-transparent">
        <div className="flex items-center gap-2">
          <img src={WalletIcon} alt="Wallet" className="w-7 h-7" />
          <span className="text-xl font-bold tracking-wide text-white drop-shadow">Bridge App</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectorOpen(true)}
            className="rounded-lg px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold flex items-center gap-2 shadow border border-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect width="20" height="20" rx="5" fill="#fff" fillOpacity="0.12"/><path d="M6 8.5A2.5 2.5 0 0 1 8.5 6h3A2.5 2.5 0 0 1 14 8.5v3A2.5 2.5 0 0 1 11.5 14h-3A2.5 2.5 0 0 1 6 11.5v-3Z" fill="#a78bfa"/><circle cx="12.5" cy="10" r="1" fill="#a78bfa"/></svg>
            {walletType ? (walletType === 'metamask' ? 'MetaMask' : 'Phantom') : 'Connect Wallet'}
          </button>
        </div>
      </header>
      {/* Wallet Selector Modal */}
      <Modal open={selectorOpen} onClose={() => setSelectorOpen(false)}>
        <WalletSelector onSelect={(value) => {
          setWalletType(value);
          setSelectorOpen(false);
        }} onConnected={() => setSelectorOpen(false)} />
      </Modal>
      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-screen pt-32 pb-12">
        <WalletStatusCard />
        {/* Placeholder for future bridge functionality */}
        <div className="mt-12 text-lg text-purple-200/70 italic opacity-80">Main bridge features coming soon...</div>
      </main>
    </WagmiProvider>
  );
}

export default App;