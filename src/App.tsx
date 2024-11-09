import React from 'react';
import MainLayout from './layouts/MainLayout';
import { useTheme } from '@mui/material';

function App() {
  const a = useTheme();
  console.log(a,'333')
  return (
    <React.Fragment>
      <MainLayout>
        2222222
      </MainLayout>
    </React.Fragment>
  );
}

export default App;
