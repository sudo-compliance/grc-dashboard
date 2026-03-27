import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, LabelList,
} from 'recharts'
import type { DomainStat } from '../../types'

interface DomainBarChartProps {
  domains: DomainStat[]
  maxBars?: number
}

export default function DomainBarChart({ domains, maxBars = 14 }: DomainBarChartProps) {
  const sorted = [...domains]
    .sort((a, b) => b.percentComplete - a.percentComplete)
    .slice(0, maxBars)

  const chartHeight = Math.max(sorted.length * 30 + 20, 200)

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart
        data={sorted}
        layout="vertical"
        margin={{ top: 0, right: 48, left: 0, bottom: 0 }}
        barSize={7}
        barGap={4}
      >
        <XAxis
          type="number"
          domain={[0, 100]}
          tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={v => `${v}%`}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={120}
          tick={{ fill: 'var(--text-secondary)', fontSize: 10 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ fill: 'var(--border-subtle)' }}
          contentStyle={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 6,
            fontSize: 11,
          }}
          itemStyle={{ color: 'var(--text-secondary)' }}
          formatter={(value: number, name: string) => [`${value}`, name]}
          labelStyle={{ color: 'var(--text-primary)', fontWeight: 600 }}
        />
        {/* Track */}
        <Bar dataKey="total" fill="var(--border-subtle)" radius={4} />
        {/* Progress */}
        <Bar dataKey="implemented" radius={4}>
          <LabelList
            dataKey="percentComplete"
            position="right"
            formatter={(v: number) => `${v}%`}
            style={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'JetBrains Mono' }}
          />
          {sorted.map((entry, i) => (
            <Cell
              key={i}
              fill={
                entry.percentComplete >= 80 ? 'var(--ok)' :
                entry.percentComplete >= 40 ? 'var(--warn)' :
                'var(--bg-elevated)'
              }
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
