import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  Plus, 
  Printer, 
  Calendar, 
  Shield, 
  Sparkles,
  ChevronRight,
  FileSpreadsheet
} from 'lucide-react';
import { reportService } from '../../services/reportService';
import { RiskBadge } from '../../components/ui/RiskBadge';
import { DemoBanner } from '../../components/ui/DemoBanner';
import { ReportItem } from '../../types';

export const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<ReportItem[]>(reportService.getAllReports());
  const [selectedType, setSelectedType] = useState('All');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<ReportItem['type']>('Executive Brief');

  const filteredReports = selectedType === 'All'
    ? reports
    : reports.filter(r => r.type === selectedType);

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    const created = reportService.generateReport({
      title: newTitle || 'Custom Acquisition Intelligence Brief',
      type: newType,
      state: 'Tamil Nadu',
      district: 'Madurai',
      author: 'Dr. Rajesh Sundaram, IAS',
    });
    setReports([...reportService.getAllReports()]);
    setShowGenerateModal(false);
    setNewTitle('');
  };

  const handleDownloadCSV = () => {
    const headers = ['Report ID', 'Title', 'Type', 'Date', 'State', 'Risk Level', 'Author'];
    const rows = reports.map(r => [r.id, r.title, r.type, r.generatedDate, r.state, r.riskLevel, r.author]);
    reportService.downloadCSV('landlytics_acquisition_risk_reports.csv', headers, rows);
  };

  return (
    <div className="min-h-screen bg-ivory text-earth-900 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <DemoBanner />

      {/* Header */}
      <div className="mt-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest font-bold text-terracotta-700 bg-terracotta-100 px-3 py-1 rounded-full border border-terracotta-300">
            Official Decision Support Documentation
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-semibold text-earth-950 mt-2">
            Intelligence Dossiers & Statutory Reports
          </h1>
          <p className="text-sm text-earth-600 mt-1">
            Generate executive summaries, court litigation briefs, and district risk audits ready for government review.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-ivory text-earth-800 border border-sandal-300 font-semibold text-xs hover:bg-sandal-100 shadow-sandal-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-earth-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowGenerateModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-earth-900 text-sandal-100 font-bold text-xs shadow-sandal hover:bg-earth-950 transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Custom Report</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 mb-8">
        {['All', 'Executive Brief', 'Project Risk Dossier', 'State Intelligence', 'Parcel Audit'].map(type => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
              selectedType === type
                ? 'bg-earth-900 text-sandal-100 border-earth-800 shadow-sandal-sm'
                : 'bg-ivory text-earth-800 border-sandal-300 hover:bg-sandal-100'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Reports List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReports.map(report => (
          <div
            key={report.id}
            onClick={() => navigate(`/reports/${report.id}`)}
            className="bg-ivory rounded-3xl p-6 border border-sandal-300 shadow-sandal-sm hover:shadow-sandal hover:border-sandal-400 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] font-bold text-earth-500 bg-sandal-100 px-2 py-0.5 rounded border border-sandal-200">
                  {report.id}
                </span>
                <RiskBadge level={report.riskLevel} size="sm" />
              </div>

              <h3 className="text-base sm:text-lg font-display font-semibold text-earth-950 mt-1 hover:text-terracotta-700 transition-colors leading-snug">
                {report.title}
              </h3>

              <div className="mt-3 flex items-center gap-3 text-xs text-earth-600">
                <span className="bg-cream-light px-2.5 py-1 rounded-lg border border-sandal-200 font-semibold">
                  {report.type}
                </span>
                <span>{report.state}</span>
                <span>•</span>
                <span>{report.fileSize}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-sandal-200 flex items-center justify-between text-xs text-earth-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-earth-400" />
                {report.generatedDate}
              </span>
              <span className="font-bold text-earth-900 flex items-center gap-1 hover:text-terracotta-600">
                Preview & Print <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Report Generator Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 bg-earth-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-ivory rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-sandal-300 shadow-sandal-xl">
            <h3 className="text-xl font-display font-semibold text-earth-950 mb-1">
              Configure Intelligence Dossier
            </h3>
            <p className="text-xs text-earth-600 mb-6">
              Synthesize latest cadastral updates, judicial stays, and explainable delay scores into a formal brief.
            </p>

            <form onSubmit={handleCreateReport} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-earth-800 uppercase block mb-1">Report Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Madurai South Section 3H(4) Court Escrow Audit"
                  className="w-full bg-cream-light border border-sandal-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-earth-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-earth-800 uppercase block mb-1">Dossier Type</label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value as any)}
                  className="w-full bg-cream-light border border-sandal-300 rounded-xl px-3.5 py-2 text-xs font-semibold text-earth-950 focus:outline-none"
                >
                  <option value="Executive Brief">Executive Brief</option>
                  <option value="Project Risk Dossier">Project Risk Dossier</option>
                  <option value="State Intelligence">State Intelligence</option>
                  <option value="Parcel Audit">Parcel Audit</option>
                  <option value="Court Mitigation Summary">Court Mitigation Summary</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-sandal-200">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="px-4 py-2 rounded-xl border border-sandal-300 text-xs font-semibold text-earth-800 hover:bg-sandal-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-earth-900 text-sandal-100 text-xs font-bold hover:bg-earth-950"
                >
                  Generate Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
