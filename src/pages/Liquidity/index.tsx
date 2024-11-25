import { NetworkTypes } from '@/types';
import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import React, { useState } from 'react';
import SwitchButton from './Components/SwitchButton';
import AddLiquidityPage from './Components/AddLiquidityPage';
import RemoveLiquidityPage from './Components/RemoveLiquidityPage';

interface Props {
  network: NetworkTypes;
}

const Liquidity: React.FC<Props> = ({ network }) => {
  const [addliquidity, setAddliquidity] = useState(true);

  const displayDifferentMode = (addLiquidity: boolean) => {
    if (addLiquidity) {
      return <AddLiquidityPage network={network} />;
    } else {
      return <RemoveLiquidityPage network={network} />;
    }
  };
  return (
    <>
      <Box
        sx={(theme) => ({
          paddingTop: theme.spacing(12),
          display: 'flex', // 启用弹性布局
          justifyContent: 'center', // 水平居中
          alignItems: 'center', // 垂直居中
          paddingBottom: theme.spacing(12),
        })}
      >
        <Card
          sx={{
            width: '33.3%',
            minWidth: '250px',
            maxHeight: 'calc(100vh - 20px)',
            overflowY: 'auto',
          }}
        >
          <CardHeader
            title={
              <Typography variant="h4" style={{ color: 'white' }}>
                <SwitchButton setAddliquidity={setAddliquidity} />
              </Typography>
            }
          />
          <CardContent>{displayDifferentMode(addliquidity)}</CardContent>
        </Card>
      </Box>
    </>
  );
};

export default Liquidity;
