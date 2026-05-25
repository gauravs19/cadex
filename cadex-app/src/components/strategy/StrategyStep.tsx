import { useDealStore } from '../../store/dealStore'
import { STRATEGIES } from '../../data/strategies'
import ScoreBadge from '../shared/ScoreBadge'
import RadarChart from '../shared/RadarChart'
import CoachingPanel from '../coaching/CoachingPanel'
import { ChevronRight, AlertCircle } from 'lucide-react'

const AXIS_LABELS: Record<string, string> = {
  SC: 'Scope Clarity', CM: 'Client Maturity', CR: 'Commercial Risk',
  TC: 'Technical Complexity', GR: 'Governance Readiness', SV: 'Strategic Value',
  CP: 'Competitive Position', VF: 'Vendor Capability Fit',
}

export default function StrategyStep() {
  const { getActiveDeal, setCurrentStep } = useDealStore()
  const activeDeal = getActiveDeal()
  const assessment = activeDeal?.assessment
  const strategyResult = activeDeal?.strategy

  if (!assessment || !strategyResult) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <AlertCircle size={32} className="mb-3" />
        <p className="text-sm">Complete the risk assessment first.</p>
        <button onClick={() => setCurrentStep(2)} className="mt-4 text-sm text-indigo-600 hover:underline">← Go to Risk Assessment</button>
      </div>
    )
  }

  const primary = STRATEGIES[strategyResult.primary]
  const alternative = strategyResult.alternative ? STRATEGIES[strategyResult.alternative] : null

  return (
    <div className="space-y-5">
      {/* Score summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Deal Risk Score</div>
            <ScoreBadge band={assessment.scoreBand} score={assessment.weightedTotal} size="lg" />
          </div>
          <RadarChart scores={assessment.axisScores} size={180} />
        </div>

        {/* Axis scores */}
        <div className="grid grid-cols-4 gap-3 mt-2">
          {Object.entries(assessment.axisScores).map(([axis, score]) => {
            const pct = ((score - 1) / 4) * 100
            const color = pct >= 70 ? 'bg-green-400' : pct >= 40 ? 'bg-amber-400' : 'bg-red-400'
            return (
              <div key={axis} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">{AXIS_LABELS[axis]}</span>
                  <span className="font-semibold text-slate-700">{score.toFixed(1)}</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Critical flags */}
        {assessment.criticalFlags.length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-xs font-semibold text-red-700 mb-1">Critical flags — must address</div>
            <ul className="space-y-1">
              {assessment.criticalFlags.map((f) => (
                <li key={f} className="text-xs text-red-600 flex items-start gap-1.5">
                  <span className="mt-0.5">•</span>{f}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Primary strategy card */}
      <div className="bg-white rounded-xl border-2 border-indigo-400 p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              Recommended Strategy · {primary.id}
            </div>
            <div className="text-xl font-bold text-slate-900">{primary.name}</div>
            <div className="text-sm text-slate-500 mt-0.5">{primary.tagline}</div>
          </div>
          <span className="text-3xl font-black text-indigo-200">{primary.id}</span>
        </div>

        {/* Rationale */}
        {strategyResult.rationale.length > 0 && (
          <div className="p-3 bg-indigo-50 rounded-lg">
            <div className="text-xs font-semibold text-indigo-700 mb-2">Why this deal needs this strategy</div>
            <ul className="space-y-1">
              {strategyResult.rationale.map((r, i) => (
                <li key={i} className="text-xs text-indigo-800 flex items-start gap-1.5">
                  <ChevronRight size={12} className="mt-0.5 shrink-0" />{r}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Competitive modifier */}
        {strategyResult.competitiveModifier && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
            <span className="font-semibold">Competitive posture: </span>{strategyResult.competitiveModifier}
          </div>
        )}

        {/* Pitch */}
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">The Pitch</div>
          <blockquote className="text-sm text-slate-700 italic leading-relaxed border-l-4 border-indigo-200 pl-4">
            {primary.pitch}
          </blockquote>
        </div>

        {/* Key moves */}
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Key Moves</div>
          <ol className="space-y-2">
            {primary.keyMoves.map((move, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="shrink-0 w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                {move}
              </li>
            ))}
          </ol>
        </div>

        {/* Contract non-negotiables */}
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Contract Non-Negotiables</div>
          <ul className="space-y-2">
            {primary.contractNonNegotiables.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="shrink-0 text-green-500 mt-0.5">✓</span>{item}
              </li>
            ))}
          </ul>
        </div>

        {/* Objections */}
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Objection Handlers</div>
          <div className="space-y-3">
            {primary.objections.map((obj, i) => (
              <div key={i} className="rounded-lg bg-slate-50 border border-slate-200 p-3">
                <div className="text-xs font-semibold text-slate-700 mb-1">"{obj.q}"</div>
                <div className="text-xs text-slate-600 leading-relaxed">{obj.a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Red flags */}
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Red Flags to Watch</div>
          <ul className="space-y-1">
            {primary.redFlags.map((flag, i) => (
              <li key={i} className="text-xs text-red-700 flex items-start gap-1.5">
                <span className="mt-0.5 text-red-400">⚑</span>{flag}
              </li>
            ))}
          </ul>
        </div>

        {/* Close */}
        <CoachingPanel tip={primary.close} title="The Close" />
      </div>

      {/* Alternative strategy */}
      {alternative && (
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Alternative Strategy · {alternative.id}</div>
          <div className="text-base font-bold text-slate-800">{alternative.name}</div>
          <div className="text-sm text-slate-500 mt-0.5 mb-3">{alternative.tagline}</div>
          <CoachingPanel tip={alternative.pitch} title="Alternative pitch" />
        </div>
      )}

      <div className="flex justify-end pt-2">
        <button onClick={() => setCurrentStep(4)} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
          View Deal Shaper →
        </button>
      </div>
    </div>
  )
}
