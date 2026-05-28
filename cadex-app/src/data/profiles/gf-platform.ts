// ============================================================
// CADEX — Work Type Profiles: Platform & Infrastructure
// ============================================================

import type { WorkTypeProfile } from '../../types'

export const GF_PLATFORM_PROFILES: WorkTypeProfile[] = [

  // ── plat-data: Data Platform / Lakehouse ────────────────────

  {
    workTypeId: 'plat-data',
    axisModifiers: { SC: 1.3, TC: 1.3, GR: 1.2 },
    questions: [
      {
        id: 'WT-PL-D1',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'GR',
        text: 'Is the data platform\'s governance model — including data product ownership, access control tiers, lineage tracking obligations, and data quality SLAs — agreed before build begins?',
        scaleLabels: [
          'No governance model; data platform expected to be a self-service free-for-all',
          'Data steward concept discussed but no ownership model, access tiers, or lineage plan',
          'Governance approach outlined; data product owners being identified; access tiers TBD',
          'Governance model agreed; data product owners named; access tiers and lineage tooling selected',
          'Full governance framework approved; data product contracts defined; lineage tracking live'
        ],
        coachingTip: 'A data platform without a governance model becomes a data swamp within 18 months. Data product ownership, access tiers, and lineage tracking are architectural decisions — not operational afterthoughts. Resolve them before the first pipeline is built.',
        triggerWorkTypes: ['plat-data'],
      },
      {
        id: 'WT-PL-D2',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'TC',
        text: 'Are the medallion architecture layers (Bronze/Silver/Gold or equivalent) defined — with data contract standards, schema evolution policies, and SLA per consumption tier?',
        scaleLabels: [
          'No architecture defined; raw data ingested without transformation or quality enforcement',
          'Layering concept acknowledged; no data contracts, schema evolution policy, or SLA per tier',
          'Layering agreed in principle; contracts and schema policies under discussion',
          'Architecture layers defined; data contracts documented; schema evolution policy agreed',
          'Full medallion architecture with contracts, schema registry, SLAs, and automated quality gates'
        ],
        coachingTip: 'Lakehouse platforms without data contracts between layers become brittle to upstream changes. Schema evolution without a policy breaks downstream consumers in production. Define contracts and evolution policy layer by layer before ingesting a single source.',
        triggerWorkTypes: ['plat-data'],
      },
    ],
  },

  // ── plat-integration: Integration / API Gateway Layer ────────

  {
    workTypeId: 'plat-integration',
    axisModifiers: { TC: 1.3, SC: 1.3, GR: 1.2 },
    questions: [
      {
        id: 'WT-PL-I1',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'SC',
        text: 'Is the integration platform\'s scope — number of integration points, flow complexity, owning teams, and initial priority integrations — agreed with all system owners before delivery begins?',
        scaleLabels: [
          'Integration inventory unconfirmed; scope expected to grow as discovery progresses',
          'High-level integration count estimated; system owners not all engaged; priorities undefined',
          'Integration inventory in progress; priority flows identified; some owners not yet confirmed',
          'Integration inventory agreed; priority flows confirmed; all system owners identified',
          'Full integration scope locked; all owners engaged; priority integrations sequenced in backlog'
        ],
        coachingTip: 'Integration platform scope is the easiest to underestimate. Every "simple integration" has an owner, an approval process, and an undocumented edge case. Lock the integration inventory before sprint 1 and treat additional integrations as change requests.',
        triggerWorkTypes: ['plat-integration'],
      },
      {
        id: 'WT-PL-I2',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'GR',
        text: 'Is there an API governance board or integration council that will own standards, approve new integrations, and enforce contract compliance across all producing and consuming teams?',
        scaleLabels: [
          'No governance; teams integrate independently with no standards or oversight',
          'Governance discussed but no board formed; standards not published; enforcement informal',
          'API standards drafted; governance process being designed; board members not yet named',
          'Governance board established; standards published; integration approval process active',
          'Mature governance with automated contract testing, standards enforcement in CI/CD, and change board'
        ],
        coachingTip: 'An integration platform without governance accumulates undocumented, untested integrations that break silently. An API governance board is not bureaucracy — it is the only mechanism that prevents the platform from becoming a maintenance liability.',
        triggerWorkTypes: ['plat-integration'],
      },
    ],
  },

  // ── plat-iot-edge: IoT / Edge Platform ──────────────────────

  {
    workTypeId: 'plat-iot-edge',
    axisModifiers: { TC: 1.5, SC: 1.3, CR: 1.2 },
    questions: [
      {
        id: 'WT-PL-IOT1',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'TC',
        text: 'Are device heterogeneity, connectivity protocols (MQTT, LTE-M, Zigbee, OPC-UA), and the edge-to-cloud data contract all documented — with a confirmed device onboarding and provisioning process?',
        scaleLabels: [
          'Device types and protocols not inventoried; connectivity assumptions not validated',
          'Device types listed; protocols partially known; edge-to-cloud contract not defined',
          'Device inventory complete; protocols confirmed; onboarding process not designed',
          'All protocols documented; edge-to-cloud contract agreed; onboarding process designed',
          'Full device spec confirmed; edge-to-cloud contract tested; automated provisioning pipeline live'
        ],
        coachingTip: 'IoT projects discover device heterogeneity surprises — protocol mismatches, firmware version conflicts, and connectivity gaps — in the field during integration. Conduct a device field audit before designing the ingestion layer. What the spec says and what\'s installed are rarely the same.',
        triggerWorkTypes: ['plat-iot-edge'],
      },
      {
        id: 'WT-PL-IOT2',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'SC',
        text: 'Are the platform\'s offline resilience requirements — local processing during connectivity loss, store-and-forward SLA, and edge-to-cloud reconciliation strategy — defined and tested?',
        scaleLabels: [
          'No offline design; platform assumes always-on connectivity',
          'Offline awareness exists but store-and-forward, buffer size, and sync strategy undefined',
          'Offline requirements identified; store-and-forward approach proposed; reconciliation TBD',
          'Offline strategy agreed; buffer sizing designed; reconciliation mechanism documented',
          'Offline resilience tested at expected failure rates; reconciliation validated; buffer SLAs set'
        ],
        coachingTip: 'Industrial and remote IoT deployments lose connectivity regularly. An edge platform with no offline design stops collecting data during network outages and can lose valuable telemetry. Offline resilience is not optional scope for any IoT platform serving field devices.',
        triggerWorkTypes: ['plat-iot-edge'],
      },
    ],
  },

  // ── plat-security: Security Platform / Zero Trust / IAM ─────

  {
    workTypeId: 'plat-security',
    axisModifiers: { SC: 1.4, TC: 1.3, GR: 1.3, CR: 1.1 },
    questions: [
      {
        id: 'WT-PL-SEC1',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'SC',
        text: 'Is a threat model completed — identifying the assets being protected, attack surfaces in scope, threat actors considered, and the security controls required to address each?',
        scaleLabels: [
          'No threat model; security controls being selected without a risk-based rationale',
          'General threat awareness but no structured model; controls chosen from prior experience only',
          'Threat model started; key assets identified; attack surfaces partially mapped',
          'Threat model complete for in-scope systems; controls mapped to threats; gaps identified',
          'Formal threat model (STRIDE/PASTA/MITRE ATT&CK) completed, validated, and design-approved'
        ],
        coachingTip: 'Security platforms built without a threat model implement controls for the wrong threats. A threat model is not a compliance checkbox — it is the requirements document for a security engagement. Start every security architecture engagement with it.',
        triggerWorkTypes: ['plat-security'],
      },
      {
        id: 'WT-PL-SEC2',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'GR',
        text: 'Is there a named security platform owner who will maintain policies, approve access requests, operate the tooling, and own the security roadmap after project handover?',
        scaleLabels: [
          'No owner; security platform expected to operate itself post-delivery',
          'IT team aware but not designated; post-delivery ownership informal and unconfirmed',
          'Owner identified but not engaged in delivery; operational procedures not being built',
          'Owner embedded in delivery; operational procedures being built; handover plan agreed',
          'Security platform owner co-developing runbooks; policy management process live; handover signed off'
        ],
        coachingTip: 'Security platforms without an operational owner decay rapidly — policies age, exceptions accumulate, and unmanaged tools create shadow IT risk. The platform owner must be in the room from sprint 1, not introduced at go-live.',
        triggerWorkTypes: ['plat-security'],
      },
    ],
  },

  // ── plat-observability: Observability / Monitoring Platform ──

  {
    workTypeId: 'plat-observability',
    axisModifiers: { SC: 1.3, TC: 1.2, GR: 1.2 },
    questions: [
      {
        id: 'WT-PL-OBS1',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'SC',
        text: 'Is the instrumentation scope — which services, infrastructure components, and business processes will emit telemetry — agreed with all service owners before platform build begins?',
        scaleLabels: [
          'No instrumentation scope; platform expected to "collect everything"',
          'Target services listed informally; owners not all engaged; instrumentation effort not estimated',
          'Scope partially agreed; key services confirmed; some owners still to be engaged',
          'Instrumentation scope agreed; all service owners identified; effort estimated per service',
          'Full instrumentation scope agreed with all owners; effort sized; SDK or agent approach confirmed'
        ],
        coachingTip: 'Observability platform scope is consistently underestimated because instrumentation effort sits with the individual service teams, not with the platform team. Each service owner must commit to their instrumentation timeline — get it in writing before you commit to your go-live date.',
        triggerWorkTypes: ['plat-observability'],
      },
      {
        id: 'WT-PL-OBS2',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'GR',
        text: 'Is there an alert tuning process — including who owns alert thresholds, how false positives are reviewed, and the cadence for runbook review — to prevent alert fatigue post-launch?',
        scaleLabels: [
          'No tuning process; all alerts set at launch and expected to stay unchanged',
          'Alert ownership informal; tuning expected ad hoc; no runbook or review process',
          'Tuning process discussed; ownership partially assigned; review cadence not agreed',
          'Alert ownership assigned per team; review cadence agreed; runbook responsibility clear',
          'Full alert governance: ownership, tuning cadence, false positive SLO, runbook ownership'
        ],
        coachingTip: 'Observability platforms generate more noise than signal when alert thresholds are set once at launch and never reviewed. Build a 30-60-90 day post-launch tuning schedule into the engagement and make the client\'s on-call team part of it from day one.',
        triggerWorkTypes: ['plat-observability'],
      },
    ],
  },

  // ── plat-finops: Cloud Cost Management / FinOps ─────────────

  {
    workTypeId: 'plat-finops',
    axisModifiers: { GR: 1.3, CR: 1.2, CM: 1.1 },
    questions: [
      {
        id: 'WT-PL-FO1',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'GR',
        text: 'Is there an accountable executive who owns cloud cost as a P&L line — with authority to enforce tagging policies, approve or reject workload changes, and drive chargeback across teams?',
        scaleLabels: [
          'No cost ownership; cloud spend treated as a shared IT overhead with no accountability',
          'Cost awareness exists but no named owner; chargeback informal; enforcement impossible',
          'Cost owner identified at CTO/CFO level but engagement limited; enforcement authority unclear',
          'Named cost owner with agreed authority; chargeback model defined; teams notified of accountability',
          'Executive cost owner active; chargeback operational; P&L accountability assigned to team level'
        ],
        coachingTip: 'FinOps without executive accountability produces dashboards, not savings. Tooling shows the problem — authority to act solves it. If the client cannot name a cost owner with enforcement power, FinOps will be consulting theatre.',
        triggerWorkTypes: ['plat-finops'],
      },
      {
        id: 'WT-PL-FO2',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'SC',
        text: 'Is the optimisation scope defined — which workloads, accounts, and subscription tiers are in scope — with baseline spend documented and a target saving figure agreed?',
        scaleLabels: [
          'No scope; all cloud spend expected to be optimised; no baseline or target',
          'Scope loosely described; baseline not measured; saving target aspirational',
          'Key accounts identified; baseline being measured; target saving TBD',
          'Scope agreed; baseline documented; saving target set with measurement methodology',
          'Scope locked; baseline audited; saving target contractually defined with measurement cadence'
        ],
        coachingTip: 'FinOps engagements without a defined baseline and saving target are measured against the client\'s most optimistic expectation. Establish the baseline spend and a realistic saving target in the first two weeks — and make the measurement methodology part of the SOW.',
        triggerWorkTypes: ['plat-finops'],
      },
    ],
  },

  // ── gf-platform-other ────────────────────────────────────────

  {
    workTypeId: 'gf-platform-other',
    axisModifiers: { TC: 1.2, SC: 1.1, GR: 1.1 },
    questions: [
      {
        id: 'WT-PL-O1',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'GR',
        text: 'Is the platform\'s post-delivery ownership model — including the team that will operate, maintain, and evolve it — defined and embedded in delivery from the start?',
        scaleLabels: [
          'No operations owner; platform expected to run itself after handover',
          'Operations team exists but not engaged in delivery; no handover plan',
          'Operations team identified; participation planned; KT not formally scoped',
          'Operations team embedded in delivery; KT plan agreed; handover milestones in project plan',
          'Operations team co-developing runbooks and tooling throughout; day-1 ownership verified'
        ],
        coachingTip: 'Platforms without an operational owner become unmanaged infrastructure within months. The operations team must be in the room from sprint 1 — not introduced at handover.',
        triggerWorkTypes: ['gf-platform-other'],
      },
    ],
  },
]
