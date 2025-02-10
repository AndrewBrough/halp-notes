'use client';

import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Box,
  IconButton,
  Stack,
  Chip,
  Autocomplete,
  TextField,
  DialogActions
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import { Note } from '../types';

interface RandomNotesDialogProps {
  open: boolean;
  onClose: () => void;
  notes: Note[];
  availableTags: string[];
}

export default function RandomNotesDialog({ open, onClose, notes, availableTags }: RandomNotesDialogProps) {
  const [randomNotes, setRandomNotes] = useState<Note[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSelectingTags, setIsSelectingTags] = useState(true);

  const getRandomNotes = () => {
    const filteredNotes = selectedTags.length > 0
      ? notes.filter(note => selectedTags.every(tag => note.tags.includes(tag)))
      : notes;

    const shuffled = [...filteredNotes].sort(() => Math.random() - 0.5);
    setRandomNotes(shuffled.slice(0, 3));
  };

  const handleStartGeneration = () => {
    setIsSelectingTags(false);
    getRandomNotes();
  };

  const handleClose = () => {
    onClose();
    setIsSelectingTags(true);
    setSelectedTags([]);
  };

  useEffect(() => {
    if (!open) {
      setIsSelectingTags(true);
      setSelectedTags([]);
    }
  }, [open]);

  if (isSelectingTags) {
    return (
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">What do you need halp with?</Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Autocomplete
            multiple
            options={availableTags}
            value={selectedTags}
            onChange={(_, newValue) => setSelectedTags(newValue)}
            sx={{ mt: 0.75 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select tags"
                placeholder="Choose tags"
              />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option}
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleStartGeneration} 
            variant="contained"
            disabled={selectedTags.length === 0}
          >
            Generate Random Notes
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Random Notes</Typography>
          <Stack direction="row" spacing={1}>
            <Button
              startIcon={<RefreshIcon />}
              onClick={getRandomNotes}
              variant="outlined"
              size="small"
            >
              Re-roll
            </Button>
            <IconButton size="small" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box mb={2}>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Filtering by tags:
          </Typography>
          <Stack direction="row" spacing={1}>
            {selectedTags.map(tag => (
              <Chip key={tag} label={tag} size="small" />
            ))}
          </Stack>
        </Box>
        <Stack spacing={2}>
          {randomNotes.map(note => (
            <Card key={note.id} variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {note.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {note.content}
                </Typography>
                {note.tags.length > 0 && (
                  <Stack direction="row" spacing={1}>
                    {note.tags.map(tag => (
                      <Chip key={tag} label={tag} size="small" variant="outlined" />
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          ))}
          {randomNotes.length === 0 && (
            <Typography color="text.secondary" align="center">
              No notes found with the selected tags.
            </Typography>
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
} 