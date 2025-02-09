'use client';

import { useState, useEffect } from 'react';
import { Theme as MuiTheme } from '@mui/material';

interface ThemeOption {
  name: string;
  value: string;
  colors: {
    light: {
      primary: string;
      secondary: string;
      background: string;
    };
    dark: {
      primary: string;
      secondary: string;
      background: string;
    };
  };
}

const defaultThemes: ThemeOption[] = [
  {
    name: 'Sunset Gold',
    value: 'gold',
    colors: {
      light: {
        primary: '#ffc107',
        secondary: '#ffe082',
        background: '#fffdf5'
      },
      dark: {
        primary: '#ffe082',
        secondary: '#ffc107',
        background: '#1a1500'
      }
    }
  },
  {
    name: 'Royal Purple',
    value: 'purple',
    colors: {
      light: {
        primary: '#9c27b0',
        secondary: '#e1bee7',
        background: '#faf5fb'
      },
      dark: {
        primary: '#e1bee7',
        secondary: '#9c27b0',
        background: '#1a071d'
      }
    }
  },
  {
    name: 'Ocean',
    value: 'ocean',
    colors: {
      light: {
        primary: '#1976d2',
        secondary: '#90caf9',
        background: '#f5f5f5'
      },
      dark: {
        primary: '#90caf9',
        secondary: '#1976d2',
        background: '#0a1929'
      }
    }
  },
  {
    name: 'Forest',
    value: 'forest',
    colors: {
      light: {
        primary: '#2e7d32',
        secondary: '#a5d6a7',
        background: '#f5faf5'
      },
      dark: {
        primary: '#a5d6a7',
        secondary: '#2e7d32',
        background: '#071a07'
      }
    }
  }
];

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeOption>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme ? JSON.parse(savedTheme) : defaultThemes[0];
    }
    return defaultThemes[0];
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('isDarkMode');
      return savedMode ? JSON.parse(savedMode) : false;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', JSON.stringify(theme));
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    }
  }, [isDarkMode]);

  return {
    theme,
    isDarkMode,
    setTheme,
    setIsDarkMode,
    themeOptions: defaultThemes,
  };
};