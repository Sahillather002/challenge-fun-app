import React from 'react';

export const SectionHeader: React.FC<{
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}> = ({ eyebrow, title, description, action, className = '' }) => (
  <div className={`flex flex-col gap-4 md:flex-row md:items-end md:justify-between ${className}`}>
    <div>
      {eyebrow && <p className="text-primary text-xs font-bold uppercase tracking-[0.28em]">{eyebrow}</p>}
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">{title}</h1>
      {description && <p className="mt-2 max-w-2xl text-sm font-medium text-muted-foreground">{description}</p>}
    </div>
    {action}
  </div>
);
