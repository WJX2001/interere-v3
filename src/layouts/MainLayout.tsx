import { Box, Container } from '@mui/material';
import React, { ReactNode } from 'react';
import AppHeader from './AppHeader';

const MainLayout = ({ children }: { children: ReactNode }) => {
  // 文件主入口
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
    }}>
      <AppHeader />
      <Box
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
