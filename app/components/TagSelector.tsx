import { Autocomplete, Chip, TextField, InputAdornment } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useNotes } from '../context/NotesContext';
import { useState, useEffect, useRef } from 'react';
import { createFilterOptions } from '@mui/material/Autocomplete';
import { isInputFocused } from '../utils/keyboard';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

export default function TagSelector() {
  const { tags, selectedTags, setSelectedTags } = useNotes();
  const theme = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [, forceUpdate] = useState({});
  const filterInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const handleNotesUpdate = () => {
      forceUpdate({});
    };
    window.addEventListener('notes-updated', handleNotesUpdate);
    return () => window.removeEventListener('notes-updated', handleNotesUpdate);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isInputFocused()) return;
      
      if (event.key.toLowerCase() === 'f') {
        event.preventDefault();
        filterInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleTagChange = (_: any, newValue: string[]) => {
    // Only prevent new selections when there's no input
    // Allow deletions and existing tag selections at any time
    if (inputValue.length > 0 || newValue.length < selectedTags.length || newValue.every(tag => tags.includes(tag))) {
      setSelectedTags(newValue.map(tag => tag.toLowerCase().trim()));
    }
  };

  const handleTagDelete = (tagToDelete: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToDelete));
  };

  const filterOptions = createFilterOptions<string>();

  return (
    <Autocomplete
      multiple
      autoHighlight
      autoSelect={inputValue.length > 0}
      selectOnFocus={inputValue.length > 0}
      options={tags}
      value={selectedTags}
      onChange={handleTagChange}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      filterOptions={filterOptions}
      sx={{
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
      renderInput={(params) => (
        <TextField 
          {...params} 
          inputRef={filterInputRef}
          label="Filter by tags"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
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
                  <LocalOfferIcon color="action" />
                </InputAdornment>
                {params.InputProps.startAdornment}
              </>
            ),
          }}
        />
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
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault(); // Prevent the default Autocomplete escape behavior
          event.currentTarget.blur();
        }
      }}
    />
  );
} 