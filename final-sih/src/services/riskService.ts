import { RiskBreakdown, RiskLevel } from '../types';

export const riskService = {
  getRiskLevel(score: number): RiskLevel {
    if (score >= 80) return 'CRITICAL';
    if (score >= 65) return 'HIGH';
    if (score >= 40) return 'MODERATE';
    return 'LOW';
  },

  getRiskBadgeStyles(level: RiskLevel): { bg: string; text: string; border: string; dot: string } {
    switch (level) {
      case 'CRITICAL':
        return {
          bg: 'bg-risk-critical-bg text-risk-critical border-risk-critical-border',
          text: 'text-risk-critical',
          border: 'border-risk-critical',
          dot: 'bg-risk-critical'
        };
      case 'HIGH':
        return {
          bg: 'bg-risk-high-bg text-risk-high border-risk-high-border',
          text: 'text-risk-high',
          border: 'border-risk-high',
          dot: 'bg-risk-high'
        };
      case 'MODERATE':
        return {
          bg: 'bg-risk-moderate-bg text-risk-moderate border-risk-moderate-border',
          text: 'text-risk-moderate',
          border: 'border-risk-moderate',
          dot: 'bg-risk-moderate'
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-risk-low-bg text-risk-low border-risk-low-border',
          text: 'text-risk-low',
          border: 'border-risk-low',
          dot: 'bg-risk-low'
        };
    }
  },

  getRiskFactorsList(breakdown: RiskBreakdown) {
    return [
      { name: 'Ownership Conflict & Mutation', value: breakdown.ownershipConflict, key: 'ownershipConflict', desc: 'Unregistered succession, multi-heir disputation, missing mutation certificates' },
      { name: 'Legal & Judicial Injunctions', value: breakdown.legalComplexity, key: 'legalComplexity', desc: 'Active High Court writ petitions, Stay orders on Section 3D declaration' },
      { name: 'Population Impact & Resettlement', value: breakdown.populationImpact, key: 'populationImpact', desc: 'High density settlements, commercial displacement, R&R rehabilitation load' },
      { name: 'Compensation Disparity vs Market', value: breakdown.compensationDispute, key: 'compensationDispute', desc: 'Circle rate vs registered market deed variance (>1.8x threshold)' },
      { name: 'Documentation & Bhoomi Gaps', value: breakdown.documentationGap, key: 'documentationGap', desc: 'Discrepancy between physical Record of Rights and GIS digitised cadastre' },
    ];
  }
};
