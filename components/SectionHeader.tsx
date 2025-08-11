import React from 'react';
import { View, Text } from 'react-native';

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
        <Text className="text-xl font-bold text-gray-900">{title}</Text>
        {subtitle && (
          <Text className="text-gray-600 text-sm mt-1">{subtitle}</Text>
        )}
      </View>
      {rightComponent && (
        <View>{rightComponent}</View>
      )}
    </View>
  );
};
