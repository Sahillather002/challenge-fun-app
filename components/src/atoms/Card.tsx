import React from 'react';
import { CardProps } from '../types';
import { useTheme } from '../contexts/ThemeContext';

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  padding = 'md', 
  glass = false, 
  elevated = false, 
  bordered = true,
  onClick
}) => {
  const { colors } = useTheme();

  const baseStyles = 'rounded-xl transition-all duration-200';
  
  const paddingStyles = {
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
  };

  const styleVariants: string[] = [];
  
  if (glass) {
    styleVariants.push(
      `bg-opacity-10 backdrop-blur-md`,
      `bg-[${colors.card}]`,
      bordered ? `border border-[${colors.border}]` : '',
      elevated ? `shadow-lg` : ''
    );
  } else {
    styleVariants.push(
      `bg-[${colors.card}]`,
      bordered ? `border border-[${colors.border}]` : '',
      elevated ? `shadow-lg` : ''
    );
  }

  const styles = `${baseStyles} ${paddingStyles[padding]} ${styleVariants.join(' ')} ${className}`;

  return (
    <div className={styles} onClick={onClick}>
      {children}
    </div>
  );
};
