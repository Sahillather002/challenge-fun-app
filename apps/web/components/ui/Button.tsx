import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const sizeClasses = {
  sm: 'min-h-[36px] px-3 py-2 text-xs rounded-lg',
  md: 'min-h-[40px] px-4 py-2.5 text-sm rounded-xl',
  lg: 'min-h-[46px] px-5 py-3 text-base rounded-2xl',
};

export const Button: React.FC<ButtonProps> = ({ variant = 'secondary', size = 'md', className = '', children, ...props }) => {
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground shadow-glow hover:brightness-105',
    secondary: 'border border-border bg-card text-foreground hover:bg-muted',
    ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
    danger: 'bg-danger text-danger-foreground hover:brightness-105',
  };

  return (
    <button
      type="button"
      className={`btn-mobile ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
