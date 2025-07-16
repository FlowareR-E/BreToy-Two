import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CircularProgress } from '@mui/material';

export default function CallbackPage() {
  const { verifySession } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    verifySession().then(success => {
      navigate(success ? '/dashboard' : '/login?error=auth_failed');
    });
  }, []);

  return <CircularProgress />;
}