import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import { Typography } from './Typography';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  className = '',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-200';
      case 'outline':
        return 'border-2 border-primary-500 bg-transparent';
      case 'ghost':
        return 'bg-transparent';
      default:
        return 'bg-primary-500';
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'outline':
        return 'text-primary-500 font-semibold';
      case 'ghost':
        return 'text-primary-500 font-semibold';
      case 'secondary':
        return 'text-gray-700 font-semibold';
      default:
        return 'text-white font-semibold';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-2';
      case 'large':
        return 'px-8 py-4';
      default:
        return 'px-6 py-3';
    }
  };

  return (
    <TouchableOpacity
      className={`rounded-lg items-center justify-center ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      {...props}
    >
      <Typography className={`${getTextStyles()}`}>{title}</Typography>
    </TouchableOpacity>
  );
};
