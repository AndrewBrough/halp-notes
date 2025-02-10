'use client';

import { ToggleButton, ToggleButtonGroup, Typography, Box } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useTheme } from '../context/ThemeContext';
import { alpha } from '@mui/material/styles';

interface ViewToggleProps {
  view: 'date' | 'tags';
  onViewChange: (view: 'date' | 'tags') => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  const { theme, isDarkMode } = useTheme();
  
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
        sx={{
          '& .MuiToggleButton-root': {
            borderColor: isDarkMode ? theme.colors.dark.primary : theme.colors.light.primary,
            '& .MuiTouchRipple-child': {
              backgroundColor: isDarkMode ? theme.colors.dark.primary : theme.colors.light.primary,
            },
            '&:hover': {
              backgroundColor: alpha(isDarkMode ? theme.colors.dark.primary : theme.colors.light.primary, 0.08),
            },
            '&.Mui-selected': {
              backgroundColor: isDarkMode ? theme.colors.dark.secondary : theme.colors.light.secondary,
              '&:hover': {
                backgroundColor: alpha(isDarkMode ? theme.colors.dark.secondary : theme.colors.light.secondary, 0.8),
              },
            },
          },
          '& .MuiToggleButton-root:not(:last-child)': {
            borderRight: `1px solid ${isDarkMode ? theme.colors.dark.primary : theme.colors.light.primary} !important`,
          },
        }}
      >
        <ToggleButton value="date">
          <SortIcon sx={{ mr: 1, fontSize: 20 }} />
          By Date
        </ToggleButton>
        <ToggleButton value="tags">
          <LocalOfferIcon sx={{ mr: 1, fontSize: 20 }} />
          By Tags
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
} 