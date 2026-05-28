// ============================================================
// CADEX — Questionnaire Questions  (spec §5.2)
// 7 core sections + 4 triggered sections
// 21 core + 8 triggered = 29 total (down from 55)
// ============================================================

import type { Question } from '../types'

export const QUESTIONS: Question[] = [

  // ══════════════════════════════════════════════════════════
  // SECTION A — Client & Delivery Readiness  (→ CM)
  // ══════════════════════════════════════════════════════════
  {
    id: 'A1',
    section: 'A',
    sectionTitle: 'Client & Delivery Readiness',
    axis: 'CM',
    text: 'How experienced and comfortable is the client with iterative / agile delivery?',
    scaleLabels: [
      'Never done it — expects big-bang delivery',
      'Aware but untested, nervous about incremental',
      'Tried it before, mixed results',
      'Regular practitioner, comfortable',
      'Outcome-led, actively demands incremental delivery',
    ],
    coachingTip:
      'Low agile maturity doesn\'t disqualify the deal — it changes your governance design. A client who insists on big-bang delivery removes your ability to surface scope risk early. The earlier you can show working software, the earlier you can catch misalignments before they become disputes.',
    quickScore: true,
  },
  {
    id: 'A2',
    section: 'A',
    sectionTitle: 'Client & Delivery Readiness',
    axis: 'CM',
    text: 'Is there a named, available, empowered Product Owner on the client side?',
    scaleLabels: [
      'No PO identified',
      'Name TBD / role unclear',
      'Named but part-time or constrained',
      'Named and available',
      'Named, available, and empowered to decide',
    ],
    coachingTip:
      'No empowered PO is the single biggest delivery failure mode on agile fixed engagements. Without a decision-maker on the client side, backlog prioritisation stalls, sprint reviews become report-outs, and scope disputes multiply. This is a hard governance requirement — not a nice-to-have.',
    quickScore: true,
  },
  {
    id: 'A3',
    section: 'A',
    sectionTitle: 'Client & Delivery Readiness',
    axis: 'CM',
    text: 'What is the nature of our existing relationship with this client?',
    scaleLabels: [
      'No relationship — cold RFP',
      'Aware of us, first engagement',
      'Worked together on 1–2 small projects',
      'Established relationship, some trust',
      'Strategic partner, high trust',
    ],
    coachingTip:
      'Relationship capital is risk capital. A trusted advisor relationship allows difficult conversations to happen early — before they become disputes. A cold RFP means every difficult conversation is adversarial. The relationship context changes proposal tone, risk tolerance, and governance flexibility.',
    quickScore: true,
  },

  // ══════════════════════════════════════════════════════════
  // SECTION B — Scope & Requirements  (→ SC)
  // ══════════════════════════════════════════════════════════
  {
    id: 'B1',
    section: 'B',
    sectionTitle: 'Scope & Requirements',
    axis: 'SC',
    text: 'Does a written requirements document, user story map, or feature list exist?',
    scaleLabels: [
      'Nothing documented',
      'High-level notes only',
      'Feature list, no user stories',
      'User stories drafted, some gaps',
      'Complete, prioritised, stakeholder-agreed',
    ],
    coachingTip:
      'Fixed price ≠ fixed scope — but scope documentation is the foundation of any fixed-price deal. Without written requirements, you are pricing against assumptions. Every assumption is a future dispute. Insist on documented scope as a pre-condition for fixed pricing, or price a discovery phase first.',
    quickScore: true,
  },
  {
    id: 'B2',
    section: 'B',
    sectionTitle: 'Scope & Requirements',
    axis: 'SC',
    text: 'How stable is the current scope — and have key stakeholders aligned on it?',
    scaleLabels: [
      'Very early, lots will change — stakeholders not aligned',
      'Directionally clear but volatile, disputes expected',
      'About 60% stable, mostly aligned',
      'Mostly stable, minor changes expected, aligned',
      'Stable, signed off, full stakeholder agreement',
    ],
    coachingTip:
      'Scope confidence and stakeholder alignment are two sides of the same risk. Pricing a fixed-cost deal when scope is 40% unknown or stakeholders disagree is pricing the wrong thing. Document what\'s known, what\'s assumed, and what\'s excluded — and make all three contractually visible.',
  },
  {
    id: 'B3',
    section: 'B',
    sectionTitle: 'Scope & Requirements',
    axis: 'SC',
    text: 'If forced to cut 20% of scope to hit the deadline — can the client prioritise?',
    scaleLabels: [
      'No — all features are equal priority',
      'Unlikely — political sensitivity prevents it',
      'Possible with effort',
      'Yes, rough priority exists',
      'Yes — MoSCoW already defined and agreed',
    ],
    coachingTip:
      'The MoSCoW conversation is a pressure test. If the client can\'t define what they would cut, they haven\'t really prioritised. In a fixed-budget, fixed-time engagement, prioritisation isn\'t optional — it\'s the mechanism for managing scope risk. A client who says "all features are equal" is expecting all features at the quoted price.',
  },

  // ══════════════════════════════════════════════════════════
  // SECTION C — Commercial & Timeline  (→ CR + SC)
  // ══════════════════════════════════════════════════════════
  {
    id: 'C1',
    section: 'C',
    sectionTitle: 'Commercial & Timeline',
    axis: 'CR',
    text: 'How was the budget number arrived at, and is a contingency set aside?',
    scaleLabels: [
      'Gut feel / political number — no contingency',
      'Benchmark estimate — no contingency',
      'Business case estimate — small contingency (<5%)',
      'Detailed estimation — standard contingency (10–15%)',
      'Independently validated — healthy contingency (>15%)',
    ],
    coachingTip:
      '"How did you arrive at that number?" is one of the most powerful presales questions you can ask. A budget with no contingency means any surprise — technical, scope, or external — will be disputed rather than managed. A healthy contingency (10–15%) is not wasteful; it\'s the client\'s risk management budget.',
    quickScore: true,
  },
  {
    id: 'C2',
    section: 'C',
    sectionTitle: 'Commercial & Timeline',
    axis: 'CR',
    text: 'What is the payment structure and what happens if scope needs to change?',
    scaleLabels: [
      '100% on final delivery — scope changes become disputes',
      'Milestone-linked to features, limited change mechanism',
      'Milestone-linked to phases, some flexibility',
      'Monthly / time-based with a defined CR process',
      'Outcome-linked or value-based with clear scope swap mechanism',
    ],
    coachingTip:
      'Payment on final delivery concentrates cash flow risk at the end and gives the client maximum leverage to dispute. Milestone payments aligned to phases protect you from scope dispute at the worst moment. The payment structure and the scope change mechanism must be designed together.',
  },
  {
    id: 'C3',
    section: 'C',
    sectionTitle: 'Commercial & Timeline',
    axis: 'SC',
    text: 'Is the project deadline driven by a real business event, or is it aspirational?',
    scaleLabels: [
      'Aspirational — "would like it by then"',
      'Internal preference, no external driver',
      'Linked to internal initiative',
      'Linked to an external commitment',
      'Hard external event — regulatory, contractual, or market launch',
    ],
    coachingTip:
      'When time is truly fixed (regulatory deadline, contracted launch date), the negotiable variables must be scope or budget. Proposals that ignore this end up with teams doing unpaid overtime. A hard external deadline may justify premium pricing and a risk-transfer clause — price the timeline risk explicitly.',
    quickScore: true,
  },

  // ══════════════════════════════════════════════════════════
  // SECTION E — Governance & Decision-Making  (→ GR)
  // ══════════════════════════════════════════════════════════
  {
    id: 'E1',
    section: 'E',
    sectionTitle: 'Governance & Decision-Making',
    axis: 'GR',
    text: 'Is there a named, senior decision-maker on the client side — and how accessible are they?',
    scaleLabels: [
      'Unknown / committee with no clear lead',
      'Committee — decisions take weeks',
      'Named sponsor, available monthly',
      'Named sponsor, available weekly',
      'Named, senior, available same-day and empowered',
    ],
    coachingTip:
      'Decision-making latency kills agile projects. A sprint is 2 weeks. If the client needs 3 weeks to resolve a scope decision, the project stops. Named, empowered, accessible decision-makers are a contractual requirement on fixed-agile deals — not a nice-to-have.',
    quickScore: true,
  },
  {
    id: 'E2',
    section: 'E',
    sectionTitle: 'Governance & Decision-Making',
    axis: 'GR',
    text: 'How quickly can the client turn around scope decisions and sprint review feedback?',
    scaleLabels: [
      'Weeks — decisions routinely delayed',
      '1–2 weeks',
      '3–5 business days',
      '1–2 business days',
      'Same day — decision SLA is agreed',
    ],
    coachingTip:
      'Decision latency > sprint length = blocked sprints. On a 2-week cadence, any decision that takes more than 3 days creates a bottleneck. The governance design in the contract should specify maximum decision turnaround times — and what happens when they\'re missed.',
    quickScore: true,
  },
  {
    id: 'E3',
    section: 'E',
    sectionTitle: 'Governance & Decision-Making',
    axis: 'GR',
    text: 'Is there a defined change request process with a turnaround SLA?',
    scaleLabels: [
      'No process — changes argued case by case',
      'Informal process',
      'Formal process but slow (>1 week)',
      'Formal and fast (<3 days)',
      'Fast-track CR clause in contract with defined SLA',
    ],
    coachingTip:
      'The change request process is the governance spine of a fixed-agile deal. Without a defined CR process, every new requirement is a negotiation mid-sprint. The CR clause should define: what triggers a CR, who assesses it, what the SLA is, and what happens if the SLA is missed.',
    quickScore: true,
  },

  // ══════════════════════════════════════════════════════════
  // SECTION F — Technical Landscape  (→ TC)
  // ══════════════════════════════════════════════════════════
  {
    id: 'F1',
    section: 'F',
    sectionTitle: 'Technical Landscape',
    axis: 'TC',
    text: 'How well are existing systems documented, and is sandbox / dev access available?',
    scaleLabels: [
      'Undocumented legacy — no access',
      'Partially documented — hard to access',
      'Documented with gaps — limited access',
      'Well documented — access available',
      'Fully documented with sandbox access and APIs',
    ],
    coachingTip:
      'Undocumented legacy systems are a scope mine. Every undocumented behaviour discovered during delivery is a potential scope addition. If you\'re integrating with existing systems, demand documentation access — or price a discovery phase to create it.',
    quickScore: true,
  },
  {
    id: 'F2',
    section: 'F',
    sectionTitle: 'Technical Landscape',
    axis: 'TC',
    text: 'Are hard non-functional requirements (performance, security, compliance) documented and designed for?',
    scaleLabels: [
      'Multiple NFRs — undocumented and not designed for',
      'Partially documented — not designed for',
      'Documented — not yet designed for',
      'Documented and designed for',
      'No hard NFRs beyond standard, or fully resolved',
    ],
    coachingTip:
      'NFRs discovered late in delivery are expensive to retrofit. Performance targets, security standards, and compliance requirements need to be in the proposal as requirements — not aspirations — with clear acceptance criteria that define "done."',
  },
  {
    id: 'F3',
    section: 'F',
    sectionTitle: 'Technical Landscape',
    axis: 'TC',
    text: "What is the client's CI/CD, testing, and data quality maturity?",
    scaleLabels: [
      'No CI/CD, no automated tests, data quality unknown',
      'Basic CI, manual testing, known data issues',
      'CI in place, some test automation, manageable data',
      'Full CI/CD, good test coverage, clean data',
      'Shift-left QA, high coverage, clean and accessible data',
    ],
    coachingTip:
      'Low CI/CD and data quality maturity adds invisible effort to every sprint. Building on a codebase with no automated tests means your team carries regression risk. Data cleansing is never as simple as it looks — it requires business decisions that take time and engagement not typically costed.',
  },

  // ══════════════════════════════════════════════════════════
  // SECTION G — Competitive Position & Strategic Value  (→ CP + SV)
  // ══════════════════════════════════════════════════════════
  {
    id: 'G1',
    section: 'G',
    sectionTitle: 'Competitive Position & Strategic Value',
    axis: 'CP',
    text: 'How many vendors are competing, and how well are we differentiated?',
    scaleLabels: [
      '5+ unknown vendors — we are undifferentiated',
      '3–4 vendors — limited differentiation',
      '2–3 vendors — some differentiation',
      '1–2 vendors — strong differentiation',
      'Sole-source or heavily preferred',
    ],
    coachingTip:
      'Win probability × deal size = expected value of pursuit. A 10% win probability on a $500K deal is worth $50K in expected value — before presales cost. When you are 1 of 6 undifferentiated vendors on a price-led RFP, the question is: does the expected value of pursuing this deal justify the bid cost?',
    quickScore: true,
  },
  {
    id: 'G2',
    section: 'G',
    sectionTitle: 'Competitive Position & Strategic Value',
    axis: 'CP',
    text: "How well does the deal align to our core strengths — and are we winning on those criteria?",
    scaleLabels: [
      'Poor fit — stretching outside core capability, price-led selection',
      'Weak fit — gaps in key areas, criteria not in our favour',
      'Reasonable fit — balanced criteria',
      'Good fit — capability and relationship weighted',
      'Squarely our strongest capability — criteria favour us',
    ],
    coachingTip:
      'Chasing deals outside your core capability is a margin trap. You will underprice the unknown work, overpromise on quality, and carry delivery risk that didn\'t exist on deals where you have deep expertise. If the selection criteria don\'t favour you, no amount of proposal quality will help.',
  },
  {
    id: 'G3',
    section: 'G',
    sectionTitle: 'Competitive Position & Strategic Value',
    axis: 'SV',
    text: 'What is the strategic value of this client and deal to us?',
    scaleLabels: [
      'One-off transaction — low renewal potential',
      'Small account — limited growth',
      'Fits portfolio — some renewal likely',
      'Key account or logo value',
      'Platform deal — multi-year, strategic, or new market entry',
    ],
    coachingTip:
      'Strategic value can justify accepting thinner Phase 1 margin — if the expansion path is real and explicit. "We\'ll win the account and upsell later" is a strategy, not a plan. If strategic value is the justification for below-market pricing, document the expansion opportunity and the timeline in the internal commercial review.',
  },

  // ══════════════════════════════════════════════════════════
  // SECTION I — Our Delivery Capability  (→ VF)
  // INTERNAL ONLY — not shown in client-facing exports
  // ══════════════════════════════════════════════════════════
  {
    id: 'I1',
    section: 'I',
    sectionTitle: 'Our Delivery Capability',
    axis: 'VF',
    text: 'Do we have proven, delivered capability in this specific work type and technology stack?',
    scaleLabels: [
      'No — first delivery in this domain',
      'Adjacent experience only',
      'Some delivered projects, limited depth',
      'Delivered multiple similar projects',
      'Deep expertise — recognised capability with references',
    ],
    coachingTip:
      'Winning a deal you can\'t staff is worse than losing it. Capability gaps create delivery risk that will materialise as margin erosion and reputational damage. If you are stretching into a new domain, price it, document it in an internal risk waiver, and get delivery lead sign-off.',
    internalOnly: true,
    quickScore: true,
  },
  {
    id: 'I2',
    section: 'I',
    sectionTitle: 'Our Delivery Capability',
    axis: 'VF',
    text: 'Do we have the right people available — named, confirmed, not bench-dependent?',
    scaleLabels: [
      'Key roles unfilled — hiring required',
      'Some roles need bench sourcing or new hires',
      'Mostly available with 1–2 gaps',
      'Team mostly ready — minor confirmations needed',
      'Full team confirmed, available, no ramp-up required',
    ],
    coachingTip:
      'People availability is the most frequently misrepresented factor in the presales-to-delivery handoff. "We\'ll have the right team" is not a staffing plan. Named, confirmed, available people — before the proposal goes out — is the delivery lead\'s most important contribution to presales.',
    internalOnly: true,
  },
  {
    id: 'I3',
    section: 'I',
    sectionTitle: 'Our Delivery Capability',
    axis: 'VF',
    text: 'Has the delivery lead reviewed this deal and signed off that it is deliverable?',
    scaleLabels: [
      'No delivery involvement in presales',
      'Delivery consulted informally',
      'Delivery reviewed scope only',
      'Delivery reviewed scope and timeline',
      'Delivery lead signed off on the full proposal — scope, timeline, and assumptions',
    ],
    coachingTip:
      'Delivery sign-off is not a bureaucratic step — it\'s the single most important risk control in presales. The handoff from presales to delivery is where over-promising meets under-resourcing. A delivery lead who has reviewed and accepted the deal co-owns the outcome from day one.',
    internalOnly: true,
    quickScore: true,
  },

  // ══════════════════════════════════════════════════════════
  // SECTION J — Change Management  (→ CM)
  // Triggered for brownfield / transformation work types
  // ══════════════════════════════════════════════════════════
  {
    id: 'J1',
    section: 'J',
    sectionTitle: 'Change Management',
    axis: 'CM',
    text: 'How much organisational change does this project require, and is it sponsored?',
    scaleLabels: [
      'Major transformation — no executive sponsor',
      'Significant change — sponsor named but disengaged',
      'Moderate change — sponsor engaged but limited influence',
      'Significant change — strong, engaged sponsor',
      'Minor change, or fully sponsored with active executive drive',
    ],
    coachingTip:
      'ERP migrations and platform rollouts fail at go-live because of people, not technology. An engaged sponsor who visibly champions the change is one of the strongest delivery accelerants you can have. Nominal sponsorship — a VP on the project name but absent from steering — is one of the most reliable predictors of change programme failure.',
    triggerWorkTypes: [
      'mig-erp-crm', 'mig-replatform', 'mod-re-arch', 'mod-cloud-native',
      'mod-api-enable', 'mod-ui-ux', 'int-esb', 'bf-ams',
    ],
  },
  {
    id: 'J2',
    section: 'J',
    sectionTitle: 'Change Management',
    axis: 'CM',
    text: 'Is change management budgeted as a workstream — and what is the user adoption risk?',
    scaleLabels: [
      'No budget, no plan — known user resistance',
      'No budget — mixed user sentiment',
      'Partially budgeted — moderate resistance',
      'Fully budgeted — users mostly supportive',
      'Dedicated resource and plan — users pulling for this change',
    ],
    coachingTip:
      'If change management isn\'t budgeted as a workstream, it becomes the vendor\'s unpaid problem at go-live. User adoption risk is not a post-go-live problem — it\'s a design problem. Systems designed without user input face resistance that looks like a quality problem but is an adoption problem.',
    triggerWorkTypes: [
      'mig-erp-crm', 'mig-replatform', 'mod-re-arch', 'mod-cloud-native',
      'mod-api-enable', 'mod-ui-ux', 'int-esb',
    ],
  },

  // ══════════════════════════════════════════════════════════
  // SECTION K — Regulatory & Compliance  (→ TC + CR)
  // Auto-surfaced if regulated data selected in Intake
  // ══════════════════════════════════════════════════════════
  {
    id: 'K1',
    section: 'K',
    sectionTitle: 'Regulatory & Compliance',
    axis: 'CR',
    text: 'Are compliance requirements (GDPR, HIPAA, PCI, data residency) scoped and priced?',
    scaleLabels: [
      'Client unaware of their own compliance obligations',
      'Known obligations — not scoped or priced',
      'Scoped but not priced',
      'Scoped and estimated',
      'Fully defined, priced, and contractually included',
    ],
    coachingTip:
      'Unpriced compliance work is the silent margin destroyer. Security controls, audit logging, data anonymisation, and access management individually look small but accumulate to 15–25% of total effort on regulated projects. Every compliance requirement must be in scope, priced, and defined before the contract is signed.',
  },
  {
    id: 'K2',
    section: 'K',
    sectionTitle: 'Regulatory & Compliance',
    axis: 'TC',
    text: 'Are there security audits, pen tests, or data residency constraints — and are they planned?',
    scaleLabels: [
      'Security audit required — not scoped, tight deadline, residency undefined',
      'Audit scoped — residency not addressed',
      'Audit and residency addressed but timeline tight',
      'Audit fully planned and residency designed for',
      'No audit required / already certified / no residency constraint',
    ],
    coachingTip:
      'Security audits have a fixed lead time — typically 4–8 weeks for scheduling, execution, and remediation. Data residency affects every architectural decision. Both must be Day 1 design constraints, not discoveries mid-project. "We\'ll handle it later" typically means retrofitting compliance onto an architecture not designed for it.',
  },

  // ══════════════════════════════════════════════════════════
  // SECTION L — Partner & Ecosystem Dependencies  (→ TC)
  // Auto-surfaced if a technology partner is selected in Intake
  // ══════════════════════════════════════════════════════════
  {
    id: 'L1',
    section: 'L',
    sectionTitle: 'Partner & Ecosystem Dependencies',
    axis: 'TC',
    text: 'How stable is the partner\'s roadmap, and does this deal depend on certs or discounts we don\'t yet hold?',
    scaleLabels: [
      'Major platform change expected during delivery + critical cert/discount dependency unconfirmed',
      'Roadmap uncertain + significant dependency in progress',
      'Stable roadmap — minor dependency, manageable',
      'Stable roadmap — dependency in place',
      'Fully stable — no roadmap or dependency risk',
    ],
    coachingTip:
      'Building on a platform whose roadmap will change mid-delivery is building on shifting foundations. Partner discounts not yet confirmed mean your margin isn\'t real. Certifications "in progress" are not certifications. Confirm all dependencies before the proposal goes out — not after.',
  },
  {
    id: 'L2',
    section: 'L',
    sectionTitle: 'Partner & Ecosystem Dependencies',
    axis: 'TC',
    text: 'If other SIs / vendors are involved — is the scope boundary between parties clearly defined?',
    scaleLabels: [
      'No definition — significant overlap and gap risk',
      'Loosely defined — disputes likely',
      'Mostly defined — some grey areas',
      'Well defined — documented interfaces',
      'No other vendors / fully defined with written SLAs',
    ],
    coachingTip:
      'Multi-vendor programmes are where scope falls through the gaps. Every boundary between your team and another team is a potential dispute. Who owns the interface? Who resolves conflicts? Who does the client call when it breaks at 2am? These must have written answers before a fixed-price contract is signed.',
  },

  // ══════════════════════════════════════════════════════════
  // SECTION M — Post-Delivery & Hypercare  (→ CR + SC)
  // ══════════════════════════════════════════════════════════
  {
    id: 'M1',
    section: 'M',
    sectionTitle: 'Post-Delivery & Hypercare',
    axis: 'CR',
    text: 'Is hypercare / warranty defined — scope, duration, SLA, and who pays?',
    scaleLabels: [
      'Nothing defined — open-ended obligation expected',
      'Informally agreed — scope vague',
      'Duration defined — scope and SLA unclear',
      'Duration and scope defined — not yet priced',
      'Fully defined, priced, and contractually bounded with a clean exit',
    ],
    coachingTip:
      'Undefined hypercare becomes a free extension of the fixed-price contract. The most common delivery margin leak: a 4-week hypercare becomes a 12-week free support engagement because nobody defined "done." The contract\'s definition of project close is as important as its definition of project start.',
  },
  {
    id: 'M2',
    section: 'M',
    sectionTitle: 'Post-Delivery & Hypercare',
    axis: 'SC',
    text: 'Is there a clear transition to AMS / BAU — and is the warranty / defect scope defined?',
    scaleLabels: [
      'Nothing defined — vague warranty, no transition plan',
      'Transition discussed — warranty period defined, scope vague',
      'Transition planned — warranty scope partially defined',
      'Transition and warranty both defined with period and scope',
      'Fully defined — warranty exclusions, SLAs, and AMS/exit plan agreed',
    ],
    coachingTip:
      'An undefined transition means the client will call on your team long after the project closes. A warranty with no scope definition is an open-ended commitment. Define the exit or define the AMS — but define something. "We\'ll sort it out at go-live" is not a post-delivery plan.',
  },
]

// ── Quick Score subset ─────────────────────────────────────
export const QUICK_SCORE_QUESTION_IDS: string[] = QUESTIONS
  .filter((q) => q.quickScore)
  .map((q) => q.id)

// ── Merged questions (base + work-type-specific) ────────────
import { WORK_TYPE_QUESTIONS } from './workTypeQuestions'

export function getAllQuestionsForDeal(workType?: string): Question[] {
  const extras = workType
    ? WORK_TYPE_QUESTIONS.filter(q => !q.triggerWorkTypes || q.triggerWorkTypes.includes(workType))
    : []
  return [...QUESTIONS, ...extras]
}

// ── Sections index ─────────────────────────────────────────
export const SECTIONS: { id: string; title: string; axis: string; internalOnly?: boolean }[] = [
  { id: 'A', title: 'Client & Delivery Readiness', axis: 'CM' },
  { id: 'B', title: 'Scope & Requirements', axis: 'SC' },
  { id: 'C', title: 'Commercial & Timeline', axis: 'CR/SC' },
  { id: 'E', title: 'Governance & Decision-Making', axis: 'GR' },
  { id: 'F', title: 'Technical Landscape', axis: 'TC' },
  { id: 'G', title: 'Competitive Position & Strategic Value', axis: 'CP/SV' },
  { id: 'I', title: 'Our Delivery Capability', axis: 'VF', internalOnly: true },
  { id: 'J', title: 'Change Management', axis: 'CM' },
  { id: 'K', title: 'Regulatory & Compliance', axis: 'TC/CR' },
  { id: 'L', title: 'Partner & Ecosystem Dependencies', axis: 'TC' },
  { id: 'M', title: 'Post-Delivery & Hypercare', axis: 'CR/SC' },
]
