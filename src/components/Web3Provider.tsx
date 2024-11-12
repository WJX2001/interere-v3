import React, { ReactNode, useEffect, useState } from 'react';
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
interface Props {
  render: (network: {}) => ReactNode;
}

const Web3Provider: React.FC<Props> = (props) => {
  const { render } = props;
  const { isConnected, address, chainId } = useAccount();
  const [networkInfo, setNetworkInfo] = useState({});
  // const routerAddress = useGetRouter()
  // console.log(routerAddress?.read.WETH(),'222222')
  // console.log(routerAddress)

  // const getWETHAddress = async() => {
  //   const data = await routerAddress?.read.WETH()
  //   console.log(data,'wjx')
  // }

  // useEffect(() => {
  //   getWETHAddress()
  // },[routerAddress])
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
      {isConnected && NetWorkList.includes(chainId as number) &&
        NetWorkList.includes(chainId as number) &&
        render(networkInfo)}
    </>
  );
};

export default Web3Provider;
