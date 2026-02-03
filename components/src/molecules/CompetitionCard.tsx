import React from 'react';
import { CompetitionCardProps } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from '../atoms/Card';
import { Button } from '../atoms/Button';

export const CompetitionCard: React.FC<CompetitionCardProps> = ({ 
  id, 
  title, 
  participants, 
  prize, 
  progress, 
  endDate, 
  isActive = true, 
  onClick 
}) => {
  const { colors } = useTheme();

  return (
    <Card 
      glass={true} 
      elevated={true} 
      padding="lg" 
      className="group hover:scale-105 transition-transform duration-300 cursor-pointer"
      onClick={() => onClick?.(id)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold mb-2" style={{ color: colors.textPrimary }}>
            {title}
          </h3>
          <div className="flex items-center gap-4 text-sm" style={{ color: colors.textSecondary }}>
            <span>{participants} participants</span>
            <span>•</span>
            <span>Ends {endDate}</span>
          </div>
        </div>
        {isActive ? (
          <div className="px-3 py-1 rounded-full text-xs font-bold uppercase"
               style={{ 
                 backgroundColor: colors.success, 
                 color: colors.background 
               }}>
            Live
          </div>
        ) : (
          <div className="px-3 py-1 rounded-full text-xs font-bold uppercase"
               style={{ 
                 backgroundColor: colors.textSecondary, 
                 color: colors.background 
               }}>
            Ended
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2 text-sm">
          <span style={{ color: colors.textSecondary }}>Progress</span>
          <span className="font-bold" style={{ color: colors.textPrimary }}>
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full" style={{ backgroundColor: colors.cardSecondary }}>
          <div 
            className="h-full rounded-full transition-all duration-300 group-hover:shadow-lg"
            style={{ 
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${colors.natureGreen}, ${colors.skyBlue})`
            }}
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-2xl font-black" style={{ color: colors.natureGreen }}>
          {prize}
        </div>
        <Button 
          variant="primary" 
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(id);
          }}
        >
          View Details
        </Button>
      </div>
    </Card>
  );
};
