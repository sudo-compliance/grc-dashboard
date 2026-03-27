import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import { useUIStore } from '../../store/useUIStore'
import ToastContainer from '../ui/ToastContainer'

export default function AppShell() {
  const { sidebarOpen, mobileSidebarOpen, closeMobileSidebar } = useUIStore()
  const location = useLocation()

  // Auto-close the mobile drawer whenever the route changes
  useEffect(() => {
    closeMobileSidebar()
  }, [location.pathname])

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>

      {/* ── Mobile drawer overlay (< md) ──────────────────────────── */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${
          mobileSidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            mobileSidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ background: 'rgba(0,0,0,0.55)' }}
          onClick={closeMobileSidebar}
        />
        {/* Drawer panel */}
        <aside
          className={`absolute left-0 top-0 h-full w-72 transition-transform duration-300 ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar />
        </aside>
      </div>

      {/* ── Desktop sidebar (≥ md) ────────────────────────────────── */}
      <aside
        id="sidebar"
        className={`hidden md:block flex-shrink-0 transition-all duration-200 ${
          sidebarOpen ? 'w-60' : 'w-14'
        }`}
      >
        <Sidebar />
      </aside>

      {/* ── Main column ───────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <header id="topbar" className="flex-shrink-0">
          <TopBar />
        </header>
        <main
          id="main-content"
          className="flex-1 overflow-y-auto"
          style={{ background: 'var(--bg-base)' }}
        >
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  )
}
