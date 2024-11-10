import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/index.page';
import CoinSwap from './pages/CoinSwap';
import PageNotFount from './pages/404Page/404.page';

function App() {
  return (
    <>
      <MainLayout>
        <Routes>
          <Route path="*" element={<PageNotFount />} />
          <Route path="/" element={<Home />} />
          <Route path="/swap" element={<CoinSwap />} />
        </Routes>
      </MainLayout>
    </>
  );
}

export default App;
