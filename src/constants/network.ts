import { Address, zeroAddress } from 'viem';
import { modeTestnet } from 'viem/chains';

export const defaultChainId: number = modeTestnet.id;

export const NetWorkList = [919];

// export const RouterAddress = new Map();
// RouterAddress.set(defaultChainId, '0x10034BC392b3313E2EdcafD56beF773F0F155C5F');
export const RouterAddress = '0x10034BC392b3313E2EdcafD56beF773F0F155C5F';
