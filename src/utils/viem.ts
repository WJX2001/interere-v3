import { lineaSepolia } from 'viem/chains';
import { PublicClient, createPublicClient, http } from 'viem';

export const viemClients = (chaiId: number): PublicClient => {
  const clients: {
    [key: number]: PublicClient;
  } = {
    [lineaSepolia.id]: createPublicClient({
      chain: lineaSepolia,
      transport: http(),
    }),
  };
  return clients[chaiId];
};
