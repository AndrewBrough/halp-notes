import { 
  IconButton, 
  Divider, 
  Typography, 
  Chip, 
  Box, 
  Button,
  Drawer,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Collapse,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import RestoreIcon from '@mui/icons-material/Restore';
import { useState } from 'react';
import { useNotes } from '../context/NotesContext';
import { SHORTCUTS, formatShortcut } from '../constants/shortcuts';
import { useTheme } from '../context/ThemeContext';
import Tooltip from '@mui/material/Tooltip';
import PaletteIcon from '@mui/icons-material/Palette';

export const MainMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showThemeOptions, setShowThemeOptions] = useState(false);
  const { restoreTutorialNotes } = useNotes();
  const { 
    theme: currentTheme, 
    isDarkMode, 
    setTheme, 
    setIsDarkMode, 
    resetTheme,
    themeOptions 
  } = useTheme();

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleRestoreTutorials = () => {
    restoreTutorialNotes();
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={() => setIsOpen(true)}
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={isOpen}
        onClose={handleClose}
      >
        <Box sx={{ width: 320, p: 2 }}>
          <Button
            onClick={() => setShowThemeOptions(!showThemeOptions)}
            startIcon={<PaletteIcon />}
            variant="outlined"
            fullWidth
            sx={{ 
              mb: 2,
              justifyContent: 'flex-start',
              textAlign: 'left'
            }}
          >
            Customize Theme
          </Button>

          <Collapse in={showThemeOptions} timeout="auto">
            <Box sx={{ mb: 2 }}>
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
          </Collapse>

          <Divider sx={{ my: 2 }} />
          <Button
            onClick={handleRestoreTutorials}
            startIcon={<HelpOutlineIcon />}
            variant="outlined"
            fullWidth
            sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
          >
            Restore Tutorial Notes
          </Button>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <KeyboardIcon sx={{ mr: 1 }} />
            <Typography variant="subtitle2">
              Keyboard Shortcuts
            </Typography>
          </Box>
          {Object.entries(SHORTCUTS).map(([key, shortcut]) => (
            <Typography 
              key={key} 
              variant="body2" 
              color="text.secondary" 
              sx={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '12px',
                width: '100%',
                alignItems: 'center',
                mb: 0.5
              }}
            >
              <Chip 
                label={formatShortcut(shortcut.keys)}
                size="small"
                variant="outlined"
                sx={{ 
                  fontFamily: 'monospace',
                  borderRadius: '4px',
                  height: '24px'
                }}
              />
              {shortcut.description}
            </Typography>
          ))}
        </Box>
      </Drawer>
    </>
  );
}; 