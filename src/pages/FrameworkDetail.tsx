import { useEffect, useState, useMemo, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { ChevronDown, ChevronRight, Search } from 'lucide-react'
import { useFrameworkStore } from '../store/useFrameworkStore'
import { useUIStore } from '../store/useUIStore'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import StatusSelect from '../components/ui/StatusSelect'
import DomainBarChart from '../components/charts/DomainBarChart'
import CompletionDonut from '../components/charts/CompletionDonut'
import { generateGapNarrative } from '../services/gapAnalysis'
import isoData from '../data/iso27001.json'
import nistData from '../data/nist-csf.json'
import pciData from '../data/pci-dss.json'
import doraData from '../data/dora.json'
import cisData from '../data/cis-v8.json'
import soc2Data from '../data/soc2.json'
import gdprData from '../data/uk-gdpr.json'
import ceData from '../data/cyber-essentials.json'
import aiData from '../data/iso-42001.json'
import type { Control, ControlStatus, FrameworkId } from '../types'

const RAW: Record<string, Control[]> = {
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

/* color is a CSS colour value, accent is a CSS colour value for border */
const META: Record<string, { name: string; version: string; color: string; accent: string; description: string }> = {
  'iso27001':         { name: 'ISO 27001',       version: '2022',    color: 'var(--iso-color)',  accent: 'var(--iso-color)',  description: 'The international standard for information security management systems (ISMS). Provides a systematic, risk-based approach to managing sensitive information through people, processes, and technology.' },
  'nist-csf':         { name: 'NIST CSF',         version: '2.0',     color: 'var(--nist-color)', accent: 'var(--nist-color)', description: 'The NIST Cybersecurity Framework 2.0 provides guidance for managing and reducing cybersecurity risk across six functions: Govern, Identify, Protect, Detect, Respond, and Recover.' },
  'pci-dss':          { name: 'PCI-DSS',          version: 'v4.0',    color: 'var(--pci-color)',  accent: 'var(--pci-color)',  description: 'The Payment Card Industry Data Security Standard applies to all entities that store, process, or transmit cardholder data, across 12 requirements covering network, access, monitoring, and testing.' },
  'dora':             { name: 'DORA',             version: '2025',    color: 'var(--dora-color)', accent: 'var(--dora-color)', description: 'The Digital Operational Resilience Act is EU regulation in force from January 2025. It applies to financial entities and critical ICT third-party providers across 5 pillars: ICT risk management, incident management, resilience testing, third-party risk, and intelligence sharing.' },
  'cis-v8':           { name: 'CIS Controls',     version: 'v8',      color: 'var(--cis-color)',  accent: 'var(--cis-color)',  description: 'CIS Controls v8 provides 18 controls and 153 actionable safeguards organised by Implementation Group (IG1–IG3). The most practically actionable security framework — every safeguard is a specific technical or procedural action with measurable outcomes.' },
  'soc2':             { name: 'SOC 2',            version: 'TSC',     color: 'var(--soc2-color)', accent: 'var(--soc2-color)', description: 'SOC 2 Trust Services Criteria (AICPA, 2017 with 2022 points of focus) covers Security, Availability, Processing Integrity, Confidentiality, and Privacy. Required for SaaS vendors serving enterprise customers.' },
  'uk-gdpr':          { name: 'UK GDPR',          version: 'DPA2018', color: 'var(--gdpr-color)', accent: 'var(--gdpr-color)', description: 'The retained EU GDPR as amended by the Data Protection Act 2018. Covers lawful basis, data subject rights, controller/processor obligations, security measures, breach notification, DPIAs, and international transfers.' },
  'cyber-essentials': { name: 'Cyber Essentials', version: 'CE+',     color: 'var(--ce-color)',   accent: 'var(--ce-color)',   description: 'UK NCSC Cyber Essentials scheme: 5 technical controls (firewalls, secure configuration, user access control, malware protection, patch management). CE+ adds independent verification. Required for UK government contracts handling personal data.' },
  'iso42001':         { name: 'ISO 42001',        version: '2023',    color: 'var(--ai-color)',   accent: 'var(--ai-color)',   description: 'ISO/IEC 42001:2023 is the international standard for Artificial Intelligence Management Systems (AIMS). It provides a framework for responsible AI development and use, covering governance, risk assessment, impact assessment, data quality, human oversight, and AI system lifecycle management.' },
}

type StatusFilter = ControlStatus | 'all'

/* ─── Reusable inline-style input/textarea ──────────────────────────────── */
const inputStyle: React.CSSProperties = {
  width: '100%',
  fontSize: '12px',
  background: 'var(--bg-input)',
  border: '1px solid var(--border-default)',
  borderRadius: '8px',
  padding: '6px 12px',
  color: 'var(--text-primary)',
  outline: 'none',
}

export default function FrameworkDetail() {
  const { id = 'iso27001' } = useParams<{ id: string }>()
  const { frameworks, initFramework, updateControlStatus, updateControlNotes, updateControlEvidence, updateControlOwner, getCompletionStats, getDomainStats } = useFrameworkStore()
  const { addToast } = useUIStore()

  const [search, setSearch]             = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [expandedDomains, setExpandedDomains]   = useState<Set<string>>(new Set())
  const [expandedControls, setExpandedControls] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab]       = useState<'controls' | 'overview'>('controls')

  const fwId = id as FrameworkId
  const meta = META[id] ?? META['iso27001']

  useEffect(() => {
    initFramework(fwId, RAW[id] ?? [])
    setSearch('')
    setStatusFilter('all')
    setExpandedDomains(new Set())
    setExpandedControls(new Set())
  }, [fwId, id, initFramework])

  const controls = frameworks[fwId] ?? []
  const stats    = getCompletionStats(fwId)
  const domains  = getDomainStats(fwId)

  const gapNarrative = useMemo(() =>
    controls.length > 0 ? generateGapNarrative(fwId, controls) : null,
    [fwId, controls]
  )

  const grouped = useMemo(() => {
    const map = new Map<string, Control[]>()
    for (const c of controls) {
      if (!map.has(c.domain)) map.set(c.domain, [])
      map.get(c.domain)!.push(c)
    }
    return map
  }, [controls])

  const filtered = useMemo(() => {
    if (!search && statusFilter === 'all') return null
    return controls.filter(c => {
      const matchSearch = !search || c.id.toLowerCase().includes(search.toLowerCase()) || c.title.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'all' || c.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [controls, search, statusFilter])

  function toggleDomain(domain: string) {
    setExpandedDomains(s => { const n = new Set(s); n.has(domain) ? n.delete(domain) : n.add(domain); return n })
  }

  const expandControlAndSwitchTab = useCallback((controlId: string) => {
    setActiveTab('controls')
    setExpandedControls(s => new Set([...s, controlId]))
    const ctrl = controls.find(c => c.id === controlId)
    if (ctrl) setExpandedDomains(s => new Set([...s, ctrl.domain]))
    setTimeout(() => {
      document.getElementById(`control-${controlId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }, [controls])

  function toggleControl(controlId: string) {
    setExpandedControls(s => { const n = new Set(s); n.has(controlId) ? n.delete(controlId) : n.add(controlId); return n })
  }

  function handleStatus(controlId: string, status: ControlStatus) {
    updateControlStatus(fwId, controlId, status)
    addToast('Status updated', 'success', 1500)
  }

  const renderControl = (c: Control) => {
    const isExpanded = expandedControls.has(c.id)
    return (
      <div
        key={c.id}
        id={`control-${c.id}`}
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
        className="last:border-0"
      >
        {/* Row */}
        <div
          className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors"
          style={{ background: 'transparent' }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
          onClick={() => toggleControl(c.id)}
        >
          <span
            className="mono text-xs w-14 flex-shrink-0 pt-0.5 font-semibold"
            style={{ color: 'var(--accent)' }}
          >
            {c.id}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>
              {c.title}
            </p>
            {!isExpanded && (
              <p className="text-xs mt-0.5 line-clamp-1 font-normal" style={{ color: 'var(--text-muted)' }}>
                {c.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2" onClick={e => e.stopPropagation()}>
            <Badge value={c.status} />
            <StatusSelect value={c.status} onChange={s => handleStatus(c.id, s)} compact />
          </div>
          <span className="flex-shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
          </span>
        </div>

        {/* Expanded detail */}
        {isExpanded && (
          <div className="px-4 pb-4 ml-[68px] space-y-3 animate-fade-in">
            <p className="text-sm leading-relaxed font-normal" style={{ color: 'var(--text-secondary)' }}>
              {c.description}
            </p>

            {/* Guidance box */}
            <div
              className="p-3 rounded-lg"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
            >
              <p className="text-[11px] mono font-bold mb-1 uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                Implementation guidance
              </p>
              <p className="text-sm leading-relaxed font-normal" style={{ color: 'var(--text-secondary)' }}>
                {c.guidance}
              </p>
            </div>

            {/* How to implement */}
            {c.implementationGuide && (
              <div
                className="p-3 rounded-lg"
                style={{ background: 'var(--info-dim)', border: '1px solid rgba(37,99,235,0.20)' }}
              >
                <p className="text-[11px] mono font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'var(--info)' }}>
                  How to implement this
                </p>
                <p className="text-sm leading-relaxed font-normal" style={{ color: 'var(--text-secondary)' }}>
                  {c.implementationGuide}
                </p>
              </div>
            )}

            {/* Example evidence */}
            {c.exampleEvidence && c.exampleEvidence.length > 0 && (
              <div
                className="p-3 rounded-lg"
                style={{ background: 'var(--ok-dim)', border: '1px solid rgba(22,163,74,0.20)' }}
              >
                <p className="text-[11px] mono font-bold mb-2 uppercase tracking-wider" style={{ color: 'var(--ok)' }}>
                  Example evidence
                </p>
                <ul className="space-y-1.5">
                  {c.exampleEvidence.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm leading-relaxed font-normal" style={{ color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--ok)', flexShrink: 0, marginTop: 2 }}>›</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* CIS IG level badge */}
            {c.igLevel && (
              <div className="flex items-center gap-2">
                <span className="mono text-[11px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  IG Level:
                </span>
                <span
                  className="mono text-[11px] font-bold px-2 py-0.5 rounded"
                  style={{
                    background: c.igLevel === 1 ? 'var(--ok-dim)' : c.igLevel === 2 ? 'var(--warn-dim)' : 'var(--danger-dim)',
                    color:      c.igLevel === 1 ? 'var(--ok)'     : c.igLevel === 2 ? 'var(--warn)'     : 'var(--danger)',
                  }}
                >
                  IG{c.igLevel}
                </span>
              </div>
            )}

            {/* Notes + Evidence */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] mono font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>
                  Notes
                </label>
                <textarea
                  rows={2}
                  defaultValue={c.notes}
                  onBlur={e => updateControlNotes(fwId, c.id, e.target.value)}
                  placeholder="Add implementation notes…"
                  style={{ ...inputStyle, resize: 'none' }}
                />
              </div>
              <div>
                <label className="text-[11px] mono font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>
                  Evidence / link
                </label>
                <input
                  type="text"
                  defaultValue={c.evidence}
                  onBlur={e => updateControlEvidence(fwId, c.id, e.target.value)}
                  placeholder="URL or reference…"
                  style={inputStyle}
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] mono font-bold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>
                Owner
              </label>
              <input
                type="text"
                defaultValue={c.owner ?? ''}
                onBlur={e => updateControlOwner(fwId, c.id, e.target.value)}
                placeholder="Assign an owner — e.g. Head of IT"
                style={inputStyle}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  const displayList = filtered ?? controls

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: meta.color }}>
            {meta.name}{' '}
            <span className="text-base font-normal" style={{ color: 'var(--text-muted)' }}>
              v{meta.version}
            </span>
          </h1>
          <p className="text-sm mt-1 max-w-2xl leading-relaxed font-normal" style={{ color: 'var(--text-secondary)' }}>
            {meta.description}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2">
          {(['controls', 'overview'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize"
              style={
                activeTab === tab
                  ? { background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }
                  : { background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-default)' }
              }
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Overview tab ───────────────────────────────────────────────────── */}
      {activeTab === 'overview' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card title="Completion status">
              <CompletionDonut stats={stats} size={180} />
            </Card>
            <Card className="lg:col-span-2" title="Progress by domain">
              <DomainBarChart domains={domains} />
            </Card>
          </div>

          {gapNarrative && (
            <Card title="Gap analysis" subtitle="Automated posture insights based on current control statuses">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">

                {/* Left — Posture summary */}
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="mono text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {gapNarrative.percentComplete}%
                    </p>
                    <p className="text-sm mt-1 font-normal" style={{ color: 'var(--text-muted)' }}>complete</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        background: gapNarrative.momentum === 'good' ? 'var(--ok)'
                          : gapNarrative.momentum === 'slow' ? 'var(--warn)'
                          : 'var(--text-muted)',
                      }}
                    />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                      {gapNarrative.momentum === 'good' ? 'Good momentum'
                        : gapNarrative.momentum === 'slow' ? 'Building momentum'
                        : 'Not yet started'}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm font-normal" style={{ color: 'var(--text-muted)' }}>
                    <div className="flex justify-between">
                      <span>Implemented</span>
                      <span className="mono font-bold" style={{ color: 'var(--ok)' }}>{gapNarrative.implemented}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>In progress</span>
                      <span className="mono font-bold" style={{ color: 'var(--warn)' }}>{gapNarrative.inProgress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Not started</span>
                      <span className="mono font-bold">{gapNarrative.notStarted}</span>
                    </div>
                  </div>
                </div>

                {/* Centre — Concentration insight */}
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed font-normal" style={{ color: 'var(--text-secondary)' }}>
                    {gapNarrative.concentrationInsight}
                  </p>
                  {gapNarrative.topGapDomain && (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="truncate font-normal" style={{ color: 'var(--text-muted)' }}>{gapNarrative.topGapDomain}</span>
                        <span className="mono font-semibold" style={{ color: 'var(--text-muted)' }}>
                          {gapNarrative.topGapDomainNotStarted} gaps
                        </span>
                      </div>
                      <div className="h-1 rounded-full" style={{ background: 'var(--bg-elevated)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            background: 'var(--danger)',
                            width: `${Math.min(100, Math.round((gapNarrative.topGapDomainNotStarted / Math.max(1, gapNarrative.notStarted)) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                  {gapNarrative.criticalGaps.length > 0 && (
                    <div>
                      <p className="text-[11px] mono font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
                        Critical gaps
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {gapNarrative.criticalGaps.map(id => (
                          <button
                            key={id}
                            onClick={() => expandControlAndSwitchTab(id)}
                            className="mono text-xs font-semibold px-2 py-0.5 rounded transition-all"
                            style={{
                              background: 'var(--bg-elevated)',
                              border: '1px solid var(--border-default)',
                              color: 'var(--accent)',
                            }}
                            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'}
                            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)'}
                          >
                            {id}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right — Priority action */}
                <div
                  className="rounded-lg p-4"
                  style={{ background: 'var(--bg-elevated)', borderLeft: '3px solid var(--accent)' }}
                >
                  <p className="text-[11px] mono font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--accent)' }}>
                    Priority action
                  </p>
                  <p className="text-sm leading-relaxed font-normal mb-4" style={{ color: 'var(--text-secondary)' }}>
                    {gapNarrative.priorityAction}
                  </p>
                  {gapNarrative.criticalGaps[0] && (
                    <button
                      onClick={() => expandControlAndSwitchTab(gapNarrative.criticalGaps[0])}
                      className="text-sm font-semibold transition-all"
                      style={{ color: 'var(--accent)' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.8'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
                    >
                      Start now →
                    </button>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>

      ) : (
        /* ── Controls tab ──────────────────────────────────────────────────── */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

          {/* Domain sidebar */}
          <Card className="lg:col-span-1 h-fit" title="Domains">
            <div className="space-y-1">
              <button
                onClick={() => { setExpandedDomains(new Set(Array.from(grouped.keys()))); setSearch(''); setStatusFilter('all') }}
                className="w-full text-left px-2 py-1 text-[11px] font-semibold transition-colors"
                style={{ color: 'var(--accent)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.75'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
              >
                Expand all
              </button>
              {Array.from(grouped.entries()).map(([domain, dc]) => {
                const impl = dc.filter(c => c.status === 'implemented').length
                const pct  = dc.length > 0 ? Math.round((impl / dc.length) * 100) : 0
                const isActive = expandedDomains.has(domain)
                return (
                  <button
                    key={domain}
                    onClick={() => toggleDomain(domain)}
                    className="w-full text-left px-2 py-2 rounded-lg transition-all text-sm"
                    style={
                      isActive
                        ? { background: 'var(--accent-dim)', color: 'var(--accent)', fontWeight: 600 }
                        : { background: 'transparent', color: 'var(--text-secondary)', fontWeight: 400 }
                    }
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)' }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex-1 leading-snug">{domain}</span>
                      <span className="mono text-[11px] ml-2 font-semibold" style={{ color: 'var(--text-muted)' }}>{pct}%</span>
                    </div>
                    <div className="mt-1 h-0.5 rounded-full overflow-hidden" style={{ background: 'var(--border-subtle)' }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: 'var(--ok)' }}
                      />
                    </div>
                  </button>
                )
              })}
            </div>
          </Card>

          {/* Controls panel */}
          <div className="lg:col-span-3 space-y-3">

            {/* Filter bar */}
            <div className="flex gap-2 flex-wrap">
              <div className="relative flex-1 min-w-40">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search by ID or title…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8 }}
                />
              </div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as StatusFilter)}
                className="mono text-xs font-medium"
                style={{ ...inputStyle, width: 'auto', paddingTop: 8, paddingBottom: 8 }}
              >
                <option value="all">All statuses</option>
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="implemented">Implemented</option>
                <option value="not-applicable">N/A</option>
              </select>
              <span className="mono text-xs font-semibold self-center px-1" style={{ color: 'var(--text-muted)' }}>
                {displayList.length} controls
              </span>
            </div>

            {/* Flat filtered list */}
            {filtered ? (
              <Card className="overflow-hidden p-0">
                {filtered.length === 0
                  ? (
                    <p className="text-sm p-6 text-center font-normal" style={{ color: 'var(--text-muted)' }}>
                      No controls match the current filter.
                    </p>
                  )
                  : filtered.map(renderControl)
                }
              </Card>
            ) : (
              Array.from(grouped.entries()).map(([domain, dc]) => (
                <Card key={domain} className="overflow-hidden p-0">
                  {/* Domain header row */}
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 transition-colors"
                    style={{ background: 'transparent' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                    onClick={() => toggleDomain(domain)}
                  >
                    <div className="flex items-center gap-3">
                      {expandedDomains.has(domain)
                        ? <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
                        : <ChevronRight size={13} style={{ color: 'var(--text-muted)' }} />
                      }
                      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{domain}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>
                        {dc.filter(c => c.status === 'implemented').length}/{dc.length} implemented
                      </span>
                      <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border-subtle)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            background: 'var(--ok)',
                            width: `${Math.round((dc.filter(c => c.status === 'implemented').length / dc.length) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </button>
                  {expandedDomains.has(domain) && dc.map(renderControl)}
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
