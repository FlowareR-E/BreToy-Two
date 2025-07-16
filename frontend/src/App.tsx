import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './utils/routes';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage.tsx';
import CallbackPage from './pages/CallbackPage';
import ArtistPage from './pages/ArtistPage';
import { Box } from '@mui/material';
import './App.css';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
        <AuthProvider>
          <BrowserRouter>
            <Box
              sx={{
                width: '100%',
                margin: '0 auto',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/callback" element={<CallbackPage />} />
                  <Route path="/artists/:id" element={<ArtistPage />} />
                </Route>
              </Routes>
            </Box>
          </BrowserRouter>
        </AuthProvider>
    </ThemeProvider>

  );
}

export default App;