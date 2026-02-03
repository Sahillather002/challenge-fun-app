import React from 'react';
import { InputProps } from '../types';
import { useTheme } from '../contexts/ThemeContext';

export const Input: React.FC<InputProps> = ({ 
  placeholder = '', 
  value = '', 
  onChange, 
  disabled = false, 
  error = '', 
  className = '', 
  type = 'text',
  prefix,
  suffix
}) => {
  const { colors } = useTheme();

  const baseStyles = 'w-full rounded-lg border px-4 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const stateStyles = error 
    ? `border-[${colors.error}] focus:ring-[${colors.error}]` 
    : `border-[${colors.border}] focus:ring-[${colors.natureGreen}]`;

  const containerStyles = `relative ${className}`;

  return (
    <div className={containerStyles}>
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            {prefix}
          </div>
        )}
        <input
          type={type}
          className={`${baseStyles} ${stateStyles} ${prefix ? 'pl-10' : ''} ${suffix ? 'pr-10' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          disabled={disabled}
          style={{ 
            backgroundColor: colors.card,
            color: colors.textPrimary,
            borderColor: error ? colors.error : colors.border
          }}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {suffix}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};
