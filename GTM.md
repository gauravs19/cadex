# CADEX — Go-To-Market Strategy

> Last updated: May 2026

---

## 1. The Market Gap

### What exists

| Tool category | Examples | What they do | What's missing |
|---|---|---|---|
| RFP / proposal automation | Loopio, Responsive, QorusDocs | Write proposals faster; AI-assisted answer generation | Zero deal qualification intelligence. Go/no-go = downloadable PDF template. |
| Presales ops platforms | Vivun/Hero, Homerun, PreSkale | SE activity tracking, resource allocation, ML-based technical merit score (Vivun) | Built for SaaS product cos, not IT consulting. Heavy Salesforce dependency. No delivery risk scoring. |
| Revenue intelligence | Gong, Clari | Call recording, pipeline forecasting, deal likelihood scores | Tell you *what happened*, not whether to bid. Don't assess scope risk, governance, or commercial model risk. $400–500/user/month, 30% utilisation. |
| Bid management | Bidhive, Altura, Tendrio | Process tracking, compliance matrix vs. RFP requirements | Closest in intent. Altura has a "bid/no-bid workflow" = process tracker, not scored intelligence. |

### The white space CADEX occupies

No tool on the market has:
- Multi-axis delivery risk scoring (scope clarity, client maturity, commercial risk, technical complexity, governance, solutioning value, competitive position, value fit)
- Go/No-Go recommendation engine tied to scored risk
- Deal-shaping levers — moving from "should we bid?" to "how should we bid?"
- Pricing model risk assessment (T&M vs. fixed-price vs. managed services carry fundamentally different risk profiles)
- A structured quality gate before proposal submission
- Purpose-built vertical fit for IT consulting / system integrator deal anatomy

---

## 2. Market Pain Points

Sourced from: PreSales Collective, Loopio 2025 RFP Statistics, Consensus 2025 SE Report, Moovila MSP Report 2025, PropLibrary, Shipley Associates, Arphie, Sifthub, G2/TrustRadius reviews.

| # | Pain point | Evidence |
|---|---|---|
| 1 | **Bid on everything, win nothing** | Win rates dropped 53% → 39% (2019–2025). 40% of proposal resources wasted on deals that will never be won. |
| 2 | **Sales overrides qualification** | AEs push every deal to presales near quarter-end. "Dysfunctional Sales/PreSales relationships" shortcut qualification gates. |
| 3 | **35–50% of demos and proposals are unqualified** | Consensus 2025 SE Survey (600+ SEs): 35% of demos are underqualified. Some leaders put it above 50%. |
| 4 | **Burnout driven by low-quality bids** | 62% of proposal professionals cite workload as #1 stressor. Bandwidth surged 20pts as top complaint in 2025. |
| 5 | **Decision happens too late — already invested** | "By the time RFP decisions occur, the company is invested and reluctant to drop it." Sunk-cost trap is pervasive. |
| 6 | **Wired RFPs** | 57% of purchase decision is complete before first supplier call. RFPs are often issued after the decision is made. |
| 7 | **Qualification lives in spreadsheets** | "If you work in a small to mid-size org, your pipeline management is likely ad hoc or loosely followed." — Shipley Associates |
| 8 | **Scope creep starts at bid stage** | #1 challenge for IT services firms in 2025 (58.7%, up from 46% in 2024). Risk never assessed at bid time. — Moovila |
| 9 | **Revenue tools tell me what happened, not whether to bid** | "There's so much in Gong that we don't use everything. Gong's deal forecasting we don't use." — Karel Bos, Head of Sales |
| 10 | **No standard gate before submission** | 20% of started RFPs go unfinished. Average 32 hrs/proposal. Inconsistent quality undermines even strong client relationships. |

---

## 3. Target Audience

### Primary users — people who open CADEX before a bid meeting

**Presales / Solution Consultants**
Owns the technical and commercial response. Answers "can we deliver this?" Uses risk scoring, scope questions, effort estimator, objection bank daily. Pain: no structured way to decline bad deals, pulled into everything.

**Bid Managers / Pursuit Leads**
Owns the bid process end-to-end. Coordinates sales, presales, delivery, legal. Needs the quality gate, deal shaper, and an auditable go/no-go recommendation — something defensible to show sales. Pain: qualification lives in spreadsheets, decisions happen too late.

**Practice / Capability Leads**
Delivery-side SME who signs off on whether the firm can execute. Cares about scope clarity, governance, technical complexity axes. Often pulled in late and asked to rubber-stamp a decision already made. Pain: no structured way to assess delivery risk at bid stage.

### Secondary users — stakeholders who consume the output

**Sales / Account Executives**
Don't fill in CADEX. Receive the Go/No-Go brief and strategy recommendation. Care about win themes, competitive positioning, objection handlers. The shareable link and PDF brief are for them.

**Delivery / Engagement Managers**
Read the Proposal export and Deal Shaper output post-award. The scope assumptions register and risk axes become the project charter starting point.

**Sales / Presales Leadership**
Portfolio view across deals: green/amber/red distribution, where the team is spending time, average risk profile of the pipeline. Want roll-up visibility, not individual deal scoring.

### Firmographic ICP

| Dimension | Sweet spot |
|---|---|
| Company type | IT services / system integrator / consulting firm |
| Size | 200–5,000 people (too small = no presales function; enterprise = has Vivun already) |
| Deal type | Custom engagement bids — not product sales, not recurring SaaS renewals |
| Deal size | $200K–$5M pursuits |
| Geography | India-origin global SIs (GlobalLogic, Wipro, LTIMINDTREE, Mphasis, Coforge, Persistent, Hexaware), EMEA boutique IT consultancies |
| Verticals served | BFSI, manufacturing, retail |

### Tightest ICP — highest urgency adopters

Presales lead or bid manager at an India-origin global SI or EMEA IT consultancy, 300–3,000 people, running 3–8 simultaneous BFSI or manufacturing pursuits between $300K–$3M. Qualifies deals in a shared Excel or Confluence page. Regularly told by sales to "just respond" even to wired RFPs.

### Who is NOT the target (yet)

- Pure SaaS product companies → Vivun/Homerun built for them
- Public sector / government contractors → Altura, GovDash serve them
- Large enterprises with Salesforce embedded → different buying motion, integration-first requirement
- Sub-$100K deal shops → qualification overhead doesn't justify the tool

---

## 4. Go-To-Market Phases

### Phase 1 — Internal validation (0–3 months)
**Goal: prove it changes outcomes on real deals, get 3–5 case studies**

- Deploy inside GlobalLogic's presales team on 2–3 active pursuits in parallel with existing qualification process
- Track: time to go/no-go decision, whether the score predicted the outcome, which risk axes flagged correctly
- Target metric: "team using CADEX made go/no-go 40% faster, flagged scope risk that became the post-award issue"
- Surface real usability gaps that automated tests won't catch

**Blocker to fix first:** CADEX currently stores deals in localStorage only. Needs a simple backend (deals stored server-side) before multi-person team rollout.

---

### Phase 2 — Community seeding (1–4 months)
**Goal: 200–500 active users, organic word of mouth in ICP**

**PreSales Collective** (40K+ members, Slack + newsletter + events)
Post a genuine "here's the problem we solved and how" thread, not a product pitch. The 10 pain points from community research map directly to active discussions there.

**APMP (Association of Proposal Management Professionals)**
The bid manager community. CADEX's quality gate and go/no-go engine speak directly to APMP's core curriculum. A guest post or webinar slot is achievable.

**LinkedIn targeted content**
Post the market gap analysis (existing tools vs. what's missing) as thought leadership. The competitive matrix is shareable standalone content. Tag presales, bid management, IT consulting.

**Reddit (r/presales, r/consulting)**
Don't pitch. Answer questions. When someone posts "how do you qualify deals?" or "how do you handle sales pushing you into every RFP?" — give a genuine answer, mention CADEX as the tool built to solve it.

**Viral mechanic:** The share link feature. When a presales lead shares a deal brief with their sales director, the recipient sees structured CADEX output and asks "what tool made this?"

---

### Phase 3 — PLG motion (3–9 months)
**Goal: 50 paying teams, $10–30K ARR per team**

**Freemium tier** — unlimited deals, localStorage, no team features. Exactly what exists today.

**Team tier** ($X/user/month)
- Deals stored in the cloud, shared across presales team
- Deal history and portfolio analytics (win rate by work type, average risk score of won vs. lost deals)
- Salesforce / HubSpot field sync
- Buyers: bid managers and presales leaders, not individual contributors

**Firm tier**
- White-label
- Custom work type taxonomy
- Benchmarking against anonymised industry data
- SSO

**Upsell trigger:** Solo user wants to share a deal with their team → hits "upgrade to save to cloud" gate. Natural, not forced.

---

### Phase 4 — Direct outreach to SI leadership (6–18 months)
**Goal: 5–10 firm-level deals at $30–100K/year**

Target firms: Coforge, Mphasis, LTIMINDTREE, Persistent, Hexaware, Mastech Digital, Birlasoft, Mastech Digital, mid-size EMEA consultancies.

Target buyers: VP Presales, Head of Bid Management, Chief Growth Officer.

Pitch: not "buy this tool" — "your presales team is bidding on X deals/year and winning Y%. Here's what firms using CADEX see." Phase 1 internal data is the proof point.

**Partnership accelerators:**
- APMP chapters — endorse tools that map to their framework
- Shipley Associates — trains bid teams globally, could bundle CADEX as a practice tool
- SI-focused VC/PE firms — portfolio-manage multiple consultancies, want consistent deal quality across portfolio companies

---

## 5. What Needs to Be Built Before Phase 2

| Needed for GTM | Current state | Gap |
|---|---|---|
| Landing page with value prop | None | Required before community posts |
| Shareable 1-page deal brief (print/PDF) | HTML proposal export (34 slides) | Needs print-optimised executive summary |
| Cloud deal storage | localStorage only | Backend required for team rollout |
| Team collaboration | None | Phase 3 requirement |
| Win/loss tracking | None | Phase 3 requirement |
| Portfolio analytics dashboard | None | Phase 3 requirement |

**Immediate priorities:** landing page and 1-page deal brief. Both achievable quickly, both directly support Phase 2 community seeding.

---

## 6. The One Thing That Determines If This Works

The entire GTM lives or dies on Phase 1 internal validation producing a measurable outcome story. Everything else — community posts, LinkedIn content, direct outreach — needs a number:

> "A presales team used CADEX on 12 deals, flagged 4 as no-bid, the 8 they pursued had a 62% win rate vs. 31% baseline."

Without that: CADEX is a tool.
With it: CADEX is a defensible category claim — **the first structured bid intelligence platform built for IT consulting/SI delivery risk**.
