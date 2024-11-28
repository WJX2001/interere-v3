import SwitchAssetInput from '@/components/transactions/Switch/SwitchAssetInput';
import SwitchErrors from '@/components/transactions/Switch/SwitchErrors';
import { CoinListTypes, NetworkTypes } from '@/types';
import {
  allowance,
  getBalanceAndSymbolByWagmi,
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
import { useERC20, useLpToken, usePocket } from '@/hooks/useContract';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  LpTokenAddress,
  PocketIndexAddress,
  pocketIndexAddress,
} from '@/constants/network';
import { useSnackbar } from 'notistack';
import RemoveIcon from '@mui/icons-material/Remove';
import { approveByindexLPToken, sellIndexPart } from '@/utils/indexFunction';
interface Props {
  network: NetworkTypes;
}
const RemoveIndex: React.FC<Props> = ({ network }) => {
  const currentChainId = useChainId();
  const { address: userAddress } = useAccount();
  const balanceData = useBalance({
    address: userAddress,
  });
  const chainId = useChainId();
  const { enqueueSnackbar } = useSnackbar();
  const [inputAmount, setInputAmount] = useState('');
  const [selectedInputToken, setSelectedInputToken] = useState<CoinListTypes>(
    network.coins[0],
  );
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  // lptoken approve receipt
  const [approveByLpTokenReceipt, setApproveByLpTokenReceipt] =
    useState<Hash>();
  const erc20TokenInputContract = useERC20(selectedInputToken.address);
  const pocketIndexContract = usePocket(PocketIndexAddress);
  const lpTokenContract = useLpToken(LpTokenAddress);

  // approve indexContract by lpToken
  const {
    isSuccess: isApproveByLpTokenSuccess,
    isPending: isApproveByLpTokenPending,
  } = useWaitForTransactionReceipt({
    hash: approveByLpTokenReceipt,
  });

  

  const pocketAddress = useMemo(() => {
    return pocketIndexAddress.get(chainId);
  }, [chainId]);

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
        pocketAddress,
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
    pocketAddress,
  ]);

  const handleInputChange = async (value: string) => {
    if (value === '-1') {
      setInputAmount(selectedInputToken?.balance as string);
    } else {
      setInputAmount(value);
    }
  };

  // const isButtonDisable = useMemo(() => {
  //   const parsedInput1 = parseFloat(inputAmount);
  //   return (
  //     selectedInputToken?.address &&
  //     !isNaN(parsedInput1) &&
  //     0 < parsedInput1 &&
  //     parsedInput1 <= parseFloat(selectedInputToken.allowance as string)
  //   );
  // }, [inputAmount, selectedInputToken.address, selectedInputToken.allowance]);

  const remove = async () => {
    setButtonLoading(true);
    try {
      const { approveHash } = await approveByindexLPToken(
        lpTokenContract,
        inputAmount,
        // userAddress as Address,
        PocketIndexAddress
      );
      setApproveByLpTokenReceipt(approveHash);
      console.log(approveHash, '看看你');
    } catch (e) {
      setButtonLoading(false);
      enqueueSnackbar('Approve Failed', {
        variant: 'error',
        autoHideDuration: 10000,
      });
    }

  
  };

  const afterApproveAndSellIndex = useCallback(async () => {
    try {
      const { receipHx } = await sellIndexPart(
        pocketIndexContract,
        erc20TokenInputContract,
        userAddress as Address,
        inputAmount,
      );
    } catch (e) {
      console.log(e, '咋回事');
    }
  }, [erc20TokenInputContract, inputAmount, userAddress, pocketIndexContract]);

  useEffect(() => {
    if (isApproveByLpTokenSuccess && !isApproveByLpTokenPending) {
      console.log('拿到lp批准回执');
      afterApproveAndSellIndex();
    }
  }, [
    isApproveByLpTokenSuccess,
    isApproveByLpTokenPending,
    afterApproveAndSellIndex,
  ]);

  // useEffect(() => {
  //   if (isPitchSuccess && !isPitchPending) {
  //     console.log('拿到回执');
  //     setButtonLoading(false);
  //     enqueueSnackbar('Pitch Successful', { variant: 'success' });
  //     setPitchReceiptHash(undefined);
  //   }
  // }, [isPitchSuccess, isPitchPending, enqueueSnackbar]);

  // useEffect(() => {
  //   if (isApproveSuccess && !isApprovePending) {
  //     console.log('拿到回执');
  //     setButtonLoading(false);
  //     enqueueSnackbar('Approve Successful', { variant: 'success' });
  //     setProveReceiptHash(undefined);
  //   }
  // }, [isApproveSuccess, isApprovePending, setButtonLoading, enqueueSnackbar]);

  useEffect(() => {
    if (
      userAddress !== zeroAddress &&
      balanceData &&
      erc20TokenInputContract?.address !== zeroAddress
    ) {
      handleGetInputSymbolAndBalance();
    }
  }, []);

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
          startIcon={<RemoveIcon />}
          // disabled={!isButtonDisable}
          loading={buttonLoading}
          onClick={remove}
        >
          Sell
        </LoadingButton>
      </Box>
    </>
  );
};

export default RemoveIndex;
