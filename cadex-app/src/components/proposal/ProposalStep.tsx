import { useState } from 'react'
import { useDealStore } from '../../store/dealStore'
import { generateProposalHtml } from '../../lib/proposalExport'
import { generateBriefHtml } from '../../lib/briefExport'
import { STRATEGIES } from '../../data/strategies'
import { WORK_TYPES } from '../../data/workTypes'
import { Download, ExternalLink, FileText, AlertTriangle, CheckCircle, Info, ClipboardList } from 'lucide-react'
import type { WorkTypeNode } from '../../types'

const SECTION = 'bg-white rounded-xl border border-slate-200 p-5'
const SECTION_TITLE = 'text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3'

const IMPACT_COLORS = {
  high:   'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low:    'bg-slate-100 text-slate-600',
}

const BAND_COLORS: Record<string, string> = {
  green: 'text-green-600',
  amber: 'text-amber-600',
  red: 'text-red-600',
  black: 'text-slate-900',
}

const BAND_LABELS: Record<string, string> = {
  green: 'Low Risk',
  amber: 'Moderate Risk',
  red: 'High Risk',
  black: 'Critical Risk',
}

export default function ProposalStep() {
  const { getActiveDeal } = useDealStore()
  const activeDeal = getActiveDeal()
  const [companyName, setCompanyName] = useState('')

  if (!activeDeal) return null

  const { meta, assessment, strategy, shaperLevers, checklist } = activeDeal
  const assumptions = activeDeal.assumptions ?? []
  const strategyCard = strategy?.primary ? STRATEGIES[strategy.primary] : null
  const workTypeLabel = (id: string) => WORK_TYPES.find((n: WorkTypeNode) => n.id === id)?.label ?? id

  const highAssumptions = assumptions.filter((a) => a.ifFalseImpact === 'high')

  const verdictConfig = {
    'go':          { color: 'text-green-700', bg: 'bg-green-50 border-green-200', label: 'Go' },
    'conditional': { color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', label: 'Conditional Go' },
    'no-go':       { color: 'text-red-700',   bg: 'bg-red-50 border-red-200',     label: 'No-Go' },
  }

  const handleOpenPreview = () => {
    const html = generateProposalHtml(activeDeal, companyName)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
    setTimeout(() => URL.revokeObjectURL(url), 10_000)
  }

  const handleDownload = () => {
    const html = generateProposalHtml(activeDeal, companyName)
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `proposal-${meta.name || 'deal'}-${new Date().toISOString().slice(0, 10)}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5">

      {/* Export controls */}
      <div className={SECTION}>
        <div className={SECTION_TITLE}>Export Proposal</div>
        <div className="flex items-end gap-4">
          <div className="flex-1 max-w-xs">
            <label className="text-xs font-medium text-slate-600 mb-1 block">Your company name</label>
            <input
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. GlobalLogic"
            />
          </div>
          <button
            onClick={handleOpenPreview}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ExternalLink size={15} /> Proposal Deck
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Download size={15} /> Download HTML
          </button>
          <button
            onClick={() => generateBriefHtml(activeDeal)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors"
          >
            <ClipboardList size={15} /> Export Brief
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-3 flex items-center gap-1.5">
          <Info size={11} />
          The exported HTML file is fully self-contained — share it, print to PDF, or open in any browser.
        </p>
      </div>

      {/* Preview: Deal Identity */}
      <div className={SECTION}>
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Proposal for</div>
            <div className="text-2xl font-bold text-slate-900">{meta.name || '—'}</div>
            <div className="text-slate-500 text-sm mt-0.5">{meta.clientName || 'Client not set'}</div>
          </div>
          <div className="text-right">
            {assessment?.scoreBand && (
              <div className={`text-2xl font-black ${BAND_COLORS[assessment.scoreBand]}`}>
                {assessment.weightedTotal}%
              </div>
            )}
            <div className="text-xs text-slate-400 mt-0.5">
              {assessment?.scoreBand ? BAND_LABELS[assessment.scoreBand] : 'Not scored'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="text-center">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Work type</div>
            <div className="text-sm font-semibold text-slate-800">
              {meta.workType ? workTypeLabel(meta.workType) : '—'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Pricing</div>
            <div className="text-sm font-semibold text-slate-800">
              {{
                'fixed-price': 'Fixed Price',
                'tm': 'T&M',
                'tm-cap': 'T&M Cap',
                'retainer': 'Retainer',
                'outcome': 'Outcome',
                'staff-aug': 'Staff Aug',
              }[meta.pricingModel] ?? meta.pricingModel}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Duration</div>
            <div className="text-sm font-semibold text-slate-800">
              {{ 'lt3m': '< 3mo', '3-6m': '3–6mo', '6-12m': '6–12mo', 'gt12m': '12+mo' }[meta.duration] ?? meta.duration}
            </div>
          </div>
        </div>
      </div>

      {/* Preview: Strategy */}
      <div className={SECTION}>
        <div className={SECTION_TITLE}>Engagement Strategy</div>
        {strategyCard ? (
          <div>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-base font-bold text-indigo-700">{strategyCard.name}</span>
              <span className="text-sm text-slate-500 italic">{strategyCard.tagline}</span>
            </div>
            <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3 italic border-l-4 border-indigo-300 leading-relaxed">
              {strategyCard.pitch.slice(0, 280)}{strategyCard.pitch.length > 280 ? '…' : ''}
            </p>
            {strategy?.rationale && strategy.rationale.length > 0 && (
              <div className="mt-3 space-y-1">
                {strategy.rationale.map((r, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <span className="text-indigo-400 mt-0.5">→</span> {r}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-slate-400 flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-400" />
            Complete the Risk Assessment to generate a strategy recommendation.
          </div>
        )}
      </div>

      {/* Preview: Commercial */}
      {(meta.quotedPriceK || meta.estimatedCostK) && (
        <div className={SECTION}>
          <div className={SECTION_TITLE}>Commercial Summary</div>
          <div className="grid grid-cols-3 gap-4">
            {meta.quotedPriceK && (
              <div className="text-center">
                <div className="text-2xl font-black text-slate-800">${meta.quotedPriceK.toLocaleString()}K</div>
                <div className="text-xs text-slate-500 mt-0.5">Quoted price</div>
              </div>
            )}
            {meta.estimatedCostK && meta.quotedPriceK && (
              <div className="text-center">
                <div className={`text-2xl font-black ${
                  Math.round(((meta.quotedPriceK - meta.estimatedCostK) / meta.quotedPriceK) * 100) >= 25 ? 'text-green-600'
                  : Math.round(((meta.quotedPriceK - meta.estimatedCostK) / meta.quotedPriceK) * 100) >= 15 ? 'text-amber-600'
                  : 'text-red-600'
                }`}>
                  {Math.round(((meta.quotedPriceK - meta.estimatedCostK) / meta.quotedPriceK) * 100)}%
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Gross margin</div>
              </div>
            )}
            {meta.contingencyPct && (
              <div className="text-center">
                <div className="text-2xl font-black text-slate-800">{meta.contingencyPct}%</div>
                <div className="text-xs text-slate-500 mt-0.5">Contingency</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Preview: Assumptions */}
      {assumptions.length > 0 && (
        <div className={SECTION}>
          <div className={SECTION_TITLE}>
            Scope Assumptions
            {highAssumptions.length > 0 && (
              <span className="ml-2 text-xs font-normal normal-case tracking-normal text-red-600">
                {highAssumptions.length} high-impact
              </span>
            )}
          </div>
          <div className="space-y-2">
            {assumptions.map((a) => (
              <div key={a.id} className="flex items-start gap-3 text-sm">
                <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium mt-0.5 ${IMPACT_COLORS[a.ifFalseImpact]}`}>
                  {a.ifFalseImpact.charAt(0).toUpperCase() + a.ifFalseImpact.slice(1)}
                </span>
                <span className="text-slate-700">{a.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview: Checker verdict */}
      {checklist && (
        <div className={SECTION}>
          <div className={SECTION_TITLE}>Quality Gate</div>
          <div className={`rounded-lg border p-4 flex items-center justify-between ${verdictConfig[checklist.verdict].bg}`}>
            <div className={`font-bold text-sm ${verdictConfig[checklist.verdict].color}`}>
              {verdictConfig[checklist.verdict].label}
            </div>
            <div className={`text-2xl font-black ${verdictConfig[checklist.verdict].color}`}>
              {Math.round(checklist.overallScore)}%
            </div>
          </div>
          {checklist.hardBlockers.length > 0 && (
            <div className="mt-2 text-xs text-red-600 flex items-center gap-1.5">
              <AlertTriangle size={12} />
              {checklist.hardBlockers.length} hard blocker{checklist.hardBlockers.length > 1 ? 's' : ''} unresolved
            </div>
          )}
        </div>
      )}

      {/* Preview: Deal levers */}
      {shaperLevers && shaperLevers.length > 0 && (
        <div className={SECTION}>
          <div className={SECTION_TITLE}>Top Deal Protections</div>
          <div className="space-y-3">
            {shaperLevers.slice(0, 4).map((lever) => (
              <div key={lever.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div className="font-semibold text-sm text-slate-800 mb-1">{lever.title}</div>
                <div className="text-xs text-slate-500">{lever.action}</div>
                {lever.contractLanguage && (
                  <div className="text-xs text-indigo-600 mt-1 italic">"{lever.contractLanguage}"</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completeness checklist */}
      <div className={SECTION}>
        <div className={SECTION_TITLE}>Proposal Completeness</div>
        <div className="space-y-2">
          {[
            { label: 'Deal name and client set',         done: !!(meta.name && meta.clientName) },
            { label: 'Scope summary written',            done: meta.scopeSummary.length > 20 },
            { label: 'Work type selected',               done: !!meta.workType },
            { label: 'Risk assessment completed',        done: !!assessment },
            { label: 'Strategy recommendation generated', done: !!strategy },
            { label: 'Deal levers shaped',               done: (shaperLevers?.length ?? 0) > 0 },
            { label: 'Quality gate completed',           done: !!checklist },
            { label: 'Bid economics entered',            done: !!(meta.quotedPriceK && meta.estimatedCostK) },
            { label: 'Scope assumptions logged',         done: assumptions.length > 0 },
          ].map(({ label, done }) => (
            <div key={label} className="flex items-center gap-2 text-sm">
              {done
                ? <CheckCircle size={15} className="text-green-500 shrink-0" />
                : <AlertTriangle size={15} className="text-slate-300 shrink-0" />
              }
              <span className={done ? 'text-slate-700' : 'text-slate-400'}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-center gap-4 pt-2 pb-6">
        <button
          onClick={handleOpenPreview}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <FileText size={16} /> Open Proposal Deck
        </button>
        <button
          onClick={() => generateBriefHtml(activeDeal)}
          className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors"
        >
          <ClipboardList size={16} /> Export Deal Brief
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Download size={16} /> Download HTML
        </button>
      </div>
    </div>
  )
}
