import { ContentContainer } from '@/components/ContentContainer';
import { Box, Button, Paper, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import NotFountSVG from '@/assets/404.svg';
const PageNotFount = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <>
      <ContentContainer>
        <Paper
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            p: 4,
            flex: 1,
            backgroundColor: theme.palette.mode === 'dark' ? 'transparent' : '',
          }}
        >
          <Box sx={{ maxWidth: 444, m: '0 auto' }}>
            <img
              width="100%"
              height="auto"
              src={NotFountSVG}
              alt="404 - Page not found"
            />
          </Box>
          <Typography variant="display1" sx={{ mt: 2 }}>
            Page not found
          </Typography>
          <Typography sx={{ mt: 3, mb: 5, maxWidth: 480 }}>
            Sorry, we couldn&apos;t find the page you were looking for.
            <br />
            We suggest you go back to the Dashboard
          </Typography>
          <Button
            onClick={() => navigate('/')}
            variant="outlined"
            color="primary"
          >
            Back to Dashboard
          </Button>
        </Paper>
      </ContentContainer>
    </>
  );
};

export default PageNotFount;
