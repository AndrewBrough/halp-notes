'use client';

import { useState, useEffect } from 'react';

interface ThemeColors {
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
}

interface Theme {
  name: string;
  colors: ThemeColors;
}

const THEMES: Record<string, Theme> = {
  gold: {
    name: 'Sunset Gold',
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
  purple: {
    name: 'Royal Purple',
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
  ocean: {
    name: 'Ocean',
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
  forest: {
    name: 'Forest',
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
} as const;

type ThemeKey = keyof typeof THEMES;

export interface ThemeOption {
  value: string;
  name: string;
  colors: ThemeColors;
}

const isValidThemeKey = (key: string | null): key is ThemeKey => {
  return key !== null && Object.keys(THEMES).includes(key);
};

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>();
  const [isDarkMode, setIsDarkMode] = useState<boolean | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('themeKey') || 'gold';
    if (isValidThemeKey(savedTheme)) {
      setCurrentTheme(savedTheme);
    }
    
    const savedDarkMode = localStorage.getItem('isDarkMode');
    if (savedDarkMode !== null) {
      setIsDarkMode(savedDarkMode === 'true');
    }
  }, []);

  useEffect(() => {
    currentTheme && localStorage.setItem('themeKey', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    isDarkMode !== null && localStorage.setItem('isDarkMode', String(isDarkMode));
  }, [isDarkMode]);

  const themeOptions = Object.entries(THEMES).map(([key, theme]) => ({
    value: key,
    name: theme.name,
    colors: theme.colors
  }));

  return {
    theme: {
      ...THEMES[currentTheme || 'gold'],
      value: currentTheme || 'gold'
    },
    isDarkMode: isDarkMode ?? false,
    setTheme: (option: ThemeOption) => setCurrentTheme(option.value as ThemeKey),
    setIsDarkMode,
    themeOptions
  };
};