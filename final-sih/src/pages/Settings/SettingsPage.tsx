import React, { useState } from 'react';
import { User, Shield, Bell, Save, Sparkles, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService';
import { DemoBanner } from '../../components/ui/DemoBanner';

export const SettingsPage: React.FC = () => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [saved, setSaved] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-ivory text-earth-900 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <DemoBanner />

      <div className="mt-6 mb-8">
        <span className="text-xs font-mono uppercase tracking-widest font-bold text-terracotta-700 bg-terracotta-100 px-3 py-1 rounded-full border border-terracotta-300">
          Preferences & Configuration
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-semibold text-earth-950 mt-2">
          User Settings & Radar Thresholds
        </h1>
      </div>

      <div className="bg-ivory rounded-3xl p-6 sm:p-8 border border-sandal-300 shadow-sandal">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-base font-display font-semibold text-earth-950 border-b border-sandal-200 pb-2">
              Officer Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-earth-800 uppercase block mb-1">Full Name</label>
                <input
                  type="text"
                  defaultValue={user?.name}
                  className="w-full bg-cream-light border border-sandal-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-earth-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-earth-800 uppercase block mb-1">Official Email</label>
                <input
                  type="email"
                  defaultValue={user?.email}
                  disabled
                  className="w-full bg-sandal-100 border border-sandal-300 rounded-xl px-3.5 py-2.5 text-xs font-mono text-earth-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-earth-800 uppercase block mb-1">Department</label>
                <input
                  type="text"
                  defaultValue={user?.department}
                  className="w-full bg-cream-light border border-sandal-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-earth-950 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-earth-800 uppercase block mb-1">Assigned Persona Role</label>
                <input
                  type="text"
                  defaultValue={user?.role}
                  disabled
                  className="w-full bg-sandal-100 border border-sandal-300 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-earth-600 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-sandal-200">
            <h3 className="text-base font-display font-semibold text-earth-950 border-b border-sandal-200 pb-2">
              Radar Alert Thresholds
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-cream-light border border-sandal-200 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-earth-900 block">Critical Risk Alerts (&gt;80)</span>
                  <span className="text-[11px] text-earth-600">Immediate popup notification upon court stay or mutation dispute.</span>
                </div>
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={e => setNotificationsEnabled(e.target.checked)}
                  className="w-4 h-4 text-terracotta-600 rounded"
                />
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-sandal-200 flex items-center justify-between">
            {saved ? (
              <span className="text-xs font-bold text-olive-700 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Preferences saved successfully
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-6 py-2.5 bg-earth-900 text-sandal-100 text-xs font-bold rounded-xl shadow-sandal hover:bg-earth-950 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
