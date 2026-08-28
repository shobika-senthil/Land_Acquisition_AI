import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Scale, 
  Layers, 
  CheckCircle2, 
  FileText, 
  ArrowRight,
  Compass,
  Zap,
  Building
} from 'lucide-react';
import { AI_INSIGHTS_DATA } from '../../data/insights';
import { DemoBanner } from '../../components/ui/DemoBanner';

export const AIInsightsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredInsights = selectedCategory === 'All'
    ? AI_INSIGHTS_DATA
    : AI_INSIGHTS_DATA.filter(ins => ins.category === selectedCategory);

  return (
    <div className="min-h-screen bg-ivory text-earth-900 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <DemoBanner />

      {/* Header */}
      <div className="mt-6 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest font-bold text-terracotta-700 bg-terracotta-100 px-3 py-1 rounded-full border border-terracotta-300">
            Explainable AI & Predictive Research
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-semibold text-earth-950 mt-2">
            Predictive Delay Drivers & Empirical Findings
          </h1>
          <p className="text-sm text-earth-600 mt-1">
            Machine learning insights extracted from 18,400+ historical land acquisition proceedings across India.
          </p>
        </div>

        <Link
          to="/reports"
          className="self-start md:self-auto flex items-center gap-1.5 px-4 py-2 bg-earth-900 text-sandal-100 text-xs font-bold rounded-xl shadow-sandal hover:bg-earth-950"
        >
          <FileText className="w-4 h-4 text-terracotta-400" />
          <span>Export Research Brief</span>
        </Link>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 mb-8">
        {['All', 'Ownership', 'Cost-Delay Correlation', 'Spatial Pattern'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
              selectedCategory === cat
                ? 'bg-earth-900 text-sandal-100 border-earth-800 shadow-sandal-sm'
                : 'bg-ivory text-earth-800 border-sandal-300 hover:bg-sandal-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Insights Editorial Cards */}
      <div className="space-y-6">
        {filteredInsights.map(insight => (
          <div
            key={insight.id}
            className="bg-ivory rounded-3xl p-6 sm:p-8 border border-sandal-300 shadow-sandal-sm hover:shadow-sandal transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-terracotta-700 bg-terracotta-100 px-2.5 py-0.5 rounded border border-terracotta-300 uppercase">
                  {insight.category}
                </span>
                <span className="text-xs text-earth-500 font-mono">
                  Confidence Score: {insight.confidenceScore}%
                </span>
              </div>

              <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                insight.impactLevel === 'CRITICAL'
                  ? 'bg-risk-critical-bg text-risk-critical border border-risk-critical-border'
                  : 'bg-terracotta-100 text-terracotta-800 border border-terracotta-300'
              }`}>
                {insight.impactLevel} IMPACT
              </span>
            </div>

            <h2 className="text-2xl font-display font-semibold text-earth-950 mb-3 leading-snug">
              {insight.title}
            </h2>

            <p className="text-sm text-earth-700 leading-relaxed max-w-4xl mb-6">
              {insight.summary}
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6 border-t border-sandal-200">
              
              {/* Empirical Findings */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-earth-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-terracotta-600" />
                  Key Empirical Findings
                </h4>
                <ul className="space-y-2 text-xs text-earth-700">
                  {insight.findings.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 bg-cream-light p-3 rounded-xl border border-sandal-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500 mt-1.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Policy & Administrative Interventions */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-earth-900 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-olive-600" />
                  Recommended Operational Directives
                </h4>
                <ul className="space-y-2 text-xs text-earth-800">
                  {insight.recommendedActions.map((act, i) => (
                    <li key={i} className="flex items-start gap-2 bg-olive-50/70 p-3 rounded-xl border border-olive-200">
                      <CheckCircle2 className="w-4 h-4 text-olive-600 mt-0.5 flex-shrink-0" />
                      <span className="font-medium">{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            <div className="mt-6 pt-4 border-t border-sandal-200 flex items-center justify-between text-xs text-earth-600">
              <span>Impacts <strong>{insight.affectedProjectsCount} Monitored Corridors</strong></span>
              <span>Potential Capital Salvage: <strong>₹{insight.estimatedCostImpactCr.toLocaleString()} Cr</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
