import { useERC20, usePocket } from "@/hooks/useContract";
import { getDecimalsERC20 } from "./ethereumInfoFuntion";
import { Address } from "viem";
import { ethers } from "ethers";


export async function approveByindexLPToken() {
  
}

export async function sellIndexPart(
  pocketContract: ReturnType<typeof usePocket>,
  erc20Contract: ReturnType<typeof useERC20>,
  userAddress: Address,
  amount: string,
) {
  const tokenDecimals = await getDecimalsERC20(erc20Contract);
  const parsedAmount = ethers.utils.parseUnits(amount, tokenDecimals);
  try {
    const res = await pocketContract?.write?.disolveWithLP([
      parsedAmount,
      userAddress,
    ]);
    return {
      receipHx: res,
    };
  } catch (e) {
    console.log(e, '错了啊');
    return {
      receipHx: undefined,
    };
  }
}