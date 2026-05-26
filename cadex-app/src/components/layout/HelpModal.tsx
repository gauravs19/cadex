import { X, ArrowRight } from 'lucide-react'

interface Props {
  onClose: () => void
}

const STEPS = [
  {
    num: '01', label: 'Deal Intake', time: '~5 min',
    color: 'bg-indigo-100 text-indigo-700',
    do: 'Enter deal name, client, work type (L1→L2→L3), pricing model, competitive situation, compliance requirements, and delivery geography.',
    get: 'Contextualised scope questions + auto-risk signals',
  },
  {
    num: '02', label: 'Risk Assessment', time: '~15 min',
    color: 'bg-violet-100 text-violet-700',
    do: 'Answer 60+ calibrated questions across 9 sections. Work-type-specific questions load automatically for AI, ERP, security, and migration deals.',
    get: 'Weighted risk score across 8 axes + risk band',
  },
  {
    num: '03', label: 'Strategy', time: '~2 min',
    color: 'bg-amber-100 text-amber-700',
    do: 'Review the algorithmically matched engagement model. Use the What-If Modeler to preview how changes shift your strategy.',
    get: 'Strategy card: pitch · key moves · contract non-negotiables · win themes · objection handlers',
  },
  {
    num: '04', label: 'Deal Shaper', time: '~5 min',
    color: 'bg-orange-100 text-orange-700',
    do: 'Review ranked levers to reshape the deal before you bid. Each lever has a specific action and suggested contract language.',
    get: 'Prioritised action list with contract language',
  },
  {
    num: '05', label: 'Gate + Export', time: '~10 min',
    color: 'bg-green-100 text-green-700',
    do: 'Work through the 42-point quality gate. Mark each item Pass / Fail / Warning / N/A. Resolve any hard blockers.',
    get: 'Verdict (Go / Conditional / No-Go) + deal brief · proposal deck · share link · JSON',
  },
]

const BANDS = [
  { band: 'Green', range: '≥ 75%', bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500', action: 'Proceed to proposal. Review hard blockers and shape before submission.' },
  { band: 'Amber', range: '50–74%', bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500', action: 'Shape the deal first. Address the top-ranked levers before committing to a price or model.' },
  { band: 'Red', range: '25–49%', bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500', action: 'High risk. Escalate. Consider Strategy A (discovery phase) or F (no-bid / counter).' },
  { band: 'Black', range: '< 25%', bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-500', action: 'No-bid recommended. Use Strategy F with a counter-proposal if the relationship matters.' },
]

const AXES = [
  { code: 'SC', name: 'Scope Clarity', tip: 'Heaviest weight on fixed-price. Low score = use Strategy A (discovery).' },
  { code: 'CM', name: 'Client Maturity', tip: 'Covers agile readiness, stakeholder alignment, decision-making speed.' },
  { code: 'CR', name: 'Commercial Risk', tip: 'Margin health, contingency, payment structure, Phase 2 visibility.' },
  { code: 'TC', name: 'Technical Complexity', tip: 'Integration depth, legacy exposure, data quality, third-party risk.' },
  { code: 'GR', name: 'Governance Readiness', tip: 'Named PO availability is a hard blocker. Covers decision cycle and sprint review commitment.' },
  { code: 'SV', name: 'Strategic Value', tip: 'Logo value, renewal potential, portfolio fit. Informs the no-bid threshold.' },
  { code: 'CP', name: 'Competitive Position', tip: 'Win probability, differentiation quality, comparable reference availability.' },
  { code: 'VF', name: 'Vendor Capability Fit', tip: 'Internal only — hidden from all client-facing exports. Delivery readiness and staffing confidence.' },
]

const TIPS = [
  { icon: '💡', tip: 'You can navigate back to any completed step using the sidebar — scores and answers are preserved.' },
  { icon: '🔗', tip: 'Use "Share deal" (top-right of every step) to copy a URL that restores the full deal in any browser — no account needed.' },
  { icon: '📄', tip: '"Export Brief" generates a print-ready A4 summary from your qualified deal. Share it before the sign-off meeting.' },
  { icon: '⚡', tip: 'Quick Score uses 14 high-signal questions instead of 60+. Use it for rapid triage before deciding whether to invest in a full assessment.' },
  { icon: '🔄', tip: 'The What-If Scenario Modeler (Step 3) lets you preview how changing pricing model, engagement type, or scope confidence shifts your strategy — before you commit.' },
  { icon: '🚫', tip: 'Hard blockers in the Deal Checker cannot be bypassed. Resolve them first — they exist because historically they predict delivery failure.' },
]

export default function HelpModal({ onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
          <div>
            <div className="text-lg font-bold text-slate-900">CADEX — How it works</div>
            <div className="text-xs text-slate-400 mt-0.5">Five steps from first signal to submission-ready</div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-7">

          {/* Five steps */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">The five steps</div>
            <div className="space-y-2">
              {STEPS.map((s, i) => (
                <div key={s.num} className="flex gap-3 items-start">
                  <div className="flex items-center gap-1 shrink-0 pt-0.5">
                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-black ${s.color}`}>
                      {s.num}
                    </span>
                    {i < STEPS.length - 1 && (
                      <ArrowRight size={12} className="text-slate-300 hidden sm:block" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-bold text-slate-800">{s.label}</span>
                      <span className="text-xs text-slate-400 font-medium shrink-0">{s.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed mb-1.5">{s.do}</p>
                    <div className="text-xs font-semibold text-indigo-600">→ {s.get}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Risk bands */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Risk bands</div>
            <div className="grid grid-cols-2 gap-2">
              {BANDS.map(b => (
                <div key={b.band} className={`rounded-xl px-4 py-3 border ${b.bg} border-transparent`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2.5 h-2.5 rounded-full ${b.dot}`}></span>
                    <span className={`text-sm font-bold ${b.text}`}>{b.band}</span>
                    <span className={`text-xs font-medium ${b.text} opacity-60`}>{b.range}</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${b.text} opacity-80`}>{b.action}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Axes */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">8 risk axes (scores 1–5)</div>
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              {AXES.map((a, i) => (
                <div key={a.code} className={`flex gap-3 px-4 py-2.5 items-start ${i < AXES.length - 1 ? 'border-b border-slate-100' : ''} ${a.code === 'VF' ? 'opacity-60' : ''}`}>
                  <span className="font-black text-amber-500 text-sm w-7 shrink-0 mt-0.5 font-mono">{a.code}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-800 leading-tight">
                      {a.name}
                      {a.code === 'VF' && <span className="ml-2 text-xs font-normal text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">internal only</span>}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{a.tip}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Tips</div>
            <div className="space-y-2">
              {TIPS.map((t, i) => (
                <div key={i} className="flex gap-3 items-start bg-slate-50 rounded-xl px-4 py-2.5 border border-slate-100">
                  <span className="text-base shrink-0 mt-0.5">{t.icon}</span>
                  <p className="text-xs text-slate-600 leading-relaxed">{t.tip}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 shrink-0 flex items-center justify-between">
          <span className="text-xs text-slate-400">CADEX v0.6 · Free, browser-only · No data leaves your device</span>
          <button
            onClick={onClose}
            className="text-xs font-semibold bg-slate-900 text-white px-4 py-1.5 rounded-lg hover:opacity-80 transition-opacity"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  )
}
