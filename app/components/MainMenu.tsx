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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness';
import RestoreIcon from '@mui/icons-material/Restore';
import { useState } from 'react';
import { useNotes } from '../context/NotesContext';
import { SHORTCUTS, formatShortcut } from '../constants/shortcuts';
import { useTheme } from '../hooks/useTheme';
import Tooltip from '@mui/material/Tooltip';
import PaletteIcon from '@mui/icons-material/Palette';

export const MainMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showThemeOptions, setShowThemeOptions] = useState(false);
  const { restoreTutorialNotes } = useNotes();
  const { 
    theme: currentTheme, 
    isDarkMode, 
    isDarkModeAuto, 
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
        <Box sx={{ width: 280, p: 2 }}>
          <Button
            onClick={() => setShowThemeOptions(!showThemeOptions)}
            startIcon={<PaletteIcon />}
            variant="outlined"
            fullWidth
            sx={{ mb: showThemeOptions ? 2 : 0 }}
          >
            Customize Theme
          </Button>

          {showThemeOptions && (
            <>
              {themeOptions.map((option) => (
                <MenuItem
                  key={option.value}
                  onClick={() => setTheme(option)}
                  selected={option.value === currentTheme.value}
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
                  <ListItemText>{option.name}</ListItemText>
                </MenuItem>
              ))}
              <MenuItem onClick={() => setIsDarkMode(!isDarkMode)}>
                <ListItemIcon>
                  <DarkModeIcon />
                </ListItemIcon>
                <ListItemText>Dark Mode</ListItemText>
                <Switch
                  edge="end"
                  checked={isDarkMode}
                  disabled={isDarkModeAuto}
                  onChange={(e) => setIsDarkMode(e.target.checked)}
                />
              </MenuItem>
              <MenuItem onClick={() => setIsDarkMode('auto')}>
                <Tooltip 
                  title="Will automatically change to dark mode after sunset and before sunrise"
                  placement="right"
                >
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <ListItemIcon>
                      <SettingsBrightnessIcon />
                    </ListItemIcon>
                    <ListItemText>Auto Dark Mode</ListItemText>
                  </div>
                </Tooltip>
                <Switch
                  edge="end"
                  checked={isDarkModeAuto}
                  onChange={(e) => setIsDarkMode(e.target.checked ? 'auto' : false)}
                />
              </MenuItem>
              <MenuItem onClick={resetTheme}>
                <ListItemIcon>
                  <RestoreIcon />
                </ListItemIcon>
                <ListItemText>Reset to Default</ListItemText>
              </MenuItem>
            </>
          )}

          <Divider sx={{ my: 2 }} />
          <Button
            onClick={handleRestoreTutorials}
            startIcon={<HelpOutlineIcon />}
            variant="outlined"
            fullWidth
          >
            Restore Tutorial Notes
          </Button>
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="subtitle2"
            sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
          >
            <KeyboardIcon sx={{ mr: 1 }} />
            Keyboard Shortcuts
          </Typography>
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