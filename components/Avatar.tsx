import React from 'react';
import { View, Text, Image } from 'react-native';

interface AvatarProps {
  source?: { uri: string };
  name?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'medium',
  className = '',
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return 'w-8 h-8';
      case 'large':
        return 'w-16 h-16';
      default:
        return 'w-12 h-12';
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View className={`rounded-full bg-primary-100 items-center justify-center ${getSizeStyles()} ${className}`}>
      {source ? (
        <Image source={source} className={`rounded-full ${getSizeStyles()}`} />
      ) : (
        <Text className="text-primary-600 font-semibold">
          {getInitials(name)}
        </Text>
      )}
    </View>
  );
};
