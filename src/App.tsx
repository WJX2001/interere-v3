import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/index.page';
import CoinSwap from './pages/CoinSwap';
import PageNotFount from './pages/404Page/404.page';
import Web3Provider from './components/Web3Provider';
import React from 'react';
import { SnackbarProvider } from 'notistack';
function App() {
  return (
    <>
      <SnackbarProvider maxSnack={3}>
        <Web3Provider
          render={(network) => (
            <React.Fragment>
              <Routes>
                <Route path="*" element={<PageNotFount />} />
                <Route path="/" element={<Home />} />
                <Route path="/swap" element={<CoinSwap network={network} />} />
              </Routes>
            </React.Fragment>
          )}
        ></Web3Provider>
      </SnackbarProvider>
    </>
  );
}

export default App;
