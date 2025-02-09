import { TextField } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useNotes } from '../context/NotesContext';

export default function SearchBar() {
  const { searchQuery, setSearchQuery } = useNotes();
  const theme = useTheme();

  return (
    <TextField
      fullWidth
      label="Search notes"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      sx={{
        mb: 2,
        '& .MuiInputBase-root': {
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
        },
      }}
    />
  );
} 