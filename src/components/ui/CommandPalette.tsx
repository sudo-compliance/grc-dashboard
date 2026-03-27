import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, LayoutDashboard, ShieldCheck, Layers, CreditCard, GitMerge, AlertTriangle, Settings } from 'lucide-react'

interface CommandItem {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  action: () => void
}

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const navigate   = useNavigate()
  const [query, setQuery] = useState('')
  const inputRef   = useRef<HTMLInputElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  const items: CommandItem[] = useMemo(() => [
    { id: 'dashboard',      label: 'Dashboard',              description: 'GRC overview',            icon: <LayoutDashboard size={14} />, action: () => navigate('/') },
    { id: 'iso-detail',     label: 'ISO 27001 — Detail',     description: 'Framework deep-dive',     icon: <ShieldCheck size={14} />,     action: () => navigate('/framework/iso27001') },
    { id: 'iso-controls',   label: 'ISO 27001 — Controls',   description: 'Control tracker',         icon: <ShieldCheck size={14} />,     action: () => navigate('/controls/iso27001') },
    { id: 'nist-detail',    label: 'NIST CSF — Detail',      description: 'Framework deep-dive',     icon: <Layers size={14} />,          action: () => navigate('/framework/nist-csf') },
    { id: 'nist-controls',  label: 'NIST CSF — Controls',    description: 'Control tracker',         icon: <Layers size={14} />,          action: () => navigate('/controls/nist-csf') },
    { id: 'pci-detail',     label: 'PCI-DSS — Detail',       description: 'Framework deep-dive',     icon: <CreditCard size={14} />,      action: () => navigate('/framework/pci-dss') },
    { id: 'pci-controls',   label: 'PCI-DSS — Controls',     description: 'Control tracker',         icon: <CreditCard size={14} />,      action: () => navigate('/controls/pci-dss') },
    { id: 'crosswalk',      label: 'Framework Crosswalk',    description: 'Cross-framework mapping', icon: <GitMerge size={14} />,        action: () => navigate('/crosswalk') },
    { id: 'risk',           label: 'Risk Assessment',        description: 'Risk register',           icon: <AlertTriangle size={14} />,   action: () => navigate('/risk') },
    { id: 'settings',       label: 'Settings',               description: 'Import, export, reset',   icon: <Settings size={14} />,        action: () => navigate('/settings') },
  ], [navigate])

  const filtered = useMemo(() => {
    if (!query.trim()) return items
    const q = query.toLowerCase()
    return items.filter(i =>
      i.label.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
    )
  }, [items, query])

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIdx(0)
      setTimeout(() => inputRef.current?.focus(), 10)
    }
  }, [open])

  useEffect(() => { setActiveIdx(0) }, [query])

  useEffect(() => {
    if (!open) return
    const handle = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     { onClose(); return }
      if (e.key === 'ArrowDown')  { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, filtered.length - 1)); return }
      if (e.key === 'ArrowUp')    { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); return }
      if (e.key === 'Enter')      { filtered[activeIdx]?.action(); onClose(); return }
    }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [open, filtered, activeIdx, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-xl rounded-xl border border-default overflow-hidden shadow-2xl animate-slide-in"
           style={{ background: 'var(--bg-surface)' }}>
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-subtle">
          <Search size={15} style={{ color: 'var(--text-muted)' }} className="flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Go to page…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: 'var(--text-primary)' }}
          />
          <kbd className="mono text-[11px] px-1.5 py-0.5 rounded border border-subtle"
               style={{ color: 'var(--text-muted)', background: 'var(--bg-elevated)' }}>
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="py-1 max-h-80 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="text-xs px-4 py-6 text-center" style={{ color: 'var(--text-muted)' }}>No results</p>
          ) : (
            filtered.map((item, i) => (
              <button
                key={item.id}
                onClick={() => { item.action(); onClose() }}
                onMouseEnter={() => setActiveIdx(i)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                style={{
                  background: i === activeIdx ? 'var(--bg-elevated)' : 'transparent',
                  borderLeft: i === activeIdx ? '2px solid var(--accent)' : '2px solid transparent',
                }}
              >
                <span style={{ color: i === activeIdx ? 'var(--accent)' : 'var(--text-muted)' }}>
                  {item.icon}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="text-sm font-medium block" style={{ color: 'var(--text-primary)' }}>
                    {item.label}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {item.description}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer hints */}
        <div className="flex items-center gap-4 px-4 py-2 border-t border-subtle">
          {[['↑↓', 'navigate'], ['↵', 'select'], ['esc', 'close']].map(([key, label]) => (
            <span key={key} className="flex items-center gap-1">
              <kbd className="mono text-[10px] px-1 py-0.5 rounded border border-subtle"
                   style={{ color: 'var(--text-muted)', background: 'var(--bg-elevated)' }}>
                {key}
              </kbd>
              <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
