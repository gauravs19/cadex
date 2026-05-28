// ============================================================
// CADEX — Work Type Profiles: Greenfield Product Engineering
// Self-contained per-L3 definitions: axisModifiers + questions.
// Aggregated by profiles/index.ts → derived into axisWeights.ts
// and workTypeQuestions.ts. Extract to JSON when needed.
// ============================================================

import type { WorkTypeProfile } from '../../types'

export const GF_PE_PROFILES: WorkTypeProfile[] = [

  // ── pe-saas: SaaS Product (B2B or B2C) ──────────────────────

  {
    workTypeId: 'pe-saas',
    axisModifiers: { CM: 1.3, GR: 1.3, SV: 1.2, TC: 1.2 },
    questions: [
      {
        id: 'WT-PE-S1',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'CM',
        text: 'Is there a named, empowered Product Owner with a clear product vision, a prioritised backlog, and decision authority over feature trade-offs?',
        scaleLabels: [
          'No product owner identified; committee sign-off for every feature decision',
          'PO named but junior, part-time, or lacks authority to cut scope',
          'PO in place; available weekly; some features are politically untouchable',
          'Experienced PO, full-time, with authority to prioritise and descope',
          'Strong PO with published roadmap, empowered backlog control, and exec alignment'
        ],
        coachingTip: 'SaaS builds without an empowered PO accumulate features nobody uses and miss the core use case. A single empowered decision-maker is more valuable than any technical choice. Make PO availability a project pre-condition.',
        triggerWorkTypes: ['pe-saas', 'gf-pe-other'],
      },
      {
        id: 'WT-PE-S2',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'TC',
        text: 'Has multi-tenancy architecture been agreed — including tenant isolation model, data segregation strategy, and per-tenant customisation boundaries?',
        scaleLabels: [
          'Multi-tenancy not designed; client assumes "just add a tenant ID column"',
          'Shared-schema approach assumed with no isolation or performance analysis',
          'Isolation model debated; security and performance trade-offs not resolved',
          'Isolation model agreed (schema-per-tenant or row-level); design documented',
          'Multi-tenancy architecture reviewed, stress-tested, and signed off before build'
        ],
        coachingTip: 'Multi-tenancy architecture is the hardest decision to reverse in a SaaS build. Retrofitting tenant isolation after data model is in production is a project-stopping rework. Resolve it in sprint 0 — not sprint 10.',
        triggerWorkTypes: ['pe-saas', 'gf-pe-other'],
      },
      {
        id: 'WT-PE-S3',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'GR',
        text: 'Is the release strategy defined — including how feature flags, canary deployments, and customer-specific rollouts will be managed without breaking existing tenants?',
        scaleLabels: [
          'No release strategy; expecting big-bang deployments to all tenants simultaneously',
          'Release cadence discussed informally; no feature flag or rollout tooling planned',
          'Feature flags considered; rollout approach under discussion; tooling not selected',
          'Feature flag framework selected; canary rollout process defined; rollback tested',
          'Full release automation with tenant ring deployment, feature flags, and zero-downtime deploys'
        ],
        coachingTip: 'A SaaS platform that pushes a breaking change to all tenants simultaneously has a P1 incident on day one. Release governance is not optional scope — it is the operational contract with your tenants.',
        triggerWorkTypes: ['pe-saas', 'gf-pe-other'],
      },
    ],
  },

  // ── pe-embedded: Embedded / IoT Product ─────────────────────

  {
    workTypeId: 'pe-embedded',
    axisModifiers: { TC: 1.5, SC: 1.3, CR: 1.2 },
    questions: [
      {
        id: 'WT-PE-E1',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'TC',
        text: 'Are hardware dependencies — prototyping boards, target silicon, development kits, and third-party firmware — confirmed, procured, and available to the delivery team?',
        scaleLabels: [
          'Target hardware not finalised; silicon selection still under evaluation',
          'Hardware selected but not procured; lead times unknown; delivery team blocked',
          'Hardware ordered; lead time known; some components at risk of delay',
          'Hardware available to most of the team; minor procurement gaps being managed',
          'All hardware confirmed, procured, and in hands of team; no procurement dependency'
        ],
        coachingTip: 'Hardware procurement is outside the delivery team\'s control and is the #1 schedule risk on embedded projects. Confirm procurement timelines before sprint 1 and add hardware availability as a hard dependency milestone.',
        triggerWorkTypes: ['pe-embedded'],
      },
      {
        id: 'WT-PE-E2',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'SC',
        text: 'Is the firmware/software interface contract — including HAL design, BSP scope, RTOS selection, and hardware abstraction boundaries — agreed before software development begins?',
        scaleLabels: [
          'No hardware-software interface defined; firmware and app teams working in isolation',
          'Informal interface discussion; no HAL spec, BSP owners, or abstraction agreed',
          'Interface partially defined; key boundaries still debated between teams',
          'HAL/BSP contract documented; RTOS selected; integration test plan drafted',
          'Full interface spec signed off; HAL implemented and unit-tested; integration rig ready'
        ],
        coachingTip: 'Firmware/software interface misalignment discovered during integration doubles remaining project time. HAL design and BSP scope must be resolved before parallel development streams start — never after.',
        triggerWorkTypes: ['pe-embedded'],
      },
      {
        id: 'WT-PE-E3',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'CR',
        text: 'Are regulatory certifications — CE, FCC, UL, IEC 62443, IEC 60601, or sector-specific approvals — scoped, costed, and scheduled with buffer for re-test cycles?',
        scaleLabels: [
          'Certifications not identified; client unaware of applicable standards',
          'Certifications known but not scoped; no test lab engaged; timeline not considered',
          'Certifications identified; test lab shortlisted; first submission timeline at risk',
          'Certifications scoped and budgeted; test lab booked; one re-test cycle buffered',
          'Certification plan approved; pre-compliance testing started; lab slots confirmed'
        ],
        coachingTip: 'Regulatory certification failures typically add 8–16 weeks to a project and are not in your control. Budget for two submission cycles by default, and never tie a delivery milestone to "first pass" certification.',
        triggerWorkTypes: ['pe-embedded'],
      },
    ],
  },

  // ── pe-api-platform: API / Platform Product ─────────────────

  {
    workTypeId: 'pe-api-platform',
    axisModifiers: { TC: 1.3, SC: 1.3, GR: 1.2 },
    questions: [
      {
        id: 'WT-PE-A1',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'SC',
        text: 'Is the API versioning strategy, deprecation policy, and backward-compatibility commitment defined — with consumer notification and migration timelines agreed?',
        scaleLabels: [
          'No versioning strategy; breaking changes expected without consumer notice',
          'Versioning discussed but no deprecation policy or consumer notification process',
          'Versioning approach agreed; deprecation timeline undefined; consumers not mapped',
          'Versioning strategy and deprecation policy documented; consumers identified',
          'Full versioning governance with deprecation notice periods, migration guides, and consumer SLA'
        ],
        coachingTip: 'Breaking API changes without deprecation governance destroy consumer trust and create contractual liability. Define versioning strategy and deprecation SLA before launch — not after the first consumer integration.',
        triggerWorkTypes: ['pe-api-platform'],
      },
      {
        id: 'WT-PE-A2',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'TC',
        text: 'Are the non-functional requirements — rate limits, quota tiers, SLA targets, latency budgets, and authentication standards — specified and agreed per consumer segment?',
        scaleLabels: [
          'No NFRs defined; SLA expected to match whatever the platform delivers',
          'High-level SLA discussed but no per-tier limits, latency budgets, or auth standards',
          'NFRs drafted; some gaps in quota tiers or authentication specifications',
          'NFRs agreed per consumer segment; rate limits and auth standards documented',
          'NFRs contractually defined per tier; load-tested; auth framework implemented'
        ],
        coachingTip: 'API platforms without tiered SLAs treat all consumers equally — which means the heaviest consumer degrades the platform for everyone. Define rate limits, quotas, and latency budgets before onboarding a single integration partner.',
        triggerWorkTypes: ['pe-api-platform'],
      },
      {
        id: 'WT-PE-A3',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'GR',
        text: 'Is there a developer portal and onboarding governance process — including who approves new consumer access, manages API keys, and owns the developer experience?',
        scaleLabels: [
          'No developer portal planned; onboarding process entirely manual and undocumented',
          'Portal concept discussed; no onboarding workflow, approval process, or key management',
          'Portal planned; approval workflow being designed; key rotation and revocation unclear',
          'Portal scope agreed; approval workflow documented; key lifecycle management defined',
          'Developer portal delivered; self-service onboarding live; governance board active'
        ],
        coachingTip: 'API platforms without a managed onboarding process accumulate undocumented integrations and unmanaged API keys. The developer experience is a product in itself — treat it with the same rigour as the API.',
        triggerWorkTypes: ['pe-api-platform'],
      },
    ],
  },

  // ── pe-dev-tool: Developer Tool / SDK ───────────────────────

  {
    workTypeId: 'pe-dev-tool',
    axisModifiers: { TC: 1.2, CM: 1.2, SC: 1.1 },
    questions: [
      {
        id: 'WT-PE-DT1',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'CM',
        text: 'Is the target developer persona defined — including primary language/stack, experience level, integration context, and the "job to be done" the tool must solve?',
        scaleLabels: [
          'No persona defined; tool expected to serve all developers in all contexts',
          'High-level developer audience described but no specifics on stack or use case',
          'Primary persona sketched; language/stack known; integration context vague',
          'Developer persona documented; stack and use case clear; example integrations mapped',
          'Validated persona with user research; acceptance criteria tied to developer success metrics'
        ],
        coachingTip: 'Developer tools built for everyone serve no one. A poorly scoped DX forces rewrite cycles. The developer persona is the requirements document — invest in defining it precisely before building the first API.',
        triggerWorkTypes: ['pe-dev-tool'],
      },
      {
        id: 'WT-PE-DT2',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'SC',
        text: 'Is the backward-compatibility policy defined — including what constitutes a breaking change, semantic versioning commitment, and long-term support windows?',
        scaleLabels: [
          'No compatibility policy; breaking changes expected without versioning discipline',
          'Versioning discussed informally; no definition of breaking change or LTS commitment',
          'SemVer approach agreed; breaking change definition partially documented',
          'Compatibility policy documented; LTS windows defined; migration path expected',
          'Full compatibility charter with breaking change policy, LTS commitment, and deprecation SLA'
        ],
        coachingTip: 'A developer SDK that breaks consumer code is career-defining for the wrong reasons. Define what constitutes a breaking change and commit to a compatibility window before releasing the first stable version.',
        triggerWorkTypes: ['pe-dev-tool'],
      },
    ],
  },

  // ── pe-ai-ml: AI / ML Product ───────────────────────────────

  {
    workTypeId: 'pe-ai-ml',
    axisModifiers: { SC: 1.4, CM: 1.3, TC: 1.4, CR: 1.2 },
    questions: [
      {
        id: 'WT-PE-ML1',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'SC',
        text: 'Are model accuracy / performance targets defined, benchmarked against industry baselines, and contractually reasonable — or are they aspirational guesses?',
        scaleLabels: [
          'No accuracy targets; client expects "as accurate as possible" with no baseline',
          'Targets mentioned ("90% accuracy") but no baseline, dataset, or measurement methodology',
          'Targets proposed; industry benchmarks referenced; measurement methodology TBD',
          'Targets defined with baseline comparison; measurement methodology agreed',
          'Targets contractually defined with benchmark data, measurement protocol, and acceptable range'
        ],
        coachingTip: 'Fixed-price ML projects with undefined accuracy targets end in disputes. "90% accuracy" on an imbalanced dataset with no baseline is a meaningless number. Contractualise the measurement methodology, not just the target.',
        triggerWorkTypes: ['pe-ai-ml'],
      },
      {
        id: 'WT-PE-ML2',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'TC',
        text: 'Is the inference infrastructure — including serving framework, latency SLA, scalability, and model versioning strategy — designed and agreed before model development begins?',
        scaleLabels: [
          'No inference design; model development starting with no deployment plan',
          'Serving approach discussed but latency SLA, scaling, and versioning undefined',
          'Serving framework selected; latency targets proposed; versioning approach TBD',
          'Inference architecture agreed; latency SLA defined; model versioning strategy documented',
          'Full inference stack designed, load-tested, and CI/CD pipeline for model deployment live'
        ],
        coachingTip: 'Training a model without an inference architecture is building a car with no road. Serving requirements (latency, throughput, versioning, rollback) constrain model architecture choices — design them in parallel.',
        triggerWorkTypes: ['pe-ai-ml'],
      },
    ],
  },

  // ── pe-fintech: FinTech / Payment Product ───────────────────

  {
    workTypeId: 'pe-fintech',
    axisModifiers: { CR: 1.4, TC: 1.4, GR: 1.3, SC: 1.2 },
    questions: [
      {
        id: 'WT-PE-FT1',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'CR',
        text: 'Are the applicable payment regulations (PCI-DSS, PSD2, FCA, RBI, SEBI) identified, scoped as first-class deliverables, and their certification timelines built into the project plan?',
        scaleLabels: [
          'Regulations not identified; client unaware of compliance obligations',
          'Regulations known but not scoped; compliance assumed to be handled post-launch',
          'Compliance obligations mapped; scope partially defined; timeline not factored into plan',
          'Compliance scope agreed and costed; certification milestones in project plan',
          'Compliance fully scoped, priced, and integrated into delivery — third-party auditor engaged'
        ],
        coachingTip: 'Payment scheme certifications (Visa, Mastercard) and regulatory approvals (PCI-DSS QSA, FCA registration) run on the regulator\'s timeline — not yours. Build these timelines into the plan from day one. Missing a certification window can delay go-live by quarters.',
        triggerWorkTypes: ['pe-fintech'],
      },
      {
        id: 'WT-PE-FT2',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'TC',
        text: 'Are fraud rules, risk scoring parameters, and dispute resolution workflows owned by a named business stakeholder and agreed as fixed scope — not a continuous tuning obligation?',
        scaleLabels: [
          'No fraud rules defined; client expects the system to "learn" fraud patterns autonomously',
          'Fraud rules discussed but no named owner; scope unclear; tuning expected indefinitely',
          'Initial rule set drafted; owner identified; post-launch tuning ownership under discussion',
          'Initial rule set agreed and signed off; ongoing tuning model and ownership defined',
          'Rules, risk thresholds, and dispute workflows fully documented with named owners and SLA'
        ],
        coachingTip: 'Fraud rule tuning without a defined ownership model becomes infinite unpaid consulting. Scope the initial rule set and make ongoing tuning an explicit retainer — or explicitly exclude it from the fixed engagement.',
        triggerWorkTypes: ['pe-fintech'],
      },
    ],
  },

  // ── pe-healthtech: HealthTech / MedTech Product ─────────────

  {
    workTypeId: 'pe-healthtech',
    axisModifiers: { CR: 1.4, TC: 1.3, GR: 1.3, SC: 1.2 },
    questions: [
      {
        id: 'WT-PE-HT1',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'CR',
        text: 'Has the medical device classification been confirmed (FDA Class I/II/III, MDR Class I/IIa/IIb/III) and the regulatory submission pathway and timeline included in the project plan?',
        scaleLabels: [
          'Device classification not assessed; client unaware of regulatory pathway',
          'Classification discussed informally; regulatory pathway assumed but not confirmed',
          'Classification assessed; submission pathway identified; timeline not in project plan',
          'Classification confirmed; regulatory affairs lead engaged; timeline in project plan',
          'Full regulatory strategy agreed; notified body or FDA pre-submission completed; timeline committed'
        ],
        coachingTip: 'Building a Class II or III medical device without a confirmed regulatory pathway is building a product you may never be able to sell. Classification determines the entire QMS, testing, and submission burden — confirm it before any design decisions.',
        triggerWorkTypes: ['pe-healthtech'],
      },
      {
        id: 'WT-PE-HT2',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'TC',
        text: 'Is the clinical data architecture — including FHIR/HL7 integration, PHI handling, audit logging, and data residency requirements — designed and validated before build begins?',
        scaleLabels: [
          'No clinical data architecture; PHI handling not considered; no FHIR/HL7 expertise in team',
          'PHI obligations acknowledged but architecture not designed; FHIR/HL7 approach TBD',
          'Data architecture partially designed; audit logging and residency requirements identified',
          'Clinical data architecture documented; FHIR/HL7 approach agreed; PHI controls designed',
          'Full clinical data architecture reviewed by regulatory affairs; security controls validated'
        ],
        coachingTip: 'PHI in the wrong storage tier or without proper audit logging is a HIPAA/GDPR violation that can prevent go-live entirely. Clinical data architecture is a regulatory deliverable — not a technical implementation detail.',
        triggerWorkTypes: ['pe-healthtech'],
      },
    ],
  },

  // ── pe-games: Gaming / Interactive Media ────────────────────

  {
    workTypeId: 'pe-games',
    axisModifiers: { SC: 1.3, CM: 1.3, TC: 1.2, CR: 1.1 },
    questions: [
      {
        id: 'WT-PE-G1',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'SC',
        text: 'Are "fun" and player engagement defined as measurable acceptance criteria — with a named creative director who has authority to decide when the experience is shippable?',
        scaleLabels: [
          'No engagement metrics; "fun" is entirely subjective; no creative authority named',
          'Engagement loosely described; creative feedback from multiple stakeholders with no tie-breaker',
          'Key engagement metrics agreed (session length, retention target) but creative authority unclear',
          'Engagement KPIs defined; creative director named with sign-off authority; milestone gates set',
          'Engagement targets validated with user research; creative authority established; acceptance agreed'
        ],
        coachingTip: 'Games without a defined creative authority become design-by-committee products that never ship. A named creative director with sign-off authority on the player experience is as important as the Product Owner in any other product engagement.',
        triggerWorkTypes: ['pe-games'],
      },
      {
        id: 'WT-PE-G2',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'CR',
        text: 'Are platform certification timelines (Apple, Google, Sony PlayStation, Microsoft Xbox) built into the plan — with buffer for content policy reviews and certification cycles?',
        scaleLabels: [
          'Platform certification not considered; assuming same-day publish after build completion',
          'Certification aware but timeline not factored; content policy review not anticipated',
          'Certification timelines identified per platform; buffer not included in plan',
          'Certification milestones in project plan; one rejection cycle buffered per platform',
          'Platform relationships established; pre-submission checklist complete; timelines confirmed'
        ],
        coachingTip: 'Platform certification rejections on Apple and console platforms average 1–3 weeks per cycle. A game that misses a key sales window (holiday, launch event) by 4 weeks due to certification failures loses 30–60% of its addressable revenue.',
        triggerWorkTypes: ['pe-games'],
      },
    ],
  },

  // ── gf-pe-other: Other Product Engineering ──────────────────

  {
    workTypeId: 'gf-pe-other',
    axisModifiers: { SC: 1.2, CM: 1.2, TC: 1.1 },
    questions: [
      {
        id: 'WT-PE-O1',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'SC',
        text: 'Is the product\'s definition of "done" — including release criteria, performance baselines, and acceptance test ownership — agreed before development begins?',
        scaleLabels: [
          'No release criteria; "done" will be decided when we get there',
          'Release discussed informally; acceptance owner not identified; no measurable criteria',
          'Release criteria partially defined; some measurable targets but gaps remain',
          'Release criteria agreed; acceptance owner named; performance baselines set',
          'Full release checklist with measurable criteria, acceptance owner, and signed acceptance plan'
        ],
        coachingTip: 'Products without release criteria ship when stakeholders run out of time, not when they are ready. Define measurable acceptance criteria before the first sprint — they are the contract between engineering and the business.',
        triggerWorkTypes: ['gf-pe-other'],
      },
    ],
  },
]
