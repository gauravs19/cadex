import { useState, useEffect, useCallback, useLayoutEffect } from 'react'
import { X, ArrowRight, ArrowLeft } from 'lucide-react'

export interface TourStep {
  target?: string          // data-tour="…" attribute; omit for a centred intro/outro card
  title: string
  body: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
}

interface SpotlightRect {
  top: number; left: number; width: number; height: number
}

interface TooltipPos {
  top: number; left: number; maxWidth: number
  arrowSide?: 'top' | 'bottom' | 'left' | 'right'
  arrowOffset?: number
}

interface Props {
  steps: TourStep[]
  onDone: () => void
}

const PAD = 10      // spotlight padding
const TIP_W = 300   // tooltip width

function getSpotlight(target: string): SpotlightRect | null {
  const el = document.querySelector(`[data-tour="${target}"]`)
  if (!el) return null
  const r = el.getBoundingClientRect()
  return { top: r.top - PAD, left: r.left - PAD, width: r.width + PAD * 2, height: r.height + PAD * 2 }
}

function calcTooltipPos(spot: SpotlightRect, placement: TourStep['placement'] = 'bottom'): TooltipPos {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const margin = 12

  const placements: Record<string, () => TooltipPos> = {
    bottom: () => {
      const top = spot.top + spot.height + margin
      let left = spot.left + spot.width / 2 - TIP_W / 2
      left = Math.max(margin, Math.min(left, vw - TIP_W - margin))
      const arrowOffset = (spot.left + spot.width / 2) - left
      return { top, left, maxWidth: TIP_W, arrowSide: 'top', arrowOffset }
    },
    top: () => {
      const top = spot.top - 120 - margin  // estimated tooltip height
      let left = spot.left + spot.width / 2 - TIP_W / 2
      left = Math.max(margin, Math.min(left, vw - TIP_W - margin))
      const arrowOffset = (spot.left + spot.width / 2) - left
      return { top: Math.max(margin, top), left, maxWidth: TIP_W, arrowSide: 'bottom', arrowOffset }
    },
    right: () => {
      const left = spot.left + spot.width + margin
      const top = spot.top + spot.height / 2 - 60
      return { top: Math.max(margin, top), left: Math.min(left, vw - TIP_W - margin), maxWidth: TIP_W, arrowSide: 'left', arrowOffset: 48 }
    },
    left: () => {
      const left = spot.left - TIP_W - margin
      const top = spot.top + spot.height / 2 - 60
      return { top: Math.max(margin, top), left: Math.max(margin, left), maxWidth: TIP_W, arrowSide: 'right', arrowOffset: 48 }
    },
  }

  // Auto-fallback: if bottom overflows, try top
  const result = (placements[placement] ?? placements.bottom)()
  if (placement === 'bottom' && result.top + 140 > vh) {
    return (placements.top)()
  }
  return result
}

export default function Tour({ steps, onDone }: Props) {
  const [idx, setIdx] = useState(0)
  const [spot, setSpot] = useState<SpotlightRect | null>(null)
  const [tipPos, setTipPos] = useState<TooltipPos>({ top: 0, left: 0, maxWidth: TIP_W })

  const step = steps[idx]
  const isFirst = idx === 0
  const isLast = idx === steps.length - 1

  const recalc = useCallback(() => {
    if (!step.target) { setSpot(null); return }
    const s = getSpotlight(step.target)
    setSpot(s)
    if (s) setTipPos(calcTooltipPos(s, step.placement ?? 'bottom'))
  }, [step])

  useLayoutEffect(() => { recalc() }, [recalc])
  useEffect(() => {
    window.addEventListener('resize', recalc)
    return () => window.removeEventListener('resize', recalc)
  }, [recalc])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDone()
      if (e.key === 'ArrowRight' && !isLast) setIdx(i => i + 1)
      if (e.key === 'ArrowLeft' && !isFirst) setIdx(i => i - 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isFirst, isLast, onDone])

  const centred = !step.target

  return (
    <>
      {/* Dark overlay — full screen */}
      <div
        className="fixed inset-0 z-40 transition-all"
        style={{ background: 'rgba(0,0,0,0.55)' }}
        onClick={onDone}
      />

      {/* Spotlight cutout — sits above overlay, punches a "hole" via box-shadow */}
      {spot && (
        <div
          className="fixed z-40 rounded-xl pointer-events-none"
          style={{
            top: spot.top, left: spot.left,
            width: spot.width, height: spot.height,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
            outline: '2px solid rgba(99,102,241,0.7)',
            transition: 'top 0.25s ease, left 0.25s ease, width 0.25s ease, height 0.25s ease',
          }}
        />
      )}

      {/* Tooltip / centred card */}
      {centred ? (
        // Centred intro / outro card
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white rounded-2xl shadow-2xl p-7 pointer-events-auto" style={{ width: 360 }}>
            <TourCard step={step} idx={idx} total={steps.length}
              isFirst={isFirst} isLast={isLast}
              onPrev={() => setIdx(i => i - 1)}
              onNext={() => setIdx(i => i + 1)}
              onDone={onDone} />
          </div>
        </div>
      ) : (
        // Anchored tooltip
        <div
          className="fixed z-50 bg-white rounded-xl shadow-2xl pointer-events-auto"
          style={{ top: tipPos.top, left: tipPos.left, width: tipPos.maxWidth,
            transition: 'top 0.25s ease, left 0.25s ease' }}
        >
          {tipPos.arrowSide === 'top' && (
            <div className="absolute -top-2 h-0 w-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white"
              style={{ left: Math.max(12, (tipPos.arrowOffset ?? 0) - 8) }} />
          )}
          {tipPos.arrowSide === 'bottom' && (
            <div className="absolute -bottom-2 h-0 w-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"
              style={{ left: Math.max(12, (tipPos.arrowOffset ?? 0) - 8) }} />
          )}
          {tipPos.arrowSide === 'left' && (
            <div className="absolute -left-2 top-10 h-0 w-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white" />
          )}
          {tipPos.arrowSide === 'right' && (
            <div className="absolute -right-2 top-10 h-0 w-0 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-white" />
          )}
          <div className="p-4">
            <TourCard step={step} idx={idx} total={steps.length}
              isFirst={isFirst} isLast={isLast}
              onPrev={() => setIdx(i => i - 1)}
              onNext={() => setIdx(i => i + 1)}
              onDone={onDone} />
          </div>
        </div>
      )}
    </>
  )
}

// ── Inner card content ────────────────────────────────────────

interface CardProps {
  step: TourStep
  idx: number; total: number
  isFirst: boolean; isLast: boolean
  onPrev: () => void; onNext: () => void; onDone: () => void
}

function TourCard({ step, idx, total, isFirst, isLast, onPrev, onNext, onDone }: CardProps) {
  return (
    <>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="text-sm font-bold text-slate-900 leading-tight">{step.title}</div>
        <button onClick={onDone} className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0">
          <X size={14} />
        </button>
      </div>

      <p className="text-xs text-slate-500 leading-relaxed mb-4">{step.body}</p>

      <div className="flex items-center justify-between gap-2">
        {/* Step dots */}
        <div className="flex gap-1">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className={`rounded-full transition-all ${
              i === idx ? 'w-4 h-1.5 bg-indigo-500' : 'w-1.5 h-1.5 bg-slate-200'
            }`} />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {!isFirst && (
            <button onClick={onPrev}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors">
              <ArrowLeft size={12} /> Back
            </button>
          )}
          {isLast ? (
            <button onClick={onDone}
              className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors">
              Done <ArrowRight size={12} />
            </button>
          ) : (
            <button onClick={onNext}
              className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors">
              Next <ArrowRight size={12} />
            </button>
          )}
        </div>
      </div>
    </>
  )
}
