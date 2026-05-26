// ============================================================
// CADEX — Work-Type Supplemental Risk Questions
// Domain-specific questions that augment the base questionnaire
// ============================================================

import { AxisCode, Question } from '../types'

export const WORK_TYPE_QUESTIONS: Question[] = [

  // ── gf-data: Data & Analytics ───────────────────────────────

  {
    id: 'WT-D1',
    section: 'W',
    sectionTitle: 'Work-Type Specific',
    axis: 'TC',
    text: 'How well-documented and accessible are the source system APIs or extract mechanisms for all data feeds required in scope?',
    scaleLabels: [
      'No API/extract specs exist; source owners unresponsive',
      'Partial specs exist; significant discovery effort still needed',
      'Most sources documented but several gaps remain',
      'APIs/extracts well-documented with minor exceptions',
      'Full specs confirmed, sandbox access granted, owners engaged'
    ],
    coachingTip: 'Source system access is the #1 hidden schedule risk in data projects. Push for a data source inventory with confirmed owners before sprint 1.',
    triggerWorkTypes: ['data-warehouse', 'data-bi-reporting', 'data-lake', 'data-ml-platform', 'data-streaming', 'data-master']
  },
  {
    id: 'WT-D2',
    section: 'W',
    sectionTitle: 'Work-Type Specific',
    axis: 'TC',
    text: 'What is the current quality and consistency of data in the source systems (completeness, duplication, referential integrity)?',
    scaleLabels: [
      'No profiling done; known quality issues are widespread',
      'Profiling done but significant cleansing effort not scoped',
      'Quality issues identified; cleansing effort roughly estimated',
      'Data profiled; cleansing plan agreed and effort included in scope',
      'Source data meets target quality thresholds; DQ rules owned by client'
    ],
    coachingTip: 'Unscoped data cleansing is a margin killer. Always include a data profiling sprint and attach a data quality risk register as a scope boundary.',
    triggerWorkTypes: ['data-warehouse', 'data-bi-reporting', 'data-lake', 'data-ml-platform', 'data-streaming', 'data-master']
  },
  {
    id: 'WT-D3',
    section: 'W',
    sectionTitle: 'Work-Type Specific',
    axis: 'GR',
    text: 'How mature is the client\'s data governance function — data ownership, stewardship roles, and MDM policies?',
    scaleLabels: [
      'No data governance; no named data owners for any domain',
      'Ad hoc governance; informal ownership with no enforcement',
      'Data stewards named but governance policies not formalised',
      'Governance policies exist; stewards active but MDM partial',
      'Mature governance with certified data owners, MDM platform in place'
    ],
    coachingTip: 'Without named data owners who can approve business rules, your analytics deliverable will stall in UAT. Identify this as a hard dependency in the SOW.',
    triggerWorkTypes: ['data-warehouse', 'data-bi-reporting', 'data-lake', 'data-ml-platform', 'data-streaming', 'data-master']
  },

  // ── gf-ai: AI / ML ──────────────────────────────────────────

  {
    id: 'WT-A1',
    section: 'W',
    sectionTitle: 'Work-Type Specific',
    axis: 'TC',
    text: 'How available, labelled, and representative is the training/fine-tuning data required for the ML or AI model in scope?',
    scaleLabels: [
      'No labelled data exists; ground truth must be created from scratch',
      'Some raw data exists but labelling pipeline not defined or funded',
      'Partially labelled dataset exists; coverage and quality gaps identified',
      'Labelled dataset available with known gaps; labelling plan agreed',
      'High-quality labelled dataset ready; coverage validated for use case'
    ],
    coachingTip: 'Data labelling is often 40–60% of ML project effort and is rarely scoped. Include a data readiness assessment milestone before model development begins.',
    triggerWorkTypes: ['ai-gen-ai-app', 'ai-ml-build', 'ai-data-ops', 'ai-agent']
  },
  {
    id: 'WT-A2',
    section: 'W',
    sectionTitle: 'Work-Type Specific',
    axis: 'CR',
    text: 'Are there regulatory, compliance, or audit requirements for model explainability, bias assessment, or AI governance (e.g., EU AI Act, sector regulators)?',
    scaleLabels: [
      'Strict explainability/audit requirements; client has no compliance plan',
      'Requirements exist but client unsure of obligations or timeline',
      'Requirements known; compliance approach under discussion',
      'Compliance approach agreed; explainability framework being built',
      'Full AI governance framework in place; compliance sign-off obtained'
    ],
    coachingTip: 'EU AI Act and sector-specific AI governance rules can require model cards, bias audits, and human-in-the-loop controls. Price and scope these explicitly — they are not free.',
    triggerWorkTypes: ['ai-gen-ai-app', 'ai-ml-build', 'ai-data-ops', 'ai-agent']
  },
  {
    id: 'WT-A3',
    section: 'W',
    sectionTitle: 'Work-Type Specific',
    axis: 'GR',
    text: 'Has the client identified who will own model retraining, monitoring, and MLOps operations after project handover?',
    scaleLabels: [
      'No MLOps function exists; no plan to build one',
      'Client expecting us to run models indefinitely; no internal ownership',
      'MLOps ownership discussed but no named team or tooling agreed',
      'Internal team identified; MLOps tooling selected; handover plan draft',
      'MLOps team trained, tooling live, retraining pipeline agreed and documented'
    ],
    coachingTip: 'A model with no owner degrades silently. Make MLOps ownership and a retraining cadence a contractual acceptance criterion, not a post-project nice-to-have.',
    triggerWorkTypes: ['ai-gen-ai-app', 'ai-ml-build', 'ai-data-ops', 'ai-agent']
  },

  // ── gf-dx: Digital Experience ────────────────────────────────

  {
    id: 'WT-DX1',
    section: 'W',
    sectionTitle: 'Work-Type Specific',
    axis: 'SC',
    text: 'Is there an agreed UX research and design sign-off process — who approves wireframes, prototypes, and visual designs before development begins?',
    scaleLabels: [
      'No design process defined; multiple stakeholders with veto power',
      'Informal process; design approvals stall regularly or bypass process',
      'Design authority named but process not formalised in project charter',
      'Sign-off process agreed; one named design approver per workstream',
      'Formal design governance in place; stage-gate approvals in project plan'
    ],
    coachingTip: 'Uncontrolled design churn is the top cause of DX project overrun. Contractually limit design revision rounds and name the single design approver in the SOW.',
    triggerWorkTypes: ['dx-portal', 'dx-mobile', 'dx-ecomm', 'dx-cms']
  },
  {
    id: 'WT-DX2',
    section: 'W',
    sectionTitle: 'Work-Type Specific',
    axis: 'CR',
    text: 'Are WCAG accessibility requirements (level AA or AAA) and any sector-specific accessibility regulations in scope and tested against?',
    scaleLabels: [
      'Accessibility not mentioned; no testing planned',
      'Accessibility awareness exists but no level agreed or budgeted',
      'WCAG AA agreed in principle; testing approach not defined',
      'WCAG AA target agreed; automated + manual testing included in plan',
      'WCAG AA/AAA contractually required; third-party audit and remediation scoped'
    ],
    coachingTip: 'Retrofitting accessibility is 3–5x more expensive than building it in. Get the WCAG target level and testing approach agreed in the SOW, with remediation iterations budgeted.',
    triggerWorkTypes: ['dx-portal', 'dx-mobile', 'dx-ecomm', 'dx-cms']
  },
  {
    id: 'WT-DX3',
    section: 'W',
    sectionTitle: 'Work-Type Specific',
    axis: 'TC',
    text: 'How well are the third-party integration dependencies (payment gateway, identity provider, CRM, ERP) specified and available for integration testing?',
    scaleLabels: [
      'Third-party integrations unspecified; vendor contracts not yet signed',
      'Vendors identified but APIs undocumented; sandbox access not available',
      'APIs documented; sandbox access pending; some contracts in negotiation',
      'Sandbox access granted for most vendors; contracts signed with minor gaps',
      'All vendor APIs documented, sandbox available, contracts in place'
    ],
    coachingTip: 'Third-party API readiness is rarely in your control. Build integration dependency milestones into the project plan with a clear client-owned risk for delays.',
    triggerWorkTypes: ['dx-portal', 'dx-mobile', 'dx-ecomm', 'dx-cms']
  },

  // ── gf-erp: ERP Greenfield ───────────────────────────────────

  {
    id: 'WT-E1',
    section: 'W',
    sectionTitle: 'Work-Type Specific',
    axis: 'SC',
    text: 'Has the client completed TO-BE process design for the functions being implemented, with a named business process owner for each module?',
    scaleLabels: [
      'No TO-BE design; client expects us to define business processes',
      'High-level TO-BE sketched; no process owners named; gaps significant',
      'TO-BE in progress; some modules owned; others still at AS-IS stage',
      'TO-BE complete for most modules; process owners named; gaps minor',
      'Full TO-BE documented, signed off, with named owners per module'
    ],
    coachingTip: 'ERP implementations where TO-BE design is incomplete at kick-off routinely run 30–50% over budget. Make process design sign-off a project pre-condition or a paid phase gate.',
    triggerWorkTypes: ['erp-sap-new', 'erp-sfdc-new', 'erp-servicenow-new', 'gf-erp-other']
  },
  {
    id: 'WT-E2',
    section: 'W',
    sectionTitle: 'Work-Type Specific',
    axis: 'TC',
    text: 'What is the volume, quality, and readiness of data to be migrated into the new ERP — including data mapping, cleansing, and legacy extract capability?',
    scaleLabels: [
      'Volume unknown; no extract specs; legacy owner unresponsive',
      'Volume estimated; extracts possible but quality known to be poor',
      'Volume confirmed; cleansing backlog identified but not resourced',
      'Data migration plan agreed; cleansing resourced; mock run planned',
      'Dry run completed; cleansing done; reconciliation sign-off obtained'
    ],
    coachingTip: 'Data migration is consistently underestimated in ERP projects. Budget for at least two mock migration runs and tie go-live approval to reconciliation sign-off, not calendar date.',
    triggerWorkTypes: ['erp-sap-new', 'erp-sfdc-new', 'erp-servicenow-new', 'gf-erp-other']
  },
  {
    id: 'WT-E3',
    section: 'W',
    sectionTitle: 'Work-Type Specific',
    axis: 'CR',
    text: 'Is the cutover strategy agreed — including cutover window duration, parallel-run policy, rollback decision criteria, and business continuity during transition?',
    scaleLabels: [
      'No cutover strategy; client expects zero-downtime but no plan exists',
      'Cutover discussed but window, rollback criteria, and BCP undefined',
      'Cutover approach drafted; parallel-run and rollback still under debate',
      'Cutover strategy agreed; BCP plan drafted; rollback criteria defined',
      'Cutover plan rehearsed; BCP tested; go/no-go criteria signed off'
    ],
    coachingTip: 'Cutover failure is an existential risk for ERP projects. Contractually require a cutover rehearsal and a signed go/no-go checklist before any production migration begins.',
    triggerWorkTypes: ['erp-sap-new', 'erp-sfdc-new', 'erp-servicenow-new', 'gf-erp-other']
  },

  // ── gf-cloud-native: Cloud Native / Infra ────────────────────

  {
    id: 'WT-CN1',
    section: 'W',
    sectionTitle: 'Work-Type Specific',
    axis: 'CR',
    text: 'Does the client have a FinOps practice or cloud cost governance process to control spend post-delivery, and is it included in the project scope?',
    scaleLabels: [
      'No FinOps; no tagging strategy; no budget alerts; cost ownership unclear',
      'Basic cost visibility exists but no governance or accountability model',
      'Cost governance discussed; tagging policy draft; no enforcement yet',
      'FinOps practice defined; tagging policy agreed; budget alerts configured',
      'Mature FinOps with dedicated role, showback/chargeback, and optimisation cycle'
    ],
    coachingTip: 'Cloud cost overruns become a client relationship problem in months 6–18. Include a cloud cost governance design as a deliverable and clearly exclude ongoing FinOps from scope unless retained.',
    triggerWorkTypes: ['gf-cloud-native', 'infra-cloud-migration', 'infra-devops']
  },
  {
    id: 'WT-CN2',
    section: 'W',
    sectionTitle: 'Work-Type Specific',
    axis: 'GR',
    text: 'Who will own, maintain, and evolve the IaC codebase and CI/CD pipelines after project handover — and are they involved in delivery?',
    scaleLabels: [
      'No internal platform team; no plan for post-delivery ownership',
      'IT operations team named but not engaged in project; no upskilling planned',
      'Owner identified; participation sporadic; knowledge transfer not scoped',
      'Owner embedded part-time in delivery; KT plan agreed and scheduled',
      'Internal platform engineer co-developing IaC throughout; full ownership at day 1 of ops'
    ],
    coachingTip: 'IaC with no owner becomes legacy infrastructure within 12 months. Require the post-delivery owner to be involved from sprint 1 and make knowledge transfer a contractual deliverable.',
    triggerWorkTypes: ['gf-cloud-native', 'infra-cloud-migration', 'infra-devops']
  },
  {
    id: 'WT-CN3',
    section: 'W',
    sectionTitle: 'Work-Type Specific',
    axis: 'TC',
    text: 'Are there multi-cloud or hybrid-cloud constraints, or existing vendor commitments that restrict technology choices (committed cloud spend, licensing lock-in)?',
    scaleLabels: [
      'Significant lock-in constraints unknown or undisclosed; architecture at risk',
      'Some constraints known but full impact on architecture not assessed',
      'Constraints documented; architecture trade-offs identified but not resolved',
      'Constraints agreed; architecture decisions made with documented rationale',
      'No constraining commitments; technology choices fully open and agreed'
    ],
    coachingTip: 'Undisclosed EDP or committed-use commitments can invalidate your recommended architecture. Run a cloud commitment audit before finalising the technical approach.',
    triggerWorkTypes: ['gf-cloud-native', 'infra-cloud-migration', 'infra-devops']
  },

  // ── bf-migration ─────────────────────────────────────────────

  {
    id: 'WT-M1',
    section: 'W',
    sectionTitle: 'Work-Type Specific',
    axis: 'TC',
    text: 'Is there a data migration dry-run plan with documented rollback procedures and a signed-off reconciliation framework?',
    scaleLabels: [
      'No dry-run planned; no rollback procedure; reconciliation undefined',
      'Dry-run concept agreed but not scheduled; rollback approach vague',
      'Dry-run in plan; rollback procedure drafted; reconciliation criteria TBD',
      'One dry-run completed; reconciliation criteria agreed; rollback tested',
      'Multiple dry-runs done; full reconciliation sign-off; rollback rehearsed'
    ],
    coachingTip: 'A single dry-run is the absolute minimum. Price two dry-runs into every migration engagement — the first one always surfaces issues that invalidate the timeline.',
    triggerWorkTypes: ['mig-erp-crm', 'mig-replatform', 'mig-cloud-lift-shift']
  },
  {
    id: 'WT-M2',
    section: 'W',
    sectionTitle: 'Work-Type Specific',
    axis: 'CR',
    text: 'Is the cutover window agreed with the business — including maximum acceptable downtime, parallel-run duration, and decision authority for go/no-go?',
    scaleLabels: [
      'No agreed cutover window; business expects zero downtime with no plan',
      'Window discussed informally; no go/no-go authority named; BCP absent',
      'Window proposed; go/no-go owner identified; parallel run TBD',
      'Window agreed; go/no-go criteria defined; parallel run plan approved',
      'Cutover plan approved by steering; BCP tested; rehearsal completed'
    ],
    coachingTip: 'Vague cutover windows extend into weekends and holidays by default. Get a contractually agreed window with an explicit downtime SLA and a named decision-maker before you start.',
    triggerWorkTypes: ['mig-erp-crm', 'mig-replatform', 'mig-cloud-lift-shift']
  },
  {
    id: 'WT-M3',
    section: 'W',
    sectionTitle: 'Work-Type Specific',
    axis: 'SC',
    text: 'Is legacy system decommission timeline, budget, and ownership agreed — including data archival, licence termination, and regulatory retention obligations?',
    scaleLabels: [
      'No decommission plan; legacy may run indefinitely post-migration',
      'Decommission intent confirmed but timeline, budget, owner all undefined',
      'Timeline proposed; archival approach being scoped; ownership unclear',
      'Decommission plan agreed; archival and retention obligations mapped',
      'Full decommission plan approved with owner, timeline, and budget signed off'
    ],
    coachingTip: 'Legacy systems kept running post-migration erode the business case and keep support costs on your invoice. Make decommission planning a contractual workstream with a client-owned milestone.',
    triggerWorkTypes: ['mig-erp-crm', 'mig-replatform', 'mig-cloud-lift-shift']
  },

  // ── bf-modernisation ─────────────────────────────────────────

  {
    id: 'WT-MOD1',
    section: 'W',
    sectionTitle: 'Work-Type Specific',
    axis: 'TC',
    text: 'Has the client agreed on a strangler fig (incremental) vs big-bang re-architecture approach, with a clear seam strategy for the transition period?',
    scaleLabels: [
      'Approach undefined; client wants big-bang speed with zero legacy risk',
      'Approach discussed but not decided; no seam or anti-corruption strategy',
      'Incremental approach preferred; seam design not yet drafted',
      'Approach agreed; seam/anti-corruption layer designed; backlog created',
      'Strangler fig roadmap approved; seams implemented; first slice in production'
    ],
    coachingTip: 'Big-bang modernisation projects have a high failure rate. If the client insists on big-bang, price a significant risk premium and require enhanced governance milestones.',
    triggerWorkTypes: ['mod-re-arch', 'mod-cloud-native', 'mod-api-enable', 'mod-ui-ux']
  },
  {
    id: 'WT-MOD2',
    section: 'W',
    sectionTitle: 'Work-Type Specific',
    axis: 'TC',
    text: 'Has a legacy coupling and dependency inventory been completed — including undocumented integrations, shared databases, batch jobs, and hardcoded configurations?',
    scaleLabels: [
      'No inventory; architecture undocumented; hidden dependencies expected',
      'Partial inventory from memory; significant undocumented dependencies likely',
      'Inventory in progress; known integrations mapped; batch/config gaps remain',
      'Inventory 80%+ complete; dependency risk register maintained',
      'Full inventory complete; all dependencies mapped, risk-rated, and owned'
    ],
    coachingTip: 'Undiscovered legacy dependencies are the primary cause of modernisation scope creep. Include a discovery sprint specifically for dependency mapping before committing to a delivery schedule.',
    triggerWorkTypes: ['mod-re-arch', 'mod-cloud-native', 'mod-api-enable', 'mod-ui-ux']
  },
  {
    id: 'WT-MOD3',
    section: 'W',
    sectionTitle: 'Work-Type Specific',
    axis: 'CM',
    text: 'Is team upskilling (new stack, cloud-native patterns, DevOps practices) included in scope, with dedicated learning time and a capability transfer plan?',
    scaleLabels: [
      'No upskilling planned; client team expected to self-learn post-handover',
      'Upskilling acknowledged as needed but not scoped or budgeted',
      'Training budget approved; courses identified; no hands-on KT in delivery',
      'Upskilling plan agreed; team embedded in delivery; KT sessions scheduled',
      'Full capability transfer plan; internal engineers co-developing; certification target set'
    ],
    coachingTip: 'Modernisation with no upskilling creates a dependency on your team for years. Make capability transfer a formal deliverable and measure it through internal team\'s ability to run production without you.',
    triggerWorkTypes: ['mod-re-arch', 'mod-cloud-native', 'mod-api-enable', 'mod-ui-ux']
  },

  // ── bf-integration ────────────────────────────────────────────

  {
    id: 'WT-I1',
    section: 'W',
    sectionTitle: 'Work-Type Specific',
    axis: 'TC',
    text: 'Are event volume, throughput SLAs, ordering guarantees, and idempotency requirements formally specified for all integration flows in scope?',
    scaleLabels: [
      'No SLAs defined; volumes unestimated; idempotency not considered',
      'Rough volume estimates; SLAs under discussion; idempotency not designed',
      'Volumes estimated; SLAs proposed; idempotency partially addressed',
      'SLAs agreed; volume sizing done; idempotency pattern selected',
      'All SLAs contractually defined; load tested; idempotency verified in staging'
    ],
    coachingTip: 'Integration projects without formally agreed SLAs get measured against the client\'s most optimistic expectation. Define event volumes, latency SLAs, and ordering requirements before sprint 1.',
    triggerWorkTypes: ['int-esb', 'int-api-mgt', 'int-data-pipeline', 'int-event-stream']
  },
  {
    id: 'WT-I2',
    section: 'W',
    sectionTitle: 'Work-Type Specific',
    axis: 'TC',
    text: 'Is there a defined error handling strategy — including dead-letter queue design, poison message handling, alerting thresholds, and operational runbooks?',
    scaleLabels: [
      'No error handling design; failures expected to be handled ad hoc',
      'Error handling discussed but no DLQ, alerting, or runbooks designed',
      'DLQ pattern selected; alerting thresholds TBD; runbooks not started',
      'Error handling designed; DLQ implemented; alerting configured; runbook drafted',
      'Full error handling with DLQ, replay capability, alerts, and tested runbooks'
    ],
    coachingTip: 'Integration platforms without a dead-letter strategy become black boxes in production. Include DLQ design, replay tooling, and operational runbooks as contractual deliverables.',
    triggerWorkTypes: ['int-esb', 'int-api-mgt', 'int-data-pipeline', 'int-event-stream']
  },
  {
    id: 'WT-I3',
    section: 'W',
    sectionTitle: 'Work-Type Specific',
    axis: 'SC',
    text: 'Who owns the consuming systems\' contracts and API schemas — and is there a change-management process to prevent breaking changes from consuming teams?',
    scaleLabels: [
      'Consuming system owners unknown; no change management process exists',
      'Owners identified but not engaged; schema changes expected mid-delivery',
      'Owners engaged; change process discussed but not formalised',
      'Schema governance agreed; consuming owners sign off on contract changes',
      'API contract testing in CI/CD; schema registry in place; change board active'
    ],
    coachingTip: 'Consuming teams that can change schemas mid-project are an uncontrolled scope risk. Establish API contract governance and require consumer sign-off on schema changes as a project dependency.',
    triggerWorkTypes: ['int-esb', 'int-api-mgt', 'int-data-pipeline', 'int-event-stream']
  },

  // ── bf-security ──────────────────────────────────────────────

  {
    id: 'WT-S1',
    section: 'W',
    sectionTitle: 'Work-Type Specific',
    axis: 'SC',
    text: 'Is the scope of systems, environments, and assets included in the security engagement formally agreed — including explicit exclusions and rules of engagement?',
    scaleLabels: [
      'Scope undefined; client expects "everything" with no documented exclusions',
      'Rough scope discussed; no formal scoping document or rules of engagement',
      'Systems listed but exclusions not agreed; rules of engagement drafted',
      'Scope formally agreed; exclusions documented; rules of engagement signed',
      'Formal scoping document signed; test targets locked; emergency contacts agreed'
    ],
    coachingTip: 'Scope creep in security engagements carries legal and operational risk. A signed rules-of-engagement document and explicit exclusions list are non-negotiable before any testing begins.',
    triggerWorkTypes: ['sec-vapt', 'sec-siem', 'sec-iam', 'sec-cloud-posture', 'sec-grc', 'sec-zero-trust']
  },
  {
    id: 'WT-S2',
    section: 'W',
    sectionTitle: 'Work-Type Specific',
    axis: 'CR',
    text: 'Is there an agreed remediation budget, timeline, and ownership model — or is this engagement report-only with no funded remediation phase?',
    scaleLabels: [
      'Report-only; no remediation budget; findings expected to age without action',
      'Remediation intent stated but no budget approved or owner named',
      'Remediation budget being sought; rough timeline proposed; ownership unclear',
      'Remediation budget approved; owner named; timeline agreed for critical findings',
      'Remediation fully scoped and funded; SLA per finding severity; re-test included'
    ],
    coachingTip: 'A security report without remediation creates liability without improvement. Price remediation as a separate phase and make re-test verification a contractual deliverable tied to critical findings.',
    triggerWorkTypes: ['sec-vapt', 'sec-siem', 'sec-iam', 'sec-cloud-posture', 'sec-grc', 'sec-zero-trust']
  },
  {
    id: 'WT-S3',
    section: 'W',
    sectionTitle: 'Work-Type Specific',
    axis: 'GR',
    text: 'Is there a named executive sponsor with authority to accept residual risk, approve remediation priorities, and sign off on security findings?',
    scaleLabels: [
      'No executive sponsor; findings expected to circulate without decisions',
      'CIO/CISO aware but no delegated risk acceptance authority identified',
      'Sponsor named but availability limited; decision process unclear',
      'Sponsor engaged; risk acceptance process defined; escalation path agreed',
      'Executive sponsor active; formal risk register; sign-off cadence established'
    ],
    coachingTip: 'Security findings without an empowered decision-maker stall. A named risk acceptance authority with a defined sign-off process is a project pre-condition, not a nice-to-have.',
    triggerWorkTypes: ['sec-vapt', 'sec-siem', 'sec-iam', 'sec-cloud-posture', 'sec-grc', 'sec-zero-trust']
  },

  // ── bf-testing ───────────────────────────────────────────────

  {
    id: 'WT-TQ1',
    section: 'W',
    sectionTitle: 'Work-Type Specific',
    axis: 'TC',
    text: 'What is the current test coverage baseline — unit, integration, E2E — and has it been formally measured as the starting point for uplift?',
    scaleLabels: [
      'No coverage data; no automated tests; baseline unknown',
      'Some tests exist but coverage not measured; quality of existing tests unknown',
      'Coverage measured informally; significant gaps in critical paths identified',
      'Coverage baseline formally measured; gap analysis done; targets agreed',
      'Coverage baseline documented; gap analysis complete; uplift roadmap approved'
    ],
    coachingTip: 'You cannot improve what you have not measured. Insist on a coverage baseline assessment as the first milestone — it sets the benchmark for every success metric in the engagement.',
    triggerWorkTypes: ['tq-automation-uplift', 'tq-shift-left', 'tq-test-factory', 'tq-performance', 'tq-accessibility']
  },
  {
    id: 'WT-TQ2',
    section: 'W',
    sectionTitle: 'Work-Type Specific',
    axis: 'TC',
    text: 'Is the CI/CD pipeline mature enough to support automated test integration — including artifact management, environment provisioning, and test result reporting?',
    scaleLabels: [
      'No CI/CD pipeline; manual deployments; test automation not feasible yet',
      'Basic pipeline exists but no test stages; environment provisioning manual',
      'Pipeline has test stages but flaky; environment reliability a recurring issue',
      'Stable pipeline with test integration; minor gaps in reporting/artefact management',
      'Mature pipeline with automated gates, reporting, and on-demand environments'
    ],
    coachingTip: 'Automation without a stable pipeline produces flaky tests that undermine trust. Include CI/CD pipeline stabilisation as a prerequisite workstream if the pipeline is immature.',
    triggerWorkTypes: ['tq-automation-uplift', 'tq-shift-left', 'tq-test-factory', 'tq-performance', 'tq-accessibility']
  },
  {
    id: 'WT-TQ3',
    section: 'W',
    sectionTitle: 'Work-Type Specific',
    axis: 'SC',
    text: 'Has the client agreed a definition of "done" for quality gates — including coverage thresholds, defect escape rates, and performance benchmarks that constitute acceptance?',
    scaleLabels: [
      'No quality gates defined; acceptance criteria entirely subjective',
      'Quality discussed informally; no measurable thresholds or targets agreed',
      'Thresholds proposed; client not yet committed; debate ongoing',
      'Quality gates agreed for most dimensions; minor thresholds TBD',
      'All quality gates formally agreed, measurable, and in the SOW acceptance criteria'
    ],
    coachingTip: 'Without agreed quality gates, acceptance becomes a negotiation at go-live. Define measurable thresholds (coverage %, defect escape rate, p95 response time) in the SOW before delivery starts.',
    triggerWorkTypes: ['tq-automation-uplift', 'tq-shift-left', 'tq-test-factory', 'tq-performance', 'tq-accessibility']
  }
]
