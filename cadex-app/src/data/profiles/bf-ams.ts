// ============================================================
// CADEX — Work Type Profiles: Application Management & Support
// ============================================================

import type { WorkTypeProfile } from '../../types'

export const BF_AMS_PROFILES: WorkTypeProfile[] = [

  // ── ams-run: Run & Maintain (steady-state support) ───────────

  {
    workTypeId: 'ams-run',
    axisModifiers: { CR: 1.4, GR: 1.3, SC: 1.1 },
    questions: [
      {
        id: 'WT-AMS-R1',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'SC',
        text: 'Is the scope of "support" formally defined — with explicit examples distinguishing break-fix from enhancements, and a change request process with an agreed SLA for classification disputes?',
        scaleLabels: [
          'No distinction between support and development; all requests treated as in scope',
          'Verbal understanding of the boundary; no documented examples or classification process',
          'Boundary described in SOW but examples are generic; classification disputes expected',
          'Support vs enhancement boundary documented with specific examples; CR process defined',
          'Contractually defined scope with classification matrix, dispute resolution, and SLA for decisions'
        ],
        coachingTip: 'The most common AMS dispute is whether something is a bug (in scope) or an enhancement (chargeable). Resolve this with explicit worked examples in the contract — not general language. A "bug" that improves behaviour not in the original spec is an enhancement.',
        triggerWorkTypes: ['ams-run', 'bf-ams-other'],
      },
      {
        id: 'WT-AMS-R2',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'CR',
        text: 'Is there a documented incident volume and severity baseline from the previous 6–12 months — and has capacity been sized against this baseline, not optimistic projections?',
        scaleLabels: [
          'No baseline data; incident volume being estimated from conversations',
          'Rough estimate from the client but no historical data to validate it',
          'Some historical data available; coverage incomplete; major seasonal patterns unknown',
          'Baseline data available for 6+ months; major patterns and peaks identified',
          'Full 12-month baseline with severity breakdown; capacity model validated against actuals'
        ],
        coachingTip: 'AMS contracts sized against optimistic incident projections result in under-resourced teams that miss SLAs from month one. Insist on 6 months of historical incident data before sizing. If data doesn\'t exist, include a shadow period as a paid discovery phase.',
        triggerWorkTypes: ['ams-run', 'bf-ams-other'],
      },
      {
        id: 'WT-AMS-R3',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'GR',
        text: 'Are SLA tiers (P1/P2/P3/P4), response and resolution targets, escalation paths, and the client\'s obligation to provide timely access and decisions formally agreed?',
        scaleLabels: [
          'No SLA tiers defined; all incidents treated with the same urgency',
          'SLA tiers described verbally; response and resolution times not documented',
          'Tiers defined but client obligation (access, decision timing) not included',
          'SLA tiers, response/resolution targets, and client obligations documented',
          'Full SLA framework with tiers, targets, client obligations, financial remedies, and exclusions'
        ],
        coachingTip: 'AMS SLA breaches become liability disputes when client actions (slow approvals, environment access delays) are not documented as exclusions. Write client obligations into the SLA framework explicitly — your SLA clock should stop when the client is blocking resolution.',
        triggerWorkTypes: ['ams-run', 'bf-ams-other'],
      },
    ],
  },

  // ── ams-enhancements: Enhancements & Minor Dev ──────────────

  {
    workTypeId: 'ams-enhancements',
    axisModifiers: { SC: 1.3, CR: 1.2, GR: 1.1 },
    questions: [
      {
        id: 'WT-AMS-E1',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'SC',
        text: 'Is the size threshold for an "enhancement" vs a "minor project" formally defined — with a story point or effort ceiling, and a change-to-project escalation process?',
        scaleLabels: [
          'No size threshold; all enhancement requests treated within the same engagement',
          'Threshold exists informally but no documentation or escalation process',
          'Threshold discussed; story point guidance exists but escalation path unclear',
          'Effort ceiling documented; escalation to project process agreed with sponsor',
          'Full tiering with effort ceiling, escalation triggers, and project initiation process defined'
        ],
        coachingTip: 'Enhancement retainers without a size ceiling slowly absorb project-scale work at AMS rates. Define an effort ceiling (e.g. 40 story points per request) above which a formal project is initiated. Without this, scope will expand to fill the retainer.',
        triggerWorkTypes: ['ams-enhancements'],
      },
      {
        id: 'WT-AMS-E2',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'CR',
        text: 'Is the velocity commitment model agreed — points per sprint, carrying-over rules, and the process for when priorities shift mid-sprint or between sprint cycles?',
        scaleLabels: [
          'No velocity commitment; client expects all requests completed within each sprint regardless of size',
          'Velocity informally agreed; no carry-over rules; priority shifts handled ad hoc',
          'Points-per-sprint target set; carry-over process discussed but not documented',
          'Velocity commitment documented; carry-over rules agreed; mid-sprint priority change process defined',
          'Full velocity model with commitment, carry-over rules, priority change process, and burn-up tracking'
        ],
        coachingTip: 'Enhancement retainers where the client can reprioritise mid-sprint have no delivery predictability and generate constant escalations. Define a sprint commitment model — requests entering a sprint don\'t move unless they are P1 incidents.',
        triggerWorkTypes: ['ams-enhancements'],
      },
    ],
  },

  // ── ams-incident: Incident & Problem Management ──────────────

  {
    workTypeId: 'ams-incident',
    axisModifiers: { CR: 1.4, GR: 1.3, SC: 0.9 },
    questions: [
      {
        id: 'WT-AMS-I1',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'CR',
        text: 'Are liquidated damages or SLA credit exposure calculated and commercially acceptable — including assumptions about incident frequency, severity distribution, and exclusion clauses?',
        scaleLabels: [
          'LD exposure uncalculated; client is requesting aggressive SLAs with unlimited liability',
          'LD clause exists but exposure not modelled; frequency and severity assumptions not validated',
          'LD exposure estimated; exclusions partially negotiated; financial ceiling not agreed',
          'LD exposure modelled against baseline; exclusion clauses agreed; liability cap in contract',
          'Full LD model with capped liability, exclusions, force-majeure, and client-obligation offsets'
        ],
        coachingTip: 'An SLA with no liability cap and no client-obligation exclusions is an open-ended financial commitment. Model the worst-case LD exposure before signing and ensure exclusions cover client delays, third-party outages, and approved change-related incidents.',
        triggerWorkTypes: ['ams-incident'],
      },
      {
        id: 'WT-AMS-I2',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'GR',
        text: 'Is the escalation chain — from L1 to L2 to L3 to client-side resolver — named, available in the agreed time window, and tested before go-live of the support engagement?',
        scaleLabels: [
          'Escalation chain not defined; contacts informal; no guaranteed availability',
          'Escalation list exists on paper; availability and response time not tested or confirmed',
          'Escalation chain documented; on-call roster defined; availability confirmation pending',
          'Escalation chain documented and confirmed; availability tested in pre-go-live drill',
          'Escalation chain rehearsed; on-call tooling live; response time SLA tested and verified'
        ],
        coachingTip: 'The first major incident in a new AMS contract tests every assumption you made about escalation. Rehearse the full escalation chain — including the client\'s side — before go-live. Finding that the client\'s L2 contact left the company during a P1 is avoidable.',
        triggerWorkTypes: ['ams-incident'],
      },
    ],
  },

  // ── ams-testing: Managed Testing / QA ───────────────────────

  {
    workTypeId: 'ams-testing',
    axisModifiers: { CR: 1.2, SC: 1.2, GR: 1.1 },
    questions: [
      {
        id: 'WT-AMS-T1',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'CR',
        text: 'Is the defect SLA — including severity classification, response time, resolution time, and the process for disputed severity assignments — contractually defined?',
        scaleLabels: [
          'No defect SLA; all defects treated the same; resolution time expectations informal',
          'SLA mentioned in contract but severity definitions are generic; disputed classification likely',
          'Severity levels defined; response and resolution times set; dispute process not documented',
          'Defect SLA fully documented with severity definitions, resolution times, and dispute process',
          'SLA includes severity matrix with client examples, escalation path, and financial remedy per tier'
        ],
        coachingTip: 'The most disputed clause in a managed testing contract is who classifies defect severity. Include worked examples in the severity matrix — "a P1 is a defect that prevents users from completing the primary use case, for example..." — to eliminate ambiguity before it becomes a commercial dispute.',
        triggerWorkTypes: ['ams-testing'],
      },
      {
        id: 'WT-AMS-T2',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'TC',
        text: 'Is the test environment availability, stability, and data refresh cadence agreed — with explicit SLAs on environment uptime and a named client owner for environment issues?',
        scaleLabels: [
          'No environment SLA; test environments frequently unavailable or refreshed without notice',
          'Environment availability informally acknowledged; no formal SLA or named owner',
          'Environment uptime target discussed; refresh cadence agreed informally; owner not named',
          'Environment SLA defined; refresh cadence agreed; named owner identified and engaged',
          'Environment SLA contractually agreed; uptime monitored; refresh scheduled; owner co-located'
        ],
        coachingTip: 'Test environment downtime stops testing and extends delivery timelines — but it\'s not in your control. Treat environment availability as a client-obligation SLA and include it as an exclusion in your testing SLA. If the environment is down, your SLA clock stops.',
        triggerWorkTypes: ['ams-testing'],
      },
    ],
  },
]
