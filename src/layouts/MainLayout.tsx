import { Box } from '@mui/material';
import React, { ReactNode } from 'react';
import AppHeader from './AppHeader';

const MainLayout = ({ children }: { children: ReactNode }) => {
  // 文件主入口
  return (
    <>
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        <AppHeader />
        {children}
      </Box>
    </>
  );
};

export default MainLayout;
