// ============================================================
// CADEX — Consulting Advisor & Deal EXecution Framework
// Shared TypeScript Types  (spec v0.4)
// ============================================================

// ── Core Enums ──────────────────────────────────────────────

export type EngagementType =
  | 'fixed-agile'
  | 'fixed-scope'
  | 'tm'
  | 'outcome'
  | 'hybrid'

export type PricingModel =
  | 'fixed-price'
  | 'tm'
  | 'tm-cap'
  | 'retainer'
  | 'outcome'
  | 'staff-aug'

export type DealOrigin =
  | 'rfp'
  | 'sole-source'
  | 'expansion'
  | 'new-logo'

export type Industry =
  | 'bfsi'
  | 'healthcare'
  | 'manufacturing'
  | 'retail'
  | 'tech'
  | 'public-sector'
  | 'other'

export type DealSize =
  | 'lt100k'
  | '100k-500k'
  | '500k-2m'
  | 'gt2m'

export type Duration =
  | 'lt3m'
  | '3-6m'
  | '6-12m'
  | 'gt12m'

export type DeliveryModel =
  | 'onshore'
  | 'nearshore'
  | 'offshore'
  | 'hybrid'

export type ProjectNature = 'greenfield' | 'brownfield' | 'cross' | 'other'

export type SalesStage =
  | 'awareness'
  | 'qualification'
  | 'proposal'
  | 'negotiation'

export type WinProbability = 'gt70' | '40-70' | 'lt40' | 'unknown'

export type CompetitiveSituation =
  | 'sole-source'
  | 'preferred'
  | 'open'
  | 'unknown'

export type ScoreBand = 'green' | 'amber' | 'red' | 'black'

export type CheckState = 'pass' | 'fail' | 'warning' | 'na'

export type EntryMode = 'full' | 'quick' | 'checker'

export type StrategyId = 'A' | 'B' | 'C' | 'D' | 'E' | 'F'

// ── 8 Scoring Axes ──────────────────────────────────────────

/** SC=Scope Clarity · CM=Client Maturity · CR=Commercial Risk
 *  TC=Technical Complexity · GR=Governance Readiness
 *  SV=Strategic Value · CP=Competitive Position
 *  VF=Vendor Capability Fit (internal only) */
export type AxisCode = 'SC' | 'CM' | 'CR' | 'TC' | 'GR' | 'SV' | 'CP' | 'VF'

/** Per-axis scores, 1–5 */
export type AxisScores = Record<AxisCode, number>

// ── Intake-specific sub-types ────────────────────────────────

export type BudgetStatus =
  | 'approved'
  | 'pending'
  | 'not-requested'
  | 'unknown'

export type EffortBand = 'lt1d' | '1-5d' | '1-2w' | 'gt2w'

export type DataClass =
  | 'pii'
  | 'phi'
  | 'financial-pci'
  | 'classified-govt'
  | 'ip-sensitive'
  | 'none'

export type ComplianceFramework =
  | 'gdpr'
  | 'hipaa'
  | 'pci-dss'
  | 'soc2'
  | 'iso27001'
  | 'fedramp'
  | 'fda-21cfr'
  | 'dpdp'
  | 'none'

export type ResidencyRequirement =
  | 'in-country'
  | 'regional'
  | 'none'
  | 'unknown'

export type CertRequirement = 'yes' | 'likely' | 'no' | 'unknown'

export type TechPartner =
  | 'microsoft'
  | 'aws'
  | 'google-cloud'
  | 'sap'
  | 'salesforce'
  | 'servicenow'
  | 'oracle'
  | 'none'
  | 'other'

export type ContractRole = 'prime' | 'sub' | 'co-prime' | 'unknown'

export type SIInvolvement =
  | 'yes-known'
  | 'yes-unknown'
  | 'no'
  | 'unknown'

export type CertDependency = 'required' | 'nice-to-have' | 'no'

export type TimezoneRegion =
  | 'americas'
  | 'europe-uk'
  | 'mea'
  | 'south-asia'
  | 'east-asia-pacific'

export type InCountryRequirement = 'contractual' | 'preferred' | 'no'

export type LanguageRequirement =
  | 'english-only'
  | 'english-plus-one'
  | 'multi-language'
  | 'unknown'

// ── Deal Meta ───────────────────────────────────────────────

export interface DealMeta {
  // Core
  name: string
  clientName: string
  engagementType: EngagementType
  pricingModel: PricingModel
  dealOrigin: DealOrigin
  industry: Industry
  dealSize: DealSize
  duration: Duration
  deliveryModel: DeliveryModel
  scopeSummary: string
  // Work type hierarchy
  projectNature: ProjectNature
  workCategory: string
  workType: string
  // Competitive context (Gap 1)
  competitiveSituation: CompetitiveSituation
  incumbentVendor: string
  competitorsKnown: 'yes-named' | 'suspected' | 'unknown'
  winProbability: WinProbability
  // Deal velocity (Gap 7)
  salesStage: SalesStage
  proposalDeadline: string         // ISO date string
  budgetApprovalStatus: BudgetStatus
  presalesEffortInvested: EffortBand
  // Regulatory & compliance (Gap 5)
  dataClassification: DataClass[]
  applicableFrameworks: ComplianceFramework[]
  dataResidencyRequired: ResidencyRequirement
  securityCertRequired: CertRequirement
  // Partner & ecosystem (Gap 6)
  technologyPartners: TechPartner[]
  ourRole: ContractRole
  otherSIsInvolved: SIInvolvement
  partnerCertDependency: CertDependency
  // Delivery geography (Gap 9)
  clientTimezone: TimezoneRegion
  deliveryTimezones: TimezoneRegion[]
  timezoneOverlapHours: number     // auto-calculated
  inCountryRequired: InCountryRequirement
  languageRequirements: LanguageRequirement
  // Bid economics
  quotedPriceK?: number            // quoted price in $K
  estimatedCostK?: number          // estimated delivery cost in $K
  contingencyPct?: number          // contingency as % of estimated cost
  // Work-type scope answers (dynamic per work type)
  workTypeScopeAnswers?: Record<string, string>
}

// ── Assessment ───────────────────────────────────────────────

export interface Assessment {
  responses: Record<string, number>   // questionId → 1–5
  axisScores: AxisScores
  weightedTotal: number               // 0–100 (percentage)
  scoreBand: ScoreBand
  criticalFlags: string[]             // question IDs where score = 1
  completedAt: string                 // ISO date
}

// ── Strategy ─────────────────────────────────────────────────

export interface StrategyResult {
  primary: StrategyId
  alternative?: StrategyId
  rationale: string[]
  competitiveModifier?: string
}

// ── Levers ───────────────────────────────────────────────────

export interface LeverResult {
  id: string
  category: 'scope' | 'commercial' | 'governance' | 'risk' | 'relationship'
  title: string
  rationale: string
  action: string
  contractLanguage?: string
  priority: number
}

// ── Checklist ────────────────────────────────────────────────

export interface CheckResult {
  id: string
  state: CheckState
  notes: string
}

export interface ChecklistResult {
  checks: Record<string, CheckResult>
  sectionScores: Record<string, number>
  overallScore: number
  verdict: 'go' | 'conditional' | 'no-go'
  hardBlockers: string[]
  completedAt: string
}

// ── Deal (root object) ───────────────────────────────────────

export interface Deal {
  id: string
  meta: DealMeta
  assessment?: Assessment
  strategy?: StrategyResult
  shaperLevers?: LeverResult[]
  checklist?: ChecklistResult
  assumptions: Assumption[]
  discoveryGaps: Record<string, DiscoveryGapStatus>
  currentStep: number
  createdAt: string
  updatedAt: string
  version: string           // spec version, for future migration
}

// ── Auto Signals ─────────────────────────────────────────────

export interface AutoSignal {
  id: string
  severity: 'info' | 'warning' | 'critical'
  message: string
  action?: string
}

// ── Questionnaire ─────────────────────────────────────────────

export interface Question {
  id: string
  section: string
  sectionTitle: string
  axis: AxisCode
  text: string
  /** Plain-language labels for scores 1 through 5 */
  scaleLabels: [string, string, string, string, string]
  coachingTip: string
  /** If set, only show this question for these work type IDs */
  triggerWorkTypes?: string[]
  /** Section I (VF) is internal — not shown in client-facing exports */
  internalOnly?: boolean
  /** Included in Quick Score 14-question subset */
  quickScore?: boolean
}

// ── Strategy Cards ────────────────────────────────────────────

export interface StrategyCard {
  id: StrategyId
  name: string
  tagline: string
  pitch: string
  keyMoves: string[]
  contractNonNegotiables: string[]
  objections: { q: string; a: string }[]
  close: string
  redFlags: string[]
  triggerSummary: string
}

// ── Levers (data definition) ──────────────────────────────────

export interface Lever {
  id: string
  category: 'scope' | 'commercial' | 'governance' | 'risk' | 'relationship'
  title: string
  rationale: string
  action: string
  contractLanguage?: string
  triggerCondition: (scores: AxisScores) => boolean
  priority: (scores: AxisScores) => number   // higher = more important
}

// ── Checklist (data definitions) ─────────────────────────────

export interface ChecklistSection {
  id: string
  title: string
  internalOnly?: boolean
}

export interface ChecklistItem {
  id: string
  sectionId: string
  text: string
  guidance: string
  isHardBlocker?: boolean
  internalOnly?: boolean
}

// ── Assumptions ──────────────────────────────────────────────

export type AssumptionImpact = 'low' | 'medium' | 'high'

export interface Assumption {
  id: string
  text: string
  ifFalseImpact: AssumptionImpact
}

// ── Discovery Gaps ────────────────────────────────────────────

export type DiscoveryGapStatus = 'known' | 'unknown' | 'na'

export interface DiscoveryGapItem {
  id: string
  category: 'scope' | 'technical' | 'governance' | 'commercial' | 'delivery'
  question: string
  why: string
  triggerWorkCategories?: string[]            // L2 IDs — if set, only show for these
  triggerProjectNature?: ProjectNature[]      // filter by greenfield / brownfield
}

// ── Coaching Content ──────────────────────────────────────────

export interface CoachingContent {
  id: string
  title: string
  body: string
  appearsIn: string[]
}

// ── Work Type Taxonomy ────────────────────────────────────────

export type RiskLevel = 'E' | 'S' | 'L'

export interface WorkTypeNode {
  id: string
  label: string
  level: 1 | 2 | 3
  parent?: string
  riskProfile?: Partial<Record<AxisCode, RiskLevel>>
  keyRisk?: string
}

// ── Weight Tables ─────────────────────────────────────────────

export type WeightTable = Record<AxisCode, number>
