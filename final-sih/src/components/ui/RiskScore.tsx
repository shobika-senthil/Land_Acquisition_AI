import React from 'react';
import { motion } from 'framer-motion';
import { RiskLevel } from '../../types';
import { RiskBadge } from './RiskBadge';

interface RiskScoreProps {
  score: number;
  maxScore?: number;
  level?: RiskLevel;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showBadge?: boolean;
  showProbability?: boolean;
  className?: string;
  animate?: boolean;
}

export const RiskScore: React.FC<RiskScoreProps> = ({
  score,
  maxScore = 100,
  level,
  size = 'md',
  showBadge = true,
  showProbability = true,
  className = '',
  animate = true,
}) => {
  const calculatedLevel: RiskLevel = level || (
    score >= 80 ? 'CRITICAL' : score >= 65 ? 'HIGH' : score >= 40 ? 'MODERATE' : 'LOW'
  );

  const getScoreColor = () => {
    switch (calculatedLevel) {
      case 'CRITICAL': return 'text-risk-critical';
      case 'HIGH': return 'text-terracotta-600';
      case 'MODERATE': return 'text-sand-600';
      case 'LOW': return 'text-olive-600';
    }
  };

  const getProgressColor = () => {
    switch (calculatedLevel) {
      case 'CRITICAL': return '#9B2226';
      case 'HIGH': return '#BC6C25';
      case 'MODERATE': return '#C58B39';
      case 'LOW': return '#606C38';
    }
  };

  const strokeWidth = size === 'hero' ? 8 : size === 'lg' ? 6 : 4;
  const radius = size === 'hero' ? 56 : size === 'lg' ? 44 : size === 'md' ? 32 : 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / maxScore) * circumference;

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Circular Progress Gauge */}
      <div className="relative flex items-center justify-center">
        <svg
          className={`transform -rotate-90 ${
            size === 'hero' ? 'w-36 h-36' : size === 'lg' ? 'w-28 h-28' : size === 'md' ? 'w-20 h-20' : 'w-12 h-12'
          }`}
        >
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="#E8DEC8"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke={getProgressColor()}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: animate ? strokeDashoffset : strokeDashoffset }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className={`font-extrabold tracking-tight ${getScoreColor()} ${
              size === 'hero' ? 'text-4xl' : size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-xl' : 'text-sm'
            }`}
          >
            {score}
          </motion.span>
          <span className={`text-[10px] font-mono text-earth-500 uppercase ${size === 'hero' ? 'block' : 'hidden'}`}>
            / {maxScore}
          </span>
        </div>
      </div>

      {/* Text Details & Probability */}
      <div className="flex flex-col">
        {showBadge && <RiskBadge level={calculatedLevel} size={size === 'hero' ? 'lg' : 'md'} />}
        {showProbability && (
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xs text-earth-600 font-medium">Delay Probability:</span>
            <span className="text-sm font-bold text-earth-900">{score}%</span>
          </div>
        )}
      </div>
    </div>
  );
};
