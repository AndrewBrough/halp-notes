import { 
  IconButton, 
  Divider, 
  Typography, 
  Chip, 
  Box, 
  Button,
  Drawer
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { useState } from 'react';
import { useNotes } from '../context/NotesContext';
import { SHORTCUTS, formatShortcut } from '../constants/shortcuts';

export const MainMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { restoreTutorialNotes } = useNotes();

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