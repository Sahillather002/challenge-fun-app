import React from 'react';
import { View, Text } from 'react-native';
import { MotiView } from 'moti';
import { useTheme } from '@/theme/useTheme';

interface LoadingAnimationProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export const LoadingAnimation: React.FC<LoadingAnimationProps> = ({
  message = 'Loading...',
  size = 'medium',
}) => {
  const theme = useTheme();

  const dimensions = {
    small: {
      circleSize: 16,
      containerSize: 80,
      messageSize: 12,
    },
    medium: {
      circleSize: 24,
      containerSize: 120,
      messageSize: 14,
    },
    large: {
      circleSize: 32,
      containerSize: 160,
      messageSize: 16,
    },
  };

  const { circleSize, containerSize, messageSize } = dimensions[size];

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        height: containerSize,
        width: containerSize,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        {[0, 1, 2].map((index) => (
          <MotiView
            key={index}
            style={{
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize / 2,
              marginHorizontal: circleSize / 4,
              backgroundColor: theme.primary,
            }}
            from={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'timing',
              duration: 600,
              delay: index * 200,
              repeat: Infinity,
              reverse: true,
            }}
          />
        ))}
      </View>
      {message && (
        <Text
          style={{
            fontSize: messageSize,
            color: theme.muted,
            textAlign: 'center',
          }}
        >
          {message}
        </Text>
      )}
    </View>
  );
};

// Helper function to show loading state in UI
export const useLoading = (isLoading: boolean, message?: string) => {
  if (!isLoading) return null;
  
  return <LoadingAnimation message={message} />;
};
