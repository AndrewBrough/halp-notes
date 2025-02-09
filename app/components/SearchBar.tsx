import { TextField } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useNotes } from '../context/NotesContext';
import InputAdornment from '@mui/material/InputAdornment';
import HistoryIcon from '@mui/icons-material/History';
import Tooltip from '@mui/material/Tooltip';

export default function SearchBar() {
  const { searchQuery, setSearchQuery, notes } = useNotes();
  const theme = useTheme();

  // Check if there are any matches in version history
  const hasVersionMatches = searchQuery && notes.some(note => 
    note.versions.some(version => 
      version.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      version.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <TextField
      fullWidth
      label="Search notes (includes version history)"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      InputProps={{
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
        },
      }}
    />
  );
} 