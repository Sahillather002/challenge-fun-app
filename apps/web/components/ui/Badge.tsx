import React from 'react';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'live' | 'locked' | 'neutral';

export const Badge: React.FC<{ children: React.ReactNode; variant?: BadgeVariant; className?: string }> = ({ children, variant = 'primary', className = '' }) => {
  const variants: Record<BadgeVariant, string> = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    live: 'badge-live',
    locked: 'badge-locked',
    neutral: 'inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground',
  };

  return <span className={`${variants[variant]} ${className}`}>{children}</span>;
};
