import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TypewriterHeadlineProps {
  phrases?: string[];
  className?: string;
}

export const TypewriterHeadline: React.FC<TypewriterHeadlineProps> = ({
  phrases = [
    'Risk detected in Madurai South (Avaniyapuram).',
    '7/12 mutation lineage dispute flagged in Pune alignment.',
    'Section 3H(4) court escrow bypass ready for dispatch.',
    'Varanasi circle rate disparity detected • Risk index 88/100.',
    'Machine-learned delay forecast rising (+4.2 Months).',
  ],
  className = '',
}) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 4200);

    return () => clearInterval(timer);
  }, [phrases.length]);

  return (
    <div className={`inline-flex items-center min-h-[28px] overflow-hidden ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="inline-flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-[#B65A3C] animate-pulse" />
          <span className="font-mono text-xs sm:text-sm font-semibold tracking-tight text-[#5A3424]">
            {phrases[index]}
          </span>
        </motion.span>
      </AnimatePresence>
    </div>
  );
};
