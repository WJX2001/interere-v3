import { Contract, ethers } from 'ethers';
import ERC20 from '@/build/ERC20.json';
import PAIR from '@/build/IUniswapV2Pair.json';
import { Address, formatUnits } from 'viem';
import { CoinListTypes, GetBalanceAndSymbolResult } from '@/types';
import { useERC20, useGetFactory, usePair, useRouterContract } from '@/hooks/useContract';
import { UseBalanceReturnType } from 'wagmi';

export async function getDecimals(token: Contract): Promise<number> {
  const decimals = await token
    .decimals()
    .then((res: number) => {
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
  address: string,
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

// export async function fetchReserves(
//   address1: string,
//   address2: string,
//   pair: Contract,
//   signer: ethers.providers.JsonRpcSigner,
// ) {
//   try {
//     // Get decimals for each coin
//     const coin1 = new Contract(address1, ERC20.abi, signer);
//     const coin2 = new Contract(address2, ERC20.abi, signer);

//     const coin1Decimals = await getDecimals(coin1);
//     const coin2Decimals = await getDecimals(coin2);

//     // Get reserves
//     const reservesRaw = await pair.getReserves();

//     // Put the results in the right order
//     const results = [
//       (await pair.token0()) === address1 ? reservesRaw[0] : reservesRaw[1],
//       (await pair.token1()) === address2 ? reservesRaw[1] : reservesRaw[0],
//     ];

//     // Scale each to the right decimal place
//     return [
//       results[0] * 10 ** -coin1Decimals,
//       results[1] * 10 ** -coin2Decimals,
//     ];
//   } catch (err) {
//     console.log('error!');
//     console.log(err);
//     return [0, 0];
//   }
// }

// export async function getReserves(
//   address1: string,
//   address2: string,
//   factory: Contract,
//   signer: ethers.providers.JsonRpcSigner,
//   accountAddress: Address,
// ) {
//   try {
//     const pairAddress = await factory.getPair(address1, address2);
//     const pair = new Contract(pairAddress, PAIR.abi, signer);

//     if (pairAddress !== '0x0000000000000000000000000000000000000000') {
//       const reservesRaw = await fetchReserves(address1, address2, pair, signer);
//       const liquidityTokens_BN = await pair.balanceOf(accountAddress);
//       const liquidityTokens = Number(
//         ethers.utils.formatEther(liquidityTokens_BN),
//       );

//       return [
//         reservesRaw[0].toPrecision(6),
//         reservesRaw[1].toPrecision(6),
//         liquidityTokens,
//       ];
//     } else {
//       console.log('no reserves yet');
//       return [0, 0, 0];
//     }
//   } catch (err) {
//     console.log('error!');
//     console.log(err);
//     return [0, 0, 0];
//   }
// }

// export async function getAmountOut(
//   address1: string,
//   address2: string,
//   amountIn: string,
//   routerContract: Contract,
//   signer: ethers.providers.JsonRpcSigner,
// ) {
//   try {
//     const token1 = new Contract(address1, ERC20.abi, signer);
//     const token1Decimals = await getDecimals(token1);

//     const token2 = new Contract(address2, ERC20.abi, signer);
//     const token2Decimals = await getDecimals(token2);

//     const values_out = await routerContract.getAmountsOut(
//       ethers.utils.parseUnits(String(amountIn), token1Decimals),
//       [address1, address2],
//     );
//     const amount_out = values_out[1] * 10 ** -token2Decimals;
//     console.log('amount out: ', amount_out);
//     return Number(amount_out);
//   } catch {
//     return false;
//   }
// }

export async function swapTokens(
  address1: string,
  address2: string,
  amount: string,
  routerContract: Contract,
  accountAddress: string,
  signer: ethers.providers.JsonRpcSigner,
) {
  const tokens = [address1, address2];
  const time = Math.floor(Date.now() / 1000) + 200000;
  const deadline = ethers.BigNumber.from(time);

  const token1 = new Contract(address1, ERC20.abi, signer);
  const tokenDecimals = await getDecimals(token1);
  const amountIn = ethers.utils.parseUnits(amount, tokenDecimals);
  const amountOut = await routerContract.callStatic.getAmountsOut(
    amountIn,
    tokens,
  );

  await token1.approve(routerContract.address, amountIn);
  const wethAddress = await routerContract.WETH();

  if (address1 === wethAddress) {
    // Eth -> Token
    await routerContract.swapExactETHForTokens(
      amountOut[1],
      tokens,
      accountAddress,
      deadline,
      { value: amountIn },
    );
  } else if (address2 === wethAddress) {
    // Token -> Eth
    await routerContract.swapExactTokensForETH(
      amountIn,
      amountOut[1],
      tokens,
      accountAddress,
      deadline,
    );
  } else {
    await routerContract.swapExactTokensForTokens(
      amountIn,
      amountOut[1],
      tokens,
      accountAddress,
      deadline,
    );
  }
}

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
      console.log(
        {
          balance: formatUnits(balanceRaw, tokenDicimals),
          symbol: symbol,
        },
        '吉祥啊',
      );
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
    console.log('error!');
    console.log(error);
    return [0, 0];
  }
}

// export async function getReservesPlus(
//   address1: Address,
//   address2: Address,
//   factory: ReturnType<typeof useGetFactory>,
//   accountAddress: Address,
// ) {
//   try {
//     const pairAddress = await factory?.read?.getPair([address1, address2]);

//   }
// }
