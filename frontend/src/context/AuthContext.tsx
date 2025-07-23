import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCookie, removeCookie } from '../utils/auth.ts';
import type { ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  spotifyId: string | null;
  login: (id: string) => void;
  logout: () => Promise<boolean>;
  isLoading: boolean;
  verifySession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [spotifyId, setSpotifyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = useCallback((id: string) => {
    setSpotifyId(id);
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      const backendResponse = await fetch('http://127.0.0.1:9090/api/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!backendResponse.ok) {
        throw new Error(`Backend logout failed with status ${backendResponse.status}`);
      }

      removeCookie('spotify_session');
      setSpotifyId(null);

      const spotifyLogoutWindow = window.open(
        'https://accounts.spotify.com/logout',
        '_blank'
      );
      window.location.href = 'http://127.0.0.1:8080/login';

      setTimeout(() => {
        spotifyLogoutWindow?.close();
      }, 1000);
      return true;

    } catch (error) {
      console.error('Logout error:', error);
      removeCookie('spotify_session');
      setSpotifyId(null);
      window.location.href = 'http://127.0.0.1:8080/login';
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const verifySession = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:9090/api/auth-status', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setSpotifyId(data.userId);
        return true;
      }
      // If session verification fails, perform logout
      await logout();
      return false;
    } catch (error) {
      console.error('Session verification error:', error);
      await logout();
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const id = getCookie('spotify_session');
      if (id) {
        await verifySession();
      } else {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, [verifySession]);

  // Optional: Add periodic session verification
  useEffect(() => {
    const interval = setInterval(() => {
      if (spotifyId) {
        verifySession();
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [spotifyId, verifySession]);

  if (isLoading) {
    return <div>Loading authentication state...</div>;
  }

  return (
    <AuthContext.Provider value={{
      isAuthenticated: !!spotifyId,
      spotifyId,
      login,
      logout,
      isLoading,
      verifySession,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};