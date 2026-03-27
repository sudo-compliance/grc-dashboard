import { useRef, useState } from 'react'
import { Download, Upload, RotateCcw, Sun, Moon, Table2, Shield, Info, FileText } from 'lucide-react'
import { useUIStore } from '../store/useUIStore'
import { useFrameworkStore } from '../store/useFrameworkStore'
import { useRiskStore } from '../store/useRiskStore'
import { exportToJSON, importFromJSON, resetAll, resetFramework, exportSoA } from '../services/persistence'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import type { FrameworkId } from '../types'

const ORG_NAME_KEY = 'grc:orgName'

const fieldStyle: React.CSSProperties = {
  width: '100%',
  fontSize: '13px',
  background: 'var(--bg-input)',
  border: '1px solid var(--border-default)',
  borderRadius: '8px',
  padding: '7px 12px',
  color: 'var(--text-primary)',
  outline: 'none',
  marginTop: '8px',
}

const selectStyle: React.CSSProperties = {
  fontSize: '12px',
  fontFamily: 'Geist, system-ui, sans-serif',
  background: 'var(--bg-input)',
  border: '1px solid var(--border-default)',
  borderRadius: '8px',
  padding: '7px 12px',
  color: 'var(--text-primary)',
  outline: 'none',
}

export default function Settings() {
  const { theme, toggleTheme, denseTable, setDenseTable, addToast } = useUIStore()
  const { risks } = useRiskStore()
  const { frameworks } = useFrameworkStore()

  const fileRef = useRef<HTMLInputElement>(null)
  const [resetConfirm, setResetConfirm]     = useState('')
  const [resetFwId, setResetFwId]           = useState<FrameworkId | 'all'>('all')
  const [resetModalOpen, setResetModalOpen] = useState(false)
  const [orgName, setOrgName]               = useState(() => localStorage.getItem(ORG_NAME_KEY) ?? '')
  const [soaFramework, setSoaFramework]     = useState<FrameworkId>('iso27001')

  function handleOrgNameBlur() {
    localStorage.setItem(ORG_NAME_KEY, orgName)
    addToast('Organisation name saved', 'success', 1500)
  }

  function handleExportSoA() {
    const name = orgName.trim() || 'My Organisation'
    exportSoA(soaFramework, name)
    addToast('SoA exported — open in browser and print to PDF', 'success', 4000)
  }

  const isoCount  = frameworks['iso27001']?.length         ?? 0
  const ai42Count = frameworks['iso42001']?.length         ?? 0
  const nistCount = frameworks['nist-csf']?.length         ?? 0
  const pciCount  = frameworks['pci-dss']?.length          ?? 0
  const doraCount = frameworks['dora']?.length             ?? 0
  const cisCount  = frameworks['cis-v8']?.length           ?? 0
  const soc2Count = frameworks['soc2']?.length             ?? 0
  const gdprCount = frameworks['uk-gdpr']?.length          ?? 0
  const ceCount   = frameworks['cyber-essentials']?.length ?? 0
  const totalControls = isoCount + ai42Count + nistCount + pciCount + doraCount + cisCount + soc2Count + gdprCount + ceCount

  function handleExport() {
    const json = exportToJSON()
    const blob = new Blob([json], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `grc-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    addToast('All data exported successfully', 'success')
  }

  function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const text = ev.target?.result as string
      const ok   = importFromJSON(text)
      if (ok) {
        addToast('Data imported — reload the page to see changes', 'success', 5000)
      } else {
        addToast('Import failed — invalid file format', 'error')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function openResetModal(target: FrameworkId | 'all') {
    setResetFwId(target)
    setResetConfirm('')
    setResetModalOpen(true)
  }

  function handleReset() {
    const expected = resetFwId === 'all' ? 'RESET ALL' : 'RESET'
    if (resetConfirm !== expected) {
      addToast(`Type "${expected}" to confirm`, 'error')
      return
    }
    if (resetFwId === 'all') {
      resetAll()
      addToast('All data cleared — reload to re-initialise', 'info', 4000)
    } else {
      resetFramework(resetFwId)
      addToast(`${resetFwId} data cleared — reload to re-initialise`, 'info', 4000)
    }
    setResetModalOpen(false)
  }

  function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div className="space-y-3">
        <h2
          className="mono text-[11px] uppercase tracking-widest font-bold pt-2"
          style={{ color: 'var(--text-muted)' }}
        >
          {title}
        </h2>
        {children}
      </div>
    )
  }

  const exportSizeKB = Math.round(JSON.stringify({ frameworks, risks }).length / 1024)

  return (
    <div className="p-4 md:p-6 space-y-8 animate-fade-in max-w-2xl">

      {/* ── Organisation ──────────────────────────────────────────────────── */}
      <Section title="Organisation">
        <Card>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Organisation name</p>
              <p className="text-xs font-normal mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Used in exported reports and the Statement of Applicability.
              </p>
              <input
                type="text"
                value={orgName}
                onChange={e => setOrgName(e.target.value)}
                onBlur={handleOrgNameBlur}
                placeholder="e.g. Acme Corp"
                style={fieldStyle}
              />
            </div>
          </div>
        </Card>
      </Section>

      {/* ── Statement of Applicability ────────────────────────────────────── */}
      <Section title="Statement of Applicability">
        <Card>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Export SoA</p>
              <p className="text-xs font-normal mt-0.5 max-w-sm" style={{ color: 'var(--text-muted)' }}>
                Generates a print-ready A4 HTML document listing all controls, their status, notes, and evidence.
                Open the file in a browser and use Print → Save as PDF.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <select
                value={soaFramework}
                onChange={e => setSoaFramework(e.target.value as FrameworkId)}
                style={selectStyle}
              >
                <option value="iso27001">ISO 27001</option>
                <option value="iso42001">ISO 42001</option>
                <option value="nist-csf">NIST CSF</option>
                <option value="pci-dss">PCI-DSS</option>
                <option value="dora">DORA</option>
                <option value="cis-v8">CIS Controls v8</option>
                <option value="soc2">SOC 2</option>
                <option value="uk-gdpr">UK GDPR</option>
                <option value="cyber-essentials">Cyber Essentials</option>
              </select>
              <button
                onClick={handleExportSoA}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all"
                style={{
                  background: 'var(--accent-dim)',
                  color: 'var(--accent)',
                  border: '1px solid var(--accent-border)',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.85'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
              >
                <FileText size={13} /> Export SoA
              </button>
            </div>
          </div>
        </Card>
      </Section>

      {/* ── Data management ───────────────────────────────────────────────── */}
      <Section title="Data management">
        {/* Export */}
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Export all data</p>
              <p className="text-xs font-normal mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Downloads a JSON backup of all framework statuses, notes, evidence, and risk data.
                Estimated size: ~{exportSizeKB} KB.
              </p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all flex-shrink-0"
              style={{
                background: 'var(--accent-dim)',
                color: 'var(--accent)',
                border: '1px solid var(--accent-border)',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.85'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
            >
              <Download size={13} /> Export JSON
            </button>
          </div>
        </Card>

        {/* Import */}
        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Import data</p>
              <p className="text-xs font-normal mt-0.5" style={{ color: 'var(--text-muted)' }}>
                Restore from a previously exported JSON backup. Existing data will be overwritten.
                Reload the page after importing to see changes.
              </p>
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all flex-shrink-0"
              style={{
                background: 'var(--bg-elevated)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-default)',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)'}
            >
              <Upload size={13} /> Import JSON
            </button>
          </div>
          <input ref={fileRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
        </Card>
      </Section>

      {/* ── Reset ─────────────────────────────────────────────────────────── */}
      <Section title="Reset data">
        <Card>
          <p className="text-sm font-normal mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Reset clears all control statuses, notes, and evidence for the selected framework, returning it to "not-started".
            Risk data is only affected by the full reset option.
          </p>
          <div className="space-y-2">
            {([
              { id: 'iso27001'         as FrameworkId | 'all', label: 'Reset ISO 27001',       sub: `${isoCount} controls` },
              { id: 'iso42001'         as FrameworkId | 'all', label: 'Reset ISO 42001',       sub: `${ai42Count} controls` },
              { id: 'nist-csf'         as FrameworkId | 'all', label: 'Reset NIST CSF',        sub: `${nistCount} controls` },
              { id: 'pci-dss'          as FrameworkId | 'all', label: 'Reset PCI-DSS',         sub: `${pciCount} controls` },
              { id: 'dora'             as FrameworkId | 'all', label: 'Reset DORA',            sub: `${doraCount} controls` },
              { id: 'cis-v8'           as FrameworkId | 'all', label: 'Reset CIS Controls v8', sub: `${cisCount} controls` },
              { id: 'soc2'             as FrameworkId | 'all', label: 'Reset SOC 2',           sub: `${soc2Count} controls` },
              { id: 'uk-gdpr'          as FrameworkId | 'all', label: 'Reset UK GDPR',         sub: `${gdprCount} controls` },
              { id: 'cyber-essentials' as FrameworkId | 'all', label: 'Reset Cyber Essentials',sub: `${ceCount} controls` },
              { id: 'all'              as FrameworkId | 'all', label: 'Reset everything',       sub: `${totalControls} controls + ${risks.length} risks` },
            ]).map(item => (
              <div
                key={item.id}
                className="flex items-center justify-between py-2 last:border-0"
                style={{ borderBottom: '1px solid var(--border-subtle)' }}
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
                  <p className="text-[11px] mono font-normal" style={{ color: 'var(--text-muted)' }}>{item.sub}</p>
                </div>
                <button
                  onClick={() => openResetModal(item.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all"
                  style={
                    item.id === 'all'
                      ? { color: 'var(--danger)', border: '1px solid rgba(220,38,38,0.30)', background: 'transparent' }
                      : { color: 'var(--text-muted)', border: '1px solid var(--border-default)', background: 'transparent' }
                  }
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = 'var(--danger)'
                    ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(220,38,38,0.40)'
                  }}
                  onMouseLeave={e => {
                    if (item.id !== 'all') {
                      (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'
                      ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)'
                    }
                  }}
                >
                  <RotateCcw size={11} /> Reset
                </button>
              </div>
            ))}
          </div>
        </Card>
      </Section>

      {/* ── Appearance ────────────────────────────────────────────────────── */}
      <Section title="Appearance">
        <Card>
          <div className="space-y-4">
            {/* Theme toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Theme</p>
                <p className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>Currently {theme} mode</p>
              </div>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-default)',
                  color: 'var(--text-secondary)',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)'}
              >
                {theme === 'dark'
                  ? <><Sun size={13} /> Switch to light</>
                  : <><Moon size={13} /> Switch to dark</>
                }
              </button>
            </div>

            {/* Dense table toggle */}
            <div
              className="flex items-center justify-between pt-4"
              style={{ borderTop: '1px solid var(--border-subtle)' }}
            >
              <div>
                <p className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <Table2 size={13} /> Dense table mode
                </p>
                <p className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>
                  Reduces row height in the Controls Tracker
                </p>
              </div>
              <button
                onClick={() => setDenseTable(!denseTable)}
                className="relative w-10 h-5 rounded-full transition-colors"
                style={{
                  background: denseTable ? 'var(--accent)' : 'var(--bg-elevated)',
                  border: `1px solid ${denseTable ? 'var(--accent)' : 'var(--border-default)'}`,
                }}
              >
                <span
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
                  style={{ left: denseTable ? '20px' : '2px' }}
                />
              </button>
            </div>
          </div>
        </Card>
      </Section>

      {/* ── About ─────────────────────────────────────────────────────────── */}
      <Section title="About">
        <Card>
          <div className="flex items-start gap-3">
            <Shield size={20} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} />
            <div className="space-y-2">
              <p className="text-sm font-bold mono" style={{ color: 'var(--text-primary)' }}>GRC Intelligence</p>
              <p className="text-sm font-normal leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                A local-first GRC framework dashboard. All data is stored in your browser's localStorage and never leaves your machine. Works fully offline after the initial build.
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 pt-1">
                {[
                  { label: 'ISO 27001',       value: `2022 — ${isoCount} controls` },
                  { label: 'ISO 42001',       value: `2023 — ${ai42Count} controls` },
                  { label: 'NIST CSF',        value: `2.0 — ${nistCount} subcategories` },
                  { label: 'PCI-DSS',         value: `v4.0 — ${pciCount} requirements` },
                  { label: 'DORA',            value: `2025 — ${doraCount} articles` },
                  { label: 'CIS Controls v8', value: `${cisCount} safeguards` },
                  { label: 'SOC 2',           value: `TSC — ${soc2Count} criteria` },
                  { label: 'UK GDPR',         value: `DPA2018 — ${gdprCount} controls` },
                  { label: 'Cyber Essentials',value: `CE+ — ${ceCount} controls` },
                  { label: 'Crosswalk',       value: '45 mapped controls' },
                ].map(r => (
                  <div key={r.label} className="flex items-center gap-2">
                    <span className="text-[11px] font-normal" style={{ color: 'var(--text-muted)' }}>{r.label}:</span>
                    <span className="mono text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>{r.value}</span>
                  </div>
                ))}
              </div>

              {/* Keyboard shortcuts */}
              <div className="pt-2" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                <p className="text-[11px] mono font-bold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  Keyboard shortcuts
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { keys: '⌘ E', desc: 'Export data' },
                    { keys: '⌘ K', desc: 'Focus search' },
                    { keys: 'Esc', desc: 'Close modal' },
                  ].map(s => (
                    <div key={s.keys} className="flex items-center gap-2">
                      <kbd
                        className="mono text-[10px] rounded px-1.5 py-0.5 font-semibold"
                        style={{
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-default)',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        {s.keys}
                      </kbd>
                      <span className="text-[11px] font-normal" style={{ color: 'var(--text-muted)' }}>{s.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex gap-2">
            <Info size={13} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }} />
            <p className="text-[11px] font-normal leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Control descriptions and guidance are paraphrased from official framework documentation for reference purposes.
              This tool is not a substitute for formal compliance assessment by a qualified auditor.
              ISO 27001:2022 & ISO 42001:2023 © ISO, NIST CSF 2.0 © NIST, PCI-DSS v4.0 © PCI Security Standards Council, DORA © EU, CIS Controls v8 © CIS, UK GDPR © ICO, Cyber Essentials © NCSC.
            </p>
          </div>
        </Card>
      </Section>

      {/* ── Reset confirm modal ───────────────────────────────────────────── */}
      <Modal
        open={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title={resetFwId === 'all' ? 'Reset all data' : `Reset ${resetFwId}`}
        footer={
          <>
            <button
              onClick={() => setResetModalOpen(false)}
              className="px-4 py-1.5 text-xs font-medium transition-all"
              style={{ color: 'var(--text-muted)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg transition-all"
              style={{ background: 'var(--danger)', color: '#fff' }}
            >
              Confirm reset
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm font-normal" style={{ color: 'var(--text-secondary)' }}>
            {resetFwId === 'all'
              ? 'This will permanently delete all control statuses, notes, evidence, and risk data across all frameworks.'
              : `This will permanently delete all control statuses, notes, and evidence for ${resetFwId}.`
            }
          </p>
          <p className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>
            This action cannot be undone. Export a backup first if you want to keep your data.
          </p>
          <div>
            <label className="text-[11px] mono font-bold uppercase tracking-wider block mb-1.5" style={{ color: 'var(--text-muted)' }}>
              Type{' '}
              <span style={{ color: 'var(--danger)' }}>
                {resetFwId === 'all' ? 'RESET ALL' : 'RESET'}
              </span>{' '}
              to confirm
            </label>
            <input
              type="text"
              value={resetConfirm}
              onChange={e => setResetConfirm(e.target.value)}
              placeholder={resetFwId === 'all' ? 'RESET ALL' : 'RESET'}
              className="mono"
              style={{
                ...fieldStyle,
                marginTop: 0,
                border: '1px solid rgba(220,38,38,0.35)',
                color: 'var(--danger)',
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}
