import SwitchAssetInput from '@/components/transactions/Switch/SwitchAssetInput';
import { COINLISTS } from '@/constants';
import { useERC20, useGetReserves } from '@/hooks/useContract';
import { CoinListTypes, NetworkTypes } from '@/types';
import { uuid } from '@/utils';
import { getBalanceAndSymbolByWagmi } from '@/utils/ethereumInfoFuntion';
import { quoteAddLiquidity } from '@/utils/LiquidityFunction';
import {
  Box,
  CircularProgress,
  Divider,
  Grid2,
  Paper,
  Typography,
} from '@mui/material';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Address } from 'viem';
import { useAccount, useBalance, useChainId } from 'wagmi';

interface Props {
  network: NetworkTypes;
}

const AddLiquidityPage: React.FC<Props> = ({ network }) => {
  const { address: userAddress } = useAccount();
  const balanceData = useBalance({
    address: userAddress,
  });
  const currentChainId = useChainId();
  const [selectedInputToken, setSelectedInputToken] = useState<CoinListTypes>(
    network.coins[0],
  );
  const [selectedOutputToken, setSelectedOutputToken] = useState<CoinListTypes>(
    network.coins[3],
  );
  // obtain token reserve
  const { reserveArr, pairContract } = useGetReserves(
    selectedInputToken.address,
    selectedOutputToken.address,
    network.factory,
  );
  const [reserves, setReserves] = useState<string[]>(reserveArr);
  // Stores the user's balance of liquidity tokens for the current pair
  const erc20TokenInputContract = useERC20(selectedInputToken.address);
  const erc20TokenOutputContract = useERC20(selectedOutputToken.address);
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  const [randomNumber, setRandomNumber] = useState<string>(uuid());
  // Used when getting a quote of liquidity
  const [liquidityOut, setLiquidityOut] = useState(['0', '0', '0']);
  const [tokenInLoading, setTokenLoading] = useState<boolean>(false);
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
      setSelectedInputToken((pre) => {
        return {
          ...pre,
          balance,
          symbol,
        };
      });
    }
  }, [
    erc20TokenInputContract,
    userAddress,
    network.wethAddress,
    network.coins,
    balanceData,
    selectedInputToken.address,
  ]);

  const handleGetOutputSymbolAndBalance = useCallback(async () => {
    const res = await getBalanceAndSymbolByWagmi(
      userAddress as Address,
      selectedOutputToken?.address,
      network.wethAddress,
      network.coins,
      balanceData,
      erc20TokenOutputContract,
    );
    if (res) {
      const { balance, symbol } = res;
      setSelectedOutputToken((pre) => {
        return {
          ...pre,
          balance,
          symbol,
        };
      });
    }
  }, [
    userAddress,
    network.wethAddress,
    network.coins,
    balanceData,
    selectedOutputToken.address,
    erc20TokenOutputContract,
  ]);

  useEffect(() => {
    handleGetInputSymbolAndBalance();
    handleGetOutputSymbolAndBalance();
  }, [randomNumber]);

  const handleSelectedInputToken = (token: CoinListTypes) => {
    setSelectedInputToken(token);
    setRandomNumber(uuid());
  };

  const handleInputChange = async (value: string) => {
    if (value === '-1') {
      setInputAmount(selectedInputToken?.balance as string);
    } else {
      setInputAmount(value);
    }
  };

  const handleOutputChange = async (value: string) => {
    if (value === '-1') {
      setOutputAmount(selectedInputToken?.balance as string);
    } else {
      setOutputAmount(value);
    }
  };

  const handleSelectedOutputToken = (token: CoinListTypes) => {
    setSelectedOutputToken(token);
    setRandomNumber(uuid());
  };

  const formatReserve = (reserve: string, symbol: string) => {
    if (reserve && symbol) return reserve + ' ' + symbol;
    else return '0.0';
  };

  const isButtonEnabled = useMemo(() => {
    const parsedInput1 = parseFloat(inputAmount);
    const parsedInput2 = parseFloat(outputAmount);
    if (selectedInputToken.balance && selectedOutputToken.balance) {
      return (
        selectedInputToken.address &&
        selectedOutputToken.address &&
        !isNaN(parsedInput1) &&
        0 < parsedInput1 &&
        !isNaN(parsedInput2) &&
        0 < parsedInput2 &&
        inputAmount <= selectedInputToken.balance &&
        outputAmount <= selectedOutputToken.balance
      );
    } else {
      return false;
    }
  }, [inputAmount, outputAmount, selectedInputToken, selectedOutputToken]);

  const hanldeGetLiquidity = useCallback(async () => {
    const data = await quoteAddLiquidity(
      selectedInputToken.address,
      selectedOutputToken.address,
      inputAmount,
      outputAmount,
      network.factory,
      pairContract,
      erc20TokenInputContract,
      erc20TokenOutputContract,
      reserveArr,
    );
    console.log(data, '你终于来了');
    console.log('TokenA in: ', data[0]);
    console.log('TokenB in: ', data[1]);
    console.log('Liquidity out: ', data[2]);
    setLiquidityOut([data[0], data[1], data[2]]);
    setTokenLoading(false);
  }, [
    selectedInputToken.address,
    selectedOutputToken.address,
    inputAmount,
    outputAmount,
    network.factory,
    pairContract,
    erc20TokenInputContract,
    erc20TokenOutputContract,
    reserveArr,
  ]);

  useEffect(() => {
    if (isButtonEnabled && reserveArr) {
      setTokenLoading(true);
      console.log('wjx你好了', isButtonEnabled);
      hanldeGetLiquidity();
    }
  }, [isButtonEnabled, hanldeGetLiquidity, reserveArr]);

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
          assets={COINLISTS?.filter(
            (token) => token.address !== selectedOutputToken.address,
          )}
          onSelect={handleSelectedInputToken}
          onChange={handleInputChange}
        />
        <SwitchAssetInput
          value={outputAmount}
          chainId={currentChainId}
          selectedAsset={selectedOutputToken}
          assets={COINLISTS?.filter(
            (token) => token.address !== selectedInputToken.address,
          )}
          onSelect={handleSelectedOutputToken}
          onChange={handleOutputChange}
        />
      </Box>
      <Box>
        {/* <Divider sx={{ mt: 4 }} /> */}
        <Box
          sx={{
            display: 'flex',
            gap: '15px',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4,
          }}
        >
          <Typography variant="h3" sx={{ mt: 6 }}>
            Reserves
          </Typography>
        </Box>
        <Grid2 container direction="row" sx={{ textAlign: 'center' }}>
          <Grid2 size={6}>
            {formatReserve(reserveArr[0], selectedInputToken.symbol)}
          </Grid2>
          <Grid2 size={6}>
            {formatReserve(reserveArr[1], selectedOutputToken.symbol)}
          </Grid2>
        </Grid2>
        <Divider sx={{ mt: 4 }} />
      </Box>

      <Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4,
          }}
        >
          <Typography variant="h3" sx={{ mt: 6, mb: 6 }}>
            Liquidity Pool Tokens
          </Typography>
          <Grid2 justifyContent={'center'} direction={'row'} container>
            <Grid2 size={12}>{formatReserve(reserveArr[2], 'UNI-V2')}</Grid2>
          </Grid2>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4,
          }}
        >
          <Paper
            sx={(theme) => ({
              borderRadius: theme.spacing(2),
              padding: theme.spacing(2),
              paddingBottom: theme.spacing(3),
              width: '90%',
              overflow: 'wrap',
              background: 'linear-gradient(135deg, #1B2030, #2A2F4F, #4A4E69)',
              color: 'primary.main',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
            })}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h4" style={{ color: 'white' }}>
                Tokens in
              </Typography>
              <Grid2
                container
                direction={'row'}
                justifyContent={'space-between'}
                width={'100%'}
              >
                <Grid2 size={6} textAlign={'center'}>
                  {tokenInLoading ? (
                    <Box sx={{ flex: 1 }}>
                      <CircularProgress color="inherit" size="16px" />
                    </Box>
                  ) : (
                    formatReserve(liquidityOut[0], selectedInputToken.symbol)
                  )}
                </Grid2>
                <Grid2 size={6} textAlign={'center'}>
                  {tokenInLoading ? (
                    <Box sx={{ flex: 1 }}>
                      <CircularProgress color="inherit" size="16px" />
                    </Box>
                  ) : (
                    formatReserve(liquidityOut[1], selectedOutputToken.symbol)
                  )}
                </Grid2>
              </Grid2>
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default AddLiquidityPage;
