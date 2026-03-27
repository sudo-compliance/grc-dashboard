import type { ControlStatus, RiskLevel, RiskStatus } from '../../types'

type BadgeVariant = ControlStatus | RiskLevel | RiskStatus

const STYLES: Record<BadgeVariant, React.CSSProperties> = {
  'implemented':    { background: 'var(--ok-dim)',                  color: 'var(--ok)',            border: '1px solid rgba(34,197,94,0.2)' },
  'in-progress':    { background: 'var(--warn-dim)',                color: 'var(--warn)',          border: '1px solid rgba(245,158,11,0.2)' },
  'not-started':    { background: 'rgba(255,255,255,0.04)',         color: 'var(--text-secondary)',border: '1px solid var(--border-subtle)' },
  'not-applicable': { background: 'rgba(255,255,255,0.03)',         color: 'var(--text-muted)',    border: '1px solid var(--border-subtle)' },
  'low':            { background: 'var(--ok-dim)',                  color: 'var(--ok)',            border: '1px solid rgba(34,197,94,0.2)' },
  'medium':         { background: 'var(--warn-dim)',                color: 'var(--warn)',          border: '1px solid rgba(245,158,11,0.2)' },
  'high':           { background: 'rgba(239,68,68,0.1)',            color: '#FB923C',              border: '1px solid rgba(251,146,60,0.25)' },
  'critical':       { background: 'var(--danger-dim)',              color: 'var(--danger)',        border: '1px solid rgba(239,68,68,0.25)' },
  'open':           { background: 'var(--info-dim)',                color: 'var(--info)',          border: '1px solid rgba(96,165,250,0.2)' },
  'mitigated':      { background: 'var(--ok-dim)',                  color: 'var(--ok)',            border: '1px solid rgba(34,197,94,0.2)' },
  'accepted':       { background: 'rgba(255,255,255,0.04)',         color: 'var(--text-secondary)',border: '1px solid var(--border-subtle)' },
  'transferred':    { background: 'rgba(167,139,250,0.1)',          color: '#A78BFA',              border: '1px solid rgba(167,139,250,0.2)' },
}

const LABELS: Partial<Record<BadgeVariant, string>> = {
  'not-started':    'Not Started',
  'in-progress':    'In Progress',
  'implemented':    'Implemented',
  'not-applicable': 'N/A',
  'transferred':    'Transferred',
}

interface BadgeProps {
  value: BadgeVariant
  className?: string
}

export default function Badge({ value, className = '' }: BadgeProps) {
  const style = STYLES[value] ?? { background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }
  const label = LABELS[value] ?? value.charAt(0).toUpperCase() + value.slice(1)

  return (
    <span className={`badge ${className}`} style={style}>
      {label}
    </span>
  )
}
