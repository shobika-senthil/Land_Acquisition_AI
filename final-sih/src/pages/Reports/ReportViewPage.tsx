import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  Share2, 
  CheckCircle2, 
  Building, 
  FileText, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';
import { reportService } from '../../services/reportService';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { DemoBanner } from '../../components/ui/DemoBanner';

export const ReportViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const report = reportService.getReportById(id || 'REP-2026-001');

  if (!report) {
    return (
      <div className="min-h-screen bg-ivory pt-24 px-4 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-earth-950">Report Not Found</h2>
        <Link to="/reports" className="mt-4 inline-block px-4 py-2 bg-earth-900 text-sandal-100 text-xs font-bold rounded-xl">
          Return to Reports
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-ivory text-earth-900 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <DemoBanner />

      {/* Action Bar */}
      <div className="mt-6 mb-6 flex items-center justify-between no-print">
        <Link
          to="/reports"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-earth-600 hover:text-earth-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Reports</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-ivory text-earth-800 border border-sandal-300 hover:bg-sandal-100 text-xs font-semibold rounded-xl shadow-sandal-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-earth-900 text-sandal-100 hover:bg-earth-950 text-xs font-bold rounded-xl shadow-sandal"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Document Paper Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-sandal-300 shadow-sandal-lg print:border-none print:shadow-none">
        
        {/* Document Header */}
        <div className="border-b-2 border-earth-900 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase font-bold text-earth-600 tracking-widest block mb-1">
              GOVERNMENT OF INDIA • MINISTRY OF RURAL DEVELOPMENT
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-semibold text-earth-950">
              {report.title}
            </h1>
            <p className="text-xs text-earth-600 mt-1 font-mono">
              Document Ref: {report.id} • Date: {report.generatedDate} • State: {report.state}
            </p>
          </div>
          <RiskBadge level={report.riskLevel} size="md" />
        </div>

        {/* Executive Summary Section */}
        <div className="space-y-6 text-xs text-earth-800 leading-relaxed font-sans">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-earth-950 border-b border-sandal-200 pb-1 mb-2">
              1. Executive Context & Scope
            </h3>
            <p>
              This intelligence dossier provides a synthesized assessment of ongoing right-of-way (RoW) acquisition friction and delay risks across scheduled infrastructure corridors in <strong>{report.state}</strong>. Data was compiled using predictive machine learning algorithms cross-referencing state land registries, civil litigation dockets, and joint measurement surveys.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-earth-950 border-b border-sandal-200 pb-1 mb-2">
              2. Core Delay Drivers & Statistical Impact
            </h3>
            <div className="grid grid-cols-2 gap-3 my-3">
              <div className="bg-sandal-50 p-3 rounded-xl border border-sandal-200">
                <span className="font-bold text-earth-900 block">Joint Heirship Mutation Gaps</span>
                <span className="text-terracotta-700 font-semibold mt-0.5 block">+24% Delay Contribution</span>
                <p className="text-[11px] text-earth-600 mt-1">Multi-generational title fragmentation without recorded succession mutations.</p>
              </div>

              <div className="bg-sandal-50 p-3 rounded-xl border border-sandal-200">
                <span className="font-bold text-earth-900 block">Circle Rate vs Market Valuation</span>
                <span className="text-terracotta-700 font-semibold mt-0.5 block">+18% Delay Contribution</span>
                <p className="text-[11px] text-earth-600 mt-1">Divergence &gt;1.8x triggering High Court civil revision petitions.</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-earth-950 border-b border-sandal-200 pb-1 mb-2">
              3. Statutory Corrective Directives
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 bg-olive-50 p-3 rounded-xl border border-olive-200">
                <CheckCircle2 className="w-4 h-4 text-olive-700 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Section 3H(4) Court Escrow Mandate:</strong> Where multiple heirs dispute fractional shares, deposit determined compensation into the Principal Civil Court escrow account to maintain handover schedules.
                </span>
              </li>
              <li className="flex items-start gap-2 bg-olive-50 p-3 rounded-xl border border-olive-200">
                <CheckCircle2 className="w-4 h-4 text-olive-700 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Special Lok Adalat Pre-Litigation Benches:</strong> Deploy District Legal Services Authority (DLSA) panels for fast-track consent awards prior to formal Section 3D declaration.
                </span>
              </li>
            </ul>
          </div>

          {/* Document Sign-off */}
          <div className="pt-8 border-t border-sandal-200 flex items-center justify-between text-earth-600">
            <div>
              <p className="font-bold text-earth-900">Department of Land Resources (DoLR)</p>
              <p className="text-[11px]">Prepared by: {report.author}</p>
            </div>
            <div className="text-right">
              <span className="font-mono text-[10px] text-earth-400 block">DIGITALLY CERTIFIED</span>
              <span className="text-xs font-semibold text-olive-700">LANDLYTICS Spatial Intelligence</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
