import { TextField } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useNotes } from '../context/NotesContext';
import InputAdornment from '@mui/material/InputAdornment';
import HistoryIcon from '@mui/icons-material/History';
import Tooltip from '@mui/material/Tooltip';
import { useRef, useEffect } from 'react';
import { isInputFocused } from '../utils/keyboard';
import SearchIcon from '@mui/icons-material/Search';

export default function SearchBar() {
  const { searchQuery, setSearchQuery, notes } = useNotes();
  const theme = useTheme();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isInputFocused()) return;
      
      if (event.key.toLowerCase() === 's') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Check if there are any matches in version history
  const hasVersionMatches = searchQuery && notes.some(note => 
    note.versions.some(version => 
      version.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      version.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <TextField
      inputRef={searchInputRef}
      fullWidth
      label="Search notes (includes version history)"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.currentTarget.blur();
        }
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment 
            position="start"
            sx={{
              transition: 'all 0.2s ease-in-out',
              '.MuiSvgIcon-root': {
                fontSize: '1.2rem',
                transition: 'transform 0.2s ease-in-out',
              },
              '.MuiInputBase-root:hover &': {
                '.MuiSvgIcon-root': {
                  transform: 'scale(1.2)',
                }
              },
              '.MuiInputBase-root.Mui-focused &': {
                transform: 'scale(0)',
                width: 0,
                marginRight: 0,
              }
            }}
          >
            <SearchIcon color="action" />
          </InputAdornment>
        ),
        endAdornment: hasVersionMatches && (
          <InputAdornment position="end">
            <Tooltip title="Matches found in version history">
              <HistoryIcon color="primary" />
            </Tooltip>
          </InputAdornment>
        ),
      }}
      sx={{
        mb: 2,
        '& .MuiInputBase-root': {
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
          transition: 'padding-left 0.2s ease-in-out',
          paddingLeft: '32px',
          '&.Mui-focused': {
            paddingLeft: '12px',
          },
          '& .MuiInputAdornment-root': {
            position: 'absolute',
            left: '8px',
            transition: 'transform 0.2s ease-in-out, opacity 0.2s ease-in-out',
            '&.Mui-focused': {
              transform: 'translateX(-100%)',
              opacity: 0,
            }
          }
        },
      }}
    />
  );
} 