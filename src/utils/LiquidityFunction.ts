import {
  useERC20,
  useGetFactory,
  usePair,
  useRouterContract,
} from '@/hooks/useContract';
import { Address, formatEther, zeroAddress } from 'viem';
import { getDecimalsERC20 } from './ethereumInfoFuntion';
import { BigNumber, ethers } from 'ethers';

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
  reservesRaw: unknown[],
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
  reservesRaw: unknown[],
): Promise<[string, string, string]> {
  const reserveA = reservesRaw[0] as number;
  const reserveB = reservesRaw[1] as number;
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
      reservesRaw,
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
        amountADesired,
        amountBDesired,
        factory,
        pair,
        ERC20Coin1,
        ERC20Coin2,
        reservesRaw,
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
        reservesRaw,
      );
      return [amountAOptimal, amountBDesired, amountOut.toPrecision(8)];
    }
  }
}

export async function getPairProveReceipt(
  amount1: string,
  amount2: string,
  routerContract: ReturnType<typeof useRouterContract>,
  token1: ReturnType<typeof useERC20>,
  token2: ReturnType<typeof useERC20>,
) {
  const token1Decimals = await getDecimalsERC20(token1);
  const token2Decimals = await getDecimalsERC20(token2);

  const amountIn1 = ethers.utils.parseUnits(amount1, token1Decimals);
  const amountIn2 = ethers.utils.parseUnits(amount2, token2Decimals);

  const tx1Hash = await token1?.write?.approve([
    routerContract?.address,
    amountIn1,
  ]);

  const tx2Hash = await token2?.write?.approve([
    routerContract?.address,
    amountIn2,
  ]);

  return {
    tx1Hash,
    tx2Hash,
    amountIn1,
    amountIn2,
  };
}

export async function addLiquidity(
  address1: Address,
  address2: Address,
  amountIn1: BigNumber,
  amountIn2: BigNumber,
  amount1Min: string,
  amount2Min: string,
  wethAdress: Address,
  routerContract: ReturnType<typeof useRouterContract>,
  account: Address,
) {
  const time = Math.floor(Date.now() / 1000) + 200000;
  const deadline = ethers.BigNumber.from(time);
  if (address1 === wethAdress) {
    const addLiquidityResHx = await routerContract?.write?.addLiquidityETH([
      address2,
      amountIn2,
      amount2Min,
      amount1Min,
      account,
      deadline,
      [amountIn1],
    ]);
    return addLiquidityResHx;
  } else if (address2 === wethAdress) {
    const addLiquidityResHx = await routerContract?.write?.addLiquidityETH([
      address1,
      amountIn1,
      amount1Min,
      amount2Min,
      account,
      deadline,
      [amountIn2],
    ]);
    return addLiquidityResHx;
  } else {
    const addLiquidityResHx = await routerContract?.write?.addLiquidity([
      address1,
      address2,
      amountIn1,
      amountIn2,
      amount1Min,
      amount2Min,
      account,
      deadline,
    ]);
    return addLiquidityResHx;
  }
}

export async function quoteRemoveLiquidity(
  liquidity: number,
  reserveA: number,
  reserveB: number,
  factory: ReturnType<typeof useGetFactory>,
  pair: ReturnType<typeof usePair>,
) {
  const feeOn = (await factory?.read?.feeTo()) !== zeroAddress;
  const _KLast = (await pair?.read?.kLast()) as bigint;
  const KLast = Number(formatEther(_KLast));
  const _totalSupply = (await pair?.read?.totalSupply()) as bigint;
  let totalSupply = Number(formatEther(_totalSupply));

  if (feeOn && KLast > 0) {
    const feeLiquidity =
      (totalSupply * (Math.sqrt(reserveA * reserveB) - Math.sqrt(KLast))) /
      (5 * Math.sqrt(reserveA * reserveB) + Math.sqrt(KLast));
    totalSupply = totalSupply + feeLiquidity;
  }

  const Aout = (reserveA * liquidity) / totalSupply;
  const Bout = (reserveB * liquidity) / totalSupply;

  return [liquidity, Aout, Bout];
}

export async function getPairContractApproveReceipt(
  liquidity_tokens: string,
  pair: ReturnType<typeof usePair>,
  routerContractAddress: Address,
) {
  const Getliquidity = (liquidity_tokens: number) => {
    if (liquidity_tokens < 0.001) {
      return ethers.BigNumber.from(liquidity_tokens * 10 ** 18);
    }
    return ethers.utils.parseUnits(String(liquidity_tokens), 18);
  };
  const liquidity = Getliquidity(Number(liquidity_tokens));
  const pairApproveReceiptHash = await pair?.write?.approve([
    routerContractAddress,
    liquidity,
  ]);
  return {
    pairApproveReceiptHash,
  };
}

export async function removeLiquidity(
  address1: Address,
  address2: Address,
  liquidity_tokens: string,
  amount1min: string,
  amount2min: string,
  wethAddress: Address,
  routerContract: ReturnType<typeof useRouterContract>,
  account: Address,
  token1: ReturnType<typeof useERC20>,
  token2: ReturnType<typeof useERC20>,
) {
  const token1Decimals = await getDecimalsERC20(token1);
  const token2Decimals = await getDecimalsERC20(token2);

  const amount1Min = ethers.utils.parseUnits(amount1min, token1Decimals);
  const amount2Min = ethers.utils.parseUnits(amount2min, token2Decimals);

  const time = Math.floor(Date.now() / 1000) + 200000;
  const deadline = ethers.BigNumber.from(time);

  const Getliquidity = (liquidity_tokens: number) => {
    if (liquidity_tokens < 0.001) {
      return ethers.BigNumber.from(liquidity_tokens * 10 ** 18);
    }
    return ethers.utils.parseUnits(String(liquidity_tokens), 18);
  };

  const liquidity = Getliquidity(Number(liquidity_tokens));

  if (address1 === wethAddress) {
    const realApproveReceiptHash =
      await routerContract?.write?.removeLiquidityETH([
        address2,
        liquidity,
        amount1Min,
        amount2Min,
        account,
        deadline,
      ]);
    return realApproveReceiptHash;
  } else if (address2 === wethAddress) {
    const realApproveReceiptHash =
      await routerContract?.write?.removeLiquidityETH([
        address1,
        liquidity,
        amount1Min,
        amount2Min,
        account,
        deadline,
      ]);
    return realApproveReceiptHash;
  } else {
    const realApproveReceiptHash = await routerContract?.write?.removeLiquidity(
      [
        address1,
        address2,
        liquidity,
        amount1Min,
        amount2Min,
        account,
        deadline,
      ],
    );
    return realApproveReceiptHash;
  }
}
