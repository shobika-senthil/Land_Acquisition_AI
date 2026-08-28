import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Scale, 
  Users, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Compass, 
  Zap, 
  Download,
  Building,
  LandPlot
} from 'lucide-react';
import { parcelService } from '../../services/parcelService';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { RiskScore } from '../../components/ui/RiskScore';
import { DemoBanner } from '../../components/ui/DemoBanner';

export const ParcelDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const parcel = parcelService.getParcelById(id || 'PL-2048');

  if (!parcel) {
    return (
      <div className="min-h-screen bg-ivory pt-24 px-4 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-earth-950">Parcel Not Found</h2>
        <p className="text-xs text-earth-600 mt-2">The requested cadastral plot ID was not found.</p>
        <Link to="/gis-risk-map" className="mt-4 inline-block px-4 py-2 bg-earth-900 text-sandal-100 text-xs font-bold rounded-xl">
          Return to GIS Map
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory text-earth-900 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <DemoBanner />

      {/* Back button */}
      <div className="mt-6 mb-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-earth-600 hover:text-earth-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <Link
          to="/gis-risk-map"
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-earth-900 text-sandal-100 hover:bg-earth-950 text-xs font-bold rounded-xl shadow-sandal"
        >
          <Compass className="w-3.5 h-3.5 text-terracotta-400" />
          <span>Locate on Map</span>
        </Link>
      </div>

      {/* Main Header Card */}
      <div className="bg-ivory rounded-3xl p-6 sm:p-8 border border-sandal-300 shadow-sandal mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold text-terracotta-700 bg-terracotta-100 px-2.5 py-0.5 rounded border border-terracotta-300 uppercase">
                Cadastral Survey Record
              </span>
              <span className="text-xs text-earth-500 font-mono">
                {parcel.coordinates[0].toFixed(4)}° N, {parcel.coordinates[1].toFixed(4)}° E
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-display font-semibold text-earth-950">
              Plot {parcel.plotId} ({parcel.surveyNumber})
            </h1>

            <p className="text-xs sm:text-sm text-earth-600 mt-1 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-terracotta-600" />
              <span>{parcel.village}, {parcel.taluk}, {parcel.district}, {parcel.state}</span>
            </p>
          </div>

          <RiskScore score={parcel.riskScore} size="lg" />
        </div>
      </div>

      {/* 2. SPECIFICATION ATTRIBUTES GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-ivory p-4 rounded-2xl border border-sandal-300 shadow-sandal-sm">
          <span className="text-[10px] uppercase font-bold text-earth-500">Total Land Area</span>
          <p className="text-2xl font-extrabold text-earth-950 mt-1">{parcel.areaAcres} <span className="text-xs font-normal">Acres</span></p>
          <span className="text-xs text-earth-600 font-medium">{parcel.landUse} Zone</span>
        </div>

        <div className="bg-ivory p-4 rounded-2xl border border-sandal-300 shadow-sandal-sm">
          <span className="text-[10px] uppercase font-bold text-earth-500">Ownership Title</span>
          <p className="text-2xl font-extrabold text-earth-950 mt-1">{parcel.ownershipType}</p>
          <span className="text-xs text-terracotta-700 font-semibold">{parcel.ownerCount} Recorded Heirs</span>
        </div>

        <div className="bg-ivory p-4 rounded-2xl border border-risk-critical-border shadow-sandal-sm">
          <span className="text-[10px] uppercase font-bold text-risk-critical">Active Court Suits</span>
          <p className="text-2xl font-extrabold text-risk-critical mt-1">{parcel.legalDisputeCount} Suits</p>
          <span className="text-xs text-risk-critical font-medium">District & High Court</span>
        </div>

        <div className="bg-ivory p-4 rounded-2xl border border-sandal-300 shadow-sandal-sm">
          <span className="text-[10px] uppercase font-bold text-earth-500">Pending Compensation</span>
          <p className="text-2xl font-extrabold text-earth-950 mt-1">₹{parcel.pendingCompensationLakhs} <span className="text-xs font-normal">Lakh</span></p>
          <span className="text-xs text-earth-600 font-medium">Escrow Eligible</span>
        </div>
      </div>

      {/* 3. EXPLAINABLE AI FACTOR BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* Left: Explainable AI "Why is this parcel risky?" */}
        <div className="lg:col-span-7 bg-ivory rounded-3xl p-6 border border-sandal-300 shadow-sandal">
          <div className="mb-4 pb-3 border-b border-sandal-200">
            <span className="text-[10px] font-mono uppercase font-bold text-terracotta-700 tracking-wider">
              Explainable AI (XAI)
            </span>
            <h3 className="font-display font-semibold text-xl text-earth-950 mt-0.5">
              Why is this parcel risky?
            </h3>
          </div>

          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-cream-light border border-sandal-200">
              <div className="flex justify-between items-center text-xs font-bold text-earth-950 mb-1">
                <span>1. Ownership Conflict & Mutation Lineage</span>
                <span className="font-mono text-risk-critical font-bold">+{parcel.riskBreakdown.ownershipConflict} pts</span>
              </div>
              <p className="text-[11px] text-earth-600 leading-relaxed">
                7 recorded co-heirs with 3 untraceable non-resident title holders in Avaniyapuram Taluk registry.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-cream-light border border-sandal-200">
              <div className="flex justify-between items-center text-xs font-bold text-earth-950 mb-1">
                <span>2. Legal Injunction & Civil Revision Petition</span>
                <span className="font-mono text-risk-critical font-bold">+{parcel.riskBreakdown.legalComplexity} pts</span>
              </div>
              <p className="text-[11px] text-earth-600 leading-relaxed">
                Interim stay granted on Section 3D declaration by Madurai Sub-Court pending succession certificates.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-cream-light border border-sandal-200">
              <div className="flex justify-between items-center text-xs font-bold text-earth-950 mb-1">
                <span>3. Population & Resettlement Load</span>
                <span className="font-mono text-terracotta-700 font-bold">+{parcel.riskBreakdown.populationImpact} pts</span>
              </div>
              <p className="text-[11px] text-earth-600 leading-relaxed">
                {parcel.rrRequiredHouseholds} agricultural households requiring alternate dwelling site rehabilitation.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-cream-light border border-sandal-200">
              <div className="flex justify-between items-center text-xs font-bold text-earth-950 mb-1">
                <span>4. Compensation Circle Rate Disparity</span>
                <span className="font-mono text-sand-700 font-bold">+{parcel.riskBreakdown.compensationDispute} pts</span>
              </div>
              <p className="text-[11px] text-earth-600 leading-relaxed">
                Official circle rate (₹18L/acre) vs registered commercial transaction average (₹38L/acre) is 2.1x divergent.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Recommended Corrective Directives */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-earth-900 text-sandal-100 rounded-3xl p-6 border border-earth-800 shadow-sandal">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-terracotta-400" />
              <span className="text-xs font-mono uppercase font-bold text-terracotta-400">
                Recommended Action Directives
              </span>
            </div>

            <p className="text-sm text-sandal-100 font-medium leading-relaxed mb-4">
              {parcel.recommendedAction}
            </p>

            <div className="space-y-2 pt-3 border-t border-earth-800 text-xs">
              <div className="flex items-center gap-2 text-sandal-300">
                <CheckCircle2 className="w-4 h-4 text-olive-400 flex-shrink-0" />
                <span>Statutory compliance under Section 3H(4)</span>
              </div>
              <div className="flex items-center gap-2 text-sandal-300">
                <CheckCircle2 className="w-4 h-4 text-olive-400 flex-shrink-0" />
                <span>Escrow deposit bypasses civil court stay</span>
              </div>
              <div className="flex items-center gap-2 text-sandal-300">
                <CheckCircle2 className="w-4 h-4 text-olive-400 flex-shrink-0" />
                <span>Estimated time saved: 140+ Days</span>
              </div>
            </div>
          </div>

          <div className="bg-ivory rounded-3xl p-6 border border-sandal-300 shadow-sandal-sm">
            <h4 className="font-display font-semibold text-base text-earth-950 mb-2">
              Associated Infrastructure Project
            </h4>
            <p className="text-xs text-earth-700 font-medium">
              {parcel.projectName || 'Chennai–Madurai Infrastructure Corridor (NH-38 Expansion)'}
            </p>
            <Link
              to={`/projects/${parcel.projectId || 'proj-chennai-madurai'}`}
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-terracotta-700 hover:text-terracotta-900"
            >
              <span>View Full Corridor Timeline</span>
              <span>→</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
