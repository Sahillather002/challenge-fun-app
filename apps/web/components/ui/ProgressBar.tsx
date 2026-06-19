import React from 'react';

export const ProgressBar: React.FC<{ value: number; className?: string; trackClassName?: string }> = ({ value, className = '', trackClassName = '' }) => {
  const safeValue = Math.max(0, Math.min(100, value));
  return (
    <div className={`h-2.5 overflow-hidden rounded-full bg-muted ${trackClassName}`}>
      <div
        className={`h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all ${className}`}
        style={{ width: `${safeValue}%` }}
      />
    </div>
  );
};
