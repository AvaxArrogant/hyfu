import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { defineChain } from 'viem';

// Define Hyperliquid EVM chain
export const hyperliquidEvm = defineChain({
  id: 999,
  name: 'Hyperliquid EVM',
  nativeCurrency: {
    decimals: 18,
    name: 'HYPE',
    symbol: 'HYPE',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.hyperliquid.xyz/evm'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Hyperliquid Explorer',
      url: 'https://hyperevmscan.io',
    },
  },
  testnet: false,
});

export const config = getDefaultConfig({
  appName: 'HyperFueled',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '06f6307ff7f3208b55fdf6234e45a858',
  chains: [hyperliquidEvm],
  ssr: true,
});