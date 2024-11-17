import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAccount } from 'wagmi';
import { ContentContainer } from './ContentContainer';
import ConectWalletPaper from './ConectWalletPaper';
import { NetWorkList } from '@/constants/network';
import ChangeNetWorkPaper from './ChangeNetWorkPaper';
import { COINLISTS } from '@/constants';
import { Address, zeroAddress } from 'viem';
import { CoinListTypes } from '@/types';
import { useGetFactory, useRouterContract } from '@/hooks/useContract';
interface Props {
  render: (network: {
    wethAddress: Address;
    coins: CoinListTypes[];
    factory: ReturnType<typeof useGetFactory>;
    router: ReturnType<typeof useRouterContract>;
  }) => ReactNode;
}
const Web3Provider: React.FC<Props> = (props) => {
  const { render } = props;
  const { isConnected, chainId } = useAccount();
  const routeContract = useRouterContract();
  // get weth address from router contract
  const [wethAddress, setWethAddress] = useState<Address>(zeroAddress);
  const [coinListsAllInfo, setCoinListsAllInfo] =
    useState<CoinListTypes[]>(COINLISTS);
  const [factoryAddress, setFactoryAddress] = useState<Address>(zeroAddress);
  const factoryContract = useGetFactory(factoryAddress);

  const getWethAddress = useCallback(async () => {
    if (routeContract) {
      const res = (await routeContract?.read.WETH()) as Address;
      setWethAddress(res);
      setCoinListsAllInfo((prev) => {
        return prev.map((item) => {
          if (item.symbol === 'ETH') {
            return {
              ...item,
              address: res as Address,
            };
          }
          return item;
        });
      });
      const factory_address = await routeContract?.read.factory();
      setFactoryAddress(factory_address as Address);
    }
  }, [routeContract]);

  useEffect(() => {
    if (routeContract) {
      getWethAddress();
    }
  }, [routeContract, getWethAddress]);

  const neworkObj = useMemo(() => {
    return {
      wethAddress,
      coins: coinListsAllInfo,
      factory: factoryContract,
      router: routeContract,
    };
  }, [wethAddress, coinListsAllInfo, factoryContract, routeContract]);

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
        render(neworkObj)}
    </>
  );
};

export default Web3Provider;
