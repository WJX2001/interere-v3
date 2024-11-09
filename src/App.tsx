import React from 'react';
import MainLayout from './layouts/MainLayout';
import { useTheme } from '@mui/material';
import AppHeader from './layouts/AppHeader';
import Home from './pages/index.page';

function App() {
  const a = useTheme();
  console.log(a, '333');
  return (
    <>
      <MainLayout>
        <Home />
      </MainLayout>
    </>
  );
}

export default App;
