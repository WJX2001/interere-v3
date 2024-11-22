import { useERC20, useGetFactory, usePair } from '@/hooks/useContract';
import { Address, formatEther } from 'viem';
import { fetchReserves, getDecimalsERC20 } from './ethereumInfoFuntion';

const quote = (amount1: number, reserve1: number, reserve2: number) => {
  const amount2 = amount1 * (reserve2 / reserve1);
  return amount2;
};

export async function quoteMintLiquidity(
  address1: Address,
  address2: Address,
  amountA: string,
  amountB: string,
  factory: ReturnType<typeof useGetFactory>,
  pair: ReturnType<typeof usePair>,
  ERC20Coin1: ReturnType<typeof useERC20>,
  ERC20Coin2: ReturnType<typeof useERC20>,
  reservesRaw: unknown[]
) {
  const MINIMUM_LIQUIDITY = 1000;
  let _reserveA;
  let _reserveB;
  let totalSupply = 0;
  // acquire pair address
  const pairAddress = await factory?.read?.getPair([address1, address2]);
  if (pairAddress !== '0x0000000000000000000000000000000000000000') {
    const reserveA = Number(reservesRaw[0]);
    const reserveB = Number(reservesRaw[1]);
    const _totalSupply = (await pair?.read?.totalSupply()) as bigint;
    _reserveA = reserveA;
    _reserveB = reserveB;
    totalSupply = Number(formatEther(_totalSupply));
  } else {
    _reserveA = 0;
    _reserveB = 0;
    totalSupply = 0;
  }

  console.log(_reserveA, _reserveB, totalSupply);
  const token1Decimals = await getDecimalsERC20(ERC20Coin1);
  const token2Decimals = await getDecimalsERC20(ERC20Coin2);

  const valueA = Number(amountA) * 10 ** token1Decimals;
  const valueB = Number(amountB) * 10 ** token2Decimals;

  const reserveA = _reserveA * 10 ** token1Decimals;
  const reserveB = _reserveB * 10 ** token2Decimals;
  if (totalSupply == 0) {
    return Math.sqrt(valueA * valueB - MINIMUM_LIQUIDITY) * 10 ** -18;
  }
  return Math.min(
    (valueA * totalSupply) / reserveA,
    (valueB * totalSupply) / reserveB,
  );
}

export async function quoteAddLiquidity(
  address1: Address,
  address2: Address,
  amountADesired: string,
  amountBDesired: string,
  factory: ReturnType<typeof useGetFactory>,
  pair: ReturnType<typeof usePair>,
  ERC20Coin1: ReturnType<typeof useERC20>,
  ERC20Coin2: ReturnType<typeof useERC20>,
  reservesRaw: unknown[]
): Promise<[string, string, string]> {
  const reserveA = reservesRaw[0] as number;
  const reserveB = reservesRaw[1] as number;
  debugger
  if (reserveA === 0 && reserveB === 0) {
    const amountOut = await quoteMintLiquidity(
      address1,
      address2,
      amountADesired,
      amountBDesired,
      factory,
      pair,
      ERC20Coin1,
      ERC20Coin2,
      reservesRaw
    );
    return [amountADesired, amountBDesired, Number(amountOut).toPrecision(8)];
  } else {
    const amountBOptimal = String(
      quote(Number(amountADesired), reserveA, reserveB),
    );
    if (amountBOptimal <= amountBDesired) {
      const amountOut = await quoteMintLiquidity(
        address1,
        address2,
        amountBOptimal,
        amountBDesired,
        factory,
        pair,
        ERC20Coin1,
        ERC20Coin2,
        reservesRaw
      );
      return [amountADesired, amountBOptimal, amountOut.toPrecision(8)];
    } else {
      const amountAOptimal = String(
        quote(Number(amountBDesired), reserveB, reserveA),
      );
      const amountOut = await quoteMintLiquidity(
        address1,
        address2,
        amountAOptimal,
        amountBDesired,
        factory,
        pair,
        ERC20Coin1,
        ERC20Coin2,
        reservesRaw
      );
      return [amountAOptimal, amountBDesired, amountOut.toPrecision(8)];
    }
  }
}
