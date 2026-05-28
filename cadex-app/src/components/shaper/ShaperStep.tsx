import { useDealStore } from '../../store/dealStore'
import { AlertCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import type { LeverResult } from '../../types'

const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  scope:        { label: 'Scope',        color: 'text-blue-700',  bg: 'bg-blue-50 border-blue-200' },
  commercial:   { label: 'Commercial',   color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  governance:   { label: 'Governance',   color: 'text-violet-700',bg: 'bg-violet-50 border-violet-200' },
  risk:         { label: 'Risk',         color: 'text-red-700',   bg: 'bg-red-50 border-red-200' },
  relationship: { label: 'Relationship', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
}

function LeverCard({ lever, rank }: { lever: LeverResult; rank: number }) {
  const [open, setOpen] = useState(false)
  const cat = CATEGORY_CONFIG[lever.category] ?? { label: lever.category, color: 'text-slate-700', bg: 'bg-slate-50 border-slate-200' }

  return (
    <div className={`rounded-xl border p-4 ${cat.bg}`}>
      <div className="flex items-start gap-3">
        <span className="shrink-0 w-6 h-6 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-500 flex items-center justify-center mt-0.5">
          {rank}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold uppercase tracking-wide ${cat.color}`}>{cat.label}</span>
          </div>
          <div className="text-sm font-semibold text-slate-800">{lever.title}</div>
          <div className="text-xs text-slate-600 mt-1 leading-relaxed">{lever.rationale}</div>

          <button onClick={() => setOpen((o) => !o)} className={`mt-2 flex items-center gap-1 text-xs font-medium ${cat.color} hover:opacity-80`}>
            {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {open ? 'Hide details' : 'How to apply'}
          </button>

          {open && (
            <div className="mt-3 space-y-3">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Action</div>
                <div className="text-xs text-slate-700 leading-relaxed">{lever.action}</div>
              </div>
              {lever.contractLanguage && (
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Contract language</div>
                  <div className="bg-white rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-700 font-mono leading-relaxed">
                    {lever.contractLanguage}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ShaperStep() {
  const { getActiveDeal, setCurrentStep } = useDealStore()
  const activeDeal = getActiveDeal()
  const levers = activeDeal?.shaperLevers ?? []
  const [filter, setFilter] = useState<string>('all')

  if (levers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <AlertCircle size={32} className="mb-3" />
        <p className="text-sm">Complete the risk assessment to see deal shaping levers.</p>
        <button onClick={() => setCurrentStep(2)} className="mt-4 text-sm text-indigo-600 hover:underline">← Go to Risk Assessment</button>
      </div>
    )
  }

  const categories = ['all', ...Array.from(new Set(levers.map((l) => l.category)))]
  const visible = filter === 'all' ? levers : levers.filter((l) => l.category === filter)

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="text-sm font-semibold text-slate-900 mb-1">Deal Shaping Levers</div>
        <div className="text-xs text-slate-500">
          {levers.length} levers identified, ranked by impact for this deal's risk profile. Expand each to see how to apply it and suggested contract language.
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize ${filter === cat ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}
          >
            {cat === 'all' ? `All (${levers.length})` : `${CATEGORY_CONFIG[cat]?.label ?? cat} (${levers.filter((l) => l.category === cat).length})`}
          </button>
        ))}
      </div>

      {/* Lever cards */}
      <div className="space-y-3">
        {visible.map((lever, i) => (
          <LeverCard key={lever.id} lever={lever} rank={i + 1} />
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <button onClick={() => setCurrentStep(5)} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
          Run Deal Checker →
        </button>
      </div>
    </div>
  )
}
