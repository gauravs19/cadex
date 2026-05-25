import type { ScoreBand } from '../../types'

const CONFIG: Record<ScoreBand, { label: string; bg: string; text: string; dot: string }> = {
  green:  { label: 'Green — Proceed',      bg: 'bg-green-50',  text: 'text-green-800',  dot: 'bg-green-500' },
  amber:  { label: 'Amber — Condition',    bg: 'bg-amber-50',  text: 'text-amber-800',  dot: 'bg-amber-500' },
  red:    { label: 'Red — Restructure',    bg: 'bg-red-50',    text: 'text-red-800',    dot: 'bg-red-500' },
  black:  { label: 'Black — No-Bid',       bg: 'bg-slate-100', text: 'text-slate-900',  dot: 'bg-slate-800' },
}

interface Props {
  band: ScoreBand
  score?: number
  size?: 'sm' | 'md' | 'lg'
}

export default function ScoreBadge({ band, score, size = 'md' }: Props) {
  const c = CONFIG[band]
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : size === 'lg' ? 'px-4 py-2 text-base' : 'px-3 py-1 text-sm'

  return (
    <span className={`inline-flex items-center gap-2 rounded-full font-medium ${c.bg} ${c.text} ${padding}`}>
      <span className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
      {c.label}
      {score !== undefined && <span className="opacity-60">({Math.round(score)}%)</span>}
    </span>
  )
}
