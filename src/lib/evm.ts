import { createConfig, http } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// const publicClient = createPublicClient({
//   chain: goerli,
//   transport: http(),
// });

export const wagmiConfig = createConfig({
  connectors: [injected()],
  chains: [mainnet],
  ssr: false,
  transports: {
    [mainnet.id]: http(),
  },
});