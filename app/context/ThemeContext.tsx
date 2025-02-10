'use client';

import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';
import { alpha } from '@mui/material/styles';
import type { ThemeOption } from '../types';

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

interface ThemeContextType {
  theme: Theme & { value: string };
  isDarkMode: boolean;
  setTheme: (option: ThemeOption) => void;
  setIsDarkMode: (isDark: boolean) => void;
  resetTheme: () => void;
  themeOptions: ThemeOption[];
  muiTheme: ReturnType<typeof createTheme>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);


export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>(() => {
    if (typeof window === 'undefined') return 'gold';
    return (localStorage.getItem('themeKey') || 'gold') as ThemeKey;
  });
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const savedDarkMode = localStorage.getItem('isDarkMode');
    return savedDarkMode === 'true';
  });

  useEffect(() => {
    currentTheme && localStorage.setItem('themeKey', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem('isDarkMode', String(isDarkMode));
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

  const muiTheme = useMemo(() => createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: isDarkMode
          ? THEMES[currentTheme || 'gold'].colors.dark.primary
          : THEMES[currentTheme || 'gold'].colors.light.primary,
      },
      secondary: {
        main: isDarkMode
          ? THEMES[currentTheme || 'gold'].colors.dark.secondary
          : THEMES[currentTheme || 'gold'].colors.light.secondary,
      },
      background: {
        default: isDarkMode
          ? THEMES[currentTheme || 'gold'].colors.dark.background
          : THEMES[currentTheme || 'gold'].colors.light.background,
        paper: isDarkMode
          ? THEMES[currentTheme || 'gold'].colors.dark.background
          : THEMES[currentTheme || 'gold'].colors.light.background,
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode
              ? alpha(THEMES[currentTheme || 'gold'].colors.dark.primary, 0.05)
              : alpha(THEMES[currentTheme || 'gold'].colors.light.primary, 0.05),
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiInputBase-root': {
              backgroundColor: isDarkMode
                ? alpha(THEMES[currentTheme || 'gold'].colors.dark.primary, 0.05)
                : alpha(THEMES[currentTheme || 'gold'].colors.light.primary, 0.05),
            },
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          paper: {
            backgroundColor: isDarkMode
              ? THEMES[currentTheme || 'gold'].colors.dark.background
              : THEMES[currentTheme || 'gold'].colors.light.background,
          },
          inputRoot: {
            backgroundColor: isDarkMode
              ? alpha(THEMES[currentTheme || 'gold'].colors.dark.primary, 0.05)
              : alpha(THEMES[currentTheme || 'gold'].colors.light.primary, 0.05),
          },
        },
      },
    },
  }), [isDarkMode, currentTheme]);

  const value = {
    theme: {
      ...THEMES[currentTheme || 'gold'],
      value: currentTheme || 'gold'
    },
    isDarkMode,
    setTheme: (option: ThemeOption) => setCurrentTheme(option.value as ThemeKey),
    setIsDarkMode,
    resetTheme,
    themeOptions,
    muiTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 