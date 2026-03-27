# GRC Intelligence Dashboard

A local-first, browser-based compliance tracking dashboard covering nine major security and privacy frameworks. Designed for GRC professionals, auditors, and security practitioners who need a single pane of glass for control implementation, evidence tracking, and cross-framework mapping — without cloud dependencies or subscription costs.

---

## Overview

Most compliance tooling sits behind SaaS paywalls, requires vendor onboarding, or stores sensitive audit data in third-party systems. This dashboard runs entirely in the browser using localStorage — no server, no account, no data leaving the machine. It is built to be cloned, built once, and used immediately.

Framework data, control statuses, evidence notes, and risk assessments are all persisted locally and exportable as JSON for backup or transfer.

---

## Frameworks Covered

| Framework | Version | Controls |
|---|---|---|
| ISO/IEC 27001 | 2022 | 93 |
| ISO/IEC 42001 | 2023 | 51 |
| NIST Cybersecurity Framework | 2.0 | 106 |
| PCI DSS | 4.0 | 260 |
| DORA | 2025 | 47 |
| CIS Controls | v8 | 153 |
| SOC 2 | 2017 (TSC) | 33 |
| UK GDPR | 2021 | 50 |
| Cyber Essentials | 2025 | 56 |

**Total: 849 controls** across all frameworks with cross-framework mapping via the built-in Crosswalk view.

---

## Features

- **Framework dashboards** — completion statistics, domain-level progress, and owner summaries for each framework
- **Control tracker** — per-control status (`not-started`, `in-progress`, `implemented`, `not-applicable`), evidence notes, owner assignment, and last-updated timestamps
- **Crosswalk** — maps ISO 27001 controls to equivalent controls across all other frameworks for gap analysis and audit evidence reuse
- **Risk assessment** — likelihood × impact scoring matrix (1–25) with risk register and treatment tracking
- **Statement of Applicability export** — generate SoA per framework filtered by implementation status
- **Data export** — full JSON export of all framework data, risk register, and activity log
- **Dark / light theme** — system-aware with manual toggle
- **PWA-ready** — installable as a desktop app via browser install prompt
- **Offline-first** — no network dependency after initial load

---

## Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS v3 + CSS custom properties |
| State | Zustand (localStorage-persisted) |
| Routing | React Router v6 (HashRouter) |
| Charts | Recharts |
| Icons | Lucide React |

---

## Getting Started

**Prerequisites:** Node.js 18+ and npm.

```bash
# Clone the repository
git clone https://github.com/sudo-compliance/grc-dashboard.git
cd grc-dashboard

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open `http://localhost:5173` in your browser.

**To build for offline use:**

```bash
npm run build
```

Open `dist/index.html` directly in any browser — no server required.

---

## Project Structure

```
src/
├── data/           # Static JSON control data for each framework
├── pages/          # Dashboard, FrameworkDetail, ControlTracker, Crosswalk, Risk, Settings
├── components/     # Reusable UI components and layout (Sidebar, TopBar, cards, charts)
├── store/          # Zustand stores (framework state, UI state)
├── services/       # localStorage persistence and data export
└── types/          # Shared TypeScript types
```

---

## Data & Privacy

All data is stored in `localStorage` on the local machine. Nothing is transmitted externally. The export function produces a `.json` file for backup or transfer between machines. To move your data to another device, export from Settings and import on the new machine.

---

## Alignment

This tool supports evidence collection and control tracking aligned to:

- **ISO/IEC 27001:2022**: Annex A controls, domain-level SoA, audit evidence logging
- **ISO/IEC 42001:2023**: AI management system controls and organisational context
- **NIST CSF 2.0**: Function and category-level implementation tracking
- **PCI DSS 4.0**: Requirement-level control status and evidence notes
- **DORA**: ICT risk and resilience control tracking
- **CIS Controls v8**: Safeguard tracking by Implementation Group (IG1/IG2/IG3)
- **SOC 2**: Trust Services Criteria evidence mapping
- **UK GDPR**: Article and principle-level compliance tracking
- **Cyber Essentials**: Technical control verification

---

## License

- Dashboard application code → **MIT**
- Framework content (control descriptions, guidance) → sourced from publicly available standards documentation

---

<p align="center">
  <em>"Cybersecurity is about people as much as controls — this tool aims to make compliance clear, trackable, and actionable."</em>
</p>
