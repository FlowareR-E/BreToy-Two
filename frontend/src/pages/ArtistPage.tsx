import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Paper, Button, Divider } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import type { ArtistDetails } from '../types/spotify';
import ArtistHeader from '../components/ArtistHeader';
import TopTracks from '../components/TopTracks';
import Albums from '../components/Albums';
import spotifyApi from '../api/spotifyApi';
import BackButton from '../components/BackButton';

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
        setError(null);
        const data = await spotifyApi.getArtist(id);
        setArtist(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        setLoading(false);

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
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading artist details...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <Typography color="error" variant="h5" gutterBottom>
            Error loading artist details
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {error}
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </Paper>
      </Container>
    );
  }

  if (!artist) {
    return (
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: 4, mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Artist not found
          </Typography>
          <Typography variant="body1">
            The requested artist could not be found.
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <BackButton/>
      <ArtistHeader artist={artist} />

      <TopTracks artistId={id!} />

      <Albums artistId={id!} />

      <Divider sx={{ my: 4 }} />

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant="outlined"
          color="error"
          onClick={logout}
          size="large"
          sx={{
            minWidth: 120,
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: 2
            }
          }}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
}

export default ArtistPage;