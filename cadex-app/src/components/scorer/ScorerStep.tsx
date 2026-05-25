import { useMemo, useState } from 'react'
import { useDealStore } from '../../store/dealStore'
import { QUESTIONS } from '../../data/questions'
import QuestionCard from './QuestionCard'
import RadarChart from '../shared/RadarChart'
import ScoreBadge from '../shared/ScoreBadge'


export default function ScorerStep() {
  const { getActiveDeal, setResponse, setCurrentStep } = useDealStore()
  const activeDeal = getActiveDeal()
  const meta = activeDeal?.meta
  const responses = activeDeal?.assessment?.responses ?? {}
  const assessment = activeDeal?.assessment

  // Filter questions relevant to this deal
  const questions = useMemo(() => {
    if (!meta) return QUESTIONS
    return QUESTIONS.filter((q) => {
      if (q.triggerWorkTypes && !q.triggerWorkTypes.includes(meta.workType)) return false
      return true
    })
  }, [meta])

  // Group by section
  const sections = useMemo(() => {
    const map = new Map<string, { title: string; questions: typeof questions }>()
    for (const q of questions) {
      if (!map.has(q.section)) map.set(q.section, { title: q.sectionTitle, questions: [] })
      map.get(q.section)!.questions.push(q)
    }
    return Array.from(map.entries())
  }, [questions])

  const [activeSection, setActiveSection] = useState(sections[0]?.[0] ?? 'A')

  const answered = questions.filter((q) => responses[q.id] !== undefined).length
  const progress = Math.round((answered / questions.length) * 100)

  const currentQuestions = sections.find(([id]) => id === activeSection)?.[1].questions ?? []

  const canScore = answered >= Math.ceil(questions.length * 0.6)

  return (
    <div className="flex gap-6">
      {/* Left — radar + section nav */}
      <div className="w-64 shrink-0 space-y-4">
        {/* Radar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Live Risk Profile</div>
          <RadarChart scores={assessment?.axisScores ?? {}} size={220} />
          {assessment && (
            <div className="mt-3 text-center">
              <ScoreBadge band={assessment.scoreBand} score={assessment.weightedTotal} />
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span>Progress</span>
            <span>{answered}/{questions.length}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Section nav */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {sections.map(([id, { title, questions: qs }]) => {
            const done = qs.every((q) => responses[q.id] !== undefined)
            const partial = qs.some((q) => responses[q.id] !== undefined)
            return (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm border-b border-slate-100 last:border-0 transition-colors ${activeSection === id ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${done ? 'bg-green-400' : partial ? 'bg-amber-400' : 'bg-slate-200'}`} />
                <span className="font-medium">{id}</span>
                <span className="text-xs text-slate-400 truncate">{title}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Right — questions */}
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Section {activeSection}
            </div>
            <div className="text-lg font-semibold text-slate-900">
              {sections.find(([id]) => id === activeSection)?.[1].title}
            </div>
          </div>
          {activeSection === 'I' && (
            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
              Internal only
            </span>
          )}
        </div>

        {currentQuestions.map((q) => (
          <QuestionCard
            key={q.id}
            question={q}
            value={responses[q.id]}
            onChange={(val) => setResponse(q.id, val)}
          />
        ))}

        {/* Section navigation */}
        <div className="flex justify-between pt-2">
          <button
            onClick={() => {
              const idx = sections.findIndex(([id]) => id === activeSection)
              if (idx > 0) setActiveSection(sections[idx - 1][0])
            }}
            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            ← Previous section
          </button>

          {activeSection === sections[sections.length - 1][0] ? (
            <button
              onClick={() => setCurrentStep(3)}
              disabled={!canScore}
              className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${canScore ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
            >
              View Strategy →
            </button>
          ) : (
            <button
              onClick={() => {
                const idx = sections.findIndex(([id]) => id === activeSection)
                setActiveSection(sections[idx + 1][0])
              }}
              className="px-4 py-2 text-sm text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50"
            >
              Next section →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
