import SwitchAssetInput from '@/components/transactions/Switch/SwitchAssetInput';
import { CoinListTypes, NetworkTypes } from '@/types';
import {
  allowance,
  getBalanceAndSymbolByWagmi,
} from '@/utils/ethereumInfoFuntion';
import { Box } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Address, formatEther, Hash, zeroAddress } from 'viem';
import {
  useAccount,
  useBalance,
  useChainId,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { useERC20, useLpToken, usePocket } from '@/hooks/useContract';
import LoadingButton from '@mui/lab/LoadingButton';
import { LpTokenAddress, PocketIndexAddress } from '@/constants/network';
import { useSnackbar } from 'notistack';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  approveByindexLPToken,
  getIndexLpTokenBalance,
  sellIndexPart,
} from '@/utils/indexFunction';
import ContentDetail from '@/components/transactions/FlowCommons/ContentDetail';
import Row from '@/components/primitives/Row';
import SellIndexErrors from '@/components/transactions/Index/SellIndexErrors';
interface Props {
  network: NetworkTypes;
}
const RemoveIndex: React.FC<Props> = ({ network }) => {
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
  const [lpTokenBalance, setLpTokenBalance] = useState<string>('');
  // lptoken approve receipt
  const [approveByLpTokenReceipt, setApproveByLpTokenReceipt] =
    useState<Hash>();
  // index sell receipt hash
  const [sellIndexReceipt, setSellIndexReceipt] = useState<Hash>();

  // erc20 contract instance
  const erc20TokenInputContract = useERC20(selectedInputToken.address);
  // pocket contract insatance
  const pocketIndexContract = usePocket(PocketIndexAddress);
  // lp contract instance
  const lpTokenContract = useLpToken(LpTokenAddress);

  const { isSuccess: isSellIndexSuccess, isPending: isSellIndexPending } =
    useWaitForTransactionReceipt({
      hash: sellIndexReceipt,
    });

  // approve indexContract by lpToken
  const {
    isSuccess: isApproveByLpTokenSuccess,
    isPending: isApproveByLpTokenPending,
  } = useWaitForTransactionReceipt({
    hash: approveByLpTokenReceipt,
  });

  // get lpToken balance
  const handleGetLpTokenBalance = useCallback(async () => {
    const res = await getIndexLpTokenBalance(
      lpTokenContract,
      userAddress as Address,
    );
    console.log(formatEther(res), '我看看结果');
    setLpTokenBalance(formatEther(res));
  }, [lpTokenContract, userAddress]);

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
      parsedInput1 <= parseFloat(lpTokenBalance)
    );
  }, [inputAmount, selectedInputToken.address, lpTokenBalance]);

  const remove = async () => {
    setButtonLoading(true);
    try {
      const { approveHash } = await approveByindexLPToken(
        lpTokenContract,
        inputAmount,
        PocketIndexAddress,
      );
      setApproveByLpTokenReceipt(approveHash);
      console.log(approveHash, '看看你');
    } catch (e) {
      console.log('error content:', e);
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
      setSellIndexReceipt(receipHx);
    } catch {
      enqueueSnackbar('Approve Failed', {
        variant: 'error',
        autoHideDuration: 10000,
      });
      setApproveByLpTokenReceipt(undefined);
    }
  }, [
    erc20TokenInputContract,
    inputAmount,
    userAddress,
    pocketIndexContract,
    enqueueSnackbar,
  ]);

  const formatBalance = (balance: string, symbol: string) => {
    if (balance && symbol) {
      return parseFloat(balance).toPrecision(6) + ' ' + symbol;
    } else return '0.0';
  };

  // get selected token balance
  useEffect(() => {
    if (
      userAddress !== zeroAddress &&
      balanceData &&
      erc20TokenInputContract?.address !== zeroAddress
    ) {
      handleGetInputSymbolAndBalance();
    }
  }, []);

  // get lp token balance
  useEffect(() => {
    if (lpTokenContract?.address !== zeroAddress) {
      handleGetLpTokenBalance();
    }
  }, [handleGetLpTokenBalance, lpTokenContract?.address]);

  // after approve token, call sell index
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

  useEffect(() => {
    if (isSellIndexSuccess && !isSellIndexPending) {
      setButtonLoading(false);
      enqueueSnackbar('Sell sellIndexReceipt Successful', {
        variant: 'success',
      });
      setSellIndexReceipt(undefined);
    }
  }, [isSellIndexSuccess, isSellIndexPending, enqueueSnackbar]);

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

        <Box
          sx={{
            width: '100%',
          }}
        >
          <ContentDetail>
            <Row caption={`IndexLPToken Balance`} captionVariant="caption">
              {formatBalance(lpTokenBalance, 'ILPToken')}
            </Row>
          </ContentDetail>
        </Box>
        <SellIndexErrors
          inputAmount={inputAmount}
          balance={lpTokenBalance}
          content="Your indexLpToken is lower than the input amount."
        />

        <LoadingButton
          variant="contained"
          sx={{
            width: '100%',
          }}
          startIcon={<RemoveIcon />}
          disabled={!isButtonDisable}
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
