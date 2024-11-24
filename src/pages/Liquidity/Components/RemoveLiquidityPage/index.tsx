import SwitchAssetInput from '@/components/transactions/Switch/SwitchAssetInput';
import { COINLISTS } from '@/constants';
import { useERC20, useGetReserves } from '@/hooks/useContract';
import { CoinListTypes, NetworkTypes } from '@/types';
import { uuid } from '@/utils';
import { getBalanceAndSymbolByWagmi } from '@/utils/ethereumInfoFuntion';
import { quoteRemoveLiquidity } from '@/utils/LiquidityFunction';
import {
  Box,
  CircularProgress,
  Divider,
  Grid2,
  Paper,
  Typography,
} from '@mui/material';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Address, zeroAddress } from 'viem';
import { useAccount, useBalance, useChainId } from 'wagmi';
// import AddLiquidityButton from '../AddLiquidityButton';

interface Props {
  network: NetworkTypes;
}

const RemoveLiquidityPage: React.FC<Props> = ({ network }) => {
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
  const { reserveArr, pairContract, hasError } = useGetReserves(
    selectedInputToken.address,
    selectedOutputToken.address,
    network.factory,
  );
  // Stores the user's balance of liquidity tokens for the current pair
  const erc20TokenInputContract = useERC20(selectedInputToken.address);
  const erc20TokenOutputContract = useERC20(selectedOutputToken.address);
  const [inputAmount, setInputAmount] = useState('');

  const [randomNumber, setRandomNumber] = useState<string>(uuid());
  // Used when getting a quote of liquidity
  const [tokenInLoading, setTokenLoading] = useState<boolean>(false);

  // Stores the input and output for the liquidity removal preview
  const [tokensOut, setTokensOut] = useState([0, 0, 0]);

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

  const handleSelectedOutputToken = (token: CoinListTypes) => {
    setSelectedOutputToken(token);
    setRandomNumber(uuid());
  };

  const formatReserve = (reserve: string, symbol: string) => {
    if (reserve && symbol) return reserve + ' ' + symbol;
    else return '0.0';
  };

  // Turns the account's balance into something nice and readable
  const formatBalance = (balance: string, symbol: string) => {
    if (balance && symbol)
      return parseFloat(balance).toPrecision(8) + ' ' + symbol;
    else return '0.0';
  };

  const isButtonEnabled = useMemo(() => {
    const parsedInput1 = parseFloat(inputAmount);
    if (hasError) {
      return false;
    }
    return (
      selectedInputToken.address &&
      selectedOutputToken.address &&
      !isNaN(parsedInput1) &&
      0 < parsedInput1 &&
      parsedInput1 <= Number(reserveArr[2])
    );
  }, [
    inputAmount,
    selectedInputToken,
    selectedOutputToken,
    reserveArr,
    hasError,
  ]);

  const handleRemoveLiquidity = useCallback(async () => {
    const res = await quoteRemoveLiquidity(
      Number(inputAmount),
      Number(reserveArr[0]),
      Number(reserveArr[1]),
      network.factory,
      pairContract,
    );
    console.log('你来了终于', res);
    setTokensOut(res);
    setTokenLoading(false);
  }, [inputAmount, network.factory, pairContract, reserveArr]);

  useEffect(() => {
    console.log(isButtonEnabled, 'ni咋回事');
    if (
      isButtonEnabled &&
      reserveArr &&
      network.factory?.address !== zeroAddress &&
      pairContract?.address !== zeroAddress &&
      !hasError
    ) {
      setTokenLoading(true);
      handleRemoveLiquidity();
    }
  }, [
    isButtonEnabled,
    handleRemoveLiquidity,
    hasError,
    network.factory?.address,
    pairContract?.address,
    reserveArr,
  ]);

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
          value={''}
          chainId={currentChainId}
          selectedAsset={selectedOutputToken}
          disableInput={true}
          assets={COINLISTS?.filter(
            (token) => token.address !== selectedInputToken.address,
          )}
          onSelect={handleSelectedOutputToken}
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
              width: '100%',
              overflow: 'wrap',
              background: 'linear-gradient(135deg, #00F260, #0575E6, #6A11CB)',
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
              <Typography
                variant="h3"
                sx={{
                  color: 'white',
                  mb: 3,
                }}
              >
                Tokens Out
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
                    <Typography
                      sx={(theme) => ({
                        color: 'white',
                        padding: theme.spacing(1),
                        overflow: 'wrap',
                        textAlign: 'center',
                      })}
                    >
                      {formatBalance(
                        String(tokensOut[1]),
                        selectedInputToken.symbol,
                      )}
                    </Typography>
                  )}
                </Grid2>
                <Grid2
                  size={6}
                  textAlign={'center'}
                  sx={{
                    textOverflow: 'wrap',
                  }}
                >
                  {tokenInLoading ? (
                    <Box sx={{ flex: 1 }}>
                      <CircularProgress color="inherit" size="16px" />
                    </Box>
                  ) : (
                    <Typography
                      sx={(theme) => ({
                        color: 'white',
                        padding: theme.spacing(1),
                        overflow: 'wrap',
                        textAlign: 'center',
                      })}
                    >
                      {formatReserve(
                        String(tokensOut[2]),
                        selectedOutputToken.symbol,
                      )}
                    </Typography>
                  )}
                </Grid2>
              </Grid2>
              <Divider sx={{ mt: 5, mb: 5, width: '100%' }} />
              <Typography
                variant="h3"
                sx={{
                  color: 'white',
                  mb: 3,
                }}
              >
                Liquidity Pool Tokens in
              </Typography>
              <Grid2
                container
                direction={'row'}
                justifyContent={'center'}
                width={'100%'}
              >
                <Typography
                  sx={(theme) => ({
                    color: 'white',
                    padding: theme.spacing(1),
                    overflow: 'wrap',
                    textAlign: 'center',
                  })}
                >
                  {tokenInLoading ? (
                    <Box sx={{ flex: 1 }}>
                      <CircularProgress color="inherit" size="16px" />
                    </Box>
                  ) : (
                    formatBalance(String(tokensOut[0]), 'UNI-V2')
                  )}
                </Typography>
              </Grid2>
            </Box>
          </Paper>
        </Box>
        {/* <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <AddLiquidityButton
            token1Address={selectedInputToken.address}
            token2Address={selectedOutputToken.address}
            isButtonEnabled={isButtonEnabled}
            inputAmount={inputAmount}
            outputAmount={outputAmount}
            network={network}
            userAddress={userAddress as Address}
            token1={erc20TokenInputContract}
            token2={erc20TokenOutputContract}
            setInputAmount={setInputAmount}
            setOutputAmount={setOutputAmount}
          />
        </Box> */}
      </Box>
    </>
  );
};

export default RemoveLiquidityPage;
