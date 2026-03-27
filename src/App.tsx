import { useState } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import Dashboard from './pages/Dashboard'
import FrameworkDetail from './pages/FrameworkDetail'
import ControlTracker from './pages/ControlTracker'
import Crosswalk from './pages/Crosswalk'
import RiskAssessment from './pages/RiskAssessment'
import Settings from './pages/Settings'
import CommandPalette from './components/ui/CommandPalette'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

function AppInner() {
  const [cmdOpen, setCmdOpen] = useState(false)
  useKeyboardShortcuts({ onOpenCommandPalette: () => setCmdOpen(true) })

  return (
    <>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index             element={<Dashboard />} />
          <Route path="framework/:id" element={<FrameworkDetail />} />
          <Route path="controls/:id"  element={<ControlTracker />} />
          <Route path="crosswalk"     element={<Crosswalk />} />
          <Route path="risk"          element={<RiskAssessment />} />
          <Route path="settings"      element={<Settings />} />
        </Route>
      </Routes>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} />
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AppInner />
    </HashRouter>
  )
}
