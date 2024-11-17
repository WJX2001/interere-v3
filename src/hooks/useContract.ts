import { RouterAddress } from '@/constants/network';
import { getContract } from '@/utils/contractHelper';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Abi, Address, formatUnits } from 'viem';
import { useAccount, useBalance, useChainId, useWalletClient } from 'wagmi';
import ROUTER from '@/build/UniswapV2Router02.json';
import FACTORY from '@/build/IUniswapV2Factory.json';
import ERC20 from '@/build/ERC20.json';
import { AbiType, CoinListTypes } from '@/types';
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

export const useGetBalanceAndSymbol = (
  address: Address,
  weth_address: Address,
  coins: CoinListTypes[],
) => {
  const { address: userAddress } = useAccount();
  const { data: balanceData } = useBalance({
    address: userAddress,
  });
  const tokenContract = useERCContract(address);
  const [tokenDicimalsInfo, setTokenDicimalsInfo] = useState('');
  const [balanceRawInfo, setBalanceRawInfo] = useState<unknown>();
  const [symbolInfo, setSymbolInfo] = useState('');
  
  const getTokenInfo = useCallback(async () => {
    const tokenDicimals = await tokenContract?.read?.decimals();
    setTokenDicimalsInfo(tokenDicimals as string);
    const balanceRaw = await tokenContract?.read?.balanceOf([userAddress]);
    setBalanceRawInfo(balanceRaw);
    const symbol = await tokenContract?.read?.symbol();
    setSymbolInfo(symbol as string);
  }, [tokenContract, userAddress]);

  useEffect(() => {
    if (tokenContract && address !== weth_address) {
      getTokenInfo();
    }
  }, [tokenContract, getTokenInfo, address, weth_address]);

  try {
    if (address === weth_address && balanceData) {
      return {
        balance: formatUnits(balanceData?.value as bigint, 18),
        symbol: coins[2]?.symbol,
      };
    } else {
      return {
        balance: balanceRawInfo * 10 ** -tokenDicimalsInfo,
        symbol: symbolInfo,
      };
    }
  } catch (error) {
    console.log('The getBalanceAndSymbol function had an error!');
    console.log(error);
    return false;
  }
};
