// ─── Control & Framework ────────────────────────────────────────────────────

export type ControlStatus =
  | 'not-started'
  | 'in-progress'
  | 'implemented'
  | 'not-applicable'

export type FrameworkId =
  | 'iso27001'
  | 'nist-csf'
  | 'pci-dss'
  | 'dora'
  | 'cis-v8'
  | 'soc2'
  | 'uk-gdpr'
  | 'cyber-essentials'
  | 'iso42001'

export interface Control {
  id: string
  domain: string
  domainCode: string
  title: string
  description: string
  guidance: string
  implementationGuide?: string
  exampleEvidence?: string[]
  status: ControlStatus
  notes: string
  evidence: string
  owner?: string
  lastUpdated?: string
  igLevel?: 1 | 2 | 3
}

export interface Domain {
  code: string
  name: string
  controlCount: number
}

export interface Framework {
  id: FrameworkId
  name: string
  version: string
  color: string
  description: string
  domains: Domain[]
  controls: Control[]
}

// ─── Risk ───────────────────────────────────────────────────────────────────

export type RiskLikelihood = 1 | 2 | 3 | 4 | 5
export type RiskImpact     = 1 | 2 | 3 | 4 | 5
export type RiskLevel      = 'low' | 'medium' | 'high' | 'critical'
export type RiskStatus     = 'open' | 'mitigated' | 'accepted' | 'transferred'

export interface TreatmentTab {
  id: string
  label: string
  content: string
}

export interface Risk {
  id: string
  assetName: string
  threat: string
  vulnerability: string
  likelihood: RiskLikelihood
  impact: RiskImpact
  score: number        // likelihood × impact (1–25)
  riskLevel: RiskLevel
  treatment: string          // concatenated summary (kept for display compat)
  treatmentTabs?: TreatmentTab[]  // individual treatment option tabs
  owner: string
  status: RiskStatus
  treatmentActioned?: boolean
  dateCreated: string
  lastUpdated?: string
}

// ─── Risk Appetite ──────────────────────────────────────────────────────────

export interface RiskAppetiteThreshold {
  // Each entry defines the maximum acceptable impact for a given likelihood score
  cells: Array<{ likelihood: number; maxAcceptableImpact: number }>
}

export const DEFAULT_APPETITE: RiskAppetiteThreshold = {
  cells: [
    { likelihood: 1, maxAcceptableImpact: 5 },
    { likelihood: 2, maxAcceptableImpact: 4 },
    { likelihood: 3, maxAcceptableImpact: 3 },
    { likelihood: 4, maxAcceptableImpact: 2 },
    { likelihood: 5, maxAcceptableImpact: 1 },
  ],
}

// ─── Crosswalk ──────────────────────────────────────────────────────────────

export interface CrosswalkMapping {
  isoId: string
  nistIds: string[]
  pciIds: string[]
  cisIds: string[]
  soc2Ids: string[]
  doraIds: string[]
  ukGdprIds: string[]
  cyberEssIds: string[]
  iso42001Ids: string[]
  notes: string
}

// ─── Gap Analysis ───────────────────────────────────────────────────────────

export interface GapNarrative {
  frameworkId: FrameworkId
  totalControls: number
  implemented: number
  inProgress: number
  notStarted: number
  percentComplete: number
  topGapDomain: string
  topGapDomainNotStarted: number
  concentrationInsight: string
  criticalGaps: string[]
  priorityAction: string
  momentum: 'none' | 'slow' | 'good'
}

// ─── Store shapes ───────────────────────────────────────────────────────────

export interface ControlUpdate {
  controlId: string
  frameworkId: FrameworkId
  field: 'status' | 'notes' | 'evidence' | 'owner'
  previousValue: string
  newValue: string
  timestamp: string
}

export interface CompletionStats {
  total: number
  implemented: number
  inProgress: number
  notStarted: number
  notApplicable: number
  percentComplete: number
}

export interface DomainStat {
  code: string
  name: string
  total: number
  implemented: number
  inProgress: number
  percentComplete: number
}

export interface AppSettings {
  theme: 'dark' | 'light'
  sidebarOpen: boolean
  denseTable: boolean
  activeFramework: FrameworkId
}

// ─── Toast ──────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  message: string
  type: ToastType
  duration?: number
}

// ─── Persistence ────────────────────────────────────────────────────────────

export interface ExportData {
  version: string
  exportedAt: string
  frameworks: Record<FrameworkId, Control[]>
  risks: Risk[]
  settings: Partial<AppSettings>
  recentActivity: ControlUpdate[]
}

// ─── UI helpers ─────────────────────────────────────────────────────────────

export type SortDirection = 'asc' | 'desc'

export interface SortConfig<T> {
  key: keyof T
  direction: SortDirection
}

export interface FilterConfig {
  search: string
  status: ControlStatus | 'all'
  domain: string | 'all'
}

// ─── Risk helpers ───────────────────────────────────────────────────────────

export const LIKELIHOOD_LABELS: Record<RiskLikelihood, string> = {
  1: 'Rare',
  2: 'Unlikely',
  3: 'Possible',
  4: 'Likely',
  5: 'Almost Certain',
}

export const IMPACT_LABELS: Record<RiskImpact, string> = {
  1: 'Negligible',
  2: 'Minor',
  3: 'Moderate',
  4: 'Major',
  5: 'Catastrophic',
}

export function calcRiskLevel(score: number): RiskLevel {
  if (score <= 5)  return 'low'
  if (score <= 12) return 'medium'
  if (score <= 19) return 'high'
  return 'critical'
}
