import React from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GlobalNavigation } from '../navigation/GlobalNavigation';
import { CustomCursor } from '../ui/CustomCursor';
import { GuidedTourModal } from '../ui/GuidedTourModal';
import { Logo } from '../ui/Logo';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#2B1D14] font-sans flex flex-col justify-between selection:bg-[#EFE5D3] selection:text-[#5A3424]">
      {/* 1. Desktop Trailing Follower Cursor */}
      <CustomCursor />

      {/* 2. Structured Product Header (Sticky, Non-overlapping) */}
      {!isAuthPage && <GlobalNavigation />}

      {/* 3. Main Content Flow (Starts naturally AFTER navigation) */}
      <main className="flex-1 w-full relative z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. Global Footer (Clean, Editorial, Non-intrusive) */}
      {!isAuthPage && (
        <footer className="w-full bg-[#FFFCF7] border-t border-[#8C5A3C]/12 py-10 mt-16">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Logo compact={false} />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#5A3424] font-medium">
              <span>Department of Land Resources (DoLR)</span>
              <span>•</span>
              <span>Ministry of Rural Development</span>
              <span>•</span>
              <span className="font-mono text-[#8C5A3C]">Predictive Land Intelligence</span>
            </div>

            <div className="text-xs text-[#8C5A3C] font-mono text-center md:text-right">
              RFCTLARR 2013 & NHAI Act Compliance
            </div>
          </div>
        </footer>
      )}

      {/* 5. 1-Click Guided Tour Assistant */}
      <GuidedTourModal />
    </div>
  );
};
