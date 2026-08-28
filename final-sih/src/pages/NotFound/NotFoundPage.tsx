import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight, MapPin } from 'lucide-react';
import { DemoBanner } from '../../components/ui/DemoBanner';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-ivory text-earth-900 py-8 px-4 text-center flex flex-col items-center justify-center">
      <DemoBanner />

      <div className="max-w-md bg-ivory rounded-3xl p-8 border border-sandal-300 shadow-sandal-lg">
        <div className="w-16 h-16 rounded-2xl bg-terracotta-100 text-terracotta-700 flex items-center justify-center mx-auto mb-4">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>

        <span className="text-xs font-mono font-bold text-terracotta-700 uppercase tracking-widest">
          404 • Coordinate Unmapped
        </span>
        <h1 className="text-3xl font-display font-semibold text-earth-950 mt-2">
          Cadastral Boundary Not Found
        </h1>
        <p className="text-xs text-earth-600 mt-2 leading-relaxed">
          The requested route or geospatial identifier does not exist in the active survey registry.
        </p>

        <div className="mt-6 flex flex-col gap-2">
          <Link
            to="/gis-risk-map"
            className="w-full py-2.5 bg-earth-900 text-sandal-100 text-xs font-bold rounded-xl shadow-sandal hover:bg-earth-950 flex items-center justify-center gap-1.5"
          >
            <Compass className="w-4 h-4 text-terracotta-400" />
            <span>Return to GIS Risk Map</span>
          </Link>
          <Link
            to="/"
            className="w-full py-2.5 bg-cream-light text-earth-800 border border-sandal-300 text-xs font-semibold rounded-xl hover:bg-sandal-100"
          >
            Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
};
