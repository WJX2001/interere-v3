
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { arbitrum, base, mainnet, optimism, polygon } from 'wagmi/chains';

export const Config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet, polygon, optimism, arbitrum, base],
});
