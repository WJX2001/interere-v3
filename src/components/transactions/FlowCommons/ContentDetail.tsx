import { Box, Typography } from '@mui/material';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

const ContentDetail: React.FC<Props> = ({ children }) => {
  return (
    <Box sx={{ pt: 5 }}>
      <Typography sx={{ mb: 1 }} color="text.secondary">
        Transaction overview
      </Typography>
      <Box
        sx={(theme) => ({
          p: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '4px',
          '.MuiBox-root:last-of-type': {
            mb: 0,
          },
        })}
      >
        {children}
      </Box>
    </Box>
  );
};

export default ContentDetail;
