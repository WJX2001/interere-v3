import { Contract, ethers } from 'ethers';
import ROUTER from '@/build/UniswapV2Router02.json';
import ERC20 from '@/build/ERC20.json'
import FACTORY from '@/build/IUniswapV2Factory.json';
import { Address } from 'viem';
export async function getNetwork(provider: ethers.providers.Web3Provider) {
  const network = await provider.getNetwork();
  return network.chainId;
}

export async function getAccount() {
  const accounts = await window.ethereum.request({
    method: 'eth_requestAccounts',
  });

  return accounts[0];
}

export function getWeth(
  address: Address,
  signer: ethers.providers.JsonRpcSigner,
) {
  return new Contract(address, ERC20.abi, signer);
}

export function getRouter(
  address: Address,
  signer: ethers.providers.JsonRpcSigner,
) {
  return new Contract(address, ROUTER.abi, signer);
}


export function getFactory( address: Address,
  signer: ethers.providers.JsonRpcSigner,) {
  return new Contract(address, FACTORY.abi, signer);
}