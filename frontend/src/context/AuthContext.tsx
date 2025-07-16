import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCookie, removeCookie } from '../utils/auth.ts';
import type { ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  spotifyId: string | null;
  login: (id: string) => void;
  logout: () => void;
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
    const response = await fetch('http://127.0.0.1:9090/logout', {
      method: 'POST',  
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Logout failed with status ${response.status}`);
    }

    removeCookie('spotify_session');
    setSpotifyId(null);
    
    window.location.href = 'http://127.0.0.1:8080';
    return true;
    
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  } finally {
    setIsLoading(false);
  }
}, [removeCookie]);

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
      logout();
      return false;
    } catch (error) {
      logout();
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  useEffect(() => {
    const checkInitialAuth = async () => {
      const id = getCookie('spotify_session');
      if (id) {
        await verifySession();
      } else {
        setIsLoading(false);
      }
    };
    checkInitialAuth();
  }, [verifySession]);

  if (isLoading) {
    return null;
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