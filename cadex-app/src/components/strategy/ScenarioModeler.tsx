import { useState } from 'react'
import { SlidersHorizontal, RotateCcw } from 'lucide-react'
import type {
  AxisCode, AxisScores, Deal, DealMeta,
  EngagementType, DeliveryModel, Industry,
} from '../../types'
import { buildEffectiveWeights, computeWeightedTotal, getScoreBand } from '../../lib/scorer'
import { selectStrategy } from '../../lib/strategySelector'
import { STRATEGIES } from '../../data/strategies'
import ScoreBadge from '../shared/ScoreBadge'

const AXIS_CODES: AxisCode[] = ['SC', 'CM', 'CR', 'TC', 'GR', 'SV', 'CP', 'VF']
const AXIS_LABELS: Record<AxisCode, string> = {
  SC: 'Scope Clarity', CM: 'Client Maturity', CR: 'Commercial Risk',
  TC: 'Technical Complexity', GR: 'Governance Readiness',
  SV: 'Strategic Value', CP: 'Competitive Position', VF: 'Vendor Fit',
}

interface Props { deal: Deal }

export default function ScenarioModeler({ deal }: Props) {
  const [open, setOpen] = useState(false)
  const [axisOverrides, setAxisOverrides] = useState<Partial<AxisScores>>({})
  const [metaOverrides, setMetaOverrides] = useState<Partial<DealMeta>>({})

  const { assessment, meta, strategy } = deal
  if (!assessment) return null

  const hypoScores: AxisScores = { ...assessment.axisScores, ...axisOverrides }
  const hypoMeta: DealMeta = { ...meta, ...metaOverrides }
  const hypoTotal = computeWeightedTotal(hypoScores, hypoMeta)
  const hypoBand = getScoreBand(hypoTotal)
  const hypoStrategy = selectStrategy(hypoScores, hypoMeta, hypoTotal)

  const delta = hypoTotal - assessment.weightedTotal
  const hasChanges = Object.keys(axisOverrides).length > 0 || Object.keys(metaOverrides).length > 0
  const strategyChanged = hasChanges && hypoStrategy.primary !== strategy?.primary

  function reset() {
    setAxisOverrides({})
    setMetaOverrides({})
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors group"
      >
        <span className="flex items-center gap-2 text-sm text-slate-600">
          <SlidersHorizontal size={15} className="text-slate-400 group-hover:text-indigo-500" />
          <span className="font-medium text-slate-700">What-If Scenario Modeler</span>
          <span className="text-xs text-slate-400">— adjust scores or deal parameters to preview impact</span>
        </span>
        <span className="text-xs text-indigo-500 font-medium">Expand →</span>
      </button>
    )
  }

  // Effective weights for the current vs. hypothetical
  const currentWeights = buildEffectiveWeights(meta)
  const hypoWeights = buildEffectiveWeights(hypoMeta)

  return (
    <div className="bg-white rounded-xl border border-indigo-200 p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-0.5">What-If Scenario Modeler</div>
          <div className="text-xs text-slate-400">Adjustments are local — not saved to the deal</div>
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <button
              onClick={reset}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-red-600 px-2 py-1 rounded border border-slate-200 hover:border-red-300 transition-colors"
            >
              <RotateCcw size={11} /> Reset
            </button>
          )}
          <button
            onClick={() => setOpen(false)}
            className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 rounded border border-slate-200 transition-colors"
          >
            Collapse
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left: Axis sliders */}
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Axis Score Overrides</div>
          <div className="space-y-3">
            {AXIS_CODES.map(ax => {
              const current = assessment.axisScores[ax]
              const override = axisOverrides[ax]
              const display = override ?? current
              const pct = ((display - 1) / 4) * 100
              const changed = override !== undefined && override !== current
              const wDelta = ((hypoWeights[ax] ?? 0) - (currentWeights[ax] ?? 0)) * 100

              return (
                <div key={ax}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs ${changed ? 'text-indigo-700 font-medium' : 'text-slate-600'}`}>
                      {AXIS_LABELS[ax]}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {Math.abs(wDelta) > 0.5 && (
                        <span className={`text-xs ${wDelta > 0 ? 'text-indigo-500' : 'text-slate-400'}`}>
                          w{wDelta > 0 ? '+' : ''}{wDelta.toFixed(0)}%
                        </span>
                      )}
                      {changed && (
                        <span className="text-xs text-slate-400 line-through">{current.toFixed(1)}</span>
                      )}
                      <span className={`text-xs font-bold w-8 text-right ${pct >= 70 ? 'text-green-600' : pct >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
                        {display.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <input
                    type="range" min={1} max={5} step={0.5}
                    value={display}
                    onChange={e => setAxisOverrides(prev => ({
                      ...prev, [ax]: parseFloat(e.target.value),
                    }))}
                    className="w-full h-1.5 accent-indigo-600"
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: Meta params + result */}
        <div className="space-y-4">
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Deal Parameter Overrides</div>
            <div className="space-y-2.5">

              <div>
                <label className="text-xs text-slate-500">Engagement type</label>
                <select
                  className="mt-1 w-full text-xs border border-slate-200 rounded-md px-2 py-1.5 bg-white"
                  value={metaOverrides.engagementType ?? meta.engagementType}
                  onChange={e => setMetaOverrides(prev => ({ ...prev, engagementType: e.target.value as EngagementType }))}
                >
                  <option value="fixed-agile">Fixed Price / Agile</option>
                  <option value="fixed-scope">Fixed Price / Fixed Scope</option>
                  <option value="tm">Time & Materials</option>
                  <option value="outcome">Outcome / Value-Based</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-500">Delivery model</label>
                <select
                  className="mt-1 w-full text-xs border border-slate-200 rounded-md px-2 py-1.5 bg-white"
                  value={metaOverrides.deliveryModel ?? meta.deliveryModel}
                  onChange={e => setMetaOverrides(prev => ({ ...prev, deliveryModel: e.target.value as DeliveryModel }))}
                >
                  <option value="onshore">Onshore</option>
                  <option value="nearshore">Nearshore</option>
                  <option value="offshore">Offshore</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-500">Industry</label>
                <select
                  className="mt-1 w-full text-xs border border-slate-200 rounded-md px-2 py-1.5 bg-white"
                  value={metaOverrides.industry ?? meta.industry}
                  onChange={e => setMetaOverrides(prev => ({ ...prev, industry: e.target.value as Industry }))}
                >
                  <option value="bfsi">BFSI</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="retail">Retail</option>
                  <option value="tech">Technology</option>
                  <option value="public-sector">Public Sector</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-500">
                  Timezone overlap&nbsp;
                  <span className="font-semibold text-slate-700">
                    {metaOverrides.timezoneOverlapHours ?? meta.timezoneOverlapHours}h
                  </span>
                </label>
                <input
                  type="range" min={0} max={12} step={1}
                  value={metaOverrides.timezoneOverlapHours ?? meta.timezoneOverlapHours}
                  onChange={e => setMetaOverrides(prev => ({ ...prev, timezoneOverlapHours: parseInt(e.target.value) }))}
                  className="w-full h-1.5 accent-indigo-600 mt-1"
                />
              </div>
            </div>
          </div>

          {/* Outcome panel */}
          <div className={`rounded-xl p-4 border ${hasChanges ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-200'}`}>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Hypothetical Outcome</div>

            <div className="flex items-center gap-3 mb-3">
              <ScoreBadge band={hypoBand} score={hypoTotal} size="lg" />
              {hasChanges && (
                <div className={`text-xl font-black ${delta > 0 ? 'text-green-600' : delta < 0 ? 'text-red-600' : 'text-slate-400'}`}>
                  {delta > 0 ? '+' : ''}{delta.toFixed(0)}%
                </div>
              )}
            </div>

            {hypoStrategy && (
              <div className="text-xs space-y-1">
                <div>
                  <span className="text-slate-500">Strategy: </span>
                  <span className="font-semibold text-indigo-700">
                    {hypoStrategy.primary} — {STRATEGIES[hypoStrategy.primary]?.name}
                  </span>
                </div>
                {strategyChanged && (
                  <div className="text-amber-700 font-medium">
                    ⚑ Strategy shifts from {strategy?.primary} → {hypoStrategy.primary}
                  </div>
                )}
              </div>
            )}

            {!hasChanges && (
              <div className="text-xs text-slate-400 italic">Adjust sliders above to preview impact</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
