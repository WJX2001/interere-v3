import { modeTestnet } from 'viem/chains';
import { PublicClient, createPublicClient, http } from 'viem';

export const viemClients = (chaiId: number): PublicClient => {
  const clients: {
    [key: number]: PublicClient
  } = {
    [modeTestnet.id]: createPublicClient({
      chain: modeTestnet,
      transport: http()
    })
  }
  return clients[chaiId]
}

