import { useDealStore } from '../../store/dealStore'
import { STRATEGIES } from '../../data/strategies'
import { OBJECTION_BANK } from '../../data/objectionBank'
import ScoreBadge from '../shared/ScoreBadge'
import RadarChart from '../shared/RadarChart'
import CoachingPanel from '../coaching/CoachingPanel'
import ScenarioModeler from './ScenarioModeler'
import { ChevronRight, AlertCircle } from 'lucide-react'
import { generatePursuitTimeline } from '../../lib/pursuitTimeline'
import type { TimelineActivityStatus, TimelineOwner } from '../../lib/pursuitTimeline'
import { generateWinThemes } from '../../lib/winThemeEngine'

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
  const timeline = activeDeal ? generatePursuitTimeline(activeDeal) : []
  const winThemes = activeDeal ? generateWinThemes(
    strategyResult,
    { workCategory: activeDeal.meta.workCategory, competitiveSituation: activeDeal.meta.competitiveSituation, industry: activeDeal.meta.industry },
    assessment.axisScores,
  ) : []

  const deadline = activeDeal?.meta.proposalDeadline
  const deadlineDate = deadline ? new Date(deadline) : null
  const deadlineValid = deadlineDate !== null && !isNaN(deadlineDate.getTime())
  const daysUntilDeadline = deadlineValid
    ? Math.ceil((deadlineDate!.getTime() - new Date().setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24))
    : null

  const statusDot: Record<TimelineActivityStatus, string> = {
    done: 'bg-green-500',
    overdue: 'bg-red-500',
    'due-soon': 'bg-amber-400',
    upcoming: 'bg-slate-300',
    'no-deadline': 'bg-slate-300',
  }

  const statusText: Record<TimelineActivityStatus, string> = {
    done: 'text-slate-400',
    overdue: 'text-red-700 font-semibold',
    'due-soon': 'text-amber-700',
    upcoming: 'text-slate-600',
    'no-deadline': 'text-slate-500',
  }

  const ownerPill: Record<TimelineOwner, string> = {
    presales: 'bg-indigo-100 text-indigo-700',
    delivery: 'bg-blue-100 text-blue-700',
    account: 'bg-purple-100 text-purple-700',
    leadership: 'bg-red-100 text-red-700',
  }

  function formatDate(iso: string | null): string {
    if (!iso) return '—'
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="space-y-5">
      {/* Pursuit Timeline */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Pursuit Timeline</div>
            {daysUntilDeadline === null ? (
              <div className="text-sm text-slate-400">No deadline set</div>
            ) : daysUntilDeadline < 0 ? (
              <div className="text-sm font-semibold text-red-600">Deadline passed {Math.abs(daysUntilDeadline)} day{Math.abs(daysUntilDeadline) !== 1 ? 's' : ''} ago</div>
            ) : (
              <div className="text-sm text-slate-700">
                <span className="font-semibold">{daysUntilDeadline}</span> day{daysUntilDeadline !== 1 ? 's' : ''} until deadline
                {deadlineValid && (
                  <span className="text-slate-400 ml-1">· {formatDate(deadline ?? null)}</span>
                )}
              </div>
            )}
          </div>
          <div className="flex gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-green-500" />Done</span>
            <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-red-500" />Overdue</span>
            <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-full bg-amber-400" />Due soon</span>
          </div>
        </div>
        <div className="space-y-2">
          {timeline.map(activity => (
            <div key={activity.id} className="flex items-start gap-3 py-1.5 border-b border-slate-50 last:border-0">
              {/* Status dot */}
              <div className="mt-1 shrink-0">
                <span className={`inline-block w-2.5 h-2.5 rounded-full ${statusDot[activity.status]}`} />
              </div>
              {/* Activity info */}
              <div className="flex-1 min-w-0">
                <div className={`text-sm ${statusText[activity.status]} ${activity.status === 'done' ? 'line-through' : ''}`}>
                  {activity.name}
                  {activity.isBlocking && activity.status === 'overdue' && (
                    <span className="ml-1.5 text-xs font-bold text-red-600 uppercase">blocking</span>
                  )}
                </div>
                <div className="text-xs text-slate-400 italic mt-0.5 leading-snug">{activity.detail}</div>
              </div>
              {/* Owner + date */}
              <div className="shrink-0 flex flex-col items-end gap-1">
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${ownerPill[activity.owner]}`}>
                  {activity.owner}
                </span>
                <span className="text-xs text-slate-400">{formatDate(activity.targetDate)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

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

      {/* What-if scenario modeler */}
      {activeDeal && <ScenarioModeler deal={activeDeal} />}

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

        {/* Objections (strategy + work-category bank) */}
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Objection Handlers</div>
          <div className="space-y-3">
            {[
              ...primary.objections,
              ...(activeDeal?.meta.workCategory ? (OBJECTION_BANK[activeDeal.meta.workCategory] ?? []) : []),
            ].slice(0, 5).map((obj, i) => (
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

        {/* Win Themes */}
        {winThemes.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Win Themes for This Deal</div>
            <div className="space-y-3">
              {winThemes.map(theme => {
                const angleColors: Record<string, string> = {
                  risk: 'border-red-200 bg-red-50',
                  expertise: 'border-blue-200 bg-blue-50',
                  commercial: 'border-green-200 bg-green-50',
                  speed: 'border-purple-200 bg-purple-50',
                  partnership: 'border-amber-200 bg-amber-50',
                }
                const angleLabels: Record<string, string> = {
                  risk: 'Risk Reduction', expertise: 'Expertise', commercial: 'Commercial',
                  speed: 'Speed to Value', partnership: 'Partnership'
                }
                return (
                  <div key={theme.id} className={`rounded-lg border p-3 ${angleColors[theme.angle]}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-600">{angleLabels[theme.angle]}</span>
                    </div>
                    <div className="text-sm font-semibold text-slate-800 mb-1">{theme.headline}</div>
                    <div className="text-xs text-slate-600 leading-relaxed">{theme.body}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

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
