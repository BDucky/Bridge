import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from './lib/evm';
import { MetaMaskConnectButton } from './components/metamask/MetamaskConnectButton';
import { PhantomConnectButton } from './components/phantom/PhantomConnectButton';
import { useEffect } from 'react';
import './App.css'

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
  return (
    <WagmiProvider config={wagmiConfig}>
      <Stars />
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
        <h1 className="text-3xl font-extrabold tracking-tight" style={{textShadow: '0 2px 24px #6b21a8'}}>Web3 Wallet Connect Starter</h1>
        <div className="flex gap-8">
          <MetaMaskConnectButton />
          <PhantomConnectButton />
        </div>
        <div className="card mt-8">
          <p>Connect your favorite wallet and explore the galaxy of Web3!</p>
        </div>
      </div>
    </WagmiProvider>
  );
}

export default App;