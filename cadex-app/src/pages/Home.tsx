import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDealStore } from '../store/dealStore'
import { Zap, ClipboardList, BarChart3, FolderOpen, ArrowRight, PlayCircle, RotateCcw } from 'lucide-react'
import type { Deal } from '../types'
import Tour, { type TourStep } from '../components/layout/Tour'

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Welcome to CADEX',
    body: 'CADEX is a 5-step deal qualification framework for IT consulting presales. This 60-second tour covers the essentials — or press Esc to skip.',
  },
  {
    target: 'process-flow',
    title: 'Your roadmap — five steps',
    body: 'Every deal moves through these five steps. Each one builds on the last. The full flow takes ~25–35 minutes. You can pause and resume at any time — state is saved in your browser.',
    placement: 'bottom',
  },
  {
    target: 'full-assessment',
    title: 'Full Assessment — start here',
    body: 'The complete qualification: 60+ risk questions across 9 sections, strategy recommendation, deal shaper levers, and a 42-point quality gate. Use this for any deal worth serious proposal effort.',
    placement: 'bottom',
  },
  {
    target: 'quick-score',
    title: 'Quick Score — rapid triage',
    body: '14 high-signal questions instead of 60+. Takes 5–8 minutes. Use it to decide whether a deal deserves a full assessment before investing presales time.',
    placement: 'bottom',
  },
  {
    target: 'checker-only',
    title: 'Checker Only — jump to the gate',
    body: 'Skip straight to the 42-point quality gate. Useful when the deal is already shaped and you just need a pre-submission verdict.',
    placement: 'bottom',
  },
  {
    target: 'load-deal',
    title: 'Resume a saved deal',
    body: 'Deals are saved in your browser automatically. Load a JSON export to resume on another device, or share a deal link with your team — no account needed.',
    placement: 'top',
  },
  {
    title: 'Ready to qualify',
    body: "That's everything. Start with Full Assessment for your first deal. Use Help & reference in the sidebar any time you need a refresher on risk bands, axes, or strategies.",
  },
]

const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Deal Intake',
    desc: 'Work type, pricing model, competitive situation, compliance, delivery geography.',
    output: 'Deal context + auto-risk signals',
    time: '5 min',
    color: 'text-indigo-500',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100',
  },
  {
    num: '02',
    title: 'Risk Assessment',
    desc: '60+ calibrated questions scored across 8 weighted axes. Live radar chart.',
    output: 'Risk band: Green / Amber / Red / Black',
    time: '15 min',
    color: 'text-violet-500',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
  },
  {
    num: '03',
    title: 'Strategy',
    desc: 'Algorithmic match to one of 6 engagement models. Full pitch, moves, objection handlers.',
    output: 'Strategy card + win themes',
    time: '2 min',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
  },
  {
    num: '04',
    title: 'Deal Shaper',
    desc: 'Ranked levers to reshape before you bid — with specific contract language.',
    output: 'Prioritised action list',
    time: '5 min',
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
  },
  {
    num: '05',
    title: 'Gate + Export',
    desc: '42-point quality gate. Hard blockers. Go / Conditional / No-Go verdict.',
    output: 'Deal brief · Proposal deck · JSON',
    time: '10 min',
    color: 'text-green-600',
    bg: 'bg-green-50',
    border: 'border-green-100',
  },
]

export default function Home() {
  const { deals, createDeal, importDeal, getActiveDeal } = useDealStore()
  const [tourOpen, setTourOpen] = useState(false)
  const navigate = useNavigate()

  const activeDeal = getActiveDeal()

  function startDeal() { createDeal(); navigate('/deal') }
  function loadDeal(deal: Deal) { importDeal(deal); navigate('/deal') }
  function resumeDeal() { navigate('/deal') }

  const savedDeals: Deal[] = [...deals].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
      {tourOpen && <Tour steps={TOUR_STEPS} onDone={() => setTourOpen(false)} />}

      <div className="w-full max-w-4xl space-y-8">
        {/* Resume banner */}
        {activeDeal && (
          <div className="flex items-center justify-between bg-indigo-50 border border-indigo-200 rounded-xl px-5 py-3">
            <div>
              <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">Active deal</span>
              <div className="text-sm font-semibold text-slate-800 mt-0.5">
                {activeDeal.meta.name || 'Unnamed deal'}
                <span className="text-xs font-normal text-slate-400 ml-2">{activeDeal.meta.clientName} · Step {activeDeal.currentStep}/5</span>
              </div>
            </div>
            <button
              onClick={resumeDeal}
              className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800 bg-white border border-indigo-200 hover:border-indigo-400 px-3 py-1.5 rounded-lg transition-colors"
            >
              <RotateCcw size={13} /> Resume
            </button>
          </div>
        )}

        {/* Header */}
        <div className="text-center">
          <div className="text-4xl font-black text-slate-900 tracking-tight">CADEX</div>
          <div className="text-slate-500 mt-1 text-sm">Consulting Advisor &amp; Deal EXecution Framework</div>
          <button
            onClick={() => setTourOpen(true)}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-full transition-colors"
          >
            <PlayCircle size={13} /> Take a tour
          </button>
        </div>

        {/* Process overview */}
        <div data-tour="process-flow" className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">How it works</div>
              <div className="text-sm font-semibold text-slate-800">Five steps from first signal to submission-ready — ~25–35 minutes total</div>
            </div>
            <span className="text-xs text-slate-400 font-medium hidden sm:block">Each step builds on the last</span>
          </div>
          <div className="grid grid-cols-5 divide-x divide-slate-100">
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.num} className="relative p-4 flex flex-col gap-2 hover:bg-slate-50 transition-colors">
                <div className={`inline-flex items-center justify-center w-7 h-7 rounded-lg ${step.bg} border ${step.border} self-start`}>
                  <span className={`text-xs font-black ${step.color}`}>{step.num}</span>
                </div>
                <div className="text-xs font-bold text-slate-800 leading-tight">{step.title}</div>
                <div className="text-xs text-slate-400 leading-relaxed flex-1">{step.desc}</div>
                <div className={`text-xs font-semibold ${step.color} mt-1 leading-tight`}>{step.output}</div>
                <div className="text-xs text-slate-300 font-medium">{step.time}</div>
                {i < PROCESS_STEPS.length - 1 && (
                  <ArrowRight size={12} className="absolute -right-1.5 top-1/2 -translate-y-1/2 text-slate-300 z-10 bg-white" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Start options — constrained to 2xl so cards don't stretch too wide */}
        <div className="max-w-2xl mx-auto w-full space-y-8">
        <div className="grid grid-cols-3 gap-4">
          <button
            data-tour="full-assessment"
            onClick={startDeal}
            className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-indigo-300 hover:shadow-sm transition-all group"
          >
            <BarChart3 size={24} className="text-indigo-500 mb-3" />
            <div className="font-semibold text-slate-800 text-sm">Full Assessment</div>
            <div className="text-xs text-slate-500 mt-1 leading-relaxed">All 5 steps, complete questionnaire. 25–40 min.</div>
          </button>

          <button
            data-tour="quick-score"
            onClick={startDeal}
            className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-indigo-300 hover:shadow-sm transition-all"
          >
            <Zap size={24} className="text-amber-500 mb-3" />
            <div className="font-semibold text-slate-800 text-sm">Quick Score</div>
            <div className="text-xs text-slate-500 mt-1 leading-relaxed">14-question rapid assessment. 5–8 min.</div>
          </button>

          <button
            data-tour="checker-only"
            onClick={startDeal}
            className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-indigo-300 hover:shadow-sm transition-all"
          >
            <ClipboardList size={24} className="text-green-500 mb-3" />
            <div className="font-semibold text-slate-800 text-sm">Checker Only</div>
            <div className="text-xs text-slate-500 mt-1 leading-relaxed">Jump to the 42-point quality gate. 10 min.</div>
          </button>
        </div>

        {/* Load JSON */}
        <div data-tour="load-deal" className="bg-white rounded-2xl border border-slate-200 p-5">
          <label className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
            <FolderOpen size={20} className="text-slate-400" />
            <span className="text-sm text-slate-600 font-medium">Load a saved deal (JSON)</span>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                const reader = new FileReader()
                reader.onload = (ev) => {
                  try {
                    const deal = JSON.parse(ev.target?.result as string)
                    loadDeal(deal)
                  } catch {
                    alert('Invalid CADEX deal file.')
                  }
                }
                reader.readAsText(file)
              }}
            />
          </label>
        </div>

        {/* Recent deals */}
        {savedDeals.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Recent deals
            </div>
            <ul>
              {savedDeals.slice(0, 5).map((deal) => (
                <li key={deal.id}>
                  <button
                    onClick={() => loadDeal(deal)}
                    className="w-full flex items-center justify-between px-5 py-3 text-left text-sm hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0"
                  >
                    <div>
                      <div className="font-medium text-slate-800">{deal.meta.name || 'Unnamed deal'}</div>
                      <div className="text-xs text-slate-400">{deal.meta.clientName} · Step {deal.currentStep}/5</div>
                    </div>
                    {deal.assessment && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        deal.assessment.scoreBand === 'green' ? 'bg-green-100 text-green-700' :
                        deal.assessment.scoreBand === 'amber' ? 'bg-amber-100 text-amber-700' :
                        deal.assessment.scoreBand === 'red' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {deal.assessment.scoreBand}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        </div>{/* /max-w-2xl inner */}
      </div>
    </div>
  )
}
