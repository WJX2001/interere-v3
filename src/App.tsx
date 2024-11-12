import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/index.page';
import CoinSwap from './pages/CoinSwap';
import PageNotFount from './pages/404Page/404.page';
import Web3Provider from './components/Web3Provider';

function App() {
  return (
    <>
      <Web3Provider
        render={(network) => (
          <Routes>
            <Route path="*" element={<PageNotFount />} />
            <Route path="/" element={<Home />} />
            <Route path="/swap" element={<CoinSwap />} />
          </Routes>
        )}
      ></Web3Provider>
    </>
  );
}

export default App;
