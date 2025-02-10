'use client';

import { ToggleButton, ToggleButtonGroup, Typography, Box } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

interface ViewToggleProps {
  view: 'date' | 'tags';
  onViewChange: (view: 'date' | 'tags') => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'end', mb: 2 }}>
      <ToggleButtonGroup
        value={view}
        exclusive
        onChange={(_, newView) => {
          if (newView !== null) {
            onViewChange(newView);
          }
        }}
        size="small"
      >
        <ToggleButton value="date">
          <SortIcon sx={{ mr: 1 }} />
          By Date
        </ToggleButton>
        <ToggleButton value="tags">
          <LocalOfferIcon sx={{ mr: 1 }} />
          By Tags
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
} 