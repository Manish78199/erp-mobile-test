import { Colors } from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

interface ThemeContextType {
  theme: typeof Colors.light;
  isDark: boolean;
  themeMode: 'light' | 'dark' | 'system';
  toggleTheme: () => void;
  setSystemTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('system');

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    if (themeMode === 'system') {
      setIsDark(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, themeMode]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('themeMode');
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeMode(savedTheme as 'light' | 'dark' | 'system');
        if (savedTheme !== 'system') {
          setIsDark(savedTheme === 'dark');
        }
      }
    } catch (error) {
      console.log('Error loading theme preference:', error);
    }
  };

  const saveThemePreference = async (mode: 'light' | 'dark' | 'system') => {
    try {
      await AsyncStorage.setItem('themeMode', mode);
    } catch (error) {
      console.log('Error saving theme preference:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setThemeMode(newMode);
    setIsDark(!isDark);
    saveThemePreference(newMode);
  };

  const setSystemTheme = () => {
    setThemeMode('system');
    setIsDark(systemColorScheme === 'dark');
    saveThemePreference('system');
  };

  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark,
        themeMode,
        toggleTheme,
        setSystemTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};