import { Contract, ethers } from 'ethers';
import ROUTER from '@/build/UniswapV2Router02.json';
import ERC20 from '@/build/ERC20.json';
import FACTORY from '@/build/IUniswapV2Factory.json';
import PAIR from '@/build/IUniswapV2Pair.json';
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

export async function fetchReserves(
  address1: string,
  address2: string,
  pair: Contract,
  signer: ethers.providers.JsonRpcSigner,
) {
  try {
    // Get decimals for each coin
    const coin1 = new Contract(address1, ERC20.abi, signer);
    const coin2 = new Contract(address2, ERC20.abi, signer);

    const coin1Decimals = await getDecimals(coin1);
    const coin2Decimals = await getDecimals(coin2);

    // Get reserves
    const reservesRaw = await pair.getReserves();

    // Put the results in the right order
    const results = [
      (await pair.token0()) === address1 ? reservesRaw[0] : reservesRaw[1],
      (await pair.token1()) === address2 ? reservesRaw[1] : reservesRaw[0],
    ];

    // Scale each to the right decimal place
    return [
      results[0] * 10 ** -coin1Decimals,
      results[1] * 10 ** -coin2Decimals,
    ];
  } catch (err) {
    console.log('error!');
    console.log(err);
    return [0, 0];
  }
}

export async function getReserves(
  address1: string,
  address2: string,
  factory: Contract,
  signer: ethers.providers.JsonRpcSigner,
  accountAddress: Address,
) {
  try {
    const pairAddress = await factory.getPair(address1, address2);
    const pair = new Contract(pairAddress, PAIR.abi, signer);

    if (pairAddress !== '0x0000000000000000000000000000000000000000') {
      const reservesRaw = await fetchReserves(address1, address2, pair, signer);
      const liquidityTokens_BN = await pair.balanceOf(accountAddress);
      const liquidityTokens = Number(
        ethers.utils.formatEther(liquidityTokens_BN),
      );

      return [
        reservesRaw[0].toPrecision(6),
        reservesRaw[1].toPrecision(6),
        liquidityTokens,
      ];
    } else {
      console.log('no reserves yet');
      return [0, 0, 0];
    }
  } catch (err) {
    console.log('error!');
    console.log(err);
    return [0, 0, 0];
  }
}

export async function getAmountOut(
  address1: string,
  address2: string,
  amountIn: string,
  routerContract: Contract,
  signer: ethers.providers.JsonRpcSigner,
) {
  try {
    debugger
    const token1 = new Contract(address1, ERC20.abi, signer);
    const token1Decimals = await getDecimals(token1);

    const token2 = new Contract(address2, ERC20.abi, signer);
    const token2Decimals = await getDecimals(token2);

    const values_out = await routerContract.getAmountsOut(
      ethers.utils.parseUnits(String(amountIn), token1Decimals),
      [address1, address2]
    );
    const amount_out = values_out[1]*10**(-token2Decimals);
    console.log('amount out: ', amount_out)
    return Number(amount_out);
  } catch {
    return false;
  }
}
