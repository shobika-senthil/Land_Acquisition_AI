import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  isLight?: boolean;
  compact?: boolean;
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  isLight = false, 
  compact = false,
  showSubtitle = true 
}) => {
  return (
    <Link to="/" className={`group flex items-center gap-3 transition-transform duration-200 active:scale-95 ${className}`}>
      {/* Land parcel + geographic contour + data point icon */}
      <div className={`relative flex items-center justify-center rounded-xl p-2 transition-all duration-300 shadow-sandal-sm group-hover:shadow-sandal ${
        isLight ? 'bg-[#5A3424] text-[#F7F3EA] border border-[#73462E]' : 'bg-[#EFE5D3] text-[#2B1D14] border border-[#D8C4A8]'
      }`}>
        <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Contour paths */}
          <path d="M6 36 C 16 30, 32 40, 42 34" stroke={isLight ? "#D8C4A8" : "#8C5A3C"} strokeWidth="1.75" strokeLinecap="round" opacity="0.6"/>
          <path d="M8 24 C 18 16, 34 28, 44 20" stroke={isLight ? "#EFE5D3" : "#B98962"} strokeWidth="1.75" strokeLinecap="round" opacity="0.8"/>
          {/* Land Parcel Polygon */}
          <polygon points="14,14 34,10 38,30 18,34" fill={isLight ? "rgba(220, 126, 105, 0.25)" : "rgba(182, 90, 60, 0.15)"} stroke={isLight ? "#D28B75" : "#B65A3C"} strokeWidth="2.2" strokeLinejoin="round"/>
          {/* Predictive Data Point */}
          <circle cx="26" cy="22" r="3" fill={isLight ? "#D28B75" : "#B65A3C"}/>
          <circle cx="26" cy="22" r="6" stroke={isLight ? "#D28B75" : "#B65A3C"} strokeWidth="1.2" strokeDasharray="2 2" opacity="0.75"/>
        </svg>
      </div>

      {!compact && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span className={`font-semibold tracking-tight text-lg leading-tight font-display ${
              isLight ? 'text-[#F7F3EA]' : 'text-[#2B1D14]'
            }`}>
              LAND<span className={isLight ? 'text-[#D28B75] font-bold' : 'text-[#B65A3C] font-bold'}>LYTICS</span>
            </span>
          </div>
          {showSubtitle && (
            <span className={`text-[10px] tracking-tight font-medium truncate max-w-[210px] ${
              isLight ? 'text-[#D8C4A8]' : 'text-[#8C5A3C]'
            }`}>
              Land Acquisition Intelligence
            </span>
          )}
        </div>
      )}
    </Link>
  );
};
