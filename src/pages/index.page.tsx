import ConectWalletPaper from '@/components/ConectWalletPaper';
import { ContentContainer } from '@/components/ContentContainer';
import React from 'react';
import { useAccount } from 'wagmi';

const Home = () => {
  const { isConnected } = useAccount();
  return (
    <>
      <ContentContainer>
        {isConnected ? 22 : <ConectWalletPaper />}
      </ContentContainer>
    </>
  );
};

export default Home;
