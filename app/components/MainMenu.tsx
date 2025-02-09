import { Menu, MenuItem, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useState } from 'react';
import { useNotes } from '../context/NotesContext';

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
      </Menu>
    </>
  );
}; 