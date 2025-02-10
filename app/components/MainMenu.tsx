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
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { useState, useEffect } from 'react';
import { useNotes } from '../context/NotesContext';
import { SHORTCUTS, SHORTCUT_CATEGORIES, formatShortcut } from '../constants/shortcuts';
import { useTheme } from '../context/ThemeContext';
import PaletteIcon from '@mui/icons-material/Palette';
import { isInputFocused } from '../utils/keyboard';
import { foodNotes } from '../defaultNotes/foodNotes';
import { STORAGE_KEY } from '../context/NotesContext';
import { alpha } from '@mui/material/styles';
import { ThemeSection } from './menu/ThemeSection';
import { KeyboardShortcutsSection } from './menu/KeyboardShortcutsSection';

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

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleAddFoodNotes = () => {
    if (window.confirm('Add sample food notes? This will not affect your existing notes.')) {
      const existingData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{"notes":[], "tags":[]}');
      const newData = {
        notes: [...existingData.notes, ...foodNotes],
        tags: Array.from(new Set([...existingData.tags, ...foodNotes.flatMap(note => note.tags)]))
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      window.location.reload();
    }
  };

  // Update the common button styles for the menu buttons
  const buttonSx = {
    justifyContent: 'flex-start', 
    textAlign: 'left',
    mb: 2,
    backgroundColor: isDarkMode ? currentTheme.colors.dark.primary : currentTheme.colors.light.primary,
    color: '#fff',
    '&:hover': {
      backgroundColor: alpha(isDarkMode ? currentTheme.colors.dark.primary : currentTheme.colors.light.primary, 0.8),
    }
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
        <Box sx={{ width: 320, p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <KeyboardShortcutsSection />
          <ThemeSection buttonSx={buttonSx} />

          <Button
            onClick={handleRestoreTutorials}
            startIcon={<HelpOutlineIcon />}
            variant="contained"
            fullWidth
            sx={{...buttonSx, mt: 'auto'}}
          >
            Restore Tutorial Notes
          </Button>
          <Button
            onClick={handleAddFoodNotes}
            startIcon={<RestaurantIcon />}
            variant="contained"
            fullWidth
            sx={buttonSx}
          >
            Add Sample Food Notes
          </Button>
          <Button
            onClick={handleClearData}
            startIcon={<DeleteSweepIcon />}
            variant="contained"
            color="error"
            fullWidth
            sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
          >
            Clear All Data
          </Button>
        </Box>
      </Drawer>
    </>
  );
}; 