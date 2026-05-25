import { useState } from 'react'
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react'

interface Props {
  tip: string
  title?: string
}

export default function CoachingPanel({ tip, title = 'Why this matters' }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="mt-2 rounded-lg border border-indigo-100 bg-indigo-50 overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
      >
        <Lightbulb size={13} />
        <span className="flex-1">{title}</span>
        {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>
      {open && (
        <div className="px-4 pb-3 pt-1 text-xs text-indigo-800 leading-relaxed border-t border-indigo-100">
          {tip}
        </div>
      )}
    </div>
  )
}
