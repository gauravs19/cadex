import type { Duration, DealSize } from '../types';

export interface RoleEstimate {
  role: string;
  fte: number;
  notes?: string;
}

export interface EffortProfile {
  workCategory: string;
  duration: Duration;
  dealSize: DealSize;
  roles: RoleEstimate[];
  sprintRange: [number, number];
  peopleDaysRange: [number, number];
  dailyRateRangeUSD: [number, number];
  headline: string;
  caveats: string[];
}

export const EFFORT_PROFILES: EffortProfile[] = [
  // ─── gf-dx: Portal / Mobile / Ecomm ───────────────────────────────────────
  {
    workCategory: 'gf-dx',
    duration: 'lt3m',
    dealSize: 'lt100k',
    roles: [
      { role: 'Full-Stack Dev', fte: 2 },
      { role: 'Business Analyst', fte: 0.5 },
      { role: 'QA Engineer', fte: 0.5 },
    ],
    sprintRange: [6, 8],
    peopleDaysRange: [120, 200],
    dailyRateRangeUSD: [350, 550],
    headline: 'Lean 3-person pod, 6–8 sprints',
    caveats: [
      'Assumes well-defined scope with minimal change requests',
      'Client provides Product Owner at least 25% dedicated',
      'Does not include post-go-live hypercare support',
    ],
  },
  {
    workCategory: 'gf-dx',
    duration: '3-6m',
    dealSize: '100k-500k',
    roles: [
      { role: 'Full-Stack Dev', fte: 4 },
      { role: 'Business Analyst', fte: 1 },
      { role: 'QA Engineer', fte: 1 },
      { role: 'UX Designer', fte: 0.5 },
    ],
    sprintRange: [10, 14],
    peopleDaysRange: [400, 900],
    dailyRateRangeUSD: [380, 580],
    headline: 'Mid-size 6.5-person team, 10–14 sprints',
    caveats: [
      'Rate range is blended offshore/nearshore hybrid',
      'Assumes client provides Product Owner 50% dedicated',
      'Third-party API integration costs priced separately',
    ],
  },
  {
    workCategory: 'gf-dx',
    duration: '6-12m',
    dealSize: '500k-2m',
    roles: [
      { role: 'Full-Stack Dev', fte: 6 },
      { role: 'Business Analyst', fte: 2 },
      { role: 'QA Engineer', fte: 1.5 },
      { role: 'UX Designer', fte: 1 },
      { role: 'Delivery Manager', fte: 1 },
    ],
    sprintRange: [18, 26],
    peopleDaysRange: [1500, 3500],
    dailyRateRangeUSD: [400, 650],
    headline: 'Full 11.5-person delivery team, 18–26 sprints',
    caveats: [
      'Excludes data migration — price separately based on volume',
      'Performance engineering and load testing not included',
      'Rate range assumes nearshore-heavy hybrid model',
    ],
  },

  // ─── gf-data: Data Warehouse / BI / Lake ──────────────────────────────────
  {
    workCategory: 'gf-data',
    duration: '3-6m',
    dealSize: '100k-500k',
    roles: [
      { role: 'Data Engineer', fte: 2 },
      { role: 'BI Developer', fte: 1 },
      { role: 'Data Architect', fte: 0.5, notes: 'Part-time advisory role' },
      { role: 'Project Manager', fte: 0.5 },
    ],
    sprintRange: [8, 12],
    peopleDaysRange: [320, 700],
    dailyRateRangeUSD: [400, 620],
    headline: 'Compact 4-person data team, 8–12 sprints',
    caveats: [
      'Assumes source system access and data dictionary provided at kickoff',
      'Data quality remediation in source systems is out of scope',
      'Excludes BI licence costs (Tableau / Power BI)',
    ],
  },
  {
    workCategory: 'gf-data',
    duration: '6-12m',
    dealSize: '500k-2m',
    roles: [
      { role: 'Data Engineer', fte: 3 },
      { role: 'BI Developer', fte: 2 },
      { role: 'Data Architect', fte: 1 },
      { role: 'Project Manager', fte: 1 },
      { role: 'QA Engineer', fte: 0.5 },
    ],
    sprintRange: [14, 22],
    peopleDaysRange: [1200, 3000],
    dailyRateRangeUSD: [420, 680],
    headline: 'Full 7.5-person data platform team, 14–22 sprints',
    caveats: [
      'Cloud infra / data platform subscription costs excluded',
      'Assumes client data steward available for business rule sign-off',
      'Rate range is blended offshore/nearshore hybrid',
    ],
  },

  // ─── gf-ai: AI / ML ───────────────────────────────────────────────────────
  {
    workCategory: 'gf-ai',
    duration: '3-6m',
    dealSize: '100k-500k',
    roles: [
      { role: 'Data Scientist', fte: 1 },
      { role: 'ML Engineer', fte: 1 },
      { role: 'Data Engineer', fte: 1 },
      { role: 'Project Manager', fte: 0.5 },
    ],
    sprintRange: [8, 10],
    peopleDaysRange: [350, 650],
    dailyRateRangeUSD: [500, 750],
    headline: 'Focused 3.5-person AI pod, 8–10 sprints',
    caveats: [
      'Labelled training data assumed available; annotation effort priced separately',
      'Model hosting and GPU compute costs excluded',
      'Assumes client SME engaged for domain validation throughout',
    ],
  },
  {
    workCategory: 'gf-ai',
    duration: '6-12m',
    dealSize: '500k-2m',
    roles: [
      { role: 'Data Scientist', fte: 2 },
      { role: 'ML Engineer', fte: 2 },
      { role: 'Data Engineer', fte: 1 },
      { role: 'Project Manager', fte: 1 },
      { role: 'MLOps Engineer', fte: 0.5 },
    ],
    sprintRange: [14, 20],
    peopleDaysRange: [1100, 2600],
    dailyRateRangeUSD: [520, 800],
    headline: 'Full 6.5-person ML delivery team, 14–20 sprints',
    caveats: [
      'MLOps / model monitoring platform licence excluded',
      'Regulatory / model explainability requirements may increase scope',
      'Rate range skews onshore due to data science specialisation',
    ],
  },

  // ─── gf-erp: ERP Implementation ───────────────────────────────────────────
  {
    workCategory: 'gf-erp',
    duration: '6-12m',
    dealSize: '500k-2m',
    roles: [
      { role: 'Functional Consultant', fte: 2 },
      { role: 'Technical Lead', fte: 1 },
      { role: 'Project Manager', fte: 1 },
      { role: 'Business Analyst', fte: 0.5 },
      { role: 'QA Engineer', fte: 0.5 },
    ],
    sprintRange: [18, 26],
    peopleDaysRange: [1400, 3200],
    dailyRateRangeUSD: [500, 800],
    headline: '5-person ERP implementation team, 18–26 sprints',
    caveats: [
      'ERP licence / subscription costs excluded from people estimate',
      'Data migration from legacy systems priced as a separate workstream',
      'Change management and end-user training included at 0.5 FTE only',
    ],
  },
  {
    workCategory: 'gf-erp',
    duration: 'gt12m',
    dealSize: 'gt2m',
    roles: [
      { role: 'Functional Consultant', fte: 4 },
      { role: 'Technical Lead', fte: 2 },
      { role: 'Project Manager', fte: 1 },
      { role: 'Business Analyst', fte: 1 },
      { role: 'QA Engineer', fte: 1 },
      { role: 'Change Management Lead', fte: 0.5, notes: 'Specialist resource' },
    ],
    sprintRange: [28, 42],
    peopleDaysRange: [4000, 9000],
    dailyRateRangeUSD: [550, 900],
    headline: 'Enterprise 9.5-person ERP programme, 28–42 sprints',
    caveats: [
      'Multi-country or multi-entity rollouts add significant scope — phase separately',
      'Integration middleware and custom development priced outside this profile',
      'Assumes SI vendor relationship in place for ERP product licensing',
    ],
  },

  // ─── gf-platform: Cloud / DevOps / Platform / Infra ──────────────────────
  {
    workCategory: 'gf-platform',
    duration: '3-6m',
    dealSize: '100k-500k',
    roles: [
      { role: 'Cloud Engineer', fte: 2 },
      { role: 'DevOps Engineer', fte: 1 },
      { role: 'Cloud Architect', fte: 0.5, notes: 'Part-time design authority' },
      { role: 'Project Manager', fte: 0.5 },
    ],
    sprintRange: [8, 12],
    peopleDaysRange: [300, 650],
    dailyRateRangeUSD: [420, 650],
    headline: 'Lean 4-person cloud team, 8–12 sprints',
    caveats: [
      'Cloud infra spend (AWS / Azure / GCP) excluded from professional services estimate',
      'Assumes landing zone / guardrails defined prior to engagement',
      'Security baseline review included; full pen-test priced separately',
    ],
  },
  {
    workCategory: 'gf-platform',
    duration: '6-12m',
    dealSize: '500k-2m',
    roles: [
      { role: 'Cloud Engineer', fte: 3 },
      { role: 'DevOps Engineer', fte: 2 },
      { role: 'Cloud Architect', fte: 1 },
      { role: 'Project Manager', fte: 1 },
    ],
    sprintRange: [16, 24],
    peopleDaysRange: [1100, 2800],
    dailyRateRangeUSD: [450, 700],
    headline: '7-person cloud platform team, 16–24 sprints',
    caveats: [
      'FinOps optimisation workstream treated as optional add-on',
      'Rate range is blended nearshore/onshore hybrid',
      'Application re-platforming effort priced per workload, not included here',
    ],
  },

  // ─── bf-migration: Migrations ─────────────────────────────────────────────
  {
    workCategory: 'bf-migration',
    duration: '6-12m',
    dealSize: '500k-2m',
    roles: [
      { role: 'Migration Engineer', fte: 2 },
      { role: 'Data Lead', fte: 1 },
      { role: 'Project Manager', fte: 1 },
      { role: 'QA Engineer', fte: 0.5 },
      { role: 'Change Management', fte: 0.5, notes: 'User comms and cutover planning' },
    ],
    sprintRange: [14, 22],
    peopleDaysRange: [1000, 2500],
    dailyRateRangeUSD: [380, 600],
    headline: '5-person migration team, 14–22 sprints',
    caveats: [
      'Legacy system decommission effort not included',
      'Assumes source data profiling completed before sprint 1',
      'Cutover weekend support charged as T&M outside this estimate',
    ],
  },
  {
    workCategory: 'bf-migration',
    duration: 'gt12m',
    dealSize: 'gt2m',
    roles: [
      { role: 'Migration Engineer', fte: 4 },
      { role: 'Data Lead', fte: 2 },
      { role: 'Solution Architect', fte: 1 },
      { role: 'Project Manager', fte: 1 },
      { role: 'QA Engineer', fte: 1 },
      { role: 'Change Management Lead', fte: 1, notes: 'Dedicated change manager' },
    ],
    sprintRange: [26, 40],
    peopleDaysRange: [3500, 8000],
    dailyRateRangeUSD: [420, 680],
    headline: 'Programme-scale 10-person migration, 26–40 sprints',
    caveats: [
      'Data cleansing and enrichment priced as a separate stream',
      'Parallel-run period (dual-system operation) adds infra cost outside this estimate',
      'Rate range is blended offshore/nearshore/onshore model',
    ],
  },

  // ─── bf-security: Security ────────────────────────────────────────────────
  {
    workCategory: 'bf-security',
    duration: 'lt3m',
    dealSize: 'lt100k',
    roles: [
      { role: 'Security Engineer', fte: 2 },
      { role: 'Project Manager', fte: 0.5 },
    ],
    sprintRange: [4, 6],
    peopleDaysRange: [60, 140],
    dailyRateRangeUSD: [500, 800],
    headline: 'VAPT / assessment pod, 2.5 people, 4–6 sprints',
    caveats: [
      'Scope limited to agreed attack surface — additional assets priced separately',
      'Remediation implementation not included; advisory only',
      'Re-test after remediation requires a separate engagement',
    ],
  },
  {
    workCategory: 'bf-security',
    duration: '3-6m',
    dealSize: '100k-500k',
    roles: [
      { role: 'Security Engineer', fte: 2 },
      { role: 'Security Architect', fte: 1 },
      { role: 'Project Manager', fte: 0.5 },
    ],
    sprintRange: [8, 12],
    peopleDaysRange: [280, 600],
    dailyRateRangeUSD: [550, 850],
    headline: '3.5-person security programme, 8–12 sprints',
    caveats: [
      'Security tooling / SIEM platform licences excluded',
      'Compliance certification (ISO 27001, SOC 2) audit fees not included',
      'Assumes client InfoSec sponsor engaged throughout',
    ],
  },

  // ─── bf-testing: Testing / QA ─────────────────────────────────────────────
  {
    workCategory: 'bf-testing',
    duration: '3-6m',
    dealSize: '100k-500k',
    roles: [
      { role: 'QA Engineer', fte: 2 },
      { role: 'Automation Engineer', fte: 1 },
      { role: 'Project Manager', fte: 0.5 },
    ],
    sprintRange: [8, 12],
    peopleDaysRange: [280, 600],
    dailyRateRangeUSD: [320, 520],
    headline: '3.5-person QA team, 8–12 sprints',
    caveats: [
      'Test management and automation framework tooling costs excluded',
      'Assumes test environment provisioned and maintained by client',
      'Performance / load testing not included — price separately',
    ],
  },
  {
    workCategory: 'bf-testing',
    duration: '6-12m',
    dealSize: '500k-2m',
    roles: [
      { role: 'QA Engineer', fte: 4 },
      { role: 'Automation Engineer', fte: 2 },
      { role: 'Performance Engineer', fte: 1 },
      { role: 'Project Manager', fte: 1 },
    ],
    sprintRange: [18, 28],
    peopleDaysRange: [1200, 3000],
    dailyRateRangeUSD: [340, 560],
    headline: 'Full 8-person QA programme, 18–28 sprints',
    caveats: [
      'Embedded QA in delivery squads requires coordination overhead not fully captured',
      'Rate range is blended offshore/nearshore hybrid',
      'Accessibility (WCAG) testing priced as separate workstream if required',
    ],
  },

  // ─── gf-pe: Product Engineering ───────────────────────────────────────────
  {
    workCategory: 'gf-pe',
    duration: '3-6m',
    dealSize: '100k-500k',
    roles: [
      { role: 'Full-Stack / Product Dev', fte: 3 },
      { role: 'Product Manager / PO', fte: 0.5, notes: 'Client-side or embedded' },
      { role: 'QA Engineer', fte: 1 },
      { role: 'DevOps Engineer', fte: 0.5 },
    ],
    sprintRange: [8, 12],
    peopleDaysRange: [350, 750],
    dailyRateRangeUSD: [400, 650],
    headline: '5-person product pod, 8–12 sprints',
    caveats: [
      'Assumes client-side Product Owner available at least 50% dedicated',
      'Cloud infrastructure and SaaS tool costs excluded',
      'Multi-tenancy architecture adds 20–30% to backend effort — price separately if required',
    ],
  },
  {
    workCategory: 'gf-pe',
    duration: '6-12m',
    dealSize: '500k-2m',
    roles: [
      { role: 'Full-Stack / Product Dev', fte: 5 },
      { role: 'Product Manager', fte: 1 },
      { role: 'QA Engineer', fte: 1.5 },
      { role: 'DevOps / Platform Engineer', fte: 1 },
      { role: 'UX Designer', fte: 0.5 },
      { role: 'Delivery Manager', fte: 1 },
    ],
    sprintRange: [16, 26],
    peopleDaysRange: [1400, 3500],
    dailyRateRangeUSD: [420, 700],
    headline: '10-person product team, 16–26 sprints',
    caveats: [
      'Embedded regulatory compliance (PCI, HIPAA, MDR) adds 25–40% to scope — price separately',
      'Rate range is blended nearshore/onshore; offshore skews lower',
      'Excludes third-party licensing, API costs, and app store developer fees',
    ],
  },
  {
    workCategory: 'gf-pe',
    duration: 'gt12m',
    dealSize: 'gt2m',
    roles: [
      { role: 'Full-Stack / Product Dev', fte: 8 },
      { role: 'Product Manager', fte: 1 },
      { role: 'Architect / Tech Lead', fte: 1 },
      { role: 'QA Lead + Engineers', fte: 2 },
      { role: 'DevOps / Platform Engineer', fte: 1.5 },
      { role: 'UX Designer', fte: 1 },
      { role: 'Delivery Manager', fte: 1 },
    ],
    sprintRange: [28, 46],
    peopleDaysRange: [5000, 12000],
    dailyRateRangeUSD: [450, 750],
    headline: 'Full 15.5-person product programme, 28–46 sprints',
    caveats: [
      'Long-running product engagements should be priced in phases — Phase 1 (MVP) with option for Phase 2',
      'Rate range is blended offshore/nearshore/onshore model',
      'Excludes infrastructure, SaaS tool licensing, and app store / platform fees',
    ],
  },

  // ─── gf-quality: Quality Engineering ──────────────────────────────────────
  {
    workCategory: 'gf-quality',
    duration: '3-6m',
    dealSize: '100k-500k',
    roles: [
      { role: 'QA Architect / Lead', fte: 1 },
      { role: 'Automation Engineer', fte: 2 },
      { role: 'Performance Engineer', fte: 0.5 },
      { role: 'Project Manager', fte: 0.5 },
    ],
    sprintRange: [8, 12],
    peopleDaysRange: [300, 650],
    dailyRateRangeUSD: [340, 560],
    headline: '4-person QA engineering team, 8–12 sprints',
    caveats: [
      'Automation framework tooling and test management platform licences excluded',
      'Performance testing requires production-like environment — client-provisioned',
      'Accessibility (WCAG) and security testing priced as separate workstreams if required',
    ],
  },
  {
    workCategory: 'gf-quality',
    duration: '6-12m',
    dealSize: '500k-2m',
    roles: [
      { role: 'QA Architect / Lead', fte: 1 },
      { role: 'Automation Engineer', fte: 3 },
      { role: 'Performance Engineer', fte: 1 },
      { role: 'Security Test Engineer', fte: 0.5 },
      { role: 'Project Manager', fte: 1 },
    ],
    sprintRange: [16, 26],
    peopleDaysRange: [1100, 2800],
    dailyRateRangeUSD: [360, 580],
    headline: '6.5-person quality engineering programme, 16–26 sprints',
    caveats: [
      'Embedded QA in multiple dev squads adds travel/coordination overhead',
      'Rate range is blended nearshore/offshore hybrid',
      'Scope excludes manual regression testing — automation-first model assumed',
    ],
  },

  // ─── bf-modernisation ─────────────────────────────────────────────────────
  {
    workCategory: 'bf-modernisation',
    duration: '6-12m',
    dealSize: '500k-2m',
    roles: [
      { role: 'Solution Architect', fte: 1 },
      { role: 'Senior Backend Engineer', fte: 3 },
      { role: 'DevOps Engineer', fte: 1 },
      { role: 'QA Engineer', fte: 1 },
      { role: 'Project Manager', fte: 1 },
    ],
    sprintRange: [16, 26],
    peopleDaysRange: [1300, 3200],
    dailyRateRangeUSD: [430, 700],
    headline: '7-person modernisation team, 16–26 sprints',
    caveats: [
      'Legacy dependency discovery sprint (4–6 weeks) should be priced separately before fixed commitment',
      'Parallel-run period (legacy + new system) adds infrastructure and coordination cost not captured here',
      'Rate range skews onshore/nearshore due to legacy technology expertise requirement',
    ],
  },
  {
    workCategory: 'bf-modernisation',
    duration: 'gt12m',
    dealSize: 'gt2m',
    roles: [
      { role: 'Solution Architect', fte: 1 },
      { role: 'Senior Backend Engineer', fte: 5 },
      { role: 'DevOps / Platform Engineer', fte: 2 },
      { role: 'QA Lead + Engineers', fte: 2 },
      { role: 'Business Analyst', fte: 1 },
      { role: 'Project Manager', fte: 1 },
      { role: 'Change Management', fte: 0.5, notes: 'Organisational adoption' },
    ],
    sprintRange: [30, 50],
    peopleDaysRange: [5000, 14000],
    dailyRateRangeUSD: [460, 750],
    headline: 'Programme-scale 12.5-person modernisation, 30–50 sprints',
    caveats: [
      'Strangler-fig approach recommended — price as a phased programme, not a single engagement',
      'Team upskilling and KT effort included at 0.5 FTE — may need dedicated resource for complex stack transitions',
      'Legacy system decommission and infrastructure run-down costs excluded',
    ],
  },

  // ─── bf-integration ───────────────────────────────────────────────────────
  {
    workCategory: 'bf-integration',
    duration: '3-6m',
    dealSize: '100k-500k',
    roles: [
      { role: 'Integration Architect', fte: 0.5, notes: 'Design authority / part-time' },
      { role: 'Integration Developer', fte: 2 },
      { role: 'Business Analyst', fte: 0.5 },
      { role: 'QA Engineer', fte: 0.5 },
      { role: 'Project Manager', fte: 0.5 },
    ],
    sprintRange: [6, 10],
    peopleDaysRange: [250, 600],
    dailyRateRangeUSD: [380, 620],
    headline: '4-person integration team, 6–10 sprints',
    caveats: [
      'Integration scope assumes all system owners are engaged and provide API specs at kickoff',
      'ESB/iPaaS platform licences excluded from professional services estimate',
      'Each additional undocumented integration adds 2–4 weeks to schedule',
    ],
  },
  {
    workCategory: 'bf-integration',
    duration: '6-12m',
    dealSize: '500k-2m',
    roles: [
      { role: 'Integration Architect', fte: 1 },
      { role: 'Integration Developer', fte: 4 },
      { role: 'Business Analyst', fte: 1 },
      { role: 'QA Engineer', fte: 1 },
      { role: 'Project Manager', fte: 1 },
    ],
    sprintRange: [14, 22],
    peopleDaysRange: [1100, 2800],
    dailyRateRangeUSD: [400, 660],
    headline: '8-person integration programme, 14–22 sprints',
    caveats: [
      'B2B/partner integrations with external parties add timeline risk not captured in people-days',
      'Event streaming / Kafka-based architectures require specialist skills — rate skews onshore',
      'Error handling, DLQ design, and operational runbooks included; ongoing monitoring excluded',
    ],
  },

  // ─── bf-ai: AI on Existing Systems ───────────────────────────────────────
  {
    workCategory: 'bf-ai',
    duration: '3-6m',
    dealSize: '100k-500k',
    roles: [
      { role: 'ML / AI Engineer', fte: 1.5 },
      { role: 'Data Engineer', fte: 1 },
      { role: 'Project Manager', fte: 0.5 },
    ],
    sprintRange: [6, 10],
    peopleDaysRange: [250, 600],
    dailyRateRangeUSD: [480, 750],
    headline: '3-person AI augmentation pod, 6–10 sprints',
    caveats: [
      'Data readiness assessment (2–4 week sprint) should precede fixed commitment — price separately',
      'Model hosting, inference infrastructure, and GPU compute costs excluded',
      'Assumes client data science SME available for domain validation',
    ],
  },
  {
    workCategory: 'bf-ai',
    duration: '6-12m',
    dealSize: '500k-2m',
    roles: [
      { role: 'ML / AI Engineer', fte: 2 },
      { role: 'Data Scientist', fte: 1 },
      { role: 'Data Engineer', fte: 1.5 },
      { role: 'MLOps Engineer', fte: 0.5 },
      { role: 'Project Manager', fte: 1 },
    ],
    sprintRange: [14, 22],
    peopleDaysRange: [1200, 3000],
    dailyRateRangeUSD: [500, 800],
    headline: '6-person AI delivery programme, 14–22 sprints',
    caveats: [
      'EU AI Act or sector-specific explainability requirements add 20–35% to scope',
      'Human-in-the-loop review tooling design included; operational running excluded',
      'Rate skews onshore/nearshore due to ML specialisation scarcity',
    ],
  },

  // ─── bf-ams: Application Management & Support ─────────────────────────────
  {
    workCategory: 'bf-ams',
    duration: '6-12m',
    dealSize: '100k-500k',
    roles: [
      { role: 'Service Delivery Manager', fte: 0.5, notes: 'Accountable for SLA performance' },
      { role: 'L2 Support Engineer', fte: 2 },
      { role: 'L1 Support Analyst', fte: 1 },
    ],
    sprintRange: [12, 26],
    peopleDaysRange: [400, 1000],
    dailyRateRangeUSD: [280, 480],
    headline: '3.5-person AMS pod, steady-state 12–26 weeks',
    caveats: [
      'Capacity sized against baseline incident volume — historic data required before pricing',
      'Enhancement development not included; separate retainer or T&M needed',
      'Offshore/nearshore delivery assumed; onshore escalation resource priced separately',
    ],
  },
  {
    workCategory: 'bf-ams',
    duration: 'gt12m',
    dealSize: '500k-2m',
    roles: [
      { role: 'Service Delivery Manager', fte: 1 },
      { role: 'L3 Technical Lead', fte: 1 },
      { role: 'L2 Support Engineer', fte: 3 },
      { role: 'L1 Support Analyst', fte: 2 },
      { role: 'QA / Release Engineer', fte: 0.5 },
    ],
    sprintRange: [26, 52],
    peopleDaysRange: [2000, 5000],
    dailyRateRangeUSD: [300, 520],
    headline: '7.5-person AMS programme, 26–52 weeks',
    caveats: [
      'SLA penalty exposure modelling required before signing — request 12 months of incident history',
      'Enhancement retainer included at 20% of team capacity; larger enhancements escalated to project',
      'Transition period (shadow + cutover) priced separately at T&M — typically 4–8 weeks',
    ],
  },

  // ─── cross-advisory: Advisory, PoC & Discovery ────────────────────────────
  {
    workCategory: 'cross-advisory',
    duration: 'lt3m',
    dealSize: 'lt100k',
    roles: [
      { role: 'Principal Consultant / Architect', fte: 1 },
      { role: 'Business Analyst', fte: 0.5 },
    ],
    sprintRange: [2, 6],
    peopleDaysRange: [30, 100],
    dailyRateRangeUSD: [800, 1400],
    headline: '1.5-person advisory pod, 2–6 weeks',
    caveats: [
      'Rate reflects senior advisory expertise — typically onshore or client-site',
      'Workshop facilitation and travel costs priced separately',
      'Deliverable is a decision-grade output (architecture blueprint, vendor shortlist, business case) — not a slide deck',
    ],
  },
  {
    workCategory: 'cross-advisory',
    duration: '3-6m',
    dealSize: '100k-500k',
    roles: [
      { role: 'Principal Consultant / Architect', fte: 1 },
      { role: 'Senior Consultant', fte: 1 },
      { role: 'Business Analyst', fte: 0.5 },
      { role: 'Project Manager', fte: 0.5 },
    ],
    sprintRange: [6, 12],
    peopleDaysRange: [200, 550],
    dailyRateRangeUSD: [750, 1200],
    headline: '3-person advisory programme, 6–12 weeks',
    caveats: [
      'Rate reflects senior advisory expertise — nearshore/onshore blend',
      'PoC infrastructure and tooling costs excluded',
      'Discovery outputs must be actionable — budget includes one validation workshop per phase',
    ],
  },

  // ─── cross-staffaug: Staff Augmentation ───────────────────────────────────
  {
    workCategory: 'cross-staffaug',
    duration: '3-6m',
    dealSize: '100k-500k',
    roles: [
      { role: 'Senior Engineer / Specialist', fte: 2 },
      { role: 'Mid-level Engineer', fte: 1 },
    ],
    sprintRange: [6, 12],
    peopleDaysRange: [300, 700],
    dailyRateRangeUSD: [350, 650],
    headline: '3-person staff augmentation, 3–6 months',
    caveats: [
      'Rate range varies significantly by role specialisation — architect rates are 2–3x developer rates',
      'Ramp-up time (2–4 weeks) not billed at full capacity — account for in plan',
      'Knowledge transfer at exit must be contractually scoped; default exit leaves no documentation',
    ],
  },
  {
    workCategory: 'cross-staffaug',
    duration: '6-12m',
    dealSize: '500k-2m',
    roles: [
      { role: 'Senior Engineer / Specialist', fte: 4 },
      { role: 'Mid-level Engineer', fte: 3 },
      { role: 'Engagement Coordinator', fte: 0.5 },
    ],
    sprintRange: [12, 26],
    peopleDaysRange: [1200, 3500],
    dailyRateRangeUSD: [370, 680],
    headline: '7.5-person staff augmentation, 6–12 months',
    caveats: [
      'Team cohesion and attrition risk increases for engagements exceeding 6 months without renewal incentives',
      'Blended rate assumes mix of senior and mid-level; architect-heavy augmentation adds 30–40% to rate',
      'Exit criteria and KT obligations must be contractually defined — not assumed',
    ],
  },

  // ─── cross-programme: Programme / Delivery Management ─────────────────────
  {
    workCategory: 'cross-programme',
    duration: '6-12m',
    dealSize: '500k-2m',
    roles: [
      { role: 'Programme Director', fte: 1 },
      { role: 'Project Manager', fte: 2 },
      { role: 'PMO Analyst', fte: 1 },
      { role: 'Risk & Governance Lead', fte: 0.5 },
    ],
    sprintRange: [14, 26],
    peopleDaysRange: [1000, 2500],
    dailyRateRangeUSD: [600, 1000],
    headline: '4.5-person programme management, 14–26 weeks',
    caveats: [
      'Rate reflects senior programme management — typically onshore or client-site heavy',
      'Delivery teams (engineers, QA) priced separately under their respective work type categories',
      'Transformation programmes benefit from dedicated change management — price separately',
    ],
  },
  {
    workCategory: 'cross-programme',
    duration: 'gt12m',
    dealSize: 'gt2m',
    roles: [
      { role: 'Programme Director', fte: 1 },
      { role: 'Project Manager', fte: 3 },
      { role: 'PMO Lead', fte: 1 },
      { role: 'Risk & Governance Lead', fte: 1 },
      { role: 'Change Management Lead', fte: 1 },
    ],
    sprintRange: [26, 52],
    peopleDaysRange: [4000, 10000],
    dailyRateRangeUSD: [650, 1100],
    headline: 'Enterprise PMO, 7-person programme management function',
    caveats: [
      'Multi-vendor programme management requires authority model clearly defined in contract',
      'Rate range is onshore-heavy; offshore PMO support priced at 30–40% reduction',
      'Delivery stream estimates are separate — this covers governance and oversight only',
    ],
  },

  // ─── cross-training: Training & Enablement ────────────────────────────────
  {
    workCategory: 'cross-training',
    duration: 'lt3m',
    dealSize: 'lt100k',
    roles: [
      { role: 'Senior Trainer / Consultant', fte: 1 },
      { role: 'Content Developer', fte: 0.5 },
    ],
    sprintRange: [2, 6],
    peopleDaysRange: [20, 80],
    dailyRateRangeUSD: [700, 1100],
    headline: '1.5-person training engagement, 2–6 weeks',
    caveats: [
      'Training materials development is 50–60% of effort — budget for content before delivery',
      'Post-training assessment and certification mechanism priced separately if required',
      'Content ownership and maintenance responsibility must be agreed upfront',
    ],
  },
  {
    workCategory: 'cross-training',
    duration: '3-6m',
    dealSize: '100k-500k',
    roles: [
      { role: 'Senior Trainer / Consultant', fte: 1 },
      { role: 'Content Developer', fte: 1 },
      { role: 'Project Manager', fte: 0.5 },
    ],
    sprintRange: [6, 12],
    peopleDaysRange: [150, 450],
    dailyRateRangeUSD: [650, 1000],
    headline: '2.5-person training programme, 6–12 weeks',
    caveats: [
      'Behavioural change training (Agile, DevOps coaching) requires sustained engagement — one-off workshops rarely produce adoption',
      'Learning management system and tooling licences excluded',
      'Rate range is onshore-heavy; blended delivery (in-person + virtual) reduces cost',
    ],
  },
];
