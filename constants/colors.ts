export const Colors = {
  primary: '#4A90E2',
  light: {
    background: '#f8f9fa',
    card: '#ffffff',
    text: '#333333',
    textSecondary: '#666666',
    border: '#e0e0e0',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },
  dark: {
    background: '#121212',
    card: '#1e1e1e',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    border: '#333333',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },
};

export type Theme = typeof Colors.light;