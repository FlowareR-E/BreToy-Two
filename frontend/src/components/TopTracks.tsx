import { useEffect, useState } from "react";
import type { Track } from "../types/spotify";
import { Box, Card, CardMedia, CircularProgress, Grid, LinearProgress, Paper, Typography } from "@mui/material";
import { MusicNote } from "@mui/icons-material";
import spotifyApi from "../api/spotifyApi";

function TopTracks({ artistId }: { artistId: string }) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopTracks = async () => {
      try {
        setLoading(true);
        const data = await spotifyApi.getArtistTopTracks(artistId);
        setTracks(data);
        console.log(data)
      } catch (error) {
        console.error('Error fetching top tracks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopTracks();
  }, [artistId]);

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Paper elevation={2} sx={{
        p: 3, mb: 4, bgcolor: 'rgba(255, 255, 255, 0.15)',
      }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MusicNote color="primary" />
          Top Tracks
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        mb: 4,
        bgcolor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 2
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 3,
          fontWeight: 600
        }}
      >
        <MusicNote color="primary" />
        Top Tracks
      </Typography>

      <Grid container spacing={1.5}>
        {tracks.map((track, index) => (
          <Grid
            size={{ xs: 6, sm: 4, md: 3, lg: 2.4 }}
            key={track.id}
          >
            <Card
              sx={{
                bgcolor: 'rgba(144, 230, 160, 0.15)',
                height: '100%',
                display: 'flex',
                borderRadius: 2,
                flexDirection: 'column',
                cursor: 'pointer',
                p: .5,
                transition: 'all 0.2s ease-in-out',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                  bgcolor: 'rgba(144, 230, 160, 0.25)',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: `linear-gradient(90deg, 
                    transparent 0%, 
                    rgba(25, 118, 210, ${track.popularity / 100}) ${track.popularity}%, 
                    transparent 100%)`
                }
              }}
            >
              {/* Track Number Badge */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: 'rgba(0, 0, 0, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.65rem'
                  }}
                >
                  {index + 1}
                </Typography>
              </Box>

              {/* Album Art Section */}
              <Box sx={{ position: 'relative', mb: 1.5 }}>
                <CardMedia
                  component="img"
                  sx={{
                    width: '100%',
                    aspectRatio: '1',
                    borderRadius: 1.5,
                    objectFit: 'cover'
                  }}
                  image={track.album.images[0]?.url}
                  alt={track.name}
                />
              </Box>

              {/* Track Info */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{
                    mb: 0.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: '0.875rem',
                    lineHeight: 1.2
                  }}
                >
                  {track.name}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    mb: 1.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'block',
                    fontSize: '0.75rem'
                  }}
                >
                  {track.album.name}
                </Typography>

                {/* Stats Section */}
                <Box sx={{ mt: 'auto' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                      {formatDuration(track.duration_ms)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                      {track.popularity}%
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={track.popularity}
                    sx={{
                      height: 3,
                      borderRadius: 2,
                      bgcolor: 'rgba(0, 0, 0, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 2
                      }
                    }}
                  />
                </Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

export default TopTracks;