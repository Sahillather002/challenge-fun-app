import React from 'react';

export const PageShell: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-4 space-y-6 pb-24 sm:p-6 lg:p-8 ${className}`}>{children}</div>
);
