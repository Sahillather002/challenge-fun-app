import React from 'react';

export const MetricCard: React.FC<{
  icon?: React.ReactNode;
  value: React.ReactNode;
  label: string;
  sublabel?: string;
  className?: string;
}> = ({ icon, value, label, sublabel, className = '' }) => (
  <div className={`card-mobile ${className}`}>
    <div className="flex items-center justify-between gap-3">
      {icon && <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</div>}
      {sublabel && <span className="text-xs font-semibold text-muted-foreground">{sublabel}</span>}
    </div>
    <div className="mt-4 text-3xl font-bold tracking-tight text-foreground tabular">{value}</div>
    <div className="mt-1 text-sm font-medium text-muted-foreground">{label}</div>
  </div>
);
