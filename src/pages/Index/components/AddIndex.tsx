import SwitchAssetInput from '@/components/transactions/Switch/SwitchAssetInput';
import SwitchErrors from '@/components/transactions/Switch/SwitchErrors';
import { CoinListTypes, NetworkTypes } from '@/types';
import {
  allowance,
  getApproveHash,
  getBalanceAndSymbolByWagmi,
  pitchAmount,
} from '@/utils/ethereumInfoFuntion';
import { Box, Divider } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Address, Hash, zeroAddress } from 'viem';
import {
  useAccount,
  useBalance,
  useChainId,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { useERC20, usePocket } from '@/hooks/useContract';
import LoadingButton from '@mui/lab/LoadingButton';
import StoreIcon from '@mui/icons-material/Store';
import { PocketIndexAddress } from '@/constants/network';
import { useSnackbar } from 'notistack';
interface Props {
  network: NetworkTypes;
}
const AddIndex: React.FC<Props> = ({ network }) => {
  const currentChainId = useChainId();
  const { address: userAddress } = useAccount();
  const balanceData = useBalance({
    address: userAddress,
  });
  const { enqueueSnackbar } = useSnackbar();
  const [inputAmount, setInputAmount] = useState('');
  const [selectedInputToken, setSelectedInputToken] = useState<CoinListTypes>(
    network.coins[0],
  );
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [proveReceiptHash, setProveReceiptHash] = useState<Hash>();
  const [pitchReceiptHash, setPitchReceiptHash] = useState<Hash>();
  const erc20TokenInputContract = useERC20(selectedInputToken.address);
  const pocketIndexContract = usePocket(PocketIndexAddress);

  const { isSuccess: isApproveSuccess, isPending: isApprovePending } =
    useWaitForTransactionReceipt({
      hash: proveReceiptHash,
    });

  const { isSuccess: isPitchSuccess, isPending: isPitchPending } =
    useWaitForTransactionReceipt({
      hash: pitchReceiptHash,
    });

  const handleGetInputSymbolAndBalance = useCallback(async () => {
    const res = await getBalanceAndSymbolByWagmi(
      userAddress as Address,
      selectedInputToken?.address,
      network.wethAddress,
      network.coins,
      balanceData,
      erc20TokenInputContract,
    );
    if (res) {
      const { balance, symbol } = res;
      const allowanceData = await allowance(
        erc20TokenInputContract,
        PocketIndexAddress,
        userAddress as Address,
      );
      console.log(allowanceData, '我看看');
      setSelectedInputToken((pre) => {
        return {
          ...pre,
          balance,
          symbol,
          allowance: allowanceData,
        };
      });
    }
  }, [
    erc20TokenInputContract,
    userAddress,
    network,
    balanceData,
    selectedInputToken,
  ]);

  const handleInputChange = async (value: string) => {
    if (value === '-1') {
      setInputAmount(selectedInputToken?.balance as string);
    } else {
      setInputAmount(value);
    }
  };

  const isButtonDisable = useMemo(() => {
    const parsedInput1 = parseFloat(inputAmount);
    return (
      selectedInputToken?.address &&
      !isNaN(parsedInput1) &&
      0 < parsedInput1 &&
      parsedInput1 <= parseFloat(selectedInputToken.balance as string)
    );
  }, [inputAmount, selectedInputToken.address, selectedInputToken.balance]);

  const deploy = async () => {
    setButtonLoading(true);
    // usdt的余额 大于 usdt的 allowance 并且 输入的值必须大于 allowance的时候 执行 erc20的approve函数
    if (
      (selectedInputToken?.balance ?? 0) >
        (selectedInputToken?.allowance ?? 0) &&
      inputAmount > (selectedInputToken?.allowance ?? 0)
    ) {
      try {
        const { approveHash } = await getApproveHash(
          erc20TokenInputContract,
          PocketIndexAddress,
          inputAmount,
        );
        setProveReceiptHash(approveHash as Hash);
      } catch (e) {
        setButtonLoading(false);
        enqueueSnackbar('Approve Failed (' + (e as Error).message + ')', {
          variant: 'error',
          autoHideDuration: 10000,
        });
        setProveReceiptHash(undefined);
      }
    } else {
      const { receipHx } = await pitchAmount(
        pocketIndexContract,
        erc20TokenInputContract,
        userAddress as Address,
        inputAmount,
      );
      if (receipHx) {
        setPitchReceiptHash(receipHx);
      } else {
        setButtonLoading(false);
        enqueueSnackbar('Approve Failed', {
          variant: 'error',
          autoHideDuration: 10000,
        });
        setPitchReceiptHash(undefined);
      }
    }
  };
  useEffect(() => {
    if (isPitchSuccess && !isPitchPending) {
      console.log('拿到回执');
      setButtonLoading(false);
      enqueueSnackbar('Pitch Successful', { variant: 'success' });
      setPitchReceiptHash(undefined);
    }
  }, [isPitchSuccess, isPitchPending, enqueueSnackbar]);

  useEffect(() => {
    if (isApproveSuccess && !isApprovePending) {
      console.log('拿到回执');
      setButtonLoading(false);
      enqueueSnackbar('Approve Successful', { variant: 'success' });
      setProveReceiptHash(undefined);
    }
  }, [isApproveSuccess, isApprovePending, setButtonLoading, enqueueSnackbar]);

  useEffect(() => {
    if (
      userAddress !== zeroAddress &&
      balanceData &&
      erc20TokenInputContract?.address !== zeroAddress
    ) {
      handleGetInputSymbolAndBalance();
    }
  }, []);

  useEffect(() => {
    const coinTimeout = setTimeout(() => {
      if (selectedInputToken.address) {
        handleGetInputSymbolAndBalance();
      }
    }, 20000);
    return () => clearTimeout(coinTimeout);
  });

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          gap: '15px',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <SwitchAssetInput
          value={inputAmount}
          chainId={currentChainId}
          selectedAsset={selectedInputToken}
          assets={network?.coins}
          disableSelectToken
          onChange={handleInputChange}
        />

        <Divider sx={{ mt: 4 }} />
        <SwitchErrors
          balance={selectedInputToken?.balance as string}
          inputAmount={inputAmount}
        />

        <LoadingButton
          variant="contained"
          sx={{
            width: '100%',
          }}
          startIcon={<StoreIcon />}
          disabled={!isButtonDisable}
          loading={buttonLoading}
          // onClick={handleGetApproveHash}
          onClick={deploy}
        >
          {(selectedInputToken?.balance ?? 0) >
            (selectedInputToken.allowance ?? 0) &&
          inputAmount > (selectedInputToken.allowance ?? 0)
            ? 'Approve'
            : 'Buy Index'}
        </LoadingButton>
      </Box>
    </>
  );
};

export default AddIndex;
