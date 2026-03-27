import { create } from 'zustand'
import type { FrameworkId, Toast, ToastType } from '../types'

interface UIStore {
  theme: 'dark' | 'light'
  sidebarOpen: boolean
  mobileSidebarOpen: boolean
  denseTable: boolean
  activeFramework: FrameworkId
  toasts: Toast[]

  toggleTheme: () => void
  setTheme: (theme: 'dark' | 'light') => void
  toggleSidebar: () => void
  setSidebar: (open: boolean) => void
  toggleMobileSidebar: () => void
  closeMobileSidebar: () => void
  setDenseTable: (dense: boolean) => void
  setActiveFramework: (id: FrameworkId) => void

  addToast: (message: string, type?: ToastType, duration?: number) => void
  removeToast: (id: string) => void
}

function loadSetting<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`grc:ui:${key}`)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function saveSetting(key: string, value: unknown): void {
  try {
    localStorage.setItem(`grc:ui:${key}`, JSON.stringify(value))
  } catch { /* ignore */ }
}

// v3 migration: reset any saved dark theme so light is the default for
// all existing visitors. Mirrors the inline script in index.html.
if (!localStorage.getItem('grc:ui:theme-v3')) {
  localStorage.removeItem('grc:ui:theme')
  localStorage.setItem('grc:ui:theme-v3', '1')
}

// Apply saved theme class on initial load (before first render)
const _initTheme = loadSetting<'dark' | 'light'>('theme', 'light')
document.documentElement.classList.remove('dark', 'light')
document.documentElement.classList.add(_initTheme)

export const useUIStore = create<UIStore>((set) => ({
  theme:              _initTheme,
  sidebarOpen:        loadSetting<boolean>('sidebarOpen', true),
  mobileSidebarOpen:  false,   // never persisted — always starts closed
  denseTable:         loadSetting<boolean>('denseTable', false),
  activeFramework:    loadSetting<FrameworkId>('activeFramework', 'iso27001'),
  toasts:             [],

  toggleTheme() {
    set(s => {
      const next = s.theme === 'dark' ? 'light' : 'dark'
      saveSetting('theme', next)
      document.documentElement.classList.remove('dark', 'light')
      document.documentElement.classList.add(next)
      return { theme: next }
    })
  },

  setTheme(theme) {
    saveSetting('theme', theme)
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(theme)
    set({ theme })
  },

  toggleSidebar() {
    set(s => {
      saveSetting('sidebarOpen', !s.sidebarOpen)
      return { sidebarOpen: !s.sidebarOpen }
    })
  },

  setSidebar(open) {
    saveSetting('sidebarOpen', open)
    set({ sidebarOpen: open })
  },

  toggleMobileSidebar() {
    set(s => ({ mobileSidebarOpen: !s.mobileSidebarOpen }))
  },

  closeMobileSidebar() {
    set({ mobileSidebarOpen: false })
  },

  setDenseTable(dense) {
    saveSetting('denseTable', dense)
    set({ denseTable: dense })
  },

  setActiveFramework(id) {
    saveSetting('activeFramework', id)
    set({ activeFramework: id })
  },

  addToast(message, type = 'success', duration = 3000) {
    const id = `toast-${Date.now()}`
    set(s => ({ toasts: [...s.toasts, { id, message, type, duration }] }))
    setTimeout(() => {
      set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }))
    }, duration)
  },

  removeToast(id) {
    set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }))
  },
}))
