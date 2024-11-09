import {
  createTheme,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from '@mui/material';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { ColorModeContext } from './ColorModeContext';
import { getDesignTokens, getThemedComponents } from '@/utils/theme';
import { deepmerge } from '@mui/utils';

type Mode = 'light' | 'dark';

const AppGlobalStyles = ({ children }: { children: ReactNode }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = useState<Mode>(prefersDarkMode ? 'dark' : 'light');

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('colorMode', newMode);
          return newMode;
        });
      },
    }),
    [],
  );

  useEffect(() => {
    const initialMode = localStorage?.getItem('colorMode') as Mode;
    if (initialMode) {
      setMode(initialMode);
    } else if (prefersDarkMode) {
      setMode('dark');
    }
  }, []);

  const theme = useMemo(() => {
    // const themeCreate = createTheme(getDesignTokens(mode));
    const themeCreate = createTheme(getDesignTokens('dark'));
    return deepmerge(themeCreate, getThemedComponents(themeCreate));
    // return themeCreate
  }, [mode]);

  return (
    <>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          {children}
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  );
};

export default AppGlobalStyles;
