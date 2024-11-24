import LoadingButton from '@mui/lab/LoadingButton';
import React, { useCallback, useEffect, useState } from 'react';
import {
  getPairContractApproveReceipt,
  removeLiquidity,
} from '@/utils/LiquidityFunction';
import { NetworkTypes } from '@/types';
import { useERC20, usePair } from '@/hooks/useContract';
import { Hash } from 'viem';
import { useWaitForTransactionReceipt } from 'wagmi';
import { Address } from 'viem';
import { useSnackbar } from 'notistack';
import RemoveIcon from '@mui/icons-material/Remove';
interface Props {
  token1Address: Address;
  token2Address: Address;
  isButtonEnabled: boolean;
  inputAmount: string;
  network: NetworkTypes;
  userAddress: Address;
  token1: ReturnType<typeof useERC20>;
  token2: ReturnType<typeof useERC20>;
  pairContract: ReturnType<typeof usePair>;
  setInputAmount: (value: string) => void;
}

const RemoveLiquidityButton: React.FC<Props> = (props) => {
  const {
    isButtonEnabled,
    inputAmount,
    network,
    token1,
    token2,
    token1Address,
    token2Address,
    userAddress,
    pairContract,
    setInputAmount,
  } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [proveReceiptHash, setProveReceiptHash] = useState<Hash>();
  const [realRemoveLiquidityHash, setRealRemoveLiquidityHash] =
    useState<Hash>();

  const { isSuccess: isRemoveLiquiditySuccess, isPending: tx3Pending } =
    useWaitForTransactionReceipt({
      hash: realRemoveLiquidityHash,
    });
  const { isSuccess: isPariApproveHash, isPending: txPariApprovePending } =
    useWaitForTransactionReceipt({
      hash: proveReceiptHash,
    });

  const handleRemoveLiquidity = useCallback(async () => {
    try {
      const realApproveReceiptHash = await removeLiquidity(
        token1Address,
        token2Address,
        inputAmount,
        '0',
        '0',
        network?.wethAddress,
        network?.router,
        userAddress,
        token1,
        token2,
      );
      setRealRemoveLiquidityHash(realApproveReceiptHash);
    } catch (err) {
      setButtonLoading(false);
      enqueueSnackbar('Transaction Failed (' + (err as Error).message + ')', {
        variant: 'error',
        autoHideDuration: 10000,
      });
      setInputAmount('');
    }
  }, [
    inputAmount,
    network?.router,
    network?.wethAddress,
    token1,
    token2,
    token1Address,
    token2Address,
    userAddress,
    setInputAmount,
    enqueueSnackbar,
  ]);

  const handleGetApproveHash = useCallback(async () => {
    setButtonLoading(true);
    const { pairApproveReceiptHash } = await getPairContractApproveReceipt(
      inputAmount,
      pairContract,
      network?.router?.address as Address,
    );
    setProveReceiptHash(pairApproveReceiptHash);
  }, [inputAmount, network?.router?.address, pairContract]);

  useEffect(() => {
    if (isPariApproveHash && !txPariApprovePending && inputAmount) {
      console.log('拿到回执');
      handleRemoveLiquidity();
    }
  }, [
    isPariApproveHash,
    txPariApprovePending,
    handleRemoveLiquidity,
    inputAmount,
  ]);
  useEffect(() => {
    if (isRemoveLiquiditySuccess && !tx3Pending && inputAmount) {
      setButtonLoading(false);
      setInputAmount('');
      enqueueSnackbar('Transaction Successful', { variant: 'success' });
    }
  }, [
    isRemoveLiquiditySuccess,
    tx3Pending,
    setInputAmount,
    enqueueSnackbar,
    inputAmount,
  ]);

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
        startIcon={<RemoveIcon />}
        onClick={handleGetApproveHash}
      >
        Remove Liquidity
      </LoadingButton>
    </>
  );
};

export default RemoveLiquidityButton;
