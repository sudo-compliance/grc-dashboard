import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { GitMerge, Layers, Info } from 'lucide-react'
import { useFrameworkStore } from '../store/useFrameworkStore'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import crosswalkData from '../data/crosswalk.json'
import type { Control, ControlStatus, CrosswalkMapping, FrameworkId } from '../types'

const mappings = crosswalkData as CrosswalkMapping[]

type ViewMode = 'matrix' | 'overlap'

function leverageScore(m: CrosswalkMapping) {
  return m.nistIds.length + m.pciIds.length
}

export default function Crosswalk() {
  const navigate = useNavigate()
  const { frameworks, updateControlStatus } = useFrameworkStore()
  const [mode, setMode]               = useState<ViewMode>('matrix')
  const [domainFilter, setDomainFilter] = useState<string>('all')
  const [detailControl, setDetailControl] = useState<{ id: string; fwId: FrameworkId } | null>(null)

  const isoControls  = frameworks['iso27001']  ?? []
  const nistControls = frameworks['nist-csf']  ?? []
  const pciControls  = frameworks['pci-dss']   ?? []

  const isoMap  = useMemo(() => new Map(isoControls.map(c => [c.id, c])),  [isoControls])
  const nistMap = useMemo(() => new Map(nistControls.map(c => [c.id, c])), [nistControls])
  const pciMap  = useMemo(() => new Map(pciControls.map(c => [c.id, c])),  [pciControls])

  const isoDomains = useMemo(() => {
    const s = new Set(isoControls.map(c => c.domain))
    return ['all', ...Array.from(s)]
  }, [isoControls])

  const filtered = useMemo(() => {
    return mappings.filter(m => {
      if (domainFilter === 'all') return true
      const iso = isoMap.get(m.isoId)
      return iso?.domain === domainFilter
    })
  }, [domainFilter, isoMap])

  const topLeverage = useMemo(() =>
    [...mappings]
      .sort((a, b) => leverageScore(b) - leverageScore(a))
      .slice(0, 10)
  , [])

  function getControl(id: string, fwId: FrameworkId): Control | undefined {
    if (fwId === 'iso27001')  return isoMap.get(id)
    if (fwId === 'nist-csf')  return nistMap.get(id)
    if (fwId === 'pci-dss')   return pciMap.get(id)
  }

  function StatusDot({ id, fwId }: { id: string; fwId: FrameworkId }) {
    const c = getControl(id, fwId)
    const dotColor: Record<ControlStatus, string> = {
      'implemented':    'var(--ok)',
      'in-progress':    'var(--warn)',
      'not-started':    'var(--text-muted)',
      'not-applicable': 'var(--border-strong)',
    }
    return (
      <span
        className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: dotColor[c?.status ?? 'not-started'] }}
      />
    )
  }

  function ControlPill({ id, fwId }: { id: string; fwId: FrameworkId }) {
    const c = getControl(id, fwId)
    if (!c) return <span className="mono text-[11px]" style={{ color: 'var(--border-strong)' }}>{id}</span>
    return (
      <button
        onClick={() => setDetailControl({ id, fwId })}
        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded transition-colors text-left"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)'}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)'}
      >
        <StatusDot id={id} fwId={fwId} />
        <span className="mono text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>{id}</span>
      </button>
    )
  }

  const quickWins = useMemo(() => {
    return mappings
      .map(m => {
        const iso = isoMap.get(m.isoId)
        if (!iso || iso.status !== 'not-started') return null
        const unlocks =
          m.nistIds.filter(id => nistMap.get(id)?.status === 'not-started').length +
          m.pciIds.filter(id => pciMap.get(id)?.status === 'not-started').length
        return { mapping: m, iso, unlocks }
      })
      .filter((x): x is NonNullable<typeof x> => x !== null && x.unlocks > 0)
      .sort((a, b) => b.unlocks - a.unlocks)
      .slice(0, 5)
  }, [isoMap, nistMap, pciMap])

  const isoNistCount = mappings.filter(m => m.nistIds.length > 0).length
  const isoPciCount  = mappings.filter(m => m.pciIds.length > 0).length
  const nistPciCount = mappings.filter(m => m.nistIds.length > 0 && m.pciIds.length > 0).length

  const detailControlData = detailControl ? getControl(detailControl.id, detailControl.fwId) : undefined

  return (
    <div className="p-6 space-y-5 animate-fade-in">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <GitMerge size={20} style={{ color: 'var(--accent)' }} />
            Framework Crosswalk
          </h1>
          <p className="text-sm font-normal mt-1 max-w-xl" style={{ color: 'var(--text-muted)' }}>
            Maps ISO 27001 controls to equivalent NIST CSF subcategories and PCI-DSS requirements.
            Click any control ID to see its detail and current status.
          </p>
        </div>
        <div className="flex gap-2">
          {(['matrix', 'overlap'] as ViewMode[]).map(v => (
            <button
              key={v}
              onClick={() => setMode(v)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize"
              style={
                mode === v
                  ? { background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }
                  : { background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-default)' }
              }
            >
              {v === 'matrix' ? 'Matrix view' : 'Overlap analysis'}
            </button>
          ))}
        </div>
      </div>

      {mode === 'matrix' ? (
        <>
          {/* ── Domain filter ──────────────────────────────────────────────── */}
          <div className="flex gap-2 items-center">
            <Layers size={13} style={{ color: 'var(--text-muted)' }} />
            <select
              value={domainFilter}
              onChange={e => setDomainFilter(e.target.value)}
              className="mono text-xs max-w-xs"
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-default)',
                borderRadius: '8px',
                padding: '7px 12px',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            >
              {isoDomains.map(d => (
                <option key={d} value={d}>{d === 'all' ? 'All ISO domains' : d}</option>
              ))}
            </select>
            <span className="mono text-[11px] font-semibold" style={{ color: 'var(--text-muted)' }}>
              {filtered.length} mappings
            </span>
          </div>

          {/* ── Matrix table ───────────────────────────────────────────────── */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                    <th className="w-28 px-4 py-3 text-left mono text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--iso-color)' }}>
                      ISO 27001
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Title
                    </th>
                    <th className="w-56 px-4 py-3 text-left mono text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--nist-color)' }}>
                      NIST CSF 2.0
                    </th>
                    <th className="w-48 px-4 py-3 text-left mono text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--pci-color)' }}>
                      PCI-DSS v4.0
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m, idx) => {
                    const iso = isoMap.get(m.isoId)
                    return (
                      <tr
                        key={m.isoId}
                        style={{
                          borderBottom: '1px solid var(--border-subtle)',
                          background: idx % 2 !== 0 ? 'var(--bg-elevated)' : 'transparent',
                        }}
                      >
                        <td className="px-4 py-3">
                          <ControlPill id={m.isoId} fwId="iso27001" />
                        </td>
                        <td className="px-4 py-3 max-w-xs">
                          <span className="text-sm font-normal leading-snug line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                            {iso?.title ?? '—'}
                          </span>
                          {m.notes && (
                            <span className="block text-[11px] mt-0.5 line-clamp-1 font-normal" style={{ color: 'var(--text-muted)' }}>
                              {m.notes}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {m.nistIds.length > 0
                              ? m.nistIds.map(nid => <ControlPill key={nid} id={nid} fwId="nist-csf" />)
                              : <span style={{ color: 'var(--border-strong)' }}>—</span>
                            }
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {m.pciIds.length > 0
                              ? m.pciIds.map(pid => <ControlPill key={pid} id={pid} fwId="pci-dss" />)
                              : <span style={{ color: 'var(--border-strong)' }}>—</span>
                            }
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-5">
          {/* ── Pair summary cards ─────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'ISO ↔ NIST',  count: isoNistCount, sub: 'ISO controls with NIST mappings',  color: 'var(--iso-color)' },
              { label: 'ISO ↔ PCI',   count: isoPciCount,  sub: 'ISO controls with PCI mappings',   color: 'var(--pci-color)' },
              { label: 'All three',   count: nistPciCount, sub: 'Controls mapped across all three',  color: 'var(--ok)' },
            ].map(p => (
              <Card key={p.label}>
                <p className="mono text-3xl font-bold" style={{ color: p.color }}>{p.count}</p>
                <p className="text-sm font-normal mt-1" style={{ color: 'var(--text-muted)' }}>{p.sub}</p>
                <p className="text-lg font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{p.label}</p>
              </Card>
            ))}
          </div>

          {/* ── Implementation leverage ────────────────────────────────────── */}
          <Card title="Implementation leverage" subtitle="Implementing these ISO 27001 controls satisfies the most NIST and PCI requirements simultaneously">
            <div className="space-y-2 mt-2">
              {topLeverage.map((m, i) => {
                const iso   = isoMap.get(m.isoId)
                const score = leverageScore(m)
                return (
                  <div
                    key={m.isoId}
                    className="flex items-center gap-3 py-2 last:border-0"
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                  >
                    <span className="mono text-[11px] font-semibold w-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
                      {i + 1}
                    </span>
                    <button
                      onClick={() => setDetailControl({ id: m.isoId, fwId: 'iso27001' })}
                      className="mono text-[11px] font-bold w-12 flex-shrink-0 text-left transition-opacity"
                      style={{ color: 'var(--accent)' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.75'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                    >
                      {m.isoId}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-normal truncate" style={{ color: 'var(--text-secondary)' }}>{iso?.title}</p>
                      <p className="text-[11px] mt-0.5 truncate font-normal" style={{ color: 'var(--text-muted)' }}>{m.notes}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {m.nistIds.length > 0 && (
                        <span
                          className="mono text-[11px] font-semibold px-1.5 py-0.5 rounded"
                          style={{
                            color: 'var(--nist-color)',
                            background: 'rgba(124,58,237,0.10)',
                            border: '1px solid rgba(124,58,237,0.20)',
                          }}
                        >
                          +{m.nistIds.length} NIST
                        </span>
                      )}
                      {m.pciIds.length > 0 && (
                        <span
                          className="mono text-[11px] font-semibold px-1.5 py-0.5 rounded"
                          style={{
                            color: 'var(--pci-color)',
                            background: 'rgba(201,123,26,0.10)',
                            border: '1px solid rgba(201,123,26,0.20)',
                          }}
                        >
                          +{m.pciIds.length} PCI
                        </span>
                      )}
                      <span
                        className="mono text-[11px] font-bold px-2 py-0.5 rounded"
                        style={{
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-default)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        ×{score}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* ── Quick wins ─────────────────────────────────────────────────── */}
          {quickWins.length > 0 && (
            <Card title="Quick wins" subtitle="Not-started ISO controls that satisfy the most not-started NIST + PCI requirements in one go">
              <div className="space-y-2 mt-2">
                {quickWins.map(({ mapping: m, iso, unlocks }) => (
                  <div
                    key={m.isoId}
                    className="flex items-center gap-3 py-2 last:border-0"
                    style={{ borderBottom: '1px solid var(--border-subtle)' }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="mono text-[11px] font-bold" style={{ color: 'var(--accent)' }}>{m.isoId}</span>
                        <span
                          className="mono text-[11px] font-semibold px-1.5 py-0.5 rounded"
                          style={{
                            color: 'var(--ok)',
                            background: 'var(--ok-dim)',
                            border: '1px solid rgba(22,163,74,0.20)',
                          }}
                        >
                          unlocks ×{unlocks}
                        </span>
                      </div>
                      <p className="text-sm font-normal truncate mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        {iso.title}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        updateControlStatus('iso27001', m.isoId, 'in-progress')
                        navigate(`/framework/iso27001`)
                      }}
                      className="flex-shrink-0 px-2.5 py-1 text-[11px] font-semibold rounded transition-all"
                      style={{
                        color: 'var(--accent)',
                        background: 'var(--accent-dim)',
                        border: '1px solid var(--accent-border)',
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.85'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                    >
                      Start this control
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* ── Legend ─────────────────────────────────────────────────────── */}
          <Card>
            <div className="flex items-start gap-2">
              <Info size={13} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
              <div className="space-y-1">
                <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Status colour guide</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { label: 'Implemented',  color: 'var(--ok)' },
                    { label: 'In Progress',  color: 'var(--warn)' },
                    { label: 'Not Started',  color: 'var(--text-muted)' },
                    { label: 'N/A',          color: 'var(--border-strong)' },
                  ].map(l => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                      <span className="text-[11px] font-normal" style={{ color: 'var(--text-muted)' }}>{l.label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] font-normal" style={{ color: 'var(--text-muted)' }}>
                  Dots shown on each control pill reflect the current implementation status from your tracker.
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ── Control detail modal ───────────────────────────────────────────── */}
      <Modal
        open={!!detailControl}
        onClose={() => setDetailControl(null)}
        title={`${detailControl?.id} — Control detail`}
      >
        {detailControlData && (
          <div className="space-y-4">
            <div>
              <p className="text-[11px] mono font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                {detailControl?.fwId.toUpperCase()}
              </p>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{detailControlData.title}</p>
            </div>
            <p className="text-sm font-normal leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {detailControlData.description}
            </p>
            <div
              className="p-3 rounded-lg"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
            >
              <p className="text-[11px] mono font-bold mb-1 uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                Guidance
              </p>
              <p className="text-sm font-normal leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {detailControlData.guidance}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Current status
              </span>
              <Badge value={detailControlData.status} />
            </div>
            {detailControlData.notes && (
              <div>
                <p className="text-[11px] mono font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                  Notes
                </p>
                <p className="text-sm font-normal" style={{ color: 'var(--text-secondary)' }}>{detailControlData.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
