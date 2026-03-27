import type {
  Control,
  ControlUpdate,
  ExportData,
  FrameworkId,
  Risk,
} from '../types'

const ALL_FRAMEWORK_IDS: FrameworkId[] = [
  'iso27001', 'nist-csf', 'pci-dss',
  'dora', 'cis-v8', 'soc2', 'uk-gdpr', 'cyber-essentials',
]

const KEYS = {
  framework: (id: FrameworkId) => `grc:framework:${id}`,
  risks: 'grc:risks',
  activity: 'grc:activity',
  settings: 'grc:settings',
} as const

// ─── Framework controls ─────────────────────────────────────────────────────

export function saveFrameworkData(id: FrameworkId, controls: Control[]): void {
  try {
    localStorage.setItem(KEYS.framework(id), JSON.stringify(controls))
  } catch {
    console.error('Failed to persist framework data')
  }
}

export function loadFrameworkData(id: FrameworkId): Control[] | null {
  try {
    const raw = localStorage.getItem(KEYS.framework(id))
    return raw ? (JSON.parse(raw) as Control[]) : null
  } catch {
    return null
  }
}

// ─── Risks ──────────────────────────────────────────────────────────────────

export function saveRisks(risks: Risk[]): void {
  try {
    localStorage.setItem(KEYS.risks, JSON.stringify(risks))
  } catch {
    console.error('Failed to persist risks')
  }
}

export function loadRisks(): Risk[] {
  try {
    const raw = localStorage.getItem(KEYS.risks)
    return raw ? (JSON.parse(raw) as Risk[]) : []
  } catch {
    return []
  }
}

// ─── Recent activity ────────────────────────────────────────────────────────

export function saveActivity(activity: ControlUpdate[]): void {
  try {
    localStorage.setItem(KEYS.activity, JSON.stringify(activity.slice(0, 20)))
  } catch {
    console.error('Failed to persist activity')
  }
}

export function loadActivity(): ControlUpdate[] {
  try {
    const raw = localStorage.getItem(KEYS.activity)
    return raw ? (JSON.parse(raw) as ControlUpdate[]) : []
  } catch {
    return []
  }
}

// ─── Export / import ────────────────────────────────────────────────────────

export function exportToJSON(): string {
  const frameworks = Object.fromEntries(
    ALL_FRAMEWORK_IDS.map(id => [id, loadFrameworkData(id) ?? []])
  ) as Record<FrameworkId, Control[]>

  const data: ExportData = {
    version: '2.0.0',
    exportedAt: new Date().toISOString(),
    frameworks,
    risks: loadRisks(),
    settings: JSON.parse(localStorage.getItem(KEYS.settings) ?? '{}') as Record<string, unknown>,
    recentActivity: loadActivity(),
  }
  return JSON.stringify(data, null, 2)
}

export function importFromJSON(json: string): boolean {
  try {
    const data = JSON.parse(json) as ExportData
    if (!data.version || !data.frameworks) return false

    for (const id of ALL_FRAMEWORK_IDS) {
      if (Array.isArray(data.frameworks[id])) {
        saveFrameworkData(id, data.frameworks[id])
      }
    }
    if (Array.isArray(data.risks)) saveRisks(data.risks)
    if (data.settings) {
      localStorage.setItem(KEYS.settings, JSON.stringify(data.settings))
    }
    return true
  } catch {
    return false
  }
}

export function resetFramework(id: FrameworkId): void {
  localStorage.removeItem(KEYS.framework(id))
}

export function resetAll(): void {
  ALL_FRAMEWORK_IDS.forEach(id => localStorage.removeItem(KEYS.framework(id)))
  localStorage.removeItem(KEYS.risks)
  localStorage.removeItem(KEYS.activity)
  localStorage.removeItem(KEYS.settings)
}

// ─── Statement of Applicability HTML export ──────────────────────────────────

const FW_LABELS: Record<string, string> = {
  'iso27001':         'ISO 27001:2022',
  'nist-csf':         'NIST CSF 2.0',
  'pci-dss':          'PCI-DSS v4.0',
  'dora':             'DORA 2025',
  'cis-v8':           'CIS Controls v8',
  'soc2':             'SOC 2 (TSC)',
  'uk-gdpr':          'UK GDPR / DPA 2018',
  'cyber-essentials': 'Cyber Essentials Plus',
}

export function exportSoA(frameworkId: string, orgName: string): void {
  const controls = loadFrameworkData(frameworkId as FrameworkId) ?? []
  const date = new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })

  const stats = {
    total:         controls.length,
    implemented:   controls.filter(c => c.status === 'implemented').length,
    inProgress:    controls.filter(c => c.status === 'in-progress').length,
    notStarted:    controls.filter(c => c.status === 'not-started').length,
    notApplicable: controls.filter(c => c.status === 'not-applicable').length,
  }

  const statusLabel: Record<string, string> = {
    'implemented':    'Implemented',
    'in-progress':    'In Progress',
    'not-started':    'Not Started',
    'not-applicable': 'N/A',
  }
  const statusColor: Record<string, string> = {
    'implemented':    '#22c55e',
    'in-progress':    '#f59e0b',
    'not-started':    '#64748b',
    'not-applicable': '#374151',
  }

  const rows = controls.map(c => {
    const applicable = c.status === 'not-applicable' ? 'Not Applicable' : 'Applicable'
    const applicableColor = c.status === 'not-applicable' ? '#374151' : '#22c55e'
    return `    <tr>
      <td class="mono">${c.id}</td>
      <td>${c.title.replace(/</g, '&lt;')}</td>
      <td>${c.domain}</td>
      <td style="color:${statusColor[c.status]};font-weight:600">${statusLabel[c.status]}</td>
      <td style="color:${applicableColor};font-weight:600">${applicable}</td>
      <td class="notes">${(c.owner || '—').replace(/</g, '&lt;')}</td>
      <td class="notes">${(c.notes || '—').replace(/</g, '&lt;')}</td>
      <td class="notes">${(c.evidence || '—').replace(/</g, '&lt;')}</td>
    </tr>`
  }).join('\n')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Statement of Applicability — ${FW_LABELS[frameworkId] ?? frameworkId} — ${orgName}</title>
<style>
  @page { size: A4 landscape; margin: 18mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif; font-size: 9pt; color: #1a1a2e; }
  .header { border-bottom: 2px solid #1a1a2e; padding-bottom: 10px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: flex-end; }
  .header h1 { font-size: 15pt; font-weight: 700; }
  .header .meta { font-size: 8.5pt; color: #555; text-align: right; line-height: 1.6; }
  .summary { display: flex; gap: 0; margin-bottom: 16px; border: 1px solid #ddd; overflow: hidden; border-radius: 4px; }
  .stat { flex: 1; text-align: center; padding: 10px 8px; border-right: 1px solid #ddd; }
  .stat:last-child { border-right: none; }
  .stat .value { font-size: 18pt; font-weight: 700; }
  .stat .label { font-size: 7.5pt; color: #666; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px; }
  table { width: 100%; border-collapse: collapse; font-size: 8pt; }
  th { background: #1a1a2e; color: white; padding: 6px 8px; text-align: left; font-weight: 600; font-size: 7.5pt; text-transform: uppercase; letter-spacing: 0.05em; }
  td { padding: 5px 8px; border-bottom: 1px solid #e8e8e8; vertical-align: top; }
  tr:nth-child(even) td { background: #f8f9fa; }
  .mono { font-family: 'Geist', 'SF Mono', ui-monospace, monospace; font-size: 7.5pt; white-space: nowrap; }
  .notes { max-width: 120px; word-break: break-word; }
  .footer { margin-top: 14px; font-size: 7pt; color: #aaa; border-top: 1px solid #e0e0e0; padding-top: 6px; display: flex; justify-content: space-between; }
</style>
</head>
<body>
<div class="header">
  <h1>Statement of Applicability</h1>
  <div class="meta">
    <strong>${orgName}</strong><br>
    ${FW_LABELS[frameworkId] ?? frameworkId}<br>
    ${date}
  </div>
</div>
<div class="summary">
  <div class="stat"><div class="value">${stats.total}</div><div class="label">Total</div></div>
  <div class="stat"><div class="value" style="color:#22c55e">${stats.implemented}</div><div class="label">Implemented</div></div>
  <div class="stat"><div class="value" style="color:#f59e0b">${stats.inProgress}</div><div class="label">In Progress</div></div>
  <div class="stat"><div class="value" style="color:#64748b">${stats.notStarted}</div><div class="label">Not Started</div></div>
  <div class="stat"><div class="value" style="color:#374151">${stats.notApplicable}</div><div class="label">N/A</div></div>
  <div class="stat"><div class="value">${stats.total > 0 ? Math.round((stats.implemented / stats.total) * 100) : 0}%</div><div class="label">Complete</div></div>
</div>
<table>
  <thead>
    <tr>
      <th>Control ID</th><th>Title</th><th>Domain</th><th>Status</th>
      <th>Applicability</th><th>Owner</th><th>Justification (Notes)</th><th>Evidence / Reference</th>
    </tr>
  </thead>
  <tbody>
${rows}
  </tbody>
</table>
<div class="footer">
  <span>GRC Intelligence — local-first, data never transmitted</span>
  <span>Generated ${new Date().toISOString()}</span>
</div>
</body>
</html>`

  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `soa-${frameworkId}-${new Date().toISOString().split('T')[0]}.html`
  a.click()
  URL.revokeObjectURL(url)
}

// ─── CSV export ─────────────────────────────────────────────────────────────

export function exportFrameworkCSV(controls: Control[], frameworkId: string): void {
  const headers = ['ID', 'Domain', 'Title', 'Status', 'Owner', 'Notes', 'Evidence', 'Last Updated']
  const rows = controls.map(c => [
    c.id,
    c.domain,
    `"${c.title.replace(/"/g, '""')}"`,
    c.status,
    `"${(c.owner ?? '').replace(/"/g, '""')}"`,
    `"${c.notes.replace(/"/g, '""')}"`,
    `"${c.evidence.replace(/"/g, '""')}"`,
    c.lastUpdated ?? '',
  ])
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url  = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href     = url
  link.download = `grc-${frameworkId}-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
