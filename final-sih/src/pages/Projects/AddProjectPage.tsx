import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  MapPin, 
  Layers, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Building,
  Ruler
} from 'lucide-react';
import { projectService } from '../../services/projectService';
import { STATES_DATA } from '../../data/states';
import { DemoBanner } from '../../components/ui/DemoBanner';

export const AddProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    sector: 'Highway Corridor' as any,
    state: 'Tamil Nadu',
    district: 'Madurai',
    lengthKm: 45,
    budgetCr: 1500,
    totalParcels: 220,
    lat: 9.9252,
    lng: 78.1198,
    summary: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = projectService.createProject({
      name: formData.name || 'New Greenfield Expressway Link',
      code: formData.code || `NHAI-GOV-${Math.floor(100 + Math.random() * 900)}`,
      sector: formData.sector,
      state: formData.state,
      district: formData.district,
      lengthKm: Number(formData.lengthKm),
      budgetCr: Number(formData.budgetCr),
      totalParcels: Number(formData.totalParcels),
      coordinates: [Number(formData.lat), Number(formData.lng)],
      summary: formData.summary || 'Strategic corridor registered for automated delay forecasting.',
    });
    setSubmitted(true);
    setTimeout(() => {
      navigate(`/projects/${created.id}`);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-ivory text-earth-900 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <DemoBanner />

      {/* Back button */}
      <div className="mt-6 mb-6">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-earth-600 hover:text-earth-950 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Project Directory</span>
        </Link>
      </div>

      <div className="bg-ivory rounded-3xl p-6 sm:p-8 border border-sandal-300 shadow-sandal">
        <div className="mb-6 pb-4 border-b border-sandal-200">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-terracotta-700 bg-terracotta-100 px-3 py-1 rounded-full border border-terracotta-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Corridor Onboarding Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-semibold text-earth-950">
            Register New Acquisition Alignment
          </h1>
          <p className="text-xs text-earth-600 mt-1">
            Initiate spatial cadastral tracking and automated predictive friction scoring for new capital alignments.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 text-center bg-olive-50 rounded-2xl border border-olive-200">
            <CheckCircle2 className="w-12 h-12 text-olive-600 mx-auto mb-3" />
            <h3 className="text-xl font-display font-semibold text-earth-950">Corridor Alignment Registered!</h3>
            <p className="text-xs text-earth-600 mt-1">Computing machine-learned risk index and building cadastral baseline...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-earth-800 uppercase block mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Madurai–Thoothukudi Greenfield Freight Spur"
                  className="w-full bg-cream-light border border-sandal-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-earth-950 focus:outline-none focus:ring-2 focus:ring-earth-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-earth-800 uppercase block mb-1">Sector</label>
                <select
                  value={formData.sector}
                  onChange={e => setFormData({ ...formData, sector: e.target.value as any })}
                  className="w-full bg-cream-light border border-sandal-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-earth-950 focus:outline-none"
                >
                  <option value="Highway Corridor">Highway Corridor</option>
                  <option value="High-Speed Rail">High-Speed Rail</option>
                  <option value="Industrial Park">Industrial Park</option>
                  <option value="Urban Transit">Urban Transit</option>
                  <option value="Renewable Energy">Renewable Energy</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-earth-800 uppercase block mb-1">State</label>
                <select
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-cream-light border border-sandal-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-earth-950 focus:outline-none"
                >
                  {STATES_DATA.map(s => (
                    <option key={s.code} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-earth-800 uppercase block mb-1">District</label>
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={e => setFormData({ ...formData, district: e.target.value })}
                  placeholder="e.g. Madurai, Pune, Varanasi"
                  className="w-full bg-cream-light border border-sandal-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-earth-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-earth-800 uppercase block mb-1">Corridor Length (km)</label>
                <input
                  type="number"
                  required
                  value={formData.lengthKm}
                  onChange={e => setFormData({ ...formData, lengthKm: Number(e.target.value) })}
                  className="w-full bg-cream-light border border-sandal-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-earth-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-earth-800 uppercase block mb-1">Budget (₹ Crore)</label>
                <input
                  type="number"
                  required
                  value={formData.budgetCr}
                  onChange={e => setFormData({ ...formData, budgetCr: Number(e.target.value) })}
                  className="w-full bg-cream-light border border-sandal-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-earth-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-earth-800 uppercase block mb-1">Center Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.lat}
                  onChange={e => setFormData({ ...formData, lat: parseFloat(e.target.value) })}
                  className="w-full bg-cream-light border border-sandal-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-earth-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-earth-800 uppercase block mb-1">Center Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={formData.lng}
                  onChange={e => setFormData({ ...formData, lng: parseFloat(e.target.value) })}
                  className="w-full bg-cream-light border border-sandal-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-earth-950 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-earth-800 uppercase block mb-1">Executive Summary / Alignment Description</label>
              <textarea
                rows={3}
                value={formData.summary}
                onChange={e => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Describe key land tracts, connectivity objectives, and anticipated right-of-way challenges..."
                className="w-full bg-cream-light border border-sandal-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-earth-950 focus:outline-none"
              />
            </div>

            <div className="pt-4 border-t border-sandal-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate('/projects')}
                className="px-5 py-2.5 rounded-xl border border-sandal-300 text-earth-800 text-xs font-semibold hover:bg-sandal-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-earth-900 text-sandal-100 text-xs font-bold shadow-sandal hover:bg-earth-950 flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Initialize Corridor Monitoring</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
