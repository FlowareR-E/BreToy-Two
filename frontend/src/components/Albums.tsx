import { useEffect, useState } from "react";
import type { AlbumDetails } from "../types/spotify";
import { Box, Card, CardContent, CardMedia, Chip, CircularProgress, Grid, Paper, Typography } from "@mui/material";
import AlbumIcon from "@mui/icons-material/Album";
import { useNavigate } from "react-router-dom";
import spotifyApi from "../api/spotifyApi";

function Albums({ artistId }: { artistId: string }) {
  const [albums, setAlbums] = useState<AlbumDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        setLoading(true);
        const data = await spotifyApi.getArtistAlbums(artistId);
        setAlbums(data);
      } catch (error) {
        console.error('Error fetching albums:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, [artistId]);

  if (loading) {
    return (
      <Paper elevation={2} sx={{
        p: 3, mb: 4
      }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, }}>
          <AlbumIcon color="primary" />
          Albums
        </Typography>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{
      p: 3, mb: 4, bgcolor: 'rgba(255, 255, 255, 0.5)',
    }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, }}>
        <AlbumIcon color="primary" />
        Albums
      </Typography>

      <Grid container spacing={3}>
        {albums.map((album) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={album.id}>
            <Card
              onClick={() => navigate(`/albums/${album.id}`)}
              elevation={2}
              sx={{
                bgcolor: 'rgba(144, 230, 160, 0.15)',
                transition: 'all 0.3s',
                borderRadius: 8,
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 6
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={album.images[0]?.url}
                alt={album.name}
                sx={{
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              />
              <CardContent>
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {album.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {new Date(album.release_date).getFullYear()}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Chip
                    label={album.album_type}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Typography variant="caption" color="text.secondary">
                    {album.total_tracks} tracks
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}

export default Albums;