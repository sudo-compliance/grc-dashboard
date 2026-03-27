import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, ShieldCheck, Layers, CreditCard,
  GitMerge, AlertTriangle, Settings, ChevronLeft, ChevronRight,
  Shield, ShieldAlert, ListChecks, BadgeCheck, Lock, ShieldHalf, TrendingUp,
} from 'lucide-react'
import { useUIStore } from '../../store/useUIStore'

interface NavItem {
  label: string
  to: string
  icon: React.ReactNode
  dot?: string
  sub?: { label: string; to: string }[]
}

const sections: { heading?: string; items: NavItem[] }[] = [
  {
    items: [
      { label: 'Dashboard', to: '/', icon: <LayoutDashboard size={16} /> },
    ],
  },
  {
    heading: 'Frameworks',
    items: [
      { label: 'ISO 27001',        to: '/framework/iso27001',         icon: <ShieldCheck size={16} />, dot: 'var(--iso-color)',  sub: [{ label: 'Controls', to: '/controls/iso27001' }] },
      { label: 'ISO 42001',        to: '/framework/iso42001',         icon: <TrendingUp  size={16} />, dot: 'var(--ai-color)',   sub: [{ label: 'Controls', to: '/controls/iso42001' }] },
      { label: 'NIST CSF',         to: '/framework/nist-csf',         icon: <Layers      size={16} />, dot: 'var(--nist-color)', sub: [{ label: 'Controls', to: '/controls/nist-csf' }] },
      { label: 'PCI-DSS',          to: '/framework/pci-dss',          icon: <CreditCard  size={16} />, dot: 'var(--pci-color)',  sub: [{ label: 'Controls', to: '/controls/pci-dss' }] },
      { label: 'DORA',             to: '/framework/dora',             icon: <ShieldAlert size={16} />, dot: 'var(--dora-color)', sub: [{ label: 'Controls', to: '/controls/dora' }] },
      { label: 'CIS Controls',     to: '/framework/cis-v8',           icon: <ListChecks  size={16} />, dot: 'var(--cis-color)',  sub: [{ label: 'Controls', to: '/controls/cis-v8' }] },
      { label: 'SOC 2',            to: '/framework/soc2',             icon: <BadgeCheck  size={16} />, dot: 'var(--soc2-color)', sub: [{ label: 'Controls', to: '/controls/soc2' }] },
      { label: 'UK GDPR',          to: '/framework/uk-gdpr',          icon: <Lock        size={16} />, dot: 'var(--gdpr-color)', sub: [{ label: 'Controls', to: '/controls/uk-gdpr' }] },
      { label: 'Cyber Essentials', to: '/framework/cyber-essentials', icon: <ShieldHalf  size={16} />, dot: 'var(--ce-color)',   sub: [{ label: 'Controls', to: '/controls/cyber-essentials' }] },
    ],
  },
  {
    heading: 'Tools',
    items: [
      { label: 'Crosswalk',       to: '/crosswalk', icon: <GitMerge      size={16} /> },
      { label: 'Risk Assessment', to: '/risk',      icon: <AlertTriangle size={16} /> },
    ],
  },
  {
    heading: 'System',
    items: [
      { label: 'Settings', to: '/settings', icon: <Settings size={16} /> },
    ],
  },
]

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore()
  const navigate = useNavigate()

  return (
    <div
      className="h-full flex flex-col"
      style={{
        background: 'var(--bg-surface)',
        boxShadow: '2px 0 12px rgba(0,0,0,0.05)',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-5 cursor-pointer select-none flex-shrink-0"
        onClick={() => navigate('/')}
      >
        {/* GRC monogram */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--text-primary)' }}
        >
          <Shield size={16} style={{ color: 'var(--bg-surface)' }} />
        </div>
        {sidebarOpen && (
          <div className="min-w-0">
            <p className="text-sm font-bold leading-tight truncate" style={{ color: 'var(--text-primary)' }}>
              GRC Intelligence
            </p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Compliance Hub
            </p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mx-3 h-px" style={{ background: 'var(--border-subtle)' }} />

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-none py-3 px-2">
        {sections.map((section, si) => (
          <div key={si} className="mb-2">
            {/* Section heading */}
            {section.heading && sidebarOpen && (
              <p
                className="text-[11px] font-bold uppercase tracking-widest px-3 pt-3 pb-1.5"
                style={{ color: 'var(--text-muted)' }}
              >
                {section.heading}
              </p>
            )}
            {section.heading && !sidebarOpen && (
              <div className="my-2 mx-1 h-px" style={{ background: 'var(--border-subtle)' }} />
            )}

            {section.items.map(item => (
              <div key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className="flex items-center gap-2.5 py-2 px-3 rounded-xl transition-all duration-150 group"
                  style={({ isActive }) => ({
                    background:  isActive ? 'var(--accent-dim)' : 'transparent',
                    color:       isActive ? 'var(--accent)' : 'var(--text-secondary)',
                    fontWeight:  isActive ? 600 : 400,
                  })}
                  onMouseEnter={e => {
                    if (!(e.currentTarget as HTMLElement).style.background.includes('accent-dim') &&
                        !(e.currentTarget as HTMLElement).dataset.active) {
                      (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'
                      ;(e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'
                    }
                  }}
                  onMouseLeave={e => {
                    // NavLink handles active state via style prop; reset only non-active
                    const el = e.currentTarget as HTMLElement
                    if (!el.classList.contains('active')) {
                      el.style.background = 'transparent'
                      el.style.color = 'var(--text-secondary)'
                    }
                  }}
                >
                  <span className="flex-shrink-0 w-4 flex items-center justify-center">
                    {item.icon}
                  </span>
                  {sidebarOpen && (
                    <span className="flex items-center gap-2 text-sm truncate">
                      {item.dot && (
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: item.dot }}
                        />
                      )}
                      {item.label}
                    </span>
                  )}
                </NavLink>

                {/* Sub-items */}
                {sidebarOpen && item.sub?.map(sub => (
                  <NavLink
                    key={sub.to}
                    to={sub.to}
                    className="flex items-center gap-2 pl-10 pr-3 py-1.5 rounded-lg text-xs transition-all mx-0.5"
                    style={({ isActive }) => ({
                      color: isActive ? 'var(--accent)' : 'var(--text-muted)',
                    })}
                  >
                    <span className="w-1 h-1 rounded-full bg-current opacity-40 flex-shrink-0" />
                    {sub.label}
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2 flex-shrink-0">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs transition-all"
          style={{
            color:      'var(--text-muted)',
            background: 'var(--bg-elevated)',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'
          }}
        >
          {sidebarOpen
            ? <><ChevronLeft size={13} /><span>Collapse</span></>
            : <ChevronRight size={13} />}
        </button>
      </div>
    </div>
  )
}
