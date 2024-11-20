import {
  useERC20,
  useGetFactory,
  useRouterContract,
} from '@/hooks/useContract';
import { CoinListTypes } from '@/types';
import { getDecimalsERC20 } from '@/utils/ethereumInfoFuntion';
import LoadingButton from '@mui/lab/LoadingButton';
import { BigNumber, ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useState } from 'react';
import { Address, Hash } from 'viem';
import { useWaitForTransactionReceipt } from 'wagmi';

interface Props {
  token1Address: Address;
  token2Address: Address;
  inputAmount: string;
  userAddress: Address;
  erc20TokenInputContract: ReturnType<typeof useERC20>;
  network: {
    wethAddress: Address;
    coins: CoinListTypes[];
    factory: ReturnType<typeof useGetFactory>;
    router: ReturnType<typeof useRouterContract>;
  };
  setInputAmount: (value: string) => void;
  setDebounceInputAmount: (value: string) => void
}

const SwapButton: React.FC<Props> = (props) => {
  const {
    token1Address,
    token2Address,
    inputAmount,
    userAddress,
    erc20TokenInputContract,
    network,
    setInputAmount,
    setDebounceInputAmount
  } = props;
  const [approveHash, setApproveHas] = useState<Hash>();
  const [amountInAll, setAmountInAll] = useState<BigNumber>();
  const [buttonLoading, setButtonLoading] = useState(false);
  const { isSuccess } = useWaitForTransactionReceipt({
    hash: approveHash,
  });
  const { enqueueSnackbar } = useSnackbar();

  const hanldeRealSwap = useCallback(async () => {
    const tokens = [token1Address, token2Address];
    const wethAddress = network.wethAddress;
    const time = Math.floor(Date.now() / 1000) + 200000;
    const deadline = ethers.BigNumber.from(time);
    const amountOut = (await network.router?.read?.getAmountsOut([
      amountInAll,
      tokens,
    ])) as BigNumber[];
    if (token1Address === wethAddress) {
      await network.router?.write?.swapExactETHForTokens([
        amountOut[1],
        tokens,
        userAddress,
        deadline,
        [amountInAll],
      ]);
    } else if (token2Address === wethAddress) {
      await network.router?.write?.swapExactTokensForETH([
        amountInAll,
        amountOut[1],
        tokens,
        userAddress,
        deadline,
      ]);
    } else {
      await network.router?.write?.swapExactTokensForTokens([
        amountInAll,
        amountOut[1],
        tokens,
        userAddress,
        deadline,
      ]);
    }
  }, [amountInAll, network, token1Address, token2Address, userAddress]);

  useEffect(() => {
    if (isSuccess) {
      console.log('isSuccess');
      const tmp = async () => {
        try {
          await hanldeRealSwap();
          setButtonLoading(false);
          setInputAmount("")
          setDebounceInputAmount("")
          enqueueSnackbar('Transaction Successful', { variant: 'success' });
        } catch (err){
          setButtonLoading(false);
          enqueueSnackbar('Transaction Failed (' + (err as Error).message + ')', {
            variant: 'error',
            autoHideDuration: 10000,
          });
        }
      };
      tmp();
    }
  }, [isSuccess, hanldeRealSwap]);

  const handleSwap = async () => {
    setButtonLoading(true);
    const tokenDecimals = await getDecimalsERC20(erc20TokenInputContract);
    const amountIn = ethers.utils.parseUnits(inputAmount, tokenDecimals);
    setAmountInAll(amountIn);
    const approveTx = await erc20TokenInputContract?.write?.approve([
      network.router?.address,
      amountIn,
    ]);
    setApproveHas(approveTx);
    console.log('approveTx');
  };
  return (
    <>
      <LoadingButton
        sx={{ width: '100%' }}
        variant="contained"
        loading={buttonLoading}
        // disabled={loading || !isButtonEnabled()}
        onClick={handleSwap}
      >
        Switch
      </LoadingButton>
    </>
  );
};

export default SwapButton;
