import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  Building, 
  MapPin, 
  ChevronRight, 
  AlertTriangle, 
  Compass, 
  LandPlot, 
  Layers,
  ArrowRight,
  Zap
} from 'lucide-react';
import { DISTRICTS_DATA } from '../../data/districts';
import { PARCELS_DATA } from '../../data/parcels';
import { PROJECTS_DATA } from '../../data/projects';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { DemoBanner } from '../../components/ui/DemoBanner';

export const DistrictAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialDistrictId = searchParams.get('district') || 'madurai';
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>(initialDistrictId);

  const currentDistrict = DISTRICTS_DATA.find(d => d.id === selectedDistrictId) || DISTRICTS_DATA[0];
  const districtProjects = PROJECTS_DATA.filter(p => p.district.toLowerCase() === currentDistrict.name.toLowerCase());
  const districtParcels = PARCELS_DATA.filter(pr => pr.district.toLowerCase() === currentDistrict.name.toLowerCase());

  return (
    <div className="min-h-screen bg-ivory text-earth-900 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <DemoBanner />

      {/* Header */}
      <div className="mt-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest font-bold text-terracotta-700 bg-terracotta-100 px-3 py-1 rounded-full border border-terracotta-300">
            District-Level Intelligence
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-semibold text-earth-950 mt-2">
            {currentDistrict.name} District Analysis
          </h1>
          <p className="text-sm text-earth-600 mt-1">
            {currentDistrict.stateName} • Key Vulnerability: <strong>{currentDistrict.primaryVulnerability}</strong>
          </p>
        </div>

        <Link
          to={`/gis-risk-map`}
          className="self-start md:self-auto text-xs font-bold bg-earth-900 text-sandal-100 px-4 py-2 rounded-xl shadow-sandal-sm hover:bg-earth-950 flex items-center gap-1.5"
        >
          <Compass className="w-4 h-4 text-terracotta-400" />
          <span>Launch District GIS View</span>
        </Link>
      </div>

      {/* District Selector */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 mb-8">
        {DISTRICTS_DATA.map(d => (
          <button
            key={d.id}
            onClick={() => setSelectedDistrictId(d.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
              selectedDistrictId === d.id
                ? 'bg-earth-900 text-sandal-100 border-earth-800 shadow-sandal'
                : 'bg-ivory text-earth-800 border-sandal-300 hover:bg-sandal-100 shadow-sandal-sm'
            }`}
          >
            <span>{d.name} ({d.stateCode})</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
              d.delayRiskScore >= 80 ? 'bg-risk-critical text-white' : 'bg-sandal-200 text-earth-800'
            }`}>
              {d.delayRiskScore}%
            </span>
          </button>
        ))}
      </div>

      {/* District Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-ivory rounded-2xl p-5 border border-sandal-300 shadow-sandal-sm">
          <span className="text-[11px] font-bold text-earth-500 uppercase">Monitored Projects</span>
          <div className="text-3xl font-extrabold text-earth-950 mt-1">{currentDistrict.projectCount}</div>
          <span className="text-xs text-earth-600 mt-1 block">Corridor Takeoff Points</span>
        </div>

        <div className="bg-ivory rounded-2xl p-5 border border-risk-critical-border shadow-sandal-sm">
          <span className="text-[11px] font-bold text-risk-critical uppercase">Critical Cadastral Plots</span>
          <div className="text-3xl font-extrabold text-risk-critical mt-1">{currentDistrict.criticalParcels}</div>
          <span className="text-xs text-risk-critical mt-1 block font-medium">Pending Mutation / Escrow</span>
        </div>

        <div className="bg-ivory rounded-2xl p-5 border border-sandal-300 shadow-sandal-sm">
          <span className="text-[11px] font-bold text-earth-500 uppercase">Delay Friction Score</span>
          <div className="text-3xl font-extrabold text-earth-950 mt-1">{currentDistrict.delayRiskScore}/100</div>
          <RiskBadge level={currentDistrict.riskLevel} size="sm" className="mt-1" />
        </div>

        <div className="bg-ivory rounded-2xl p-5 border border-sandal-300 shadow-sandal-sm">
          <span className="text-[11px] font-bold text-earth-500 uppercase">Average Delay Forecast</span>
          <div className="text-3xl font-extrabold text-earth-950 mt-1">+{currentDistrict.delayRiskScore >= 80 ? '8.5' : '5.2'} Mos</div>
          <span className="text-xs text-earth-600 mt-1 block">High Resolution Estimate</span>
        </div>
      </div>

      {/* District Projects & Parcels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* District Projects */}
        <div className="lg:col-span-6 bg-ivory rounded-3xl p-6 border border-sandal-300 shadow-sandal">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg text-earth-950">
              Infrastructure Corridors in {currentDistrict.name}
            </h3>
            <span className="text-xs text-earth-500 font-mono">
              {districtProjects.length} Active Alignments
            </span>
          </div>

          <div className="space-y-3">
            {districtProjects.map(p => (
              <div
                key={p.id}
                onClick={() => navigate(`/projects/${p.id}`)}
                className="p-4 rounded-2xl bg-cream-light hover:bg-sandal-100 border border-sandal-200 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono font-bold text-earth-500">{p.code}</span>
                  <RiskBadge level={p.riskLevel} size="sm" />
                </div>
                <h4 className="font-bold text-sm text-earth-950">{p.name}</h4>
                <p className="text-xs text-earth-600 mt-1">{p.summary}</p>
                <div className="mt-3 pt-2 border-t border-sandal-200 flex items-center justify-between text-xs font-bold text-terracotta-700">
                  <span>Top Driver: {p.topDelayDriver}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-earth-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High-Risk Cadastral Parcels in District */}
        <div className="lg:col-span-6 bg-ivory rounded-3xl p-6 border border-sandal-300 shadow-sandal">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg text-earth-950">
              High-Friction Cadastral Parcels
            </h3>
            <span className="text-xs text-earth-500 font-mono">
              Taluk Records Sample
            </span>
          </div>

          <div className="space-y-3">
            {districtParcels.map(pr => (
              <div
                key={pr.id}
                onClick={() => navigate(`/parcels/${pr.id}`)}
                className="p-4 rounded-2xl bg-cream-light hover:bg-sandal-100 border border-sandal-200 transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-earth-950">Plot {pr.plotId} ({pr.surveyNumber})</h4>
                    <RiskBadge level={pr.riskLevel} size="sm" />
                  </div>
                  <p className="text-xs text-earth-600 mt-1">
                    {pr.village}, {pr.taluk} • {pr.areaAcres} Acres ({pr.landUse})
                  </p>
                  <p className="text-[11px] text-terracotta-700 font-medium mt-0.5">
                    {pr.ownershipType} Ownership • {pr.legalDisputeCount} Active Civil Cases
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 text-earth-400 flex-shrink-0 ml-2" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
