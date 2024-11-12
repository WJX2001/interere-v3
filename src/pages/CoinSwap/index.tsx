import ConectWalletPaper from '@/components/ConectWalletPaper';
import { ContentContainer } from '@/components/ContentContainer';
import SwitchAssetInput from '@/components/transactions/Switch/SwitchAssetInput';
import { COINLISTS } from '@/constants';
import { TokenInfoTypes } from '@/types';
import { SwitchVerticalIcon } from '@heroicons/react/solid';
import {
  Box,
  Button,
  IconButton,
  Paper,
  SvgIcon,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useAccount, useChainId } from 'wagmi';
const CoinSwap = ({network}) => {
  console.log(network,'来了啊')
  const { isConnected } = useAccount();
  const currentChainId = useChainId();
  const [inputAmount, setInputAmount] = useState('');
  const [selectedInputToken, setSelectedInputToken] = useState(COINLISTS[0]);
  const [selectedOutputToken, setSelectedOutputToken] = useState(COINLISTS[3]);
  const handleSelectedInputToken = (token: TokenInfoTypes) => {
    setSelectedInputToken(token);
  };

  const handleSelectedOutputToken = (token: TokenInfoTypes) => {
    setSelectedOutputToken(token);
  };

  const handleInputChange = (value: string) => {
    if (value === '-1') {
      // setInputAmount('')
      // TODO: 这里需要补充余额逻辑和防抖逻辑
    } else {
      setInputAmount(value);
    }
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
              value=""
              chainId={currentChainId}
              selectedAsset={selectedOutputToken}
              disableInput={true}
              assets={COINLISTS?.filter(
                (token) => token.address !== selectedInputToken.address,
              )}
              onSelect={handleSelectedOutputToken}
            />
          </Box>
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
        </Paper>
      </Box>
    </>
  );
};

export default CoinSwap;
