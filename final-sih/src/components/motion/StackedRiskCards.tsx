import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Users, Scale, Coins, Home, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StackedRiskCards: React.FC = () => {
  const cards = [
    {
      id: '01',
      title: 'Ownership Lineage & Mutation Conflict',
      subtitle: 'Cadastral Discrepancy Detection',
      icon: Users,
      color: '#B65A3C',
      description: 'Identifies untraceable heirs, partition disputes, and Bhoomi RTC ledger mismatches before Section 3A gazette notification.',
      metric: '38% of total delay root causes',
      badge: 'Ownership Signal',
    },
    {
      id: '02',
      title: 'Judicial Injunction & Civil Revision',
      subtitle: 'Litigation Stay Risk Index',
      icon: Scale,
      color: '#A9473B',
      description: 'Tracks court filings, stay orders, and Section 3D injunctions, automatically recommending Section 3H(4) court escrow deposits.',
      metric: 'Average +140 days stay mitigation',
      badge: 'Statutory Directives',
    },
    {
      id: '03',
      title: 'Circle Rate vs Market Valuation Gap',
      subtitle: 'Compensation Friction Prediction',
      icon: Coins,
      color: '#8C5A3C',
      description: 'Analyzes commercial registration data vs official circle rates to predict landholder resistance and calculate accurate solatium.',
      metric: '2.4x median valuation variance',
      badge: 'Solatium Optimization',
    },
    {
      id: '04',
      title: 'Rehabilitation & Resettlement Load',
      subtitle: 'Socio-Economic Displacement Risk',
      icon: Home,
      color: '#70784D',
      description: 'Predicts alternate dwelling timeline bottlenecks, vulnerable household clusters, and public hearing sentiment friction.',
      metric: '92% R&R compliance forecast',
      badge: 'Socio-Spatial Intelligence',
    },
  ];

  return (
    <div className="w-full space-y-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -4 }}
            className="group relative bg-[#FFFCF7] rounded-3xl p-6 sm:p-8 border border-[#8C5A3C]/16 shadow-sandal-sm hover:shadow-sandal transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8C4A8]/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F7F3EA] border border-[#D8C4A8] flex items-center justify-center text-[#5A3424]">
                  <Icon className="w-5 h-5 text-[#B65A3C]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#B65A3C]">
                      {card.id} • {card.badge}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-display font-semibold text-[#2B1D14] leading-snug">
                    {card.title}
                  </h3>
                </div>
              </div>

              <span className="self-start sm:self-auto text-xs font-mono font-semibold text-[#5A3424] bg-[#EFE5D3] px-3 py-1 rounded-full border border-[#D8C4A8]/80">
                {card.metric}
              </span>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs sm:text-sm text-[#5A3424] leading-relaxed max-w-2xl font-normal">
                {card.description}
              </p>

              <Link
                to="/ai-insights"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B65A3C] hover:text-[#5A3424] transition-colors whitespace-nowrap"
              >
                <span>Explore Driver</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
