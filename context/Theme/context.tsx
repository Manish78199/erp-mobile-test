import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'
import { darkTheme, lightTheme, Theme } from '../../constants/theme'

interface ThemeContextType {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
  setTheme: (isDark: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme()
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark')

  useEffect(() => {
    loadThemePreference()
  }, [])

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme')
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark')
      }
    } catch (error) {
      console.error('Error loading theme preference:', error)
    }
  }

  const saveThemePreference = async (darkMode: boolean) => {
    try {
      await AsyncStorage.setItem('theme', darkMode ? 'dark' : 'light')
    } catch (error) {
      console.error('Error saving theme preference:', error)
    }
  }

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    saveThemePreference(newTheme)
  }

  const setTheme = (darkMode: boolean) => {
    setIsDark(darkMode)
    saveThemePreference(darkMode)
  }

  const theme = isDark ? darkTheme : lightTheme

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
