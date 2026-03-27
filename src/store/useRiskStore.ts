import { create } from 'zustand'
import type { Risk, RiskAppetiteThreshold, RiskImpact, RiskLevel, RiskLikelihood, RiskStatus } from '../types'
import { calcRiskLevel, DEFAULT_APPETITE } from '../types'
import { loadRisks, saveRisks } from '../services/persistence'

const APPETITE_KEY = 'grc:risk-appetite'

function loadAppetite(): RiskAppetiteThreshold {
  try {
    const raw = localStorage.getItem(APPETITE_KEY)
    return raw ? (JSON.parse(raw) as RiskAppetiteThreshold) : DEFAULT_APPETITE
  } catch {
    return DEFAULT_APPETITE
  }
}

function saveAppetite(threshold: RiskAppetiteThreshold): void {
  try {
    localStorage.setItem(APPETITE_KEY, JSON.stringify(threshold))
  } catch {
    console.error('Failed to persist risk appetite')
  }
}

type NewRisk = Omit<Risk, 'id' | 'score' | 'riskLevel' | 'dateCreated'>

interface RiskStore {
  risks: Risk[]
  appetiteThreshold: RiskAppetiteThreshold

  addRisk: (risk: NewRisk) => string
  updateRisk: (id: string, partial: Partial<NewRisk>) => void
  deleteRisk: (id: string) => void
  getRisksByLevel: (level: RiskLevel) => Risk[]
  getRiskSummary: () => Record<RiskLevel, number>
  setAppetiteThreshold: (threshold: RiskAppetiteThreshold) => void
  isRiskAboveAppetite: (likelihood: number, impact: number) => boolean
}

function buildRisk(input: NewRisk, id: string): Risk {
  const score     = input.likelihood * input.impact
  const riskLevel = calcRiskLevel(score)
  return { ...input, id, score, riskLevel, dateCreated: new Date().toISOString() }
}

export const useRiskStore = create<RiskStore>((set, get) => ({
  risks: loadRisks(),
  appetiteThreshold: loadAppetite(),

  addRisk(input) {
    const id   = `risk-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const risk = buildRisk(input, id)
    set(s => {
      const risks = [risk, ...s.risks].sort((a, b) => b.score - a.score)
      saveRisks(risks)
      return { risks }
    })
    return id
  },

  updateRisk(id, partial) {
    set(s => {
      const risks = s.risks.map(r => {
        if (r.id !== id) return r
        const updated = { ...r, ...partial, lastUpdated: new Date().toISOString() }
        const score     = (partial.likelihood ?? r.likelihood as RiskLikelihood) * (partial.impact ?? r.impact as RiskImpact)
        const riskLevel = calcRiskLevel(score)
        return { ...updated, score, riskLevel } as Risk
      })
      saveRisks(risks)
      return { risks }
    })
  },

  deleteRisk(id) {
    set(s => {
      const risks = s.risks.filter(r => r.id !== id)
      saveRisks(risks)
      return { risks }
    })
  },

  getRisksByLevel(level) {
    return get().risks.filter(r => r.riskLevel === level)
  },

  getRiskSummary() {
    const risks = get().risks
    return {
      low:      risks.filter(r => r.riskLevel === 'low').length,
      medium:   risks.filter(r => r.riskLevel === 'medium').length,
      high:     risks.filter(r => r.riskLevel === 'high').length,
      critical: risks.filter(r => r.riskLevel === 'critical').length,
    }
  },

  setAppetiteThreshold(threshold) {
    saveAppetite(threshold)
    set({ appetiteThreshold: threshold })
  },

  isRiskAboveAppetite(likelihood, impact) {
    const { appetiteThreshold } = get()
    const cell = appetiteThreshold.cells.find(c => c.likelihood === likelihood)
    if (!cell) return false
    return impact > cell.maxAcceptableImpact
  },
}))

// Ensure types are referenced (suppress unused import warnings)
void (undefined as unknown as RiskStatus)
