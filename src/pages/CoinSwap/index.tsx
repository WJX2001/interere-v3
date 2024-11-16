import SwapPoolErros from '@/components/transactions/Switch/SwapPoolErros';
import SwitchAssetInput from '@/components/transactions/Switch/SwitchAssetInput';
import SwitchErrors from '@/components/transactions/Switch/SwitchErrors';
import { NetWorkType } from '@/components/Web3Provider';
import { COINLISTS } from '@/constants';
import { BalanceAndSymbol, CoinListTypes, TokenInfoTypes } from '@/types';
import {
  getAmountOut,
  getBalanceAndSymbol,
  getReserves,
} from '@/utils/ethereumInfoFuntion';
import { SwitchVerticalIcon } from '@heroicons/react/solid';
import {
  Box,
  Button,
  IconButton,
  Paper,
  SvgIcon,
  Typography,
} from '@mui/material';
import { Contract, ethers } from 'ethers';
import { debounce } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { Address } from 'viem';
import { useChainId } from 'wagmi';
interface Props {
  network: NetWorkType;
}
const CoinSwap: React.FC<Props> = ({ network }) => {
  const currentChainId = useChainId();
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  const [selectedInputToken, setSelectedInputToken] = useState<CoinListTypes>(
    network.coins[0],
  );
  const [selectedOutputToken, setSelectedOutputToken] = useState<CoinListTypes>(
    network.coins[3],
  );
  const [debounceInputAmount, setDebounceInputAmount] = useState('');

  const [coin1, setCoin1] = useState<{
    address: string | undefined;
    symbol: string | undefined;
    balance: string | undefined;
  }>({
    address: network.coins[0].address,
    symbol: network.coins[0].symbol,
    balance: network.coins[0].balance,
  });

  const [coin2, setCoin2] = useState<{
    address: string | undefined;
    symbol: string | undefined;
    balance: string | undefined;
  }>({
    address: network.coins[3].address,
    symbol: network.coins[3].symbol,
    balance: network.coins[3].balance,
  });

  useEffect(() => {
    setTimeout(() => {
      handleGetInputBlanceAndSymbol(selectedInputToken.address);
      handleGetOutputBlanceAndSymbol(selectedOutputToken.address);
    }, 1000);
  }, []);

  useEffect(() => {
    console.log(
      'Trying to get Reserves between:\n' +
        coin1.address +
        '\n' +
        coin2.address,
    );
    if (coin1.address && coin2.address) {
      getReserves(
        coin1.address,
        coin2.address,
        network.factory as Contract,
        network.signer as ethers.providers.JsonRpcSigner,
        network.account as Address,
      ).then((data) => console.log(data, '王吉祥经济'));
    }
  }, [
    coin1.address,
    coin2.address,
    network.account,
    network.factory,
    network.router,
    network.signer,
  ]);

  // caculate and set selectToken2 balance

  useEffect(() => {
    if (isNaN(parseFloat(debounceInputAmount))) {
      setOutputAmount('');
    } else if (parseFloat(debounceInputAmount) && coin1.address && coin2.address) {
      getAmountOut(
        coin1.address,
        coin2.address,
        debounceInputAmount,
        network.router as Contract,
        network.signer as ethers.providers.JsonRpcSigner,
      )
        .then((amount) => {
          console.log('我看看总额', amount);
          setOutputAmount((amount as number).toFixed(7));
        })
        .catch(() => {
          setOutputAmount("0xNA");
        });
    } else {
      setOutputAmount('');
    }
  }, [debounceInputAmount, coin1.address, coin2.address]);

  const handleSelectedInputToken = (token: TokenInfoTypes) => {
    setSelectedInputToken(token);
    handleGetInputBlanceAndSymbol(token.address);
  };

  const handleSelectedOutputToken = (token: TokenInfoTypes) => {
    setSelectedOutputToken(token);
    handleGetOutputBlanceAndSymbol(token.address);
  };

  const handleInputChange = async (value: string) => {
    if (value === '-1') {
      setInputAmount(selectedInputToken?.balance);
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

  const handleGetInputBlanceAndSymbol = async (address: string | undefined) => {
    const balanceData: BalanceAndSymbol = await getBalanceAndSymbol(
      network.account,
      address,
      network.provider,
      network.signer,
      network.wethAddress,
      network.coins,
    );
    console.log(balanceData, '333');
    setSelectedInputToken((pre) => {
      return {
        ...pre,
        balance: balanceData?.balance,
      };
    });
    setCoin1({
      address: address,
      symbol: balanceData?.symbol,
      balance: balanceData?.balance,
    });
  };

  const handleGetOutputBlanceAndSymbol = async (
    address: string | undefined,
  ) => {
    const balanceData: BalanceAndSymbol = await getBalanceAndSymbol(
      network.account,
      address,
      network.provider,
      network.signer,
      network.wethAddress,
      network.coins,
    );
    console.log(balanceData, '333');
    setSelectedOutputToken((pre) => {
      return {
        ...pre,
        balance: balanceData?.balance,
      };
    });
    setCoin2({
      address: address,
      symbol: balanceData?.symbol,
      balance: balanceData?.balance,
    });
  };

  // switch reverse
  const onSwitchReserves = () => {
    const fromToken = selectedInputToken;
    const toToken = selectedOutputToken;
    setSelectedInputToken(toToken);
    setSelectedOutputToken(fromToken);
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
              // loading={
              //   debounceInputAmount !== '0' && debounceInputAmount !== ''
              // }
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
              chainId={currentChainId}
              selectedAsset={selectedOutputToken}
              disableInput={true}
              assets={COINLISTS?.filter(
                (token) => token.address !== selectedInputToken.address,
              )}
              onSelect={handleSelectedOutputToken}
            />
          </Box>

          {/* <Box>
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
              <Typography variant="h4" sx={{ mt: 6 }}>
                Balance
              </Typography>
            </Box>
            <Grid2 container direction="row" sx={{ textAlign: 'center' }}>
              <Grid2 size={6}>97.000000 GLD</Grid2>
              <Grid2 size={6}>305.98500 USDT</Grid2>
            </Grid2>
          </Box> */}
          <Box
            sx={{
              marginTop: '48px',
              display: 'flex',
              alignContent: 'center',
              justifyContent: 'center',
            }}
          >
            <Button variant="contained" sx={{ width: '100%' }}>
              Switch
            </Button>
          </Box>
          <SwitchErrors
            balance={selectedInputToken.balance}
            inputAmount={inputAmount}
          />
          {/* <SwapPoolErros / */}
        </Paper>
      </Box>
    </>
  );
};

export default CoinSwap;
