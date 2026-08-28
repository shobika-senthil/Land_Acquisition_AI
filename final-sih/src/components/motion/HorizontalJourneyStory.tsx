import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Compass, 
  FileText, 
  MapPin, 
  Scale, 
  Coins, 
  ShieldCheck, 
  Building, 
  CheckCircle2,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export const HorizontalJourneyStory: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const steps = [
    {
      phase: 'Phase 01',
      title: 'Alignment & Discovery',
      act: 'Section 3A Gazette',
      icon: Compass,
      desc: 'Corridor coordinate boundaries mapped against digital cadastral registry.',
      riskPoint: 'Cadastral overlay inaccuracies',
    },
    {
      phase: 'Phase 02',
      title: 'Topographic & Cadastral Survey',
      act: 'Section 3B/3C Hearings',
      icon: MapPin,
      desc: 'Ground truthing, geo-tagged plot demarcation, and public hearing records.',
      riskPoint: 'Boundary mismatch with revenue maps',
    },
    {
      phase: 'Phase 03',
      title: 'Ownership Lineage & Mutation',
      act: 'Title Verification',
      icon: FileText,
      desc: 'Identification of recorded heirs, non-resident title holders, and sub-divisions.',
      riskPoint: 'Unregistered partition deeds & missing heirs',
    },
    {
      phase: 'Phase 04',
      title: 'Statutory Declaration',
      act: 'Section 3D Notification',
      icon: Scale,
      desc: 'Vesting of land with the Central Government subject to statutory challenge window.',
      riskPoint: 'Civil injunctions & interim stays',
    },
    {
      phase: 'Phase 05',
      title: 'Valuation & Compensation Determination',
      act: 'Section 3G Award',
      icon: Coins,
      desc: 'Calculation of basic rate, multiplier factor, and 100% statutory solatium.',
      riskPoint: 'Circle rate vs market transaction variance',
    },
    {
      phase: 'Phase 06',
      title: 'Disbursement & Escrow Protocol',
      act: 'Section 3H Directives',
      icon: Building,
      desc: 'Direct DBT to authenticated accounts; disputed funds placed in court escrow.',
      riskPoint: 'Delayed title heir succession documents',
    },
    {
      phase: 'Phase 07',
      title: 'Rehabilitation & Resettlement',
      act: 'RFCTLARR 2nd Schedule',
      icon: ShieldCheck,
      desc: 'Allotment of dwelling units, subsistence grants, and infrastructure handover.',
      riskPoint: 'Alternative site acquisition hurdles',
    },
    {
      phase: 'Phase 08',
      title: 'Physical Possession & Handover',
      act: 'Section 3E Execution',
      icon: CheckCircle2,
      desc: 'Clear unencumbered right-of-way delivered to executing engineering agency.',
      riskPoint: 'Encroachments during transition window',
    },
  ];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full">
      {/* Header controls */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#B65A3C] font-semibold block">
            Statutory RFCTLARR & NHAI Framework
          </span>
          <h3 className="text-xl sm:text-2xl font-display font-semibold text-[#2B1D14]">
            8-Phase Land Acquisition Journey
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={scrollLeft}
            className="p-2 rounded-xl bg-[#FFFCF7] border border-[#D8C4A8] text-[#5A3424] hover:bg-[#EFE5D3] transition-colors cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={scrollRight}
            className="p-2 rounded-xl bg-[#FFFCF7] border border-[#D8C4A8] text-[#5A3424] hover:bg-[#EFE5D3] transition-colors cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Cards Scroll Track */}
      <div
        ref={scrollContainerRef}
        className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth"
      >
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.phase}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="flex-shrink-0 w-[280px] sm:w-[320px] bg-[#FFFCF7] rounded-3xl p-6 border border-[#8C5A3C]/16 shadow-sandal-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#D8C4A8]/60 mb-3">
                  <span className="text-xs font-mono font-bold text-[#B65A3C]">
                    {step.phase}
                  </span>
                  <div className="w-7 h-7 rounded-xl bg-[#F7F3EA] border border-[#D8C4A8] flex items-center justify-center text-[#5A3424]">
                    <Icon className="w-3.5 h-3.5 text-[#B65A3C]" />
                  </div>
                </div>

                <h4 className="text-base font-display font-semibold text-[#2B1D14] leading-snug">
                  {step.title}
                </h4>
                <span className="text-[11px] font-mono text-[#8C5A3C] font-semibold block mt-0.5 mb-2">
                  {step.act}
                </span>

                <p className="text-xs text-[#5A3424] leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#D8C4A8]/60 bg-[#F7F3EA] p-2.5 rounded-xl border border-[#D8C4A8]/40">
                <span className="text-[9px] font-mono uppercase font-bold text-[#A9473B] block">
                  Top Delay Bottleneck:
                </span>
                <span className="text-[11px] font-semibold text-[#2B1D14] line-clamp-1">
                  {step.riskPoint}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
