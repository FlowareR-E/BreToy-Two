import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1DB954', 
      light: 'rgba(144, 230, 160, 0.8)', 
      dark: '#0F4D0F', 
      contrastText: '#ffffff' 
    },
  },
});

export default theme;