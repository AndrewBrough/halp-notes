'use client';

import React from 'react';
import Fab from '@mui/material/Fab';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import { Tooltip } from '@mui/material';

interface RandomNotesButtonProps {
  onClick: () => void;
}

export default function RandomNotesButton({ onClick }: RandomNotesButtonProps) {
  return (
    <Tooltip title="Show random notes" arrow placement="top">
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