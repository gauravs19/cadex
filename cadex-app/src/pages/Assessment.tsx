import { useDealStore } from '../store/dealStore'
import Sidebar from '../components/layout/Sidebar'
import IntakeForm from '../components/intake/IntakeForm'
import ScorerStep from '../components/scorer/ScorerStep'
import StrategyStep from '../components/strategy/StrategyStep'
import ShaperStep from '../components/shaper/ShaperStep'
import CheckerStep from '../components/checker/CheckerStep'
import ProposalStep from '../components/proposal/ProposalStep'

const STEP_TITLES = [
  '', // 0 unused
  'Deal Intake',
  'Risk Assessment',
  'Strategy Recommendation',
  'Deal Shaper',
  'Deal Checker',
  'Proposal',
]

const STEP_SUBTITLES = [
  '',
  'Capture deal context, work type, and key signals',
  'Score the deal across 8 risk dimensions',
  'Recommended engagement model and pitch',
  'Prioritised levers to shape the deal',
  '42-point quality gate before submission',
  'Draft, review, and export the engagement proposal',
]

export default function Assessment() {
  const { createDeal, importDeal, getActiveDeal, displayStep } = useDealStore()
  const activeDeal = getActiveDeal()

  if (!activeDeal) return null

  const step = displayStep

  const handleExport = () => {
    const json = JSON.stringify(activeDeal, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cadex-${activeDeal.meta.name || 'deal'}-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleLoadDeal = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const deal = JSON.parse(ev.target?.result as string)
          importDeal(deal)
        } catch {
          alert('Invalid CADEX deal file.')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        onNewDeal={() => createDeal()}
        onLoadDeal={handleLoadDeal}
        onExport={handleExport}
      />

      <main className="flex-1 overflow-y-auto bg-slate-50">
        {/* Step header */}
        <div className="bg-white border-b border-slate-200 px-8 py-5">
          <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-0.5">
            Step {step} of 6
          </div>
          <div className="text-xl font-bold text-slate-900">{STEP_TITLES[step]}</div>
          <div className="text-sm text-slate-500 mt-0.5">{STEP_SUBTITLES[step]}</div>
        </div>

        {/* Step content */}
        <div className="px-8 py-6 max-w-5xl">
          {step === 1 && <IntakeForm />}
          {step === 2 && <ScorerStep />}
          {step === 3 && <StrategyStep />}
          {step === 4 && <ShaperStep />}
          {step === 5 && <CheckerStep />}
          {step === 6 && <ProposalStep />}
        </div>
      </main>
    </div>
  )
}
