import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  MapPin, 
  Compass, 
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Step {
  id: number;
  title: string;
  subtitle: string;
  narration: string;
  path: string;
  highlightTag: string;
}

export const GuidedTourModal: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps: Step[] = [
    {
      id: 1,
      title: 'Cinematic Landing Page Story',
      subtitle: 'The Core Innovation',
      narration: 'LANDLYTICS redesigns land acquisition from passive spreadsheets to proactive spatial intelligence. Scroll through the narrative: Problem → Location → Measure → Predict (82/100) → Explain → Act.',
      path: '/',
      highlightTag: 'Storytelling Narrative',
    },
    {
      id: 2,
      title: 'Command Center & Story Flow',
      subtitle: 'National Risk Overview',
      narration: 'The dashboard follows a 4-step executive narrative: What is happening (32 critical stalls) → Where (Tamil Nadu, UP, Maharashtra) → Why (mutation & circle rate gap) → What next (Section 3H(4) escrow).',
      path: '/dashboard',
      highlightTag: 'Command Center',
    },
    {
      id: 3,
      title: 'Interactive GIS Risk Map',
      subtitle: 'Flagship GIS Engine',
      narration: 'The interactive map is the central interaction layer. Pinpoint Madurai South, choose the 5 KM buffer, and inspect simulated real-world friction (42,800 population, 183 parcels, 17 road intersections).',
      path: '/gis-risk-map',
      highlightTag: 'Spatial Friction Matrix',
    },
    {
      id: 4,
      title: 'Deep Cadastral Plot Intelligence',
      subtitle: 'Plot PL-2048 (SRV-104/7)',
      narration: 'Inspect the 82/100 Critical risk parcel in Madurai. Explainable AI reveals why: 7 co-heirs (+24 pts), Sub-court stay (+18 pts). Recommends fast-track Section 3H(4) court escrow to save 140+ days.',
      path: '/parcels/PL-2048',
      highlightTag: 'Explainable AI (XAI)',
    },
    {
      id: 5,
      title: '8-Phase Corridor Timeline',
      subtitle: 'NH-38 Chennai–Madurai Expansion',
      narration: 'Explore the 462 km infrastructure corridor. The 8-phase timeline highlights the precise bottleneck at Phase 3 (Title Verification) and affected cadastral plots.',
      path: '/projects/proj-chennai-madurai',
      highlightTag: '8-Phase Timeline',
    },
    {
      id: 6,
      title: 'Decision Support Intelligence Dossier',
      subtitle: 'Printable & PDF Export',
      narration: 'Generate official government dossiers with statutory Section 3H(4) legal directives and CSV exports for Ministry of Rural Development (DoLR) leadership.',
      path: '/reports/REP-2026-002',
      highlightTag: 'Statutory Reports',
    },
  ];

  const currentStep = steps[currentStepIndex];

  const goToStep = async (index: number) => {
    setCurrentStepIndex(index);
    const target = steps[index];

    // If target is a protected route and user is not logged in, auto-authenticate for the demo judge
    if (target.path !== '/' && !isAuthenticated) {
      await login('officer@landlytics.gov.in', 'demo123', 'Administrator');
    }

    navigate(target.path);
  };

  const handleNext = async () => {
    if (currentStepIndex < steps.length - 1) {
      await goToStep(currentStepIndex + 1);
    } else {
      setIsOpen(false);
    }
  };

  const handlePrev = async () => {
    if (currentStepIndex > 0) {
      await goToStep(currentStepIndex - 1);
    }
  };

  return (
    <>
      {/* Floating Tour Launcher Pill */}
      <div className="fixed bottom-5 right-5 z-50 pointer-events-auto">
        <button
          onClick={async () => {
            setIsOpen(true);
            if (location.pathname !== currentStep.path) {
              if (currentStep.path !== '/' && !isAuthenticated) {
                await login('officer@landlytics.gov.in', 'demo123', 'Administrator');
              }
              navigate(currentStep.path);
            }
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#5A3424] text-[#F7F2E8] text-xs font-bold shadow-sandal-xl hover:bg-[#43261A] border border-[#73462E] hover:scale-105 active:scale-95 transition-all group"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D28B75] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B65A3C]"></span>
          </span>
          <span>Interactive Platform Tour</span>
          <Sparkles className="w-3.5 h-3.5 text-[#D28B75] group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      {/* Guided Tour Interactive Modal Bar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-16 right-5 left-5 sm:left-auto sm:w-[480px] z-50 bg-[#FCFAF7]/98 backdrop-blur-2xl rounded-3xl border-2 border-[#B65A3C] shadow-sandal-xl p-6 pointer-events-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#D8C4A8]/60">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F9ECE7] text-[#B65A3C] border border-[#E4B4A4]">
                  STEP {currentStep.id} OF {steps.length}
                </span>
                <span className="text-xs font-bold text-[#5A3424]">
                  {currentStep.highlightTag}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#8C5A3C] hover:text-[#2B1D14] p-1 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="my-4">
              <h3 className="text-lg font-display font-semibold text-[#2B1D14]">
                {currentStep.title}
              </h3>
              <p className="text-xs font-semibold text-[#B65A3C] mt-0.5">
                {currentStep.subtitle}
              </p>
              <p className="text-xs text-[#5A3424] mt-2.5 leading-relaxed bg-[#F7F2E8] p-3.5 rounded-2xl border border-[#D8C4A8]/60">
                {currentStep.narration}
              </p>
            </div>

            {/* Step Indicators */}
            <div className="flex items-center gap-1.5 mb-4">
              {steps.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => goToStep(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentStepIndex
                      ? 'w-8 bg-[#5A3424]'
                      : idx < currentStepIndex
                      ? 'w-3 bg-[#6F7B4A]'
                      : 'w-3 bg-[#D8C4A8]'
                  }`}
                  title={s.title}
                />
              ))}
            </div>

            {/* Footer Navigation Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-[#D8C4A8]/60">
              <button
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className="flex items-center gap-1 text-xs font-bold text-[#5A3424] hover:text-[#2B1D14] disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#5A3424] text-[#F7F2E8] text-xs font-bold rounded-full shadow-sandal hover:bg-[#43261A] transition-all active:scale-95"
              >
                <span>{currentStepIndex === steps.length - 1 ? 'Finish Tour' : 'Next Screen'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
