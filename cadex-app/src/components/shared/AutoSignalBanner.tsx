import { AlertTriangle, Info, XCircle, X } from 'lucide-react'
import { useState } from 'react'
import type { AutoSignal } from '../../types'

const CONFIG = {
  info:     { icon: Info,          bg: 'bg-blue-50',   border: 'border-blue-200',  text: 'text-blue-800'  },
  warning:  { icon: AlertTriangle, bg: 'bg-amber-50',  border: 'border-amber-200', text: 'text-amber-800' },
  critical: { icon: XCircle,       bg: 'bg-red-50',    border: 'border-red-200',   text: 'text-red-800'   },
}

interface Props {
  signals: AutoSignal[]
}

export default function AutoSignalBanner({ signals }: Props) {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const visible = signals.filter((s) => !dismissed.has(s.id))
  if (visible.length === 0) return null

  return (
    <div className="space-y-2">
      {visible.map((signal) => {
        const c = CONFIG[signal.severity]
        const Icon = c.icon
        return (
          <div
            key={signal.id}
            className={`flex items-start gap-3 px-4 py-3 rounded-lg border text-sm ${c.bg} ${c.border} ${c.text}`}
          >
            <Icon size={15} className="mt-0.5 shrink-0" />
            <span className="flex-1">{signal.message}</span>
            <button
              onClick={() => setDismissed((d) => new Set([...d, signal.id]))}
              className="shrink-0 opacity-50 hover:opacity-100"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
