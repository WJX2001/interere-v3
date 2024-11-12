import { Box, Paper, PaperProps, Typography } from '@mui/material';
import React, { ReactNode } from 'react';
import LandingGhost from '@/assets/resting-gho-hat-purple.svg'
import { ConnectButton } from '@rainbow-me/rainbowkit';
interface ConnectWalletPaperProps extends PaperProps {
  description?: ReactNode;
}

const ChangeNetWorkPaper = ({
  description,
  sx,
  ...rest
}: ConnectWalletPaperProps) => {
  return (
    <Paper
      {...rest}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        p: 4,
        flex: 1,
        ...sx,
      }}
    >
      <Box>
        <img src={LandingGhost} />
      </Box>
      <>
        <Typography variant="h2" sx={{ mb: 2 }}>
        NetWork Error
        </Typography>
        <Typography sx={{ mb: 6 }} color="text.secondary">
          {description || (
            <p>
              Please switch your network to ModeTestNet
            </p>
          )}
        </Typography>
        <ConnectButton />
      </>
    </Paper>
  );
};

export default ChangeNetWorkPaper;
