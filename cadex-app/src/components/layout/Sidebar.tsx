import { CheckCircle, Circle, Loader, AlertCircle, HelpCircle } from 'lucide-react'
import { useDealStore } from '../../store/dealStore'
import { getAllQuestionsForDeal } from '../../data/questions'

const STEPS = [
  { id: 1, label: 'Intake',    sub: 'Deal context' },
  { id: 2, label: 'Score',     sub: 'Risk assessment' },
  { id: 3, label: 'Strategy',  sub: 'Engagement model' },
  { id: 4, label: 'Shape',     sub: 'Deal levers' },
  { id: 5, label: 'Check',     sub: 'Quality gate' },
  { id: 6, label: 'Proposal',  sub: 'Draft & export' },
]

interface Props {
  onNewDeal: () => void
  onLoadDeal: () => void
  onExport: () => void
  onHelp: () => void
}

export default function Sidebar({ onNewDeal, onLoadDeal, onExport, onHelp }: Props) {
  const { getActiveDeal, setDisplayStep, displayStep } = useDealStore()
  const activeDeal = getActiveDeal()
  const current = displayStep                     // highlights the step currently visible
  const maxReached = activeDeal?.currentStep ?? 1 // furthest step legitimately reached

  // Count answered questions for scorer progress
  const answeredQ = activeDeal
    ? Object.keys(activeDeal.assessment?.responses ?? {}).length : 0
  const totalQ = activeDeal
    ? getAllQuestionsForDeal(activeDeal.meta.workType).filter(q => !q.triggerWorkTypes || q.triggerWorkTypes.includes(activeDeal.meta.workType)).length
    : 0
  const scorerPartial = answeredQ > 0 && maxReached < 3

  // Step is "complete" only once the user has explicitly advanced past it
  const isComplete = (step: number) => {
    if (!activeDeal) return false
    if (step === 1) return maxReached >= 2
      && !!activeDeal.meta.name && !!activeDeal.meta.clientName && !!activeDeal.meta.workType
    if (step === 2) return maxReached >= 3 && !!activeDeal.assessment
    if (step === 3) return maxReached >= 4 && !!activeDeal.strategy
    if (step === 4) return maxReached >= 5 && (activeDeal.shaperLevers?.length ?? 0) > 0
    if (step === 5) return maxReached >= 6 && !!activeDeal.checklist
    if (step === 6) return maxReached >= 6
    return false
  }

  return (
    <aside className="w-56 shrink-0 bg-slate-900 text-white flex flex-col min-h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-700">
        <div className="text-lg font-bold tracking-wide text-white">CADEX</div>
        <div className="text-xs text-slate-400 mt-0.5">Deal Advisor v0.6</div>
      </div>

      {/* Deal name */}
      {activeDeal?.meta.name && (
        <div className="px-5 py-3 border-b border-slate-700">
          <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Active deal</div>
          <div className="text-sm text-white font-medium truncate">{activeDeal.meta.name}</div>
          {activeDeal.meta.clientName && (
            <div className="text-xs text-slate-400 truncate">{activeDeal.meta.clientName}</div>
          )}
        </div>
      )}

      {/* Steps */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {STEPS.map((step) => {
          const done = isComplete(step.id)
          const active = current === step.id
          // A step is reachable only once the user has explicitly advanced past the previous one
          const accessible = step.id <= maxReached

          return (
            <button
              key={step.id}
              onClick={() => accessible && setDisplayStep(step.id)}
              disabled={!accessible}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                active
                  ? 'bg-indigo-600 text-white'
                  : accessible
                  ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  : 'text-slate-600 cursor-not-allowed'
              }`}
            >
              <span className="shrink-0">
                {done ? (
                  <CheckCircle size={16} className="text-green-400" />
                ) : active ? (
                  <Loader size={16} className="text-white animate-spin" />
                ) : step.id === 2 && scorerPartial ? (
                  <AlertCircle size={16} className="text-amber-400" />
                ) : (
                  <Circle size={16} className={accessible ? 'text-slate-400' : 'text-slate-700'} />
                )}
              </span>
              <span className="flex-1 min-w-0">
                <div className="text-sm font-medium leading-tight">{step.label}</div>
                <div className={`text-xs leading-tight ${active ? 'text-indigo-200' : 'text-slate-500'}`}>
                  {step.id === 2 && scorerPartial
                    ? `${answeredQ}/${totalQ} answered`
                    : step.sub}
                </div>
              </span>
            </button>
          )
        })}
      </nav>

      {/* Actions */}
      <div className="px-3 pb-5 space-y-1 border-t border-slate-700 pt-3">
        <button
          onClick={onNewDeal}
          className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
        >
          + New deal
        </button>
        <button
          onClick={onLoadDeal}
          className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
        >
          Load deal
        </button>
        {activeDeal && (
          <button
            onClick={onExport}
            className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors"
          >
            Export JSON
          </button>
        )}
        <button
          onClick={onHelp}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors mt-1"
        >
          <HelpCircle size={14} />
          Help &amp; reference
        </button>
      </div>
    </aside>
  )
}
