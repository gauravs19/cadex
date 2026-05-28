# CADEX — Consulting Advisor & Deal EXecution Framework
## Product Specification v0.4

**Revised:** 2026-05-25  
**Author:** Gaurav Sharma  
**Status:** Draft — v0.4 (added 10 gap dimensions: competitive context, vendor fit, deal economics, change management, compliance, partner ecosystem, deal velocity, post-delivery, delivery geography, pricing model)

---

## 1. What This Is

CADEX is a **browser-based advisory tool** for presales and consulting teams. It walks a user through a structured deal assessment — capturing deal signals, scoring risk across six dimensions, recommending an engagement strategy, coaching the team on how to shape and pitch the deal, and producing a shareable summary for delivery handoff.

**No backend. No database. No login.** State lives in the browser (localStorage) and can be exported as JSON or printed as a PDF-ready summary.

---

## 2. Revised Scope — What's In vs Out for MVP

### In (MVP)
| Module | Description |
|--------|-------------|
| Deal Intake | Quick deal context capture |
| Risk Scorer | 6-axis assessment via guided questionnaire |
| Strategy Selector | Auto-recommended engagement model with rationale |
| Deal Shaper | Prioritised lever list tailored to this deal's risk profile |
| Deal Checker | 30-point pre-proposal quality gate with Go/No-Go output |
| Inline Coaching | Contextual guidance at every step — the "why this matters" layer |
| Export & Share | JSON export, import, print-to-PDF, shareable URL |

### Out (Post-MVP)
| Feature | Why Deferred |
|---------|-------------|
| Playbook Library (full) | Playbook content surfaced inline in Strategy step instead |
| Artifact generator (PDF templates) | Browser print covers MVP need |
| Multi-user / team collaboration | No DB — single-session tool for now |
| CRM integration | Phase 3 |
| AI advisory layer | Phase 2 |
| Deal pipeline dashboard | Needs persistence layer — Phase 2 |

---

## 3. UX Model — How It Works

### 3.1 Interaction Pattern

CADEX is a **single-page wizard** with a persistent left sidebar showing progress. The user moves through 5 steps in sequence, but can jump back to any completed step.

```
┌──────────────────┬────────────────────────────────────────┐
│  CADEX           │                                        │
│  ─────────────   │         MAIN CONTENT AREA              │
│  ① Intake   ●   │                                        │
│  ② Score    ●   │  (Active step renders here)            │
│  ③ Strategy  ○  │                                        │
│  ④ Shape     ○  │                                        │
│  ⑤ Check     ○  │                                        │
│                  │                                        │
│  [New Deal]      │                                        │
│  [Load Deal]     │                                        │
│  [Export]        │                                        │
└──────────────────┴────────────────────────────────────────┘
```

### 3.2 Three Entry Modes

| Mode | Description | Time |
|------|-------------|------|
| **Full Assessment** | All 5 steps, full questionnaire | 25–40 min |
| **Quick Score** | Intake + abbreviated 12-question scorer only | 5–8 min |
| **Checker Only** | Jump straight to Deal Checker (deal already assessed) | 10 min |

### 3.3 The Coaching Layer

Every screen has a collapsible **"Why This Matters"** panel that surfaces relevant consulting guidance — the article content from our earlier discussion, embedded as contextual coaching. This turns CADEX from a form-filler into an advisor.

Examples:
- Scope Clarity axis question → "Teams that skip scope assumptions create the #1 source of fixed-price disputes..."
- Governance score low → "No named Product Owner is the single biggest delivery failure mode in agile fixed engagements..."
- Strategy F triggered → "Walking away from a deal structured to fail is not losing — it's protecting your reputation..."

### 3.4 Live Feedback

The risk radar chart updates in real-time as the user answers questions. They see the shape of their deal forming — which axes are weak — before they finish the questionnaire.

---

## 4. State & Persistence (No DB)

### 4.1 How State Works

All deal state is a single JSON object. It lives in:

1. **Memory** — React state while the session is active
2. **localStorage** — Auto-saved on every change (keyed by deal ID)
3. **Export** — User can download as `cadex-deal-<name>.json`
4. **Import** — User can load any previously exported JSON file
5. **URL** — Optional: state compressed and encoded in URL hash for easy sharing

### 4.2 Deal State Shape

```typescript
type Deal = {
  id: string                    // uuid, generated on creation
  meta: DealMeta                // intake data (all fields including new gaps)
  assessment: Assessment        // questionnaire responses + 8-axis scores
  strategy: StrategyResult      // recommended strategy + rationale + competitive modifier
  shaperLevers: Lever[]         // prioritised lever recommendations
  checklist: ChecklistResult    // 42-point check results + Go/No-Go
  createdAt: string
  updatedAt: string
  version: string               // spec version, for future migration
}

type DealMeta = {
  // core fields
  name: string
  clientName: string
  engagementType: EngagementType
  dealOrigin: DealOrigin
  industry: Industry
  dealSize: DealSize
  duration: Duration
  deliveryModel: DeliveryModel
  scopeSummary: string
  // work type
  projectNature: 'greenfield' | 'brownfield'
  workCategory: string
  workType: string
  // pricing model (Gap 10)
  pricingModel: PricingModel
  // competitive context (Gap 1)
  competitiveSituation: CompetitiveSituation
  incumbentVendor: string
  competitorsKnown: boolean
  winProbability: WinProbability
  // deal velocity (Gap 7)
  salesStage: SalesStage
  proposalDeadline: string        // ISO date
  budgetApprovalStatus: BudgetStatus
  presalesEffortInvested: EffortBand
  // regulatory & compliance (Gap 5)
  dataClassification: DataClass[]
  applicableFrameworks: ComplianceFramework[]
  dataResidencyRequired: ResidencyRequirement
  securityCertRequired: CertRequirement
  // partner & ecosystem (Gap 6)
  technologyPartners: TechPartner[]
  ourRole: ContractRole
  otherSIsInvolved: SIInvolvement
  partnerCertDependency: CertDependency
  // delivery geography (Gap 9)
  clientTimezone: TimezoneRegion
  deliveryTimezones: TimezoneRegion[]
  timezoneOverlapHours: number    // auto-calculated
  inCountryRequired: InCountryRequirement
  languageRequirements: LanguageRequirement
}

type Assessment = {
  responses: Record<QuestionId, number>   // 1–5 per question
  axisScores: {
    SC: number    // Scope Clarity
    CM: number    // Client Maturity
    CR: number    // Commercial Risk
    TC: number    // Technical Complexity
    GR: number    // Governance Readiness
    SV: number    // Strategic Value
    CP: number    // Competitive Position (new)
    VF: number    // Vendor Capability Fit (new — internal)
  }
  weightedTotal: number           // 0–100%
  scoreBand: 'green' | 'amber' | 'red' | 'black'
  criticalFlags: string[]         // axis=1 warnings, hard triggers
  completedAt: string
}
```

### 4.3 localStorage Schema

```
cadex:deals              → string[]           // list of deal IDs
cadex:deal:<id>          → serialized Deal    // each deal
cadex:settings           → UserSettings       // mode preferences, etc.
```

### 4.4 Export / Import / Share

- **Export JSON** — downloads `cadex-<dealname>-<date>.json`
- **Import JSON** — file picker, validates schema before loading
- **Share URL** — compresses deal state to base64, appends to URL hash. Anyone with the link can view (read-only) or clone the deal.
- **Print** — browser print with a print stylesheet that renders a clean 2–3 page summary (no sidebar, no buttons)

---

## 5. Module Specifications

### 5.1 Module 1: Deal Intake

**Purpose:** Capture the deal signal in under 3 minutes.

**Fields:**

| Field | Type | Options |
|-------|------|---------|
| Deal name | Text | Free text |
| Client name | Text | Free text |
| Engagement type | Select | Fixed/Agile · Fixed/Scope · T&M · Outcome · Hybrid |
| Deal origin | Select | RFP/RFQ · Sole-source · Account expansion · New logo |
| Industry | Select | BFSI · Healthcare · Manufacturing · Retail · Tech · Public Sector · Other |
| Deal size | Select | <$100K · $100K–500K · $500K–2M · $2M+ |
| Duration | Select | <3 months · 3–6 months · 6–12 months · 12+ months |
| Delivery model | Select | Onshore · Nearshore · Offshore · Hybrid |
| Scope summary | Textarea | 500 char max |

**Pricing Model** (Gap 10 — explicit, not implied by engagement type)

| Field | Type | Options |
|-------|------|---------|
| Pricing model | Select | Fixed Price · Time & Materials · T&M with Cap · Retainer / Subscription · Outcome / Value-Based · Staff Augmentation |

> Pricing model is distinct from engagement type. A Fixed/Agile engagement can be priced as Fixed Price OR T&M with Cap. The combination drives strategy and lever recommendations.

---

**Competitive Context** (Gap 1)

| Field | Type | Options |
|-------|------|---------|
| Competitive situation | Select | Sole-source · Preferred vendor (2–3 finalists) · Open competition (4+ vendors) · Unknown |
| Incumbent vendor | Text | Free text (or "None" / "Unknown") |
| Are competitors known? | Select | Yes — named · Suspected · Unknown |
| Our win probability (self-assessed) | Select | >70% · 40–70% · <40% · Unknown |

> A sole-source deal with a strong relationship warrants a different proposal posture — and different pricing risk tolerance — than a 5-vendor competitive RFP. This field directly changes the strategy recommendation and shaper lever priorities.

---

**Deal Velocity & Pursuit Stage** (Gap 7)

| Field | Type | Options |
|-------|------|---------|
| Sales stage | Select | Awareness · Qualification · Proposal · Negotiation |
| Proposal / RFP deadline | Date | Date picker |
| Budget approval status | Select | Approved · Pending approval · Not yet requested · Unknown |
| Presales effort invested so far | Select | <1 day · 1–5 days · 1–2 weeks · >2 weeks |

> Sales stage drives the recommended entry mode. A deal in Qualification → Quick Score first. A deal in Proposal stage with 3 days to deadline → Checker Only, immediately.

---

**Regulatory & Compliance** (Gap 5 — elevated from questionnaire to intake)

| Field | Type | Options |
|-------|------|---------|
| Data classification | MultiSelect | PII · PHI / Health · Financial / PCI · Classified / Government · IP-Sensitive · No sensitive data |
| Applicable frameworks | MultiSelect | GDPR · HIPAA · PCI-DSS · SOC 2 · ISO 27001 · FedRAMP · FDA 21 CFR · DPDP (India) · None identified |
| Data residency requirement | Select | Yes — in-country · Yes — regional · No restriction · Unknown |
| Security certification required | Select | Yes (pen test / audit mandated) · Likely · No · Unknown |

> Compliance scope is non-negotiable fixed scope — it cannot be traded in MoSCoW. Any PII, PHI, or regulated data classification auto-elevates the Technical Complexity and Commercial Risk axes. Unpriced compliance work is the silent margin destroyer on enterprise deals.

---

**Partner & Ecosystem** (Gap 6)

| Field | Type | Options |
|-------|------|---------|
| Technology partner involved | MultiSelect | Microsoft · AWS · Google Cloud · SAP · Salesforce · ServiceNow · Oracle · None · Other |
| Our role | Select | Prime contractor · Subcontractor · Co-prime · Unknown |
| Other SIs / vendors involved | Select | Yes — known · Yes — unknown scope · No · Unknown |
| Partner certification / discount dependency | Select | Yes — required · Nice to have · No |

---

**Delivery Geography** (Gap 9 — elevated from single field to full dimension)

| Field | Type | Options |
|-------|------|---------|
| Client timezone region | Select | Americas · Europe/UK · Middle East/Africa · South Asia · East Asia/Pacific |
| Delivery team timezone region | MultiSelect | Americas · Europe/UK · Middle East/Africa · South Asia · East Asia/Pacific |
| Net timezone overlap (calculated) | Display | Auto-calculated from above: e.g. "IST–UK = 4.5hr overlap" |
| In-country presence required | Select | Yes — contractual · Yes — preferred · No |
| Language / localisation requirements | Select | English only · English + one regional · Multiple languages · Unknown |

> Offshore agile fixed-price projects with <3 hours of timezone overlap have a fundamentally higher governance risk than onshore. A daily stand-up across 9 time zones is not the same meeting. The calculated overlap auto-adjusts the Governance Readiness axis weight.

---

**Work Type** — hierarchical selector (see Section 5.1a below for full taxonomy)

| Level | Field | Type |
|-------|-------|------|
| L1 | Project Nature | Select: Greenfield · Brownfield |
| L2 | Work Category | Select: depends on L1 |
| L3 | Work Type | Select: depends on L2 |

---

### 5.1a Work Type Taxonomy

This is the core classification hierarchy. It drives:
- Risk axis weight adjustments (Section 5.2)
- Questionnaire section emphasis
- Strategy selector rules
- Coaching content selection
- Checklist item relevance

---

#### L1: Project Nature

| Value | Definition |
|-------|-----------|
| **Greenfield** | Building from scratch — no legacy systems, no existing codebase, no incumbent vendor. Constraints are primarily about clarity of vision and build quality. |
| **Brownfield** | Building on, around, or replacing something that already exists. Constraints include legacy debt, data quality, integration complexity, and organisational inertia. |

> **Why this matters:** Brownfield projects carry a hidden complexity premium. The "unknown unknowns" of legacy systems, undocumented integrations, and political resistance to change routinely double effort estimates. Greenfield projects fail for different reasons — unclear vision, shifting requirements, and scope inflation as the blank-canvas effect kicks in.

---

#### L2 + L3: Work Category & Type

```
GREENFIELD
├── Digital Experience (DX)
│   ├── Customer Portal / Self-Service
│   ├── Consumer Mobile App
│   ├── Web Application / SPA
│   ├── E-Commerce / Digital Commerce
│   └── Omnichannel / Phygital
│
├── Product Engineering (PE)
│   ├── SaaS Product (B2B or B2C)
│   ├── Embedded / IoT Product
│   ├── API / Platform Product
│   ├── Developer Tool / SDK
│   └── AI / ML Product
│
├── Platform & Infrastructure
│   ├── Data Platform / Lakehouse
│   ├── Integration / API Gateway Layer
│   ├── Cloud-Native Infrastructure
│   ├── DevSecOps Platform
│   └── IoT / Edge Platform
│
└── Greenfield AI / Analytics
    ├── AI Feature Integration (into new product)
    ├── Analytics Platform (new)
    ├── ML Pipeline (new)
    └── Generative AI Application

BROWNFIELD
├── Migration
│   ├── Cloud Migration (lift & shift / re-host)
│   ├── Re-platforming (same function, new platform)
│   ├── Data Migration
│   ├── ERP / CRM Migration (SAP, Salesforce, Oracle)
│   └── Infrastructure Migration (DC exit / colocation)
│
├── Modernisation
│   ├── Legacy Re-architecture (monolith → microservices)
│   ├── Cloud-Native Refactoring
│   ├── UI / UX Modernisation (legacy frontend)
│   ├── API-enabling Legacy Systems
│   └── Tech Stack Upgrade (framework / language version)
│
├── Integration & Interoperability
│   ├── System Integration (ESB / middleware)
│   ├── Third-Party / SaaS Integration
│   ├── Data Integration / ETL Modernisation
│   └── B2B / Partner Integration
│
├── AI / Analytics on Existing Systems
│   ├── AI Layer on Existing Product
│   ├── Predictive Analytics on Existing Data
│   ├── Process Automation (RPA / intelligent automation)
│   └── Observability / AIOps
│
└── Application Management & Support (AMS)
    ├── Run & Maintain (steady-state support)
    ├── Enhancements & Minor Dev
    ├── Incident & Problem Management
    └── Managed Testing / QA
```

---

#### Risk Profile by Work Type

Each combination of L1/L2/L3 has a distinct inherent risk signature. This table shows which axes are **elevated** (E), **standard** (S), or **lower** (L) by default for each major category — before the questionnaire adjusts them.

| Work Type | SC | CM | CR | TC | GR | SV | Key Risk |
|-----------|----|----|----|----|----|----|---------|
| **DX — Consumer App** | E | S | S | S | S | S | Scope inflation (blank canvas effect) |
| **DX — Customer Portal** | E | S | S | S | E | S | Stakeholder alignment across business units |
| **DX — E-Commerce** | E | S | E | E | S | S | Integration with payments, ERP, inventory |
| **PE — SaaS Product** | S | E | S | S | E | E | Product vision drift, PO engagement |
| **PE — Embedded/IoT** | S | S | S | E | S | S | Hardware dependencies, irreversible decisions |
| **PE — AI/ML Product** | E | E | S | E | S | S | Exploratory nature, data dependency |
| **Platform — Data** | E | S | S | E | S | S | Data quality, schema drift |
| **Migration — Cloud** | S | S | S | E | S | S | Discovery gaps in existing estate |
| **Migration — ERP/CRM** | E | S | E | E | E | S | Customisation debt, change management |
| **Migration — Data** | E | S | S | E | S | S | Data quality, lineage, volume surprises |
| **Modernisation — Re-arch** | E | S | S | E | S | S | Scope of legacy debt unknown until inside |
| **Modernisation — Cloud-Native** | S | S | S | E | S | S | Architectural decisions are hard to reverse |
| **Integration** | E | S | S | E | E | S | Undocumented APIs, legacy system behaviour |
| **AI on Existing** | E | E | S | E | S | S | Data readiness, model accuracy expectations |
| **AMS** | S | S | E | S | E | S | Scope of "support" creep, SLA definition |

> **E = Elevated risk axis** — weight this axis higher in scoring  
> **S = Standard** — use default weight  
> **L = Lower** — weight this axis lower for this work type

---

#### Coaching Notes by Work Type

These appear as coaching panels in the Risk Scorer when the work type is identified:

**Greenfield / DX:**
> "Blank canvas projects suffer from scope inflation — every stakeholder has a feature idea and none feel urgent enough to cut. The first job in a DX presales engagement is not to estimate the build, it's to define what NOT to build."

**Greenfield / PE (SaaS/Product):**
> "Product engineering engagements live or dies on the Product Owner. If the client doesn't have a strong, empowered PO who can make daily decisions, velocity will stall waiting for prioritisation. This is the governance risk that silently kills PE fixed deals."

**Brownfield / Migration:**
> "The #1 cause of migration project overruns is discovery gaps — things nobody knew existed in the legacy estate. Every migration proposal should include a mandatory discovery sprint. The question is not whether there will be surprises, but how fast you can surface them."

**Brownfield / ERP/CRM Migration:**
> "ERP migrations are organisational change programmes dressed as IT projects. The technical work is rarely the hard part. Scope creep comes from business process re-design, change resistance, and customisation debt that wasn't visible until cut-over. Price the change management, not just the migration."

**Brownfield / Modernisation:**
> "Legacy re-architecture is the most scope-unpredictable work in the industry. Teams consistently underestimate the interconnectedness of legacy systems. Use the strangler-fig pattern where possible — isolate, replace, retire — and price each phase separately."

**Brownfield / AMS:**
> "'Application management' sounds simple until the client's definition of support includes feature development. Scope the 'run' clearly upfront. The most common AMS dispute is whether something is an enhancement (new scope) or a fix (in scope). Define the boundary in the contract."

**AI / ML (any):**
> "AI and ML projects are inherently exploratory — you don't know if the model will work until you try it with real data. Fixed-price AI projects need special handling: fix the process (sprints, experiments, review gates), not the outcome. A fixed-price commitment to model accuracy is almost always a mistake."

---

#### How Work Type Modifies the Risk Scorer

When a work type is selected in Intake, the scorer engine applies a **work type modifier** to the base axis weights:

```typescript
type WorkTypeModifier = {
  SC: number   // multiplier on Scope Clarity weight
  CM: number   // multiplier on Client Maturity weight
  CR: number   // multiplier on Commercial Risk weight
  TC: number   // multiplier on Technical Complexity weight
  GR: number   // multiplier on Governance Readiness weight
  SV: number   // multiplier on Strategic Value weight
  // additional questions unlocked for this work type
  additionalQuestions: QuestionId[]
  // questions suppressed as not relevant
  suppressedQuestions: QuestionId[]
}
```

Example modifier for **ERP Migration:**
```typescript
{
  SC: 1.3,   // scope clarity is critical — ERP scope grows fast
  CM: 1.0,
  CR: 1.2,   // commercial risk elevated — ERP budgets blow
  TC: 1.4,   // technical complexity very high
  GR: 1.3,   // governance critical — business change management
  SV: 1.0,
  additionalQuestions: ['ERP1', 'ERP2', 'ERP3'],  // ERP-specific questions
  suppressedQuestions: ['F4']  // CI/CD maturity less relevant for ERP
}
```

---

#### Work Type — Additional Questions

Some work types unlock additional questions in the scorer. These are appended after the relevant section.

**Migration (all types) — added to Section F:**
- **M1.** Has a discovery/assessment of the existing estate been completed?  
  `1=No discovery done · 2=High-level inventory only · 3=Partial discovery · 4=Most systems documented · 5=Full discovery completed`
- **M2.** Are there known customisations in the legacy system that will need to be re-built?  
  `1=Many, undocumented · 2=Many, partially known · 3=Some, mostly known · 4=Few, well documented · 5=None / standard configuration`
- **M3.** Is there a cut-over / go-live strategy defined?  
  `1=No plan · 2=Big-bang assumed · 3=Big-bang planned · 4=Phased / parallel run considered · 5=Phased plan defined and agreed`

**Modernisation — added to Section F:**
- **MOD1.** Has a technical assessment of the legacy codebase been completed?  
  `1=No assessment · 2=High-level review only · 3=Partial assessment · 4=Mostly assessed · 5=Full assessment with effort estimate`
- **MOD2.** Is the legacy system being run in parallel during modernisation?  
  `1=No plan for parallel run · 2=Parallel run considered · 3=Short parallel run planned · 4=Extended parallel run planned · 5=Strangler-fig / incremental cutover planned`

**AI / ML — added to Section F:**
- **AI1.** Is the training data available, accessible, and of sufficient quality?  
  `1=Data doesn't exist yet · 2=Exists but poor quality · 3=Exists, quality unknown · 4=Available, moderate quality · 5=Available, clean, labelled`
- **AI2.** Are model accuracy / performance expectations defined and realistic?  
  `1=No expectations defined · 2=Vague ("it should be good") · 3=Defined but likely unrealistic · 4=Defined and benchmarked · 5=Defined, benchmarked, and contractually reasonable`

**AMS — replaces/modifies Section B:**
- **AMS1.** Is the scope of "support" clearly differentiated from "enhancements"?  
  `1=No distinction · 2=Informal distinction · 3=Rough guidelines exist · 4=Defined in SLA · 5=Contractually defined with examples`
- **AMS2.** Is there a ticket / incident volume baseline from the current state?  
  `1=No baseline data · 2=Rough estimate only · 3=Partial data · 4=Good baseline · 5=Full historical data with trend analysis`

---

**Auto-signals on intake completion:**
- RFP + Fixed/Scope + >$1M → flag: "High-scrutiny deal — full assessment recommended"
- New logo + no prior relationship → flag: "New client — complete Section G of questionnaire"
- Fixed/Agile + <3 months → flag: "Compressed timeline — Timeline axis will be weighted higher"
- PII / PHI / Financial data selected → flag: "Regulated data — compliance scope must be priced explicitly. TC and CR axes auto-elevated."
- Open competition + win probability <40% → flag: "Low win probability — consider Quick Score only before investing further presales effort"
- Sales stage = Proposal + deadline <5 days → flag: "Deadline pressure — recommend Checker Only mode immediately"
- Subcontractor role → flag: "You are not the prime — governance and commercial risk profile changes significantly"
- Net timezone overlap <3 hours → flag: "Low timezone overlap — Governance axis auto-elevated. Asynchronous agile is high-risk on fixed deals."
- Staff Augmentation pricing + Fixed/Agile engagement → flag: "Pricing model / engagement type mismatch — confirm with client before proceeding"

**Coaching tip shown:**
> "The engagement type you select here changes which risk axes matter most. A Fixed/Agile deal lives or dies on governance and scope clarity. A T&M deal's biggest risk is commercial — runaway spend and scope disputes."

---

### 5.2 Module 2: Risk Scorer

**Purpose:** Score the deal across 6 axes through a guided questionnaire. Produce a risk profile and overall score band.

#### The 8 Axes & Their Weights

Two axes added in v0.4: **Competitive Position (CP)** and **Vendor Capability Fit (VF)**.  
CP assesses deal winability and the implications of the competitive context.  
VF assesses our own readiness to deliver — the vendor-side risk that the 6-axis model ignored entirely.

| Axis | Code | Weight (Fixed/Agile) | Weight (T&M) | Weight (Outcome) | Weight (Staff Aug) |
|------|------|---------------------|--------------|-----------------|-------------------|
| Scope Clarity | SC | 22% | 12% | 18% | 5% |
| Client Maturity | CM | 18% | 13% | 22% | 10% |
| Commercial Risk | CR | 18% | 22% | 18% | 25% |
| Technical Complexity | TC | 13% | 18% | 13% | 15% |
| Governance Readiness | GR | 13% | 13% | 13% | 20% |
| Strategic Value | SV | 5% | 8% | 5% | 10% |
| Competitive Position | CP | 6% | 8% | 6% | 10% |
| Vendor Capability Fit | VF | 5% | 6% | 5% | 5% |

> **CP — Competitive Position:** How well-positioned are we to win, and does the competitive context create pricing or relationship risks?  
> **VF — Vendor Capability Fit:** Do we have the right skills, people, references, and capacity to deliver this deal? This is the vendor-side mirror of client maturity — equally important, systematically ignored in most presales processes.

*(Weights adjust automatically based on engagement type selected in Intake)*

#### Score Bands

| Band | Weighted Score | Label | Colour |
|------|---------------|-------|--------|
| Green | 75–100% | Proceed | #22c55e |
| Amber | 50–74% | Condition | #f59e0b |
| Red | 25–49% | Restructure | #ef4444 |
| Black | 0–24% | No-Bid | #1f2937 |

**Hard rules (override score):**
- Governance axis < 2/5 → minimum band: Red, regardless of total
- Any axis = 1/5 → flag as critical, shown prominently

#### Questionnaire — Full Version (40 questions across 7 sections)

Questions map to axes. Each answer is a 1–5 scale (displayed as radio buttons with plain-language labels, not raw numbers).

---

**SECTION A — Client Agile Maturity** *(→ Axis: CM)*

**A1.** Has the client run agile / scrum projects before?  
`1=Never heard of it · 2=Aware but untested · 3=Tried it, mixed results · 4=Regular practitioner · 5=Outcome-led, mature`

**A2.** Is there a named, available, empowered Product Owner identified?  
`1=No PO exists · 2=Name TBD · 3=Named but part-time · 4=Named and available · 5=Named, available, and empowered to decide`

**A3.** How does the client handle changing requirements mid-project?  
`1=Change = contract dispute · 2=Formal CRs with long cycle · 3=Process exists but slow · 4=Fast-track CRs in place · 5=Backlog is jointly owned and fluid`

**A4.** How does the client measure project success?  
`1=100% of features delivered · 2=Features + on-time · 3=Features + quality · 4=Business KPIs · 5=Outcomes and value delivered`

**A5.** Is the client comfortable with iterative / incremental delivery?  
`1=Expects big-bang delivery · 2=Open to it but nervous · 3=Has done it before · 4=Prefers it · 5=Actively demands it`

---

**SECTION B — Scope Clarity & Stability** *(→ Axis: SC)*

**B1.** Does a written requirements document, user story map, or feature list exist?  
`1=Nothing documented · 2=High-level notes only · 3=Feature list, no stories · 4=User stories, some gaps · 5=Complete, prioritised, agreed`

**B2.** How complete and stable is the current scope?  
`1=Very early, lots will change · 2=Directionally clear but volatile · 3=About 60% stable · 4=Mostly stable, minor changes expected · 5=Stable and signed off`

**B3.** How many third-party / external system dependencies exist?  
`1=5+ undocumented dependencies · 2=3–4 dependencies, partially known · 3=2–3 known dependencies · 4=1 known dependency · 5=No external dependencies`

**B4.** Have all key stakeholders aligned on the requirements?  
`1=One team's view, others unknown · 2=Some alignment, disputes expected · 3=Mostly aligned · 4=Aligned with minor gaps · 5=Full stakeholder sign-off`

**B5.** Are there non-negotiable regulatory / compliance requirements?  
`1=Yes, multiple, undocumented · 2=Yes, partially mapped · 3=Yes, mapped but not costed · 4=Yes, mapped and costed · 5=None, or fully handled`

**B6.** If forced to cut 20% of scope to hit the deadline — can the client prioritise?  
`1=No — all features are equal priority · 2=Unlikely — political sensitivity · 3=Possible with effort · 4=Yes, rough priority exists · 5=Yes — MoSCoW already done`

**B7.** What happens when new requirements emerge mid-project?  
`1=Added to scope without negotiation · 2=Argued about and usually added · 3=Assessed case by case · 4=Swap mechanism in place · 5=Backlog-managed, no surprises`

---

**SECTION C — Budget & Commercial** *(→ Axis: CR)*

**C1.** How was the budget number arrived at?  
`1=Gut feel / political number · 2=Benchmark from similar project · 3=Business case estimate · 4=Detailed estimation done · 5=Independently validated`

**C2.** Is the budget ceiling hard or flexible?  
`1=Hard ceiling, no flexibility · 2=Hard ceiling, outcome uncertain · 3=Some flex if scope is adjusted · 4=Flexible with justification · 5=Value-based — budget follows outcomes`

**C3.** Is there a contingency budget set aside?  
`1=No contingency exists · 2=Contingency discussed but not allocated · 3=Small contingency (<5%) · 4=Standard contingency (10–15%) · 5=Healthy contingency (>15%)`

**C4.** What is the payment structure?  
`1=100% on final feature delivery · 2=Milestone-based, features-linked · 3=Milestone-based, phase-linked · 4=Time-based / monthly · 5=Outcome-based / value-linked`

**C5.** What is the cost of NOT delivering on time?  
`1=No real business consequence · 2=Minor inconvenience · 3=Moderate impact · 4=Significant revenue or compliance impact · 5=Catastrophic — regulatory, contractual, or market loss`

---

**SECTION D — Timeline & Urgency** *(→ Axis: SC + CR)*

**D1.** Is the deadline fixed by a real business event or aspirational?  
`1=Aspirational / "would like it by then" · 2=Internal preference · 3=Linked to internal initiative · 4=Linked to external commitment · 5=Hard external event (regulatory, contract, product launch)`

**D2.** What is the consequence of missing the target date by 4–6 weeks?  
`1=Nothing changes · 2=Minor stakeholder dissatisfaction · 3=Project re-scoping needed · 4=Significant commercial impact · 5=Contractual penalty or missed market window`

**D3.** Are there downstream projects or initiatives dependent on this delivery?  
`1=5+ dependencies · 2=3–4 dependencies · 3=1–2 dependencies · 4=One dependent, manageable · 5=No downstream dependencies`

---

**SECTION E — Governance & Decision-Making** *(→ Axis: GR)*

**E1.** Who is the ultimate decision-maker on the client side?  
`1=Unknown / committee with no clear lead · 2=Committee, decisions take weeks · 3=Named sponsor, available monthly · 4=Named sponsor, available weekly · 5=Named, senior, available same-day`

**E2.** How quickly can the client turn around scope and design decisions?  
`1=Weeks · 2=1–2 weeks · 3=3–5 days · 4=1–2 days · 5=Same day`

**E3.** What is the deliverable sign-off process?  
`1=Multi-layer, no defined SLA · 2=Multi-layer, slow · 3=Single approver, slow · 4=Single approver, fast · 5=Defined SLA, empowered approver`

**E4.** Will the client have a dedicated person attending sprint reviews?  
`1=No — "send us a report" · 2=Maybe, not confirmed · 3=Yes, someone will attend · 4=Yes, the PO will attend · 5=Yes, PO + stakeholders attend and decide`

**E5.** Is there a defined change request process with a turnaround SLA?  
`1=No process · 2=Informal process · 3=Formal but slow (>1 week) · 4=Formal and fast (<3 days) · 5=Fast-track CR in contract with defined SLA`

---

**SECTION F — Technical & Integration Landscape** *(→ Axis: TC)*

**F1.** How well are existing systems documented and accessible?  
`1=Undocumented legacy, inaccessible · 2=Partially documented, hard to access · 3=Documented, some gaps · 4=Well documented · 5=Fully documented with sandbox access`

**F2.** How clean is the data that needs to be migrated or integrated?  
`1=Unknown quality, no audit done · 2=Known quality issues, significant cleanup needed · 3=Moderate issues, manageable · 4=Minor issues · 5=No migration needed / data is clean`

**F3.** Who owns and controls the infrastructure?  
`1=Third party, uncontactable · 2=Third party, slow to respond · 3=Client team, limited resource · 4=Client team, adequate resource · 5=Vendor-managed or greenfield`

**F4.** What is the client's current CI/CD and testing maturity?  
`1=No CI/CD, no automated tests · 2=Basic CI, manual testing · 3=CI in place, some automation · 4=Full CI/CD, good coverage · 5=Full CI/CD, high coverage, shift-left QA`

**F5.** Are there hard non-functional requirements (performance, security, compliance)?  
`1=Yes, multiple, undocumented · 2=Partially documented · 3=Documented, not yet designed for · 4=Documented and designed for · 5=None beyond standard, or fully handled`

---

**SECTION G — Relationship & Partnership Readiness** *(→ Axis: CM + SV)*

**G1.** What is the nature of the existing relationship with this client?  
`1=No relationship, cold RFP · 2=Aware of us, first engagement · 3=Worked together on 1–2 small projects · 4=Established relationship, some trust · 5=Strategic partner, high trust`

**G2.** How does the client prefer to handle issues when they arise?  
`1=Formally, via written notice · 2=Escalate immediately to legal · 3=Escalate to management · 4=Direct conversation · 5=Open and early, as a team`

**G3.** Is the client open to the vendor flagging scope risk early, even if uncomfortable?  
`1=Shoot-the-messenger culture · 2=Skeptical but open · 3=Neutral · 4=Welcomes it · 5=Actively demands it`

**G4.** What is the strategic value of this client / deal?  
`1=One-off, low renewal potential · 2=Small account, limited growth · 3=Fits portfolio, some renewal likely · 4=Key account or logo value · 5=Platform deal, multi-year, strategic`

---

---

**SECTION H — Competitive Context** *(→ Axis: CP)*

**H1.** How many vendors are competing for this deal?  
`1=5+ unknown vendors · 2=3–4 vendors, we're not differentiated · 3=2–3 vendors, some differentiation · 4=1–2 vendors, strong differentiation · 5=Sole-source or heavily preferred`

**H2.** How strong is our relationship with the key decision-maker?  
`1=No relationship, cold · 2=Aware of us, no prior work · 3=1–2 touchpoints, limited trust · 4=Established relationship · 5=Trusted advisor, strong champion inside`

**H3.** Do we have relevant reference projects for this specific work type / industry?  
`1=No references in this domain · 2=Adjacent domain only · 3=One relevant reference · 4=2–3 strong references · 5=Multiple references, referenceable clients`

**H4.** How well does the RFP / client ask align to our strengths?  
`1=Poor fit — stretching outside core capability · 2=Weak fit — gaps in key areas · 3=Reasonable fit · 4=Good fit · 5=This is squarely our strongest capability`

**H5.** Is the client's selection criteria weighted toward our strengths?  
`1=Price-led, we can't compete on price · 2=Price + capability, weak on price · 3=Balanced criteria · 4=Capability and relationship weighted · 5=Outcome and trust weighted — our strongest ground`

> **Coaching:** A deal where you have no relationship, no references, and are competing against 4+ vendors on price is not a presales challenge — it's a no-bid decision. Win probability below 20% means the cost of pursuit exceeds the expected value. Know when to walk.

---

**SECTION I — Vendor Capability & Delivery Fit** *(→ Axis: VF — internal, not shared with client)*

> This section is answered by the presales or practice lead, not the client. It is the vendor-side mirror of the client maturity assessment. It does not appear in client-facing exports.

**I1.** Do we have proven, delivered capability in this specific work type and technology stack?  
`1=No — this would be our first delivery in this domain · 2=Adjacent experience only · 3=Some delivered projects, limited depth · 4=Delivered multiple similar projects · 5=Deep expertise, recognised capability`

**I2.** Do we have the right people available (not bench-dependent or requiring new hires)?  
`1=Key roles unfilled, hiring required · 2=Some roles need bench/hire · 3=Mostly available, 1–2 gaps · 4=Team mostly ready · 5=Full team available, no ramp-up required`

**I3.** Do we have referenceable clients in this domain / industry?  
`1=No references · 2=One reference, not ideal · 3=One strong reference · 4=2–3 good references · 5=Multiple strong, referenceable clients`

**I4.** What is the subcontractor / partner dependency for delivery?  
`1=>50% of delivery depends on subcontractors we haven't worked with · 2=Significant sub-dependency, some known · 3=Some sub-dependency, managed · 4=Minimal sub-dependency · 5=No subcontractors — fully owned delivery`

**I5.** Has the delivery lead reviewed this deal and confirmed it is deliverable?  
`1=No delivery involvement in presales · 2=Delivery consulted informally · 3=Delivery reviewed scope only · 4=Delivery reviewed scope and timeline · 5=Delivery lead signed off on the full proposal`

> **Coaching:** Winning a deal you can't staff is worse than losing it. The handoff from presales to delivery is where over-promising meets under-resourcing. Delivery sign-off on the proposal is not a bureaucratic step — it's the single most important risk control in the presales process.

---

**SECTION J — Change Management & Organisational Impact** *(→ Axis: CM modifier — elevated for brownfield work types)*

> Surfaces for all brownfield work types. Optional for greenfield, surfaced if CM axis score < 3.

**J1.** How much organisational change does this project require (process, roles, behaviour)?  
`1=Major transformation — affects hundreds of people, multiple business units · 2=Significant change — multiple teams affected · 3=Moderate change — one team or process · 4=Minor change — small group · 5=No meaningful organisational change`

**J2.** Is there a named executive sponsor with real influence (vs nominal sponsorship)?  
`1=No executive sponsor · 2=Sponsor named but disengaged · 3=Sponsor engaged but limited influence · 4=Engaged sponsor with influence · 5=Strong, vocal sponsor who actively drives adoption`

**J3.** Is change management budgeted as a separate workstream?  
`1=No budget, no plan · 2=Discussed but not budgeted · 3=Partially budgeted · 4=Budgeted, rough plan · 5=Fully budgeted, dedicated resource, detailed plan`

**J4.** What is the likely user adoption risk?  
`1=Known resistance from large user group · 2=Significant resistance expected · 3=Mixed — some resistance, some enthusiasm · 4=Mostly supportive · 5=High demand — users are pulling for this change`

> **Coaching:** ERP migrations, legacy modernisation, and enterprise platform rollouts fail at go-live because of people, not technology. If change management isn't budgeted as a workstream, it becomes the vendor's unpaid problem at go-live. Price it or exclude it explicitly in the contract.

---

**SECTION K — Regulatory, Compliance & Security** *(→ Axis: TC + CR modifier — auto-surfaced if regulated data selected in Intake)*

**K1.** How well does the client understand their own compliance requirements for this project?  
`1=Unaware — hasn't thought about it · 2=Aware but not mapped · 3=Partially mapped, gaps exist · 4=Mostly mapped · 5=Fully mapped, requirements documented`

**K2.** Are compliance requirements included in the scope and priced?  
`1=Not mentioned anywhere · 2=Mentioned but not scoped · 3=Scoped but not priced · 4=Scoped and estimated · 5=Fully priced and contractually defined`

**K3.** Is there a security audit, pen test, or certification required before go-live?  
`1=Yes — not scoped, not priced, tight deadline · 2=Yes — scoped but not priced · 3=Yes — scoped and priced, timeline tight · 4=Yes — fully planned · 5=No / already certified`

**K4.** Are data residency and sovereignty requirements defined and designed for?  
`1=Not discussed · 2=Known requirement, not designed for · 3=Discussed, partially addressed · 4=Addressed in architecture · 5=No requirement / fully resolved`

> **Coaching:** GDPR, HIPAA, PCI-DSS, and data residency requirements are not optional scope items. They are fixed constraints — they cannot be traded in MoSCoW, they cannot be deferred to Phase 2, and they cannot be retrospectively added to a fixed price without a change order. If compliance scope is undefined at proposal stage, it will materialise as a margin-destroying surprise in delivery.

---

**SECTION L — Partner & Ecosystem Dependencies** *(→ Axis: TC modifier — auto-surfaced if partner selected in Intake)*

**L1.** How stable and predictable is the technology partner's product roadmap?  
`1=Major version change / migration expected during delivery · 2=Roadmap uncertain, changes likely · 3=Stable but some uncertainty · 4=Stable, minor changes expected · 5=Fully stable, no expected changes`

**L2.** Does the deal depend on partner licensing, discounts, or certifications we don't currently hold?  
`1=Critical dependency, not in place · 2=Significant dependency, in progress · 3=Minor dependency, manageable · 4=Dependency in place · 5=No partner dependency`

**L3.** If other SIs / vendors are involved — how well is the integration scope between parties defined?  
`1=No definition, significant overlap / gap risk · 2=Loosely defined · 3=Mostly defined · 4=Well defined · 5=No other vendors / fully defined`

**L4.** Do partner SLAs or release timelines create risks to our delivery timeline?  
`1=Known conflicts with delivery timeline · 2=Risks identified, not mitigated · 3=Manageable risk · 4=Low risk · 5=No partner timeline dependency`

> **Coaching:** Multi-vendor programmes are where scope falls through the gaps. Every boundary between your team and another team is a risk. Who owns the integration? Who resolves conflicts? Who does the client call when it breaks? These questions must have written answers before a fixed-price contract is signed.

---

**SECTION M — Post-Delivery & Hypercare** *(→ Axis: CR + SC modifier)*

**M1.** Is there a defined hypercare period with a clear scope, duration, and SLA?  
`1=No hypercare defined · 2=Informally agreed · 3=Partially defined · 4=Defined, not yet priced · 5=Fully defined and priced`

**M2.** Is there a knowledge transfer plan and a named client team to receive it?  
`1=No KT plan, no receiving team · 2=KT discussed, no plan · 3=Plan drafted, receiving team unclear · 4=Plan and team defined · 5=Full KT programme priced and agreed`

**M3.** Is the warranty / defect liability period and scope clearly defined in the contract?  
`1=Not defined · 2=Vague reference to "warranty" · 3=Period defined, scope unclear · 4=Period and scope defined · 5=Fully defined with exclusions and SLAs`

**M4.** What happens after hypercare — is there a transition to AMS / BAU or an exit?  
`1=Nothing defined, unclear · 2=Exit assumed, no plan · 3=Transition discussed · 4=Transition plan drafted · 5=Transition plan agreed and priced (or clean exit defined)`

> **Coaching:** Hypercare and warranty scope that isn't priced becomes a free extension of the fixed-price contract. The most common delivery margin leak is a 4-week hypercare becoming a 12-week free support engagement because nobody defined "done." The contract's definition of project close is as important as its definition of project start.

---

#### Quick Score Mode (12 questions)

When the user selects Quick Score, they see only these questions — one per axis plus two overrides:

| # | Question | Axis |
|---|---------|------|
| Q1 | Is a written, agreed scope document available? | SC |
| Q2 | Is there a named, available, empowered Product Owner? | CM |
| Q3 | Is the budget number realistic and independently validated? | CR |
| Q4 | Are there undocumented legacy systems involved? | TC |
| Q5 | Can the client make scope decisions within 24 hours? | GR |
| Q6 | Is this a strategic, multi-year opportunity? | SV |
| Q7 | Are we sole-source or heavily preferred to win? | CP |
| Q8 | Do we have proven, available people to deliver this? | VF |
| Q9 | Is the deadline fixed by a real external event? | SC/CR |
| Q10 | Have all key stakeholders aligned on requirements? | SC |
| Q11 | Is there a contingency budget set aside? | CR |
| Q12 | Is the client comfortable with incremental delivery? | CM |
| Q13 | Are third-party integration dependencies well understood? | TC |
| Q14 | Is there a defined change request process with an SLA? | GR |

---

### 5.3 Module 3: Strategy Selector

**Purpose:** Recommend the right engagement model and give the team a play to run.

#### Selection Logic

```
// ── HARD NO-BID TRIGGERS ──────────────────────────────────────────
if any axis == 1
  → Strategy F (No-Bid / Counter)

if totalScore < 25%
  → Strategy F (No-Bid / Counter)

if CP.score <= 2 AND competitiveSituation == "Open competition"
  → Strategy F (No-Bid / Counter)
  // rationale: low win probability + high pursuit cost

if VF.score <= 2
  → Strategy F (No-Bid / Counter)
  // rationale: we can't deliver this — winning it would be worse than losing

// ── RESTRUCTURE PLAYS ─────────────────────────────────────────────
else if totalScore < 50% AND CR.score < 3
  → Strategy E (Hybrid T&M Cap)

else if totalScore < 50% AND SC.score < 3
  → Strategy A (Foundation First)

else if totalScore < 50%
  → Strategy A or B (show both with tradeoff explanation)

// ── STANDARD PLAYS ────────────────────────────────────────────────
else if pricingModel == "Staff Augmentation"
  → Strategy E variant (resource-based, governance-light)
  // staff aug has different risk profile — governance and CR dominate

else if dealType == "Fixed/Scope" AND SC.score < 4
  → Strategy D (Scope-Locked MVP)

else if dealType == "Fixed/Agile" AND SC.score >= 3 AND GR.score >= 3
  → Strategy B (Phased Commitment)

else if CM.score >= 4 AND GR.score >= 4 AND SV.score >= 4 AND CP.score >= 3
  → Strategy C (Outcome Contract)

// ── COMPETITIVE MODIFIER ──────────────────────────────────────────
// Applied on top of strategy selection — changes the pitch posture
if CP.score >= 4 AND competitiveSituation == "Sole-source"
  → add flag: "Trusted position — lead with partnership and outcome language, not price"

if CP.score <= 3 AND competitiveSituation == "Open competition"
  → add flag: "Competitive pressure — differentiate on risk reduction and transparency, not just capability"

else
  → Strategy B (Phased Commitment) // safe default
```

#### Strategy Cards (what renders)

Each strategy card shows:
- **Name & tag line**
- **Why this deal needs this strategy** (generated from which axes triggered it)
- **The pitch** — opening line to use with the client
- **3 key moves** — what to do in presales
- **What to get in the contract** — 3 non-negotiables
- **Top 3 objections + responses**
- **The close**
- **Red flags to watch** — what could still go wrong

---

### 5.4 Module 4: Deal Shaper

**Purpose:** Show the presales team exactly which levers to pull — prioritised by this deal's specific risk profile.

**Lever categories:**
- Scope Levers (6 levers)
- Commercial Levers (6 levers)
- Governance Levers (5 levers)
- Risk Levers (5 levers)
- Relationship Levers (3 levers)

**Rendering logic:**  
Each lever has a trigger condition. Only levers triggered by this deal's axis scores are shown, ranked by impact. A deal with SC=2 and GR=2 sees scope and governance levers at the top. A deal with CR=2 sees commercial levers first.

**Each lever card shows:**
- Lever name
- Why it matters for this deal (context-specific, not generic)
- How to apply it (practical action)
- Draft contract language (where applicable)

---

### 5.5 Module 5: Deal Checker

**Purpose:** A 42-point quality gate. The last thing run before a proposal goes out.

**9 sections — 6 original × 5 checks + 3 new × 4 checks = 42 total**

#### Section 1: Commercial Health
- [ ] Margin is healthy at the quoted price
- [ ] Contingency is built in and documented in the proposal
- [ ] Payment is milestone/phase-based, not feature-based
- [ ] Pricing is anchored on outcomes or phases, not a feature list
- [ ] A clear renewal / Phase 2 path exists in the commercial narrative

#### Section 2: Scope Health
- [ ] MVP is clearly defined and agreed with the client
- [ ] All scope assumptions are documented and listed in the proposal
- [ ] MoSCoW split is reflected in the pricing tiers
- [ ] Third-party dependencies are explicitly excluded or risk-flagged
- [ ] A scope swap / change mechanism is described in the proposal

#### Section 3: Governance Health
- [ ] A named, empowered Product Owner is identified and confirmed
- [ ] The decision-making cycle is acceptable for sprint cadence
- [ ] A change request process with SLA is defined in the contract
- [ ] Client attendance at sprint reviews is committed (in writing)
- [ ] Acceptance criteria are phased, not end-of-project only

#### Section 4: Risk Health
- [ ] A risk register has been seeded and shared with the delivery lead
- [ ] Known unknowns are surfaced in the proposal (not hidden in caveats)
- [ ] A discovery phase is included, OR scope has been independently validated
- [ ] The timeline has been stress-tested with the delivery lead
- [ ] A presales-to-delivery handoff document is ready

#### Section 5: Relationship Health
- [ ] The client's real success criteria are understood and documented
- [ ] The scope trade-off conversation has been had explicitly
- [ ] Client-side stakeholder alignment has been confirmed
- [ ] The internal champion is identified and engaged
- [ ] Past vendor relationship history has been assessed

#### Section 6: Strategic Health
- [ ] This deal fits the portfolio / capability strategy
- [ ] The logo or account value justifies any thin Phase 1 margin
- [ ] A platform or multi-year expansion path is identified
- [ ] We are the right vendor for this problem
- [ ] This is a deal we can be proud of delivering

#### Section 7: Competitive Health *(new — v0.4)*
- [ ] Win probability is assessed and justifies the presales investment
- [ ] We have at least one relevant reference in this domain / industry
- [ ] Our differentiators are clearly articulated in the proposal (not generic capability)
- [ ] The competitive posture (price / quality / relationship / outcome) is explicitly chosen

#### Section 8: Vendor Capability Health *(new — v0.4, internal — not in client-facing exports)*
- [ ] The delivery lead has reviewed and signed off on the proposal
- [ ] All critical delivery roles are identified and available (not dependent on hires or bench)
- [ ] Subcontractor dependencies are documented and their reliability assessed
- [ ] We have delivered at least one comparable project in this work type (or a risk waiver is documented)

#### Section 9: Post-Delivery Health *(new — v0.4)*
- [ ] Hypercare period, scope, and SLA are defined and priced in the proposal
- [ ] Knowledge transfer plan and receiving team are defined
- [ ] Warranty / defect liability scope and period are explicitly stated in the contract
- [ ] Transition to BAU / AMS or clean project exit is defined and agreed

**Check states:** Pass · Fail · Warning · N/A  
**Notes field** on each check (optional free text)

**Scoring:**
- Pass = 1pt · Warning = 0.5pt · Fail / N/A = 0pt
- Section score = (pts earned / max pts) × 100%
- Overall score = average of section scores

**Output:**
| Score | Verdict | Colour |
|-------|---------|--------|
| ≥ 85% | **Go** — submit the proposal | Green |
| 70–84% | **Conditional Go** — resolve flagged items first | Amber |
| < 70% | **No-Go** — deal restructure required | Red |

**Hard blockers** (any Fail here → must-fix regardless of score):
- Commercial Health item 1 (margin)
- Risk Health item 3 (discovery / scope validation)
- Governance Health item 1 (named PO)
- Vendor Capability Health item 1 (delivery lead sign-off) — *internal blocker, not shown to client*
- Vendor Capability Health item 4 (comparable delivery experience or risk waiver)

---

## 6. Coaching Layer — Content Architecture

The coaching layer is the article content embedded as contextual guidance. It appears as:
- **Tooltips** on individual questions (hover/tap)
- **Insight panels** on axis score results (collapsible)
- **Coaching notes** on strategy cards
- **Lever rationale** on each deal shaper recommendation
- **Checker guidance** on each checklist item

### Key Coaching Topics & Where They Appear

| Topic | Appears In |
|-------|-----------|
| Fixed price ≠ fixed scope — the myth | Risk Scorer intro, SC axis result |
| The impossible triangle | Deal Intake (hard deadline + fixed budget signals), Strategy D |
| Why no named PO is a delivery stopper | GR axis, Governance checker items |
| The cone of uncertainty | SC axis result, Strategy A/B cards |
| Scope creep anatomy — how it actually happens | SC axis result, Shaper scope levers |
| How to sell a discovery phase | Strategy A card |
| Contract clauses that protect fixed agile | Shaper governance levers |
| The presales-to-delivery handoff | Deal Checker section 4, export/share module |
| Pricing for uncertainty without padding | Shaper commercial levers |
| The no-bid decision — how to do it professionally | Strategy F card |
| Win probability and pursuit ROI | CP axis, Intake competitive signals |
| Why vendor capability is as important as client maturity | VF axis, Checker section 8 |
| ERP / CRM migrations are change programmes, not IT projects | Work type coaching, Section J |
| Compliance scope is fixed — you cannot MoSCoW it | Intake regulated data signal, Section K |
| Multi-vendor scope gaps — who owns the boundary? | Section L, Shaper risk levers |
| Hypercare creep — how post-delivery becomes unpaid delivery | Section M, Checker section 9 |
| Timezone overlap and agile governance | Delivery geography signal, GR axis |
| Pricing model ≠ engagement type — why this distinction matters | Intake pricing model field |

---

## 7. Export & Share

### 7.1 What Can Be Exported

| Export | Format | Contents |
|--------|--------|---------|
| Full deal JSON | `.json` | Complete deal state — importable back into CADEX |
| Deal summary | Print/PDF | 2–3 page printable: intake, scores, strategy, top levers, checklist result |
| Handoff brief | Print/PDF | Delivery-team view: assumptions, risks, what was/wasn't promised, governance design |
| Shareable URL | URL | Base64-encoded deal state in URL hash — read-only view for recipient |

### 7.2 Print Stylesheet

The print view suppresses all navigation, coaching panels, and interactive elements. It renders:
- Page 1: Deal details + radar chart + score band
- Page 2: Strategy card + top 5 levers
- Page 3: Checklist results + verdict + key action items

---

## 8. Component Architecture (Frontend)

```
src/
├── data/
│   ├── questions.ts           // ~55 questions across sections A–M + work-type extras
│   │                          // each question: id, section, axis, text, scale labels, coaching tip
│   ├── strategies.ts          // 6 strategy cards (A–F) with full content
│   ├── levers.ts              // all levers with trigger conditions + contract language
│   ├── checklist.ts           // 42 checks across 9 sections, blocker flags + guidance
│   ├── coaching.ts            // 18 coaching topics keyed by topic ID
│   ├── workTypes.ts           // full L1/L2/L3 taxonomy + risk profile modifiers
│   └── axisWeights.ts         // weight tables by engagement type + pricing model
│                              // + work type modifiers + geography modifiers
│
├── store/
│   └── dealStore.ts           // Zustand store — full DealMeta + Assessment + results
│                              // localStorage middleware auto-saves on every mutation
│
├── lib/
│   ├── scorer.ts              // 8-axis scoring engine, weight lookup, band calculation
│   ├── strategySelector.ts    // strategy recommendation logic incl. competitive modifier
│   ├── shaperEngine.ts        // lever prioritisation — filters + ranks by axis scores
│   ├── checkerEngine.ts       // 42-point scoring, section scores, verdict, hard blockers
│   ├── autoSignals.ts         // intake combination rules → warning flags
│   ├── entryModeAdvisor.ts    // recommends Full / Quick / Checker based on sales stage
│   ├── timezoneCalc.ts        // calculates overlap hours from client + delivery regions
│   └── shareUrl.ts            // lz-string compress/decompress deal state for URL hash
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx        // step progress, deal name, mode indicator
│   │   └── Header.tsx
│   ├── intake/
│   │   ├── IntakeForm.tsx     // core fields + work type selector
│   │   ├── CompetitivePanel.tsx   // Gap 1
│   │   ├── VelocityPanel.tsx      // Gap 7
│   │   ├── CompliancePanel.tsx    // Gap 5
│   │   ├── PartnerPanel.tsx       // Gap 6
│   │   └── GeographyPanel.tsx     // Gap 9 — includes auto overlap calc
│   ├── scorer/
│   │   ├── QuestionCard.tsx   // single question with scale + coaching tooltip
│   │   ├── SectionHeader.tsx  // section intro with axis mapping
│   │   ├── RadarChart.tsx     // live 8-axis radar (Recharts)
│   │   └── AxisResult.tsx     // per-axis score card with coaching insight panel
│   ├── strategy/
│   │   ├── StrategyCard.tsx   // full strategy card with all sub-sections
│   │   └── CompetitiveModifier.tsx  // shows competitive posture flag on top of strategy
│   ├── shaper/
│   │   └── LeverCard.tsx      // lever card with trigger rationale + contract language
│   ├── checker/
│   │   ├── CheckSection.tsx
│   │   ├── CheckItem.tsx      // Pass/Fail/Warning/NA toggle + notes field
│   │   ├── Verdict.tsx        // Go/Conditional/No-Go with action list
│   │   └── InternalBadge.tsx  // marks Section 8 (Vendor Fit) as internal-only
│   ├── coaching/
│   │   ├── CoachingPanel.tsx  // collapsible "Why this matters" panel
│   │   └── Tooltip.tsx        // hover tooltip on questions
│   └── shared/
│       ├── ScoreBadge.tsx     // Green/Amber/Red/Black band badge
│       ├── AutoSignalBanner.tsx   // intake auto-signal warning strip
│       ├── EntryModeAdvisor.tsx   // recommended entry mode chip on home screen
│       └── ExportMenu.tsx     // JSON / Print / Share URL actions
│
└── pages/
    ├── Home.tsx               // landing: new deal / load / quick score + entry mode recommendation
    ├── Assessment.tsx         // wizard shell — renders active step component
    └── SharedView.tsx         // read-only view for shared URL (hides VF section)
```

---

## 9. Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | React 18 + TypeScript | Component model fits wizard structure |
| Build | Vite | Fast dev server, simple config |
| Styling | Tailwind CSS | Rapid UI, consistent spacing and colour |
| State | Zustand | Lightweight, localStorage middleware built-in |
| Charts | Recharts | Radar chart for risk axes, minimal bundle |
| Icons | Lucide React | Clean, consistent icon set |
| PDF/Print | Browser print API + print CSS | No dependency, zero bundle cost |
| URL sharing | lz-string | Lightweight compression for base64 URL state |
| Routing | React Router v6 | For shared view URL (`/share/:hash`) |

**No backend. No database. No auth.**

---

## 10. Phase Roadmap

### Phase 1 — MVP (This Build)
All 9 modules. 8-axis scorer. 42-point checker. Static data files. localStorage + JSON export + print + URL share.

**Deferred to Phase 2 from this build:**
- Deal Economics & Margin Modelling (Gap 3) — requires a financial calculator component with role/rate/duration inputs. Complex enough to be a Phase 2 feature to avoid scope inflation in Phase 1.

### Phase 2 — Deal Economics + AI Layer
- **Deal Economics module:** cost build-up (roles × rates × duration × blend), gross margin calculator, break-even sensitivity (how much scope creep kills margin), contingency buffer calculator (days at confidence %)
- Replace static strategy rationale with Claude API-generated summaries (claude-sonnet-4-6)
- Natural language deal summary from questionnaire responses
- Context-aware coaching that references actual deal data (not generic)
- AI-generated scope assumptions from the free-text scope description
- AI-generated risk register seeded from questionnaire responses

### Phase 3 — Collaboration & Persistence
- Supabase backend for multi-user deal sharing and team pipeline
- Deal review workflow (submit → senior review → approve)
- Team analytics: score distribution, no-bid rate, win rate by strategy
- Salesforce / HubSpot integration via webhook
- Client-facing mode: lighter questionnaire, separate Section G view, shared readiness report

---

## 11. Open Questions (Resolved from v0.1)

| Question | Resolution |
|----------|-----------|
| No DB? | localStorage + JSON export. URL sharing for handoff. |
| Scoring weights fixed? | Weights adjust by engagement type + pricing model + work type modifier + geography modifier. |
| Industry-specific questionnaire? | Not in MVP — coaching text varies by vertical, questionnaire is universal. Work type taxonomy handles most of the variation. |
| Client-facing mode? | Shareable URL (read-only) covers this for MVP. VF section (internal) is hidden in shared view. Separate client mode in Phase 3. |
| AI in Phase 1? | No — keep Phase 1 clean. AI is Phase 2 once content is validated. |
| Deal Economics (Gap 3)? | Deferred to Phase 2. Financial modelling adds significant UI complexity. Phase 1 flags margin health via Deal Checker; Phase 2 calculates it. |
| VF section client visibility? | Section I (Vendor Capability Fit) is internal only. Marked with `[internal]` tag. Never appears in client-facing exports or shared URLs. |
| How many total questions? | Full assessment: ~55 questions (base 40 + 6 new sections × ~2–5 questions each, some conditional). Quick Score: 14 questions. |

---

*End of Specification v0.4*
