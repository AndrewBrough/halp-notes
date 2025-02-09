import { Menu, MenuItem, IconButton, Divider, Typography } from '@mui/material';
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
          <Typography variant="body2" color="text.secondary">
            {SHORTCUTS.NEW_NOTE.description}:{' '}
            <strong>{formatShortcut(SHORTCUTS.NEW_NOTE.keys)}</strong>
          </Typography>
        </MenuItem>
      </Menu>
    </>
  );
}; 