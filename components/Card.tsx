import React from 'react';
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  variant = 'default', 
  className = '',
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'outlined':
        return 'border border-gray-200 bg-white';
      case 'elevated':
        return 'bg-white shadow-lg elevation-3';
      default:
        return 'bg-white shadow-sm elevation-1';
    }
  };

  return (
    <View 
      className={`rounded-xl p-4 ${getVariantStyles()} ${className}`}
      {...props}
    >
      {children}
    </View>
  );
};
