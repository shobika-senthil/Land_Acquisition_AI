import React from 'react';

interface MarqueeTickerProps {
  items?: string[];
  className?: string;
}

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({
  items = [
    'LAND INTELLIGENCE',
    'CADASTRAL SURVEYS',
    'SETTLEMENT DENSITY',
    'RIGHT OF WAY',
    'TENURE CONFLICTS',
    'LEGAL INJUNCTIONS',
    'CIRCLE RATE PARITY',
    'SECTION 3H(4) ESCROW',
    'DELAY FORECAST'
  ],
  className = '',
}) => {
  return (
    <div className={`w-full overflow-hidden bg-[#EFE5D3]/60 border-y border-[#D8C4A8]/60 py-2.5 ${className}`}>
      <div className="flex w-max animate-[marquee_35s_linear_infinite] whitespace-nowrap text-[11px] font-mono font-medium tracking-widest text-[#8C5A3C]">
        {[...items, ...items, ...items].map((item, idx) => (
          <span key={idx} className="flex items-center gap-4 mx-4">
            <span>{item}</span>
            <span className="w-1 h-1 rounded-full bg-[#B65A3C]" />
          </span>
        ))}
      </div>
    </div>
  );
};
