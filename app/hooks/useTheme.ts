'use client';

import { useState, useEffect } from 'react';

const THEME_STORAGE_KEY = 'notes-app-theme';

export const themeOptions = [
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
  },
  {
    name: 'Ruby',
    value: 'ruby',
    colors: {
      light: {
        primary: '#d32f2f',
        secondary: '#ef9a9a',
        background: '#fff5f5'
      },
      dark: {
        primary: '#ef9a9a',
        secondary: '#d32f2f',
        background: '#1a0707'
      }
    }
  }
];

export const useTheme = () => {
  const [theme, setTheme] = useState(themeOptions[0]); // Sunset Gold is now first
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
      const parsed = JSON.parse(savedTheme);
      setTheme(themeOptions.find(t => t.value === parsed.theme) || themeOptions[0]);
      setIsDarkMode(parsed.isDark);
    }

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (!savedTheme) {
      setIsDarkMode(darkModeMediaQuery.matches);
    }

    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        setIsDarkMode(e.matches);
      }
    };
    darkModeMediaQuery.addEventListener('change', handleChange);
    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify({
      theme: theme.value,
      isDark: isDarkMode
    }));
  }, [theme, isDarkMode]);

  return {
    theme,
    isDarkMode,
    setTheme,
    setIsDarkMode,
    themeOptions
  };
};