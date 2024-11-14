import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useAccount } from 'wagmi';
import { ContentContainer } from './ContentContainer';
import ConectWalletPaper from './ConectWalletPaper';
import { useGetFactory, useGetRouter } from '@/hooks/ethereumInfoHooks';
import { NetWorkList } from '@/constants/network';
import ChangeNetWorkPaper from './ChangeNetWorkPaper';
import { COINLISTS } from '@/constants';
import { Address, zeroAddress } from 'viem';
import { CoinListTypes } from '@/types';

interface Props {
  render: (network: {
    weth: Address | null;
    factory: ReturnType<typeof useGetFactory>;
    router: ReturnType<typeof useGetRouter>;
    coins: CoinListTypes[]
  }) => ReactNode;
}

export type NetWorkType = {
  weth: Address | null;
  factory: ReturnType<typeof useGetFactory>;
  router: ReturnType<typeof useGetRouter>;
  coins: CoinListTypes[]
}

const Web3Provider: React.FC<Props> = (props) => {
  const { render } = props;
  const { isConnected, chainId } = useAccount();
  const routeContract = useGetRouter();

  const [factoryAddress, setFactoryAddress] = useState<Address>(zeroAddress);
  const factoryInstance = useGetFactory(factoryAddress);

  const network = useRef({
    weth: null as Address | null,
    factory: factoryInstance,
    router: routeContract,
    coins: [...COINLISTS],
  });

  useEffect(() => {
    const fetchRouteData = async () => {
      if (routeContract) {
        try {
          // Get WETH address and update network ref
          const wethAddress = (await routeContract.read.WETH()) as Address;
          network.current.weth = wethAddress;
          network.current.coins[2].address = wethAddress;

          // Get factory address and update state
          const factory_address = (await routeContract.read.factory()) as Address;
          setFactoryAddress(factory_address);
        } catch (error) {
          console.error("Error fetching route data:", error);
        }
      }
    };

    fetchRouteData();
  }, [routeContract]);

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
        render(network.current)}
    </>
  );
};

export default Web3Provider;
