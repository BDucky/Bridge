// 1. Extend window interface
interface SolanaProvider {
    isPhantom?: boolean;
    publicKey?: {
      toString(): string;
    };
    connect(): Promise<{ publicKey: { toString(): string } }>;
    disconnect(): Promise<void>;
    on(event: string, handler: (args: any) => void): void;
    request(method: string, params: any): Promise<any>;
  }
  
  declare global {
    interface Window {
      solana?: SolanaProvider;
    }
  }
  
  // 2. Get the Phantom provider
  export const getPhantomProvider = (): SolanaProvider | null => {
    if ('solana' in window) {
      const provider = window.solana;
      if (provider?.isPhantom) {
        return provider;
      }
    }
    return null;
  };
  
  // 3. Simple connect function
  export const connectPhantom = async () => {
    const provider = getPhantomProvider();
    if (!provider) throw new Error("Phantom Wallet not found");
  
    const res = await provider.connect();
    return res.publicKey.toString();
  };