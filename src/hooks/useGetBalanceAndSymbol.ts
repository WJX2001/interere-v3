import { CoinListTypes } from '@/types';
import { Address, formatUnits } from 'viem';
import { useBalance } from 'wagmi';
import { type UseBalanceReturnType } from 'wagmi';
import { useContract } from './useContract';
import { useERCContract, useGetAllContract } from './ethereumInfoHooks';
import { useEffect, useRef } from 'react';

export function useGetBalanceAndSymbol<TAbi extends Abi>(
  accountAddress: Address,
  address: Address,
  weth_address: Address,
  coins: CoinListTypes[],
) {
  const balanceRes: UseBalanceReturnType = useBalance({
    address: accountAddress,
  });
  const contractInstance = useERCContract(address);
  const tmpRef= useRef({
    tokenDecimals: null,
    balanceRaw: null,
    symbol: null

  })
  // useEffect(() => {
  //   const fetchErc20Token = async () => {
  //     if (contractInstance) {
  //       try {
  //         const tokenDecimals = await contractInstance.read.decimals();
  //         const balanceRaw = await contractInstance.read.balanceOf([
  //           accountAddress,
  //         ]);
  //         const symbol = await contractInstance.read.symbol();
  //         tmpRef.current.tokenDecimals = tokenDecimals
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     }
  //   };
  //   fetchErc20Token();
  // }, [contractInstance, accountAddress]);

  if (address === weth_address) {
    return {
      balance: formatUnits(
        balanceRes.data?.value as bigint,
        balanceRes?.data?.decimals as number,
      ),
      symbol: coins[0].symbol,
    };
  } else {
    const tokenDecimals = contractInstance
  }
}
