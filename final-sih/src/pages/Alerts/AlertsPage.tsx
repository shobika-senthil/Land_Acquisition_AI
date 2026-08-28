import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  MapPin, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Radio, 
  Compass, 
  ShieldAlert
} from 'lucide-react';
import { ALERTS_DATA } from '../../data/alerts';
import { Alert } from '../../types';
import { DemoBanner } from '../../components/ui/DemoBanner';
import { AlertRecommendationModal } from '../../components/alerts/AlertRecommendationModal';

export const AlertsPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedAlertForModal, setSelectedAlertForModal] = useState<Alert | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredAlerts = selectedSeverity === 'ALL'
    ? ALERTS_DATA
    : ALERTS_DATA.filter(a => a.severity === selectedSeverity);

  const counts = {
    all: ALERTS_DATA.length,
    critical: ALERTS_DATA.filter(a => a.severity === 'CRITICAL').length,
    high: ALERTS_DATA.filter(a => a.severity === 'HIGH').length,
    moderate: ALERTS_DATA.filter(a => a.severity === 'MODERATE').length,
  };

  const handleOpenRecommendation = (alert: Alert) => {
    setSelectedAlertForModal(alert);
    setIsModalOpen(true);
  };

  const handleViewOnMap = (alert: Alert) => {
    if (alert.coordinates) {
      navigate(`/gis-risk-map?lat=${alert.coordinates[0]}&lng=${alert.coordinates[1]}&alert=${alert.id}`);
    } else {
      navigate('/gis-risk-map');
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return {
          bg: 'bg-[#FAECEC]',
          text: 'text-[#A94A3F]',
          border: 'border-[#F3BEBF]',
          icon: ShieldAlert,
        };
      case 'HIGH':
        return {
          bg: 'bg-[#FAF0EC]',
          text: 'text-[#B65A3C]',
          border: 'border-[#F1D4CA]',
          icon: AlertTriangle,
        };
      default:
        return {
          bg: 'bg-[#F1F4EB]',
          text: 'text-[#70784D]',
          border: 'border-[#D0DBC0]',
          icon: CheckCircle2,
        };
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EA] text-[#2B1D14] py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto font-sans">
      <DemoBanner />

      {/* 1. Header (Clean Apple-inspired sans-serif layout) */}
      <div className="mt-4 mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-[#B65A3C] font-semibold mb-1 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#B65A3C] animate-pulse" />
            REAL-TIME RADAR
          </div>
          <h1 className="text-page-heading font-display font-semibold text-[#2B1D14] tracking-tight">
            Early Warning Risk Radar
          </h1>
          <p className="text-xs sm:text-sm text-[#5A3424] mt-2 max-w-2xl leading-relaxed">
            Automated signals from legal filings, survey mismatches, ownership conflicts and acquisition bottlenecks.
          </p>
        </div>

        {/* Severity Filter Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-[#FCFAF7] border border-[#D8C4A8] rounded-2xl shadow-sandal-sm overflow-x-auto">
          {[
            { key: 'ALL', label: 'All Signals', count: counts.all },
            { key: 'CRITICAL', label: 'Critical', count: counts.critical },
            { key: 'HIGH', label: 'High', count: counts.high },
            { key: 'MODERATE', label: 'Moderate', count: counts.moderate },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setSelectedSeverity(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedSeverity === tab.key
                  ? 'bg-[#5A3424] text-[#F7F3EA] shadow-xs'
                  : 'text-[#5A3424] hover:bg-[#EFE5D3]'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* 2. Alert Cards Stream */}
      <div className="space-y-4">
        {filteredAlerts.map((alert, idx) => {
          const badge = getSeverityBadge(alert.severity);
          const Icon = badge.icon;

          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              whileHover={{ y: -2 }}
              className="bg-[#FCFAF7] rounded-3xl p-6 border border-[#D8C4A8] shadow-sandal-sm hover:shadow-sandal transition-all"
            >
              {/* Card Top: Severity, Location, Time */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-[#D8C4A8]/60">
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider ${badge.bg} ${badge.text} border ${badge.border}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {alert.severity}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-[#5A3424] font-medium">
                    <MapPin className="w-3.5 h-3.5 text-[#B65A3C]" />
                    <span>{alert.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-mono text-[#8C5A3C]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{alert.timestamp}</span>
                </div>
              </div>

              {/* Card Main: Title, Project, Description */}
              <div className="my-4">
                <h3 className="text-card-heading font-display font-semibold text-[#2B1D14] leading-snug">
                  {alert.title}
                </h3>
                <p className="text-xs font-semibold text-[#B65A3C] mt-1">
                  Corridor Alignment: {alert.project}
                </p>
                <p className="text-xs text-[#5A3424] mt-2.5 leading-relaxed bg-[#F7F3EA] p-3.5 rounded-2xl border border-[#D8C4A8]/60">
                  {alert.reason}
                </p>
              </div>

              {/* Card Bottom: Protocol Directives & Action Buttons */}
              <div className="pt-4 border-t border-[#D8C4A8]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-[#5A3424]">
                  <span className="w-2 h-2 rounded-full bg-[#B65A3C]" />
                  <span className="font-semibold text-[#2B1D14]">Recommended Protocol:</span>
                  <span className="text-[#5A3424] line-clamp-1">{alert.actionRecommendation.split('.')[0]}...</span>
                </div>

                {/* Apple-inspired Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
                  {/* Secondary Action: View on Map */}
                  <button
                    onClick={() => handleViewOnMap(alert)}
                    className="w-full sm:w-auto h-11 px-5 rounded-2xl bg-[#FCFAF7] hover:bg-[#EFE5D3] border border-[#D8C4A8] text-[#5A3424] text-xs font-semibold transition-all shadow-sandal-sm hover:-translate-y-0.5 active:scale-98 flex items-center justify-center gap-1.5"
                  >
                    <Compass className="w-3.5 h-3.5 text-[#8C5A3C]" />
                    <span>View on Map</span>
                  </button>

                  {/* Primary Action: View Recommendation → */}
                  <button
                    onClick={() => handleOpenRecommendation(alert)}
                    className="group w-full sm:w-auto h-11 px-5 rounded-2xl bg-[#5A3424] hover:bg-[#43261A] text-[#F7F3EA] text-xs font-semibold transition-all shadow-sandal hover:-translate-y-0.5 active:scale-98 flex items-center justify-center gap-2"
                  >
                    <span>View Recommendation</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D28B75] transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 3. Real Recommendation Side Panel / Modal */}
      <AlertRecommendationModal
        alert={selectedAlertForModal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
