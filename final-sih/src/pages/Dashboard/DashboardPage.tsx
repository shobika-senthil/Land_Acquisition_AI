import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, 
  AreaChart, Area 
} from 'recharts';
import { 
  AlertTriangle, 
  TrendingUp, 
  MapPin, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Layers, 
  Compass, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Activity,
  Radio
} from 'lucide-react';
import { PROJECTS_DATA } from '../../data/projects';
import { STATES_DATA } from '../../data/states';
import { ALERTS_DATA } from '../../data/alerts';
import { PARCELS_DATA } from '../../data/parcels';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { DemoBanner } from '../../components/ui/DemoBanner';
import { TypewriterHeadline } from '../../components/motion/TypewriterHeadline';
import { IntelligenceTicker } from '../../components/motion/IntelligenceTicker';
import { TiltCard } from '../../components/motion/TiltCard';
import { MagneticButton } from '../../components/motion/MagneticButton';
import { StackedRiskCards } from '../../components/motion/StackedRiskCards';
import { HorizontalJourneyStory } from '../../components/motion/HorizontalJourneyStory';
import { GeographicTerrainScene } from '../../components/motion/GeographicTerrainScene';

export const DashboardPage: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>('TN');
  const [counts, setCounts] = useState({
    projects: 0,
    highRisk: 0,
    critical: 0,
    prob: 0,
    capital: 0,
  });

  // Calculate dashboard KPIs from the actual project data.
  useEffect(() => {
    const totalProjects = PROJECTS_DATA.length;

    const highRisk = PROJECTS_DATA.filter(
      project =>
        project.riskLevel === 'HIGH' ||
        project.riskLevel === 'CRITICAL'
    ).length;

    const critical = PROJECTS_DATA.filter(
      project => project.riskLevel === 'CRITICAL'
    ).length;

    const averageDelay =
      totalProjects > 0
        ? Math.round(
            PROJECTS_DATA.reduce(
              (sum, project) => sum + project.delayProbability,
              0
            ) / totalProjects
          )
        : 0;

    const capitalAtRisk = PROJECTS_DATA
      .filter(
        project =>
          project.riskLevel === 'HIGH' ||
          project.riskLevel === 'CRITICAL'
      )
      .reduce((sum, project) => sum + project.budgetCr, 0);

    setCounts({
      projects: totalProjects,
      highRisk,
      critical,
      prob: averageDelay,
      capital: Math.round(capitalAtRisk),
    });
  }, []);

  // Chart data for State Comparison
  const stateChartData = STATES_DATA.map(s => ({
    name: s.name.split(' ')[0],
    code: s.code,
    risk: Math.round(s.averageDelayProbability),
    critical: s.criticalProjects,
    high: s.highRiskProjects,
    projects: s.totalProjects,
  }));

  const activeStateData = STATES_DATA.find(s => s.code === selectedState) || STATES_DATA[0];

  return (
    <div className="w-full">
      {/* 1. Infinite Intelligence Ticker */}
      <IntelligenceTicker />

      <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto font-sans space-y-10">
        <DemoBanner />

        {/* 2. Header (Apple-inspired Decision Intelligence Command Center) */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#B65A3C] font-semibold mb-1.5 flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-[#B65A3C] animate-pulse" />
              <span>LIVE INTELLIGENCE FEED:</span>
              <TypewriterHeadline />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[#2B1D14] tracking-tight leading-tight">
              Land acquisition risk, at a glance.
            </h1>
            <p className="text-xs sm:text-sm text-[#5A3424] mt-2 max-w-2xl leading-relaxed">
              Understand where delays are emerging, why they are happening, and what action comes next.
            </p>
          </div>

          {/* Action Shortcuts with Magnetic Spring physics */}
          <div className="flex items-center gap-2.5">
            <Link to="/gis-risk-map">
              <MagneticButton className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#5A3424] text-[#F7F3EA] font-semibold text-xs shadow-sandal hover:bg-[#43261A] transition-all">
                <Compass className="w-3.5 h-3.5 text-[#D28B75]" />
                <span>Launch GIS Risk Map</span>
              </MagneticButton>
            </Link>
            <Link to="/reports">
              <MagneticButton className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-[#FFFCF7] text-[#5A3424] border border-[#D8C4A8] font-semibold text-xs hover:bg-[#EFE5D3] transition-colors shadow-sandal-sm">
                <FileText className="w-3.5 h-3.5 text-[#8C5A3C]" />
                <span>Executive Brief</span>
              </MagneticButton>
            </Link>
          </div>
        </div>

        {/* 3. HIGH-IMPACT 3D METRIC STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <TiltCard>
            <div className="bg-[#FFFCF7] rounded-3xl p-5 border border-[#D8C4A8] shadow-sandal-sm h-full">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold text-[#8C5A3C] uppercase tracking-wider">
                  Total Projects
                </span>
                <span className="text-[9px] font-mono text-[#8C5A3C] bg-[#EFE5D3] px-1.5 py-0.2 rounded">LIVE DATA</span>
              </div>
              <div className="text-3xl font-display font-semibold text-[#2B1D14] mt-1.5">
                {counts.projects}
              </div>
              <span className="text-xs text-[#5A3424] mt-1 block">
                Across tracked projects
              </span>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="bg-[#FFFCF7] rounded-3xl p-5 border border-[#E4B4A4] shadow-sandal-sm h-full">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold text-[#B65A3C] uppercase tracking-wider">
                  High-Risk Corridors
                </span>
                <span className="text-[9px] font-mono text-[#B65A3C] bg-[#F9ECE7] px-1.5 py-0.2 rounded">RISK DATA</span>
              </div>
              <div className="text-3xl font-display font-semibold text-[#B65A3C] mt-1.5">
                {counts.highRisk}
              </div>
              <span className="text-xs text-[#5A3424] mt-1 block">
                HIGH / CRITICAL risk projects
              </span>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="bg-[#FFFCF7] rounded-3xl p-5 border border-[#F3BEBF] shadow-sandal-sm h-full">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold text-[#A9473B] uppercase tracking-wider">
                  Critical Stalls
                </span>
                <span className="text-[9px] font-mono text-[#A9473B] bg-[#FAECEC] px-1.5 py-0.2 rounded font-bold">ALERT</span>
              </div>
              <div className="text-3xl font-display font-semibold text-[#A9473B] mt-1.5 flex items-center gap-2">
                {counts.critical}
                <span className="w-2 h-2 rounded-full bg-[#A9473B] animate-ping" />
              </div>
              <span className="text-xs text-[#A9473B] mt-1 block font-medium">
                Immediate Action Required
              </span>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="bg-[#FFFCF7] rounded-3xl p-5 border border-[#D8C4A8] shadow-sandal-sm h-full">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold text-[#8C5A3C] uppercase tracking-wider">
                  National Delay Prob.
                </span>
                <span className="text-[9px] font-mono text-[#70784D] bg-[#F1F4EB] px-1.5 py-0.2 rounded">PROJECT DATA</span>
              </div>
              <div className="text-3xl font-display font-semibold text-[#2B1D14] mt-1.5">
                {counts.prob}%
              </div>
              <span className="text-xs text-[#5A3424] mt-1 block">
                Average across tracked projects
              </span>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="col-span-2 sm:col-span-1 bg-[#FFFCF7] rounded-3xl p-5 border border-[#D8C4A8] shadow-sandal-sm h-full">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-semibold text-[#8C5A3C] uppercase tracking-wider">
                  Capital at Risk
                </span>
                <span className="text-[9px] font-mono text-[#8C5A3C] bg-[#EFE5D3] px-1.5 py-0.2 rounded">BUDGET</span>
              </div>
              <div className="text-3xl font-display font-semibold text-[#2B1D14] mt-1.5">
                ₹{counts.capital.toLocaleString('en-IN')} Cr
              </div>
              <span className="text-xs text-[#5A3424] mt-1 block">
                High & Critical risk budgets
              </span>
            </div>
          </TiltCard>
        </div>

        {/* 4. 3D GEOGRAPHIC SPATIAL TERRAIN PREVIEW & DECISION DIRECTIVES */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* 3D Terrain Wireframe Mesh */}
          <div className="lg:col-span-7 bg-[#FFFCF7] rounded-3xl p-6 sm:p-8 border border-[#8C5A3C]/16 shadow-sandal-sm flex flex-col justify-between overflow-hidden relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#D8C4A8]/60 z-10">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#B65A3C] tracking-wider">
                  Spatial Friction & Elevation Mesh
                </span>
                <h3 className="text-lg sm:text-xl font-display font-semibold text-[#2B1D14]">
                  Cadastral Topographic Telemetry
                </h3>
              </div>
              <span className="text-xs font-mono text-[#8C5A3C] bg-[#F7F3EA] px-3 py-1 rounded-full border border-[#D8C4A8]">
                Interactive 3D Engine
              </span>
            </div>

            <div className="relative h-64 sm:h-72 my-2 flex items-center justify-center">
              <GeographicTerrainScene />
              <div className="absolute bottom-3 left-3 bg-[#FFFCF7]/90 backdrop-blur-sm p-3 rounded-2xl border border-[#D8C4A8] text-xs font-mono">
                <span className="text-[#B65A3C] font-bold">● Active Zone:</span> Madurai South (NH-38 Expansion)
              </div>
            </div>

            <div className="pt-4 border-t border-[#D8C4A8]/60 flex items-center justify-between text-xs z-10">
              <span className="text-[#5A3424]">Calculates parcel slope, water buffer overlap, and settlement density.</span>
              <Link to="/gis-risk-map" className="font-semibold text-[#B65A3C] hover:underline flex items-center gap-1">
                <span>Explore Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 4-Step Action Framework */}
          <div className="lg:col-span-5 bg-[#5A3424] text-[#F7F3EA] rounded-3xl p-6 sm:p-8 border border-[#43261A] shadow-sandal flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-[#D28B75]" />
                <span className="text-xs font-mono uppercase font-semibold text-[#D28B75]">
                  Decision Framework
                </span>
              </div>
              <h3 className="text-xl font-display font-semibold text-[#F7F3EA] leading-snug">
                How LANDLYTICS prevents acquisition stalls
              </h3>
              <p className="text-xs text-[#D8C4A8] mt-2 leading-relaxed">
                Automated multi-factor spatial risk pipelines convert raw cadastral discrepancies into statutory next steps.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  { step: '01', title: 'Detect Boundary Mismatches', desc: 'Cross-checks Bhoomi & RoR registries with digital drone survey coordinates.' },
                  { step: '02', title: 'Forecast Delay Probability', desc: 'Machine learning ensemble projects months of delay before 3D publication.' },
                  { step: '03', title: 'Trigger Section 3H(4) Protocol', desc: 'Directs CALA/SLAO cells to deposit contested funds into court escrow.' },
                  { step: '04', title: 'Clear Right-of-Way in Record Time', desc: 'Saves an average of 140+ working days on critical national corridors.' }
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-3 p-2.5 rounded-2xl bg-[#43261A]/70 border border-[#73462E]/60 text-xs">
                    <span className="font-mono text-xs font-bold text-[#D28B75] bg-[#5A3424] w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.step}
                    </span>
                    <div>
                      <span className="font-semibold text-[#F7F3EA] block">{item.title}</span>
                      <span className="text-[11px] text-[#D8C4A8] mt-0.5 block leading-relaxed">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#73462E] flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#D8C4A8]">DoLR Standard Protocol</span>
              <Link
                to="/ai-insights"
                className="text-xs font-semibold text-[#D28B75] hover:text-[#F7F3EA] flex items-center gap-1"
              >
                <span>Read Empirical Findings</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

        {/* 5. 8-PHASE LAND ACQUISITION HORIZONTAL SCROLL STORY */}
        <div className="bg-[#FFFCF7] rounded-3xl p-6 sm:p-8 border border-[#8C5A3C]/16 shadow-sandal-sm">
          <HorizontalJourneyStory />
        </div>

        {/* 6. SIGNATURE STACKED RISK DEPTH STORYTELLING */}
        <div>
          <div className="mb-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#B65A3C] font-semibold block">
              Predictive Friction Taxonomy
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-semibold text-[#2B1D14]">
              Core Delay Drivers & Statutory Interventions
            </h3>
          </div>
          <StackedRiskCards />
        </div>

        {/* 7. STATE COMPARISON MATRIX & REAL-TIME ALERTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* State Risk Chart */}
          <div className="lg:col-span-7 bg-[#FFFCF7] rounded-3xl p-6 sm:p-8 border border-[#8C5A3C]/16 shadow-sandal-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#D8C4A8]/60 gap-2 mb-6">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#B65A3C] tracking-wider">
                  Macro State Telemetry
                </span>
                <h3 className="text-lg font-display font-semibold text-[#2B1D14]">
                  Average Delay Probability by State
                </h3>
              </div>
              <Link to="/state-analysis" className="text-xs font-semibold text-[#B65A3C] hover:underline flex items-center gap-1">
                <span>Detailed State Dossiers</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stateChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EFE5D3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#8C5A3C' }} tickLine={false} axisLine={{ stroke: '#D8C4A8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#8C5A3C' }} tickLine={false} axisLine={{ stroke: '#D8C4A8' }} domain={[0, 100]} unit="%" />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#FFFCF7] p-3 rounded-xl border border-[#D8C4A8] shadow-sandal text-xs">
                            <span className="font-bold text-[#2B1D14] block">{data.name}</span>
                            <span className="text-[#A9473B] font-semibold mt-1 block">Delay Probability: {data.risk}%</span>
                            <span className="text-[#5A3424] text-[11px] block">{data.critical} Critical • {data.high} High Risk</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="risk" fill="#B65A3C" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Real-time Radar Alerts Feed */}
          <div className="lg:col-span-5 bg-[#FFFCF7] rounded-3xl p-6 sm:p-8 border border-[#8C5A3C]/16 shadow-sandal-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#D8C4A8]/60 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#A9473B] animate-ping" />
                  <h3 className="text-lg font-display font-semibold text-[#2B1D14]">
                    Active Radar Signals
                  </h3>
                </div>
                <Link to="/alerts" className="text-xs font-semibold text-[#B65A3C] hover:underline">
                  View All ({ALERTS_DATA.length})
                </Link>
              </div>

              <div className="space-y-3">
                {ALERTS_DATA.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3.5 rounded-2xl bg-[#F7F3EA] border border-[#D8C4A8] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-[#FAECEC] text-[#A9473B] border border-[#F3BEBF]">
                        {alert.severity}
                      </span>
                      <span className="text-[10px] font-mono text-[#8C5A3C]">{alert.timestamp}</span>
                    </div>
                    <h4 className="text-xs font-bold text-[#2B1D14] leading-snug">{alert.title}</h4>
                    <p className="text-[11px] text-[#5A3424] line-clamp-1">{alert.location}</p>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to="/alerts"
              className="mt-4 w-full py-2.5 rounded-2xl bg-[#5A3424] text-[#F7F3EA] text-xs font-semibold text-center hover:bg-[#43261A] transition-all flex items-center justify-center gap-1.5 shadow-sandal"
            >
              <span>Review Radar Protocols</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D28B75]" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};
