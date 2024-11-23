import { Box} from '@mui/material';
import  { ReactNode } from 'react';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';

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
      className='wjx'
        component="main"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {children}
      </Box>
      <AppFooter />
    </Box>
  );
};

export default MainLayout;
