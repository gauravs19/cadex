import { useDealStore } from '../store/dealStore'
import { Zap, ClipboardList, BarChart3, FolderOpen } from 'lucide-react'
import type { Deal } from '../types'

export default function Home() {
  const { deals, createDeal, importDeal } = useDealStore()

  const savedDeals: Deal[] = [...deals].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="text-4xl font-black text-slate-900 tracking-tight">CADEX</div>
          <div className="text-slate-500 mt-1 text-sm">Consulting Advisor & Deal EXecution Framework</div>
        </div>

        {/* Start options */}
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => createDeal()}
            className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-indigo-300 hover:shadow-sm transition-all group"
          >
            <BarChart3 size={24} className="text-indigo-500 mb-3" />
            <div className="font-semibold text-slate-800 text-sm">Full Assessment</div>
            <div className="text-xs text-slate-500 mt-1 leading-relaxed">All 5 steps, complete questionnaire. 25–40 min.</div>
          </button>

          <button
            onClick={() => createDeal()}
            className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-indigo-300 hover:shadow-sm transition-all"
          >
            <Zap size={24} className="text-amber-500 mb-3" />
            <div className="font-semibold text-slate-800 text-sm">Quick Score</div>
            <div className="text-xs text-slate-500 mt-1 leading-relaxed">14-question rapid assessment. 5–8 min.</div>
          </button>

          <button
            onClick={() => createDeal()}
            className="bg-white border border-slate-200 rounded-2xl p-5 text-left hover:border-indigo-300 hover:shadow-sm transition-all"
          >
            <ClipboardList size={24} className="text-green-500 mb-3" />
            <div className="font-semibold text-slate-800 text-sm">Checker Only</div>
            <div className="text-xs text-slate-500 mt-1 leading-relaxed">Jump to the 42-point quality gate. 10 min.</div>
          </button>
        </div>

        {/* Load JSON */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
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
                    importDeal(deal)
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
                    onClick={() => importDeal(deal)}
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
      </div>
    </div>
  )
}
