import { useState } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  InputAdornment,
  Chip
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { alpha } from '@mui/material/styles';

export type SearchType = 'artist' | 'album' | 'track';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box
      sx={{
        mx: 'auto',
        mb: 6,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -10,
          left: -10,
          right: -10,
          bottom: -10,
          background: 'linear-gradient(135deg, #0F4D0F 0%, #008000 100%)',
          borderRadius: 4,
          zIndex: -1,
          opacity: isFocused ? 0.8 : 0.3,
          transition: 'opacity 0.3s ease'
        }
      }}
    >
      <Paper
        elevation={isFocused ? 6 : 3}
        sx={{
          p: 2,
          background: alpha('#fff', 0.85),
          backdropFilter: 'blur(8px)',
          border: '1px solid',
          borderColor: isFocused ? 'primary.main' : 'divider',
          transition: 'all 0.3s ease',
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            borderColor: 'primary.main',
            background: alpha('#fff', 0.95)
          }
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search artists, tracks, albums..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon
                      fontSize="medium"
                      color={isFocused ? 'primary' : 'action'}
                    />
                  </InputAdornment>
                ),
                endAdornment: query && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={handleClear}
                      sx={{ color: 'text.secondary' }}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: 'none'
                  }
                }
              }
            }}
            sx={{
              '& .MuiInputBase-input': {
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 500
              }
            }}
          />

          <Chip
            label="Search"
            icon={<SearchIcon fontSize="small" />}
            color="primary"
            clickable
            onClick={handleSearch}
            disabled={!query.trim()}
            sx={{
              height: 40,
              px: 2,
              fontWeight: 600,
              fontSize: '0.9rem',
              background: isFocused
                ? 'linear-gradient(135deg, #0F4D0F 0%, #008000 100%)'
                : 'rgba(15, 77, 15, 0.7)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #0F4D0F 0%, #008000 100%)'
              },
              '& .MuiChip-icon': {
                color: 'white'
              }
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
}

export default SearchBar;