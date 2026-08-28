import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  Sliders, 
  Activity, 
  Database, 
  Server, 
  CheckCircle2, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { DemoBanner } from '../../components/ui/DemoBanner';
import { UserRole } from '../../types';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'pipeline' | 'audit'>('users');

  const usersList: { name: string; email: string; role: UserRole; dept: string; status: string }[] = [
    { name: 'Dr. Rajesh Sundaram, IAS', email: 'rajesh.sundaram@dolr.gov.in', role: 'Administrator', dept: 'DoLR Central', status: 'Active' },
    { name: 'S. Vijayalakshmi', email: 'vijayalakshmi.s@tnhighways.gov.in', role: 'Project Officer', dept: 'NHAI Tamil Nadu', status: 'Active' },
    { name: 'Anand Kulkarni', email: 'anand.k@msrdc.gov.in', role: 'State Officer', dept: 'MSRDC Maharashtra', status: 'Active' },
    { name: 'R. K. Srivastava', email: 'srivastava.rk@upcala.gov.in', role: 'District Officer', dept: 'CALA Varanasi', status: 'Active' },
    { name: 'Priya Sharma', email: 'priya.sharma@niti.gov.in', role: 'Analyst', dept: 'NITI Aayog Land Cell', status: 'Active' },
  ];

  return (
    <div className="min-h-screen bg-ivory text-earth-900 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <DemoBanner />

      {/* Header */}
      <div className="mt-6 mb-8">
        <span className="text-xs font-mono uppercase tracking-widest font-bold text-terracotta-700 bg-terracotta-100 px-3 py-1 rounded-full border border-terracotta-300">
          Governance & Administration
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-semibold text-earth-950 mt-2">
          System Administration & Pipeline Health
        </h1>
        <p className="text-sm text-earth-600 mt-1">
          Manage officer roles, monitor ML model drift, and inspect GIS tile cache health.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-sandal-300 pb-3 mb-8">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'users' ? 'bg-earth-900 text-sandal-100' : 'text-earth-700 hover:bg-sandal-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Access Control</span>
        </button>

        <button
          onClick={() => setActiveTab('pipeline')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'pipeline' ? 'bg-earth-900 text-sandal-100' : 'text-earth-700 hover:bg-sandal-100'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Model & GIS Telemetry</span>
        </button>
      </div>

      {/* Tab: Users */}
      {activeTab === 'users' && (
        <div className="bg-ivory rounded-3xl p-6 border border-sandal-300 shadow-sandal">
          <h3 className="font-display font-semibold text-lg text-earth-950 mb-4">
            Authorized Personnel & Role Mapping
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sandal-200 text-earth-500 font-bold uppercase tracking-wider">
                  <th className="pb-3">Officer Name</th>
                  <th className="pb-3">Official Email</th>
                  <th className="pb-3">Assigned Persona Role</th>
                  <th className="pb-3">Department</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sandal-200">
                {usersList.map((u, i) => (
                  <tr key={i} className="hover:bg-sandal-50">
                    <td className="py-3.5 font-bold text-earth-950">{u.name}</td>
                    <td className="py-3.5 text-earth-600 font-mono">{u.email}</td>
                    <td className="py-3.5">
                      <span className="font-semibold text-earth-900 bg-cream-light px-2.5 py-1 rounded-lg border border-sandal-200">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 text-earth-700">{u.dept}</td>
                    <td className="py-3.5 text-right">
                      <span className="inline-flex items-center gap-1 text-olive-700 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-olive-500" /> {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Pipeline */}
      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-ivory rounded-3xl p-6 border border-sandal-300 shadow-sandal">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-earth-600 uppercase">ML Prediction Engine</span>
              <CheckCircle2 className="w-4 h-4 text-olive-600" />
            </div>
            <div className="text-2xl font-black text-earth-950">Active (v2.4.1)</div>
            <p className="text-xs text-earth-600 mt-2">Latency: 18ms • F1-Score: 0.942 on test cadastre.</p>
          </div>

          <div className="bg-ivory rounded-3xl p-6 border border-sandal-300 shadow-sandal">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-earth-600 uppercase">GIS Vector Tile Server</span>
              <CheckCircle2 className="w-4 h-4 text-olive-600" />
            </div>
            <div className="text-2xl font-black text-earth-950">Healthy</div>
            <p className="text-xs text-earth-600 mt-2">Warm Carto CDN • 99.98% Uptime.</p>
          </div>

          <div className="bg-ivory rounded-3xl p-6 border border-sandal-300 shadow-sandal">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-earth-600 uppercase">State Registry Ingestion</span>
              <CheckCircle2 className="w-4 h-4 text-olive-600" />
            </div>
            <div className="text-2xl font-black text-earth-950">Synced</div>
            <p className="text-xs text-earth-600 mt-2">TamilNilam & Mahabhulekh API active.</p>
          </div>
        </div>
      )}

    </div>
  );
};
