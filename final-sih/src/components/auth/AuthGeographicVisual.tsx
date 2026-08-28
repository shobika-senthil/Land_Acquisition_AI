import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from '../ui/Logo';
import { Activity, Compass, MapPin, ShieldCheck, Zap } from 'lucide-react';

export const AuthGeographicVisual: React.FC = () => {
  return (
    <div className="relative w-full h-full min-h-[480px] lg:min-h-[640px] bg-[#EFE5D3]/70 rounded-3xl p-8 sm:p-12 flex flex-col justify-between overflow-hidden border border-[#D8C4A8]/80 shadow-sandal-sm">
      
      {/* 1. Background Cartographic Contours & Survey Lines (Light, Airy, Spatial) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-45">
        <svg className="w-full h-full" viewBox="0 0 600 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Topographic Contour Lines */}
          <motion.path
            d="M-50 120 C 150 80, 350 200, 650 140"
            stroke="#8C5A3C"
            strokeWidth="1.5"
            strokeDasharray="600"
            initial={{ strokeDashoffset: 600 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 3.5, ease: 'easeInOut' }}
          />
          <motion.path
            d="M-50 260 C 120 220, 300 360, 650 290"
            stroke="#B98962"
            strokeWidth="1.2"
            strokeDasharray="600"
            initial={{ strokeDashoffset: 600 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 4, delay: 0.3, ease: 'easeInOut' }}
          />
          <motion.path
            d="M-50 420 C 180 380, 380 520, 650 450"
            stroke="#8C5A3C"
            strokeWidth="1.5"
            strokeDasharray="600"
            initial={{ strokeDashoffset: 600 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 4.5, delay: 0.6, ease: 'easeInOut' }}
          />
          <motion.path
            d="M-50 580 C 140 540, 320 680, 650 610"
            stroke="#B98962"
            strokeWidth="1.2"
            strokeDasharray="600"
            initial={{ strokeDashoffset: 600 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 5, delay: 0.9, ease: 'easeInOut' }}
          />

          {/* Survey Parcel Polygons */}
          <motion.polygon
            points="180,240 380,200 440,360 220,400"
            fill="rgba(182, 90, 60, 0.08)"
            stroke="#B65A3C"
            strokeWidth="1.75"
            strokeDasharray="10 5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
          />
          <motion.polygon
            points="240,420 480,380 520,540 280,580"
            fill="rgba(112, 120, 77, 0.08)"
            stroke="#70784D"
            strokeWidth="1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1.3 }}
          />

          {/* Alignment Route Line */}
          <motion.path
            d="M100 700 L 260 480 L 420 280 L 520 100"
            stroke="#5A3424"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="800"
            initial={{ strokeDashoffset: 800 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 3, delay: 0.5, ease: 'easeOut' }}
          />
        </svg>

        {/* Dynamic Expanding Risk Radius */}
        <div className="absolute top-[42%] left-[45%] -translate-x-1/2 -translate-y-1/2">
          <motion.div
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-48 h-48 rounded-full border border-[#B65A3C] bg-[#B65A3C]/5"
          />
          <motion.div
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: [0.5, 2.2, 0.5], opacity: [0.4, 0.1, 0.4] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            className="absolute inset-0 w-48 h-48 rounded-full border border-[#A94A3F]"
          />
        </div>
      </div>

      {/* 2. Top Header Brand Wordmark */}
      <div className="relative z-10">
        <Logo isLight={false} />
      </div>

      {/* 3. Center Geographic Telemetry Pill */}
      <div className="relative z-10 my-8 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FCFAF7]/95 border border-[#D8C4A8] shadow-sandal-sm text-xs font-mono text-[#5A3424]"
        >
          <span className="w-2 h-2 rounded-full bg-[#A94A3F] animate-ping" />
          <span className="font-semibold text-[#A94A3F]">Risk detected</span>
          <span>•</span>
          <span>82/100 Critical</span>
          <span>•</span>
          <span className="text-[#8C5A3C]">Madurai (9.9252° N, 78.1198° E)</span>
        </motion.div>

        {/* Main Story Narrative */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="max-w-md space-y-3"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[#2B1D14] tracking-tight leading-[1.12]">
            See risk before it becomes delay.
          </h2>
          <p className="text-sm sm:text-base text-[#5A3424] leading-relaxed font-normal">
            LANDLYTICS brings location, land and acquisition intelligence together to help teams identify risk earlier and act with confidence.
          </p>
        </motion.div>
      </div>

      {/* 4. Bottom Context Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="relative z-10 pt-4 border-t border-[#D8C4A8]/60 flex items-center justify-between text-xs text-[#8C5A3C] font-mono"
      >
        <span>Geographic Intelligence Platform</span>
        <span>Decision Support System</span>
      </motion.div>

    </div>
  );
};
