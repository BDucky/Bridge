import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from './lib/evm';
import { MetaMaskConnectButton } from './components/metamask/MetamaskConnectButton';
import { PhantomConnectButton } from './components/phantom/PhantomConnectButton';

function App() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
        <h1 className="text-3xl font-extrabold tracking-tight">Web3 Wallet Connect Starter</h1>
        <MetaMaskConnectButton />
        <PhantomConnectButton />
      </div>
    </WagmiProvider>
  );
}

export default App;