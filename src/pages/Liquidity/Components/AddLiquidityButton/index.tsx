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
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [approveReceiptHash1, setApproveReceiptHash1] = useState<Hash>();
  const [approveReceiptHash2, setApproveReceiptHash2] = useState<Hash>();

  const { isSuccess: isApproveToken1Success } = useWaitForTransactionReceipt({
    hash: approveReceiptHash1,
    confirmations:5,
  });

  const { isSuccess: isApproveToken2Success } = useWaitForTransactionReceipt({
    hash: approveReceiptHash2,
    confirmations:5,
  });

  const handleAddLiquidity = useCallback(async () => {
    try {
      await addLiquidity(
        token1Address,
        token2Address,
        inputAmount,
        outputAmount,
        '0',
        '0',
        network?.wethAddress,
        network?.router,
        userAddress,
      );
      setButtonLoading(false);
      enqueueSnackbar('Transaction Successful', { variant: 'success' });
    } catch (err) {
      setButtonLoading(false);
      enqueueSnackbar('Transaction Failed (' + (err as Error).message + ')', {
        variant: 'error',
        autoHideDuration: 10000,
      });
    }
  }, [
    inputAmount,
    outputAmount,
    token1Address,
    token2Address,
    userAddress,
    network?.router,
    network?.wethAddress,
    enqueueSnackbar,
  ]);

  useEffect(() => {
    if (isApproveToken1Success && isApproveToken2Success) {
      console.log("拿到回执")
      handleAddLiquidity();
    }
  }, [isApproveToken1Success, isApproveToken2Success, handleAddLiquidity]);

  const handleGetApproveHash = async () => {
    setButtonLoading(true)
    const { tx1Hash, tx2Hash } = await getPairProveReceipt(
      inputAmount,
      outputAmount,
      network?.router,
      token1,
      token2,
    );
    setApproveReceiptHash1(tx1Hash);
    setApproveReceiptHash2(tx2Hash);
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
