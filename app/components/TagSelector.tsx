import { Autocomplete, Chip, TextField } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useNotes } from '../context/NotesContext';
import { useState, useEffect } from 'react';

export default function TagSelector() {
  const { tags, selectedTags, setSelectedTags } = useNotes();
  const theme = useTheme();
  const [, forceUpdate] = useState({});

  useEffect(() => {
    const handleNotesUpdate = () => {
      forceUpdate({});
    };
    window.addEventListener('notes-updated', handleNotesUpdate);
    return () => window.removeEventListener('notes-updated', handleNotesUpdate);
  }, []);

  const handleTagChange = (_: any, newValue: string[]) => {
    setSelectedTags(newValue.map(tag => tag.toLowerCase().trim()));
  };

  const handleTagDelete = (tagToDelete: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToDelete));
  };

  return (
    <Autocomplete
      multiple
      autoHighlight
      autoSelect
      selectOnFocus
      options={tags}
      value={selectedTags}
      onChange={handleTagChange}
      sx={{
        '& .MuiInputBase-root': {
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
        },
      }}
      renderInput={(params) => (
        <TextField {...params} label="Filter by tags" />
      )}
      renderTags={(value) =>
        value.map((option) => (
          <Chip
            label={option}
            onDelete={() => handleTagDelete(option)}
            key={option}
          />
        ))
      }
    />
  );
} 