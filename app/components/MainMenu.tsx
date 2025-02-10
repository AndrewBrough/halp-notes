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
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import RestoreIcon from '@mui/icons-material/Restore';
import { useState, useEffect } from 'react';
import { useNotes } from '../context/NotesContext';
import { SHORTCUTS, SHORTCUT_CATEGORIES, formatShortcut } from '../constants/shortcuts';
import { useTheme } from '../context/ThemeContext';
import PaletteIcon from '@mui/icons-material/Palette';
import { isInputFocused } from '../utils/keyboard';

interface MainMenuProps {
  sx?: object;
}

export const MainMenu = ({ sx }: MainMenuProps) => {
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

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isInputFocused()) return;
      
      if (event.key.toLowerCase() === 'm') {
        event.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleRestoreTutorials = () => {
    restoreTutorialNotes();
    handleClose();
  };

  return (
    <>
      <Tooltip 
        title={`Open menu (${formatShortcut(SHORTCUTS.OPEN_MENU.keys)})`} 
        arrow 
        placement="bottom"
      >
        <IconButton
          onClick={() => setIsOpen(true)}
          size="large"
          edge="end"
          sx={sx}
          aria-label="Open main menu"
        >
          <MenuIcon />
        </IconButton>
      </Tooltip>
      <Drawer
        anchor="right"
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
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <KeyboardIcon sx={{ mr: 1 }} />
            <Typography variant="subtitle2">
              Keyboard Shortcuts
            </Typography>
          </Box>
          {Object.entries(SHORTCUT_CATEGORIES).map(([category, shortcuts]) => (
            <Box key={category} sx={{ mb: 2 }}>
              <Typography 
                variant="overline" 
                sx={{ 
                  display: 'block',
                  mb: 0.5 
                }}
              >
                {category}
              </Typography>
              {Object.entries(shortcuts).map(([key, shortcut]) => (
                <Typography
                  key={key} 
                  variant="body2"
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
          ))}
        </Box>
      </Drawer>
    </>
  );
}; 