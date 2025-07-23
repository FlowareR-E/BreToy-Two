import {
  Typography,
  Box,
  Avatar,
  Chip,
} from '@mui/material';
import {
  People,
  Star
} from '@mui/icons-material';
import type { ArtistDetails } from '../types/spotify';


function ArtistHeader({ artist }: { artist: ArtistDetails }) {
  return (
    <Box sx={{
      background: 'linear-gradient(135deg, rgba(255, 255, 255, .5) 50%, rgba(15, 77, 15, .5) 100%)',
      borderRadius: 3,
      p: 4,
      mb: 4,
      color: 'white'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
        <Avatar
          src={artist.images[0]?.url}
          alt={artist.name}
          sx={{
            width: { xs: 100, md: 150 },
            height: { xs: 100, md: 150 },
            mr: 4,
            mb: { xs: 2, md: 0 },
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            border: '4px solid rgba(255,255,255,0.2)'
          }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '3rem' }
          }}>
            {artist.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <People />
              <Typography variant="h6">
                {artist.followers.total.toLocaleString()} followers
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Star />
              <Typography variant="h6">
                {artist.popularity}/100 popularity
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {artist.genres?.map((genre) => (
              <Chip
                key={genre}
                label={genre}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.3)'
                  }
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
export default ArtistHeader;