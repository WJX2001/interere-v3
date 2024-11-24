import {
  useERC20,
  useGetFactory,
  useRouterContract,
} from '@/hooks/useContract';
import { CoinListTypes } from '@/types';
import { getDecimalsERC20, swapTokens } from '@/utils/ethereumInfoFuntion';
import LoadingButton from '@mui/lab/LoadingButton';
import { BigNumber, ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useState } from 'react';
import { Address, Hash, zeroHash } from 'viem';
import { useWaitForTransactionReceipt } from 'wagmi';

interface Props {
  token1Address: Address;
  token2Address: Address;
  inputAmount: string;
  outputAmount: string;
  userAddress: Address;
  coin1Balance: string;
  erc20TokenInputContract: ReturnType<typeof useERC20>;
  network: {
    wethAddress: Address;
    coins: CoinListTypes[];
    factory: ReturnType<typeof useGetFactory>;
    router: ReturnType<typeof useRouterContract>;
  };
  setInputAmount: (value: string) => void;
  setDebounceInputAmount: (value: string) => void;
}

const SwapButton: React.FC<Props> = (props) => {
  const {
    token1Address,
    token2Address,
    inputAmount,
    userAddress,
    erc20TokenInputContract,
    network,
    outputAmount,
    coin1Balance,
    setInputAmount,
    setDebounceInputAmount,
  } = props;
  const [approveHash, setApproveHash] = useState<Hash>();
  const [amountInAll, setAmountInAll] = useState<BigNumber>();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [realSwapHash, setRealSwapHash] = useState<Hash>();

  const { isSuccess, isPending: approvePending } = useWaitForTransactionReceipt(
    {
      hash: approveHash,
    },
  );

  const { isSuccess: isSuccessSwap, isPending: swapPending } =
    useWaitForTransactionReceipt({
      hash: realSwapHash,
    });
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    console.log(isSuccessSwap,'isSuccessSwap')
    console.log(swapPending,'swapPending')
    if (isSuccessSwap && !swapPending) {
      console.log("来了啊")
      setButtonLoading(false);
      setInputAmount('');
      setDebounceInputAmount('');
      setRealSwapHash(undefined)
      setApproveHash(undefined)
      enqueueSnackbar('Transaction Successful', { variant: 'success' });
    }
  }, [
    isSuccessSwap,
    swapPending,
    setDebounceInputAmount,
    setInputAmount,
    enqueueSnackbar,
    inputAmount,
  ]);

  const realSwapHanlde = useCallback(async () => {
    try {
      const realHx = await swapTokens(
        token1Address,
        token2Address,
        network?.wethAddress,
        amountInAll as BigNumber,
        network?.router,
        userAddress,
      );
      setRealSwapHash(realHx);
    } catch (err) {
      setButtonLoading(false);
      setInputAmount('');
      setDebounceInputAmount('');
      setRealSwapHash(undefined)
      setApproveHash(undefined)
      enqueueSnackbar('Transaction Failed (' + (err as Error).message + ')', {
        variant: 'error',
        autoHideDuration: 10000,
      });
    }
  }, [
    amountInAll,
    token1Address,
    token2Address,
    network?.router,
    network?.wethAddress,
    userAddress,
    setDebounceInputAmount,
    setInputAmount,
    enqueueSnackbar,
  ]);

  useEffect(() => {
    if (isSuccess && !approvePending && inputAmount) {
      console.log('isSuccess');
      realSwapHanlde();
    }
  }, [
    isSuccess,
    setDebounceInputAmount,
    setInputAmount,
    enqueueSnackbar,
    inputAmount,
    realSwapHanlde,
    approvePending,
  ]);

  const handleSwap = async () => {
    setButtonLoading(true);
    const tokenDecimals = await getDecimalsERC20(erc20TokenInputContract);
    const amountIn = ethers.utils.parseUnits(inputAmount, tokenDecimals);
    setAmountInAll(amountIn);
    const approveTx = await erc20TokenInputContract?.write?.approve([
      network.router?.address,
      amountIn,
    ]);
    setApproveHash(approveTx);
    console.log('approveTx');
  };

  const isButtonEnabled = () => {
    // If both coins have been selected, and a valid float has been entered which is less than the user's balance, then return true
    const parsedInput1 = parseFloat(inputAmount);
    const parsedInput2 = parseFloat(outputAmount);
    return (
      token1Address &&
      token2Address &&
      !isNaN(parsedInput1) &&
      !isNaN(parsedInput2) &&
      0 < parsedInput1 &&
      parsedInput1 <= parseFloat(coin1Balance)
    );
  };

  return (
    <>
      <LoadingButton
        sx={{ width: '100%' }}
        variant="contained"
        loading={buttonLoading}
        disabled={buttonLoading || !isButtonEnabled()}
        onClick={handleSwap}
      >
        Switch
      </LoadingButton>
    </>
  );
};

export default SwapButton;
