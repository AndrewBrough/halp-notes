'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Autocomplete,
  Chip,
} from '@mui/material';
import { Note } from '../types';

interface NoteDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (title: string, content: string, tags: string[]) => void;
  existingNote?: Note;
  availableTags: string[];
}

export default function NoteDialog({
  open,
  onClose,
  onSave,
  existingNote,
  availableTags,
}: NoteDialogProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title);
      setContent(existingNote.content);
      setTags(existingNote.tags);
    } else {
      setTitle('');
      setContent('');
      setTags([]);
    }
  }, [existingNote, open]);

  const handleSave = () => {
    if (title.trim() && content.trim()) {
      onSave(title.trim(), content.trim(), tags);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{existingNote ? 'Edit Note' : 'New Note'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Content"
          fullWidth
          multiline
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Autocomplete
          multiple
          freeSolo
          options={availableTags}
          value={tags}
          onChange={(_, newValue) => setTags(newValue)}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                label={option}
                {...getTagProps({ index })}
                key={option}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              margin="dense"
              label="Tags"
              placeholder="Add tags"
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}