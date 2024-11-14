import { Contract, ethers } from 'ethers';
import ROUTER from '@/build/UniswapV2Router02.json';
import ERC20 from '@/build/ERC20.json';
import FACTORY from '@/build/IUniswapV2Factory.json';
import { Address } from 'viem';
import { CoinListTypes } from '@/types';
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

export function getFactory(
  address: Address,
  signer: ethers.providers.JsonRpcSigner,
) {
  return new Contract(address, FACTORY.abi, signer);
}

export async function getDecimals(token: Contract) {
  const decimals = await token
    .decimals()
    .then((res) => {
      return res;
    })
    .catch(() => {
      console.log('No tokenDecimals function for this token, set to 0');
      return 0;
    });
  return decimals;
}

export async function getBalanceAndSymbol(
  accountAddress: Address,
  address: Address,
  provider: ethers.providers.Web3Provider,
  signer: ethers.providers.JsonRpcSigner,
  weth_address: Address,
  coins: CoinListTypes[],
) {
  try {
    if (address === weth_address) {
      const balanceRaw = await provider.getBalance(accountAddress);
      return {
        balance: ethers.utils.formatEther(balanceRaw),
        symbol: coins[2].symbol,
      };
    } else {
      const token = new Contract(address, ERC20.abi, signer);
      const tokenDecimals = await getDecimals(token);
      const balanceRaw = await token.balanceOf(accountAddress);
      const symbol = await token.symbol();

      return {
        balance: balanceRaw * 10 ** -tokenDecimals,
        symbol: symbol,
      };
    }
  } catch (error) {
    console.log('The getBalanceAndSymbol function had an error!');
    console.log(error);
    return false;
  }
}
