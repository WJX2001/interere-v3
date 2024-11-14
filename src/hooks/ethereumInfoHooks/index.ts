
import ROUTER from '@/build/UniswapV2Router02.json';

import { RouterAddress } from '@/constants/network';
import { AbiType } from '@/types';
import { Address, zeroAddress } from 'viem';
import FACTORY from '@/build/IUniswapV2Factory.json';
import ERC20 from '@/build/ERC20.json'
import { Contract } from 'web3';
import { useContract } from '../useContract';

export type RouterContractType = Contract<typeof ROUTER.abi>;

export const useGetRouter = () => {
  return useContract(RouterAddress || zeroAddress, (ROUTER as AbiType).abi);
};

export const useGetFactory = (address: Address) => {
  return useContract(address || zeroAddress, (FACTORY as AbiType).abi);
};

export const useERCContract = (address: Address) => {
  return useContract(address || zeroAddress,(ERC20 as AbiType).abi);
}
