import { useState } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    Chip,
    CircularProgress,
    ToggleButtonGroup,
    ToggleButton,
    Stack
} from '@mui/material';
import type { SearchResult } from '../types/spotify';
import { Link } from 'react-router-dom';

interface SearchResultsProps {
    results: SearchResult | null;
    loading: boolean;
    error: string | null;
}

type ResultType = 'artists' | 'albums' | 'tracks';

function SearchResults({ results, loading, error }: SearchResultsProps) {
    const [displayTypes, setDisplayTypes] = useState<ResultType[]>(['tracks']);

    const handleTypeChange = (
        _event: React.MouseEvent<HTMLElement>,
        newTypes: ResultType[]
    ) => {
        if (newTypes.length) {
            setDisplayTypes(newTypes);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress size={48} thickness={4} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ textAlign: 'center', my: 4 }}>
                <Typography color="error" variant="h6">
                    ⚠️ {error}
                </Typography>
            </Box>
        );
    }

    if (!results) {
        return null;
    }

    const hasResults =
        (results.artists?.items.length ?? 0) > 0 ||
        (results.albums?.items.length ?? 0) > 0 ||
        (results.tracks?.items.length ?? 0) > 0;

    if (!hasResults) {
        return (
            <Box sx={{ textAlign: 'center', my: 6 }}>
                <Typography variant="h6" color="text.secondary">
                    No results found. Try a different search.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 10 }}>
            {/* Type Selector UI */}
            <Box sx={{ mb: 1, display: 'flex', justifyContent: 'center', }}>
                <ToggleButtonGroup
                    value={displayTypes}
                    onChange={handleTypeChange}
                    aria-label="result types"
                    sx={{
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        p: 0.5,
                        boxShadow: 1
                    }}
                >
                    <ToggleButton
                        value="artists"
                        aria-label="artists"
                        sx={{
                            px: 3,
                            py: 1,
                            '&.Mui-selected': {
                                bgcolor: '#1DB954',
                                color: 'black',
                                '&:hover': {
                                    bgcolor: '#1ED760'
                                }
                            }
                        }}
                    >
                        Artists
                    </ToggleButton>
                    <ToggleButton
                        value="albums"
                        aria-label="albums"
                        sx={{
                            px: 3,
                            py: 1,
                            '&.Mui-selected': {
                                bgcolor: '#1DB954',
                                color: 'black',
                                '&:hover': {
                                    bgcolor: '#1ED760'
                                }
                            }
                        }}
                    >
                        Albums
                    </ToggleButton>
                    <ToggleButton
                        value="tracks"
                        aria-label="tracks"
                        sx={{
                            px: 3,
                            py: 1,
                            '&.Mui-selected': {
                                bgcolor: '#1DB954',
                                color: 'black',
                                '&:hover': {
                                    bgcolor: '#1ED760'
                                }
                            }
                        }}
                    >
                        Tracks
                    </ToggleButton>
                </ToggleButtonGroup>
            </Box>

            <Stack spacing={4}>
                {/* Artists Section */}
                {displayTypes.includes('artists') && results.artists?.items.length ? (
                    <Box>
                        <Typography variant="h5" component="h2" gutterBottom sx={{
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5
                        }}>
                            <Chip
                                label={results.artists.items.length}
                                size="small"
                                color="primary"
                                sx={{ fontWeight: 600 }}
                            />
                            Artists
                        </Typography>
                        <Grid container spacing={2}>
                            {results.artists.items.slice(0, 8).map((artist) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={artist.id}>
                                    <Card
                                        component={Link}
                                        to={`/artists/${artist.id}`}
                                        sx={{
                                            background: 'linear-gradient(135deg, rgba(255, 255, 255, .7) 100%, rgba(15, 77, 15, .15) 100%)',
                                            height: '100%',
                                            display: 'flex',
                                            borderRadius: 3,
                                            flexDirection: 'column',
                                            textDecoration: 'none',
                                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            '&:hover': {
                                                transform: 'translateY(-5px)',
                                                boxShadow: '0 10px 20px rgba(29, 185, 84, 0.2)',
                                                '& .artist-avatar': {
                                                    transform: 'scale(1.05)',
                                                    borderColor: 'primary.main',
                                                },
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                                            <Avatar
                                                className="artist-avatar"
                                                src={artist.images[0]?.url}
                                                alt={artist.name}
                                                sx={{
                                                    width: 120,
                                                    height: 120,
                                                    mx: 'auto',
                                                    mb: 2,
                                                    border: '3px solid',
                                                    borderColor: 'white',
                                                }}
                                            />
                                            <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                                                {artist.name}
                                            </Typography>
                                            <Chip
                                                label="Artist"
                                                size="small"
                                                sx={{
                                                    mt: 1,
                                                    bgcolor: 'rgba(29, 185, 84, 0.1)',
                                                    color: 'primary.dark',
                                                    fontWeight: 500
                                                }}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ) : null}

                {/* Albums Section */}
                {displayTypes.includes('albums') && results.albums?.items.length ? (
                    <Box>
                        <Typography variant="h5" component="h2" gutterBottom sx={{
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5
                        }}>
                            <Chip
                                label={results.albums.items.length}
                                size="small"
                                color="primary"
                                sx={{ fontWeight: 600 }}
                            />
                            Albums
                        </Typography>
                        <Grid container spacing={2}>
                            {results.albums.items.slice(0, 10).map((album) => (
                                <Grid size={{ xs: 14, sm: 4, md: 3, lg: 2 }} key={album.id}>
                                    <Card
                                        component={Link}
                                        to={`/albums/${album.id}`}
                                        sx={{
                                            background: 'linear-gradient(135deg, rgba(255, 255, 255, .7) 100%, rgba(15, 77, 15, .15) 100%)',
                                            height: '100%',
                                            display: 'flex',
                                            borderRadius: 2,
                                            flexDirection: 'column',
                                            textDecoration: 'none',
                                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-5px)',
                                                boxShadow: '0 10px 20px rgba(29, 185, 84, 0.2)'
                                            }
                                        }}
                                    >
                                        <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                                            <Avatar
                                                variant="square"
                                                src={album.images[0]?.url}
                                                alt={album.name}
                                                sx={{
                                                    width: 120,
                                                    height: 120,
                                                    mx: 'auto',
                                                    mb: 2,
                                                    borderRadius: 1
                                                }}
                                            />
                                            <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                                                {album.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                {album.artists.map(a => a.name).join(', ')}
                                            </Typography>
                                            <Chip
                                                label="Album"
                                                size="small"
                                                sx={{
                                                    mt: 1,
                                                    bgcolor: 'rgba(29, 185, 84, 0.1)',
                                                    color: 'primary.dark',
                                                    fontWeight: 500
                                                }}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ) : null}

                {/* Tracks Section */}
                {displayTypes.includes('tracks') && results.tracks?.items.length ? (
                    <Box>
                        <Typography variant="h5" component="h2" gutterBottom sx={{
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5
                        }}>
                            <Chip
                                label={results.tracks.items.length}
                                size="small"
                                color="primary"
                                sx={{ fontWeight: 600 }}
                            />
                            Tracks
                        </Typography>
                        <Grid container spacing={4}>
                            {results.tracks.items.slice(0, 10).map((track) => (
                                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={track.id} >
                                    <Card
                                        sx={{
                                            background: 'linear-gradient(135deg, rgba(255, 255, 255, .7) 100%, rgba(15, 77, 15, .15) 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            p: 1,
                                            width: '100%',
                                            borderRadius: 1,
                                            minHeight: 70, 
                                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 5px 15px rgba(29, 185, 84, 0.2)'
                                            }
                                        }}
                                    >
                                        <Avatar
                                            variant="square"
                                            src={track.album.images[0]?.url}
                                            alt={track.name}
                                            sx={{ width: 60, height: 60, mr: 2, flexShrink: 0 }}
                                        />
                                        <Box sx={{
                                            flexGrow: 1,
                                            minWidth: 0, 
                                            overflow: 'hidden'
                                        }}>
                                            <Typography
                                                variant="subtitle1"
                                                sx={{
                                                    fontWeight: 600,
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}
                                            >
                                                {track.name}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}
                                            >
                                                {track.artists.map(a => a.name).join(', ')} • {track.album.name}
                                            </Typography>
                                        </Box>
                                        <Chip
                                            label="Track"
                                            size="small"
                                            sx={{
                                                bgcolor: 'rgba(29, 185, 84, 0.1)',
                                                color: 'primary.dark',
                                                fontWeight: 500,
                                                flexShrink: 0,
                                                ml: 1
                                            }}
                                        />
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ) : null}
            </Stack>
        </Box>
    );
}

export default SearchResults;