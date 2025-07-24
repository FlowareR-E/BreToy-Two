import { useAuth } from '../context/AuthContext';
import { useEffect, useState, useRef } from 'react';
import type { Artist, SearchResult } from '../types/spotify';
import SearchBar from '../components/SearchBar';
import TopArtists from '../components/TopArtists';
import { Container, Typography, Box, Button, CircularProgress } from '@mui/material';
import SearchResults from '../components/SearchResults';
import spotifyApi from '../api/spotifyApi';
import { useNavigate, useSearchParams } from 'react-router-dom';

function DashboardPage() {
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, spotifyId, logout } = useAuth();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchTopArtists = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await spotifyApi.getTopArtists();
        setArtists(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchTopArtists();
  }, [isAuthenticated]);

  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    }
  }, []);

  const handleSearch = async (query: string) => {
    if (query.trim() === '') {
      setSearchResults(null);
      return;
    }
    navigate(`/dashboard?search=${encodeURIComponent(query)}`);
    try {
      setLoading(true);
      const data = await spotifyApi.search(query);
      setSearchResults(data);

      setTimeout(() => {
        searchResultsRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4, justifyContent: 'center', alignItems: 'center', maxWidth: 1440, mx: 'auto' }}>
      <SearchBar onSearch={handleSearch} />

      <Box
        sx={{
          mb: 6,
          mt: 8,
          textAlign: 'center',
          background: (theme) => theme.palette.primary.light,
          borderRadius: 4,
          p: 3,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
            pointerEvents: 'none'
          }
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            mb: 3
          }}
        >
          Welcome back, {spotifyId}! 🎵
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 400,
            opacity: 0.95,
            maxWidth: '600px',
            margin: '0 auto',
            fontSize: { xs: '1.1rem', sm: '1.3rem' }
          }}
        >
          This are your most-played artists
        </Typography>
      </Box>

      <TopArtists artists={artists} loading={loading} error={error} />
      {searchResults && (
        <div ref={searchResultsRef}>
          <SearchResults results={searchResults} loading={loading} error={error} />
        </div>)}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          disabled={loading || isLoggingOut}
          startIcon={isLoggingOut ? <CircularProgress size={20} /> : null}
          color="error"
          onClick={handleLogout}
          sx={{ mt: 2 }}
        >
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </Button>
      </Box>
    </Container>
  );
}

export default DashboardPage;