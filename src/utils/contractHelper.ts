
import {
  Abi,
  Address,
  getContract,
  GetContractReturnType,
  PublicClient,
  WalletClient,
} from 'viem';
import { viemClients } from './viem';
import { defaultChainId } from '@/constants/network';

export const handleGetContract = <
  TAbi extends Abi | readonly unknown[],
  TWalletClient extends WalletClient,
>({
  abi,
  address,
  chainId = defaultChainId,
  signer,
}: {
  abi: TAbi | readonly unknown[];
  address: Address;
  chainId?: number;
  signer?: TWalletClient;
}) => {
  const contractInstance = getContract({
    abi,
    address,
    client: {
      public: viemClients(chainId),
      wallet: signer,
    },
  }) as unknown as GetContractReturnType<TAbi, PublicClient, Address>;

  return {
    ...contractInstance,
    account: signer?.account,
    chain: signer?.chain,
  };
};
