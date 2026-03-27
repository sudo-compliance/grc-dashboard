import { create } from 'zustand'
import type {
  CompletionStats,
  Control,
  ControlStatus,
  ControlUpdate,
  DomainStat,
  FrameworkId,
} from '../types'
import {
  loadFrameworkData,
  loadActivity,
  saveFrameworkData,
  saveActivity,
} from '../services/persistence'

interface OwnerSummaryEntry {
  owner: string
  count: number
  implemented: number
}

interface FrameworkStore {
  frameworks: Record<FrameworkId, Control[]>
  recentActivity: ControlUpdate[]

  initFramework: (id: FrameworkId, controls: Control[]) => void
  updateControlStatus: (frameworkId: FrameworkId, controlId: string, status: ControlStatus) => void
  updateControlNotes: (frameworkId: FrameworkId, controlId: string, notes: string) => void
  updateControlEvidence: (frameworkId: FrameworkId, controlId: string, evidence: string) => void
  updateControlOwner: (frameworkId: FrameworkId, controlId: string, owner: string) => void
  bulkUpdateStatus: (frameworkId: FrameworkId, controlIds: string[], status: ControlStatus) => void

  getCompletionStats: (frameworkId: FrameworkId) => CompletionStats
  getDomainStats: (frameworkId: FrameworkId) => DomainStat[]
  getOwnerSummary: (frameworkId: FrameworkId) => OwnerSummaryEntry[]
}

const ALL_IDS: FrameworkId[] = [
  'iso27001', 'iso42001', 'nist-csf', 'pci-dss',
  'dora', 'cis-v8', 'soc2', 'uk-gdpr', 'cyber-essentials',
]

function buildInitialFrameworks(): Record<FrameworkId, Control[]> {
  return Object.fromEntries(
    ALL_IDS.map(id => [id, loadFrameworkData(id) ?? []])
  ) as Record<FrameworkId, Control[]>
}

export const useFrameworkStore = create<FrameworkStore>((set, get) => ({
  frameworks: buildInitialFrameworks(),
  recentActivity: loadActivity(),

  initFramework(id, controls) {
    const existing = loadFrameworkData(id)
    if (existing && existing.length > 0) return
    set(s => ({ frameworks: { ...s.frameworks, [id]: controls } }))
    saveFrameworkData(id, controls)
  },

  updateControlStatus(frameworkId, controlId, status) {
    const now = new Date().toISOString()
    set(s => {
      const controls = s.frameworks[frameworkId].map(c =>
        c.id === controlId ? { ...c, status, lastUpdated: now } : c
      )
      const previous = s.frameworks[frameworkId].find(c => c.id === controlId)
      const update: ControlUpdate = {
        controlId, frameworkId, field: 'status',
        previousValue: previous?.status ?? 'not-started',
        newValue: status, timestamp: now,
      }
      const activity = [update, ...s.recentActivity].slice(0, 20)
      saveFrameworkData(frameworkId, controls)
      saveActivity(activity)
      return { frameworks: { ...s.frameworks, [frameworkId]: controls }, recentActivity: activity }
    })
  },

  updateControlNotes(frameworkId, controlId, notes) {
    const now = new Date().toISOString()
    set(s => {
      const controls = s.frameworks[frameworkId].map(c =>
        c.id === controlId ? { ...c, notes, lastUpdated: now } : c
      )
      saveFrameworkData(frameworkId, controls)
      return { frameworks: { ...s.frameworks, [frameworkId]: controls } }
    })
  },

  updateControlEvidence(frameworkId, controlId, evidence) {
    const now = new Date().toISOString()
    set(s => {
      const controls = s.frameworks[frameworkId].map(c =>
        c.id === controlId ? { ...c, evidence, lastUpdated: now } : c
      )
      saveFrameworkData(frameworkId, controls)
      return { frameworks: { ...s.frameworks, [frameworkId]: controls } }
    })
  },

  updateControlOwner(frameworkId, controlId, owner) {
    const now = new Date().toISOString()
    set(s => {
      const controls = s.frameworks[frameworkId].map(c =>
        c.id === controlId ? { ...c, owner, lastUpdated: now } : c
      )
      const update: ControlUpdate = {
        controlId, frameworkId, field: 'owner',
        previousValue: s.frameworks[frameworkId].find(c => c.id === controlId)?.owner ?? '',
        newValue: owner, timestamp: now,
      }
      const activity = [update, ...s.recentActivity].slice(0, 20)
      saveFrameworkData(frameworkId, controls)
      saveActivity(activity)
      return { frameworks: { ...s.frameworks, [frameworkId]: controls }, recentActivity: activity }
    })
  },

  bulkUpdateStatus(frameworkId, controlIds, status) {
    const now = new Date().toISOString()
    set(s => {
      const idSet = new Set(controlIds)
      const controls = s.frameworks[frameworkId].map(c =>
        idSet.has(c.id) ? { ...c, status, lastUpdated: now } : c
      )
      saveFrameworkData(frameworkId, controls)
      return { frameworks: { ...s.frameworks, [frameworkId]: controls } }
    })
  },

  getCompletionStats(frameworkId) {
    const controls = get().frameworks[frameworkId] ?? []
    const total         = controls.length
    const implemented   = controls.filter(c => c.status === 'implemented').length
    const inProgress    = controls.filter(c => c.status === 'in-progress').length
    const notApplicable = controls.filter(c => c.status === 'not-applicable').length
    const notStarted    = total - implemented - inProgress - notApplicable
    const applicable    = total - notApplicable
    const percentComplete = applicable > 0 ? Math.round((implemented / applicable) * 100) : 0
    return { total, implemented, inProgress, notStarted, notApplicable, percentComplete }
  },

  getDomainStats(frameworkId) {
    const controls = get().frameworks[frameworkId] ?? []
    const map = new Map<string, { code: string; name: string; controls: Control[] }>()
    for (const c of controls) {
      const key = c.domainCode
      if (!map.has(key)) map.set(key, { code: c.domainCode, name: c.domain, controls: [] })
      map.get(key)!.controls.push(c)
    }
    return Array.from(map.values()).map(({ code, name, controls: dc }) => {
      const total       = dc.length
      const implemented = dc.filter(c => c.status === 'implemented').length
      const inProgress  = dc.filter(c => c.status === 'in-progress').length
      const na          = dc.filter(c => c.status === 'not-applicable').length
      const applicable  = total - na
      return {
        code, name, total, implemented, inProgress,
        percentComplete: applicable > 0 ? Math.round((implemented / applicable) * 100) : 0,
      }
    })
  },

  getOwnerSummary(frameworkId) {
    const controls = get().frameworks[frameworkId] ?? []
    const map = new Map<string, { count: number; implemented: number }>()
    for (const c of controls) {
      const owner = (c.owner ?? '').trim()
      if (!owner) continue
      if (!map.has(owner)) map.set(owner, { count: 0, implemented: 0 })
      const entry = map.get(owner)!
      entry.count++
      if (c.status === 'implemented') entry.implemented++
    }
    return Array.from(map.entries())
      .map(([owner, { count, implemented }]) => ({ owner, count, implemented }))
      .sort((a, b) => b.count - a.count)
  },
}))
