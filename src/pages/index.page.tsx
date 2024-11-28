import { ContentContainer } from '@/components/ContentContainer';
import { Paper, useTheme } from '@mui/material';
const Home = () => {
  const theme = useTheme();

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
          11111
        </Paper>
      </ContentContainer>
    </>
  );
};

export default Home;
