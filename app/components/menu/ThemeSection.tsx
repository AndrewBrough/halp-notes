import { 
  Box, 
  Button, 
  MenuItem, 
  ListItemIcon, 
  ListItemText, 
  Switch, 
  Collapse,
  Typography
} from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import RestoreIcon from '@mui/icons-material/Restore';
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { alpha } from '@mui/material/styles';

interface ThemeSectionProps {
  buttonSx: object;
}

export function ThemeSection({ buttonSx }: ThemeSectionProps) {
  const { 
    theme: currentTheme, 
    isDarkMode, 
    setTheme, 
    setIsDarkMode, 
    resetTheme,
    themeOptions 
  } = useTheme();

  return (
      <Box sx={{ mb: 2 }}>
      <Typography 
        variant="overline" 
        sx={{ 
          display: 'block',
          
        }}
      >
        <PaletteIcon sx={{ mr: 1 }} />
        Customize Theme
      </Typography>
        {themeOptions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => setTheme(option)}
            selected={option.value === currentTheme.value}
            sx={{ width: '100%', textAlign: 'left' }}
          >
            <ListItemIcon>
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  background: option.colors.light.primary,
                }}
              />
            </ListItemIcon>
            <ListItemText sx={{ textAlign: 'left' }}>{option.name}</ListItemText>
          </MenuItem>
        ))}
        <MenuItem sx={{ width: '100%', textAlign: 'left' }}>
          <ListItemIcon>
            <DarkModeIcon />
          </ListItemIcon>
          <ListItemText sx={{ textAlign: 'left' }}>Dark Mode</ListItemText>
          <Switch
            edge="end"
            checked={isDarkMode}
            onChange={(e) => setIsDarkMode(e.target.checked)}
          />
        </MenuItem>
        <MenuItem onClick={resetTheme} sx={{ width: '100%', textAlign: 'left' }}>
          <ListItemIcon>
            <RestoreIcon />
          </ListItemIcon>
          <ListItemText sx={{ textAlign: 'left' }}>Reset to Default</ListItemText>
        </MenuItem>
      </Box>
  );
} 