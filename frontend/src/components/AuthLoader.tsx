import { Box, CircularProgress } from '@mui/material';

const AuthLoader = () => {
  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh"
      sx={{
        backgroundColor: 'background.default'
      }}
    >
      <CircularProgress size={60} color="primary" />
    </Box>
  );
};

export default AuthLoader;