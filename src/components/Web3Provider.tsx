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
import { useGetFactory, useGetRouter } from '@/hooks/ethereumInfoHooks';
import routerAbi from '@/build/UniswapV2Router02.json';
import { AbiType } from '@/types';
import { NetWorkList } from '@/constants/network';
import ChangeNetWorkPaper from './ChangeNetWorkPaper';
import { COINLISTS } from '@/constants';
import { Address, zeroAddress } from 'viem';

interface Props {
  render: (network: {}) => ReactNode;
}

const Web3Provider: React.FC<Props> = (props) => {
  const { render } = props;
  const { isConnected, address, chainId } = useAccount();
  const routeContract = useGetRouter();
  const [factoryAddress, setFactoryAddress] = useState<Address>(zeroAddress);
  const factoryInsance = useGetFactory(factoryAddress);

  const network = Object.create({});
  network.weth = useRef(null);
  network.factory = useRef(null);
  network.coins = COINLISTS;
  network.router = routeContract;
  network.factory = factoryInsance;
  network.chainId = chainId;

  const getRouteInstance = useCallback(async () => {
    if (routeContract) {
      // get weth address from router
      const wethAddress = (await routeContract?.read.WETH()) as Address;
      network.weth = wethAddress;
      network.coins[2].address = wethAddress;
      // get factory address from router
      const factory_address = (await routeContract?.read.factory()) as Address;
      setFactoryAddress(factory_address);
      // Get factory instance
      // factoryRef.current = await ;
    }
  }, [routeContract, network]);

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
        render(network)}
    </>
  );
};

export default Web3Provider;
