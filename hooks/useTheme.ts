import { useThemeContext } from '@/context/Theme/provider';

export const useTheme = () => {
  return useThemeContext();
};