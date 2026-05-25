import { useState } from 'react'
import { useDealStore } from '../../store/dealStore'
import { WORK_TYPES } from '../../data/workTypes'
import { DISCOVERY_GAPS, DISCOVERY_GAP_CATEGORIES } from '../../data/discoveryGaps'
import { getScopeBlock } from '../../data/workTypeScopeQuestions'
import AutoSignalBanner from '../shared/AutoSignalBanner'
import { computeAutoSignals } from '../../lib/autoSignals'
import { Plus, X, ChevronDown, ChevronRight, CheckCircle2, AlertTriangle, Info } from 'lucide-react'
import type {
  DealMeta, DataClass, ComplianceFramework, TechPartner, TimezoneRegion,
  WorkTypeNode, AssumptionImpact, DiscoveryGapStatus,
} from '../../types'

// ── Styles ───────────────────────────────────────────────────

const INPUT = 'w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white'
const SELECT = INPUT
const FIELD = 'text-sm font-medium text-slate-700 mb-1 block'
const GRID2 = 'grid grid-cols-2 gap-4'

const IMPACT_CONFIG: Record<AssumptionImpact, { label: string; cls: string }> = {
  low:    { label: 'Low',    cls: 'bg-slate-100 text-slate-600' },
  medium: { label: 'Medium', cls: 'bg-amber-100 text-amber-700' },
  high:   { label: 'High',   cls: 'bg-red-100 text-red-700' },
}

const GAP_STATE_CONFIG: Record<DiscoveryGapStatus, { label: string; cls: string }> = {
  known:   { label: 'Known',   cls: 'bg-green-100 text-green-700 border-green-300' },
  unknown: { label: 'Unknown', cls: 'bg-red-100 text-red-700 border-red-300' },
  na:      { label: 'N/A',     cls: 'bg-slate-100 text-slate-500 border-slate-200' },
}

// ── Section types ─────────────────────────────────────────────

type SectionId = 'basics' | 'work' | 'economics' | 'competitive' | 'compliance' | 'geography' | 'gaps' | 'assumptions'

const SECTION_ORDER: SectionId[] = ['basics', 'work', 'economics', 'competitive', 'compliance', 'geography', 'gaps', 'assumptions']

interface SectionDef { id: SectionId; num: string; title: string; sub: string; required?: boolean }

const SECTIONS: SectionDef[] = [
  { id: 'basics',      num: '01', title: 'Deal Basics',            sub: 'Name, client, type, size, duration',       required: true },
  { id: 'work',        num: '02', title: 'Work Classification',    sub: 'Project nature and work type',              required: true },
  { id: 'economics',   num: '03', title: 'Bid Economics',          sub: 'Pricing, cost, and margin analysis' },
  { id: 'competitive', num: '04', title: 'Competitive & Velocity', sub: 'Competition, win probability, timeline' },
  { id: 'compliance',  num: '05', title: 'Compliance & Security',  sub: 'Data classification and frameworks' },
  { id: 'geography',   num: '06', title: 'Partners & Geography',   sub: 'Ecosystem, timezone, in-country' },
  { id: 'gaps',        num: '07', title: 'Discovery Gaps',         sub: 'What don\'t I know yet?' },
  { id: 'assumptions', num: '08', title: 'Scope Assumptions',      sub: 'If-false risk register' },
]

// ── Insight card ──────────────────────────────────────────────

type InsightLevel = 'info' | 'warning' | 'success' | 'danger'

interface Insight { text: string; level: InsightLevel }

const INSIGHT_STYLES: Record<InsightLevel, string> = {
  info:    'bg-indigo-50 border-indigo-200 text-indigo-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  success: 'bg-green-50 border-green-200 text-green-800',
  danger:  'bg-red-50 border-red-200 text-red-800',
}

const INSIGHT_ICONS: Record<InsightLevel, typeof Info> = {
  info: Info, warning: AlertTriangle, success: CheckCircle2, danger: AlertTriangle,
}

function InsightCard({ insight }: { insight: Insight }) {
  const Icon = INSIGHT_ICONS[insight.level]
  return (
    <div className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm leading-relaxed ${INSIGHT_STYLES[insight.level]}`}>
      <Icon size={15} className="mt-0.5 shrink-0" />
      {insight.text}
    </div>
  )
}

// ── Section header ────────────────────────────────────────────

interface SectionHeaderProps {
  def: SectionDef
  isOpen: boolean
  isVisited: boolean
  isComplete: boolean
  summary: string
  onClick: () => void
}

function SectionHeader({ def, isOpen, isVisited, isComplete, summary, onClick }: SectionHeaderProps) {
  const locked = !isVisited && !isOpen
  return (
    <button
      onClick={onClick}
      disabled={locked}
      className={`w-full flex items-center gap-3 px-5 py-4 text-left transition-colors ${
        locked
          ? 'cursor-not-allowed opacity-40'
          : isOpen
          ? 'bg-white'
          : 'bg-white hover:bg-slate-50'
      }`}
    >
      {/* Status dot */}
      <span className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
        isComplete && !isOpen
          ? 'bg-green-500 text-white'
          : isOpen
          ? 'bg-indigo-600 text-white'
          : 'bg-slate-200 text-slate-500'
      }`}>
        {isComplete && !isOpen ? '✓' : def.num}
      </span>

      {/* Title area */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-semibold ${isOpen ? 'text-indigo-700' : isComplete ? 'text-slate-700' : 'text-slate-500'}`}>
            {def.title}
          </span>
          {def.required && !isComplete && (
            <span className="text-xs text-red-500 font-medium">required</span>
          )}
        </div>
        {!isOpen && isVisited && summary && (
          <span className="text-xs text-slate-400 truncate block mt-0.5">{summary}</span>
        )}
        {!isOpen && !isVisited && (
          <span className="text-xs text-slate-400">{def.sub}</span>
        )}
      </div>

      {/* Chevron */}
      {!locked && (
        isOpen
          ? <ChevronDown size={16} className="text-slate-400 shrink-0" />
          : <ChevronRight size={16} className="text-slate-400 shrink-0" />
      )}
    </button>
  )
}

// ── Main component ────────────────────────────────────────────

export default function IntakeForm() {
  const {
    getActiveDeal, updateMeta, setCurrentStep,
    addAssumption, updateAssumption, removeAssumption, setDiscoveryGap,
  } = useDealStore()

  const activeDeal = getActiveDeal()

  const [openSection, setOpenSection] = useState<SectionId>('basics')
  const [visited, setVisited] = useState<Set<SectionId>>(new Set(['basics']))

  // Assumption editing state
  const [newText, setNewText] = useState('')
  const [newImpact, setNewImpact] = useState<AssumptionImpact>('medium')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [editImpact, setEditImpact] = useState<AssumptionImpact>('medium')

  if (!activeDeal) return null

  const { meta } = activeDeal
  const assumptions = activeDeal.assumptions ?? []
  const discoveryGaps = activeDeal.discoveryGaps ?? {}

  const set = <K extends keyof DealMeta>(key: K, val: DealMeta[K]) => updateMeta({ [key]: val })
  const toggleMulti = <T extends string>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]

  // Work type helpers
  const l2Options = WORK_TYPES.filter((n: WorkTypeNode) => n.level === 2 && n.parent === meta.projectNature)
  const l3Options = WORK_TYPES.filter((n: WorkTypeNode) => n.level === 3 && n.parent === meta.workCategory)

  // Bid economics
  const margin = (meta.quotedPriceK && meta.estimatedCostK && meta.quotedPriceK > 0)
    ? Math.round(((meta.quotedPriceK - meta.estimatedCostK) / meta.quotedPriceK) * 100) : null
  const marginColor = margin === null ? '' : margin >= 25 ? 'text-green-600' : margin >= 15 ? 'text-amber-600' : 'text-red-600'
  const contingencyK = (meta.estimatedCostK && meta.contingencyPct)
    ? Math.round(meta.estimatedCostK * meta.contingencyPct / 100) : null

  // Discovery gaps
  const relevantGaps = DISCOVERY_GAPS.filter(g => {
    if (g.triggerProjectNature && !g.triggerProjectNature.includes(meta.projectNature)) return false
    if (g.triggerWorkCategories && meta.workCategory && !g.triggerWorkCategories.includes(meta.workCategory)) return false
    if (g.triggerWorkCategories && !meta.workCategory) return false
    return true
  })
  const unknownCount = relevantGaps.filter(g => (discoveryGaps[g.id] ?? 'unknown') === 'unknown').length

  const signals = computeAutoSignals(meta)
  const canProceed = !!(meta.name && meta.clientName && meta.workType)

  // ── Section completion ──────────────────────────────────────

  function isSectionComplete(id: SectionId): boolean {
    switch (id) {
      case 'basics': return !!(meta.name && meta.clientName)
      case 'work': return !!meta.workType
      default: return visited.has(id)
    }
  }

  // ── Section summaries ───────────────────────────────────────

  function getSummary(id: SectionId): string {
    switch (id) {
      case 'basics':
        return [meta.clientName, meta.pricingModel.replace('-', ' '), meta.dealSize.replace('-', '–')].filter(Boolean).join(' · ')
      case 'work': {
        if (!meta.workType) return 'Work type not selected'
        const scopeAnswerCount = Object.values(meta.workTypeScopeAnswers ?? {}).filter(Boolean).length
        const wtLabel = WORK_TYPES.find((n: WorkTypeNode) => n.id === meta.workType)?.label ?? meta.workType
        const nature = meta.projectNature === 'cross' ? 'Cross-cutting' : meta.projectNature.charAt(0).toUpperCase() + meta.projectNature.slice(1)
        return `${nature} / ${wtLabel}${scopeAnswerCount > 0 ? ` · ${scopeAnswerCount} scope details` : ''}`
      }
      case 'economics':
        if (!meta.quotedPriceK && !meta.estimatedCostK) return 'Not entered'
        return `$${meta.quotedPriceK ?? '?'}K quoted${margin !== null ? ` · ${margin}% margin` : ''}`
      case 'competitive':
        return `${meta.competitiveSituation} · ${meta.salesStage} · ${meta.winProbability === 'unknown' ? 'unknown win prob' : meta.winProbability + ' win prob'}`
      case 'compliance': {
        const dc = meta.dataClassification.filter(d => d !== 'none')
        return dc.length > 0 ? dc.map(d => d.toUpperCase()).join(', ') : 'No sensitive data'
      }
      case 'geography':
        return `${meta.deliveryModel}${meta.timezoneOverlapHours > 0 ? ` · ${meta.timezoneOverlapHours}h overlap` : ''}`
      case 'gaps':
        return `${unknownCount} open · ${relevantGaps.length - unknownCount} resolved`
      case 'assumptions':
        return `${assumptions.length} logged · ${assumptions.filter(a => a.ifFalseImpact === 'high').length} high-impact`
      default: return ''
    }
  }

  // ── Insights ────────────────────────────────────────────────

  function getInsight(id: SectionId): Insight | null {
    switch (id) {
      case 'basics':
        if (meta.pricingModel === 'fixed-price')
          return { text: 'Fixed-price model requires precise scope definition. Scope clarity will be your most critical risk axis throughout this assessment.', level: 'info' }
        if (meta.pricingModel === 'tm')
          return { text: 'T&M model reduces commercial risk but increases governance requirements. Client oversight cadence and decision latency are the key delivery risks.', level: 'info' }
        return null
      case 'work': {
        if (!meta.workType)
          return { text: 'Select a work type to load targeted scope questions, discovery questions, and calibrate the risk scoring model.', level: 'warning' }
        const scopeBlock = getScopeBlock(meta.workType)
        const answered = Object.values(meta.workTypeScopeAnswers ?? {}).filter(Boolean).length
        const total = scopeBlock?.questions.length ?? 0
        if (scopeBlock && answered < total)
          return {
            text: `${answered} of ${total} scope detail questions answered for this work type. Complete these to sharpen the risk model and proposal output.`,
            level: 'info',
          }
        return {
          text: `Work type scoped and ${relevantGaps.length} targeted discovery questions loaded. Scope details recorded.`,
          level: 'success',
        }
      }
      case 'economics':
        if (!meta.quotedPriceK && !meta.estimatedCostK)
          return { text: 'Entering bid economics enables margin tracking and populates the commercial proposal slides. Optional but recommended.', level: 'info' }
        if (margin !== null) {
          if (margin < 15) return { text: `${margin}% margin is below the 15% threshold. This deal requires a commercial review before bid submission.`, level: 'danger' }
          if (margin < 20) return { text: `${margin}% margin is thin for this engagement type. Ensure contingency is adequate to cover scope risk.`, level: 'warning' }
          return { text: `${margin}% gross margin${meta.contingencyPct ? ` with ${meta.contingencyPct}% contingency` : ''}. Commercial profile looks healthy.`, level: 'success' }
        }
        return null
      case 'competitive':
        if (meta.competitiveSituation === 'open' && meta.winProbability === 'lt40')
          return { text: 'Open competition with low win probability. Validate whether the presales investment is justified before committing further resources.', level: 'warning' }
        if (meta.competitiveSituation === 'sole-source')
          return { text: 'Sole-source opportunity. Focus effort on commercial terms and delivery protection — competitive differentiation is not the primary risk here.', level: 'success' }
        if (meta.salesStage === 'negotiation' && meta.budgetApprovalStatus !== 'approved')
          return { text: 'Negotiation stage without confirmed budget approval is a commercial risk. Verify budget status before investing further presales effort.', level: 'warning' }
        return null
      case 'compliance': {
        const sensitive = meta.dataClassification.filter(d => d !== 'none')
        if (sensitive.includes('classified-govt') || sensitive.includes('phi'))
          return { text: 'Classified or health data detected. Security architecture, data residency, and access controls will materially affect delivery cost — price them explicitly.', level: 'danger' }
        if (sensitive.length > 0)
          return { text: 'Sensitive data classification identified. Ensure compliance-related costs (architecture review, audit trail, encryption) are explicitly included in your estimate.', level: 'warning' }
        return null
      }
      case 'geography':
        if (meta.timezoneOverlapHours > 0 && meta.timezoneOverlapHours < 3)
          return { text: `Only ${meta.timezoneOverlapHours}h daily client–delivery overlap. Sprint reviews and escalations are time-constrained — price the coordination overhead and flag this in governance planning.`, level: 'danger' }
        if (meta.timezoneOverlapHours >= 5)
          return { text: `${meta.timezoneOverlapHours}h daily overlap provides a healthy collaboration window for this delivery model.`, level: 'success' }
        return null
      case 'gaps':
        if (unknownCount === 0 && relevantGaps.length > 0)
          return { text: 'All discovery gaps resolved. Strong pre-sales diligence — this significantly reduces scope dispute risk at delivery.', level: 'success' }
        if (unknownCount > 5)
          return { text: `${unknownCount} open questions remain. Resolve critical unknowns before contract signature, or scope a paid discovery phase to surface them safely.`, level: 'warning' }
        if (unknownCount > 0)
          return { text: `${unknownCount} open question${unknownCount > 1 ? 's' : ''} identified. Address these before finalising scope boundaries.`, level: 'info' }
        return null
      case 'assumptions': {
        const highCount = assumptions.filter(a => a.ifFalseImpact === 'high').length
        if (highCount > 2)
          return { text: `${highCount} high-impact assumptions. Each one should be documented in the contract as a formal scope boundary — if any breaks, you need a change order.`, level: 'warning' }
        if (assumptions.length === 0)
          return { text: 'No assumptions logged. Most fixed-price deals have 4–8 key assumptions. Logging them protects you at delivery and strengthens the proposal.', level: 'info' }
        return null
      }
      default: return null
    }
  }

  // ── Section navigation ──────────────────────────────────────

  function advanceSection(current: SectionId) {
    const idx = SECTION_ORDER.indexOf(current)
    if (idx < SECTION_ORDER.length - 1) {
      const next = SECTION_ORDER[idx + 1]
      setVisited(prev => new Set([...prev, next]))
      setOpenSection(next)
    }
  }

  function toggleSection(id: SectionId) {
    if (openSection === id) {
      setOpenSection('' as SectionId)
    } else {
      setVisited(prev => new Set([...prev, id]))
      setOpenSection(id)
    }
  }

  // ── Section bodies ──────────────────────────────────────────

  function renderBasics() {
    return (
      <div className="space-y-4">
        <div className={GRID2}>
          <div>
            <label className={FIELD}>Deal name *</label>
            <input className={INPUT} value={meta.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Acme — E-commerce Replatform" />
          </div>
          <div>
            <label className={FIELD}>Client name *</label>
            <input className={INPUT} value={meta.clientName} onChange={e => set('clientName', e.target.value)} placeholder="Client organisation" />
          </div>
        </div>
        <div>
          <label className={FIELD}>Scope summary</label>
          <textarea className={INPUT + ' resize-none'} rows={3} maxLength={500}
            value={meta.scopeSummary} onChange={e => set('scopeSummary', e.target.value)}
            placeholder="Brief description of what needs to be built or delivered..." />
          <div className="text-xs text-slate-400 text-right">{meta.scopeSummary.length}/500</div>
        </div>
        <div className={GRID2}>
          <div>
            <label className={FIELD}>Engagement type</label>
            <select className={SELECT} value={meta.engagementType} onChange={e => set('engagementType', e.target.value as DealMeta['engagementType'])}>
              <option value="fixed-agile">Fixed Price / Agile scope</option>
              <option value="fixed-scope">Fixed Price / Fixed scope</option>
              <option value="tm">Time & Materials</option>
              <option value="outcome">Outcome / Value-based</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label className={FIELD}>Pricing model</label>
            <select className={SELECT} value={meta.pricingModel} onChange={e => set('pricingModel', e.target.value as DealMeta['pricingModel'])}>
              <option value="fixed-price">Fixed Price</option>
              <option value="tm">Time & Materials</option>
              <option value="tm-cap">T&M with Cap</option>
              <option value="retainer">Retainer / Subscription</option>
              <option value="outcome">Outcome / Value-based</option>
              <option value="staff-aug">Staff Augmentation</option>
            </select>
          </div>
          <div>
            <label className={FIELD}>Deal size</label>
            <select className={SELECT} value={meta.dealSize} onChange={e => set('dealSize', e.target.value as DealMeta['dealSize'])}>
              <option value="lt100k">&lt; $100K</option>
              <option value="100k-500k">$100K – $500K</option>
              <option value="500k-2m">$500K – $2M</option>
              <option value="gt2m">&gt; $2M</option>
            </select>
          </div>
          <div>
            <label className={FIELD}>Duration</label>
            <select className={SELECT} value={meta.duration} onChange={e => set('duration', e.target.value as DealMeta['duration'])}>
              <option value="lt3m">&lt; 3 months</option>
              <option value="3-6m">3 – 6 months</option>
              <option value="6-12m">6 – 12 months</option>
              <option value="gt12m">12+ months</option>
            </select>
          </div>
          <div>
            <label className={FIELD}>Industry</label>
            <select className={SELECT} value={meta.industry} onChange={e => set('industry', e.target.value as DealMeta['industry'])}>
              <option value="bfsi">BFSI</option>
              <option value="healthcare">Healthcare</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="retail">Retail</option>
              <option value="tech">Tech / Software</option>
              <option value="public-sector">Public Sector</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className={FIELD}>Deal origin</label>
            <select className={SELECT} value={meta.dealOrigin} onChange={e => set('dealOrigin', e.target.value as DealMeta['dealOrigin'])}>
              <option value="rfp">RFP / RFQ</option>
              <option value="sole-source">Sole-source</option>
              <option value="expansion">Account expansion</option>
              <option value="new-logo">New logo</option>
            </select>
          </div>
          <div>
            <label className={FIELD}>Delivery model</label>
            <select className={SELECT} value={meta.deliveryModel} onChange={e => set('deliveryModel', e.target.value as DealMeta['deliveryModel'])}>
              <option value="onshore">Onshore</option>
              <option value="nearshore">Nearshore</option>
              <option value="offshore">Offshore</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>
      </div>
    )
  }

  function renderWork() {
    const scopeBlock = meta.workType ? getScopeBlock(meta.workType) : undefined
    const scopeAnswers = meta.workTypeScopeAnswers ?? {}
    const selectedWorkTypeNode = WORK_TYPES.find((n: WorkTypeNode) => n.id === meta.workType)

    const setScopeAnswer = (qId: string, val: string) =>
      set('workTypeScopeAnswers', { ...scopeAnswers, [qId]: val })

    return (
      <div className="space-y-5">
        {/* Nature picker */}
        <div>
          <label className={FIELD}>Project nature</label>
          <div className="flex gap-2">
            {(['greenfield', 'brownfield', 'cross', 'other'] as const).map(v => {
              const labels: Record<string, string> = { greenfield: 'Greenfield', brownfield: 'Brownfield', cross: 'Staff Aug / Advisory', other: 'Other / Not Listed' }
              return (
                <button key={v} onClick={() => { set('projectNature', v as DealMeta['projectNature']); set('workCategory', ''); set('workType', ''); set('workTypeScopeAnswers', {}) }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${meta.projectNature === v ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'}`}>
                  {labels[v]}
                </button>
              )
            })}
          </div>
        </div>

        {/* Category + Type selectors */}
        <div className={GRID2}>
          <div>
            <label className={FIELD}>Work category</label>
            <select className={SELECT} value={meta.workCategory} onChange={e => { set('workCategory', e.target.value); set('workType', ''); set('workTypeScopeAnswers', {}) }} disabled={!meta.projectNature}>
              <option value="">Select category…</option>
              {l2Options.map((n: WorkTypeNode) => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
          </div>
          <div>
            <label className={FIELD}>Work type *</label>
            <select className={SELECT} value={meta.workType} onChange={e => { set('workType', e.target.value); set('workTypeScopeAnswers', {}) }} disabled={!meta.workCategory}>
              <option value="">Select type…</option>
              {l3Options.map((n: WorkTypeNode) => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
          </div>
        </div>

        {/* Key risk callout for selected work type */}
        {selectedWorkTypeNode?.keyRisk && (
          <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
            <AlertTriangle size={15} className="mt-0.5 shrink-0 text-amber-500" />
            <span><span className="font-semibold">Key risk: </span>{selectedWorkTypeNode.keyRisk}</span>
          </div>
        )}

        {/* Dynamic scope questions */}
        {scopeBlock && (
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4 space-y-4">
            <div>
              <div className="text-sm font-semibold text-indigo-800">{scopeBlock.heading}</div>
              <div className="text-xs text-indigo-600 mt-0.5">{scopeBlock.intro}</div>
            </div>
            <div className="space-y-4">
              {scopeBlock.questions.map(q => {
                const val = scopeAnswers[q.id] ?? ''
                const selectedOption = q.options?.find(o => o.value === val)
                const riskHint = selectedOption?.risk

                return (
                  <div key={q.id}>
                    <label className={FIELD + ' text-indigo-900'}>
                      {q.label}
                      {q.hint && <span className="ml-1 text-xs font-normal text-indigo-400">{q.hint}</span>}
                    </label>

                    {q.type === 'select' && q.options && (
                      <select
                        className={SELECT + ' bg-white border-indigo-200 focus:ring-indigo-400'}
                        value={val}
                        onChange={e => setScopeAnswer(q.id, e.target.value)}
                      >
                        <option value="">Select…</option>
                        {q.options.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    )}

                    {q.type === 'radio' && q.options && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {q.options.map(o => (
                          <button
                            key={o.value}
                            onClick={() => setScopeAnswer(q.id, o.value)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${val === o.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                    )}

                    {(q.type === 'text') && (
                      <input
                        className={INPUT + ' bg-white border-indigo-200'}
                        type="text"
                        value={val}
                        onChange={e => setScopeAnswer(q.id, e.target.value)}
                        placeholder={q.placeholder}
                      />
                    )}

                    {(q.type === 'number') && (
                      <input
                        className={INPUT + ' bg-white border-indigo-200'}
                        type="number"
                        value={val}
                        onChange={e => setScopeAnswer(q.id, e.target.value)}
                        placeholder={q.placeholder}
                      />
                    )}

                    {/* Risk hint for selected option */}
                    {riskHint && (
                      <div className="mt-1.5 flex items-start gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2.5 py-2">
                        <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                        {riskHint}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    )
  }

  function renderEconomics() {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={FIELD}>Quoted price ($K)</label>
            <input type="number" className={INPUT} placeholder="e.g. 850" min={0}
              value={meta.quotedPriceK ?? ''}
              onChange={e => set('quotedPriceK', e.target.value ? Number(e.target.value) : undefined)} />
          </div>
          <div>
            <label className={FIELD}>Estimated cost ($K)</label>
            <input type="number" className={INPUT} placeholder="e.g. 620" min={0}
              value={meta.estimatedCostK ?? ''}
              onChange={e => set('estimatedCostK', e.target.value ? Number(e.target.value) : undefined)} />
          </div>
          <div>
            <label className={FIELD}>Contingency (%)</label>
            <input type="number" className={INPUT} placeholder="e.g. 12" min={0} max={50}
              value={meta.contingencyPct ?? ''}
              onChange={e => set('contingencyPct', e.target.value ? Number(e.target.value) : undefined)} />
          </div>
        </div>
        {(meta.quotedPriceK || meta.estimatedCostK) && (
          <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-100">
            <div className="text-center">
              <div className={`text-2xl font-bold ${marginColor}`}>{margin !== null ? `${margin}%` : '—'}</div>
              <div className="text-xs text-slate-500 mt-0.5">Gross margin
                {margin !== null && margin < 20 && <span className="ml-1 text-red-600 font-semibold">⚠ below 20%</span>}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-700">{contingencyK !== null ? `$${contingencyK}K` : '—'}</div>
              <div className="text-xs text-slate-500 mt-0.5">Contingency amount</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-700">
                {meta.quotedPriceK && meta.estimatedCostK ? `$${Math.round(meta.quotedPriceK - meta.estimatedCostK)}K` : '—'}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">Gross profit</div>
            </div>
          </div>
        )}
      </div>
    )
  }

  function renderCompetitive() {
    return (
      <div className={`${GRID2} gap-y-4`}>
        <div>
          <label className={FIELD}>Competitive situation</label>
          <select className={SELECT} value={meta.competitiveSituation} onChange={e => set('competitiveSituation', e.target.value as DealMeta['competitiveSituation'])}>
            <option value="sole-source">Sole-source</option>
            <option value="preferred">Preferred (2–3 finalists)</option>
            <option value="open">Open competition (4+ vendors)</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
        <div>
          <label className={FIELD}>Win probability (self-assessed)</label>
          <select className={SELECT} value={meta.winProbability} onChange={e => set('winProbability', e.target.value as DealMeta['winProbability'])}>
            <option value="gt70">&gt; 70%</option>
            <option value="40-70">40 – 70%</option>
            <option value="lt40">&lt; 40%</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
        <div>
          <label className={FIELD}>Incumbent vendor</label>
          <input className={INPUT} value={meta.incumbentVendor} onChange={e => set('incumbentVendor', e.target.value)} placeholder="None / Unknown" />
        </div>
        <div>
          <label className={FIELD}>Competitors known?</label>
          <select className={SELECT} value={meta.competitorsKnown} onChange={e => set('competitorsKnown', e.target.value as DealMeta['competitorsKnown'])}>
            <option value="yes-named">Yes — named</option>
            <option value="suspected">Suspected</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
        <div>
          <label className={FIELD}>Sales stage</label>
          <select className={SELECT} value={meta.salesStage} onChange={e => set('salesStage', e.target.value as DealMeta['salesStage'])}>
            <option value="awareness">Awareness</option>
            <option value="qualification">Qualification</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
          </select>
        </div>
        <div>
          <label className={FIELD}>Budget approval status</label>
          <select className={SELECT} value={meta.budgetApprovalStatus} onChange={e => set('budgetApprovalStatus', e.target.value as DealMeta['budgetApprovalStatus'])}>
            <option value="approved">Approved</option>
            <option value="pending">Pending approval</option>
            <option value="not-requested">Not yet requested</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>
        <div>
          <label className={FIELD}>Proposal deadline</label>
          <input type="date" className={INPUT} value={meta.proposalDeadline} onChange={e => set('proposalDeadline', e.target.value)} />
        </div>
        <div>
          <label className={FIELD}>Presales effort invested</label>
          <select className={SELECT} value={meta.presalesEffortInvested} onChange={e => set('presalesEffortInvested', e.target.value as DealMeta['presalesEffortInvested'])}>
            <option value="lt1d">&lt; 1 day</option>
            <option value="1-5d">1 – 5 days</option>
            <option value="1-2w">1 – 2 weeks</option>
            <option value="gt2w">&gt; 2 weeks</option>
          </select>
        </div>
      </div>
    )
  }

  function renderCompliance() {
    return (
      <div className="space-y-4">
        <div>
          <label className={FIELD}>Data classification</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {(['pii', 'phi', 'financial-pci', 'classified-govt', 'ip-sensitive', 'none'] as DataClass[]).map(v => (
              <button key={v} onClick={() => set('dataClassification', toggleMulti(meta.dataClassification, v))}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${meta.dataClassification.includes(v) ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-white text-slate-600 border-slate-200 hover:border-rose-200'}`}>
                {v.toUpperCase().replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className={FIELD}>Applicable frameworks</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {(['gdpr', 'hipaa', 'pci-dss', 'soc2', 'iso27001', 'fedramp', 'fda-21cfr', 'dpdp', 'none'] as ComplianceFramework[]).map(v => (
              <button key={v} onClick={() => set('applicableFrameworks', toggleMulti(meta.applicableFrameworks, v))}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${meta.applicableFrameworks.includes(v) ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-white text-slate-600 border-slate-200 hover:border-rose-200'}`}>
                {v.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        <div className={GRID2}>
          <div>
            <label className={FIELD}>Data residency requirement</label>
            <select className={SELECT} value={meta.dataResidencyRequired} onChange={e => set('dataResidencyRequired', e.target.value as DealMeta['dataResidencyRequired'])}>
              <option value="in-country">Yes — in-country</option>
              <option value="regional">Yes — regional</option>
              <option value="none">No restriction</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
          <div>
            <label className={FIELD}>Security certification required</label>
            <select className={SELECT} value={meta.securityCertRequired} onChange={e => set('securityCertRequired', e.target.value as DealMeta['securityCertRequired'])}>
              <option value="yes">Yes — mandated</option>
              <option value="likely">Likely</option>
              <option value="no">No</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
        </div>
      </div>
    )
  }

  function renderGeography() {
    return (
      <div className="space-y-4">
        <div>
          <label className={FIELD}>Technology partners</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {(['microsoft', 'aws', 'google-cloud', 'sap', 'salesforce', 'servicenow', 'oracle', 'none', 'other'] as TechPartner[]).map(v => (
              <button key={v} onClick={() => set('technologyPartners', toggleMulti(meta.technologyPartners, v))}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${meta.technologyPartners.includes(v) ? 'bg-violet-100 text-violet-800 border-violet-300' : 'bg-white text-slate-600 border-slate-200 hover:border-violet-200'}`}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className={GRID2}>
          <div>
            <label className={FIELD}>Our role</label>
            <select className={SELECT} value={meta.ourRole} onChange={e => set('ourRole', e.target.value as DealMeta['ourRole'])}>
              <option value="prime">Prime contractor</option>
              <option value="sub">Subcontractor</option>
              <option value="co-prime">Co-prime</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
          <div>
            <label className={FIELD}>Other SIs involved</label>
            <select className={SELECT} value={meta.otherSIsInvolved} onChange={e => set('otherSIsInvolved', e.target.value as DealMeta['otherSIsInvolved'])}>
              <option value="yes-known">Yes — known scope</option>
              <option value="yes-unknown">Yes — unclear scope</option>
              <option value="no">No</option>
              <option value="unknown">Unknown</option>
            </select>
          </div>
          <div>
            <label className={FIELD}>Client timezone region</label>
            <select className={SELECT} value={meta.clientTimezone} onChange={e => set('clientTimezone', e.target.value as TimezoneRegion)}>
              <option value="americas">Americas</option>
              <option value="europe-uk">Europe / UK</option>
              <option value="mea">Middle East / Africa</option>
              <option value="south-asia">South Asia</option>
              <option value="east-asia-pacific">East Asia / Pacific</option>
            </select>
          </div>
          <div>
            <label className={FIELD}>In-country presence required</label>
            <select className={SELECT} value={meta.inCountryRequired} onChange={e => set('inCountryRequired', e.target.value as DealMeta['inCountryRequired'])}>
              <option value="contractual">Yes — contractual</option>
              <option value="preferred">Yes — preferred</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>
        <div>
          <label className={FIELD}>Delivery team timezone(s)</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {(['americas', 'europe-uk', 'mea', 'south-asia', 'east-asia-pacific'] as TimezoneRegion[]).map(v => (
              <button key={v} onClick={() => set('deliveryTimezones', toggleMulti(meta.deliveryTimezones, v))}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${meta.deliveryTimezones.includes(v) ? 'bg-teal-100 text-teal-800 border-teal-300' : 'bg-white text-slate-600 border-slate-200 hover:border-teal-200'}`}>
                {v.replace('-', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </button>
            ))}
          </div>
          {meta.timezoneOverlapHours > 0 && (
            <div className={`mt-2 text-xs font-medium ${meta.timezoneOverlapHours < 3 ? 'text-red-600' : meta.timezoneOverlapHours < 5 ? 'text-amber-600' : 'text-green-600'}`}>
              Estimated overlap: ~{meta.timezoneOverlapHours}h/day
              {meta.timezoneOverlapHours < 3 && ' — High governance risk'}
            </div>
          )}
        </div>
      </div>
    )
  }

  function renderGaps() {
    if (relevantGaps.length === 0) {
      return <p className="text-sm text-slate-400 italic">Select a work type in section 02 to load targeted discovery questions.</p>
    }
    return (
      <div className="space-y-5">
        {(Object.keys(DISCOVERY_GAP_CATEGORIES) as Array<keyof typeof DISCOVERY_GAP_CATEGORIES>).map(cat => {
          const items = relevantGaps.filter(g => g.category === cat)
          if (!items.length) return null
          const cfg = DISCOVERY_GAP_CATEGORIES[cat]
          return (
            <div key={cat}>
              <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${cfg.color}`}>{cfg.label}</div>
              <div className="space-y-2">
                {items.map(gap => {
                  const status = (discoveryGaps[gap.id] ?? 'unknown') as DiscoveryGapStatus
                  return (
                    <div key={gap.id} className={`rounded-lg border p-3 ${cfg.bg}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-800 leading-snug">{gap.question}</p>
                          <p className="text-xs text-slate-500 mt-1 leading-snug">{gap.why}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          {(['known', 'unknown', 'na'] as DiscoveryGapStatus[]).map(s => (
                            <button key={s} onClick={() => setDiscoveryGap(gap.id, s)}
                              className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${status === s ? GAP_STATE_CONFIG[s].cls : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'}`}>
                              {GAP_STATE_CONFIG[s].label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  function renderAssumptions() {
    return (
      <div className="space-y-3">
        <p className="text-xs text-slate-500">List what you're assuming to be true. Rate the impact if the assumption turns out to be false.</p>
        {assumptions.map(a => (
          <div key={a.id} className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
            {editingId === a.id ? (
              <div className="flex-1 space-y-2">
                <input className={INPUT + ' bg-white'} value={editText} onChange={e => setEditText(e.target.value)} autoFocus />
                <div className="flex gap-2 items-center">
                  <span className="text-xs text-slate-500">If false:</span>
                  {(['low', 'medium', 'high'] as AssumptionImpact[]).map(imp => (
                    <button key={imp} onClick={() => setEditImpact(imp)}
                      className={`px-2 py-0.5 rounded text-xs font-medium border ${editImpact === imp ? IMPACT_CONFIG[imp].cls + ' border-transparent' : 'bg-white text-slate-400 border-slate-200'}`}>
                      {IMPACT_CONFIG[imp].label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { updateAssumption(a.id, editText, editImpact); setEditingId(null) }}
                    className="px-3 py-1 bg-indigo-600 text-white text-xs rounded-lg font-medium hover:bg-indigo-700">Save</button>
                  <button onClick={() => setEditingId(null)}
                    className="px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs rounded-lg hover:bg-slate-50">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 leading-snug">{a.text}</p>
                </div>
                <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium ${IMPACT_CONFIG[a.ifFalseImpact].cls}`}>
                  {IMPACT_CONFIG[a.ifFalseImpact].label}
                </span>
                <button onClick={() => { setEditingId(a.id); setEditText(a.text); setEditImpact(a.ifFalseImpact) }}
                  className="shrink-0 text-xs text-slate-400 hover:text-slate-700 px-1">Edit</button>
                <button onClick={() => removeAssumption(a.id)} className="shrink-0 text-slate-300 hover:text-red-500 transition-colors">
                  <X size={14} />
                </button>
              </>
            )}
          </div>
        ))}
        <div className="flex gap-2 items-start">
          <input className={INPUT + ' flex-1'} placeholder="e.g. Client will provide test data by sprint 2"
            value={newText} onChange={e => setNewText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && newText.trim()) { addAssumption(newText.trim(), newImpact); setNewText('') } }} />
          <div className="flex gap-1">
            {(['low', 'medium', 'high'] as AssumptionImpact[]).map(imp => (
              <button key={imp} onClick={() => setNewImpact(imp)}
                className={`px-2 py-2 rounded text-xs font-medium border ${newImpact === imp ? IMPACT_CONFIG[imp].cls + ' border-transparent' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-400'}`}>
                {IMPACT_CONFIG[imp].label}
              </button>
            ))}
          </div>
          <button onClick={() => { if (newText.trim()) { addAssumption(newText.trim(), newImpact); setNewText('') } }}
            disabled={!newText.trim()}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 ${newText.trim() ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
            <Plus size={14} /> Add
          </button>
        </div>
      </div>
    )
  }

  const BODY_RENDERERS: Record<SectionId, () => React.ReactNode> = {
    basics: renderBasics,
    work: renderWork,
    economics: renderEconomics,
    competitive: renderCompetitive,
    compliance: renderCompliance,
    geography: renderGeography,
    gaps: renderGaps,
    assumptions: renderAssumptions,
  }

  const isLastSection = (id: SectionId) => SECTION_ORDER.indexOf(id) === SECTION_ORDER.length - 1

  // ── Render ──────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {signals.length > 0 && <AutoSignalBanner signals={signals} />}

      {/* Accordion */}
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
        {SECTIONS.map(def => {
          const isOpen = openSection === def.id
          const isVisited = visited.has(def.id)
          const isComplete = isSectionComplete(def.id)
          const insight = isOpen ? getInsight(def.id) : null

          return (
            <div key={def.id}>
              <SectionHeader
                def={def}
                isOpen={isOpen}
                isVisited={isVisited}
                isComplete={isComplete && isVisited && !isOpen}
                summary={getSummary(def.id)}
                onClick={() => toggleSection(def.id)}
              />

              {isOpen && (
                <div className="px-5 pb-5 pt-2 space-y-4 border-t border-slate-100 bg-slate-50/40">
                  {BODY_RENDERERS[def.id]()}

                  {insight && <InsightCard insight={insight} />}

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => advanceSection(def.id)}
                      disabled={def.required && !isComplete}
                      className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        (!def.required || isComplete)
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {isLastSection(def.id) ? 'Done' : 'Save & Continue →'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Proceed */}
      <div className="flex justify-end pt-1">
        <button
          onClick={() => setCurrentStep(2)}
          disabled={!canProceed}
          className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${canProceed ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
        >
          {canProceed ? 'Continue to Risk Assessment →' : 'Complete sections 01 & 02 to proceed'}
        </button>
      </div>
    </div>
  )
}
