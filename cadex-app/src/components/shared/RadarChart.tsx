import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { AxisScores } from '../../types'

const AXIS_LABELS: Record<string, string> = {
  SC: 'Scope',
  CM: 'Client',
  CR: 'Commercial',
  TC: 'Technical',
  GR: 'Governance',
  SV: 'Strategic',
  CP: 'Competitive',
  VF: 'Vendor Fit',
}

interface Props {
  scores: Partial<AxisScores>
  size?: number
}

export default function RadarChart({ scores, size = 280 }: Props) {
  const data = Object.entries(AXIS_LABELS).map(([code, label]) => ({
    axis: label,
    value: scores[code as keyof AxisScores] ?? 0,
    fullMark: 5,
  }))

  return (
    <div style={{ width: '100%', height: size }}>
    <ResponsiveContainer width="100%" height="100%">
      <RechartsRadar data={data} margin={{ top: 20, right: 40, bottom: 20, left: 40 }}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis
          dataKey="axis"
          tick={{ fontSize: 11, fill: '#64748b' }}
        />
        <Tooltip
          formatter={(val: unknown) => [`${val} / 5`, '']}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}
        />
        <Radar
          dataKey="value"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.25}
          strokeWidth={2}
          dot={{ r: 3, fill: '#6366f1' }}
        />
      </RechartsRadar>
    </ResponsiveContainer>
    </div>
  )
}
