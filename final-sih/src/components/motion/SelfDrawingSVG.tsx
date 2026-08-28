import React from 'react';
import { motion } from 'framer-motion';

interface SelfDrawingSVGProps {
  className?: string;
}

export const SelfDrawingSVG: React.FC<SelfDrawingSVGProps> = ({ className = '' }) => {
  return (
    <div className={`relative overflow-hidden pointer-events-none ${className}`}>
      <svg
        className="w-full h-full"
        viewBox="0 0 800 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Contour Path 1 */}
        <motion.path
          d="M-40 100 C 200 40, 450 220, 840 120"
          stroke="#8C5A3C"
          strokeWidth="1.5"
          strokeDasharray="900"
          initial={{ strokeDashoffset: 900 }}
          whileInView={{ strokeDashoffset: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 3.2, ease: 'easeInOut' }}
          opacity="0.5"
        />

        {/* Contour Path 2 */}
        <motion.path
          d="M-40 240 C 180 180, 420 380, 840 280"
          stroke="#B98962"
          strokeWidth="1.25"
          strokeDasharray="900"
          initial={{ strokeDashoffset: 900 }}
          whileInView={{ strokeDashoffset: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 3.8, delay: 0.2, ease: 'easeInOut' }}
          opacity="0.6"
        />

        {/* Contour Path 3 */}
        <motion.path
          d="M-40 380 C 240 320, 500 520, 840 420"
          stroke="#8C5A3C"
          strokeWidth="1.5"
          strokeDasharray="900"
          initial={{ strokeDashoffset: 900 }}
          whileInView={{ strokeDashoffset: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 4.2, delay: 0.4, ease: 'easeInOut' }}
          opacity="0.5"
        />

        {/* Parcel Polygon 1 */}
        <motion.polygon
          points="240,160 480,120 540,280 300,320"
          fill="rgba(182, 90, 60, 0.06)"
          stroke="#B65A3C"
          strokeWidth="1.75"
          strokeDasharray="12 6"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, delay: 0.6 }}
        />

        {/* Parcel Polygon 2 */}
        <motion.polygon
          points="320,300 560,260 620,420 380,460"
          fill="rgba(112, 120, 77, 0.06)"
          stroke="#70784D"
          strokeWidth="1.5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, delay: 0.9 }}
        />

        {/* Infrastructure Alignment Corridor */}
        <motion.path
          d="M120 480 L 320 310 L 520 180 L 680 40"
          stroke="#5A3424"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="1000"
          initial={{ strokeDashoffset: 1000 }}
          whileInView={{ strokeDashoffset: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 3, delay: 0.3, ease: 'easeOut' }}
        />

        {/* Risk Beacon Marker */}
        <circle cx="320" cy="310" r="4" fill="#B65A3C" />
        <motion.circle
          cx="320"
          cy="310"
          r="14"
          stroke="#B65A3C"
          strokeWidth="1.5"
          initial={{ scale: 0.5, opacity: 0.8 }}
          animate={{ scale: [0.8, 2.2, 0.8], opacity: [0.8, 0, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
};
