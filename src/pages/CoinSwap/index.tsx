// import LoadingButton from '@/components/primitives/LoadingButton';
import SwitchAssetInput from '@/components/transactions/Switch/SwitchAssetInput';
import SwitchErrors from '@/components/transactions/Switch/SwitchErrors';
import { COINLISTS } from '@/constants';
import { CoinListTypes, NetworkTypes } from '@/types';
import {
  getBalanceAndSymbolByWagmi,
  getDecimalsERC20,
} from '@/utils/ethereumInfoFuntion';
import { SwitchVerticalIcon } from '@heroicons/react/solid';
import {
  Box,
  Divider,
  Grid2,
  IconButton,
  Paper,
  SvgIcon,
  Typography,
} from '@mui/material';
import { ethers } from 'ethers';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Address, formatUnits } from 'viem';
import { useAccount, useBalance, useChainId } from 'wagmi';
import {
  useERC20,
  useGetReserves,
} from '@/hooks/useContract';
import { uuid } from '@/utils';
import SwapButton from '@/components/transactions/Button/SwapButton';
interface Props {
  network: NetworkTypes;
}
const CoinSwap: React.FC<Props> = ({ network }) => {
  const currentChainId = useChainId();
  const { address: userAddress } = useAccount();
  const balanceData = useBalance({
    address: userAddress,
  });

  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  const [selectedInputToken, setSelectedInputToken] = useState<CoinListTypes>(
    network.coins[0],
  );
  const [selectedOutputToken, setSelectedOutputToken] = useState<CoinListTypes>(
    network.coins[3],
  );
  const [debounceInputAmount, setDebounceInputAmount] = useState('');
  const [outputLoading, setOutputLoading] = useState<boolean>(true);
  const [randomNumber, setRandomNumber] = useState<string>(uuid());
  const erc20TokenInputContract = useERC20(selectedInputToken.address);
  const erc20TokenOutputContract = useERC20(selectedOutputToken.address);
  // obtain token reserve
  const { reserveArr } = useGetReserves(
    selectedInputToken.address,
    selectedOutputToken.address,
    network.factory,
  );
  const [reserves, setReserves] = useState<string[]>(reserveArr);

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
    network,
    balanceData,
    selectedInputToken,
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
    network,
    balanceData,
    selectedOutputToken,
    erc20TokenOutputContract,
  ]);

  useEffect(() => {
    handleGetInputSymbolAndBalance();
    handleGetOutputSymbolAndBalance();
  }, [randomNumber]);

  useEffect(() => {
    const coinTimeout = setTimeout(() => {
      if (selectedInputToken.address) {
        handleGetInputSymbolAndBalance();
      }
      if (selectedOutputToken.address) {
        handleGetOutputSymbolAndBalance();
      }
    }, 20000);
    return () => clearTimeout(coinTimeout);
  });

  const handleGetAmount = useCallback(async () => {
    try {
      const decimal1 = await getDecimalsERC20(erc20TokenInputContract);
      const decimal2 = await getDecimalsERC20(erc20TokenOutputContract);
      const amountIn = ethers.utils.parseUnits(debounceInputAmount, decimal1);
      const values_out = (await network?.router?.read.getAmountsOut([
        amountIn,
        [selectedInputToken.address, selectedOutputToken.address],
      ])) as bigint[];
      const amount_out = formatUnits(values_out[1], decimal2);
      setOutputAmount(amount_out);
      setOutputLoading(false);
    } catch {
      setOutputAmount('0xNA');
      setOutputLoading(false);
    }
  }, [
    debounceInputAmount,
    erc20TokenInputContract,
    erc20TokenOutputContract,
    selectedOutputToken,
    selectedInputToken,
    network,
  ]);

  useEffect(() => {
    if (isNaN(parseFloat(debounceInputAmount))) {
      setOutputAmount('');
    } else if (
      parseFloat(debounceInputAmount) &&
      selectedInputToken?.address &&
      selectedOutputToken?.address
    ) {
      handleGetAmount();
      setOutputLoading(true);
    }
  }, [
    debounceInputAmount,
    selectedInputToken?.address,
    selectedOutputToken?.address,
    handleGetAmount,
  ]);

  const formatReserve = (reserve: string, symbol: string) => {
    if (reserve && symbol) return reserve + ' ' + symbol;
    else return '0.0';
  };

  const handleSelectedInputToken = (token: CoinListTypes) => {
    setSelectedInputToken(token);
    setRandomNumber(uuid());
  };

  const handleSelectedOutputToken = (token: CoinListTypes) => {
    setSelectedOutputToken(token);
    setRandomNumber(uuid());
  };

  const handleInputChange = async (value: string) => {
    if (value === '-1') {
      setInputAmount(selectedInputToken?.balance as string);
      debouncedInputChange(value);
    } else {
      setInputAmount(value);
      debouncedInputChange(value);
    }
  };

  const debouncedInputChange = useMemo(() => {
    return debounce((value: string) => {
      setDebounceInputAmount(value);
    }, 300);
  }, [setDebounceInputAmount]);

  // switch reverse
  const onSwitchReserves = () => {
    const fromToken = selectedInputToken;
    const toToken = selectedOutputToken;
    setInputAmount(outputAmount);
    setDebounceInputAmount(outputAmount);
    setSelectedInputToken(toToken);
    setSelectedOutputToken(fromToken);
    setReserves(reserves.reverse());
  };

  return (
    <>
      <Box
        sx={(theme) => ({
          paddingTop: theme.spacing(12),
          display: 'flex', // 启用弹性布局
          justifyContent: 'center', // 水平居中
          alignItems: 'center', // 垂直居中
        })}
      >
        <Paper
          sx={(theme) => ({
            // maxWidth: '380px',
            padding: theme.spacing(6),
            maxWidth: { xs: '359px', xsm: '420px' },
            maxHeight: 'calc(100vh - 20px)',
            overflowY: 'auto',
            width: '100%',
          })}
        >
          <Typography variant="h2" sx={{ mb: 6 }}>
            Switch tokens
          </Typography>
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
            <IconButton
              onClick={onSwitchReserves}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                position: 'absolute',
                backgroundColor: 'background.paper',
                '&:hover': { backgroundColor: 'background.surface' },
              }}
            >
              <SvgIcon
                sx={{
                  color: 'primary.main',
                  fontSize: '18px',
                }}
              >
                <SwitchVerticalIcon />
              </SvgIcon>
            </IconButton>
            <SwitchAssetInput
              value={outputAmount}
              loading={
                debounceInputAmount !== '0' &&
                debounceInputAmount !== '' &&
                outputLoading
              }
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
          </Box>
          <Divider sx={{ mt: 4 }} />
          <SwitchErrors
            balance={selectedInputToken?.balance as string}
            inputAmount={inputAmount}
          />
          <Box
            sx={{
              marginTop: '38px',
              display: 'flex',
              alignContent: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <SwapButton
              token1Address={selectedInputToken.address}
              token2Address={selectedOutputToken.address}
              inputAmount={inputAmount}
              erc20TokenInputContract={erc20TokenInputContract}
              network={network}
              userAddress={userAddress as Address}
              setInputAmount={setInputAmount}
              setDebounceInputAmount={setDebounceInputAmount}
            />
          </Box>

          {/* <SwapPoolErros / */}
        </Paper>
      </Box>
    </>
  );
};

export default CoinSwap;
