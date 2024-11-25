import { NetworkTypes } from '@/types';
import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';

import { useState } from 'react';
import AddIndex from './components/AddIndex';
import SwitchButton from './components/SwitchButton';
import RemoveIndex from './components/RemoveIndex';

interface Props {
  network: NetworkTypes;
}

const Index: React.FC<Props> = ({ network }) => {
  const [indexPage, setIndexPage] = useState(true);

  const displayDifferentMode = (indexPage: boolean) => {
    if (indexPage) {
      return <AddIndex network={network} />;
    } else {
      return <RemoveIndex network={network} />;
    }
  };
  return (
    <>
      <Box
        sx={(theme) => ({
          paddingTop: theme.spacing(12),
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: theme.spacing(12),
        })}
      >
        <Card
          sx={{
            width: '30%',
            minWidth: '250px',
            maxHeight: 'calc(100vh - 20px)',
            overflowY: 'auto',
          }}
        >
          <CardHeader
            title={
              <Typography variant="h4" style={{ color: 'white' }}>
                <SwitchButton setIndexPage={setIndexPage} />
              </Typography>
            }
          />
          <CardContent>{displayDifferentMode(indexPage)}</CardContent>
        </Card>
      </Box>
    </>
  );
};

export default Index;
