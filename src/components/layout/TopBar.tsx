import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Sun, Moon, Download, Monitor, Search, Menu } from 'lucide-react'
import { useUIStore } from '../../store/useUIStore'
import { exportToJSON } from '../../services/persistence'

const PAGE_TITLES: Record<string, string> = {
  '/':                          'GRC Overview',
  '/framework/iso27001':        'ISO 27001:2022',
  '/framework/iso42001':        'ISO 42001:2023',
  '/framework/nist-csf':        'NIST CSF 2.0',
  '/framework/pci-dss':         'PCI-DSS v4.0',
  '/framework/dora':            'DORA',
  '/framework/cis-v8':          'CIS Controls v8',
  '/framework/soc2':            'SOC 2',
  '/framework/uk-gdpr':         'UK GDPR',
  '/framework/cyber-essentials':'Cyber Essentials',
  '/controls/iso27001':         'ISO 27001 — Controls',
  '/controls/iso42001':         'ISO 42001 — Controls',
  '/controls/nist-csf':         'NIST CSF — Controls',
  '/controls/pci-dss':          'PCI-DSS — Controls',
  '/controls/dora':             'DORA — Controls',
  '/controls/cis-v8':           'CIS Controls — Safeguards',
  '/controls/soc2':             'SOC 2 — Criteria',
  '/controls/uk-gdpr':          'UK GDPR — Controls',
  '/controls/cyber-essentials': 'Cyber Essentials — Controls',
  '/crosswalk':                 'Framework Crosswalk',
  '/risk':                      'Risk Assessment',
  '/settings':                  'Settings',
}

export default function TopBar() {
  const location = useLocation()
  const { theme, toggleTheme, addToast, toggleMobileSidebar } = useUIStore()
  const [installPrompt, setInstallPrompt] = useState<Event | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const title = PAGE_TITLES[location.pathname] ?? 'GRC Intelligence'

  const today   = new Date()
  const day     = today.getDate()
  const weekday = today.toLocaleDateString('en-GB', { weekday: 'short' })
  const month   = today.toLocaleDateString('en-GB', { month: 'long' })

  useEffect(() => {
    const handler = (e: Event) => { e.preventDefault(); setInstallPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function handleExport() {
    const json = exportToJSON()
    const blob = new Blob([json], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `grc-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    addToast('Data exported successfully', 'success')
  }

  async function handleInstall() {
    if (!installPrompt) return
    await (installPrompt as unknown as { prompt: () => Promise<void> }).prompt()
    setInstallPrompt(null)
  }

  return (
    <div
      id="topbar"
      className="flex items-center gap-2 md:gap-3 px-3 md:px-5"
      style={{
        height: 64,
        background: 'var(--bg-base)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      {/* ── Hamburger (mobile only) ─────────────────────── */}
      <button
        className="md:hidden flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          color: 'var(--text-secondary)',
        }}
        onClick={toggleMobileSidebar}
        aria-label="Open navigation"
      >
        <Menu size={16} />
      </button>

      {/* ── Date pill (desktop only) ────────────────────── */}
      <div
        className="hidden md:flex items-center gap-2.5 px-4 py-2.5 flex-shrink-0"
        style={{
          background: 'var(--bg-surface)',
          borderRadius: 12,
          boxShadow: 'var(--card-shadow)',
        }}
      >
        <span className="text-2xl font-bold leading-none" style={{ color: 'var(--text-primary)' }}>
          {day}
        </span>
        <div>
          <p className="text-xs leading-none" style={{ color: 'var(--text-muted)' }}>{weekday},</p>
          <p className="text-sm font-semibold leading-tight" style={{ color: 'var(--text-primary)' }}>{month}</p>
        </div>
      </div>

      {/* ── Page title pill ─────────────────────────────── */}
      <div
        className="px-3 py-1.5 md:px-4 md:py-2 flex-shrink-0 truncate max-w-[160px] md:max-w-none"
        style={{
          background: 'var(--accent)',
          borderRadius: 8,
          color: '#fff',
          fontSize: 13,
          fontWeight: 600,
        }}
      >
        {title}
      </div>

      {/* ── Spacer ──────────────────────────────────────── */}
      <div className="flex-1" />

      {/* ── Search (desktop only) ───────────────────────── */}
      <label
        className="hidden md:flex items-center gap-2 px-3 py-2 flex-shrink-0 cursor-text"
        style={{
          background: 'var(--bg-surface)',
          borderRadius: 10,
          boxShadow: 'var(--card-shadow)',
          border: '1px solid var(--border-subtle)',
          transition: 'border-color 0.15s',
        }}
        onFocusCapture={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-border)'}
        onBlurCapture={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)'}
      >
        <Search size={13} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="bg-transparent outline-none text-xs w-32"
          style={{ color: 'var(--text-secondary)' }}
        />
      </label>

      {/* ── Install (desktop only) ───────────────────────── */}
      {installPrompt && (
        <button
          onClick={handleInstall}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex-shrink-0"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-secondary)',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)' }}
        >
          <Monitor size={13} />
          <span>Install</span>
        </button>
      )}

      {/* ── Export ──────────────────────────────────────── */}
      <button
        onClick={handleExport}
        className="flex items-center gap-1.5 px-2.5 py-1.5 md:px-3 rounded-lg text-xs font-medium transition-all flex-shrink-0"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          color: 'var(--text-secondary)',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)' }}
      >
        <Download size={13} />
        <span className="hidden md:inline">Export</span>
      </button>

      {/* ── Theme toggle ────────────────────────────────── */}
      <button
        onClick={toggleTheme}
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
        style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-default)',
          color: 'var(--text-muted)',
        }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent-border)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)' }}
        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
      </button>

    </div>
  )
}
