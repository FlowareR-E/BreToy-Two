
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import type { Artist, SearchResult } from '../types/spotify';
import SearchBar from '../components/SearchBar';
import TopArtists from '../components/TopArtists';
import { Container, Typography, Box, Button } from '@mui/material';
import SearchResults from '../components/SearchResults';

function DashboardPage() {
  const { isAuthenticated, spotifyId, logout } = useAuth();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchTopArtists = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:9090/spotify/me/top/artists', {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch top artists');
        }
        const data = await response.json();
        setArtists(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching top artists:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopArtists();
  }, [isAuthenticated]);

const handleSearch = async (query: string) => {
  try {
    setLoading(true);
    setError(null);
    
    const response = await fetch(`http://127.0.0.1:9090/spotify/search?query=${encodeURIComponent(query)}&type=album,artist,track`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Search failed');
    }

    const data = await response.json();
    console.log('Search results:', data);
    setSearchResults(data);
    
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Search failed');
    console.error('Search error:', err);
  } finally {
    setLoading(false);
  }
};

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4, justifyContent: 'center', alignItems: 'center', maxWidth:1440, mx: 'auto' }}>
      <SearchBar onSearch={handleSearch} />

    <Box 
        sx={{ 
          mb: 6, 
          mt: 8, 
          textAlign: 'center',
          background: 'linear-gradient(135deg, #0F4D0F 0%,#008000 100%)',
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
      {searchResults && <SearchResults results={searchResults} loading={loading} error={error} />}

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          color="error"
          onClick={logout}
          sx={{ mt: 2 }}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
}

export default DashboardPage;