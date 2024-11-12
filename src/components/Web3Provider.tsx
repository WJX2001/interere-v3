import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  useAccount,
  useChainId,
  useReadContract,
  useWalletClient,
} from 'wagmi';
import { ContentContainer } from './ContentContainer';
import ConectWalletPaper from './ConectWalletPaper';
import { useGetRouter } from '@/hooks/ethereumInfoHooks';
import routerAbi from '@/build/UniswapV2Router02.json';
import { AbiType } from '@/types';
import { NetWorkList } from '@/constants/network';
import ChangeNetWorkPaper from './ChangeNetWorkPaper';
import { COINLISTS } from '@/constants';
import { Address } from 'viem';

interface Props {
  render: (network: {}) => ReactNode;
}

const Web3Provider: React.FC<Props> = (props) => {
  const { render } = props;
  const { isConnected, address, chainId } = useAccount();
  const routeContract = useGetRouter();

  const coinListRef = useRef(COINLISTS);
  const factoryRef = useRef<Address>();

  const getRouteInstance = useCallback(async () => {
    if (routeContract) {
      // get weth address from router
      const wethAddress = (await routeContract?.read.WETH()) as Address;
      coinListRef.current[2].address = wethAddress;
      // get factory address from router
      const factory = (await routeContract?.read.factory()) as Address;
      // Get factory instance
      // factoryRef.current = await ;
    }
  }, [routeContract]);

  useEffect(() => {
    getRouteInstance();
  }, [getRouteInstance]);

  console.log(chainId, '312');
  return (
    <>
      {!isConnected && (
        <ContentContainer>
          <ConectWalletPaper />
        </ContentContainer>
      )}
      {isConnected && !NetWorkList.includes(chainId as number) && (
        <ContentContainer>
          <ChangeNetWorkPaper />
        </ContentContainer>
      )}
      {isConnected &&
        NetWorkList.includes(chainId as number) &&
        NetWorkList.includes(chainId as number) &&
        render({
          wethAddress: coinListRef?.current,
        })}
    </>
  );
};

export default Web3Provider;
