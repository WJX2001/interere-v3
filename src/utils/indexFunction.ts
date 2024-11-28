import { useERC20, useLpToken, usePocket } from '@/hooks/useContract';
import { getDecimalsERC20 } from './ethereumInfoFuntion';
import { Address } from 'viem';
import { ethers } from 'ethers';

export async function getDecimals(
  token: ReturnType<typeof useLpToken>,
): Promise<number> {
  try {
    const decimals = (await token?.read?.decimals()) as number;
    return decimals;
  } catch {
    console.log('No tokenDecimals function for this token, set to 0');
    return 0;
  }
}

export async function approveByindexLPToken(
  lpTokenContract: ReturnType<typeof useLpToken>,
  amount: string,
  spender: Address,
) {
  const tokenDecimals = await getDecimals(lpTokenContract);
  const parsedAmount = ethers.utils.parseUnits(amount, tokenDecimals);
  const approveHash = await lpTokenContract?.write?.approve([
    spender,
    parsedAmount,
  ]);
  return {
    approveHash,
  };
}

export async function sellIndexPart(
  pocketContract: ReturnType<typeof usePocket>,
  erc20Contract: ReturnType<typeof useERC20>,
  userAddress: Address,
  amount: string,
) {
  const tokenDecimals = await getDecimalsERC20(erc20Contract);
  const parsedAmount = ethers.utils.parseUnits(amount, tokenDecimals);
  const res = await pocketContract?.write?.disolveWithLP([
    parsedAmount,
    userAddress,
  ]);
  return {
    receipHx: res,
  };
}

export async function getIndexLpTokenBalance(
  lpTokenContract: ReturnType<typeof useLpToken>,
  userAddress: Address,
): Promise<bigint> {
  try {
    const balance = await lpTokenContract?.read?.balanceOf([userAddress]);
    console.log(balance);
    return balance as bigint;
  } catch (e) {
    console.log(e, 'error');
    return 0n;
  }
}
