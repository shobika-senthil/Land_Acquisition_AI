import React from 'react';
import { motion } from 'framer-motion';

interface IntelligenceTickerProps {
  className?: string;
}

export const IntelligenceTicker: React.FC<IntelligenceTickerProps> = ({ className = '' }) => {
  const items = [
    'LAND ACQUISITION INTELLIGENCE',
    'EARLY RISK DETECTION',
    'GEOGRAPHIC ANALYTICS',
    'OWNERSHIP FRICTION SIGNALS',
    'STATUTORY 3H(4) DIRECTIVES',
    'CADASTRAL SURVEY VERIFICATION',
    'DELAY FORECASTING ENGINE',
    'NATIONAL INFRASTRUCTURE REGISTRY',
  ];

  return (
    <div className={`w-full overflow-hidden bg-[#EFE5D3]/60 border-y border-[#D8C4A8]/60 py-2.5 ${className}`}>
      <div className="flex whitespace-nowrap">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 32, ease: 'linear', repeat: Infinity }}
          className="flex items-center gap-6 text-[11px] font-mono font-semibold uppercase tracking-wider text-[#5A3424]"
        >
          {items.concat(items).map((item, idx) => (
            <div key={idx} className="flex items-center gap-6">
              <span>{item}</span>
              <span className="text-[#B65A3C]">•</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
