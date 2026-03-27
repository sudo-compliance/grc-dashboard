import { useEffect, useState, useMemo, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Search, Download, ChevronUp, ChevronDown, FileText, User } from 'lucide-react'
import { useFrameworkStore } from '../store/useFrameworkStore'
import { useUIStore } from '../store/useUIStore'
import Modal from '../components/ui/Modal'
import Badge from '../components/ui/Badge'
import StatusSelect from '../components/ui/StatusSelect'
import { exportFrameworkCSV } from '../services/persistence'
import isoData  from '../data/iso27001.json'
import nistData from '../data/nist-csf.json'
import pciData  from '../data/pci-dss.json'
import doraData from '../data/dora.json'
import cisData  from '../data/cis-v8.json'
import soc2Data from '../data/soc2.json'
import gdprData from '../data/uk-gdpr.json'
import ceData   from '../data/cyber-essentials.json'
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
}

type SortKey = 'id' | 'domain' | 'title' | 'status' | 'owner' | 'lastUpdated'
type SortDir = 'asc' | 'desc'

const FW_TABS = [
  { id: 'iso27001'          as FrameworkId, label: 'ISO 27001' },
  { id: 'nist-csf'          as FrameworkId, label: 'NIST CSF'  },
  { id: 'pci-dss'           as FrameworkId, label: 'PCI-DSS'   },
  { id: 'dora'              as FrameworkId, label: 'DORA'       },
  { id: 'cis-v8'            as FrameworkId, label: 'CIS v8'    },
  { id: 'soc2'              as FrameworkId, label: 'SOC 2'      },
  { id: 'uk-gdpr'           as FrameworkId, label: 'UK GDPR'   },
  { id: 'cyber-essentials'  as FrameworkId, label: 'Cyber Ess.' },
]

function relTime(iso?: string): string {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function ControlTracker() {
  const { id = 'iso27001' } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    frameworks, initFramework,
    updateControlStatus, updateControlNotes, updateControlEvidence,
    updateControlOwner, bulkUpdateStatus,
  } = useFrameworkStore()
  const { addToast, denseTable } = useUIStore()

  const [search, setSearch]             = useState('')
  const [statusFilter, setStatusFilter] = useState<ControlStatus | 'all'>('all')
  const [domainFilter, setDomainFilter] = useState<string>('all')
  const [ownerFilter, setOwnerFilter]   = useState<string>('all')
  const [sortKey, setSortKey]           = useState<SortKey>('id')
  const [sortDir, setSortDir]           = useState<SortDir>('asc')
  const [selected, setSelected]         = useState<Set<string>>(new Set())
  const [bulkStatus, setBulkStatus]     = useState<ControlStatus>('implemented')
  const [notesModal, setNotesModal]     = useState<Control | null>(null)
  const [notesDraft, setNotesDraft]     = useState('')
  const [editOwnerRow, setEditOwnerRow] = useState<string | null>(null)
  const [editOwnerVal, setEditOwnerVal] = useState('')
  const ownerInputRef = useRef<HTMLInputElement>(null)

  const fwId = id as FrameworkId

  useEffect(() => {
    initFramework(fwId, RAW[id] ?? [])
    setSearch('')
    setStatusFilter('all')
    setDomainFilter('all')
    setOwnerFilter('all')
    setSelected(new Set())
    setEditOwnerRow(null)
  }, [fwId, id, initFramework])

  // Focus owner input when row enters edit mode
  useEffect(() => {
    if (editOwnerRow && ownerInputRef.current) {
      ownerInputRef.current.focus()
      ownerInputRef.current.select()
    }
  }, [editOwnerRow])

  const controls = frameworks[fwId] ?? []

  const domains = useMemo(() => {
    const s = new Set(controls.map(c => c.domain))
    return Array.from(s).sort()
  }, [controls])

  const owners = useMemo(() => {
    const s = new Set(controls.map(c => (c.owner ?? '').trim()).filter(Boolean))
    return Array.from(s).sort()
  }, [controls])

  const filtered = useMemo(() => {
    return controls
      .filter(c => {
        const q = search.toLowerCase()
        const matchSearch = !search ||
          c.id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          (c.owner ?? '').toLowerCase().includes(q)
        const matchStatus = statusFilter === 'all' || c.status === statusFilter
        const matchDomain = domainFilter === 'all' || c.domain === domainFilter
        const matchOwner  = ownerFilter  === 'all' ||
          (ownerFilter === '__unassigned__' ? !(c.owner ?? '').trim() : c.owner === ownerFilter)
        return matchSearch && matchStatus && matchDomain && matchOwner
      })
      .sort((a, b) => {
        let va = '', vb = ''
        if (sortKey === 'id')          { va = a.id;               vb = b.id }
        else if (sortKey === 'title')  { va = a.title;            vb = b.title }
        else if (sortKey === 'domain') { va = a.domain;           vb = b.domain }
        else if (sortKey === 'status') { va = a.status;           vb = b.status }
        else if (sortKey === 'owner')  { va = a.owner ?? '';      vb = b.owner ?? '' }
        else if (sortKey === 'lastUpdated') { va = a.lastUpdated ?? ''; vb = b.lastUpdated ?? '' }
        return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      })
  }, [controls, search, statusFilter, domainFilter, ownerFilter, sortKey, sortDir])

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  function toggleRow(rowId: string) {
    setSelected(s => { const n = new Set(s); n.has(rowId) ? n.delete(rowId) : n.add(rowId); return n })
  }

  function toggleAll() {
    if (selected.size === filtered.length) setSelected(new Set())
    else setSelected(new Set(filtered.map(c => c.id)))
  }

  function handleBulkApply() {
    bulkUpdateStatus(fwId, Array.from(selected), bulkStatus)
    addToast(`${selected.size} controls set to ${bulkStatus}`, 'success')
    setSelected(new Set())
  }

  function handleExportCSV() {
    exportFrameworkCSV(filtered, id)
    addToast('CSV exported', 'success')
  }

  function openNotes(c: Control) {
    setNotesModal(c)
    setNotesDraft(c.notes)
  }

  function saveNotes() {
    if (!notesModal) return
    updateControlNotes(fwId, notesModal.id, notesDraft)
    addToast('Notes saved', 'success', 1500)
    setNotesModal(null)
  }

  function startOwnerEdit(c: Control) {
    setEditOwnerRow(c.id)
    setEditOwnerVal(c.owner ?? '')
  }

  function commitOwnerEdit(controlId: string) {
    if (editOwnerRow === controlId) {
      updateControlOwner(fwId, controlId, editOwnerVal.trim())
      setEditOwnerRow(null)
    }
  }

  const rowH = denseTable ? 'py-2' : 'py-3'

  function SortIcon({ k }: { k: SortKey }) {
    if (sortKey !== k) return <ChevronUp size={11} className="opacity-20" />
    return sortDir === 'asc'
      ? <ChevronUp size={11} style={{ color: 'var(--accent)' }} />
      : <ChevronDown size={11} style={{ color: 'var(--accent)' }} />
  }

  const unassignedCount = controls.filter(c => !(c.owner ?? '').trim()).length
  const coveragePct = controls.length > 0
    ? Math.round(((controls.length - unassignedCount) / controls.length) * 100)
    : 0

  return (
    <div className="p-4 md:p-6 space-y-4 animate-fade-in">

      {/* Framework tabs */}
      <div className="flex flex-wrap gap-1">
        {FW_TABS.map(fw => (
          <button
            key={fw.id}
            onClick={() => navigate(`/controls/${fw.id}`)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={fwId === fw.id ? {
              background: 'var(--accent-dim)',
              color: 'var(--accent)',
              border: '1px solid var(--accent-border)',
            } : {
              color: 'var(--text-muted)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {fw.label}
          </button>
        ))}
      </div>

      {/* Ownership coverage strip */}
      {controls.length > 0 && (
        <div
          className="flex items-center gap-4 px-4 py-2.5 rounded-lg text-xs"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
        >
          <User size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <span style={{ color: 'var(--text-muted)' }}>
            Owner coverage:
            <span
              className="mono font-semibold ml-1"
              style={{ color: coveragePct >= 80 ? 'var(--ok)' : coveragePct >= 40 ? 'var(--warn)' : 'var(--danger)' }}
            >
              {coveragePct}%
            </span>
            <span className="ml-1" style={{ color: 'var(--text-muted)' }}>
              ({controls.length - unassignedCount}/{controls.length} assigned)
            </span>
          </span>
          <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-input)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${coveragePct}%`,
                background: coveragePct >= 80 ? 'var(--ok)' : coveragePct >= 40 ? 'var(--warn)' : 'var(--danger)',
              }}
            />
          </div>
          {unassignedCount > 0 && (
            <button
              onClick={() => setOwnerFilter('__unassigned__')}
              className="text-[11px] mono whitespace-nowrap transition-all"
              style={{ color: 'var(--accent)' }}
            >
              View unassigned →
            </button>
          )}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search ID, title or owner…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs rounded-lg focus:outline-none"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as ControlStatus | 'all')}
          className="mono text-xs rounded-lg px-3 py-2 focus:outline-none"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}
        >
          <option value="all">All statuses</option>
          <option value="not-started">Not Started</option>
          <option value="in-progress">In Progress</option>
          <option value="implemented">Implemented</option>
          <option value="not-applicable">N/A</option>
        </select>

        <select
          value={domainFilter}
          onChange={e => setDomainFilter(e.target.value)}
          className="mono text-xs rounded-lg px-3 py-2 focus:outline-none max-w-44"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}
        >
          <option value="all">All domains</option>
          {domains.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select
          value={ownerFilter}
          onChange={e => setOwnerFilter(e.target.value)}
          className="mono text-xs rounded-lg px-3 py-2 focus:outline-none max-w-44"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}
        >
          <option value="all">All owners</option>
          <option value="__unassigned__">Unassigned</option>
          {owners.map(o => <option key={o} value={o}>{o}</option>)}
        </select>

        {selected.size > 0 && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}
          >
            <span className="text-xs" style={{ color: 'var(--accent)' }}>{selected.size} selected</span>
            <StatusSelect value={bulkStatus} onChange={setBulkStatus} compact />
            <button
              onClick={handleBulkApply}
              className="text-xs font-medium transition-all"
              style={{ color: 'var(--accent)' }}
            >
              Apply
            </button>
          </div>
        )}

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-all ml-auto"
          style={{
            color: 'var(--text-secondary)',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'}
        >
          <Download size={12} />
          CSV
        </button>
        <span className="mono text-[11px]" style={{ color: 'var(--text-muted)' }}>
          {filtered.length} / {controls.length}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
                <th className="w-8 px-4 py-2.5">
                  <input
                    type="checkbox"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="accent-amber-500"
                  />
                </th>
                {([
                  { key: 'id'          as SortKey, label: 'ID',      w: 'w-20' },
                  { key: 'domain'      as SortKey, label: 'Domain',  w: 'w-36' },
                  { key: 'title'       as SortKey, label: 'Title',   w: '' },
                  { key: 'status'      as SortKey, label: 'Status',  w: 'w-36' },
                  { key: 'owner'       as SortKey, label: 'Owner',   w: 'w-36' },
                  { key: 'lastUpdated' as SortKey, label: 'Updated', w: 'w-24' },
                ]).map(col => (
                  <th
                    key={col.key}
                    className={`${col.w} px-3 py-2.5 text-left mono uppercase tracking-wider cursor-pointer select-none transition-colors`}
                    style={{ fontSize: 10, color: 'var(--text-muted)' }}
                    onClick={() => handleSort(col.key)}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
                  >
                    <span className="flex items-center gap-1">{col.label}<SortIcon k={col.key} /></span>
                  </th>
                ))}
                <th className="w-10 px-3 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, idx) => (
                <tr
                  key={c.id}
                  className="transition-colors"
                  style={{
                    borderBottom: idx < filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    background: selected.has(c.id)
                      ? 'var(--accent-dim)'
                      : idx % 2 !== 0 ? 'rgba(255,255,255,0.01)' : undefined,
                  }}
                  onMouseEnter={e => { if (!selected.has(c.id)) (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = selected.has(c.id) ? 'var(--accent-dim)' : idx % 2 !== 0 ? 'rgba(255,255,255,0.01)' : '' }}
                >
                  <td className="px-4">
                    <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggleRow(c.id)} className="accent-amber-500" />
                  </td>

                  {/* ID */}
                  <td className={`px-3 ${rowH}`}>
                    <span className="mono text-xs font-medium" style={{ color: 'var(--accent)' }}>{c.id}</span>
                  </td>

                  {/* Domain */}
                  <td className={`px-3 ${rowH}`}>
                    <span className="text-xs truncate block max-w-[140px]" style={{ color: 'var(--text-secondary)' }}>{c.domain}</span>
                  </td>

                  {/* Title */}
                  <td className={`px-3 ${rowH}`}>
                    <span style={{ color: 'var(--text-primary)', lineHeight: 1.4 }} title={c.title}>{c.title}</span>
                    {c.notes && (
                      <span className="block text-[11px] mt-0.5 truncate max-w-xs" style={{ color: 'var(--text-muted)' }}>
                        {c.notes}
                      </span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-3" onClick={e => e.stopPropagation()}>
                    <StatusSelect
                      value={c.status}
                      onChange={s => { updateControlStatus(fwId, c.id, s); addToast('Saved', 'success', 1200) }}
                      compact
                    />
                  </td>

                  {/* Owner — inline edit */}
                  <td
                    className={`px-3 ${rowH} cursor-pointer`}
                    onClick={() => { if (editOwnerRow !== c.id) startOwnerEdit(c) }}
                  >
                    {editOwnerRow === c.id ? (
                      <input
                        ref={ownerInputRef}
                        type="text"
                        value={editOwnerVal}
                        onChange={e => setEditOwnerVal(e.target.value)}
                        onBlur={() => commitOwnerEdit(c.id)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') commitOwnerEdit(c.id)
                          if (e.key === 'Escape') setEditOwnerRow(null)
                        }}
                        className="w-full text-xs rounded px-2 py-1 focus:outline-none"
                        style={{
                          background: 'var(--bg-input)',
                          border: '1px solid var(--accent-border)',
                          color: 'var(--text-primary)',
                        }}
                        placeholder="Assign owner…"
                        onClick={e => e.stopPropagation()}
                      />
                    ) : (
                      <span
                        className="text-xs truncate block max-w-[130px] group"
                        style={{ color: c.owner ? 'var(--text-secondary)' : 'var(--text-muted)' }}
                        title="Click to edit owner"
                      >
                        {c.owner || <span style={{ opacity: 0.4 }}>—</span>}
                      </span>
                    )}
                  </td>

                  {/* Updated */}
                  <td className={`px-3 ${rowH}`}>
                    <span className="mono text-[11px]" style={{ color: 'var(--text-muted)' }}>{relTime(c.lastUpdated)}</span>
                  </td>

                  {/* Actions */}
                  <td className="px-3">
                    <button
                      onClick={() => openNotes(c)}
                      title="Edit notes"
                      className="p-1 rounded transition-colors"
                      style={{ color: 'var(--text-muted)' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--accent)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'}
                    >
                      <FileText size={13} />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-xs" style={{ color: 'var(--text-muted)' }}>
                    No controls match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes modal */}
      <Modal
        open={!!notesModal}
        onClose={() => setNotesModal(null)}
        title={`${notesModal?.id} — Notes & Evidence`}
        footer={
          <>
            <button
              onClick={() => setNotesModal(null)}
              className="px-4 py-1.5 text-xs transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              Cancel
            </button>
            <button
              onClick={saveNotes}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg transition-all"
              style={{ background: 'var(--accent)', color: '#000' }}
            >
              Save
            </button>
          </>
        }
      >
        {notesModal && (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{notesModal.title}</p>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{notesModal.description}</p>
            </div>

            <div className="flex items-center justify-between">
              <label className="mono text-[11px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Current status
              </label>
              <Badge value={notesModal.status} />
            </div>

            {notesModal.implementationGuide && (
              <div className="p-3 rounded-lg" style={{ background: 'var(--info-dim)', border: '1px solid rgba(96,165,250,0.2)' }}>
                <p className="mono text-[11px] mb-1.5 uppercase tracking-wider" style={{ color: 'var(--info)' }}>
                  How to implement this
                </p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {notesModal.implementationGuide}
                </p>
              </div>
            )}

            {notesModal.exampleEvidence && notesModal.exampleEvidence.length > 0 && (
              <div className="p-3 rounded-lg" style={{ background: 'var(--ok-dim)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <p className="mono text-[11px] mb-2 uppercase tracking-wider" style={{ color: 'var(--ok)' }}>
                  Example evidence
                </p>
                <ul className="space-y-1.5">
                  {notesModal.exampleEvidence.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      <span style={{ color: 'var(--ok)', flexShrink: 0 }} className="mt-0.5">›</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <label className="mono text-[11px] uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Notes
              </label>
              <textarea
                rows={4}
                value={notesDraft}
                onChange={e => setNotesDraft(e.target.value)}
                placeholder="Implementation notes, gaps, responsible owner…"
                className="w-full text-xs rounded-lg px-3 py-2.5 resize-none focus:outline-none"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div>
              <label className="mono text-[11px] uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>
                Evidence / reference
              </label>
              <input
                type="text"
                defaultValue={notesModal.evidence}
                onBlur={e => updateControlEvidence(fwId, notesModal.id, e.target.value)}
                placeholder="Link, document reference, ticket ID…"
                className="w-full text-xs rounded-lg px-3 py-2 focus:outline-none"
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
