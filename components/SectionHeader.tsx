import React from 'react';
import { View, Text } from 'react-native';
import { Typography } from './Typography';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  rightComponent?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  rightComponent,
  className = '',
}) => {
  return (
    <View className={`flex-row items-center justify-between mb-4 ${className}`}>
      <View className="flex-1">
        <Typography className="text-xl font-bold text-gray-900">{title}</Typography>
        {subtitle && (
          <Typography className="text-gray-600 text-sm mt-1">{subtitle}</Typography>
        )}
      </View>
      {rightComponent && (
        <View>{rightComponent}</View>
      )}
    </View>
  );
};
