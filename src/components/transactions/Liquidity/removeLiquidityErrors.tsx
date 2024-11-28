import { Warning } from '@/components/primitives/Warning';
import { Typography } from '@mui/material';
interface SwitchErrorsProps {
  ratesError?: unknown;
  balance: string;
  inputAmount: string;
  content: string;
}

const RemoveLiquidityErrors = ({
  ratesError,
  balance,
  inputAmount,
  content,
}: SwitchErrorsProps) => {
  if (ratesError) {
    return 'rateError';
  } else if (Number(inputAmount) > Number(balance)) {
    return (
      <Warning severity="error" sx={{ mt: 1 }} icon={false}>
        <Typography variant="caption">{content}</Typography>
      </Warning>
    );
  }
  return null;
};

export default RemoveLiquidityErrors;
