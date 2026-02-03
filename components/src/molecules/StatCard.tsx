import React from 'react';
import { StatCardProps } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from '../atoms/Card';

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  change, 
  isUp = true, 
  icon, 
  className = '' 
}) => {
  const { colors } = useTheme();

  return (
    <Card 
      glass={true} 
      elevated={true} 
      padding="md" 
      className={`group hover:scale-105 transition-transform duration-300 ${className}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-lg shadow-inner group-hover:scale-110 transition-transform`} 
             style={{ backgroundColor: colors.cardSecondary }}>
          {icon && <span style={{ color: colors.natureGreen }}>{icon}</span>}
        </div>
        {change && (
          <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest`}
               style={{ color: isUp ? colors.success : colors.error }}>
            <span>{isUp ? '↑' : '↓'}</span>
            <span>{change}</span>
          </div>
        )}
      </div>
      <div className={`text-[10px] font-bold uppercase tracking-widest mb-1`} 
           style={{ color: colors.textSecondary }}>
        {label}
      </div>
      <div className={`text-3xl font-black tracking-tighter`} 
           style={{ color: colors.textPrimary }}>
        {value}
      </div>
    </Card>
  );
};
