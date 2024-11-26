
import { modeTestnet } from 'viem/chains';

export const defaultChainId: number = modeTestnet.id;
export const NetWorkList = [919];
export const RouterAddress = '0x10034BC392b3313E2EdcafD56beF773F0F155C5F';
export const PocketIndexAddress = '0x67Dad3559db28C428B4cE3B5Daf16bf4D53E1210';


export const ChainId = {
  MAINNET: 919
};

export const routerAddress = new Map();
// CoinRouter
routerAddress.set(ChainId.MAINNET, "0x10034BC392b3313E2EdcafD56beF773F0F155C5F");

export const pocketIndexAddress = new Map()
pocketIndexAddress.set(ChainId.MAINNET, '0x67Dad3559db28C428B4cE3B5Daf16bf4D53E1210')
