import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Box,
    Typography,
    Grid,
    Avatar,
    Chip,
    CircularProgress,
    Stack,
    List,
    ListItem,
    IconButton,
    Button,
    Paper,
    Fade,
} from '@mui/material';
import { PlayArrow } from '@mui/icons-material';
import type { AlbumDetails as AlbumDetailsType } from '../types/spotify';
import spotifyApi from '../api/spotifyApi';
import BackButton from './BackButton';

function AlbumDetails() {
    const { id } = useParams();
    const { isAuthenticated } = useAuth();
    const [albumDetails, setAlbumDetails] = useState<AlbumDetailsType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated || !id) return;

        const fetchAlbumData = async () => {
            try {
                setLoading(true);
                const data = await spotifyApi.getAlbum(id);
                console.log(data)
                setAlbumDetails(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchAlbumData();
    }, [id, isAuthenticated]);

    if (loading) {
        return (
                <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress 
                        size={80} 
                        thickness={3} 
                        sx={{ 
                            color: '#1DB954',
                            mb: 2
                        }} 
                    />
                    <Typography variant="h6" color="text.secondary">
                        Loading album...
                    </Typography>
                </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ 
                textAlign: 'center', 
                my: 6,
                p: 4,
                background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(211, 47, 47, 0.1) 100%)',
                borderRadius: 3
            }}>
                <Typography color="error" variant="h4" sx={{ mb: 2 }}>
                    ⚠️ Oops!
                </Typography>
                <Typography color="text.secondary" variant="h6">
                    {error}
                </Typography>
            </Box>
        );
    }

    if (!albumDetails) {
        return (
            <Box sx={{ 
                textAlign: 'center', 
                my: 6,
                p: 4,
                background: 'linear-gradient(135deg, rgba(158, 158, 158, 0.1) 0%, rgba(117, 117, 117, 0.1) 100%)',
                borderRadius: 3
            }}>
                <Typography variant="h4" color="text.secondary" sx={{ mb: 2 }}>
                    🎵 Album not found
                </Typography>
                <Typography color="text.secondary">
                    The album you're looking for doesn't exist or has been removed.
                </Typography>
            </Box>
        );
    }

    const totalDuration = albumDetails.tracks.items.reduce((acc, track) => acc + track.duration_ms, 0);

    function handlePlayTrack(id: string): void {

        const track = albumDetails?.tracks.items.find(t => t.id === id);
        if (track?.external_urls.spotify) {
            window.open(track.external_urls.spotify, '_blank', 'noopener,noreferrer');
        } else {
            alert('Spotify link for this track is not available.');
        }
    }

    return (
        <Fade in timeout={800}>
            <Box sx={{ mt: 2, mb: 6, maxWidth: 1280, width: '100%', mx: 'auto', px: 2 }}>
                <BackButton />
                {/* Album Header */}
                <Paper 
                    elevation={0}
                    sx={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, .5) 50%, rgba(15, 77, 15, .5) 100%)',
                        borderRadius: 4,
                        p: 4,
                        mb: 4,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(45deg, rgba(29, 185, 84, 0.05) 0%, transparent 50%)',
                            zIndex: 0
                        }
                    }}
                >
                    <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
                        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Avatar
                                    variant="square"
                                    src={albumDetails.images[0]?.url}
                                    alt={albumDetails.name}
                                    sx={{
                                        width: '100%',
                                        height: 'auto',
                                        maxWidth: 300,
                                        borderRadius: 3,
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                            boxShadow: '0 25px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(29, 185, 84, 0.3)'
                                        }
                                    }}
                                />
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
                            <Stack spacing={3}>
                                <Chip
                                    label={albumDetails.album_type.toUpperCase()}
                                    size="small"
                                    sx={{
                                        bgcolor: 'rgba(29, 185, 84, 0.15)',
                                        color: '#1DB954',
                                        fontWeight: 700,
                                        fontSize: '0.8rem',
                                        alignSelf: 'flex-start'
                                    }}
                                />
                                
                                <Typography 
                                    variant="h2" 
                                    component="h1" 
                                    sx={{ 
                                        fontWeight: 900,
                                        fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                                        lineHeight: 1.1,
                                        background: 'linear-gradient(135deg, #1DB954 15%, #1ED760 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}
                                >
                                    {albumDetails.name}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                    {albumDetails.artists.map((artist, index) => (
                                        <Box key={artist.id} sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Chip
                                                label={artist.name}
                                                component={Link}
                                                to={`/artists/${artist.id}`}
                                                clickable
                                                sx={{
                                                    fontWeight: 600,
                                                    fontSize: '1rem',
                                                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                                                    color: 'white',
                                                    '&:hover': {
                                                        bgcolor: '#1DB954',
                                                        color: 'black',
                                                        transform: 'translateY(-2px)'
                                                    },
                                                    transition: 'all 0.2s ease'
                                                }}
                                            />
                                            {index < albumDetails.artists.length - 1 && (
                                                <Typography sx={{ mx: 1, color: 'text.secondary' }}>•</Typography>
                                            )}
                                        </Box>
                                    ))}
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                        {new Date(albumDetails.release_date).getFullYear()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">•</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                        {albumDetails.total_tracks} {albumDetails.total_tracks === 1 ? 'song' : 'songs'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">•</Typography>
                                    <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                        {formatDuration(totalDuration)}
                                    </Typography>
                                    {albumDetails.label && (
                                        <>
                                            <Typography variant="body2" color="text.secondary">•</Typography>
                                            <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                                {albumDetails.label}
                                            </Typography>
                                        </>
                                    )}
                                </Box>

                                {albumDetails.copyrights?.length > 0 && (
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
                                        {albumDetails.copyrights[0].text}
                                    </Typography>
                                )}
                            </Stack>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Tracks List */}
                <Paper 
                    elevation={0}
                    sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.35)',
                        borderRadius: 3,
                        overflow: 'hidden',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <Box sx={{ p: 3 }}>
                        <Typography 
                            variant="h4" 
                            component="h2" 
                            sx={{ 
                                mb: 3, 
                                fontWeight: 800,
                                color: 'text.primary'
                            }}
                        >
                            Tracks
                        </Typography>
                        <List sx={{ p: 0 }}>
                            {albumDetails.tracks.items.map((track, index) => (
                                <div key={track.id}>
                                    <ListItem
                                        onMouseEnter={() => setHoveredTrack(track.id)}
                                        onMouseLeave={() => setHoveredTrack(null)}
                                        sx={{
                                            py: 2,
                                            px: 3,
                                            borderRadius: 2,
                                            mb: 1,
                                            transition: 'all 0.2s ease',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                bgcolor: 'rgba(29, 185, 84, 0.1)',
                                                transform: 'translateX(8px)'
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }} onClick={() => handlePlayTrack(track.id)}>
                                            
                                            <Typography
                                                sx={{
                                                    minWidth: 40,
                                                    color: hoveredTrack === track.id ? '#1DB954' : 'text.secondary',
                                                    fontWeight: 600,
                                                    fontSize: '1rem'
                                                }}
                                            >
                                                {index + 1}
                                            </Typography>
                                            
                                            <Box sx={{ flexGrow: 1, ml: 2 }}>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 600,
                                                        color: 'text.primary',
                                                        fontSize: '1.1rem'
                                                    }}
                                                >
                                                    {track.name}
                                                    {track.explicit && (
                                                        <Chip
                                                            label="E"
                                                            size="small"
                                                            sx={{
                                                                ml: 1,
                                                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                                                color: 'text.primary',
                                                                fontSize: '0.7rem',
                                                                height: 20,
                                                                fontWeight: 700
                                                            }}
                                                        />
                                                    )}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ mt: 0.5 }}
                                                >
                                                    {track.artists.map(a => a.name).join(', ')}
                                                </Typography>
                                            </Box>
                                            
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Typography
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{ fontWeight: 500 }}
                                                >
                                                    {formatDuration(track.duration_ms)}
                                                </Typography>
                                                <IconButton
                                                    size="small"
                                                    sx={{
                                                        opacity: hoveredTrack === track.id ? 1 : 0,
                                                        color: '#1DB954',
                                                        transition: 'all 0.2s ease',
                                                        '&:hover': {
                                                            transform: 'scale(1.2)'
                                                        }
                                                    }}
                                                >
                                                    <PlayArrow />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                    </ListItem>
                                </div>
                            ))}
                        </List>
                    </Box>
                </Paper>

                {/* Album Info Footer */}
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        ℗ {new Date(albumDetails.release_date).getFullYear()} {albumDetails.label || 'Unknown Label'}
                    </Typography>
                    {albumDetails.external_urls?.spotify && (
                        <Button
                            variant="outlined"
                            href={albumDetails.external_urls.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                borderColor: '#1DB954',
                                color: '#1DB954',
                                fontWeight: 600,
                                px: 4,
                                py: 1.5,
                                borderRadius: 3,
                                textTransform: 'none',
                                '&:hover': {
                                    bgcolor: '#1DB954',
                                    color: 'black',
                                    transform: 'translateY(-2px)'
                                },
                                transition: 'all 0.2s ease'
                            }}
                        >
                            Open in Spotify
                        </Button>
                    )}
                </Box>
            </Box>
        </Fade>
    );
}

function formatDuration(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default AlbumDetails;