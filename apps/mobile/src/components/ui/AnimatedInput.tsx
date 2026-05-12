import React, { useState } from 'react';
import { View, TextInput, TextInputProps, StyleSheet, ViewStyle } from 'react-native';
import { MotiView, MotiText } from 'moti';
import { useTheme } from '@/theme/useTheme';

interface AnimatedInputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
}

export function AnimatedInput({
  label,
  error,
  leftIcon,
  rightIcon,
  style,
  ...props
}: AnimatedInputProps) {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  return (
    <View style={[styles.container, style]}>
      <MotiText
        animate={{
          translateY: isFocused || props.value ? -20 : 0,
          opacity: isFocused || props.value ? 0.7 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={[
          styles.label,
          {
            fontSize: isFocused || props.value ? 12 : 16,
            color: isFocused
              ? theme.primary
              : error
              ? theme.danger
              : theme.text,
          },
        ]}
      >
        {label}
      </MotiText>
      <MotiView
        animate={{
          borderColor: isFocused
            ? theme.primary
            : error
            ? theme.danger
            : theme.text,
          backgroundColor: isFocused ? theme.primary + '10' : 'transparent',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        style={[
          styles.inputContainer,
          {
            borderColor: theme.text,
          },
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            {
              color: theme.text,
            },
          ]}
          placeholderTextColor={theme.text + '80'}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />
        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </MotiView>
      {error && (
        <MotiText
          animate={{ opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={[
            styles.error,
            {
              color: theme.danger,
            },
          ]}
        >
          {error}
        </MotiText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    position: 'absolute',
    left: 16,
    top: 16,
    zIndex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
  },
});
