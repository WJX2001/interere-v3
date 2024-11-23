import { RouterAddress } from '@/constants/network';
import { getContract } from '@/utils/contractHelper';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Abi, Address, formatEther, zeroAddress } from 'viem';
import { useAccount, useChainId, useWalletClient } from 'wagmi';
import ROUTER from '@/build/UniswapV2Router02.json';
import FACTORY from '@/build/IUniswapV2Factory.json';
import ERC20 from '@/build/ERC20.json';
import PAIR from '@/build/IUniswapV2Pair.json';
import { AbiType } from '@/types';
import { fetchReserves } from '@/utils/ethereumInfoFuntion';
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

export const useRouterContract = () => {
  return useContract(RouterAddress, (ROUTER as AbiType)?.abi);
};

export const useGetFactory = (address: Address) => {
  return useContract(address, (FACTORY as AbiType).abi);
};

export const useERC20 = (address: Address) => {
  return useContract(address, (ERC20 as AbiType).abi);
};

export const usePair = (address: Address) => {
  return useContract(address, (PAIR as AbiType).abi);
};

export const useGetReserves = (
  address1: Address,
  address2: Address,
  factory: ReturnType<typeof useGetFactory>,
) => {
  const { address } = useAccount();
  const ERC20_1 = useERC20(address1);
  const ERC20_2 = useERC20(address2);
  const [reserves, setReserves] = useState<string[]>(['0', '0', '0']);
  const [pairAddress, setPairAddress] = useState<Address>(zeroAddress);
  const pair = usePair(pairAddress);
  const [isError, setIsError] = useState<boolean>(false);
  const getPariAddress = useCallback(async () => {
    const pairAddress = (await factory?.read?.getPair([
      address1,
      address2,
    ])) as Address;
    setPairAddress(pairAddress);
  }, [factory, address1, address2]);

  const fetchPairAddress = useCallback(async () => {
    try {
      if (pairAddress !== '0x0000000000000000000000000000000000000000') {
        const reservesRaw = await fetchReserves(
          address1,
          address2,
          ERC20_1,
          ERC20_2,
          pair,
        );

        const liquidityTokens_BN = (await pair?.read?.balanceOf([
          address,
        ])) as bigint;

        const liquidityTokens = formatEther(liquidityTokens_BN);
        const res = [
          Number(reservesRaw[0]).toPrecision(6),
          Number(reservesRaw[1]).toPrecision(6),
          liquidityTokens,
        ] as string[];
        setReserves(res);
      } else {
        console.log('no reserves yet');
        setReserves(['0', '0', '0']);
      }
    } catch (err) {
      console.log(err, '王吉祥你错了2');
      setIsError(true);
      setReserves(['0', '0', '0']);
    }
  }, [address1, address2, ERC20_1, ERC20_2, pair, address, pairAddress]);

  useEffect(() => {
    if (pairAddress !== zeroAddress) {
      fetchPairAddress();
    }
  }, [pairAddress, fetchPairAddress]);

  useEffect(() => {
    if (factory?.address !== zeroAddress && pair && ERC20_1 && ERC20_2) {
      getPariAddress();
    }
  }, [factory, fetchPairAddress, pair, ERC20_1, ERC20_2, getPariAddress]);

  return useMemo(() => {
    return {
      reserveArr: reserves,
      pairContract: pair,
      hasError: isError,
    };
  }, [reserves, pair, isError]);
};
