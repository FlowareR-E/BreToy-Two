import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Paper, Avatar, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import type { ArtistDetails } from '../types/spotify';

function ArtistPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, logout } = useAuth();
  const [artist, setArtist] = useState<ArtistDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !id) return;

    const fetchArtist = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://127.0.0.1:9090/spotify/artists/${id}`, {
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error('Failed to fetch artist details');
        }
        const data = await response.json();
        console.log(data);
        setArtist(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching artist:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id, isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography color="error" variant="h6" gutterBottom>
            Error loading artist details
          </Typography>
          <Typography>{error}</Typography>
        </Paper>
      </Container>
    );
  }

  if (!artist) {
    return (
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Artist not found
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 10 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Avatar
          src={artist.images[0]?.url }
          alt={artist.name}
          sx={{
            width: 120,
            height: 120,
            mr: 4,
            boxShadow: 8
          }}
        />
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            {artist.name}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            {artist.followers.total.toLocaleString()} followers
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {artist.genres != null && artist.genres.map((genre) => (
              <Paper key={genre} elevation={0} sx={{ px: 1.5, py: 0.5, borderRadius: 4, bgcolor: 'primary.light' }}>
                <Typography variant="body2">{genre}</Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>


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

export default ArtistPage;