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

  // ─── gf-cloud-native: Cloud / DevOps / Infra ──────────────────────────────
  {
    workCategory: 'gf-cloud-native',
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
    workCategory: 'gf-cloud-native',
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
];
