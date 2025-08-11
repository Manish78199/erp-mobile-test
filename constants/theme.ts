// Theme constants based on your CSS variables
export const lightTheme = {
  // Main colors from CSS variables
  foreground: '#171717',
  background: '#f3f5f7',
  navText: 'rgba(41, 39, 45, 0.733)',
  cardBackground: '#ffffff',
  hoverBackground: '#cdcdcd4d',
  cardBorder: '#e4e4e4',
  text: '#050109',
  sidebarBackground: '#ffffff',
  fieldBackground: '#e4e4e4',
  comboboxBackground: '#eaeaea',
  
  // Enhanced design colors
  accent: '#3b82f6',
  accentHover: '#2563eb',
  success: '#10b981',
  networkDot: 'rgba(59, 130, 246, 0.6)',
  networkLine: 'rgba(59, 130, 246, 0.1)',
  glow: 'rgba(59, 130, 246, 0.3)',
  gradientFrom: 'rgba(59, 130, 246, 0.1)',
  gradientTo: 'rgba(147, 51, 234, 0.1)',
  
  // Semantic colors
  primary: '#3b82f6',
  primaryForeground: '#ffffff',
  secondary: '#f3f4f6',
  secondaryForeground: '#171717',
  muted: '#f3f4f6',
  mutedForeground: '#6b7280',
  destructive: '#ef4444',
  destructiveForeground: '#ffffff',
  border: '#e4e4e7',
  input: '#e4e4e7',
  ring: '#3b82f6',
  
  // Status colors
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
}

export const darkTheme = {
  // Main colors from CSS variables
  foreground: '#ededed',
  background: '#101010',
  navText: 'rgba(255, 255, 255, 0.6)',
  cardBackground: '#27272a4d',
  hoverBackground: '#3636384d',
  cardBorder: '#1e1e20',
  text: '#ffffff',
  sidebarBackground: '#181819',
  fieldBackground: '#27272a4d',
  comboboxBackground: '#27272a',
  
  // Enhanced design colors
  accent: '#00ff88',
  accentHover: '#00e67a',
  success: '#10b981',
  networkDot: 'rgba(0, 255, 136, 0.6)',
  networkLine: 'rgba(0, 255, 136, 0.1)',
  glow: 'rgba(0, 255, 136, 0.3)',
  gradientFrom: 'rgba(0, 255, 136, 0.1)',
  gradientTo: 'rgba(0, 255, 136, 0.05)',
  
  // Semantic colors
  primary: '#00ff88',
  primaryForeground: '#000000',
  secondary: '#27272a',
  secondaryForeground: '#ededed',
  muted: '#27272a',
  mutedForeground: '#a1a1aa',
  destructive: '#ef4444',
  destructiveForeground: '#ffffff',
  border: '#1e1e20',
  input: '#1e1e20',
  ring: '#00ff88',
  
  // Status colors
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#00ff88',
}

export type Theme = typeof lightTheme
