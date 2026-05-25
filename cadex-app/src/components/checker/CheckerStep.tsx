import { useState } from 'react'
import { useDealStore } from '../../store/dealStore'
import { CHECKLIST_SECTIONS, CHECKLIST_ITEMS } from '../../data/checklist'
import { AlertCircle, CheckCircle2, XCircle, AlertTriangle, MinusCircle, Lock } from 'lucide-react'
import type { CheckState } from '../../types'

type DisplayState = CheckState | 'unanswered'

const STATE_CONFIG: Record<DisplayState, { icon: typeof CheckCircle2; label: string; color: string }> = {
  pass:        { icon: CheckCircle2,  label: 'Pass',    color: 'text-green-600' },
  fail:        { icon: XCircle,       label: 'Fail',    color: 'text-red-600' },
  warning:     { icon: AlertTriangle, label: 'Warning', color: 'text-amber-600' },
  na:          { icon: MinusCircle,   label: 'N/A',     color: 'text-slate-400' },
  unanswered:  { icon: AlertCircle,   label: '?',       color: 'text-slate-300' },
}

const VERDICT_CONFIG = {
  'go':          { label: 'Go — Submit the proposal',         bg: 'bg-green-50',  border: 'border-green-300', text: 'text-green-800' },
  'conditional': { label: 'Conditional Go — resolve flagged items first', bg: 'bg-amber-50', border: 'border-amber-300', text: 'text-amber-800' },
  'no-go':       { label: 'No-Go — deal restructure required', bg: 'bg-red-50',   border: 'border-red-300',   text: 'text-red-800' },
}

export default function CheckerStep() {
  const { getActiveDeal, setCheckState, setCurrentStep } = useDealStore()
  const activeDeal = getActiveDeal()
  const checklist = activeDeal?.checklist
  const checks = checklist?.checks ?? {}
  const [activeSection, setActiveSection] = useState(CHECKLIST_SECTIONS[0].id)
  const [showInternal, setShowInternal] = useState(false)

  const getState = (id: string): DisplayState => checks[id]?.state ?? 'unanswered'
  const getNotes = (id: string): string => checks[id]?.notes ?? ''

  const handleState = (id: string, state: CheckState) => {
    setCheckState(id, state, getNotes(id))
  }

  const handleNotes = (id: string, notes: string) => {
    const s = getState(id)
    setCheckState(id, s === 'unanswered' ? 'warning' : s, notes)
  }

  const sectionsToShow = CHECKLIST_SECTIONS.filter((s) => !s.internalOnly || showInternal)
  const currentSection = CHECKLIST_SECTIONS.find((s) => s.id === activeSection)!
  const currentItems = CHECKLIST_ITEMS.filter((i) => i.sectionId === activeSection && (!i.internalOnly || showInternal))

  const getSectionScore = (sectionId: string) => {
    return checklist?.sectionScores?.[sectionId] ?? null
  }

  return (
    <div className="flex gap-6">
      {/* Left nav */}
      <div className="w-56 shrink-0 space-y-3">
        {/* Verdict */}
        {checklist && (
          <div className={`rounded-xl border p-4 ${VERDICT_CONFIG[checklist.verdict].bg} ${VERDICT_CONFIG[checklist.verdict].border}`}>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Verdict</div>
            <div className={`text-sm font-bold ${VERDICT_CONFIG[checklist.verdict].text}`}>
              {VERDICT_CONFIG[checklist.verdict].label}
            </div>
            <div className="text-2xl font-black text-slate-700 mt-2">{Math.round(checklist.overallScore)}%</div>
            <div className="h-2 bg-white/60 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full ${checklist.verdict === 'go' ? 'bg-green-500' : checklist.verdict === 'conditional' ? 'bg-amber-500' : 'bg-red-500'}`}
                style={{ width: `${checklist.overallScore}%` }}
              />
            </div>
          </div>
        )}

        {/* Section nav */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {sectionsToShow.map((section) => {
            const score = getSectionScore(section.id)
            const items = CHECKLIST_ITEMS.filter((i) => i.sectionId === section.id)
            const answered = items.filter((i) => getState(i.id) !== 'unanswered').length
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 text-left text-xs border-b border-slate-100 last:border-0 transition-colors ${activeSection === section.id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${answered === items.length ? 'bg-green-400' : answered > 0 ? 'bg-amber-400' : 'bg-slate-200'}`} />
                <span className="flex-1 font-medium truncate">{section.title}</span>
                {score !== null && (
                  <span className={`shrink-0 font-semibold ${score >= 85 ? 'text-green-600' : score >= 70 ? 'text-amber-600' : 'text-red-600'}`}>
                    {Math.round(score)}%
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Internal toggle */}
        <button
          onClick={() => setShowInternal((v) => !v)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs border transition-colors ${showInternal ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
        >
          <Lock size={12} />
          {showInternal ? 'Hide internal section' : 'Show internal section'}
        </button>
      </div>

      {/* Right — items */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold text-slate-900">{currentSection.title}</div>
            {currentSection.internalOnly && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full mt-1">
                <Lock size={10} /> Internal only — not shown in client exports
              </span>
            )}
          </div>
        </div>

        {/* Hard blockers */}
        {checklist?.hardBlockers && checklist.hardBlockers.filter((id) => CHECKLIST_ITEMS.find((i) => i.id === id)?.sectionId === activeSection).length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            <span className="font-semibold">Hard blocker — </span>this section contains a must-fix item. Deal cannot proceed until resolved.
          </div>
        )}

        <div className="space-y-3">
          {currentItems.map((item) => {
            const state = getState(item.id)
            const cfg = STATE_CONFIG[state]
            const Icon = cfg.icon
            const isBlocker = item.isHardBlocker

            return (
              <div key={item.id} className={`bg-white rounded-xl border p-4 ${isBlocker && state === 'fail' ? 'border-red-300' : 'border-slate-200'}`}>
                <div className="flex items-start gap-3">
                  <Icon size={18} className={`${cfg.color} shrink-0 mt-0.5`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-medium text-slate-800 leading-snug">
                        {item.text}
                        {isBlocker && <span className="ml-2 text-xs text-red-600 font-semibold">(Hard blocker)</span>}
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 leading-relaxed">{item.guidance}</div>

                    {/* State toggle */}
                    <div className="flex gap-1.5 mt-3">
                      {(['pass', 'warning', 'fail', 'na'] as CheckState[]).map((s) => {
                        const c = STATE_CONFIG[s]
                        const Ic = c.icon
                        return (
                          <button
                            key={s}
                            onClick={() => handleState(item.id, s)}
                            className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${state === s ? `${c.color} bg-slate-100 border-current` : 'text-slate-400 border-slate-200 hover:border-slate-300'}`}
                          >
                            <Ic size={11} />{c.label}
                          </button>
                        )
                      })}
                    </div>

                    {/* Notes */}
                    {state !== 'unanswered' && (
                      <input
                        className="mt-2 w-full text-xs border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-300"
                        placeholder="Add a note (optional)..."
                        value={getNotes(item.id)}
                        onChange={(e) => handleNotes(item.id, e.target.value)}
                      />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Section navigation */}
        <div className="flex justify-between pt-2">
          <button
            onClick={() => {
              const idx = sectionsToShow.findIndex((s) => s.id === activeSection)
              if (idx > 0) setActiveSection(sectionsToShow[idx - 1].id)
            }}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            ← Previous
          </button>
          {activeSection !== sectionsToShow[sectionsToShow.length - 1].id ? (
            <button
              onClick={() => {
                const idx = sectionsToShow.findIndex((s) => s.id === activeSection)
                setActiveSection(sectionsToShow[idx + 1].id)
              }}
              className="px-4 py-2 text-sm text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep(6)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              Draft Proposal →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
