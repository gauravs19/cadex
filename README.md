# CADEX — Deal Intelligence for IT Consulting Presales

> Score risk. Match strategy. Shape the deal. Run the quality gate. Export the brief.

CADEX is a free, browser-only deal qualification framework for IT consulting presales, bid managers, and practice leads. It turns the gut-feel go/no-go process into a structured, auditable, 25-minute workflow — with no login, no backend, and no data leaving your device.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Live App](https://img.shields.io/badge/Live%20App-GitHub%20Pages-blue)](https://gauravs19.github.io/cadex/app/)
[![Version](https://img.shields.io/badge/version-0.6.0-green)](#)
[![Built with React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](#)

**[→ Launch the app](https://gauravs19.github.io/cadex/app/)** &nbsp;·&nbsp; **[→ Landing page](https://gauravs19.github.io/cadex/)**

---

## The Problem

| Without CADEX | With CADEX |
|---|---|
| Go/no-go decided by seniority and momentum | Scored risk profile with axis breakdown and hard blockers |
| Engagement model picked from habit | Algorithmic strategy match from 6 models |
| Scope risks live in the delivery lead's head | Ranked shaper levers with contract language |
| Quality review happens the day before submission | 42-point gate runnable at any stage |
| Deal context locked in someone's laptop | Shareable link · JSON export · A4 deal brief |

---

## Five-Step Workflow

```
01 Deal Intake  →  02 Risk Assessment  →  03 Strategy  →  04 Deal Shaper  →  05 Gate + Export
     ~5 min              ~15 min             ~2 min           ~5 min              ~10 min
```

**01 · Deal Intake** — Work type (L1→L2→L3, 40+ profiles), pricing model, competitive situation, compliance, partner ecosystem, delivery geography. Scope questions load per work type. Auto-risk signals fire on dangerous patterns.

**02 · Risk Assessment** — 60+ calibrated questions across 9 sections including work-type-specific questions for AI, security, ERP, migration, and cloud. Scores 8 weighted risk axes. Live radar chart.

**03 · Strategy Recommendation** — Algorithmic match to one of 6 engagement models. Full card: pitch language, key moves, contract non-negotiables, win themes, objection handlers, close script. What-If Scenario Modeler previews strategy shifts before you commit.

**04 · Deal Shaper** — Ranked levers (scope · commercial · governance · risk · relationship) each with a specific action and suggested contract language to protect delivery.

**05 · Deal Checker & Export** — 42-point quality gate across 9 sections. 5 hard blockers. Verdict: Go / Conditional Go / No-Go. Export a proposal deck, print-ready A4 brief, shareable link, or JSON.

---

## Features

### 8 Risk Axes

| Code | Axis | Key weight driver |
|---|---|---|
| SC | Scope Clarity | Heaviest on fixed-price |
| CM | Client Maturity | Elevated on greenfield |
| CR | Commercial Risk | Elevated on outcome/retainer |
| TC | Technical Complexity | Elevated on migration/modernisation |
| GR | Governance Readiness | No named PO = hard blocker |
| SV | Strategic Value | Informs no-bid threshold |
| CP | Competitive Position | Informs strategy selection |
| VF | Vendor Capability Fit | Internal only — hidden from exports |

Axis weights shift automatically by engagement type, pricing model, and work type. Four risk bands: **Green** ≥75% · **Amber** 50–74% · **Red** 25–49% · **Black** <25%.

### 6 Engagement Strategies

| | Strategy | Trigger |
|---|---|---|
| A | **Foundation First** | Scope clarity low / scope unvalidated |
| B | **Phased Commitment** | Large programme, high complexity |
| C | **Outcome Contract** | Strategic logo, strong partnership signal |
| D | **Scope-Locked MVP** | Agile-ready client, defined scope |
| E | **Hybrid T&M Cap** | Evolving scope, fixed budget |
| F | **No-Bid / Counter** | Black band, unresolved hard blockers |

### Work Type Taxonomy — 40+ profiles

Three-level hierarchy (L1 → L2 → L3). Each profile loads targeted scope questions, risk weights, effort benchmarks, and objection handlers.

```
Greenfield ──┬── Platform Engineering ──── Cloud Native · DevOps · API Platform …
             ├── Data & AI ────────────── Data Warehouse · GenAI · ML Platform …
             ├── ERP ──────────────────── S/4HANA · Oracle Fusion · D365 …
             ├── Digital Experience ────── Web App · Mobile · UX Design System …
             └── Quality Engineering ───── Test Automation · Performance …

Brownfield ──┬── Modernisation ──────────── Legacy Re-platform · Strangler Fig …
             ├── Migration ────────────────── Cloud Migration · Data Migration …
             ├── Security ─────────────────── VAPT · IAM · SIEM · Cloud Posture …
             ├── Integration ──────────────── API Integration · ESB/iPaaS …
             └── AMS ──────────────────────── Managed Services · L1/L2/L3 Support …
```

### 42-Point Deal Checker

9 sections · 5 hard blockers · per-section scoring · three-level verdict

Hard blockers (any fail = no-go):
- Margin is healthy at the quoted price
- A named, empowered Product Owner is confirmed
- Discovery phase included or scope independently validated
- Delivery lead has reviewed and signed off
- Comparable delivery history exists for this work type

### Export & Sharing

| Export | Format | How |
|---|---|---|
| Deal Brief | Print-ready A4 HTML | Blob URL, opens in new tab |
| Proposal Deck | 30-slide HTML, 16:9 | Blob URL, print-to-PDF |
| Share Link | URL with lz-string compressed state | Copy to clipboard |
| JSON Export | Full deal state | File download |
| JSON Import | Restore any exported deal | File picker or URL param |

---

## Tech Stack

| | |
|---|---|
| **Framework** | React 19 |
| **Language** | TypeScript — strict, `verbatimModuleSyntax` |
| **Build** | Vite 8 |
| **Styling** | Tailwind CSS 4 |
| **State** | Zustand 5 + `persist` middleware |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **URL compression** | lz-string |
| **Tests** | Playwright — 33 checks across 4 scenarios |
| **Deploy** | GitHub Pages (gh-pages branch) |

---

## Getting Started

### Use it online — no install needed

[**https://gauravs19.github.io/cadex/app/**](https://gauravs19.github.io/cadex/app/)

Works in any modern browser. Nothing is sent to a server.

### Run locally

```bash
git clone https://github.com/gauravs19/cadex.git
cd cadex/cadex-app
npm install
npm run dev          # → http://localhost:5173
```

### Build for production

```bash
npm run build        # tsc + vite build → dist/
npm run preview      # preview the production build locally
```

### Run E2E tests

```bash
npx playwright install chromium   # first time only
node test-scenarios.mjs           # 33 checks across 4 deal scenarios
```

---

## Project Structure

```
cadex/
├── cadex-app/                        # Vite + React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── intake/               # Accordion deal intake form
│   │   │   ├── scorer/               # Risk questionnaire + radar chart
│   │   │   ├── strategy/             # Strategy card + what-if modeler
│   │   │   ├── shaper/               # Ranked deal shaper levers
│   │   │   ├── checker/              # 42-point quality gate UI
│   │   │   ├── proposal/             # Proposal export step
│   │   │   └── layout/               # Sidebar navigation
│   │   ├── data/                     # All static content (TypeScript)
│   │   │   ├── questions.ts          # 60+ scorer questions with axis/section
│   │   │   ├── strategies.ts         # 6 strategy cards — full pitch content
│   │   │   ├── levers.ts             # Deal shaper lever definitions
│   │   │   ├── checklist.ts          # 42-point checker items + hard blockers
│   │   │   ├── workTypes.ts          # L1/L2/L3 taxonomy (40+ nodes)
│   │   │   ├── workTypeScopeQuestions.ts  # Per-work-type scope questions
│   │   │   ├── axisWeights.ts        # Weight tables per engagement type
│   │   │   ├── effortHeuristics.ts   # Team size / rate benchmarks
│   │   │   ├── objectionBank.ts      # Objection handlers per work type
│   │   │   └── discoveryGaps.ts      # Discovery gap checklist
│   │   ├── lib/                      # Pure logic — no React dependencies
│   │   │   ├── scorer.ts             # Axis scoring + weight application
│   │   │   ├── strategySelector.ts   # Strategy matching algorithm
│   │   │   ├── shaperEngine.ts       # Lever trigger + priority ranking
│   │   │   ├── checkerEngine.ts      # Quality gate evaluation
│   │   │   ├── winThemeEngine.ts     # Win theme selection (30-entry bank)
│   │   │   ├── autoSignals.ts        # Auto risk signal detection
│   │   │   ├── briefExport.ts        # A4 deal brief HTML generator
│   │   │   ├── proposalExport.ts     # 30-slide proposal deck generator
│   │   │   ├── dealIO.ts             # JSON import / export / share URL
│   │   │   └── timezoneCalc.ts       # Timezone overlap calculator
│   │   ├── pages/                    # Home.tsx · Assessment.tsx
│   │   ├── store/                    # Zustand deal store (persist)
│   │   └── types.ts                  # Shared TypeScript types (spec v0.4)
│   └── test-scenarios.mjs            # Playwright E2E tests
├── cadex-site/
│   ├── index.html                    # Landing page (self-contained)
│   └── brief.html                    # Sample deal brief
├── spec.md                           # Full product specification
└── GTM.md                            # Go-to-market research
```

---

## Architecture Notes

**Browser-only** — No backend, no database, no auth. State persists in `localStorage` via Zustand. Share links encode the full deal state in the URL with lz-string compression. Zero infrastructure cost, zero privacy risk, zero friction to try.

**Data as code** — All content (questions, strategies, levers, checklist items, work type profiles) lives in TypeScript files under `src/data/`. Auditable, diffable, and easy to extend without touching runtime logic.

**Engines are pure functions** — Everything in `src/lib/` takes typed inputs and returns typed outputs with no React or side-effect dependencies. They're independently testable and will be the integration point for a future AI advisor layer.

---

## Roadmap

- [ ] AI advisor layer — Claude API for deal narrative generation and risk explanation
- [ ] Discovery gap tracker — structured unknown register per work type
- [ ] Pursuit timeline — milestone planning from qualification to submission
- [ ] Multi-deal dashboard — compare risk profiles across active pipeline
- [ ] CRM export — Salesforce / HubSpot field mapping
- [ ] Team collaboration mode — shared deal state (requires lightweight backend)

---

## Contributing

The most useful contributions:

1. **New work type profiles** — Add L3 nodes to `src/data/workTypes.ts` with scope questions in `workTypeScopeQuestions.ts`
2. **New win themes** — Add entries to `THEME_BANK` in `lib/winThemeEngine.ts`
3. **New objection handlers** — Add to `src/data/objectionBank.ts`
4. **New checker items** — Add to `src/data/checklist.ts` with a section ID and optional `isHardBlocker: true`
5. **Bug fixes** — Run `node test-scenarios.mjs` after changes

Please open an issue before starting a large change.

---

## License

MIT — free to use, fork, and adapt.

If you find this useful, a ⭐ on the repo goes a long way.

---

*Built by a presales practitioner who got tired of qualifying deals in spreadsheets.*
