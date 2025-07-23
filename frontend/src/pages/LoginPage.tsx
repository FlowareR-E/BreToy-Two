import { Button, Container, CssBaseline, Typography, Box, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { keyframes } from '@emotion/react';
import logo from '../assets/musicman-logo.png';
import AuthLoader from '../components/AuthLoader';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
`;

const LoginPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, isLoading]);

  const handleLogin = () => {
    window.location.href = 'http://127.0.0.1:9090/spotify';
  };

  if (isLoading) {
    return <AuthLoader />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#191414e6',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }
      }}
    >
      <Container component="main" maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <CssBaseline />
        <Paper
          elevation={10}
          sx={{
            mt: 8,
            p: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 4,
            background: (theme) => theme.palette.primary.light,
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(29, 185, 84, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            transform: 'translateY(0)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 12px 40px rgba(29, 185, 84, 0.2)'
            }
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="MusicMan Logo"
            sx={{
              width: 100,
              height: 100,
              mb: 3,
              borderRadius: '50%',
              border: '3px solid #1DB954',
              boxShadow: '0 0 20px rgba(29, 185, 84, 0.4)',
              animation: `${pulse} 4s infinite ease-in-out`,
            }}
          />
          <Typography
            component="h1"
            variant="h3"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              fontFamily: 'Montserrat, sans-serif',
              textAlign: 'center',
              mb: 3,
              color: 'rgba(25,25,25,1)',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              background: 'linear-gradient(to right, #1DB954, #fff)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
            }}
          >
            Welcome to MusicMan
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{
              mb: 4,
              color: 'rgba(25,25,25,.85)',
              fontSize: '1.1rem',
              lineHeight: 1.6
            }}
          >
            Connect your Spotify account to unlock  insights about your top tracks, favorite artists, and listening habits.
          </Typography>
          {!isAuthenticated && (
            <Button
              onClick={handleLogin}
              fullWidth
              variant="contained"
              size="large"
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '1rem',
                color: '#000000cc',
                py: 1.5,
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.4)',
                boxShadow: '0 4px 15px rgba(29, 185, 84, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(29, 185, 84, 0.6)',
                  background: (theme) => theme.palette.primary.main,
                }
              }}
            >
              Log in with Spotify
            </Button>
          )}
          <Typography
            variant="caption"
            display="block"
            sx={{
              mt: 3,
              color: 'rgba(20,20,20,.75)',
              textAlign: 'center',
              fontSize: '0.8rem'
            }}
          >
            By continuing, you agree to our Terms and Privacy Policy
            <br />
            ©2025 FlowareApps
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;