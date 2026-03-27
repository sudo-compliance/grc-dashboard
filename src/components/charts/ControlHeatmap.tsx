import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Control, ControlStatus, FrameworkId } from '../../types'

interface ControlHeatmapProps {
  controls: Control[]
  frameworkId: FrameworkId
}

const STATUS_COLOR: Record<ControlStatus, string> = {
  'implemented':    'var(--ok)',
  'in-progress':    'var(--warn)',
  'not-started':    'var(--bg-elevated)',
  'not-applicable': 'var(--border-subtle)',
}

const STATUS_BORDER: Record<ControlStatus, string> = {
  'implemented':    'rgba(34,197,94,0.3)',
  'in-progress':    'rgba(245,158,11,0.3)',
  'not-started':    'var(--border-default)',
  'not-applicable': 'var(--border-subtle)',
}

export default function ControlHeatmap({ controls, frameworkId }: ControlHeatmapProps) {
  const navigate = useNavigate()

  const domains = useMemo(() => {
    const map = new Map<string, Control[]>()
    for (const c of controls) {
      if (!map.has(c.domain)) map.set(c.domain, [])
      map.get(c.domain)!.push(c)
    }
    return Array.from(map.entries())
  }, [controls])

  if (controls.length === 0) {
    return (
      <div className="h-32 flex items-center justify-center text-xs" style={{ color: 'var(--text-muted)' }}>
        Loading…
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {domains.map(([domain, dc]) => (
        <div key={domain}>
          <div className="flex items-center gap-2 mb-1">
            <span className="mono text-[10px] font-medium truncate" style={{ color: 'var(--text-secondary)' }}>
              {domain}
            </span>
            <span className="mono text-[9px]" style={{ color: 'var(--text-muted)' }}>
              {dc.filter(c => c.status === 'implemented').length}/{dc.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-0.5">
            {dc.map(c => (
              <div
                key={c.id}
                title={`${c.id} — ${c.title} (${c.status})`}
                onClick={() => navigate(`/framework/${frameworkId}`)}
                className="w-4 h-4 rounded-sm cursor-pointer transition-transform hover:scale-125 hover:z-10 relative"
                style={{
                  background: STATUS_COLOR[c.status],
                  border: `1px solid ${STATUS_BORDER[c.status]}`,
                }}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Legend */}
      <div className="flex items-center gap-4 pt-2 flex-wrap">
        {([
          ['implemented',    'Implemented'],
          ['in-progress',    'In Progress'],
          ['not-started',    'Not Started'],
          ['not-applicable', 'N/A'],
        ] as [ControlStatus, string][]).map(([status, label]) => (
          <div key={status} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm flex-shrink-0"
                  style={{ background: STATUS_COLOR[status], border: `1px solid ${STATUS_BORDER[status]}` }} />
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
