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
import { Box, Typography, IconButton } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useNotes } from '../context/NotesContext';

interface NoteDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (title: string, content: string, tags: string[]) => void;
  existingNote?: Note;
}

export default function NoteDialog({
  open,
  onClose,
  onSave,
  existingNote,
}: NoteDialogProps) {
  const { tags: availableTags } = useNotes();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentVersionIndex, setCurrentVersionIndex] = useState<number>(-1);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title);
      setContent(existingNote.content);
      setTags(existingNote.tags);
      setCurrentVersionIndex(-1); // Reset to current version
    } else {
      setTitle('');
      setContent('');
      setTags([]);
      setCurrentVersionIndex(-1);
    }
    if (open) {
      setTimeout(() => {
        titleRef.current?.focus();
      }, 100);
    }
  }, [existingNote, open]);

  const handleVersionChange = (direction: 'prev' | 'next') => {
    if (!existingNote?.versions || !Array.isArray(existingNote.versions)) return;
    
    const versions = existingNote.versions;
    let newIndex: number;
    
    if (currentVersionIndex === -1) {
      // Currently on latest version, can only go back
      newIndex = direction === 'prev' ? versions.length - 1 : -1;
    } else {
      // In history, can go either direction
      newIndex = direction === 'prev' 
        ? Math.max(0, currentVersionIndex - 1)
        : Math.min(versions.length - 1, currentVersionIndex + 1);
      
      // If going forward and reached the end, show current version
      if (direction === 'next' && newIndex === currentVersionIndex) {
        newIndex = -1;
      }
    }
    
    if (newIndex === -1) {
      // Show current version
      setTitle(existingNote.title);
      setContent(existingNote.content);
      setTags(existingNote.tags);
    } else {
      // Show historical version
      const version = versions[newIndex];
      setTitle(version.title);
      setContent(version.content);
      setTags(version.tags);
    }
    setCurrentVersionIndex(newIndex);
  };

  const normalizeTag = (tag: string) => tag.trim().toLowerCase();

  const handleSave = () => {
    if (title.trim() && content.trim()) {
      const normalizedTags = tags.map(normalizeTag).filter(tag => tag !== '');
      onSave(title.trim(), content.trim(), normalizedTags);
      onClose();
    }
  };

  const handleSaveAndNew = () => {
    if (title.trim() && content.trim()) {
      const normalizedTags = tags.map(normalizeTag).filter(tag => tag !== '');
      onSave(title.trim(), content.trim(), normalizedTags);
      // Reset form but keep dialog open
      setTitle('');
      setContent('');
      setTags([]);
      titleRef.current?.focus();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {existingNote ? 'Edit Note' : 'New Note'}
          </Typography>
          {existingNote && Array.isArray(existingNote.versions) && existingNote.versions.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="small"
                onClick={() => handleVersionChange('prev')}
                disabled={currentVersionIndex === 0}
              >
                <NavigateBeforeIcon />
              </IconButton>
              <Typography variant="body2" color="text.secondary">
                {currentVersionIndex === -1 
                  ? 'Current Version'
                  : `Version ${currentVersionIndex + 1}/${existingNote.versions.length}`}
              </Typography>
              <IconButton
                size="small"
                onClick={() => handleVersionChange('next')}
                disabled={currentVersionIndex === -1}
              >
                <NavigateNextIcon />
              </IconButton>
            </Box>
          )}
        </Box>
        {existingNote && (
          <Typography variant="caption" color="text.secondary">
            Created {new Date(existingNote.createdAt).toLocaleString()}
            {currentVersionIndex === -1 && existingNote.updatedAt !== existingNote.createdAt && (
              <> • Last edited {new Date(existingNote.updatedAt).toLocaleString()}</>
            )}
          </Typography>
        )}
      </DialogTitle>
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
          autoHighlight
          autoSelect
          selectOnFocus
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
        <Button onClick={onClose} tabIndex={2}>Cancel</Button>
        {!existingNote && (
          <Button onClick={handleSaveAndNew} color="primary" tabIndex={1}>
            Save & New
          </Button>
        )}
        <Button onClick={handleSave} variant="contained" color="primary" tabIndex={0} autoFocus>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}