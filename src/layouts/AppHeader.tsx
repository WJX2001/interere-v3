import { HEADERHEIGHT } from '@/constants';
import {
  Box,
  Slide,
  useMediaQuery,
  useScrollTrigger,
  useTheme,
} from '@mui/material';
import React from 'react';
import newLogo from '@/assets/newLogo.svg'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import NavItems from './components/NavItems';
import styles from './styles/AppHeader.module.less'
import SettingsMenu from './SettingsMenu';
interface Props {
  children: React.ReactElement;
}

function HideOnScroll({ children }: Props) {
  const { breakpoints } = useTheme();
  const md = useMediaQuery(breakpoints.down('md'));
  const trigger = useScrollTrigger({ threshold: md ? 160 : 80 });
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const AppHeader = () => {
  return (
    <HideOnScroll>
      <Box
        component="header"
        sx={(theme) => ({
          height: HEADERHEIGHT,
          position: 'sticky',
          top: 0,
          transition: theme.transitions.create('top'),
          zIndex: theme.zIndex.appBar,
          bgcolor: theme.palette.background.header,
          padding: {
            xs: '8px 8px 8px 20px',
            xsm: '8px 20px',
          },
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'space-between',
          boxShadow: 'inset 0px -1px 0px rgba(242, 243, 247, 0.16)',
        })}
      >
        <Box
          aria-label="Go to homepage"
          sx={{
            lineHeight: 0,
            mr: 3,
            transition: '0.3s ease all',
            '&:hover': { opacity: 0.7 },
          }}
        >
          <a href="/">
            <img src={newLogo} alt="AAVE" width={82} height={30} />
          </a>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <NavItems />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row-reverse', flex: 1 }}>
          <div className={styles['connect-button-container']}>
            <ConnectButton />
          </div>
        </Box>
        <Box>
          <SettingsMenu />
        </Box>
      </Box>
    </HideOnScroll>
  );
};

export default AppHeader;
