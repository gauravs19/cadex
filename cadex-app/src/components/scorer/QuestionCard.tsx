import CoachingPanel from '../coaching/CoachingPanel'
import type { Question } from '../../types'

interface Props {
  question: Question
  value: number | undefined
  onChange: (val: number) => void
}

export default function QuestionCard({ question, value, onChange }: Props) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            {question.section} · {question.axis}
          </span>
          <p className="text-sm font-medium text-slate-800 mt-1 leading-snug">{question.text}</p>
        </div>
        {value !== undefined && (
          <span className="shrink-0 text-2xl font-bold text-indigo-600">{value}</span>
        )}
      </div>

      {/* Scale */}
      <div className="grid grid-cols-5 gap-1.5">
        {question.scaleLabels.map((label, i) => {
          const score = i + 1
          const active = value === score
          return (
            <button
              key={score}
              onClick={() => onChange(score)}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border text-center transition-all ${
                active
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50'
              }`}
            >
              <span className={`text-lg font-bold leading-none ${active ? 'text-white' : 'text-slate-400'}`}>{score}</span>
              <span className="text-xs leading-tight">{label}</span>
            </button>
          )
        })}
      </div>

      <CoachingPanel tip={question.coachingTip} />
    </div>
  )
}
