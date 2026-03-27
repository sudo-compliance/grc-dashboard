import type { ControlStatus } from '../../types'

const OPTIONS: { value: ControlStatus; label: string }[] = [
  { value: 'not-started',    label: 'Not Started' },
  { value: 'in-progress',    label: 'In Progress' },
  { value: 'implemented',    label: 'Implemented' },
  { value: 'not-applicable', label: 'N/A' },
]

const TEXT_COLOR: Record<ControlStatus, string> = {
  'not-started':    'var(--text-secondary)',
  'in-progress':    'var(--warn)',
  'implemented':    'var(--ok)',
  'not-applicable': 'var(--text-muted)',
}

interface StatusSelectProps {
  value: ControlStatus
  onChange: (status: ControlStatus) => void
  compact?: boolean
}

export default function StatusSelect({ value, onChange, compact = false }: StatusSelectProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value as ControlStatus)}
      className="mono font-semibold focus:outline-none appearance-none rounded-md cursor-pointer transition-colors"
      style={{
        background:   'var(--bg-input)',
        border:       '1px solid var(--border-default)',
        color:        TEXT_COLOR[value],
        fontSize:     compact ? '12px' : '13px',
        padding:      compact ? '4px 9px' : '6px 13px',
        minWidth:     compact ? 100 : 140,
      }}
    >
      {OPTIONS.map(o => (
        <option key={o.value} value={o.value} style={{ background: 'var(--bg-surface)', color: 'var(--text-primary)' }}>
          {o.label}
        </option>
      ))}
    </select>
  )
}
