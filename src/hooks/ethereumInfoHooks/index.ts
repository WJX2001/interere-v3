import { useContract } from '../useContract';
import routerAbi from '@/build/UniswapV2Router02.json';
import { RouterAddress } from '@/constants/network';
import { AbiType } from '@/types';
import { Address, zeroAddress } from 'viem';

export const useGetRouter = () => {
  return useContract(RouterAddress || zeroAddress, (routerAbi as AbiType).abi);
};
