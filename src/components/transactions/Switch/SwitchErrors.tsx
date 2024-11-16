import { Warning } from '@/components/primitives/Warning';
import { Typography } from '@mui/material';
import React from 'react';

interface SwitchErrorsProps {
  ratesError?: unknown;
  balance: string;
  inputAmount: string;
}

const SwitchErrors = ({
  ratesError,
  balance,
  inputAmount,
}: SwitchErrorsProps) => {
  if (ratesError) {
    return 'rateError';
  } else if (Number(inputAmount) > Number(balance)) {
    return (
      <Warning severity="error" sx={{ mt: 4 }} icon={false}>
        <Typography variant="caption">
          Your balance is lower than the selected amount.
        </Typography>
      </Warning>
    );
  }
  return null;
};

export default SwitchErrors;
