import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import AuthLoader from '../components/AuthLoader.tsx';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();
    if (isLoading) {
    return <AuthLoader />;
  }
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export { ProtectedRoute };