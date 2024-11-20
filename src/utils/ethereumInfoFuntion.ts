import { Address, formatUnits } from 'viem';
import { CoinListTypes, GetBalanceAndSymbolResult } from '@/types';
import { useERC20, usePair } from '@/hooks/useContract';
import { UseBalanceReturnType } from 'wagmi';

// obtain decimals
export async function getDecimalsERC20(
  token: ReturnType<typeof useERC20>,
): Promise<number> {
  try {
    const decimals = (await token?.read?.decimals()) as number;
    return decimals;
  } catch {
    console.log('No tokenDecimals function for this token, set to 0');
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
  } catch (error) {
    console.log('The getBalanceAndSymbol function had an error!');
    console.log(error);
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
    const reserveRaw = (await pair?.read?.getReserves()) as bigint[];
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
    console.log(error);
    return [0, 0];
  }
}

