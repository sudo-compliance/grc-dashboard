import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUIStore } from '../store/useUIStore'
import { exportToJSON } from '../services/persistence'

interface Options {
  onOpenCommandPalette: () => void
}

export function useKeyboardShortcuts({ onOpenCommandPalette }: Options) {
  const navigate     = useNavigate()
  const { toggleTheme, addToast } = useUIStore()
  const gBuffer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const awaitingSecond = useRef(false)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const meta    = e.metaKey || e.ctrlKey
      const tag     = (e.target as HTMLElement).tagName
      const inInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'

      // Cmd/Ctrl + K — command palette
      if (meta && e.key === 'k') {
        e.preventDefault()
        onOpenCommandPalette()
        return
      }

      // Cmd/Ctrl + E — export JSON
      if (meta && e.key === 'e') {
        e.preventDefault()
        const json = exportToJSON()
        const blob = new Blob([json], { type: 'application/json' })
        const url  = URL.createObjectURL(blob)
        const a    = document.createElement('a')
        a.href     = url
        a.download = `grc-export-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
        addToast('Data exported', 'success')
        return
      }

      // Cmd/Ctrl + Shift + T — toggle theme
      if (meta && e.shiftKey && e.key === 'T') {
        e.preventDefault()
        toggleTheme()
        return
      }

      // Skip chord shortcuts when typing in an input
      if (inInput) return

      // G-chord shortcuts (Gmail-style)
      if (awaitingSecond.current) {
        awaitingSecond.current = false
        if (gBuffer.current) clearTimeout(gBuffer.current)

        if (e.key === 'd') { navigate('/');          return }
        if (e.key === 'r') { navigate('/risk');      return }
        if (e.key === 'c') { navigate('/crosswalk'); return }
        return
      }

      if (e.key === 'g' && !meta) {
        awaitingSecond.current = true
        gBuffer.current = setTimeout(() => { awaitingSecond.current = false }, 1000)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (gBuffer.current) clearTimeout(gBuffer.current)
    }
  }, [navigate, toggleTheme, addToast, onOpenCommandPalette])
}
