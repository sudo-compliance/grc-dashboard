# GRC Dashboard — Project Spec

## What this is
A local-first GRC intelligence tool. Users implement, track, and compare
GRC frameworks (ISO 27001, NIST CSF, PCI-DSS). Runs from dist/index.html
in any browser. No server required after `npm run build`.

## Stack
Vite 5 + React 18 + TypeScript + Tailwind CSS v3 + Recharts + Zustand +
React Router v6 (HashRouter) + Lucide React

## Key rules
1. Never use a backend. All state lives in localStorage via the persistence service.
2. All framework data is static JSON in src/data/. Never hardcode control data in components.
3. Routing is hash-based (HashRouter). Never use BrowserRouter.
4. TypeScript strict mode. No `any`. Always import types from src/types/index.ts.
5. Tailwind only — no inline styles except for dynamic values (e.g. percentage widths).
6. Always import Zustand stores from src/store/. Never duplicate state in components.
7. Control status values: "not-started" | "in-progress" | "implemented" | "not-applicable"
8. Risk ratings: likelihood 1-5 × impact 1-5 = score 1-25.
   Low: 1-5 | Medium: 6-12 | High: 13-19 | Critical: 20-25

## Design system
- Background: #0F1117 (charcoal)
- Surface: #1A1D27
- Border: rgba(255,255,255,0.08)
- Accent: #F59E0B amber (primary)
- Success / Implemented: #10B981 emerald
- Danger / Critical: #F43F5E rose
- Info / In Progress: #38BDF8 sky
- Display font: IBM Plex Mono (IDs, badges, numbers)
- Body font: Inter

## Data shape summary
Control:  { id, domain, domainCode, title, description, guidance, status, notes, evidence, lastUpdated? }
Risk:     { id, assetName, threat, vulnerability, likelihood, impact, score, riskLevel, treatment, owner, status, dateCreated }
Framework: { id, name, version, color, domains, controls }
CrosswalkMapping: { isoId, nistId[], pciId[], notes }

## File to check before editing
Always read src/types/index.ts and the relevant store before writing any component.

## Route map
/                    → Dashboard (home overview)
/framework/:id       → FrameworkDetail (ISO/NIST/PCI deep-dive)
/controls/:id        → ControlTracker (power table view)
/crosswalk           → Crosswalk (framework comparison matrix)
/risk                → RiskAssessment (register + heat map)
/settings            → Settings (import/export/reset)

## Framework IDs
iso27001 | nist-csf | pci-dss

## Status colour mapping
implemented     → emerald-500 bg + emerald-200 text
in-progress     → amber-500 bg + amber-200 text
not-started     → slate-700 bg + slate-300 text
not-applicable  → gray-600 bg + gray-400 text
low             → emerald-900 bg + emerald-300 text
medium          → amber-900 bg + amber-300 text
high            → orange-900 bg + orange-300 text
critical        → rose-900 bg + rose-300 text
