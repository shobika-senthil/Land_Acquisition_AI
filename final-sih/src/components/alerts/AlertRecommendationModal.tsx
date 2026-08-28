import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  AlertTriangle, 
  MapPin, 
  CheckCircle2, 
  Compass,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../../types';

interface AlertRecommendationModalProps {
  alert: Alert | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AlertRecommendationModal: React.FC<AlertRecommendationModalProps> = ({
  alert,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!alert) return null;

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return {
          bg: 'bg-[#FAECEC]',
          text: 'text-[#A94A3F]',
          border: 'border-[#F3BEBF]',
          badge: 'bg-[#A94A3F] text-white',
        };
      case 'HIGH':
        return {
          bg: 'bg-[#FAF0EC]',
          text: 'text-[#B65A3C]',
          border: 'border-[#F1D4CA]',
          badge: 'bg-[#B65A3C] text-white',
        };
      default:
        return {
          bg: 'bg-[#F1F4EB]',
          text: 'text-[#70784D]',
          border: 'border-[#D0DBC0]',
          badge: 'bg-[#70784D] text-white',
        };
    }
  };

  const style = getSeverityStyle(alert.severity);

  const handleViewOnMap = () => {
    onClose();
    if (alert.coordinates) {
      navigate(`/gis-risk-map?lat=${alert.coordinates[0]}&lng=${alert.coordinates[1]}&alert=${alert.id}`);
    } else {
      navigate('/gis-risk-map');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#2B1D14]/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="relative w-full max-w-2xl bg-[#FCFAF7] rounded-3xl border border-[#D8C4A8] shadow-sandal-xl overflow-hidden z-10 my-8"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#D8C4A8]/60 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider ${style.bg} ${style.text} border ${style.border}`}>
                    {alert.severity} RADAR SIGNAL
                  </span>
                  <span className="text-xs text-[#8C5A3C] font-mono">
                    {alert.timestamp}
                  </span>
                </div>
                <h3 className="text-xl font-display font-semibold text-[#2B1D14] mt-1 leading-snug">
                  {alert.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-[#5A3424]">
                  <MapPin className="w-3.5 h-3.5 text-[#B65A3C]" />
                  <span>{alert.location}</span>
                  <span>•</span>
                  <span>{alert.project}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-[#8C5A3C] hover:text-[#2B1D14] hover:bg-[#EFE5D3] transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
              {/* 1. Why this alert matters */}
              <div className="bg-[#F7F3EA] rounded-2xl p-4 border border-[#D8C4A8]/60">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8C5A3C] mb-1.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#B65A3C]" />
                  Why This Alert Matters
                </h4>
                <p className="text-xs text-[#5A3424] leading-relaxed">
                  {alert.reason}
                </p>
              </div>

              {/* 2. Key Risk Drivers */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8C5A3C] mb-2.5">
                  Primary Delay Drivers
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-[#FCFAF7] border border-[#D8C4A8] text-xs">
                    <span className="text-[#8C5A3C] text-[10px] uppercase font-semibold block">Dispute Nature</span>
                    <span className="font-semibold text-[#2B1D14] mt-0.5 block">{alert.reason.split('.')[0]}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#FCFAF7] border border-[#D8C4A8] text-xs">
                    <span className="text-[#8C5A3C] text-[10px] uppercase font-semibold block">Statutory Impact</span>
                    <span className="font-semibold text-[#A94A3F] mt-0.5 block">Delays Notice 3D by ~140 Days</span>
                  </div>
                </div>
              </div>

              {/* 3. Recommended Next Step */}
              <div className="p-4 rounded-2xl bg-[#2B1D14] text-[#F7F3EA] border border-[#43261A] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#D28B75] uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    Recommended Mitigation Protocol
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-[#43261A] text-[#D8C4A8] font-mono">
                    Priority: IMMEDIATE
                  </span>
                </div>
                <p className="text-xs text-[#D8C4A8] leading-relaxed font-medium">
                  {alert.actionRecommendation}
                </p>
              </div>

              {/* 4. Administrative Details */}
              <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-[#D8C4A8]/40 text-xs">
                <div className="bg-[#EFE5D3]/60 p-3 rounded-xl">
                  <span className="text-[10px] text-[#8C5A3C] uppercase font-semibold block">Authority</span>
                  <span className="font-semibold text-[#2B1D14] mt-0.5 block">CALA / SLAO Cell</span>
                </div>
                <div className="bg-[#EFE5D3]/60 p-3 rounded-xl">
                  <span className="text-[10px] text-[#8C5A3C] uppercase font-semibold block">Statutory Ref</span>
                  <span className="font-semibold text-[#2B1D14] mt-0.5 block">Section 3H(4)</span>
                </div>
                <div className="bg-[#EFE5D3]/60 p-3 rounded-xl">
                  <span className="text-[10px] text-[#8C5A3C] uppercase font-semibold block">Resolution Window</span>
                  <span className="font-semibold text-[#70784D] mt-0.5 block">14 Working Days</span>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-6 bg-[#EFE5D3]/50 border-t border-[#D8C4A8]/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-[#5A3424] hover:text-[#2B1D14] transition-colors"
              >
                Close Brief
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                <button
                  onClick={handleViewOnMap}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-[#FCFAF7] hover:bg-[#EFE5D3] border border-[#D8C4A8] text-[#5A3424] text-xs font-semibold transition-all shadow-sandal-sm active:scale-98"
                >
                  <Compass className="w-3.5 h-3.5 text-[#8C5A3C]" />
                  <span>View on Map</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#5A3424] hover:bg-[#43261A] text-[#F7F3EA] text-xs font-semibold transition-all shadow-sandal active:scale-98"
                >
                  <span>Acknowledge Protocol</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D28B75]" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
