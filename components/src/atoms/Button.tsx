import React from 'react';
import { ButtonProps } from '../types';
import { useTheme } from '../contexts/ThemeContext';

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  onClick, 
  className = '', 
  fullWidth = false 
}) => {
  const { colors } = useTheme();

  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: `bg-gradient-to-r from-[${colors.natureGreen}] to-[${colors.skyBlue}] text-[${colors.background}] hover:from-[${colors.skyBlue}] hover:to-[${colors.natureGreen}] focus:ring-[${colors.natureGreen}]`,
    secondary: `bg-[${colors.cardSecondary}] text-[${colors.textPrimary}] border border-[${colors.border}] hover:bg-[${colors.card}] focus:ring-[${colors.natureGreen}]`,
    outline: `bg-transparent text-[${colors.textPrimary}] border border-[${colors.border}] hover:bg-[${colors.cardSecondary}] focus:ring-[${colors.natureGreen}]`,
    ghost: `bg-transparent text-[${colors.textSecondary}] hover:bg-[${colors.cardSecondary}] focus:ring-[${colors.natureGreen}]`,
    destructive: `bg-gradient-to-r from-[${colors.error}] to-[${colors.sunsetPink}] text-white hover:from-[${colors.sunsetPink}] hover:to-[${colors.error}] focus:ring-[${colors.error}]`,
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  const styles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`;

  return (
    <button 
      className={styles}
      onClick={(e) => onClick?.(e)}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
