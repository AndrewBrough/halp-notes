'use client';

import React, { useEffect } from 'react';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { SHORTCUTS, formatShortcut } from '../constants/shortcuts';

interface NewNoteButtonProps {
  onNewNote: () => void;
}

export default function NewNoteButton({ onNewNote }: NewNoteButtonProps) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'n') {
        event.preventDefault();
        event.stopPropagation();
        onNewNote();
      }
    };

    document.addEventListener('keydown', handleKeyPress, true);
    return () => document.removeEventListener('keydown', handleKeyPress, true);
  }, [onNewNote]);

  return (
    <Fab
      color="primary"
      sx={{ position: 'fixed', bottom: 16, right: 16 }}
      onClick={onNewNote}
      aria-label={`Add new note (${formatShortcut(SHORTCUTS.NEW_NOTE.keys)})`}
    >
      <AddIcon />
    </Fab>
  );
} 