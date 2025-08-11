import React from 'react';
import { TouchableOpacity, View, Text, TouchableOpacityProps } from 'react-native';

interface ListItemProps extends TouchableOpacityProps {
  title: string;
  subtitle?: string;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  leftComponent,
  rightComponent,
  className = '',
  ...props
}) => {
  return (
    <TouchableOpacity
      className={`flex-row items-center py-3 px-4 bg-white ${className}`}
      {...props}
    >
      {leftComponent && (
        <View className="mr-3">
          {leftComponent}
        </View>
      )}
      
      <View className="flex-1">
        <Text className="text-gray-900 font-medium text-base">{title}</Text>
        {subtitle && (
          <Text className="text-gray-500 text-sm mt-1">{subtitle}</Text>
        )}
      </View>
      
      {rightComponent && (
        <View className="ml-3">
          {rightComponent}
        </View>
      )}
    </TouchableOpacity>
  );
};
