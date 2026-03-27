import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { CompletionStats } from '../../types'

const COLORS = {
  implemented:   'var(--ok)',
  inProgress:    'var(--warn)',
  notStarted:    'var(--bg-elevated)',
  notApplicable: 'var(--border-subtle)',
}

interface CompletionDonutProps {
  stats: CompletionStats
  size?: number
}

export default function CompletionDonut({ stats, size = 160 }: CompletionDonutProps) {
  const data = [
    { name: 'Implemented', value: stats.implemented,   color: COLORS.implemented },
    { name: 'In Progress', value: stats.inProgress,    color: COLORS.inProgress },
    { name: 'Not Started', value: stats.notStarted,    color: COLORS.notStarted },
    { name: 'N/A',         value: stats.notApplicable, color: COLORS.notApplicable },
  ].filter(d => d.value > 0)

  if (stats.total === 0) {
    data.push({ name: 'No data', value: 1, color: 'var(--bg-elevated)' })
  }

  const innerRadius = size * 0.32
  const outerRadius = size * 0.46

  return (
    <div className="flex flex-col items-center gap-3">
      <div style={{ width: size, height: size }} className="relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-default)',
                borderRadius: 6,
                fontSize: 11,
              }}
              itemStyle={{ color: 'var(--text-secondary)' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="mono text-xl font-semibold leading-none" style={{ color: 'var(--text-primary)' }}>
            {stats.percentComplete}%
          </span>
          <span className="text-[9px] mt-0.5" style={{ color: 'var(--text-muted)' }}>complete</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 w-full">
        {[
          { label: 'Implemented', value: stats.implemented,   color: COLORS.implemented },
          { label: 'In Progress', value: stats.inProgress,    color: COLORS.inProgress },
          { label: 'Not Started', value: stats.notStarted,    color: COLORS.notStarted },
          { label: 'N/A',         value: stats.notApplicable, color: COLORS.notApplicable },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
            <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
            <span className="mono text-[10px] ml-auto" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
