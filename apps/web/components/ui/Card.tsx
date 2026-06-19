import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string; as?: keyof JSX.IntrinsicElements }> = ({ children, className = '', as = 'div' }) => {
  const Component = as;
  return <Component className={`card-mobile ${className}`}>{children}</Component>;
};
