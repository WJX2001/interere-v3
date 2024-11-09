import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import '@rainbow-me/rainbowkit/styles.css';
import { BrowserRouter } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
// import { config } from './wagmi.ts';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { darkTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import AppGlobalStyles from './layouts/AppGlobalStyles.tsx';
import { Config } from './wagmi.ts';
import merge from 'lodash.merge';

const queryClient = new QueryClient();
const myTheme = merge(darkTheme(), {
  colors: {
    accentColor:'linear-gradient(248.86deg, #B6509E 10.51%, #2EBAC6 93.41%)',
    connectButtonBackground: '#383D51',
  },
  radii: {
    actionButton: '0',
  }
});

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <WagmiProvider config={Config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={myTheme}>
            <AppGlobalStyles>
              <App />
            </AppGlobalStyles>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </StrictMode>
  </BrowserRouter>,
);
