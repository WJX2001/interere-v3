import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  modeTestnet,
} from 'wagmi/chains';

export const Config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: import.meta.env.VITE_PROJECT_ID,
  // chains: [mainnet, polygon, optimism, arbitrum, base],
  chains: [modeTestnet, mainnet, polygon, optimism, arbitrum, base],
});


