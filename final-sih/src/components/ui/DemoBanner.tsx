import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="relative z-30 bg-[#EFE5D3]/90 border-b border-[#D8C4A8]/60 px-4 py-1.5 backdrop-blur-sm text-[#5A3424] text-[11px] flex items-center justify-between transition-all">
      <div className="flex items-center gap-2 mx-auto">
        <span className="flex items-center gap-1 font-semibold text-[#8C5A3C] bg-[#FCFAF7] px-2 py-0.5 rounded-full text-[10px] border border-[#D8C4A8]">
          <Sparkles className="w-3 h-3 text-[#B65A3C]" />
          Decision Intelligence
        </span>
        <span className="text-[#5A3424] font-medium hidden sm:inline">
          Department of Land Resources (DoLR) • Ministry of Rural Development. Early detection of land acquisition bottlenecks.
        </span>
        <span className="text-[#8C5A3C] font-mono text-[10px]">
          [ILLUSTRATIVE GEOSPATIAL DATA]
        </span>
      </div>
      <button 
        onClick={() => setDismissed(true)} 
        className="text-[#8C5A3C] hover:text-[#2B1D14] p-0.5 rounded transition-colors"
        title="Dismiss notice"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
