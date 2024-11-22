import { NetworkTypes } from '@/types';
import { Box, Card, CardHeader, Typography } from '@mui/material';
import React from 'react';
import SwitchButton from './Components/SwitchButton';

interface Props {
  network: NetworkTypes;
}

const Liquidity: React.FC<Props> = ({ network }) => {
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
        <Card sx={{
          width:'33.3%',
          minWidth:'250px'
        }}>
          <CardHeader
            title={
              <Typography variant="h4" style={{ color: 'white' }}>
                <SwitchButton />
              </Typography>
            }
          />
        </Card>
      </Box>
    </>
  );
};

export default Liquidity;
