'use client';

import { useState, useEffect, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
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
  const titleRef = useRef<HTMLInputElement>(null);

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
    // Focus the title input after the dialog opens
    if (open) {
      setTimeout(() => {
        titleRef.current?.focus();
      }, 100);
    }
  }, [existingNote, open]);

  const normalizeTag = (tag: string) => tag.trim().toLowerCase();

  const handleSave = () => {
    if (title.trim() && content.trim()) {
      const normalizedTags = tags.map(normalizeTag).filter(tag => tag !== '');
      onSave(title.trim(), content.trim(), normalizedTags);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{existingNote ? 'Edit Note' : 'New Note'}</DialogTitle>
      <DialogContent>
        <TextField
          inputRef={titleRef}
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
          onChange={(_, newValue) => {
            const normalizedTags = newValue
              .map(normalizeTag)
              .filter(tag => tag !== '');
            setTags(Array.from(new Set(normalizedTags)));
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && event.target instanceof HTMLInputElement) {
              const inputValue = event.target.value.trim();
              if (inputValue && !tags.includes(inputValue)) {
                const normalizedTag = normalizeTag(inputValue);
                if (normalizedTag) {
                  setTags([...tags, normalizedTag]);
                  // Clear the input
                  event.target.value = '';
                }
              }
              // Prevent default to avoid form submission
              event.preventDefault();
            }
          }}
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
              placeholder="Add tags (press Enter to add)"
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