import { Button, CircularProgress } from '@mui/material';
import { green } from '@mui/material/colors';
import React from 'react';

const LoadingButton = (props) => {
  const { children, loading, valid, onClick, ...other } = props;
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        disabled={loading || !valid}
        type="submit"
        onClick={onClick}
        {...other}
      >
        {children}
      </Button>
      {loading && (
        <CircularProgress
          size={24}
          sx={{
            color: green[500],
            position: 'absolute',
            top:'5px'
            // top: '50%',
            // left: '50%',
            // marginTop: -12,
            // marginLeft: -12,
          }}
        />
      )}
    </>
  );
};

export default LoadingButton;
