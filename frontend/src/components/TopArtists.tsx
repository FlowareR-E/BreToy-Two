import { Typography, Box, CircularProgress, Card, CardContent, Avatar, Grid, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Artist } from '../types/spotify';

interface TopArtistsProps {
  artists: Artist[];
  loading: boolean;
  error: string | null;
}

function TopArtists({ artists, loading, error }: TopArtistsProps) {
  const navigate = useNavigate();

  const handleArtistClick = (artistId: string) => {
    navigate(`/artists/${artistId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="40vh">
        <CircularProgress size={48} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Card sx={{ maxWidth: 500, mx: 'auto', mt: 3 }}>
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          <Typography color="error" variant="h6" gutterBottom>
            ⚠️ Error loading artists
          </Typography>
          <Typography color="text.secondary">{error}</Typography>
        </CardContent>
      </Card>
    );
  }

  if (artists.length === 0) {
    return (
      <Card sx={{ maxWidth: 400, mx: 'auto', textAlign: 'center' }}>
        <CardContent sx={{ py: 4 }}>
          <Typography variant="h6" gutterBottom>
            🎵 No artists found
          </Typography>
          <Typography color="text.secondary">
            Your top artists list appears to be empty
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mx: 'auto' }}>
      {artists.map((artist, index) => (
        <Grid key={artist.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.4 }}>
          <Card
            sx={{
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              height: '100%',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, .7) 100%, rgba(15, 77, 15, .15) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid',
              borderColor: '#e0e0e0',
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(25, 118, 210, 0.15)',
                borderColor: '#1976d2',
                '& .artist-avatar': {
                  transform: 'scale(1.05)',
                  borderColor: 'primary.main',
                },
                '& .rank-chip': {
                  transform: 'scale(1.1)',
                  background: '#1DB954',
                  color: 'white'
                }
              }
            }}
            onClick={() => handleArtistClick(artist.id)}
          >
            <CardContent sx={{ p: 2.5, textAlign: 'center', position: 'relative' }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar
                  src={artist.imageUrl}
                  alt={artist.name}
                  className="artist-avatar"
                  sx={{
                    width: { xs: 70, sm: 80 },
                    height: { xs: 70, sm: 80 },
                    mx: 'auto',
                    border: '3px solid',
                    borderColor: 'rgba(25, 118, 210, 0.3)',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 24px rgba(25, 118, 210, 0.2)'
                  }}
                />
                <Chip
                  label={index + 1}
                  size="small"
                  className="rank-chip"
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    background: 'rgba(25, 118, 210, 0.1)',
                    color: 'primary.main',
                    border: '2px solid white',
                    transition: 'all 0.3s ease',
                    minWidth: 28,
                    height: 28
                  }}
                />
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 0.5,
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  color: 'text.primary',
                  lineHeight: 1.2
                }}
              >
                {artist.name}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mb: 1.5,
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  fontWeight: 500
                }}
              >
                {artist.genre.charAt(0).toUpperCase() + artist.genre.slice(1)}
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Chip
                  label={`${artist.popularity}% popularity`}
                  size="small"
                  variant="filled"
                  sx={{
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    background: 'rgba(63, 106, 50, .25)',
                    color: '#1c201b',
                    border: '1px solid',
                    borderColor: 'rgba(46, 125, 50, 0.55)',
                    '& .MuiChip-label': {
                      px: 1.5
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default TopArtists;