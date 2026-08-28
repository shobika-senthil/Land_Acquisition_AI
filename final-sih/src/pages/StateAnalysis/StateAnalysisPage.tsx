import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  Layers, 
  MapPin, 
  ChevronRight, 
  TrendingUp, 
  AlertTriangle, 
  Building, 
  Compass, 
  FileText,
  Filter
} from 'lucide-react';
import { STATES_DATA } from '../../data/states';
import { DISTRICTS_DATA } from '../../data/districts';
import { PROJECTS_DATA } from '../../data/projects';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { DemoBanner } from '../../components/ui/DemoBanner';

export const StateAnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCode = searchParams.get('state') || 'TN';
  const [selectedStateCode, setSelectedStateCode] = useState<string>(initialCode);

  const currentState = STATES_DATA.find(s => s.code === selectedStateCode) || STATES_DATA[0];
  const stateDistricts = DISTRICTS_DATA.filter(d => d.stateCode === currentState.code);
  const stateProjects = PROJECTS_DATA.filter(p => p.state === currentState.name);

  return (
    <div className="min-h-screen bg-ivory text-earth-900 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <DemoBanner />

      {/* Header */}
      <div className="mt-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest font-bold text-terracotta-700 bg-terracotta-100 px-3 py-1 rounded-full border border-terracotta-300">
            State-Level Intelligence
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-semibold text-earth-950 mt-2">
            State-Wise Risk & Acquisition Matrix
          </h1>
          <p className="text-sm text-earth-600 mt-1">
            Hierarchical drill-down: <strong>India → State → District → Infrastructure Corridor</strong>
          </p>
        </div>

        <Link
          to="/district-analysis"
          className="self-start md:self-auto text-xs font-bold bg-earth-900 text-sandal-100 px-4 py-2 rounded-xl shadow-sandal-sm hover:bg-earth-950 flex items-center gap-1.5"
        >
          <Building className="w-4 h-4 text-terracotta-400" />
          <span>District Deep Dive</span>
        </Link>
      </div>

      {/* State Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 mb-8">
        {STATES_DATA.map(st => (
          <button
            key={st.code}
            onClick={() => setSelectedStateCode(st.code)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 border ${
              selectedStateCode === st.code
                ? 'bg-earth-900 text-sandal-100 border-earth-800 shadow-sandal'
                : 'bg-ivory text-earth-800 border-sandal-300 hover:bg-sandal-100 shadow-sandal-sm'
            }`}
          >
            <span>{st.name}</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
              st.averageDelayProbability >= 70 ? 'bg-risk-critical text-white' : 'bg-sandal-200 text-earth-800'
            }`}>
              {Math.round(st.averageDelayProbability)}%
            </span>
          </button>
        ))}
      </div>

      {/* State Metric Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-ivory rounded-2xl p-5 border border-sandal-300 shadow-sandal-sm">
          <span className="text-[11px] font-bold text-earth-500 uppercase">Total Projects</span>
          <div className="text-3xl font-extrabold text-earth-950 mt-1">{currentState.totalProjects}</div>
          <span className="text-xs text-earth-600 mt-1 block">{currentState.districtsCount} Districts Monitored</span>
        </div>

        <div className="bg-ivory rounded-2xl p-5 border border-terracotta-200 shadow-sandal-sm">
          <span className="text-[11px] font-bold text-terracotta-700 uppercase">High-Risk Projects</span>
          <div className="text-3xl font-extrabold text-terracotta-700 mt-1">{currentState.highRiskProjects}</div>
          <span className="text-xs text-terracotta-600 mt-1 block">Forecast Overrun &gt;6 Mos</span>
        </div>

        <div className="bg-ivory rounded-2xl p-5 border border-risk-critical-border shadow-sandal-sm">
          <span className="text-[11px] font-bold text-risk-critical uppercase">Critical Projects</span>
          <div className="text-3xl font-extrabold text-risk-critical mt-1">{currentState.criticalProjects}</div>
          <span className="text-xs text-risk-critical mt-1 block">Active Injunction Stays</span>
        </div>

        <div className="bg-ivory rounded-2xl p-5 border border-sandal-300 shadow-sandal-sm">
          <span className="text-[11px] font-bold text-earth-500 uppercase">Avg Delay Probability</span>
          <div className="text-3xl font-extrabold text-earth-950 mt-1">{currentState.averageDelayProbability}%</div>
          <span className="text-xs text-earth-600 mt-1 block">₹{currentState.budgetAtRiskCr.toLocaleString()} Cr Capital At Risk</span>
        </div>
      </div>

      {/* State Districts Drill-down Table & Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Districts in State */}
        <div className="lg:col-span-6 bg-ivory rounded-3xl p-6 border border-sandal-300 shadow-sandal">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg text-earth-950">
              Districts in {currentState.name}
            </h3>
            <span className="text-xs text-earth-500 font-mono">
              {stateDistricts.length} Monitored Nodes
            </span>
          </div>

          <div className="space-y-3">
            {stateDistricts.length > 0 ? (
              stateDistricts.map(d => (
                <div
                  key={d.id}
                  onClick={() => navigate(`/district-analysis?district=${d.id}`)}
                  className="p-4 rounded-2xl bg-cream-light hover:bg-sandal-100 border border-sandal-200 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-earth-950">{d.name} District</h4>
                      <RiskBadge level={d.riskLevel} size="sm" />
                    </div>
                    <p className="text-xs text-earth-600 mt-1 line-clamp-1">
                      {d.primaryVulnerability}
                    </p>
                    <span className="text-[11px] text-earth-500 mt-1 block">
                      {d.projectCount} Projects • {d.criticalParcels} Critical Plots
                    </span>
                  </div>

                  <div className="text-right pl-3">
                    <span className="text-lg font-black text-risk-critical block">
                      {d.delayRiskScore}%
                    </span>
                    <span className="text-[10px] text-earth-500 font-bold">Delay Risk</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-earth-500 bg-cream-light rounded-2xl">
                No high-density bottlenecks flagged for secondary districts in this view.
              </div>
            )}
          </div>
        </div>

        {/* Major State Corridors */}
        <div className="lg:col-span-6 bg-ivory rounded-3xl p-6 border border-sandal-300 shadow-sandal">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg text-earth-950">
              Active Corridors in {currentState.name}
            </h3>
            <Link to="/projects" className="text-xs font-bold text-earth-900 hover:text-terracotta-600">
              View All →
            </Link>
          </div>

          <div className="space-y-3">
            {stateProjects.length > 0 ? (
              stateProjects.map(proj => (
                <div
                  key={proj.id}
                  onClick={() => navigate(`/projects/${proj.id}`)}
                  className="p-4 rounded-2xl bg-cream-light hover:bg-sandal-100 border border-sandal-200 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-earth-500">{proj.code}</span>
                    <RiskBadge level={proj.riskLevel} size="sm" />
                  </div>
                  <h4 className="font-bold text-sm text-earth-950">{proj.name}</h4>
                  <p className="text-xs text-earth-600 mt-1">
                    {proj.district} • {proj.lengthKm} km • {proj.acquiredParcels}/{proj.totalParcels} Parcels Acquired
                  </p>
                  
                  <div className="mt-3 pt-2 border-t border-sandal-200 flex items-center justify-between text-xs">
                    <span className="text-terracotta-700 font-medium">
                      Est. Delay: +{proj.estimatedDelayMonths} Months
                    </span>
                    <span className="font-bold text-earth-900 flex items-center gap-1">
                      Explore Corridor <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-xs text-earth-500 bg-cream-light rounded-2xl">
                Select Tamil Nadu, Maharashtra, or Uttar Pradesh to inspect active high-density corridors.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
