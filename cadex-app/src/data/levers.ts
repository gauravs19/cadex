// ============================================================
// CADEX — Deal Shaping Levers Catalogue
// Each lever defines its trigger condition and priority function
// based on axis scores, enabling the shaperEngine to dynamically
// rank the most relevant levers for a given deal profile.
// ============================================================

import type { AxisScores, Lever } from '../types'

// ── Axis score shorthand ──────────────────────────────────────

function sc(s: AxisScores) { return s.SC }
function cm(s: AxisScores) { return s.CM }
function cr(s: AxisScores) { return s.CR }
function tc(s: AxisScores) { return s.TC }
function gr(s: AxisScores) { return s.GR }
function sv(s: AxisScores) { return s.SV }
function cp(s: AxisScores) { return s.CP }
function vf(s: AxisScores) { return s.VF }

// ── Lever Catalogue ───────────────────────────────────────────

export const LEVERS: Lever[] = [

  // ── SCOPE levers ──────────────────────────────────────────

  {
    id: 'L-SC-01',
    category: 'scope',
    title: 'Mandate a paid discovery / scoping sprint',
    rationale:
      'Scope clarity is too low to price confidently. A time-boxed discovery phase reduces risk for both parties and is a billable engagement.',
    action:
      'Propose a 2–4 week paid discovery sprint before fixed-price commitment. Deliverable: a prioritised backlog, architecture decision record, and revised cost estimate.',
    contractLanguage:
      'The Parties agree that a Discovery Phase ("Phase 0") shall be completed prior to commencement of delivery. Phase 0 is a separate engagement with fixed time and budget. Findings from Phase 0 shall inform a revised Statement of Work, which requires written acceptance by both Parties before Phase 1 commences.',
    triggerCondition: (s: AxisScores) => sc(s) < 3,
    priority: (s: AxisScores) => 10 - sc(s) * 2 + (cr(s) < 3 ? 2 : 0),
  },

  {
    id: 'L-SC-02',
    category: 'scope',
    title: 'Introduce a formal scope freeze and change control clause',
    rationale:
      'Scope is vulnerable to post-contract growth. A contractual change control mechanism is the primary protection against margin-destroying scope creep.',
    action:
      'Draft a scope freeze clause requiring written CRs for any new requirement. Specify CR assessment SLA (3 business days), approval chain, and pricing mechanism.',
    contractLanguage:
      'Any change to the agreed Statement of Work requires a written Change Request (CR) signed by both Parties. CRs shall be assessed within 3 business days. Unapproved changes shall not be implemented. Scope additions shall be priced separately from the base contract.',
    triggerCondition: (s: AxisScores) => sc(s) < 4,
    priority: (s: AxisScores) => 8 - sc(s),
  },

  {
    id: 'L-SC-03',
    category: 'scope',
    title: 'Document explicit scope exclusions in the proposal',
    rationale:
      'Undocumented assumptions become expected deliverables. Explicit exclusions create a legal and commercial boundary.',
    action:
      'Create a dedicated "Scope Exclusions" section in the SoW listing all items that are out-of-scope and subject to separate pricing.',
    contractLanguage:
      'The following items are expressly excluded from this Statement of Work and shall be treated as separate engagements: [list]. Any request to include excluded items shall be treated as a Change Request.',
    triggerCondition: (s: AxisScores) => sc(s) < 4 || tc(s) < 3,
    priority: (s: AxisScores) => (5 - sc(s)) + (5 - tc(s)) * 0.5,
  },

  {
    id: 'L-SC-04',
    category: 'scope',
    title: 'Define a MoSCoW priority framework with the client',
    rationale:
      'Prioritisation gaps mean all features are treated as equal priority. MoSCoW establishes a negotiation mechanism before scope disputes arise.',
    action:
      'Facilitate a 2-hour MoSCoW workshop with the client before proposal. Document Must-Haves as the contractual core; Should/Could as backlog candidates.',
    triggerCondition: (s: AxisScores) => sc(s) < 4 && cm(s) < 4,
    priority: (s: AxisScores) => (5 - sc(s)) * 1.5,
  },

  // ── COMMERCIAL levers ─────────────────────────────────────

  {
    id: 'L-CR-01',
    category: 'commercial',
    title: 'Cap liquidated damages at 10% of contract value',
    rationale:
      'Uncapped LDs transfer unlimited delay risk to the vendor. A cap protects commercial viability and is standard industry practice.',
    action:
      'Negotiate LD cap to 10–15% of total contract value. Ensure force majeure and client-caused delay carve-outs are included.',
    contractLanguage:
      'In the event of delay attributable solely to Vendor, liquidated damages shall not exceed 10% (ten percent) of the total contract value. No damages shall accrue for delays caused by Client, third parties, or force majeure events.',
    triggerCondition: (s: AxisScores) => cr(s) < 3,
    priority: (s: AxisScores) => (5 - cr(s)) * 2,
  },

  {
    id: 'L-CR-02',
    category: 'commercial',
    title: 'Structure milestone-based payments with upfront mobilisation fee',
    rationale:
      'Back-loaded payments create cash flow risk and give the client leverage to dispute at the worst moment.',
    action:
      'Restructure payment plan: 20% mobilisation on signature, 60% across delivery milestones, 20% on final acceptance. Ensure milestones are phase-based, not feature-based.',
    contractLanguage:
      'Payment Schedule: (a) 20% of total contract value upon contract signature ("Mobilisation Fee"); (b) 60% in milestone payments as per Exhibit A; (c) 20% upon Final Acceptance. Milestone payments are triggered by phase completion, not individual feature delivery.',
    triggerCondition: (s: AxisScores) => cr(s) < 3 || sc(s) < 3,
    priority: (s: AxisScores) => (5 - cr(s)) * 1.8,
  },

  {
    id: 'L-CR-03',
    category: 'commercial',
    title: 'Add a commercial risk contingency (10–15%) to the quoted price',
    rationale:
      'Deals with scope ambiguity or technical unknowns should carry an explicit risk contingency to protect margin.',
    action:
      'Add a named risk contingency line item to the internal pricing model. Do not reveal the full contingency in the proposal — hold it internally.',
    triggerCondition: (s: AxisScores) => cr(s) < 4 || sc(s) < 3 || tc(s) < 3,
    priority: (s: AxisScores) => (5 - cr(s)) + (5 - sc(s)) * 0.5,
  },

  {
    id: 'L-CR-04',
    category: 'commercial',
    title: 'Define and price the hypercare / warranty period explicitly',
    rationale:
      'An undefined warranty period becomes an open-ended free support commitment. Clear boundaries protect post-delivery margin.',
    action:
      'Define the warranty period (standard: 60 days), scope (defects only, not new features), and SLA in the contract. Price support beyond warranty as a separate AMS engagement.',
    contractLanguage:
      'Vendor warrants that deliverables will conform to the agreed acceptance criteria for a period of 60 (sixty) days after Final Acceptance ("Warranty Period"). The Warranty covers defects only. Feature requests, configuration changes, and new requirements are excluded and subject to separate pricing.',
    triggerCondition: (s: AxisScores) => cr(s) < 4,
    priority: (s: AxisScores) => (5 - cr(s)),
  },

  {
    id: 'L-CR-05',
    category: 'commercial',
    title: 'Introduce a time-and-materials cap as a commercial safety net',
    rationale:
      'On deals with scope ambiguity, a T&M cap mechanism provides a fixed ceiling while maintaining flexibility.',
    action:
      'Propose a T&M-capped model: work is billed at actuals up to a defined ceiling. Scope changes trigger a new cap negotiation.',
    contractLanguage:
      'Engagement fees shall be calculated on a time-and-materials basis at the rates set out in Schedule A, subject to a maximum ceiling of [AMOUNT] ("Cap"). Work approaching the Cap shall trigger a written review and, if required, a revised estimate.',
    triggerCondition: (s: AxisScores) => sc(s) < 3 && cr(s) < 4,
    priority: (s: AxisScores) => (5 - sc(s)) * 1.5 + (5 - cr(s)),
  },

  // ── GOVERNANCE levers ─────────────────────────────────────

  {
    id: 'L-GR-01',
    category: 'governance',
    title: 'Contractually require a named, empowered Product Owner',
    rationale:
      'No PO is the #1 agile delivery failure mode. A contractual PO requirement shifts the governance obligation to the client.',
    action:
      'Include a clause requiring the client to name a Product Owner with defined decision authority. Specify that failure to provide a PO within 5 days of contract start entitles Vendor to pause delivery.',
    contractLanguage:
      'Client shall designate a named Product Owner ("PO") with authority to approve sprint backlog items and accept deliverables. The PO shall be available for a minimum of [X] hours per sprint. Failure to provide an empowered PO within 5 (five) business days of the Start Date entitles Vendor to pause delivery until a PO is designated.',
    triggerCondition: (s: AxisScores) => gr(s) < 3 || cm(s) < 3,
    priority: (s: AxisScores) => (5 - gr(s)) * 2 + (5 - cm(s)) * 0.5,
  },

  {
    id: 'L-GR-02',
    category: 'governance',
    title: 'Define a steering committee with monthly executive cadence',
    rationale:
      'Without executive oversight, escalations stall and delivery blockers persist. A formal steering cadence creates an escalation path.',
    action:
      'Propose a monthly steering committee with defined agenda (status, risks, scope, commercial). Include attendance obligation for named sponsors in the contract.',
    contractLanguage:
      'The Parties shall establish a Steering Committee meeting monthly. The Steering Committee shall include [named sponsor] from Client and [Account Director] from Vendor. The Steering Committee shall have authority to approve Change Requests up to [threshold] without further escalation.',
    triggerCondition: (s: AxisScores) => gr(s) < 4,
    priority: (s: AxisScores) => (5 - gr(s)) * 1.5,
  },

  {
    id: 'L-GR-03',
    category: 'governance',
    title: 'Contractualise decision SLAs to prevent delivery stall',
    rationale:
      'Undefined decision turnaround times become delivery blockers. A contractual decision SLA protects the timeline.',
    action:
      'Define maximum decision turnaround time (3 business days for scope/design, 1 day for sprint acceptance). Specify that missed SLAs result in automatic deferral and timeline extension.',
    contractLanguage:
      'Client shall respond to decision requests from Vendor within 3 (three) business days for scope and design decisions, and within 1 (one) business day for sprint acceptance decisions. Failure to respond within the specified SLA shall be treated as approval of the proposed approach, unless Client provides a written objection.',
    triggerCondition: (s: AxisScores) => gr(s) < 4 || cm(s) < 3,
    priority: (s: AxisScores) => (5 - gr(s)) * 1.8,
  },

  {
    id: 'L-GR-04',
    category: 'governance',
    title: 'Establish a weekly delivery health check with RAID reporting',
    rationale:
      'Without formal risk reporting, delivery risks are hidden until they become crises. A structured RAID process surfaces issues early.',
    action:
      'Implement a weekly RAID log review as part of the governance cadence. Share with steering committee monthly. Define escalation path for red-rated risks.',
    triggerCondition: (s: AxisScores) => gr(s) < 3,
    priority: (s: AxisScores) => (5 - gr(s)) * 2,
  },

  // ── RISK levers ───────────────────────────────────────────

  {
    id: 'L-TC-01',
    category: 'risk',
    title: 'Time-box technical unknowns with a dedicated spike',
    rationale:
      'Unresolved technical unknowns in a fixed-price deal are budget unknowns. Spikes convert unknowns to costs.',
    action:
      'Identify all technical unknowns from the SoW and allocate 1–3 day time-boxed spikes. Include spike findings in the proposal as scope assumptions.',
    triggerCondition: (s: AxisScores) => tc(s) < 3,
    priority: (s: AxisScores) => (5 - tc(s)) * 2,
  },

  {
    id: 'L-TC-02',
    category: 'risk',
    title: 'Document all third-party integration assumptions',
    rationale:
      'Undocumented integration assumptions become the vendor\'s liability. Explicit assumptions create a change request trigger.',
    action:
      'For every integration point, document: API availability, authentication mechanism, data format, SLA, and owner. Include all assumptions in the SoW as contractual assumptions.',
    contractLanguage:
      'The following integration assumptions form part of this SoW. Any material deviation from these assumptions shall constitute a Change Request: [list of assumptions per integration point].',
    triggerCondition: (s: AxisScores) => tc(s) < 4,
    priority: (s: AxisScores) => (5 - tc(s)) * 1.5,
  },

  {
    id: 'L-TC-03',
    category: 'risk',
    title: 'Add a technical risk contingency for data quality / legacy discovery',
    rationale:
      'Data quality and legacy code surprises are the most common source of unplanned technical effort. An explicit contingency prevents margin erosion.',
    action:
      'Include a named "Technical Discovery Contingency" line item (5–10% of delivery estimate) for issues found during legacy system analysis or data quality assessment.',
    triggerCondition: (s: AxisScores) => tc(s) < 3,
    priority: (s: AxisScores) => (5 - tc(s)) * 1.8,
  },

  {
    id: 'L-TC-04',
    category: 'risk',
    title: 'Define environment provisioning SLAs',
    rationale:
      'Infrastructure delays are invisible in the estimate but visible in the delivery timeline. Contractual environment SLAs prevent client-caused delays.',
    action:
      'Include a clause requiring the client to provide development, test, and staging environments within 5 days of contract start. Specify SLA for environment availability during delivery.',
    contractLanguage:
      'Client shall provision development, test, and staging environments ("Environments") within 5 (five) business days of the Start Date. Environments shall be available during business hours with a minimum availability of 95%. Environment downtime exceeding [threshold] hours per sprint shall entitle Vendor to a timeline extension.',
    triggerCondition: (s: AxisScores) => tc(s) < 3 || gr(s) < 3,
    priority: (s: AxisScores) => (5 - tc(s)) + (5 - gr(s)) * 0.5,
  },

  // ── RELATIONSHIP levers ───────────────────────────────────

  {
    id: 'L-CP-01',
    category: 'relationship',
    title: 'Differentiate on delivery risk reduction, not price',
    rationale:
      'Low competitive position in an open competition means price pressure. Reframe the conversation from cost to risk — position GL as the lower-risk choice.',
    action:
      'Build a risk quantification narrative: what is the cost of a failed delivery? Reference comparable vendor failures. Price your governance and delivery model as risk mitigation.',
    triggerCondition: (s: AxisScores) => cp(s) < 3,
    priority: (s: AxisScores) => (5 - cp(s)) * 2,
  },

  {
    id: 'L-CP-02',
    category: 'relationship',
    title: 'Identify and brief an internal champion',
    rationale:
      'Without an internal champion, the proposal speaks to nobody. An advocate in the evaluation room changes win probability.',
    action:
      'Map the client stakeholder landscape. Identify the influencer closest to the decision-maker. Invest in a pre-proposal meeting or workshop to position GL as the thoughtful choice.',
    triggerCondition: (s: AxisScores) => cp(s) < 4,
    priority: (s: AxisScores) => (5 - cp(s)) * 1.5,
  },

  {
    id: 'L-SV-01',
    category: 'relationship',
    title: 'Frame the deal as a strategic partnership opportunity',
    rationale:
      'High strategic value deals justify executive-level engagement and investment in relationship capital above the deal.',
    action:
      'Escalate to executive sponsor level. Propose a joint strategic review meeting (pre-proposal) to demonstrate commitment to the client\'s long-term success, not just this project.',
    triggerCondition: (s: AxisScores) => sv(s) >= 4 && cp(s) >= 3,
    priority: (s: AxisScores) => sv(s) * 1.5 + cp(s),
  },

  {
    id: 'L-VF-01',
    category: 'risk',
    title: 'Name the delivery lead in the proposal',
    rationale:
      'A named, credentialed delivery lead signals execution confidence and reduces perceived delivery risk.',
    action:
      'Identify and commit the delivery lead before proposal submission. Include their bio, relevant references, and delivery philosophy in the proposal. Require delivery lead involvement in finalist presentations.',
    triggerCondition: (s: AxisScores) => vf(s) < 4,
    priority: (s: AxisScores) => (5 - vf(s)) * 2,
  },

  {
    id: 'L-VF-02',
    category: 'risk',
    title: 'Conduct an internal capability review before bidding',
    rationale:
      'Capability gaps discovered after contract signature are margin-destroying. An internal review before bid is the only risk-free point to assess feasibility.',
    action:
      'Schedule a 1-hour internal review: confirm team availability, technology capability, reference projects, and escalation path for gaps. Document findings in an internal risk register.',
    triggerCondition: (s: AxisScores) => vf(s) < 3,
    priority: (s: AxisScores) => (5 - vf(s)) * 2.5,
  },
]
