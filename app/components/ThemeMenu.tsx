'use client';

import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import PaletteIcon from '@mui/icons-material/Palette';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { ThemeOption } from '../types';

interface ThemeMenuProps {
  currentTheme: ThemeOption;
  isDarkMode: boolean;
  onThemeChange: (theme: ThemeOption) => void;
  onDarkModeChange: (isDark: boolean) => void;
  themeOptions: ThemeOption[];
}

export default function ThemeMenu({
  currentTheme,
  isDarkMode,
  onThemeChange,
  onDarkModeChange,
  themeOptions,
}: ThemeMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        aria-label="theme menu"
      >
        <PaletteIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {themeOptions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => {
              onThemeChange(option);
              handleClose();
            }}
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
        <Divider />
        <MenuItem onClick={() => onDarkModeChange(!isDarkMode)}>
          <ListItemIcon>
            <DarkModeIcon />
          </ListItemIcon>
          <ListItemText>Dark Mode</ListItemText>
          <Switch
            edge="end"
            checked={isDarkMode}
            onChange={(e) => onDarkModeChange(e.target.checked)}
          />
        </MenuItem>
      </Menu>
    </>
  );
}