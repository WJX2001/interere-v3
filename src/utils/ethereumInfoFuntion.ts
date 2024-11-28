import { Address, formatUnits } from 'viem';
import { CoinListTypes, GetBalanceAndSymbolResult } from '@/types';
import {
  useERC20,
  useGetFactory,
  usePair,
  usePocket,
} from '@/hooks/useContract';
import { UseBalanceReturnType } from 'wagmi';
import { BigNumber, ethers } from 'ethers';

// obtain decimals
export async function getDecimalsERC20(
  token: ReturnType<typeof useERC20>,
): Promise<number> {
  try {
    const decimals = (await token?.read?.decimals()) as number;
    return decimals;
  } catch {
    console.error('No tokenDecimals function for this token, set to 0');
    return 0;
  }
}

// use wagmi to obtain balance and symbol
export async function getBalanceAndSymbolByWagmi(
  userAddress: Address,
  address: Address,
  weth_address: Address,
  coins: CoinListTypes[],
  balanceData: UseBalanceReturnType,
  contract: ReturnType<typeof useERC20>,
): Promise<GetBalanceAndSymbolResult> {
  const tokenDicimals = await getDecimalsERC20(contract);
  const balanceRaw = (await contract?.read?.balanceOf([userAddress])) as bigint;
  const symbol = (await contract?.read?.symbol()) as string;
  try {
    if (address === weth_address) {
      return {
        balance: formatUnits(balanceData?.data?.value as bigint, 18),
        symbol: coins[2]?.symbol,
      };
    } else {
      return {
        balance: formatUnits(balanceRaw, tokenDicimals),
        symbol: symbol,
      };
    }
  } catch {
    console.error('The getBalanceAndSymbol function had an error!');
    return false;
  }
}

export async function fetchReserves(
  address1: Address,
  address2: Address,
  ERC20Coin1: ReturnType<typeof useERC20>,
  ERC20Coin2: ReturnType<typeof useERC20>,
  pair: ReturnType<typeof usePair>,
) {
  try {
    const decimal1 = await getDecimalsERC20(ERC20Coin1);
    const decimal2 = await getDecimalsERC20(ERC20Coin2);
    // Get reserves
    const reserveRaw = (await pair?.read?.getReserves([])) as bigint[];
    // Put the results in the right order
    const results = [
      (await pair?.read?.token0()) === address1 ? reserveRaw[0] : reserveRaw[1],
      (await pair?.read?.token1()) === address2 ? reserveRaw[1] : reserveRaw[0],
    ];
    return [
      formatUnits(results[0], decimal1),
      formatUnits(results[1], decimal2),
    ];
  } catch (error) {
    console.error(error);
    return [0, 0];
  }
}

export async function swapTokens(
  token1Address: Address,
  token2Address: Address,
  wethAddress: Address,
  amountInAll: BigNumber,
  routerContract: ReturnType<typeof useGetFactory>,
  userAddress: Address,
) {
  const tokens = [token1Address, token2Address];
  const time = Math.floor(Date.now() / 1000) + 200000;
  const deadline = ethers.BigNumber.from(time);
  const amountOut = (await routerContract?.read?.getAmountsOut([
    amountInAll,
    tokens,
  ])) as BigNumber[];

  if (token1Address === wethAddress) {
    const swapHash = await routerContract?.write?.swapExactETHForTokens([
      amountOut[1],
      tokens,
      userAddress,
      deadline,
      [amountInAll],
    ]);
    return swapHash;
  } else if (token2Address === wethAddress) {
    const swapHash = await routerContract?.write?.swapExactTokensForETH([
      amountInAll,
      amountOut[1],
      tokens,
      userAddress,
      deadline,
    ]);
    return swapHash;
  } else {
    const swapHash = await routerContract?.write?.swapExactTokensForTokens([
      amountInAll,
      amountOut[1],
      tokens,
      userAddress,
      deadline,
    ]);
    return swapHash;
  }
}

export async function allowance(
  ERC20Contract: ReturnType<typeof useERC20>,
  spender: Address,
  userAddress: Address,
) {
  try {
    const tokenDecimals = await getDecimalsERC20(ERC20Contract);
    const allowance = await ERC20Contract?.read?.allowance([
      userAddress,
      spender,
    ]);
    return formatUnits(allowance as bigint, tokenDecimals);
  } catch (e) {
    console.error(e);
  }
}

export async function pitchAmount(
  pocketContract: ReturnType<typeof usePocket>,
  erc20Contract: ReturnType<typeof useERC20>,
  userAddress: Address,
  amount: string,
) {
  const tokenDecimals = await getDecimalsERC20(erc20Contract);
  const parsedAmount = ethers.utils.parseUnits(amount, tokenDecimals);
  try {
    const res = await pocketContract?.write?.pitchAmount([
      parsedAmount,
      userAddress,
    ]);
    return {
      receipHx: res,
    };
  } catch (e) {
    console.error(e, 'error');
    return {
      receipHx: undefined,
    };
  }
}

export async function getApproveHash(
  erc20Contract: ReturnType<typeof useERC20>,
  spender: Address,
  amount: string,
) {
  const tokenDecimals = await getDecimalsERC20(erc20Contract);
  const parsedAmount = ethers.utils.parseUnits(amount, tokenDecimals);
  const approveHash = await erc20Contract?.write?.approve([
    spender,
    parsedAmount,
  ]);
  return {
    approveHash,
  };
}


