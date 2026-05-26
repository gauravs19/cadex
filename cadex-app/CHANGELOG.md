# CADEX Changelog

All notable changes to this project will be documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [0.5.0] — 2026-05-26

### Added
- **What-If Scenario Modeler** (`ScenarioModeler.tsx`) — collapsible panel on the Strategy step; lets users adjust individual axis scores (1–5 sliders) and deal parameters (engagement type, delivery model, industry, timezone overlap) to preview the hypothetical weighted total, score band, and strategy shift without saving to the deal
- **Work-type-specific risk questions** (`workTypeQuestions.ts`) — 33 domain-specific supplemental questions (section W) across 10 work categories (data, AI/ML, DX, ERP, cloud, migration, modernisation, integration, security, testing); automatically merged into the questionnaire and scorer when the relevant L3 work type is selected
- **Effort estimator benchmark** (`effortHeuristics.ts` + `EffortEstimator.tsx`) — read-only team composition panel in the Intake work-type section; looks up the closest effort profile by work category × duration × deal size and shows indicative team roles/FTE, sprint range, person-days, and blended daily rate benchmark
- **Work-category objection bank** (`objectionBank.ts`) — 33 domain-specific client objections with scripted rebuttals across 11 work categories; merged with strategy-level objections in both the Strategy step UI (up to 5 shown) and the proposal export (up to 3 shown)
- **Deal share link** — "Share deal" button in the Assessment header; compresses the full deal state with LZ-String and encodes it into a URL hash; recipient opens the link and the deal loads automatically; `dealIO.ts` handles encode/decode/copy/export/import
- **Deal JSON export/import** upgraded to use `dealIO.ts` helpers with typed error messages

### Changed
- `getAllQuestionsForDeal(workType?)` replaces direct `QUESTIONS` reference in `dealStore`, `ScorerStep`, and `Sidebar` — work-type questions are now included in scoring, question count, and the questionnaire UI
- `StrategyStep` objection section now shows up to 5 objections: strategy-level + work-category-specific
- `slideObjectionHandling` in proposal export now pulls up to 3 objections from strategy + category bank
- `CADEX_VERSION` bumped to `'0.5'` in dealStore
- `package.json` version bumped to `0.5.0`
- App.tsx: URL hash checked on load for shared deal (`deal=…`); hash cleared after import

### Fixed
- Industry axis weights were unused (Step 4.5 in `buildEffectiveWeights` now applies `INDUSTRY_MODIFIERS`)
- Scope Q&A answers were not feeding into axis scores (now wired via `applyScopeAnswerImpacts`)
- Proposal deck used generic content independent of deal data (now uses scope context, win themes, and objection bank)

---

## [0.4.0] — 2026-05-25 (initial push)

### Added
- Initial CADEX application — 7-step deal qualification tool
- 8-axis scoring engine with engagement type, pricing, work type, geography, and industry weight modifiers
- 6 strategy cards (A–F) with pitches, key moves, objections, and close scripts
- Win theme engine with 32-theme bank (`winThemeEngine.ts`)
- Pursuit timeline with 10 activities (`pursuitTimeline.ts`)
- 34-slide HTML proposal deck export (`proposalExport.ts`)
- Work-type scope question blocks with axis impact on high-risk selections
- Full work type taxonomy (L1/L2/L3) with 80+ work type nodes
- Deal Shaper, Checker, and Assumptions steps
