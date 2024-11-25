import SwitchAssetInput from '@/components/transactions/Switch/SwitchAssetInput';
import SwitchErrors from '@/components/transactions/Switch/SwitchErrors';
import { CoinListTypes, NetworkTypes } from '@/types';
import {
  allowance,
  getBalanceAndSymbolByWagmi,
} from '@/utils/ethereumInfoFuntion';
import { Box, Divider } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Address, zeroAddress } from 'viem';
import { useAccount, useBalance, useChainId } from 'wagmi';
import { useERC20 } from '@/hooks/useContract';
import LoadingButton from '@mui/lab/LoadingButton';
import StoreIcon from '@mui/icons-material/Store';
interface Props {
  network: NetworkTypes;
}
const AddIndex: React.FC<Props> = ({ network }) => {
  const currentChainId = useChainId();
  const { address: userAddress } = useAccount();
  const balanceData = useBalance({
    address: userAddress,
  });

  const [inputAmount, setInputAmount] = useState('');
  const [selectedInputToken, setSelectedInputToken] = useState<CoinListTypes>(
    network.coins[0],
  );
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  const erc20TokenInputContract = useERC20(selectedInputToken.address);
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
        '0x67Dad3559db28C428B4cE3B5Daf16bf4D53E1210',
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

  const deploy = () => {
    setButtonLoading(true);
    if (
      (selectedInputToken?.balance ?? 0) >
        (selectedInputToken?.allowance ?? 0) &&
      inputAmount > (selectedInputToken?.allowance ?? 0)
    ) {
      console.log(1111111);
    
    }
  };

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
