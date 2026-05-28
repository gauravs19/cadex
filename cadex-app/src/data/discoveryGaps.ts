import type { DiscoveryGapItem } from '../types'

export const DISCOVERY_GAPS: DiscoveryGapItem[] = [

  // ── Scope & Requirements ──────────────────────────────────────
  {
    id: 'DG-SC-01',
    category: 'scope',
    question: 'Has the client shared a full requirements document, agreed backlog, or detailed user stories?',
    why: 'Estimates built on verbal descriptions inflate by 40–60% on average. No written requirements = unvalidated scope.',
  },
  {
    id: 'DG-SC-02',
    category: 'scope',
    question: 'Is there a clear, agreed MVP definition — signed off by the decision-maker, not just the project team?',
    why: 'Project-team-level MVP definitions get overruled by leadership at delivery. The decision-maker must own it.',
  },
  {
    id: 'DG-SC-03',
    category: 'scope',
    question: 'Are there conflicting requirements from different stakeholder groups that have not been resolved?',
    why: 'Unresolved internal conflicts become your problem after signing. Scope disputes between stakeholders cost more than scope disputes with the client.',
  },
  {
    id: 'DG-SC-04',
    category: 'scope',
    question: 'Are there features the client treats as "standard" or "obviously included" that have not been explicitly priced?',
    why: 'The most common fixed-price dispute trigger. Clients assume anything adjacent to the stated scope is included.',
  },
  {
    id: 'DG-SC-05',
    category: 'scope',
    question: 'Has a scope bank mechanism (equal-effort feature swaps) been explained to and accepted by the client?',
    why: 'If the client has not heard the words "scope bank" before signing, they will treat every change as a free addition.',
  },
  {
    id: 'DG-SC-06',
    category: 'scope',
    question: 'Have all third-party dependencies (APIs, platforms, data feeds) been named and their availability confirmed?',
    why: 'Undiscovered third-party dependencies are the most common source of unplanned timeline extensions.',
  },

  // ── Technical ────────────────────────────────────────────────
  {
    id: 'DG-TC-01',
    category: 'technical',
    question: 'Have we seen and assessed the existing system architecture — not just a slide deck summary?',
    why: '"We have a clean microservices architecture" is often aspirational. You need access to repos, diagrams, and deployment config.',
    triggerProjectNature: ['brownfield'],
  },
  {
    id: 'DG-TC-02',
    category: 'technical',
    question: 'Are the integration endpoints documented with working sandbox/test environments?',
    why: 'Integration work without test environments runs 2–3× over estimate. "We\'ll set up the sandbox" is not a confirmed dependency.',
    triggerWorkCategories: ['gf-pe', 'gf-platform', 'bf-integration', 'bf-modernisation'],
  },
  {
    id: 'DG-TC-03',
    category: 'technical',
    question: 'Has the technical debt level in the existing codebase been independently assessed?',
    why: 'Client self-assessments of technical debt are almost always optimistic. Unknown debt turns fixed-price brownfield into a loss-maker.',
    triggerProjectNature: ['brownfield'],
  },
  {
    id: 'DG-TC-04',
    category: 'technical',
    question: 'Are there known performance or scalability requirements that have been formally sized and costed?',
    why: 'Informal SLAs ("should handle peak load fine") are not priced. Non-functional requirements added post-contract are always disputes.',
  },
  {
    id: 'DG-TC-05',
    category: 'technical',
    question: 'Is the target infrastructure already contracted and accessible — or is it still pending procurement?',
    why: 'Infrastructure procurement delays are the most common cause of start-date slippage on platform and cloud engagements.',
    triggerWorkCategories: ['gf-platform', 'gf-pe', 'bf-migration', 'bf-modernisation'],
  },
  {
    id: 'DG-TC-06',
    category: 'technical',
    question: 'Is the training data available, labelled, and representative of production conditions?',
    why: 'AI projects without validated training data are research projects priced as delivery projects. This is the single largest risk in AI/ML fixed-price work.',
    triggerWorkCategories: ['gf-ai', 'bf-ai'],
  },
  {
    id: 'DG-TC-07',
    category: 'technical',
    question: 'Is there a clear, agreed definition of model success — accuracy threshold, bias criteria, business metric?',
    why: 'Without a signed-off success definition, "the model isn\'t good enough" is a subjective blocker to acceptance.',
    triggerWorkCategories: ['gf-ai', 'bf-ai'],
  },
  {
    id: 'DG-TC-08',
    category: 'technical',
    question: 'Has a data audit been completed — volume, format, quality, and cleansing requirements understood?',
    why: 'Data quality surprises are the single largest cause of migration and modernisation overruns.',
    triggerWorkCategories: ['bf-migration', 'bf-modernisation', 'bf-ai'],
  },
  {
    id: 'DG-TC-09',
    category: 'technical',
    question: 'Has a security and compliance architecture review been completed for the target environment?',
    why: 'Security requirements discovered post-design typically require architectural rework, not just a sprint of security hardening.',
  },

  // ── Governance & Client ───────────────────────────────────────
  {
    id: 'DG-GR-01',
    category: 'governance',
    question: 'Is the named Product Owner confirmed by name, available at the agreed cadence, and empowered to make prioritisation decisions?',
    why: 'A PO who "will be assigned" or "attends when available" is not a PO. This is the single most common governance failure in fixed-agile delivery.',
  },
  {
    id: 'DG-GR-02',
    category: 'governance',
    question: 'Who is the decision-maker for scope changes — and what is their typical response time for approvals?',
    why: 'If change approvals take 2 weeks, sprints effectively take 2 weeks. Decision latency should be mapped before sprint length is committed.',
  },
  {
    id: 'DG-GR-03',
    category: 'governance',
    question: 'Are there competing internal priorities, politics, or org restructures that could reduce client attention on this engagement?',
    why: 'Distracted clients miss reviews, delay decisions, and change priorities. This is an informal risk that rarely appears in the RFP but always appears in delivery.',
  },
  {
    id: 'DG-GR-04',
    category: 'governance',
    question: 'Has client attendance at sprint reviews been confirmed as a contractual commitment — not just a courtesy?',
    why: 'Clients who miss reviews accumulate deferred feedback. Deferred feedback becomes end-of-project disputes.',
  },
  {
    id: 'DG-GR-05',
    category: 'governance',
    question: 'Have all key stakeholders been identified and do they share the same definition of success?',
    why: 'Stakeholder misalignment that is unresolved pre-contract becomes your problem to manage during delivery, at your cost.',
  },
  {
    id: 'DG-GR-06',
    category: 'governance',
    question: 'Is there a receiving team confirmed for knowledge transfer and BAU handoff?',
    why: 'KT without a named, available receiving team is not KT — it is documentation that no one reads.',
    triggerWorkCategories: ['gf-dx', 'gf-pe', 'gf-platform', 'bf-modernisation', 'bf-migration'],
  },

  // ── Commercial ───────────────────────────────────────────────
  {
    id: 'DG-CR-01',
    category: 'commercial',
    question: 'Is the budget formally approved and signed off at the right authority level — or is it still "expected to be approved"?',
    why: '"Pending approval" budgets get cut, delayed, or scoped down after contract negotiations are advanced. Approval status should be confirmed before significant presales investment.',
  },
  {
    id: 'DG-CR-02',
    category: 'commercial',
    question: 'Has the client been explicitly told this is a fixed price with a scope bank — not a "build everything until the money runs out" contract?',
    why: 'The single most important presales conversation. If the client believes fixed price means "all features, no matter how many," the contract is already in dispute.',
  },
  {
    id: 'DG-CR-03',
    category: 'commercial',
    question: 'Are there procurement, legal, or audit clauses in the contract template we haven\'t reviewed yet?',
    why: 'Standard enterprise MSAs often contain IP ownership, unlimited liability, or audit rights clauses that materially change the risk profile.',
  },
  {
    id: 'DG-CR-04',
    category: 'commercial',
    question: 'Have non-technical cost items been explicitly priced: governance, documentation, UAT support, environment setup, project management?',
    why: 'These items represent 15–25% of delivery cost on typical engagements. They are routinely omitted from estimates and absorbed by delivery teams as unrecovered overhead.',
  },
  {
    id: 'DG-CR-05',
    category: 'commercial',
    question: 'Is the price under pressure from a competitive bid, and has that pressure been declared internally?',
    why: 'Undeclared price compression at the deal level destroys margin that was modelled at the portfolio level. Commercial leadership needs visibility.',
  },

  // ── Delivery & Resources ──────────────────────────────────────
  {
    id: 'DG-DL-01',
    category: 'delivery',
    question: 'Have we confirmed the delivery team composition and individual availability for the proposed start date?',
    why: 'A team plan that depends on named individuals being available on a specific date is a critical path risk. Availability should be confirmed, not assumed.',
  },
  {
    id: 'DG-DL-02',
    category: 'delivery',
    question: 'Are there key delivery roles we are planning to hire for — and is that dependency documented as a risk?',
    why: '"We will hire" in a key delivery role is an invisible risk. Hiring timelines under pressure are unpredictable.',
  },
  {
    id: 'DG-DL-03',
    category: 'delivery',
    question: 'Do any subcontractors have single-supplier dependencies on critical delivery components?',
    why: 'A subcontractor failure on a critical path is a delivery failure. Subcontractor reliability should be assessed before bid submission, not after contract signing.',
  },
  {
    id: 'DG-DL-04',
    category: 'delivery',
    question: 'Does the client\'s environment require security clearance, VPN onboarding, or access provisioning that could delay project start?',
    why: 'Enterprise onboarding delays of 4–8 weeks are common. If sprint 1 can\'t start on time, the entire timeline shifts.',
  },
  {
    id: 'DG-DL-05',
    category: 'delivery',
    question: 'Has the delivery lead reviewed and signed off on this proposal — not just the presales team?',
    why: 'A proposal signed without delivery lead review has an unknown delivery risk. This is a hard blocker in the Deal Checker for good reason.',
  },
  {
    id: 'DG-DL-06',
    category: 'delivery',
    question: 'Is there a cutover plan — and have the risks of running old and new systems in parallel been scoped?',
    why: 'Parallel-run periods on migrations and modernisations are routinely underestimated in both effort and duration.',
    triggerWorkCategories: ['bf-migration', 'bf-modernisation'],
  },
  {
    id: 'DG-DL-07',
    category: 'delivery',
    question: 'Is there a rollback plan — and has the trigger criteria for invoking it been agreed with the client?',
    why: 'Without an agreed rollback trigger, both sides avoid pulling it too long, turning a recoverable failure into an unrecoverable one.',
    triggerWorkCategories: ['bf-migration'],
  },
  {
    id: 'DG-DL-08',
    category: 'delivery',
    question: 'Is there an MLOps capability on the client side to own, retrain, and monitor the model post-delivery?',
    why: 'AI models without post-delivery ownership degrade silently and generate support obligations that were never priced.',
    triggerWorkCategories: ['gf-ai', 'bf-ai'],
  },
]

export const DISCOVERY_GAP_CATEGORIES: Record<DiscoveryGapItem['category'], { label: string; color: string; bg: string }> = {
  scope:      { label: 'Scope & Requirements', color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200' },
  technical:  { label: 'Technical',            color: 'text-violet-700', bg: 'bg-violet-50 border-violet-200' },
  governance: { label: 'Governance & Client',  color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200' },
  commercial: { label: 'Commercial',           color: 'text-green-700',  bg: 'bg-green-50 border-green-200' },
  delivery:   { label: 'Delivery & Resources', color: 'text-red-700',    bg: 'bg-red-50 border-red-200' },
}
