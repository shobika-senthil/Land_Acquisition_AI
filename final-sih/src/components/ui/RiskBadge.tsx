import React from 'react';
import { RiskLevel } from '../../types';
import { riskService } from '../../services/riskService';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  size = 'md',
  showDot = true,
  className = '',
}) => {
  const styles = riskService.getRiskBadgeStyles(level);

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 font-bold',
  }[size];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border shadow-sm ${styles.bg} ${sizeClasses} ${className}`}>
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${styles.dot} ${level === 'CRITICAL' ? 'animate-ping' : ''}`} />
      )}
      <span className="tracking-wide uppercase">{level} RISK</span>
    </span>
  );
};
