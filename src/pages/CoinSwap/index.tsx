// import LoadingButton from '@/components/primitives/LoadingButton';
import LoadingButton from '@mui/lab/LoadingButton';
import SwitchAssetInput from '@/components/transactions/Switch/SwitchAssetInput';
import SwitchErrors from '@/components/transactions/Switch/SwitchErrors';
import { NetWorkType } from '@/components/Web3Provider';
import { COINLISTS } from '@/constants';
import {
  BalanceAndSymbol,
  CoinListTypes,
  GetBalanceAndSymbolResult,
  TokenInfoTypes,
} from '@/types';
import {
  getAmountOut,
  getBalanceAndSymbol,
  getBalanceAndSymbolByWagmi,
  getDecimalsERC20,
  getReserves,
  swapTokens,
} from '@/utils/ethereumInfoFuntion';
import { SwitchVerticalIcon } from '@heroicons/react/solid';
import {
  Box,
  Button,
  Divider,
  Grid2,
  IconButton,
  Paper,
  SvgIcon,
  Typography,
} from '@mui/material';
import { Contract, ethers } from 'ethers';
import { debounce } from 'lodash';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Address, formatUnits } from 'viem';
import { useAccount, useBalance, useChainId } from 'wagmi';
import {
  useERC20,
  useGetAmountOut,
  useGetFactory,
  useRouterContract,
} from '@/hooks/useContract';
import { uuid } from '@/utils';
interface Props {
  network: {
    wethAddress: Address;
    coins: CoinListTypes[];
    factory: ReturnType<typeof useGetFactory>;
    router: ReturnType<typeof useRouterContract>;
  };
}
const CoinSwap: React.FC<Props> = ({ network }) => {
  const currentChainId = useChainId();
  const { address: userAddress } = useAccount();
  const balanceData = useBalance({
    address: userAddress,
  });

  const { enqueueSnackbar } = useSnackbar();
  const [inputAmount, setInputAmount] = useState('');
  const [outputAmount, setOutputAmount] = useState('');
  const [selectedInputToken, setSelectedInputToken] = useState<CoinListTypes>(
    network.coins[0],
  );
  const [selectedOutputToken, setSelectedOutputToken] = useState<CoinListTypes>(
    network.coins[3],
  );
  const [debounceInputAmount, setDebounceInputAmount] = useState('');

  // Stores the current reserves in the liquidity pool between selectedInputToken and selectedOutputToken
  const [reserves, setReserves] = useState<string[]>(['0.0', '0.0']);
  const [loading, setLoading] = useState<boolean>(false);

  // output loading
  const [outputLoading, setOutputLoading] = useState<boolean>(true);
  const [randomNumber, setRandomNumber] = useState<string>(uuid());
  const erc20TokenInputContract = useERC20(selectedInputToken.address);
  const erc20TokenOutputContract = useERC20(selectedOutputToken.address);
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

  // useEffect(() => {
  //   setTimeout(() => {
  //     handleGetInputBlanceAndSymbol(selectedInputToken.address);
  //     handleGetOutputBlanceAndSymbol(selectedOutputToken.address);
  //   }, 1000);
  // }, []);

  // useEffect(() => {
  //   console.log(
  //     'Trying to get Reserves between:\n' +
  //       selectedInputToken.address +
  //       '\n' +
  //       selectedOutputToken.address,
  //   );
  //   if (selectedInputToken.address && selectedOutputToken.address) {
  //     getReserves(
  //       selectedInputToken.address,
  //       selectedOutputToken.address,
  //       network.factory as Contract,
  //       network.signer as ethers.providers.JsonRpcSigner,
  //       network.account as Address,
  //     ).then((data) => setReserves(data));
  //   }
  // }, [
  //   selectedInputToken.address,
  //   selectedOutputToken.address,
  //   network.account,
  //   network.factory,
  //   network.router,
  //   network.signer,
  // ]);

  // // caculate and set selectToken2 balance

  const fetchData = async () => {
    try {
      const decimal1 = await getDecimalsERC20(erc20TokenInputContract);
      const decimal2 = await getDecimalsERC20(erc20TokenOutputContract);
      const amountIn = ethers.utils.parseUnits(debounceInputAmount, decimal1);
      const values_out = await network?.router?.read.getAmountsOut([
        amountIn,
        [selectedInputToken.address, selectedOutputToken.address],
      ]);
      // const amount_out = 
    } catch {
      setOutputAmount('0xNA');
      setOutputLoading(false);
    }
  };

  useEffect(() => {
    if (isNaN(parseFloat(debounceInputAmount))) {
      setOutputAmount('');
    } else if (
      parseFloat(debounceInputAmount) &&
      selectedInputToken?.address &&
      selectedOutputToken?.address
    ) {
      fetchData();
      setOutputLoading(true);
    }
  }, [
    debounceInputAmount,
    selectedInputToken?.address,
    selectedOutputToken?.address,
  ]);

  // useEffect(() => {
  //   if (isNaN(parseFloat(debounceInputAmount))) {
  //     setOutputAmount('');
  //   } else if (
  //     parseFloat(debounceInputAmount) &&
  //     selectedInputToken.address &&
  //     selectedOutputToken.address
  //   ) {
  //     getAmountOut(
  //       selectedInputToken.address,
  //       selectedOutputToken.address,
  //       debounceInputAmount,
  //       network.router as Contract,
  //       network.signer as ethers.providers.JsonRpcSigner,
  //     )
  //       .then((amount) => {
  //         console.log('我看看总额', amount);
  //         setOutputAmount((amount as number).toFixed(7));
  //       })
  //       .catch(() => {
  //         setOutputAmount('0xNA');
  //       });
  //   } else {
  //     setOutputAmount('');
  //   }
  // }, [
  //   debounceInputAmount,
  //   selectedInputToken.address,
  //   selectedOutputToken.address,
  // ]);

  // useEffect(() => {
  //   const coinTimeout = setTimeout(() => {
  //     console.log('Checking balances...');

  //     if (
  //       selectedInputToken.address &&
  //       selectedOutputToken.address &&
  //       network.account
  //     ) {
  //       getReserves(
  //         selectedInputToken.address,
  //         selectedOutputToken.address,
  //         network.factory,
  //         network.signer,
  //         network.account,
  //       ).then((data) => setReserves(data));
  //     }

  //     if (selectedInputToken.address && network.account) {
  //       getBalanceAndSymbol(
  //         network.account,
  //         selectedInputToken.address,
  //         network.provider,
  //         network.signer as ethers.providers.JsonRpcSigner,
  //         network.weth.address,
  //         network.coins,
  //       ).then((data) => {
  //         setSelectedInputToken({
  //           ...selectedInputToken,
  //           balance: data.balance,
  //         });
  //       });
  //     }
  //     if (selectedOutputToken.address && network.account) {
  //       getBalanceAndSymbol(
  //         network.account,
  //         selectedOutputToken.address,
  //         network.provider,
  //         network.signer as ethers.providers.JsonRpcSigner,
  //         network.weth.address,
  //         network.coins,
  //       ).then((data) => {
  //         setSelectedOutputToken({
  //           ...selectedOutputToken,
  //           balance: data.balance,
  //         });
  //       }).catch((e) => {
  //         console.log(e, 'error')
  //       }) ;
  //     }
  //   }, 10000);

  //   return () => clearTimeout(coinTimeout);
  // });

  // Turns the coin's reserves into something nice and readable
  const formatReserve = (reserve: string, symbol: string) => {
    if (reserve && symbol) return reserve + ' ' + symbol;
    else return '0.0';
  };

  const handleSelectedInputToken = (token: CoinListTypes) => {
    setSelectedInputToken(token);
  };

  const handleSelectedOutputToken = (token: CoinListTypes) => {
    setSelectedOutputToken(token);
    setRandomNumber(uuid())
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

  const handleGetInputBlanceAndSymbol = async (address: string | undefined) => {
    const balanceData: BalanceAndSymbol = await getBalanceAndSymbol(
      network.account as Address,
      address as string,
      network.provider,
      network.signer as ethers.providers.JsonRpcSigner,
      network.wethAddress as Address,
      network.coins,
    );
    setSelectedInputToken((pre) => {
      return {
        ...pre,
        balance: balanceData?.balance,
      };
    });
  };

  const handleGetOutputBlanceAndSymbol = async (address: Address | string) => {
    const balanceData: BalanceAndSymbol = await getBalanceAndSymbol(
      network.account as Address,
      address,
      network.provider,
      network.signer as ethers.providers.JsonRpcSigner,
      network.wethAddress as Address,
      network.coins,
    );
    setSelectedOutputToken((pre) => {
      return {
        ...pre,
        balance: balanceData?.balance,
      };
    });
  };

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

  // Determines whether the button should be enabled or not
  const isButtonEnabled = () => {
    // If both coins have been selected, and a valid float has been entered which is less than the user's balance, then return true
    const parsedInput1 = parseFloat(inputAmount);
    const parsedInput2 = parseFloat(outputAmount);
    if (outputAmount === '0xNA') {
      return false;
    }
    return (
      selectedInputToken.address &&
      selectedOutputToken.address &&
      !isNaN(parsedInput1) &&
      !isNaN(parsedInput2) &&
      0 < parsedInput1 &&
      // @ts-ignore
      parsedInput1 <= selectedInputToken.balance
    );
  };

  // const handleSwap = () => {
  //   console.log('Attempting to swap tokens...');
  //   setLoading(true);
  //   swapTokens(
  //     selectedInputToken.address,
  //     selectedOutputToken.address,
  //     inputAmount,
  //     network.router as Contract,
  //     network.account as Address,
  //     network.signer as ethers.providers.JsonRpcSigner,
  //   )
  //     .then(() => {
  //       setLoading(false);
  //       // If the transaction was successful, we clear to input to make sure the user doesn't accidental redo the transfer
  //       setInputAmount('');
  //       setOutputAmount('');
  //       enqueueSnackbar('Transaction Successful', {
  //         variant: 'success',
  //         autoHideDuration: 10000,
  //       });
  //     })
  //     .catch((e) => {
  //       setLoading(false);
  //       enqueueSnackbar('Transaction Failed (' + e.message + ')', {
  //         variant: 'error',
  //         autoHideDuration: 10000,
  //       });
  //     });
  // };

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
                {formatReserve(reserves[0], selectedInputToken.symbol)}
              </Grid2>
              <Grid2 size={6}>
                {formatReserve(reserves[1], selectedOutputToken.symbol)}
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
            {/* <Button variant="contained" sx={{ width: '100%' }}>
              Switch
            </Button> */}
            {/* <LoadingButton
              // loading={loading}
              loading={true}
              valid={isButtonEnabled()}
              onClick={handleSwap}
              // sx={{

              // }}
            >
              Switch
            </LoadingButton> */}
            {/* <LoadingButton
              sx={{ width: '100%' }}
              variant="contained"
              loading={loading}
              disabled={loading || !isButtonEnabled()}
              onClick={handleSwap}
            >
              Switch
            </LoadingButton> */}
          </Box>

          {/* <SwapPoolErros / */}
        </Paper>
      </Box>
    </>
    // <>22222</>
  );
};

export default CoinSwap;
