'use client';

import React, { useEffect } from 'react';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import { Tooltip } from '@mui/material';
import { SHORTCUTS, formatShortcut } from '../constants/shortcuts';
import { isInputFocused } from '../utils/keyboard';

interface NewNoteButtonProps {
  onNewNote: () => void;
}

export default function NewNoteButton({ onNewNote }: NewNoteButtonProps) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isInputFocused()) return;

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
    <Tooltip title="New note (N)" arrow placement="top">
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={onNewNote}
      >
        <AddIcon />
      </Fab>
    </Tooltip>
  );
} 