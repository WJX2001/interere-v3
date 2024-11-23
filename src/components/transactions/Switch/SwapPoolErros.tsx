import { Warning } from '@/components/primitives/Warning';
import { Typography } from '@mui/material';
interface SwapPoolErrosProps {
  hasNoBalance?: unknown;
}

const SwapPoolErros = ({
  hasNoBalance,
}: SwapPoolErrosProps) => {
  if (hasNoBalance) {
    return (
      <Warning severity="warning" sx={{ mt: 4 }} icon={false}>
        <Typography variant="caption">
        The transaction currency pair in your account has no address
        </Typography>
      </Warning>
    );
  }
  return null;
};

export default SwapPoolErros;
