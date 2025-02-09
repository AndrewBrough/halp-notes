'use client';

import { useState, useEffect } from 'react';
import { getSunrise, getSunset } from 'sunrise-sunset-js';

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

type DarkModeSettings = boolean | 'auto';

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>();
  const [isDarkMode, setIsDarkMode] = useState<DarkModeSettings | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Helper to check if it's dark based on sunrise/sunset
  const getSystemDarkMode = () => {
    if (!location) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    const now = new Date();
    const sunrise = getSunrise(location.lat, location.lng);
    const sunset = getSunset(location.lat, location.lng);

    return now < sunrise || now > sunset;
  };

  // Get user's location
  useEffect(() => {
    if (isDarkMode === 'auto' && !location) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Could not get location, falling back to system preference:', error);
        }
      );
    }
  }, [isDarkMode, location]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('themeKey') || 'gold';
    if (isValidThemeKey(savedTheme)) {
      setCurrentTheme(savedTheme);
    }
    
    const savedDarkMode = localStorage.getItem('isDarkMode');
    if (savedDarkMode !== null) {
      setIsDarkMode(savedDarkMode === 'auto' ? 'auto' : savedDarkMode === 'true');
    }
  }, []);

  useEffect(() => {
    currentTheme && localStorage.setItem('themeKey', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    isDarkMode !== null && localStorage.setItem('isDarkMode', String(isDarkMode));
  }, [isDarkMode]);

  // Add system dark mode listener and update timer
  useEffect(() => {
    if (isDarkMode === 'auto') {
      // Update dark mode every minute to check sunrise/sunset
      const interval = setInterval(() => {
        // Force re-render to update dark mode state
        setIsDarkMode('auto');
      }, 60000); // Check every minute

      // Also listen for system preference changes as fallback
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => {
        setIsDarkMode('auto');
      };
      
      mediaQuery.addEventListener('change', handler);
      return () => {
        clearInterval(interval);
        mediaQuery.removeEventListener('change', handler);
      };
    }
  }, [isDarkMode]);

  const resetTheme = () => {
    setCurrentTheme('gold');
    setIsDarkMode(false);
  };

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
    isDarkMode: isDarkMode === 'auto' ? getSystemDarkMode() : isDarkMode === true,
    isDarkModeAuto: isDarkMode === 'auto',
    setTheme: (option: ThemeOption) => setCurrentTheme(option.value as ThemeKey),
    setIsDarkMode: (value: DarkModeSettings) => setIsDarkMode(value),
    resetTheme,
    themeOptions
  };
};