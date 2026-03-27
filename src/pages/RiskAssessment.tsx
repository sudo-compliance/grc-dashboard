import { useState } from 'react'
import { Plus, Pencil, Trash2, AlertTriangle, ChevronUp, ChevronDown, Target, RotateCcw, X } from 'lucide-react'
import { useRiskStore } from '../store/useRiskStore'
import { useUIStore } from '../store/useUIStore'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import RiskHeatmap from '../components/charts/RiskHeatmap'
import type { Risk, RiskAppetiteThreshold, RiskImpact, RiskLikelihood, RiskStatus, TreatmentTab } from '../types'
import { DEFAULT_APPETITE, LIKELIHOOD_LABELS, IMPACT_LABELS } from '../types'

type SortKey = 'score' | 'assetName' | 'status' | 'riskLevel'
type SortDir  = 'asc' | 'desc'

type RiskForm = {
  assetName: string
  threat: string
  vulnerability: string
  likelihood: RiskLikelihood
  impact: RiskImpact
  treatmentTabs: TreatmentTab[]
  owner: string
  status: RiskStatus
}

function newTab(n: number): TreatmentTab {
  return { id: `t-${Date.now()}-${n}`, label: `Treatment ${n}`, content: '' }
}

const BLANK: RiskForm = {
  assetName: '', threat: '', vulnerability: '',
  likelihood: 3, impact: 3,
  treatmentTabs: [{ id: 't-0', label: 'Treatment 1', content: '' }],
  owner: '', status: 'open',
}

function appetiteColor(l: number, i: number): React.CSSProperties {
  const score = l * i
  if (score >= 20) return { background: 'rgba(239,68,68,0.12)', color: 'var(--danger)', border: '1px solid rgba(239,68,68,0.25)' }
  if (score >= 13) return { background: 'rgba(251,146,60,0.1)',  color: '#FB923C',       border: '1px solid rgba(251,146,60,0.2)' }
  if (score >= 6)  return { background: 'rgba(245,158,11,0.1)', color: 'var(--warn)',    border: '1px solid rgba(245,158,11,0.2)' }
  return               { background: 'rgba(34,197,94,0.1)',  color: 'var(--ok)',      border: '1px solid rgba(34,197,94,0.2)' }
}

export default function RiskAssessment() {
  const { risks, addRisk, updateRisk, deleteRisk, getRiskSummary, appetiteThreshold, setAppetiteThreshold } = useRiskStore()
  const { addToast } = useUIStore()

  const [modalOpen, setModalOpen]         = useState(false)
  const [editId, setEditId]               = useState<string | null>(null)
  const [form, setForm]                   = useState<RiskForm>(BLANK)
  const [activeTab, setActiveTab]         = useState<string>('t-0')
  const [deleteId, setDeleteId]           = useState<string | null>(null)
  const [levelFilter, setLevelFilter]     = useState<Risk['riskLevel'] | 'all'>('all')
  const [statusFilter, setStatusFilter]   = useState<RiskStatus | 'all'>('all')
  const [sortKey, setSortKey]             = useState<SortKey>('score')
  const [sortDir, setSortDir]             = useState<SortDir>('desc')
  const [expandedRow, setExpandedRow]     = useState<string | null>(null)
  const [appetiteOpen, setAppetiteOpen]   = useState(false)
  const [draftAppetite, setDraftAppetite] = useState<RiskAppetiteThreshold>(appetiteThreshold)

  const summary = getRiskSummary()

  const filtered = risks
    .filter(r => (levelFilter === 'all' || r.riskLevel === levelFilter) && (statusFilter === 'all' || r.status === statusFilter))
    .sort((a, b) => {
      let va: string | number = '', vb: string | number = ''
      if (sortKey === 'score')      { va = a.score;      vb = b.score }
      if (sortKey === 'assetName')  { va = a.assetName;  vb = b.assetName }
      if (sortKey === 'status')     { va = a.status;     vb = b.status }
      if (sortKey === 'riskLevel')  { va = a.score;      vb = b.score }
      if (typeof va === 'number') return sortDir === 'asc' ? va - (vb as number) : (vb as number) - va
      return sortDir === 'asc' ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
    })

  function handleSort(k: SortKey) {
    if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(k); setSortDir('desc') }
  }

  function openAdd() {
    const blank = { ...BLANK, treatmentTabs: [{ id: 't-0', label: 'Treatment 1', content: '' }] }
    setForm(blank)
    setActiveTab('t-0')
    setEditId(null)
    setModalOpen(true)
  }

  function openEdit(r: Risk) {
    const tabs: TreatmentTab[] = r.treatmentTabs && r.treatmentTabs.length > 0
      ? r.treatmentTabs
      : [{ id: 't-0', label: 'Treatment 1', content: r.treatment }]
    setForm({
      assetName: r.assetName, threat: r.threat, vulnerability: r.vulnerability,
      likelihood: r.likelihood, impact: r.impact,
      treatmentTabs: tabs,
      owner: r.owner, status: r.status,
    })
    setActiveTab(tabs[0].id)
    setEditId(r.id)
    setModalOpen(true)
  }

  // ── Treatment tab helpers ──────────────────────────────────────────────────
  function addTreatmentTab() {
    const n = form.treatmentTabs.length + 1
    const tab = newTab(n)
    setForm(f => ({ ...f, treatmentTabs: [...f.treatmentTabs, tab] }))
    setActiveTab(tab.id)
  }

  function removeTreatmentTab(id: string) {
    setForm(f => {
      const tabs = f.treatmentTabs.filter(t => t.id !== id)
      return { ...f, treatmentTabs: tabs }
    })
    setActiveTab(prev => {
      if (prev !== id) return prev
      const remaining = form.treatmentTabs.filter(t => t.id !== id)
      return remaining[remaining.length - 1]?.id ?? ''
    })
  }

  function updateTabLabel(id: string, label: string) {
    setForm(f => ({ ...f, treatmentTabs: f.treatmentTabs.map(t => t.id === id ? { ...t, label } : t) }))
  }

  function updateTabContent(id: string, content: string) {
    setForm(f => ({ ...f, treatmentTabs: f.treatmentTabs.map(t => t.id === id ? { ...t, content } : t) }))
  }

  function handleSave() {
    if (!form.assetName || !form.threat) { addToast('Asset name and threat are required', 'error'); return }
    // Build concatenated treatment string for display compat
    const treatment = form.treatmentTabs
      .filter(t => t.content.trim())
      .map(t => form.treatmentTabs.length > 1 ? `[${t.label}] ${t.content}` : t.content)
      .join('\n\n')
    const payload = { ...form, treatment, treatmentTabs: form.treatmentTabs }
    if (editId) {
      updateRisk(editId, payload)
      addToast('Risk updated', 'success')
    } else {
      addRisk(payload)
      addToast('Risk added', 'success')
    }
    setModalOpen(false)
  }

  function confirmDelete() {
    if (!deleteId) return
    deleteRisk(deleteId)
    addToast('Risk deleted', 'info')
    setDeleteId(null)
  }

  function openAppetiteModal() {
    setDraftAppetite(appetiteThreshold)
    setAppetiteOpen(true)
  }

  function saveAppetite() {
    setAppetiteThreshold(draftAppetite)
    addToast('Risk appetite saved', 'success')
    setAppetiteOpen(false)
  }

  function resetAppetite() {
    setDraftAppetite(DEFAULT_APPETITE)
  }

  function setCellAppetite(likelihood: number, impact: number) {
    setDraftAppetite(prev => ({
      cells: prev.cells.map(c =>
        c.likelihood === likelihood ? { ...c, maxAcceptableImpact: impact } : c
      ),
    }))
  }

  const previewScore = form.likelihood * form.impact
  const previewLevel = previewScore >= 20 ? 'critical' : previewScore >= 13 ? 'high' : previewScore >= 6 ? 'medium' : 'low'

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return null
    return sortDir === 'asc' ? <ChevronUp size={11} style={{ color: 'var(--accent)' }} /> : <ChevronDown size={11} style={{ color: 'var(--accent)' }} />
  }

  function field(label: string, el: React.ReactNode) {
    return (
      <div>
        <label className="text-[11px] mono uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>
          {label}
        </label>
        {el}
      </div>
    )
  }

  const inputCls = "w-full text-xs rounded-lg px-3 py-2 focus:outline-none"
  const inputStyle: React.CSSProperties = {
    background: 'var(--bg-input)',
    border: '1px solid var(--border-default)',
    color: 'var(--text-primary)',
  }

  return (
    <div className="p-4 md:p-6 space-y-5 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <AlertTriangle size={18} style={{ color: 'var(--warn)' }} /> Risk Assessment
          </h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
            5×5 likelihood / impact risk register with heat map visualisation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openAppetiteModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-all"
            style={{
              background: 'var(--bg-elevated)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-default)',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)' }}
          >
            <Target size={13} /> Risk appetite
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all"
            style={{ background: 'var(--accent)', color: '#000' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.filter = 'brightness(1.1)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.filter = ''}
          >
            <Plus size={13} /> Add risk
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {([
          { label: 'Critical', value: summary.critical, color: 'var(--danger)', bg: 'var(--danger-dim)', filter: 'critical' as const },
          { label: 'High',     value: summary.high,     color: '#FB923C',       bg: 'rgba(251,146,60,0.1)', filter: 'high' as const },
          { label: 'Medium',   value: summary.medium,   color: 'var(--warn)',   bg: 'var(--warn-dim)', filter: 'medium' as const },
          { label: 'Low',      value: summary.low,      color: 'var(--ok)',     bg: 'var(--ok-dim)',   filter: 'low' as const },
        ]).map(s => (
          <button
            key={s.label}
            onClick={() => setLevelFilter(levelFilter === s.filter ? 'all' : s.filter)}
            className="text-left transition-all rounded-xl"
            style={levelFilter === s.filter ? { outline: `1px solid ${s.color}`, outlineOffset: 2 } : {}}
          >
            <Card className="py-4" hover>
              <p className="mono text-2xl font-bold leading-none" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label} risks</p>
            </Card>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Register */}
        <div className="lg:col-span-3 space-y-3">
          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {(['all','open','mitigated','accepted','transferred'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className="px-2.5 py-1 rounded text-[11px] mono transition-all capitalize"
                style={statusFilter === s ? {
                  background: 'var(--accent-dim)',
                  color: 'var(--accent)',
                  border: '1px solid var(--accent-border)',
                } : {
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {s}
              </button>
            ))}
            <span className="mono text-[11px] self-center ml-auto" style={{ color: 'var(--text-muted)' }}>
              {filtered.length} risks
            </span>
          </div>

          {/* Table */}
          <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3" style={{ color: 'var(--text-muted)' }}>
                <AlertTriangle size={28} />
                <p className="text-sm">No risks found</p>
                <button
                  onClick={openAdd}
                  className="text-xs transition-colors"
                  style={{ color: 'var(--accent)' }}
                >
                  Add your first risk →
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
              <table className="w-full text-xs min-w-[480px]">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                    {([
                      { k: 'assetName' as SortKey, label: 'Asset' },
                      { k: 'score'     as SortKey, label: 'L × I' },
                      { k: 'riskLevel' as SortKey, label: 'Level' },
                      { k: 'status'    as SortKey, label: 'Status' },
                    ]).map(col => (
                      <th
                        key={col.k}
                        className="px-3 py-2.5 text-left mono text-[11px] uppercase tracking-wider cursor-pointer select-none transition-colors"
                        style={{ color: 'var(--text-muted)' }}
                        onClick={() => handleSort(col.k)}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
                      >
                        <span className="flex items-center gap-1">{col.label}<SortIcon k={col.k} /></span>
                      </th>
                    ))}
                    <th className="px-3 py-2.5 w-16" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, idx) => (
                    <>
                      <tr
                        key={r.id}
                        className="cursor-pointer transition-colors"
                        style={{
                          borderBottom: '1px solid var(--border-subtle)',
                          background: expandedRow === r.id ? 'var(--bg-elevated)' : idx % 2 !== 0 ? 'rgba(255,255,255,0.01)' : undefined,
                        }}
                        onClick={() => setExpandedRow(expandedRow === r.id ? null : r.id)}
                        onMouseEnter={e => { if (expandedRow !== r.id) (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)' }}
                        onMouseLeave={e => { if (expandedRow !== r.id) (e.currentTarget as HTMLElement).style.background = idx % 2 !== 0 ? 'rgba(255,255,255,0.01)' : '' }}
                      >
                        <td className="px-3 py-3">
                          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{r.assetName}</p>
                          <p className="text-[11px] mt-0.5 truncate max-w-[180px]" style={{ color: 'var(--text-muted)' }}>{r.threat}</p>
                        </td>
                        <td className="px-3 py-3">
                          <span className="mono text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{r.likelihood}×{r.impact}</span>
                          <span className="mono text-xs ml-1" style={{ color: 'var(--text-muted)' }}>={r.score}</span>
                        </td>
                        <td className="px-3 py-3"><Badge value={r.riskLevel} /></td>
                        <td className="px-3 py-3"><Badge value={r.status} /></td>
                        <td className="px-3 py-3">
                          <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => openEdit(r)}
                              className="p-1 rounded transition-colors"
                              style={{ color: 'var(--text-muted)' }}
                              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--accent)'}
                              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
                            >
                              <Pencil size={12} />
                            </button>
                            <button
                              onClick={() => setDeleteId(r.id)}
                              className="p-1 rounded transition-colors"
                              style={{ color: 'var(--text-muted)' }}
                              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--danger)'}
                              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedRow === r.id && (
                        <tr key={`${r.id}-exp`} style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
                          <td colSpan={5} className="px-4 py-3">
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <p className="mono uppercase tracking-wider text-[11px] mb-1" style={{ color: 'var(--text-muted)' }}>Vulnerability</p>
                                <p style={{ color: 'var(--text-secondary)' }}>{r.vulnerability || '—'}</p>
                              </div>
                              <div>
                                <p className="mono uppercase tracking-wider text-[11px] mb-1" style={{ color: 'var(--text-muted)' }}>Owner</p>
                                <p style={{ color: 'var(--text-secondary)' }}>{r.owner || '—'}</p>
                              </div>
                              {/* Treatment tabs */}
                              <div className="col-span-1 sm:col-span-2">
                                <p className="mono uppercase tracking-wider text-[11px] mb-2" style={{ color: 'var(--text-muted)' }}>Treatment options</p>
                                {r.treatmentTabs && r.treatmentTabs.length > 0 ? (
                                  <div className="space-y-2">
                                    {r.treatmentTabs.filter(t => t.content).map(t => (
                                      <div key={t.id} className="p-2.5 rounded-lg" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                                        <p className="text-[11px] font-semibold mb-0.5" style={{ color: 'var(--accent)' }}>{t.label}</p>
                                        <p style={{ color: 'var(--text-secondary)' }}>{t.content}</p>
                                      </div>
                                    ))}
                                    {r.treatmentTabs.every(t => !t.content) && (
                                      <p style={{ color: 'var(--text-muted)' }}>—</p>
                                    )}
                                  </div>
                                ) : (
                                  <p style={{ color: 'var(--text-secondary)' }}>{r.treatment || '—'}</p>
                                )}
                              </div>
                              <div>
                                <p className="mono uppercase tracking-wider text-[11px] mb-1" style={{ color: 'var(--text-muted)' }}>Created</p>
                                <p style={{ color: 'var(--text-secondary)' }}>{new Date(r.dateCreated).toLocaleDateString()}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
              </div>
            )}
          </div>
        </div>

        {/* Heatmap + Treatment tasks */}
        <div className="lg:col-span-2 space-y-4">
          <Card title="Risk heat map">
            <RiskHeatmap risks={risks} appetiteThreshold={appetiteThreshold} />
          </Card>

          {risks.filter(r => r.status === 'open' || r.treatment).length > 0 && (
            <Card title="Treatment tasks" subtitle="Risks requiring action — tick to mark mitigated">
              <div className="space-y-2 mt-1">
                {risks
                  .filter(r => r.status === 'open' || r.treatment)
                  .sort((a, b) => b.score - a.score)
                  .map(r => (
                    <div key={r.id} className="flex items-start gap-3 py-2" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <input
                        type="checkbox"
                        checked={!!r.treatmentActioned}
                        onChange={e => {
                          if (e.target.checked) {
                            updateRisk(r.id, { treatmentActioned: true, status: 'mitigated' })
                            addToast('Risk marked mitigated', 'success', 1500)
                          } else {
                            updateRisk(r.id, { treatmentActioned: false, status: 'open' })
                          }
                        }}
                        className="mt-0.5 accent-amber-500 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{r.assetName}</p>
                          <Badge value={r.riskLevel} />
                          {r.owner && (
                            <span className="mono text-[11px]" style={{ color: 'var(--text-muted)' }}>· {r.owner}</span>
                          )}
                        </div>
                        {r.treatment && (
                          <p className="text-[11px] mt-0.5 line-clamp-2" style={{ color: 'var(--text-muted)' }}>{r.treatment}</p>
                        )}
                      </div>
                    </div>
                  ))
                }
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Add / Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'Edit risk' : 'Add risk'}
        maxWidth="max-w-2xl"
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="px-4 py-1.5 text-xs transition-colors" style={{ color: 'var(--text-secondary)' }}>
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg transition-all"
              style={{ background: 'var(--accent)', color: '#000' }}
            >
              {editId ? 'Update risk' : 'Add risk'}
            </button>
          </>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {field('Asset name *',
            <input className={inputCls} style={inputStyle} value={form.assetName} onChange={e => setForm(f => ({ ...f, assetName: e.target.value }))} placeholder="e.g. Customer database" />
          )}
          {field('Risk owner',
            <input className={inputCls} style={inputStyle} value={form.owner} onChange={e => setForm(f => ({ ...f, owner: e.target.value }))} placeholder="e.g. Head of IT" />
          )}
          {field('Threat *',
            <textarea className={`${inputCls} resize-none`} style={inputStyle} rows={2} value={form.threat} onChange={e => setForm(f => ({ ...f, threat: e.target.value }))} placeholder="e.g. SQL injection attack on customer database" />
          )}
          {field('Vulnerability',
            <textarea className={`${inputCls} resize-none`} style={inputStyle} rows={2} value={form.vulnerability} onChange={e => setForm(f => ({ ...f, vulnerability: e.target.value }))} placeholder="e.g. Unparameterised queries in legacy search module" />
          )}

          <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field(`Likelihood — ${LIKELIHOOD_LABELS[form.likelihood]}`,
              <div className="space-y-1">
                <input type="range" min={1} max={5} value={form.likelihood} onChange={e => setForm(f => ({ ...f, likelihood: Number(e.target.value) as RiskLikelihood }))} className="w-full accent-amber-500" />
                <div className="flex justify-between mono text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  {[1,2,3,4,5].map(n => <span key={n}>{n}</span>)}
                </div>
              </div>
            )}
            {field(`Impact — ${IMPACT_LABELS[form.impact]}`,
              <div className="space-y-1">
                <input type="range" min={1} max={5} value={form.impact} onChange={e => setForm(f => ({ ...f, impact: Number(e.target.value) as RiskImpact }))} className="w-full accent-amber-500" />
                <div className="flex justify-between mono text-[11px]" style={{ color: 'var(--text-muted)' }}>
                  {[1,2,3,4,5].map(n => <span key={n}>{n}</span>)}
                </div>
              </div>
            )}
          </div>

          {/* Live score preview */}
          <div className="col-span-1 sm:col-span-2 flex items-center gap-4 p-3 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
            <div>
              <p className="text-[11px] mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Risk score</p>
              <p className="mono text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{previewScore}</p>
            </div>
            <div className="h-8 w-px" style={{ background: 'var(--border-default)' }} />
            <div>
              <p className="text-[11px] mono uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Level</p>
              <Badge value={previewLevel} />
            </div>
            <p className="text-[11px] ml-2" style={{ color: 'var(--text-muted)' }}>
              = Likelihood {form.likelihood} × Impact {form.impact}
            </p>
          </div>

          {/* ── Treatment tabs ── */}
          <div className="col-span-1 sm:col-span-2">
            <label className="text-[11px] mono uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)' }}>
              Treatment options
            </label>

            {/* Tab bar */}
            <div className="flex items-center gap-1 flex-wrap mb-2">
              {form.treatmentTabs.map(tab => (
                <div key={tab.id} className="flex items-center" style={{ gap: 0 }}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className="px-3 py-1.5 text-xs rounded-l-lg transition-all"
                    style={activeTab === tab.id ? {
                      background: 'var(--accent-dim)',
                      color: 'var(--accent)',
                      border: '1px solid var(--accent-border)',
                      borderRight: form.treatmentTabs.length > 1 ? 'none' : undefined,
                    } : {
                      background: 'var(--bg-elevated)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-default)',
                      borderRight: form.treatmentTabs.length > 1 ? 'none' : undefined,
                    }}
                  >
                    {tab.label || 'Untitled'}
                  </button>
                  {form.treatmentTabs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTreatmentTab(tab.id)}
                      className="px-1.5 py-1.5 text-xs rounded-r-lg transition-all flex items-center"
                      style={activeTab === tab.id ? {
                        background: 'var(--accent-dim)',
                        color: 'var(--accent)',
                        border: '1px solid var(--accent-border)',
                        borderLeft: 'none',
                      } : {
                        background: 'var(--bg-elevated)',
                        color: 'var(--text-muted)',
                        border: '1px solid var(--border-default)',
                        borderLeft: 'none',
                      }}
                      title="Remove this treatment tab"
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTreatmentTab}
                className="px-2.5 py-1.5 text-xs rounded-lg flex items-center gap-1 transition-all"
                style={{
                  background: 'var(--bg-elevated)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-default)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-border)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)' }}
                title="Add treatment option"
              >
                <Plus size={11} /> Add option
              </button>
            </div>

            {/* Active tab content */}
            {form.treatmentTabs.map(tab => tab.id === activeTab && (
              <div key={tab.id} className="space-y-2">
                <input
                  className={`${inputCls} text-xs`}
                  style={inputStyle}
                  value={tab.label}
                  onChange={e => updateTabLabel(tab.id, e.target.value)}
                  placeholder="Option label (e.g. Mitigate, Transfer, Accept…)"
                />
                <textarea
                  className={`${inputCls} resize-none`}
                  style={inputStyle}
                  rows={3}
                  value={tab.content}
                  onChange={e => updateTabContent(tab.id, e.target.value)}
                  placeholder="Describe this treatment option…"
                />
              </div>
            ))}
          </div>

          {field('Status',
            <select className={inputCls} style={inputStyle} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as RiskStatus }))}>
              <option value="open">Open</option>
              <option value="mitigated">Mitigated</option>
              <option value="accepted">Accepted</option>
              <option value="transferred">Transferred</option>
            </select>
          )}
        </div>
      </Modal>

      {/* Delete confirm modal */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete risk"
        footer={
          <>
            <button onClick={() => setDeleteId(null)} className="px-4 py-1.5 text-xs transition-colors" style={{ color: 'var(--text-secondary)' }}>Cancel</button>
            <button
              onClick={confirmDelete}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg transition-all"
              style={{ background: 'var(--danger)', color: '#fff' }}
            >
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Are you sure you want to permanently delete this risk? This cannot be undone.
        </p>
      </Modal>

      {/* Risk appetite modal */}
      <Modal
        open={appetiteOpen}
        onClose={() => setAppetiteOpen(false)}
        title="Configure risk appetite"
        maxWidth="max-w-lg"
        footer={
          <>
            <button
              onClick={resetAppetite}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-all mr-auto"
              style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-default)' }}
            >
              <RotateCcw size={11} /> Reset defaults
            </button>
            <button onClick={() => setAppetiteOpen(false)} className="px-4 py-1.5 text-xs transition-colors" style={{ color: 'var(--text-secondary)' }}>
              Cancel
            </button>
            <button
              onClick={saveAppetite}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg transition-all"
              style={{ background: 'var(--accent)', color: '#000' }}
            >
              Save appetite
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Click a cell in each likelihood row to set the <strong>maximum acceptable impact</strong> at that likelihood level. Cells to the right of the boundary will be marked as above appetite on the heatmap.
          </p>

          {/* Grid */}
          <div>
            {/* Column labels */}
            <div className="grid gap-1 mb-1 pl-16" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
              {[1,2,3,4,5].map(i => (
                <div key={i} className="text-center">
                  <span className="mono text-[11px]" style={{ color: 'var(--text-muted)' }}>I{i}</span>
                  <span className="block text-[8px] truncate px-0.5" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
                    {IMPACT_LABELS[i as 1|2|3|4|5].split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-1">
              {[1,2,3,4,5].map(l => {
                const maxAcceptable = draftAppetite.cells.find(c => c.likelihood === l)?.maxAcceptableImpact ?? 5
                return (
                  <div key={l} className="flex items-center gap-1">
                    {/* Row label */}
                    <div className="w-14 flex-shrink-0 text-right pr-2">
                      <span className="mono text-[11px]" style={{ color: 'var(--text-muted)' }}>L{l}</span>
                      <span className="block text-[8px] truncate" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
                        {LIKELIHOOD_LABELS[l as 1|2|3|4|5].split(' ')[0]}
                      </span>
                    </div>
                    {/* Impact cells */}
                    <div className="grid gap-1 flex-1" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                      {[1,2,3,4,5].map(i => {
                        const isAcceptable = i <= maxAcceptable
                        const isBoundary   = i === maxAcceptable
                        const base = appetiteColor(l, i)
                        return (
                          <button
                            key={i}
                            onClick={() => setCellAppetite(l, i)}
                            className="aspect-square rounded-md flex flex-col items-center justify-center text-[11px] mono transition-all relative"
                            style={{
                              ...base,
                              opacity: isAcceptable ? 1 : 0.45,
                              transform: isBoundary ? 'scale(1.05)' : 'scale(1)',
                              outline: isBoundary ? `2px solid ${base.color}` : 'none',
                              outlineOffset: 1,
                            }}
                            title={`L${l} × I${i} — click to set max acceptable impact to ${i}`}
                          >
                            <span className="font-bold">{l * i}</span>
                            {isBoundary && (
                              <span className="text-[7px] leading-none mt-0.5 font-semibold" style={{ opacity: 0.8 }}>
                                max
                              </span>
                            )}
                            {!isAcceptable && (
                              <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                  <pattern id={`hatch-ap-${l}-${i}`} patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
                                    <line x1="0" y1="0" x2="0" y2="6" stroke="var(--danger)" strokeWidth="1" opacity="0.2" />
                                  </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill={`url(#hatch-ap-${l}-${i})`} />
                              </svg>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
            The stepped diagonal line appears on the heatmap. Hatched cells are above appetite.
          </p>
        </div>
      </Modal>
    </div>
  )
}
