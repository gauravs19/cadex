import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDealStore } from '../store/dealStore'
import Sidebar from '../components/layout/Sidebar'
import IntakeForm from '../components/intake/IntakeForm'
import ScorerStep from '../components/scorer/ScorerStep'
import StrategyStep from '../components/strategy/StrategyStep'
import ShaperStep from '../components/shaper/ShaperStep'
import CheckerStep from '../components/checker/CheckerStep'
import ProposalStep from '../components/proposal/ProposalStep'
import { exportDealJson, parseDealJson, copyShareLinkToClipboard } from '../lib/dealIO'
import { Share2, Check } from 'lucide-react'
import HelpModal from '../components/layout/HelpModal'

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
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)

  if (!activeDeal) return null

  const step = displayStep

  const handleExport = () => exportDealJson(activeDeal)

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
          const deal = parseDealJson(ev.target?.result as string)
          importDeal(deal)
          navigate('/deal')
        } catch (err) {
          alert(err instanceof Error ? err.message : 'Invalid CADEX deal file.')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const handleCopyLink = async () => {
    try {
      await copyShareLinkToClipboard(activeDeal)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      alert('Could not copy link — your browser may not support clipboard access.')
    }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar
        onNewDeal={() => { createDeal(); navigate('/deal') }}
        onLoadDeal={handleLoadDeal}
        onExport={handleExport}
        onHelp={() => setHelpOpen(true)}
      />
      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}

      <main className="flex-1 overflow-y-auto bg-slate-50">
        {/* Step header */}
        <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-start justify-between">
          <div>
            <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-0.5">
              Step {step} of 6
            </div>
            <div className="text-xl font-bold text-slate-900">{STEP_TITLES[step]}</div>
            <div className="text-sm text-slate-500 mt-0.5">{STEP_SUBTITLES[step]}</div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <button
              onClick={handleCopyLink}
              title="Copy shareable link to clipboard"
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-indigo-300 transition-colors"
            >
              {copied ? <Check size={13} className="text-green-600" /> : <Share2 size={13} />}
              {copied ? 'Copied!' : 'Share deal'}
            </button>
          </div>
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
