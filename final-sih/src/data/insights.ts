import { AIInsight } from '../types';

export const AI_INSIGHTS_DATA: AIInsight[] = [
  {
    id: 'INS-01',
    category: 'Ownership',
    title: 'Joint Heirship Succession: The #1 Hidden Driver of Acquisition Overruns',
    impactLevel: 'CRITICAL',
    confidenceScore: 94.2,
    summary: 'Machine learning analysis across 18,400 completed and active acquisition proceedings reveals that parcels with >5 co-owners experience an average delay of 9.4 months compared to sole-owner parcels.',
    findings: [
      'In Tamil Nadu and Maharashtra, 68% of delayed corridors originate from un-mutated ancestral successions dating back >15 years.',
      'Notice issuance under Section 3C fails in 41% of cases due to untraceable non-resident joint title holders.',
      'Escrow deposits under Section 3H(4) reduce average handover delay by 142 days when implemented before Section 3D.',
    ],
    recommendedActions: [
      'Trigger automated AI cross-referencing between State Land Records (TamilNilam/Mahabhulekh) and Death & Succession Registries 90 days before Section 3A notification.',
      'Deploy Special Gram Sabha Succession Camps in high-risk taluks.',
      'Standardize pre-litigation escrow indemnity bonds for uncontested heirs.',
    ],
    affectedProjectsCount: 14,
    estimatedCostImpactCr: 3820,
  },
  {
    id: 'INS-02',
    category: 'Cost-Delay Correlation',
    title: 'Circle Rate Discrepancy vs Market Valuation Threshold (>1.8x)',
    impactLevel: 'HIGH',
    confidenceScore: 91.8,
    summary: 'When local market real estate prices exceed official government circle rates by more than 1.8x, the probability of High Court writ litigation spikes from 12% to 77%.',
    findings: [
      'Corridors intersecting peri-urban outskirts of Tier-2 cities (Madurai, Varanasi, Pune) exhibit the highest valuation divergence.',
      'Average litigation lifespan in District Reference Courts is 22 months when circle rates are not revised within the preceding 24 months.',
    ],
    recommendedActions: [
      'Adopt dynamic AI-assisted market valuation indexing using recent registered transaction averages within a 3km radius.',
      'Incorporate structured solatium incentive multipliers for consent awards.',
    ],
    affectedProjectsCount: 19,
    estimatedCostImpactCr: 5100,
  },
  {
    id: 'INS-03',
    category: 'Spatial Pattern',
    title: 'Irrigation & Drainage Canal Proximity Risk Clustering',
    impactLevel: 'HIGH',
    confidenceScore: 88.5,
    summary: 'Parcels located within 250 meters of state irrigation distributaries face a 3.4x higher rate of environmental stay orders and agrarian union resistance.',
    findings: [
      'Water body classification ambiguities in British-era survey maps cause 32% of survey boundary re-hearings in southern states.',
      'Underground irrigation siphon relocations are frequently omitted in initial DPR (Detailed Project Reports).',
    ],
    recommendedActions: [
      'Enforce mandatory dual GIS overlay with State Water Resources Department cadastral maps prior to alignment finalization.',
      'Pre-approve canal culvert modification plans during the preliminary survey phase.',
    ],
    affectedProjectsCount: 8,
    estimatedCostImpactCr: 1240,
  },
];
