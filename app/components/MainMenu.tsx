import { Menu, MenuItem, IconButton, Divider, Typography, Chip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { useState } from 'react';
import { useNotes } from '../context/NotesContext';
import { SHORTCUTS, formatShortcut } from '../constants/shortcuts';


export const MainMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { restoreTutorialNotes } = useNotes();
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRestoreTutorials = () => {
    restoreTutorialNotes();
    handleClose();
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
      >
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleRestoreTutorials}>
          <HelpOutlineIcon sx={{ mr: 1 }} />
          Restore Tutorial Notes
        </MenuItem>
        <Divider />
        <MenuItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
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
        </MenuItem>
      </Menu>
    </>
  );
}; 