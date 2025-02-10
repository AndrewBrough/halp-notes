'use client';

import React, { useEffect } from 'react';
import Fab from '@mui/material/Fab';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { Tooltip } from '@mui/material';
import { isInputFocused } from '../utils/keyboard';

interface RandomNotesButtonProps {
  onClick: () => void;
}

export default function RandomNotesButton({ onClick }: RandomNotesButtonProps) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isInputFocused()) return;

      if (event.key.toLowerCase() === 'h') {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }
    };

    document.addEventListener('keydown', handleKeyPress, true);
    return () => document.removeEventListener('keydown', handleKeyPress, true);
  }, [onClick]);

  return (
    <Tooltip title="Show random notes (H)" arrow placement="top">
      <Fab
        color="secondary"
        sx={{ position: 'fixed', bottom: 16, right: 80 }}
        onClick={onClick}
      >
        <ShuffleIcon />
      </Fab>
    </Tooltip>
  );
} 