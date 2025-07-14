
"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { COLOR_THEMES, DEFAULT_COLOR_THEME_ID, type ColorTheme } from '@/config/constants';

type ThemeMode = 'light' | 'dark';

interface StoredThemeSettings {
  mode: ThemeMode;
  colorThemeId: string;
}

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  colorThemeId: string;
  setColorThemeId: (themeId: string) => void;
  availableColorThemes: ColorTheme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_SETTINGS_KEY = 'photoshere_theme_settings';

export const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [colorThemeId, setColorThemeIdState] = useState<string>(DEFAULT_COLOR_THEME_ID);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let initialMode: ThemeMode = 'light';
    let initialColorThemeId: string = DEFAULT_COLOR_THEME_ID;

    try {
      const storedSettingsJSON = localStorage.getItem(THEME_SETTINGS_KEY);
      if (storedSettingsJSON) {
        const storedSettings: StoredThemeSettings = JSON.parse(storedSettingsJSON);
        initialMode = storedSettings.mode;
        initialColorThemeId = storedSettings.colorThemeId;
      } else {
        // Fallback to system preference for mode if no settings are stored
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        initialMode = systemPrefersDark ? 'dark' : 'light';
      }
    } catch (error) {
      console.error("Failed to load theme settings from localStorage", error);
      // Default to light mode and default color theme on error
    }
    
    setModeState(initialMode);
    setColorThemeIdState(initialColorThemeId);
    applyThemeClasses(initialColorThemeId, initialMode);

  }, []);

  const applyThemeClasses = (newColorThemeId: string, newMode: ThemeMode) => {
    // Clear previous theme classes (ones that start with "theme-")
    const themeClasses = Array.from(document.documentElement.classList).filter(cls => cls.startsWith('theme-'));
    document.documentElement.classList.remove(...themeClasses);

    // Add new theme class
    document.documentElement.classList.add(`theme-${newColorThemeId}`);
    // Add/remove dark class
    document.documentElement.classList.toggle('dark', newMode === 'dark');
  };

  const saveThemeSettings = (newColorThemeId: string, newMode: ThemeMode) => {
    try {
      const settings: StoredThemeSettings = { mode: newMode, colorThemeId: newColorThemeId };
      localStorage.setItem(THEME_SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Failed to save theme settings to localStorage", error);
    }
  };

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    applyThemeClasses(colorThemeId, newMode);
    saveThemeSettings(colorThemeId, newMode);
  };

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
  };

  const setColorThemeId = (newColorThemeId: string) => {
    setColorThemeIdState(newColorThemeId);
    applyThemeClasses(newColorThemeId, mode);
    saveThemeSettings(newColorThemeId, mode);
  };

  if (!mounted) {
    // Avoid hydration mismatch
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggleMode, colorThemeId, setColorThemeId, availableColorThemes: COLOR_THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
