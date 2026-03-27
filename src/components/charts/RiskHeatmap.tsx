import { useState } from 'react'
import type { Risk, RiskAppetiteThreshold } from '../../types'
import { LIKELIHOOD_LABELS, IMPACT_LABELS } from '../../types'

interface RiskHeatmapProps {
  risks: Risk[]
  appetiteThreshold?: RiskAppetiteThreshold
}

function baseStyle(l: number, i: number): React.CSSProperties {
  const score = l * i
  if (score >= 20) return { background: 'var(--danger-dim)',  color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.2)' }
  if (score >= 13) return { background: 'rgba(239,68,68,0.08)', color: '#FB923C',     border: '1px solid rgba(251,146,60,0.2)' }
  if (score >= 6)  return { background: 'var(--warn-dim)',    color: 'var(--warn)',   border: '1px solid rgba(245,158,11,0.2)' }
  return                   { background: 'var(--ok-dim)',     color: 'var(--ok)',     border: '1px solid rgba(34,197,94,0.2)' }
}

function isAboveAppetite(l: number, i: number, threshold?: RiskAppetiteThreshold): boolean {
  if (!threshold) return false
  const cell = threshold.cells.find(c => c.likelihood === l)
  if (!cell) return false
  return i > cell.maxAcceptableImpact
}

// Returns border overrides for boundary cells (stepped diagonal line)
function boundaryBorders(l: number, i: number, threshold?: RiskAppetiteThreshold): React.CSSProperties {
  if (!threshold) return {}
  const cell  = threshold.cells.find(c => c.likelihood === l)
  const right = threshold.cells.find(c => c.likelihood === l + 1)
  if (!cell) return {}

  const overrides: React.CSSProperties = {}
  // This cell is exactly at the boundary (inside appetite, but above is outside)
  const atTopBoundary  = i === cell.maxAcceptableImpact && i < 5
  const atRightBoundary = right && i > right.maxAcceptableImpact && !isAboveAppetite(l, i, threshold)

  if (atTopBoundary)   overrides.borderTop    = '2px solid var(--danger)'
  if (atRightBoundary) overrides.borderRight   = '2px solid var(--danger)'
  return overrides
}

export default function RiskHeatmap({ risks, appetiteThreshold }: RiskHeatmapProps) {
  const [tooltip, setTooltip] = useState<{ l: number; i: number } | null>(null)

  const getRisksAt = (l: number, i: number) =>
    risks.filter(r => r.likelihood === l && r.impact === i)

  return (
    <div className="select-none">
      <div className="flex gap-2">
        <div className="flex items-center justify-center w-4">
          <span
            className="mono text-[10px] uppercase tracking-widest"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', color: 'var(--text-muted)' }}
          >
            Impact →
          </span>
        </div>

        <div className="flex-1">
          <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
            {[5, 4, 3, 2, 1].map(impact => (
              [1, 2, 3, 4, 5].map(likelihood => {
                const cellRisks = getRisksAt(likelihood, impact)
                const isHovered = tooltip?.l === likelihood && tooltip?.i === impact
                const above     = isAboveAppetite(likelihood, impact, appetiteThreshold)
                const boundary  = boundaryBorders(likelihood, impact, appetiteThreshold)
                const countColor = above ? 'var(--danger)' : undefined

                return (
                  <div
                    key={`${likelihood}-${impact}`}
                    className="relative aspect-square rounded-md flex flex-col items-center justify-center cursor-pointer transition-transform duration-100 overflow-hidden"
                    style={{
                      ...baseStyle(likelihood, impact),
                      ...boundary,
                      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    }}
                    onMouseEnter={() => setTooltip({ l: likelihood, i: impact })}
                    onMouseLeave={() => setTooltip(null)}
                  >
                    {/* Crosshatch overlay for above-appetite cells */}
                    {above && (
                      <svg
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <pattern id={`hatch-${likelihood}-${impact}`} patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                            <line x1="0" y1="0" x2="0" y2="8" stroke="var(--danger)" strokeWidth="1" opacity="0.15" />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill={`url(#hatch-${likelihood}-${impact})`} />
                      </svg>
                    )}

                    {cellRisks.length > 0 && (
                      <span className="mono text-sm font-bold relative z-10" style={{ color: countColor }}>
                        {cellRisks.length}
                      </span>
                    )}
                    <span className="mono text-[10px] opacity-50 leading-none relative z-10">
                      {likelihood * impact}
                    </span>

                    {isHovered && cellRisks.length > 0 && (
                      <div
                        className="absolute z-20 bottom-full mb-2 left-1/2 -translate-x-1/2 rounded-lg p-3 min-w-48 max-w-64"
                        style={{
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-default)',
                        }}
                      >
                        <p className="mono text-[11px] mb-2" style={{ color: 'var(--text-muted)' }}>
                          L{likelihood} × I{impact} = {likelihood * impact}
                          {above && <span style={{ color: 'var(--danger)' }}> · Above appetite</span>}
                        </p>
                        {cellRisks.map(r => (
                          <div key={r.id} className="flex items-start gap-1.5 mb-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-current mt-1 flex-shrink-0" />
                            <span className="text-[11px] leading-tight" style={{ color: 'var(--text-primary)' }}>{r.assetName}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })
            ))}
          </div>

          <div className="grid mt-1 gap-1" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
            {[1, 2, 3, 4, 5].map(l => (
              <div key={l} className="text-center">
                <span className="mono text-[8px] block" style={{ color: 'var(--text-muted)' }}>{l}</span>
                <span className="text-[7px] block truncate px-0.5" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
                  {LIKELIHOOD_LABELS[l as 1|2|3|4|5].split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
          <p className="mono text-[10px] uppercase tracking-widest text-center mt-1" style={{ color: 'var(--text-muted)' }}>
            Likelihood →
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-3 justify-center flex-wrap">
        {[
          { label: 'Low (1–5)',      style: { background: 'var(--ok-dim)',     color: 'var(--ok)' } },
          { label: 'Medium (6–12)',  style: { background: 'var(--warn-dim)',   color: 'var(--warn)' } },
          { label: 'High (13–19)',   style: { background: 'rgba(239,68,68,0.08)', color: '#FB923C' } },
          { label: 'Critical (20+)', style: { background: 'var(--danger-dim)', color: 'var(--danger)' } },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={l.style} />
            <span className="text-[11px]" style={{ color: l.style.color }}>{l.label}</span>
          </div>
        ))}
        {appetiteThreshold && (
          <>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm relative overflow-hidden" style={{ background: 'var(--danger-dim)', border: '1px solid var(--danger)' }}>
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="hatch-legend" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
                      <line x1="0" y1="0" x2="0" y2="4" stroke="var(--danger)" strokeWidth="1" opacity="0.4" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#hatch-legend)" />
                </svg>
              </span>
              <span className="text-[11px]" style={{ color: 'var(--danger)' }}>Above appetite</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: 'var(--ok-dim)', border: '1px solid var(--ok)' }} />
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Within appetite</span>
            </div>
          </>
        )}
      </div>

      <div className="mt-3 grid grid-cols-5 gap-1 text-center">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="text-[7px] truncate" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
            {IMPACT_LABELS[i as 1|2|3|4|5].split(' ')[0]}
          </div>
        ))}
      </div>
    </div>
  )
}
