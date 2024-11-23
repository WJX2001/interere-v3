import LoadingButton from '@mui/lab/LoadingButton';
import React, { useCallback, useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { addLiquidity, getPairProveReceipt } from '@/utils/LiquidityFunction';
import { NetworkTypes } from '@/types';
import { useERC20 } from '@/hooks/useContract';
import { Hash } from 'viem';
import { useWaitForTransactionReceipt } from 'wagmi';
import { Address } from 'viem';
import { useSnackbar } from 'notistack';
import { BigNumber } from 'ethers';

interface Props {
  token1Address: Address;
  token2Address: Address;
  isButtonEnabled: boolean;
  inputAmount: string;
  outputAmount: string;
  network: NetworkTypes;
  userAddress: Address;
  token1: ReturnType<typeof useERC20>;
  token2: ReturnType<typeof useERC20>;
  setInputAmount: (value: string) => void;
  setOutputAmount: (value: string) => void;
}

const AddLiquidityButton: React.FC<Props> = (props) => {
  const {
    isButtonEnabled,
    inputAmount,
    outputAmount,
    network,
    token1,
    token2,
    token1Address,
    token2Address,
    userAddress,
    setInputAmount,
    setOutputAmount,
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [approveReceiptHash1, setApproveReceiptHash1] = useState<Hash>();
  const [approveReceiptHash2, setApproveReceiptHash2] = useState<Hash>();
  const [addLiquidityReceiptHash, setAddLiquidityReceiptHash] =
    useState<Hash>();
  const [amountIn1Bigint, setAmountIn1Bigint] = useState<BigNumber>();
  const [amountIn2Bigint, setAmountIn2Bigint] = useState<BigNumber>();

  const { isSuccess: isApproveToken1Success, isPending: tx1Pending } =
    useWaitForTransactionReceipt({
      hash: approveReceiptHash1,
    });

  const { isSuccess: isApproveToken2Success, isPending: tx2Pending } =
    useWaitForTransactionReceipt({
      hash: approveReceiptHash2,
    });
  const { isSuccess: isAddLiquiditySuccess, isPending: tx3Pending } =
    useWaitForTransactionReceipt({
      hash: addLiquidityReceiptHash,
    });

  useEffect(() => {
    console.log(isAddLiquiditySuccess, '你咋了');
    console.log(tx3Pending, '你咋了2');
    if (isAddLiquiditySuccess && !tx3Pending) {
      setButtonLoading(false);
      setInputAmount('');
      setOutputAmount('');
      enqueueSnackbar('Transaction Successful', { variant: 'success' });
    } else if (!isAddLiquiditySuccess) {
      setButtonLoading(false);
      setInputAmount('');
      setOutputAmount('');
      enqueueSnackbar('Transaction Failed', {
        variant: 'error',
        autoHideDuration: 10000,
      });
    }
  }, [
    isAddLiquiditySuccess,
    tx3Pending,
    setInputAmount,
    setOutputAmount,
    enqueueSnackbar,
  ]);

  const handleAddLiquidity = useCallback(async () => {
    try {
      const addLiquidityHx = await addLiquidity(
        token1Address,
        token2Address,
        amountIn1Bigint as BigNumber,
        amountIn2Bigint as BigNumber,
        '0',
        '0',
        network?.wethAddress,
        network?.router,
        userAddress,
      );
      setAddLiquidityReceiptHash(addLiquidityHx);
      // setButtonLoading(false);
      // setInputAmount('');
      // setOutputAmount('');
      // enqueueSnackbar('Transaction Successful', { variant: 'success' });
    } catch (err) {
      setButtonLoading(false);
      enqueueSnackbar('Transaction Failed (' + (err as Error).message + ')', {
        variant: 'error',
        autoHideDuration: 10000,
      });
      setInputAmount('');
      setOutputAmount('');
    }
  }, [
    token1Address,
    token2Address,
    userAddress,
    network?.router,
    network?.wethAddress,
    amountIn1Bigint,
    amountIn2Bigint,
    enqueueSnackbar,
    setInputAmount,
    setOutputAmount,
  ]);

  useEffect(() => {
    if (
      isApproveToken1Success &&
      isApproveToken2Success &&
      !tx1Pending &&
      !tx2Pending &&
      inputAmount &&
      outputAmount
    ) {
      console.log('拿到回执');
      handleAddLiquidity();
    }
  }, [
    isApproveToken1Success,
    isApproveToken2Success,
    handleAddLiquidity,
    tx1Pending,
    tx2Pending,
    inputAmount,
    outputAmount,
  ]);

  const handleGetApproveHash = async () => {
    setButtonLoading(true);
    const { tx1Hash, tx2Hash, amountIn1, amountIn2 } =
      await getPairProveReceipt(
        inputAmount,
        outputAmount,
        network?.router,
        token1,
        token2,
      );
    setApproveReceiptHash1(tx1Hash);
    setApproveReceiptHash2(tx2Hash);
    setAmountIn1Bigint(amountIn1);
    setAmountIn2Bigint(amountIn2);
  };

  return (
    <>
      <LoadingButton
        variant="contained"
        sx={{
          mt: 5,
          width: '100%',
        }}
        loading={buttonLoading}
        disabled={!isButtonEnabled || buttonLoading}
        startIcon={<AddIcon />}
        onClick={handleGetApproveHash}
      >
        Add Liquidity
      </LoadingButton>
    </>
  );
};

export default AddLiquidityButton;
