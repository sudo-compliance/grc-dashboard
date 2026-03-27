import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ShieldCheck, Layers, CreditCard, AlertTriangle, CheckCircle, Clock,
  ShieldAlert, ListChecks, BadgeCheck, Lock, ShieldHalf, TrendingUp, Users,
} from 'lucide-react'
import { useFrameworkStore } from '../store/useFrameworkStore'
import { useRiskStore } from '../store/useRiskStore'
import { useUIStore } from '../store/useUIStore'
import { generateGapNarrative } from '../services/gapAnalysis'
import Card from '../components/ui/Card'
import DomainBarChart from '../components/charts/DomainBarChart'
import ControlHeatmap from '../components/charts/ControlHeatmap'
import Badge from '../components/ui/Badge'
import isoData  from '../data/iso27001.json'
import nistData from '../data/nist-csf.json'
import pciData  from '../data/pci-dss.json'
import doraData from '../data/dora.json'
import cisData  from '../data/cis-v8.json'
import soc2Data from '../data/soc2.json'
import gdprData from '../data/uk-gdpr.json'
import ceData   from '../data/cyber-essentials.json'
import aiData   from '../data/iso-42001.json'
import type { Control, FrameworkId } from '../types'

const FRAMEWORKS = [
  { id: 'iso27001'         as FrameworkId, name: 'ISO 27001',       version: '2022',  icon: <ShieldCheck   size={15}/>, color: 'var(--iso-color)'  },
  { id: 'iso42001'         as FrameworkId, name: 'ISO 42001',       version: '2023',  icon: <TrendingUp    size={15}/>, color: 'var(--ai-color)'   },
  { id: 'nist-csf'         as FrameworkId, name: 'NIST CSF',        version: '2.0',   icon: <Layers        size={15}/>, color: 'var(--nist-color)' },
  { id: 'pci-dss'          as FrameworkId, name: 'PCI-DSS',         version: 'v4.0',  icon: <CreditCard    size={15}/>, color: 'var(--pci-color)'  },
  { id: 'dora'             as FrameworkId, name: 'DORA',            version: '2025',  icon: <ShieldAlert   size={15}/>, color: 'var(--dora-color)' },
  { id: 'cis-v8'           as FrameworkId, name: 'CIS Controls',    version: 'v8',    icon: <ListChecks    size={15}/>, color: 'var(--cis-color)'  },
  { id: 'soc2'             as FrameworkId, name: 'SOC 2',           version: '2017',  icon: <BadgeCheck    size={15}/>, color: 'var(--soc2-color)' },
  { id: 'uk-gdpr'          as FrameworkId, name: 'UK GDPR',         version: '2018',  icon: <Lock          size={15}/>, color: 'var(--gdpr-color)' },
  { id: 'cyber-essentials' as FrameworkId, name: 'Cyber Essentials',version: '2024',  icon: <ShieldHalf    size={15}/>, color: 'var(--ce-color)'   },
]

const RAW: Record<FrameworkId, Control[]> = {
  'iso27001':         isoData  as Control[],
  'nist-csf':         nistData as Control[],
  'pci-dss':          pciData  as Control[],
  'dora':             doraData as Control[],
  'cis-v8':           cisData  as Control[],
  'soc2':             soc2Data as Control[],
  'uk-gdpr':          gdprData as Control[],
  'cyber-essentials': ceData   as Control[],
  'iso42001':         aiData   as Control[],
}

type DashView = 'bar' | 'heatmap'

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

const btnStyle = (active: boolean): React.CSSProperties => ({
  padding: '4px 11px', borderRadius: 5, fontSize: 12,
  fontFamily: 'Geist, system-ui, sans-serif', cursor: 'pointer', transition: 'all 0.15s',
  border: active ? '1px solid var(--accent-border)' : '1px solid transparent',
  background: active ? 'var(--accent-dim)' : 'transparent',
  color: active ? 'var(--accent)' : 'var(--text-muted)',
})

export default function Dashboard() {
  const { initFramework, getCompletionStats, getDomainStats, getOwnerSummary, recentActivity, frameworks } = useFrameworkStore()
  const { risks } = useRiskStore()
  const { activeFramework, setActiveFramework } = useUIStore()
  const navigate = useNavigate()
  const [chartView, setChartView] = useState<DashView>('bar')

  useEffect(() => {
    const ids: FrameworkId[] = ['iso27001', 'nist-csf', 'pci-dss', 'dora', 'cis-v8', 'soc2', 'uk-gdpr', 'cyber-essentials', 'iso42001']
    ids.forEach(id => initFramework(id, RAW[id]))
  }, [initFramework])

  const allStats      = FRAMEWORKS.map(f => ({ ...f, stats: getCompletionStats(f.id) }))
  const totalControls = allStats.reduce((s, f) => s + f.stats.total, 0)
  const totalImp      = allStats.reduce((s, f) => s + f.stats.implemented, 0)
  const openRisks     = risks.filter(r => r.status === 'open').length
  const criticalRisks = risks.filter(r => r.riskLevel === 'critical').length

  const domainStats    = getDomainStats(activeFramework)
  const activeControls = frameworks[activeFramework] ?? []
  const ownerSummary   = getOwnerSummary(activeFramework)

  const activeGap = activeControls.length > 0
    ? generateGapNarrative(activeFramework, activeControls)
    : null

  const totalWithOwner = allStats.reduce((sum, f) => {
    const cs = frameworks[f.id] ?? []
    return sum + cs.filter(c => (c.owner ?? '').trim()).length
  }, 0)
  const ownerCoverage = totalControls > 0 ? Math.round((totalWithOwner / totalControls) * 100) : 0
  const activeMeta    = FRAMEWORKS.find(f => f.id === activeFramework)

  return (
    <div className="p-6 space-y-5 page-enter">

      {/* ── KPI bar ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total controls', value: totalControls,  icon: <ShieldCheck   size={14} style={{ color: 'var(--text-muted)' }} /> },
          { label: 'Implemented',    value: totalImp,       icon: <CheckCircle   size={14} style={{ color: 'var(--ok)' }} /> },
          { label: 'Open risks',     value: openRisks,      icon: <AlertTriangle size={14} style={{ color: 'var(--warn)' }} /> },
          { label: 'Critical risks', value: criticalRisks,  icon: <AlertTriangle size={14} style={{ color: 'var(--danger)' }} /> },
        ].map(s => (
          <Card key={s.label} className="flex items-center gap-3 py-4">
            <div className="p-2 rounded-lg flex-shrink-0" style={{ background: 'var(--bg-elevated)' }}>
              {s.icon}
            </div>
            <div>
              <p className="mono text-2xl font-bold leading-none" style={{ color: 'var(--text-primary)' }}>
                {s.value}
              </p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Posture insights ────────────────────────────────────────────── */}
      {activeGap && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

          {/* Posture summary */}
          <Card className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={14} style={{ color: activeMeta?.color ?? 'var(--accent)', flexShrink: 0 }} />
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {activeMeta?.name} posture
              </span>
              <span
                className="mono text-xs px-2 py-0.5 rounded-full ml-auto"
                style={{
                  background: activeGap.momentum === 'good' ? 'var(--ok-dim)' : activeGap.momentum === 'slow' ? 'var(--warn-dim)' : 'var(--bg-elevated)',
                  color:      activeGap.momentum === 'good' ? 'var(--ok)'     : activeGap.momentum === 'slow' ? 'var(--warn)'     : 'var(--text-muted)',
                }}
              >
                {activeGap.momentum === 'good' ? '↑ Good momentum' : activeGap.momentum === 'slow' ? '→ Slow' : '· No momentum'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Complete',    value: activeGap.implemented, color: 'var(--ok)' },
                { label: 'In progress', value: activeGap.inProgress,  color: 'var(--warn)' },
                { label: 'Not started', value: activeGap.notStarted,  color: 'var(--text-muted)' },
              ].map(s => (
                <div key={s.label} className="text-center p-2 rounded-lg" style={{ background: 'var(--bg-elevated)' }}>
                  <p className="mono text-lg font-bold leading-none" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${activeGap.percentComplete}%`, background: activeMeta?.color ?? 'var(--accent)' }}
                />
              </div>
              <span className="mono text-xs font-semibold" style={{ color: activeMeta?.color ?? 'var(--accent)' }}>
                {activeGap.percentComplete}%
              </span>
            </div>
          </Card>

          {/* Gap concentration */}
          <Card className="flex flex-col gap-3">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Gap concentration</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {activeGap.concentrationInsight}
            </p>
            {activeGap.criticalGaps.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {activeGap.criticalGaps.map(id => (
                  <button
                    key={id}
                    onClick={() => navigate(`/framework/${activeFramework}`)}
                    className="control-id text-[11px] transition-all hover:opacity-80"
                  >
                    {id}
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Priority action */}
          <Card className="flex flex-col gap-3" accentColor="var(--accent)">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Priority action</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {activeGap.priorityAction}
            </p>
            <button
              onClick={() => navigate(`/framework/${activeFramework}`)}
              className="mt-auto text-xs font-semibold py-2 rounded-lg transition-all"
              style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.filter = ''}
            >
              Open framework →
            </button>
          </Card>
        </div>
      )}

      {/* ── Framework cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {allStats.map(fw => (
          <Card key={fw.id} accentColor={fw.color} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span style={{ color: fw.color, flexShrink: 0 }}>{fw.icon}</span>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{fw.name}</h3>
                  <span className="mono text-[11px]" style={{ color: 'var(--text-muted)' }}>
                    v{fw.version} · {fw.stats.total} controls
                  </span>
                </div>
              </div>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: fw.color }} />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {fw.stats.implemented}/{fw.stats.total}
                </span>
                <span className="mono text-xs font-bold" style={{ color: fw.color }}>
                  {fw.stats.percentComplete}%
                </span>
              </div>
              <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${fw.stats.percentComplete}%`, background: fw.color }}
                />
              </div>
            </div>

            <div className="flex gap-1 text-[11px] mono flex-wrap">
              {fw.stats.inProgress > 0 && (
                <span className="px-1.5 py-0.5 rounded" style={{ background: 'var(--warn-dim)', color: 'var(--warn)' }}>
                  {fw.stats.inProgress} in progress
                </span>
              )}
              {fw.stats.notStarted > 0 && (
                <span className="px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)' }}>
                  {fw.stats.notStarted} not started
                </span>
              )}
              {fw.stats.notApplicable > 0 && (
                <span className="px-1.5 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', opacity: 0.6 }}>
                  {fw.stats.notApplicable} N/A
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-1 mt-auto">
              <button
                onClick={() => navigate(`/framework/${fw.id}`)}
                className="text-xs py-1.5 rounded-lg transition-all"
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)' }}
              >
                Details
              </button>
              <button
                onClick={() => navigate(`/controls/${fw.id}`)}
                className="text-xs py-1.5 rounded-lg transition-all font-medium"
                style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.filter = ''}
              >
                Controls
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Domain chart + Activity + Ownership ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">

        {/* Domain chart */}
        <Card
          className="lg:col-span-3"
          title="Domain analysis"
          action={
            <div className="flex gap-1 flex-wrap justify-end">
              {FRAMEWORKS.map(f => {
                const label = f.id === 'iso27001' ? 'ISO 27001' : f.id === 'iso42001' ? 'ISO 42001' : f.id === 'nist-csf' ? 'NIST' : f.id === 'pci-dss' ? 'PCI' : f.id === 'dora' ? 'DORA' : f.id === 'cis-v8' ? 'CIS' : f.id === 'soc2' ? 'SOC 2' : f.id === 'uk-gdpr' ? 'GDPR' : 'CE'
                return (
                  <button
                    key={f.id}
                    onClick={() => setActiveFramework(f.id)}
                    style={{
                      ...btnStyle(activeFramework === f.id),
                      borderColor: activeFramework === f.id ? f.color : 'transparent',
                      color:       activeFramework === f.id ? f.color : 'var(--text-muted)',
                      background:  activeFramework === f.id ? `${f.color}18` : 'transparent',
                    }}
                    title={f.name}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          }
        >
          <div className="flex justify-end gap-1 mb-3">
            {(['bar', 'heatmap'] as DashView[]).map(v => (
              <button key={v} onClick={() => setChartView(v)} style={btnStyle(chartView === v)}>
                {v === 'bar' ? 'Bar' : 'Grid'}
              </button>
            ))}
          </div>
          {chartView === 'bar' ? (
            domainStats.length === 0
              ? <div className="h-32 flex items-center justify-center text-xs" style={{ color: 'var(--text-muted)' }}>Loading…</div>
              : <DomainBarChart domains={domainStats} />
          ) : (
            <ControlHeatmap controls={activeControls} frameworkId={activeFramework} />
          )}
        </Card>

        {/* Recent activity */}
        <Card className="lg:col-span-2" title="Recent activity">
          {recentActivity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2" style={{ color: 'var(--text-muted)' }}>
              <Clock size={22} />
              <p className="text-sm">No activity yet</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
                Update a control status to track changes
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {recentActivity.slice(0, 9).map((a, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 py-2"
                  style={{ borderBottom: i < 8 ? '1px solid var(--border-subtle)' : 'none' }}
                >
                  <span
                    className="mono text-xs font-semibold flex-shrink-0 w-14 truncate pt-0.5"
                    style={{ color: 'var(--accent)' }}
                  >
                    {a.controlId}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Badge value={a.newValue as Parameters<typeof Badge>[0]['value']} />
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {a.frameworkId.toUpperCase()} · {relativeTime(a.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Ownership coverage */}
        <Card className="lg:col-span-2" title="Ownership coverage">
          <div
            className="flex items-center gap-3 p-3 rounded-lg mb-4"
            style={{ background: 'var(--bg-elevated)' }}
          >
            <Users size={18} style={{
              color: ownerCoverage >= 80 ? 'var(--ok)' : ownerCoverage >= 40 ? 'var(--warn)' : 'var(--danger)',
              flexShrink: 0,
            }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>All frameworks</span>
                <span
                  className="mono text-sm font-bold"
                  style={{ color: ownerCoverage >= 80 ? 'var(--ok)' : ownerCoverage >= 40 ? 'var(--warn)' : 'var(--danger)' }}
                >
                  {ownerCoverage}%
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${ownerCoverage}%`,
                    background: ownerCoverage >= 80 ? 'var(--ok)' : ownerCoverage >= 40 ? 'var(--warn)' : 'var(--danger)',
                  }}
                />
              </div>
            </div>
          </div>

          {ownerSummary.length > 0 ? (
            <div className="space-y-1.5">
              <p className="mono text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                {activeMeta?.name} owners
              </p>
              {ownerSummary.slice(0, 5).map(o => (
                <div key={o.owner} className="flex items-center gap-2">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mono text-[11px] font-bold"
                    style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}
                  >
                    {o.owner[0]?.toUpperCase()}
                  </span>
                  <span className="text-sm flex-1 truncate" style={{ color: 'var(--text-secondary)' }}>
                    {o.owner}
                  </span>
                  <span className="mono text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                    {o.implemented}/{o.count}
                  </span>
                  <div className="w-12 h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${o.count > 0 ? Math.round((o.implemented / o.count) * 100) : 0}%`,
                        background: 'var(--ok)',
                      }}
                    />
                  </div>
                </div>
              ))}
              {ownerSummary.length > 5 && (
                <p className="text-xs text-center mt-2" style={{ color: 'var(--text-muted)' }}>
                  +{ownerSummary.length - 5} more owners
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 gap-2 text-center">
              <Users size={20} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No owners assigned</p>
              <button
                onClick={() => navigate(`/controls/${activeFramework}`)}
                className="text-sm transition-colors"
                style={{ color: 'var(--accent)' }}
              >
                Assign owners →
              </button>
            </div>
          )}
        </Card>
      </div>

    </div>
  )
}
