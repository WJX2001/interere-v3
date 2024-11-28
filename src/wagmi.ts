import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  mainnet,
  modeTestnet,
} from 'wagmi/chains';

export const Config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: import.meta.env.VITE_PROJECT_ID,
  // projectId: process.env.VITE_PROJECT_ID as string,
  // chains: [mainnet, polygon, optimism, arbitrum, base],
  chains: [modeTestnet, mainnet],
});


