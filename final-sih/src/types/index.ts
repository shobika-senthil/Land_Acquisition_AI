export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type UserRole = 
  | 'Administrator'
  | 'Project Officer'
  | 'State Officer'
  | 'District Officer'
  | 'Analyst'
  | 'Viewer';

export interface RiskBreakdown {
  ownershipConflict: number;   // e.g. 24
  legalComplexity: number;     // e.g. 18
  populationImpact: number;    // e.g. 15
  compensationDispute: number; // e.g. 11
  documentationGap: number;    // e.g. 6
  environmentalClearance?: number;
  rehabilitationDelay?: number;
}

export type TimelinePhaseStatus = 'COMPLETED' | 'IN_PROGRESS' | 'AT_RISK' | 'DELAYED' | 'UPCOMING';

export interface TimelinePhase {
  id: string;
  name: string;
  stageNumber: number;
  status: TimelinePhaseStatus;
  scheduledEnd: string;
  forecastEnd: string;
  delayDays: number;
  bottleneckReason?: string;
}

export interface Parcel {
  id: string;
  plotId: string;
  surveyNumber: string;
  state: string;
  district: string;
  taluk: string;
  village: string;
  projectId?: string;
  projectName?: string;
  areaAcres: number;
  landUse: 'Agricultural' | 'Built-up' | 'Vacant' | 'Forest/Public' | 'Commercial' | 'Water Body';
  ownershipType: 'Private' | 'Government' | 'Public Trust' | 'Joint' | 'Disputed';
  ownerCount: number;
  riskScore: number;
  riskLevel: RiskLevel;
  delayProbability: number;
  riskBreakdown: RiskBreakdown;
  legalDisputeCount: number;
  pendingCompensationLakhs: number;
  rrRequiredHouseholds: number;
  possessionStatus: 'Pending' | 'In Progress' | 'Cleared' | 'Litigated';
  recommendedAction: string;
  coordinates: [number, number]; // [lat, lng]
  boundaryPolygon?: [number, number][];
}

export interface Project {
  id: string;
  name: string;
  code: string;
  sector: 'Highway Corridor' | 'High-Speed Rail' | 'Industrial Park' | 'Renewable Energy' | 'Water Canal' | 'Urban Transit';
  state: string;
  district: string;
  lengthKm: number;
  totalParcels: number;
  acquiredParcels: number;
  riskScore: number;
  delayProbability: number;
  riskLevel: RiskLevel;
  status: 'Pre-Acquisition' | 'Surveying' | 'Disbursement' | 'Possession' | 'Delayed' | 'On Track' | 'In Progress';
  estimatedDelayMonths: number;
  budgetCr: number;
  startDate: string;
  targetCompletion: string;
  topDelayDriver: string;
  coordinates: [number, number];
  corridorPath: [number, number][];
  timeline: TimelinePhase[];
  affectedParcelsCount: number;
  criticalParcelsCount: number;
  summary: string;
}

export interface StateData {
  code: string;
  name: string;
  totalProjects: number;
  highRiskProjects: number;
  criticalProjects: number;
  averageDelayProbability: number;
  activeParcels: number;
  budgetAtRiskCr: number;
  coordinates: [number, number];
  zoomLevel: number;
  districtsCount: number;
}

export interface DistrictData {
  id: string;
  name: string;
  stateCode: string;
  stateName: string;
  projectCount: number;
  criticalParcels: number;
  delayRiskScore: number;
  riskLevel: RiskLevel;
  averageDelayProbability: number;
  coordinates: [number, number];
  primaryVulnerability: string;
}

export interface Alert {
  id: string;
  severity: RiskLevel;
  title: string;
  project: string;
  projectId: string;
  location: string;
  parcelId?: string;
  riskScore: number;
  timestamp: string;
  reason: string;
  actionRecommendation: string;
  expectedImpact: 'High' | 'Critical' | 'Medium';
  resolved: boolean;
  coordinates?: [number, number];
}

export interface AIInsight {
  id: string;
  category: 'Ownership' | 'Legal' | 'Cost-Delay Correlation' | 'Policy Intervention' | 'Spatial Pattern';
  title: string;
  impactLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  confidenceScore: number;
  summary: string;
  findings: string[];
  recommendedActions: string[];
  affectedProjectsCount: number;
  estimatedCostImpactCr: number;
}

export interface ReportItem {
  id: string;
  title: string;
  type: 'Executive Brief' | 'Project Risk Dossier' | 'State Intelligence' | 'Parcel Audit' | 'Court Mitigation Summary';
  generatedDate: string;
  state: string;
  district?: string;
  project?: string;
  riskLevel: RiskLevel;
  author: string;
  format: 'PDF' | 'CSV' | 'INTERACTIVE';
  fileSize: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  organization: string;
  token?: string;
}

export interface GeographicMeasurement {
  radiusKm: number;
  centerCoordinates: [number, number];
  totalLandAcres: number;
  estimatedPopulation: number;
  populationDensityPerSqKm: number;
  affectedParcelsCount: number;
  criticalParcelsCount: number;
  roadIntersects: number;
  railwayDistanceKm: number;
  infrastructureCount: number;
  delayRiskScore: number;
  riskLevel: RiskLevel;
  delayProbability: number;
  landUseBreakdown: {
    agricultural: number;
    builtUp: number;
    vacant: number;
    government: number;
    publicTrust: number;
  };
  ownershipBreakdown: {
    private: number;
    government: number;
    disputed: number;
    joint: number;
  };
  riskBreakdown: RiskBreakdown;
}
