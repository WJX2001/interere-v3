import React from 'react';
import MainLayout from './layouts/MainLayout';
import { useTheme } from '@mui/material';
import AppHeader from './layouts/AppHeader';

function App() {
  const a = useTheme();
  console.log(a, '333');
  return (
    <>
      <MainLayout>
        把中间内容放在这里
      </MainLayout>
    </>
  );
}

export default App;
