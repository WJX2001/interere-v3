import { RouterAddress } from '@/constants/network';
import { getContract } from '@/utils/contractHelper';
import {useMemo } from 'react';
import { Abi, Address } from 'viem';
import { useChainId, useWalletClient } from 'wagmi';
import ROUTER from '@/build/UniswapV2Router02.json';
import FACTORY from '@/build/IUniswapV2Factory.json';
import ERC20 from '@/build/ERC20.json';
import { AbiType } from '@/types';
type UseContractOptions = {
  chainId?: number;
};

export function useContract<TAbi extends Abi>(
  addressOrAddressMap?: Address | { [chainId: number]: Address },
  abi?: TAbi,
  options?: UseContractOptions,
) {
  const currentChainId = useChainId();
  const chainId = options?.chainId || currentChainId;
  const { data: walletClient } = useWalletClient();

  return useMemo(() => {
    if (!addressOrAddressMap || !abi || !chainId) return null;
    let address: Address | undefined;
    if (typeof addressOrAddressMap === 'string') address = addressOrAddressMap;
    else address = addressOrAddressMap[chainId];
    if (!address) return null;
    try {
      return getContract({
        abi,
        address,
        chainId,
        signer: walletClient ?? undefined,
      });
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [addressOrAddressMap, abi, chainId, walletClient]);
}

export const useGetRouterContract = () => {
  return useContract(RouterAddress, (ROUTER as AbiType)?.abi);
};

export const useGetFactory = (address: Address) => {
  return useContract(address, (FACTORY as AbiType).abi);
};

export const useERCContract = (address: Address) => {
  return useContract(address, (ERC20 as AbiType).abi);
};

