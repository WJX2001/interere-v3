import ConectWalletPaper from '@/components/ConectWalletPaper';
import { ContentContainer } from '@/components/ContentContainer';
import SwitchAssetInput from '@/components/transactions/Switch/SwitchAssetInput';
import { SwitchVerticalIcon } from '@heroicons/react/solid';
import {
  Box,
  Button,
  IconButton,
  Paper,
  SvgIcon,
  Typography,
} from '@mui/material';
import React from 'react';
import { useAccount } from 'wagmi';

const CoinSwap = () => {
  const { isConnected } = useAccount();
  return (
    <>
      {isConnected ? (
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
              <SwitchAssetInput />
              <IconButton
                // onClick={onSwitchReserves}
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
              <SwitchAssetInput />
            </Box>
            <Box
              sx={{
                marginTop: '48px',
                display: 'flex',
                alignContent: 'center',
                justifyContent: 'center',
              }}
            >
              <Button variant="contained"  sx={{ width: '100%' }}>
                Switch
              </Button>
            </Box>
          </Paper>
        </Box>
      ) : (
        <ContentContainer>
          <ConectWalletPaper />
        </ContentContainer>
      )}
    </>
  );
};

export default CoinSwap;
