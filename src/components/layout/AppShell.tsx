import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'
import { useUIStore } from '../../store/useUIStore'
import ToastContainer from '../ui/ToastContainer'

export default function AppShell() {
  const sidebarOpen = useUIStore(s => s.sidebarOpen)

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {/* Sidebar */}
      <aside
        id="sidebar"
        className={`flex-shrink-0 transition-all duration-200 ${sidebarOpen ? 'w-60' : 'w-14'}`}
      >
        <Sidebar />
      </aside>

      {/* Main column */}
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
