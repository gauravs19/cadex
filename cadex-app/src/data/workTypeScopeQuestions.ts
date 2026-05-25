// ============================================================
// CADEX — Work-Type Scope Questions
// Dynamic contextual form shown after work type selection.
// Each block surfaces 3–5 scope-defining questions specific
// to the chosen work type, stored in meta.workTypeScopeAnswers.
// ============================================================

export type ScopeQType = 'select' | 'radio' | 'text' | 'number'

export interface ScopeOption {
  value: string
  label: string
  risk?: string  // shown as a warning hint if this option is selected
}

export interface ScopeQuestion {
  id: string
  label: string
  hint?: string
  type: ScopeQType
  options?: ScopeOption[]
  placeholder?: string
}

export interface WorkTypeScopeBlock {
  workTypeId: string
  heading: string
  intro: string
  questions: ScopeQuestion[]
}

// ── Helper to build consistent option arrays ──────────────

function yn(riskOnNo?: string, riskOnYes?: string): ScopeOption[] {
  return [
    { value: 'yes', label: 'Yes', ...(riskOnYes ? { risk: riskOnYes } : {}) },
    { value: 'no', label: 'No', ...(riskOnNo ? { risk: riskOnNo } : {}) },
    { value: 'tbd', label: 'TBD / Unknown' },
  ]
}

// ── Scope question blocks per work type ───────────────────

export const WORK_TYPE_SCOPE_BLOCKS: WorkTypeScopeBlock[] = [

  // ── Digital Experience ──────────────────────────────────

  {
    workTypeId: 'dx-portal',
    heading: 'Portal Scope Details',
    intro: 'Help us size and de-risk the portal delivery.',
    questions: [
      {
        id: 'dx-portal-users',
        label: 'Who are the primary users?',
        type: 'select',
        options: [
          { value: 'external-customers', label: 'External customers / consumers' },
          { value: 'internal-employees', label: 'Internal employees only' },
          { value: 'partners-b2b', label: 'B2B partners / dealers' },
          { value: 'mixed', label: 'Mixed (internal + external)' },
        ],
      },
      {
        id: 'dx-portal-persona-count',
        label: 'How many distinct user personas / roles?',
        type: 'select',
        options: [
          { value: '1', label: '1 persona' },
          { value: '2-3', label: '2–3 personas' },
          { value: '4+', label: '4 or more', risk: '4+ personas significantly expand scope — each needs distinct UX flows and access controls.' },
        ],
      },
      {
        id: 'dx-portal-auth',
        label: 'Authentication / SSO requirement',
        type: 'select',
        options: [
          { value: 'new-sso', label: 'New SSO/IdP to be built', risk: 'New IdP implementation adds 3–6 weeks of integration and security review effort.' },
          { value: 'existing-sso', label: 'Integrate with existing SSO (SAML/OIDC)' },
          { value: 'social-login', label: 'Social login only (Google/Microsoft)' },
          { value: 'basic', label: 'Simple username/password' },
        ],
      },
      {
        id: 'dx-portal-mobile',
        label: 'Mobile / responsive requirement',
        type: 'select',
        options: [
          { value: 'responsive-web', label: 'Responsive web only' },
          { value: 'native-app', label: 'Native mobile app also required', risk: 'Native app doubles the frontend scope — confirm if a PWA would meet the need.' },
          { value: 'pwa', label: 'Progressive Web App (PWA)' },
          { value: 'desktop-only', label: 'Desktop-only for now' },
        ],
      },
      {
        id: 'dx-portal-cms',
        label: 'Is content management (CMS) in scope?',
        type: 'select',
        options: [
          { value: 'yes-new', label: 'Yes — new CMS to be selected and integrated', risk: 'CMS selection, content model design, and author workflow adds a significant workstream.' },
          { value: 'yes-existing', label: 'Yes — integrate with existing CMS' },
          { value: 'no', label: 'No — static or application-managed content' },
        ],
      },
    ],
  },

  {
    workTypeId: 'dx-mobile',
    heading: 'Mobile App Scope Details',
    intro: 'Define the platform, scale, and integration footprint.',
    questions: [
      {
        id: 'dx-mobile-platforms',
        label: 'Target platforms',
        type: 'select',
        options: [
          { value: 'ios-only', label: 'iOS only' },
          { value: 'android-only', label: 'Android only' },
          { value: 'both', label: 'iOS + Android', risk: 'Dual-platform support increases test and release effort — confirm if React Native / Flutter is acceptable.' },
          { value: 'cross-platform', label: 'Cross-platform (React Native / Flutter)' },
        ],
      },
      {
        id: 'dx-mobile-mau',
        label: 'Expected users at launch',
        type: 'select',
        options: [
          { value: 'lt1k', label: 'Under 1,000' },
          { value: '1k-50k', label: '1,000 – 50,000' },
          { value: '50k-500k', label: '50,000 – 500,000' },
          { value: 'gt500k', label: 'Over 500,000', risk: 'High-scale consumer apps need dedicated performance architecture and CDN strategy priced in.' },
        ],
      },
      {
        id: 'dx-mobile-offline',
        label: 'Offline capability required?',
        type: 'select',
        options: yn('No offline needed.', 'Offline sync is a significant technical workstream — data conflict resolution strategy must be designed.'),
      },
      {
        id: 'dx-mobile-backend',
        label: 'Backend / API',
        type: 'select',
        options: [
          { value: 'greenfield', label: 'New backend to be built as part of this engagement' },
          { value: 'existing-api', label: 'Existing API / backend (mobile client only)' },
          { value: 'bff', label: 'Backend for Frontend (BFF) layer to be built on existing services' },
        ],
      },
      {
        id: 'dx-mobile-push',
        label: 'Push notifications required?',
        type: 'select',
        options: yn(undefined, 'Push notification infrastructure (APNs/FCM) and campaign management add backend and ops scope.'),
      },
    ],
  },

  {
    workTypeId: 'dx-spa',
    heading: 'Web Application Scope Details',
    intro: 'Clarify frontend framework, backend scope, and key NFRs.',
    questions: [
      {
        id: 'dx-spa-framework',
        label: 'Frontend framework',
        type: 'select',
        options: [
          { value: 'react', label: 'React' },
          { value: 'angular', label: 'Angular' },
          { value: 'vue', label: 'Vue' },
          { value: 'existing', label: 'Existing framework (migrating/extending)' },
          { value: 'tbd', label: 'To be decided' },
        ],
      },
      {
        id: 'dx-spa-backend',
        label: 'Backend / API scope',
        type: 'select',
        options: [
          { value: 'greenfield-full', label: 'Full stack — new backend in scope' },
          { value: 'api-only', label: 'Frontend only — consuming existing APIs' },
          { value: 'bff', label: 'Backend-for-Frontend layer only' },
        ],
      },
      {
        id: 'dx-spa-realtime',
        label: 'Real-time features (WebSockets, live data)?',
        type: 'select',
        options: yn(undefined, 'Real-time data push requires WebSocket or SSE infrastructure — adds backend architecture complexity.'),
      },
      {
        id: 'dx-spa-ssr',
        label: 'SEO / Server-Side Rendering required?',
        type: 'select',
        options: yn(undefined, 'SSR (Next.js/Nuxt) adds hosting complexity and changes the deployment model.'),
      },
      {
        id: 'dx-spa-users',
        label: 'Estimated concurrent users at peak',
        type: 'select',
        options: [
          { value: 'lt500', label: 'Under 500' },
          { value: '500-10k', label: '500 – 10,000' },
          { value: 'gt10k', label: 'Over 10,000', risk: 'High concurrency needs performance budget, load testing, and CDN strategy priced in.' },
        ],
      },
    ],
  },

  {
    workTypeId: 'dx-ecommerce',
    heading: 'E-Commerce Scope Details',
    intro: 'Define platform, catalogue scale, and integration scope.',
    questions: [
      {
        id: 'dx-ecom-platform',
        label: 'Commerce platform',
        type: 'select',
        options: [
          { value: 'custom', label: 'Custom build (no commercial platform)' },
          { value: 'shopify', label: 'Shopify / Shopify Plus' },
          { value: 'commercetools', label: 'commercetools' },
          { value: 'magento', label: 'Adobe Commerce / Magento' },
          { value: 'salesforce-cc', label: 'Salesforce Commerce Cloud' },
          { value: 'sap-cx', label: 'SAP Commerce (Hybris)' },
          { value: 'other', label: 'Other platform' },
        ],
      },
      {
        id: 'dx-ecom-catalog',
        label: 'Product catalogue size',
        type: 'select',
        options: [
          { value: 'lt1k', label: 'Under 1,000 SKUs' },
          { value: '1k-50k', label: '1,000 – 50,000 SKUs' },
          { value: 'gt50k', label: 'Over 50,000 SKUs', risk: 'Large catalogue needs PIM integration and bulk import/export tools — adds significant scope.' },
        ],
      },
      {
        id: 'dx-ecom-payments',
        label: 'Payment regions and methods',
        type: 'select',
        options: [
          { value: 'single-card', label: 'Single region, card only' },
          { value: 'single-multi', label: 'Single region, multiple methods' },
          { value: 'multi-region', label: 'Multi-region payments', risk: 'Multi-region payments require separate PSP instances, currency handling, and PCI scope per region.' },
        ],
      },
      {
        id: 'dx-ecom-erp',
        label: 'ERP / OMS / inventory integration?',
        type: 'select',
        options: yn('No ERP integration.', 'ERP/OMS integration is typically the highest-effort workstream — get a separate estimate for this.'),
      },
      {
        id: 'dx-ecom-b2b',
        label: 'B2B or B2C?',
        type: 'select',
        options: [
          { value: 'b2c', label: 'B2C (consumers)' },
          { value: 'b2b', label: 'B2B (trade / dealer portal)', risk: 'B2B requires account management, tiered pricing, quote flows, and approval workflows — significantly more scope than B2C.' },
          { value: 'both', label: 'Both B2B and B2C', risk: 'Dual-model e-commerce doubles the scope of authentication, pricing, and checkout flows.' },
        ],
      },
    ],
  },

  {
    workTypeId: 'dx-cms',
    heading: 'CMS / DXP Scope Details',
    intro: 'Define platform choice, content model scope, and editorial workflow.',
    questions: [
      {
        id: 'dx-cms-platform',
        label: 'CMS / DXP platform',
        type: 'select',
        options: [
          { value: 'contentful', label: 'Contentful' },
          { value: 'sanity', label: 'Sanity' },
          { value: 'contentstack', label: 'Contentstack' },
          { value: 'strapi', label: 'Strapi (open-source)' },
          { value: 'aem', label: 'Adobe Experience Manager (AEM)' },
          { value: 'sitecore', label: 'Sitecore' },
          { value: 'drupal', label: 'Drupal' },
          { value: 'wordpress-enterprise', label: 'WordPress (enterprise)' },
          { value: 'tbd', label: 'Not yet decided' },
        ],
      },
      {
        id: 'dx-cms-content-types',
        label: 'Estimated number of content types / models',
        type: 'select',
        options: [
          { value: 'lt10', label: 'Under 10' },
          { value: '10-30', label: '10 – 30' },
          { value: 'gt30', label: 'Over 30', risk: 'Complex content model needs dedicated content architecture phase before build — underestimating this is a top CMS project failure.' },
        ],
      },
      {
        id: 'dx-cms-editorial',
        label: 'Editorial workflow complexity',
        type: 'select',
        options: [
          { value: 'simple', label: 'Simple — publish/unpublish only' },
          { value: 'review', label: 'Review/approval workflow' },
          { value: 'multilingual', label: 'Multilingual + localisation', risk: 'Multilingual with translation workflow adds significant content ops scope and often a translation management integration.' },
          { value: 'personalisation', label: 'Personalisation / A/B testing' },
        ],
      },
      {
        id: 'dx-cms-migration',
        label: 'Existing content to be migrated?',
        type: 'select',
        options: yn(undefined, 'Content migration is frequently underestimated — volume, format cleanup, and SEO URL mapping all need separate effort estimates.'),
      },
    ],
  },

  // ── Product Engineering ─────────────────────────────────

  {
    workTypeId: 'pe-saas',
    heading: 'SaaS Product Scope Details',
    intro: 'Define architecture model, cloud target, and commercial scope.',
    questions: [
      {
        id: 'pe-saas-tenancy',
        label: 'Tenancy model',
        type: 'select',
        options: [
          { value: 'single', label: 'Single-tenant (one instance per customer)' },
          { value: 'multi', label: 'Multi-tenant (shared infrastructure)', risk: 'Multi-tenancy requires data isolation architecture, tenant-aware billing, and per-tenant configuration — adds significant architectural complexity.' },
          { value: 'hybrid', label: 'Hybrid (configurable per customer tier)' },
          { value: 'tbd', label: 'Not yet decided' },
        ],
      },
      {
        id: 'pe-saas-cloud',
        label: 'Cloud target',
        type: 'select',
        options: [
          { value: 'aws', label: 'AWS' },
          { value: 'azure', label: 'Azure' },
          { value: 'gcp', label: 'Google Cloud' },
          { value: 'multi', label: 'Multi-cloud', risk: 'Multi-cloud increases infrastructure complexity and ops overhead — confirm this is a real requirement vs preference.' },
          { value: 'tbd', label: 'Not yet decided' },
        ],
      },
      {
        id: 'pe-saas-billing',
        label: 'Billing / subscription management in scope?',
        type: 'select',
        options: [
          { value: 'yes-new', label: 'Yes — new billing integration (Stripe, Chargebee)', risk: 'Billing integration is a non-trivial workstream — subscription lifecycle, proration, dunning, and invoice generation all need scoping.' },
          { value: 'yes-existing', label: 'Yes — extending existing billing system' },
          { value: 'no', label: 'No — manual invoicing or out-of-scope' },
        ],
      },
      {
        id: 'pe-saas-initial-customers',
        label: 'Target customer count at GA launch',
        type: 'select',
        options: [
          { value: 'lt10', label: 'Under 10 (early access / beta)' },
          { value: '10-100', label: '10 – 100' },
          { value: 'gt100', label: 'Over 100', risk: 'GA scale requires production-grade ops, support SLAs, and incident response process — price these separately.' },
        ],
      },
    ],
  },

  {
    workTypeId: 'pe-embedded',
    heading: 'Embedded / IoT Scope Details',
    intro: 'Capture hardware context and certification requirements upfront.',
    questions: [
      {
        id: 'pe-emb-hardware',
        label: 'Hardware platform',
        type: 'select',
        options: [
          { value: 'existing-platform', label: 'Existing hardware platform (customer-provided)' },
          { value: 'custom-design', label: 'Custom hardware design in scope', risk: 'Custom hardware design adds hardware bring-up, board validation, and NRE cost — must be priced separately from software.' },
          { value: 'cots', label: 'COTS / dev board (RPi, NVIDIA Jetson, etc.)' },
          { value: 'tbd', label: 'Hardware TBD' },
        ],
      },
      {
        id: 'pe-emb-rtos',
        label: 'RTOS or bare-metal?',
        type: 'select',
        options: [
          { value: 'rtos', label: 'RTOS (FreeRTOS, Zephyr, AUTOSAR)', risk: 'RTOS expertise is a specialised skill — confirm team capability before committing.' },
          { value: 'linux', label: 'Embedded Linux' },
          { value: 'bare-metal', label: 'Bare-metal (no OS)' },
          { value: 'tbd', label: 'TBD' },
        ],
      },
      {
        id: 'pe-emb-certs',
        label: 'Safety / certification requirements',
        type: 'select',
        options: [
          { value: 'none', label: 'No safety certification required' },
          { value: 'ce-fcc', label: 'CE / FCC (radio compliance)' },
          { value: 'iec61508', label: 'IEC 61508 / IEC 62443 (functional safety)', risk: 'Functional safety certification doubles development effort — needs safety engineer and formal design process.' },
          { value: 'fda', label: 'FDA / MDR (medical device)', risk: 'Medical device regulation requires DHF documentation, design controls, and clinical evidence — specialised process and significant effort.' },
          { value: 'automotive', label: 'ISO 26262 / AUTOSAR (automotive)', risk: 'Automotive safety standard requires ASIL analysis, extensive documentation, and tool qualification.' },
        ],
      },
      {
        id: 'pe-emb-ota',
        label: 'OTA firmware update required?',
        type: 'select',
        options: yn(undefined, 'OTA update infrastructure (signing, rollback, delta updates) is a separate workstream — often underestimated.'),
      },
    ],
  },

  {
    workTypeId: 'pe-api-platform',
    heading: 'API / Platform Scope Details',
    intro: 'Define API footprint, consumer model, and governance scope.',
    questions: [
      {
        id: 'pe-api-endpoints',
        label: 'Estimated number of API endpoints',
        type: 'select',
        options: [
          { value: 'lt20', label: 'Under 20' },
          { value: '20-50', label: '20 – 50' },
          { value: 'gt50', label: 'Over 50', risk: 'Large API surface requires dedicated API design governance and versioning strategy from day one.' },
        ],
      },
      {
        id: 'pe-api-consumers',
        label: 'Who will consume this API?',
        type: 'select',
        options: [
          { value: 'internal', label: 'Internal teams only' },
          { value: 'external-few', label: 'External (under 10 partners)' },
          { value: 'external-many', label: 'External (10+ partners / public)', risk: 'Public or broad external API needs developer portal, versioning policy, rate limiting, and SLA commitments.' },
        ],
      },
      {
        id: 'pe-api-style',
        label: 'API style',
        type: 'select',
        options: [
          { value: 'rest', label: 'REST' },
          { value: 'graphql', label: 'GraphQL' },
          { value: 'grpc', label: 'gRPC' },
          { value: 'event', label: 'Event / AsyncAPI' },
          { value: 'mixed', label: 'Mixed / TBD' },
        ],
      },
      {
        id: 'pe-api-monetise',
        label: 'API monetisation / billing in scope?',
        type: 'select',
        options: yn(undefined, 'API monetisation requires usage tracking, tiered pricing, and billing integration — add dedicated workstream.'),
      },
    ],
  },

  {
    workTypeId: 'pe-ai-ml',
    heading: 'AI / ML Product Scope Details',
    intro: 'Data readiness and model strategy are the highest-risk unknowns.',
    questions: [
      {
        id: 'pe-aiml-model',
        label: 'Model approach',
        type: 'select',
        options: [
          { value: 'pretrained-api', label: 'Use pre-trained model via API (e.g. OpenAI)' },
          { value: 'finetune', label: 'Fine-tune existing model on client data', risk: 'Fine-tuning requires labelled training data and ML infrastructure — confirm data availability before estimating.' },
          { value: 'train-scratch', label: 'Train new model from scratch', risk: 'Training from scratch requires large datasets, GPU infrastructure, and specialist ML engineers — cost and timeline are highly uncertain.' },
          { value: 'tbd', label: 'To be determined' },
        ],
      },
      {
        id: 'pe-aiml-data',
        label: 'Training / inference data readiness',
        type: 'select',
        options: [
          { value: 'ready', label: 'Data exists, clean and accessible' },
          { value: 'exists-dirty', label: 'Data exists but needs significant cleaning', risk: 'Data cleaning is typically 40–60% of ML project effort — price it as a separate workstream.' },
          { value: 'partial', label: 'Partial data — gaps need filling' },
          { value: 'none', label: 'No data yet', risk: 'Without training data, the ML project cannot start — resolve this before committing to timelines.' },
        ],
      },
      {
        id: 'pe-aiml-kpi',
        label: 'Model accuracy / performance KPI defined?',
        type: 'select',
        options: yn('No acceptance criteria for model accuracy means "done" is undefined — negotiate this before contract.', undefined),
      },
      {
        id: 'pe-aiml-serving',
        label: 'Inference mode',
        type: 'select',
        options: [
          { value: 'batch', label: 'Batch (offline scoring)' },
          { value: 'realtime-low', label: 'Real-time (<500ms latency)' },
          { value: 'realtime-high', label: 'Real-time (<100ms latency)', risk: 'Sub-100ms inference requires GPU serving infrastructure and model optimisation (quantisation/distillation) — adds significant effort.' },
        ],
      },
    ],
  },

  // ── Platform & Infrastructure ──────────────────────────

  {
    workTypeId: 'plat-data',
    heading: 'Data Platform Scope Details',
    intro: 'Data source count and quality are the most significant scope drivers.',
    questions: [
      {
        id: 'plat-data-volume',
        label: 'Data volume',
        type: 'select',
        options: [
          { value: 'lt100gb', label: 'Under 100 GB' },
          { value: '100gb-10tb', label: '100 GB – 10 TB' },
          { value: 'gt10tb', label: 'Over 10 TB', risk: 'Petabyte-scale requires lakehouse architecture, cost management strategy, and dedicated infrastructure planning.' },
        ],
      },
      {
        id: 'plat-data-sources',
        label: 'Number of data sources (systems to ingest from)',
        type: 'select',
        options: [
          { value: 'lt5', label: 'Under 5' },
          { value: '5-15', label: '5 – 15' },
          { value: 'gt15', label: 'Over 15', risk: 'Each data source is a separate integration with its own schema, quality, and refresh logic — scope grows significantly.' },
        ],
      },
      {
        id: 'plat-data-mode',
        label: 'Processing mode',
        type: 'select',
        options: [
          { value: 'batch', label: 'Batch (nightly / scheduled)' },
          { value: 'near-realtime', label: 'Near-real-time (minutes latency)' },
          { value: 'streaming', label: 'Streaming (seconds latency)', risk: 'Streaming pipelines require Kafka/Kinesis infrastructure and stateful processing design — significantly more complex than batch.' },
        ],
      },
      {
        id: 'plat-data-bi',
        label: 'BI / analytics layer',
        type: 'select',
        options: [
          { value: 'power-bi', label: 'Power BI' },
          { value: 'tableau', label: 'Tableau' },
          { value: 'looker', label: 'Looker / Looker Studio' },
          { value: 'custom', label: 'Custom dashboards / embedded analytics' },
          { value: 'none', label: 'No BI layer — raw data platform only' },
        ],
      },
      {
        id: 'plat-data-governance',
        label: 'Data governance / catalog in scope?',
        type: 'select',
        options: yn(undefined, 'Data catalog, lineage, and access control governance adds 20–30% to a data platform build — price as a separate track.'),
      },
    ],
  },

  {
    workTypeId: 'plat-cloud-native',
    heading: 'Cloud-Native Infrastructure Scope',
    intro: 'Define cloud target, migration scale, and operational requirements.',
    questions: [
      {
        id: 'plat-cn-cloud',
        label: 'Cloud provider',
        type: 'select',
        options: [
          { value: 'aws', label: 'AWS' },
          { value: 'azure', label: 'Azure' },
          { value: 'gcp', label: 'Google Cloud' },
          { value: 'multi', label: 'Multi-cloud', risk: 'Multi-cloud adds significant IaC complexity and requires cloud-agnostic abstraction layers — validate the business requirement.' },
          { value: 'tbd', label: 'TBD' },
        ],
      },
      {
        id: 'plat-cn-container',
        label: 'Container orchestration platform',
        type: 'select',
        options: [
          { value: 'eks', label: 'AWS EKS' },
          { value: 'aks', label: 'Azure AKS' },
          { value: 'gke', label: 'Google GKE' },
          { value: 'ecs', label: 'AWS ECS / Fargate' },
          { value: 'serverless', label: 'Serverless (Lambda / Cloud Run / Azure Functions)' },
          { value: 'tbd', label: 'TBD' },
        ],
      },
      {
        id: 'plat-cn-workloads',
        label: 'Number of services / workloads to containerise',
        type: 'select',
        options: [
          { value: 'lt10', label: 'Under 10' },
          { value: '10-30', label: '10 – 30' },
          { value: 'gt30', label: 'Over 30', risk: 'Large workload estates need platform engineering team and GitOps tooling — scope separately from app migration.' },
        ],
      },
      {
        id: 'plat-cn-ha',
        label: 'Multi-region / high availability required?',
        type: 'select',
        options: yn(undefined, 'Multi-region active-active adds significant IaC, database replication, and failover testing scope.'),
      },
    ],
  },

  {
    workTypeId: 'plat-devsecops',
    heading: 'DevSecOps Platform Scope',
    intro: 'Define toolchain scope, team scale, and security integration.',
    questions: [
      {
        id: 'plat-dso-teams',
        label: 'Number of development teams using the platform',
        type: 'select',
        options: [
          { value: '1-3', label: '1 – 3 teams' },
          { value: '4-10', label: '4 – 10 teams' },
          { value: 'gt10', label: 'Over 10 teams', risk: 'Platform serving 10+ teams needs self-service capabilities, golden paths, and dedicated platform engineering team.' },
        ],
      },
      {
        id: 'plat-dso-tools',
        label: 'Existing CI/CD tools (to migrate or replace)',
        type: 'select',
        options: [
          { value: 'jenkins', label: 'Jenkins (legacy)' },
          { value: 'github-actions', label: 'GitHub Actions (extending)' },
          { value: 'gitlab', label: 'GitLab CI/CD (extending)' },
          { value: 'azure-devops', label: 'Azure DevOps (extending)' },
          { value: 'none', label: 'Greenfield — no existing CI/CD' },
        ],
      },
      {
        id: 'plat-dso-security',
        label: 'Security scanning in scope',
        type: 'select',
        options: [
          { value: 'sast', label: 'SAST only (static analysis)' },
          { value: 'dast', label: 'DAST only (dynamic analysis)' },
          { value: 'both', label: 'SAST + DAST + SCA (software composition)' },
          { value: 'none', label: 'No security scanning in scope' },
        ],
      },
      {
        id: 'plat-dso-iac',
        label: 'Infrastructure as Code (IaC) in scope?',
        type: 'select',
        options: yn(undefined, 'IaC authoring (Terraform/Pulumi) is a significant workstream — ensure client team can own and maintain it after handover.'),
      },
    ],
  },

  // ── Greenfield AI ──────────────────────────────────────

  {
    workTypeId: 'ai-genai-app',
    heading: 'Generative AI Application Scope',
    intro: 'GenAI scope details — model, data, guardrails, and governance.',
    questions: [
      {
        id: 'ai-genai-llm',
        label: 'LLM provider / model',
        type: 'select',
        options: [
          { value: 'openai', label: 'OpenAI (GPT-4o / GPT-4)' },
          { value: 'azure-openai', label: 'Azure OpenAI Service' },
          { value: 'aws-bedrock', label: 'AWS Bedrock (Claude, Llama, etc.)' },
          { value: 'google-vertex', label: 'Google Vertex AI (Gemini)' },
          { value: 'anthropic-claude', label: 'Anthropic Claude (direct API)' },
          { value: 'opensource', label: 'Open-source (Llama, Mistral — self-hosted)', risk: 'Self-hosted LLM requires GPU infrastructure and model management — adds significant ops overhead.' },
          { value: 'tbd', label: 'Not yet decided' },
        ],
      },
      {
        id: 'ai-genai-rag',
        label: 'RAG / knowledge base in scope?',
        type: 'select',
        options: [
          { value: 'yes-new', label: 'Yes — new knowledge base to be built', risk: 'RAG pipeline (chunking, embedding, vector store, retrieval) is a full engineering workstream — price it explicitly.' },
          { value: 'yes-existing', label: 'Yes — connect to existing knowledge base' },
          { value: 'no', label: 'No RAG — prompt engineering only' },
        ],
      },
      {
        id: 'ai-genai-finetune',
        label: 'Fine-tuning required?',
        type: 'select',
        options: yn(undefined, 'Fine-tuning requires labelled training data, compute budget, and evaluation pipeline — adds 4–8 weeks and specialist ML effort.'),
      },
      {
        id: 'ai-genai-modality',
        label: 'Input modalities in scope',
        type: 'select',
        options: [
          { value: 'text', label: 'Text only' },
          { value: 'text-image', label: 'Text + image (multimodal)' },
          { value: 'text-audio', label: 'Text + audio (speech-to-text)' },
          { value: 'all', label: 'Text + image + audio / video', risk: 'Multi-modal inputs require separate preprocessing pipelines and significantly increase the model surface area.' },
        ],
      },
      {
        id: 'ai-genai-governance',
        label: 'AI safety / governance policy required?',
        type: 'select',
        options: yn(undefined, 'Responsible AI guardrails (content filtering, audit logging, human-in-the-loop) add a dedicated workstream and compliance review.'),
      },
    ],
  },

  // ── Migration ──────────────────────────────────────────

  {
    workTypeId: 'mig-cloud-lift',
    heading: 'Cloud Migration (Lift & Shift) Scope',
    intro: 'Discovery completeness and cut-over constraints are the key risk drivers.',
    questions: [
      {
        id: 'mig-lift-app-count',
        label: 'Number of applications / workloads to migrate',
        type: 'select',
        options: [
          { value: 'lt10', label: 'Under 10' },
          { value: '10-50', label: '10 – 50' },
          { value: 'gt50', label: 'Over 50', risk: 'Large estate migrations need application portfolio assessment and wave planning as a pre-migration workstream.' },
        ],
      },
      {
        id: 'mig-lift-cloud',
        label: 'Target cloud',
        type: 'select',
        options: [
          { value: 'aws', label: 'AWS' },
          { value: 'azure', label: 'Azure' },
          { value: 'gcp', label: 'Google Cloud' },
          { value: 'tbd', label: 'TBD' },
        ],
      },
      {
        id: 'mig-lift-discovery',
        label: 'Application discovery / portfolio assessment done?',
        type: 'select',
        options: yn('Portfolio assessment not done — price it as a discovery phase before migration estimate.', undefined),
      },
      {
        id: 'mig-lift-cutover',
        label: 'Cut-over window constraint',
        type: 'select',
        options: [
          { value: 'flexible', label: 'Flexible — no constraint' },
          { value: 'maintenance-window', label: 'Maintenance window required (nights / weekends)' },
          { value: 'zero-downtime', label: 'Zero-downtime required', risk: 'Zero-downtime cut-over requires parallel run, traffic shifting, and rollback strategy — adds significant complexity and cost.' },
        ],
      },
    ],
  },

  {
    workTypeId: 'mig-erp-crm',
    heading: 'ERP / CRM Migration Scope',
    intro: 'System context, customisation debt, and change management are the critical risk factors.',
    questions: [
      {
        id: 'mig-erp-source',
        label: 'Source system',
        type: 'select',
        options: [
          { value: 'sap-ecc', label: 'SAP ECC / R/3' },
          { value: 'oracle-ebs', label: 'Oracle EBS / JD Edwards' },
          { value: 'ms-dynamics-ax', label: 'Microsoft Dynamics AX / NAV' },
          { value: 'sfdc', label: 'Salesforce (previous org)' },
          { value: 'legacy-custom', label: 'Custom / bespoke legacy system', risk: 'Undocumented custom systems are the highest-risk source — price a discovery phase to map data and business rules.' },
          { value: 'other', label: 'Other' },
        ],
      },
      {
        id: 'mig-erp-target',
        label: 'Target system',
        type: 'select',
        options: [
          { value: 'sap-s4', label: 'SAP S/4HANA' },
          { value: 'sap-rise', label: 'SAP RISE (cloud managed)' },
          { value: 'sfdc', label: 'Salesforce (Sales/Service Cloud)' },
          { value: 'ms-d365', label: 'Microsoft Dynamics 365' },
          { value: 'oracle-fusion', label: 'Oracle Fusion / NetSuite' },
          { value: 'workday', label: 'Workday' },
          { value: 'other', label: 'Other' },
        ],
      },
      {
        id: 'mig-erp-custom',
        label: 'Custom objects / extensions in source system',
        type: 'select',
        options: [
          { value: 'few', label: 'Few — mostly vanilla' },
          { value: 'moderate', label: 'Moderate customisation' },
          { value: 'heavy', label: 'Heavily customised', risk: 'Heavily customised ERP migrations require a "customisation rationalization" workstream — many customisations should be replaced by standard features in the new system.' },
        ],
      },
      {
        id: 'mig-erp-users',
        label: 'Number of users migrating',
        type: 'select',
        options: [
          { value: 'lt100', label: 'Under 100' },
          { value: '100-1000', label: '100 – 1,000' },
          { value: 'gt1000', label: 'Over 1,000', risk: 'Large user migrations require structured change management, training programmes, and super-user network — must be a separate workstream.' },
        ],
      },
      {
        id: 'mig-erp-bpr',
        label: 'Business process redesign in scope?',
        type: 'select',
        options: yn(undefined, 'Business process redesign is a significant workstream requiring business analysts, process workshops, and sign-off from multiple business units.'),
      },
    ],
  },

  {
    workTypeId: 'mig-data',
    heading: 'Data Migration Scope',
    intro: 'Data volume, quality, and rollback strategy are the primary risk drivers.',
    questions: [
      {
        id: 'mig-data-volume',
        label: 'Data volume to migrate',
        type: 'select',
        options: [
          { value: 'lt10gb', label: 'Under 10 GB' },
          { value: '10gb-1tb', label: '10 GB – 1 TB' },
          { value: '1tb-100tb', label: '1 TB – 100 TB' },
          { value: 'gt100tb', label: 'Over 100 TB', risk: 'Large-scale data migration needs dedicated transfer infrastructure and cutover window planning.' },
        ],
      },
      {
        id: 'mig-data-sources',
        label: 'Number of source systems',
        type: 'select',
        options: [
          { value: '1', label: '1 source' },
          { value: '2-5', label: '2 – 5 sources' },
          { value: 'gt5', label: 'Over 5 sources', risk: 'Multiple source systems multiply transformation complexity and quality assurance effort.' },
        ],
      },
      {
        id: 'mig-data-quality',
        label: 'Data quality audit completed?',
        type: 'select',
        options: yn('Data quality audit not done — price it as a pre-migration task. Unknown data quality is the top migration scope risk.', undefined),
      },
      {
        id: 'mig-data-rollback',
        label: 'Rollback strategy defined?',
        type: 'select',
        options: yn('No rollback strategy means any production failure requires an emergency fix forward — add rollback design as a required deliverable.', undefined),
      },
    ],
  },

  {
    workTypeId: 'mig-replatform',
    heading: 'Re-platforming Scope',
    intro: 'Feature parity scope and parallel run requirements drive the estimate.',
    questions: [
      {
        id: 'mig-rp-source',
        label: 'Source platform',
        type: 'text',
        placeholder: 'e.g. Heroku / Ruby on Rails monolith',
      },
      {
        id: 'mig-rp-target',
        label: 'Target platform',
        type: 'text',
        placeholder: 'e.g. Kubernetes / Spring Boot microservices on AWS',
      },
      {
        id: 'mig-rp-parity',
        label: 'Feature parity scope',
        type: 'select',
        options: [
          { value: 'full', label: 'Full feature parity required' },
          { value: 'agreed-subset', label: 'Agreed subset — excluded features documented' },
          { value: 'tbd', label: 'TBD — parity scope not yet agreed', risk: 'Undefined feature parity scope is the #1 cause of re-platforming overruns — negotiate this before pricing.' },
        ],
      },
      {
        id: 'mig-rp-parallel',
        label: 'Parallel run period required?',
        type: 'select',
        options: yn(undefined, 'Parallel run (running old and new system simultaneously) adds significant operational complexity and cost — define duration and exit criteria.'),
      },
    ],
  },

  // ── Modernisation ──────────────────────────────────────

  {
    workTypeId: 'mod-re-arch',
    heading: 'Legacy Re-architecture Scope',
    intro: 'Codebase size and strangler-fig discipline determine risk.',
    questions: [
      {
        id: 'mod-ra-source',
        label: 'Source language / framework',
        type: 'text',
        placeholder: 'e.g. Java EE monolith, .NET Framework 4.x',
      },
      {
        id: 'mod-ra-pattern',
        label: 'Decomposition approach',
        type: 'select',
        options: [
          { value: 'strangler', label: 'Strangler fig (incremental, side-by-side)' },
          { value: 'big-bang', label: 'Big bang (full rewrite)', risk: 'Big-bang rewrites have a high failure rate — consider strangler-fig pattern unless the codebase is small and well-tested.' },
          { value: 'modular-monolith', label: 'Modular monolith (refactor in place first)' },
          { value: 'tbd', label: 'TBD' },
        ],
      },
      {
        id: 'mod-ra-codebase',
        label: 'Estimated codebase size',
        type: 'select',
        options: [
          { value: 'lt50k', label: 'Under 50K lines of code' },
          { value: '50k-300k', label: '50K – 300K lines' },
          { value: 'gt300k', label: 'Over 300K lines', risk: 'Large codebase re-architectures typically span 12–24 months. Ensure delivery is phased with independent deployable milestones.' },
        ],
      },
      {
        id: 'mod-ra-test-coverage',
        label: 'Test coverage before we start',
        type: 'select',
        options: [
          { value: 'high', label: 'High (>60% coverage)' },
          { value: 'moderate', label: 'Moderate (20–60%)' },
          { value: 'low', label: 'Low (<20%)', risk: 'Low test coverage means re-architecture carries high regression risk. Price a test-uplift track alongside refactoring.' },
          { value: 'none', label: 'No automated tests', risk: 'No test coverage is a critical risk for re-architecture — price a testing foundation sprint before beginning structural changes.' },
        ],
      },
    ],
  },

  {
    workTypeId: 'mod-ui-ux',
    heading: 'UI / UX Modernisation Scope',
    intro: 'Screen count, design system, and accessibility standard drive the estimate.',
    questions: [
      {
        id: 'mod-ui-screens',
        label: 'Number of screens / page templates',
        type: 'select',
        options: [
          { value: 'lt20', label: 'Under 20' },
          { value: '20-80', label: '20 – 80' },
          { value: 'gt80', label: 'Over 80', risk: '80+ screens requires dedicated component architecture and design system investment — scope the design system as a separate track.' },
        ],
      },
      {
        id: 'mod-ui-design-system',
        label: 'Design system / component library',
        type: 'select',
        options: [
          { value: 'new', label: 'Build new from scratch', risk: 'New design system is a 4–8 week workstream — includes token definition, accessibility review, and component documentation.' },
          { value: 'adopt', label: 'Adopt existing (MUI, Ant Design, etc.)' },
          { value: 'extend', label: 'Extend existing client design system' },
          { value: 'none', label: 'No design system required' },
        ],
      },
      {
        id: 'mod-ui-accessibility',
        label: 'Accessibility standard',
        type: 'select',
        options: [
          { value: 'wcag-aa', label: 'WCAG 2.1 AA (standard)' },
          { value: 'wcag-aaa', label: 'WCAG 2.1 AAA (enhanced)', risk: 'WCAG AAA compliance adds 15–25% to frontend effort and requires manual accessibility testing for every component.' },
          { value: 'none', label: 'No specific standard required' },
        ],
      },
      {
        id: 'mod-ui-migration',
        label: 'Data / content migration from old UI to new?',
        type: 'select',
        options: yn(undefined, 'Content migration from legacy frontend adds a separate data workstream.'),
      },
    ],
  },

  // ── Integration ────────────────────────────────────────

  {
    workTypeId: 'int-esb',
    heading: 'System Integration Scope',
    intro: 'Number of systems and platform choice are the primary cost drivers.',
    questions: [
      {
        id: 'int-esb-count',
        label: 'Number of systems to integrate',
        type: 'select',
        options: [
          { value: '2-3', label: '2 – 3 systems' },
          { value: '4-8', label: '4 – 8 systems' },
          { value: 'gt8', label: 'Over 8 systems', risk: 'Each integration point is independently scope-able — get per-integration estimates rather than a single total.' },
        ],
      },
      {
        id: 'int-esb-platform',
        label: 'Integration platform',
        type: 'select',
        options: [
          { value: 'mulesoft', label: 'MuleSoft' },
          { value: 'tibco', label: 'TIBCO BusinessWorks' },
          { value: 'azure-sb', label: 'Azure Service Bus / Logic Apps' },
          { value: 'aws-eventbridge', label: 'AWS EventBridge / Step Functions' },
          { value: 'boomi', label: 'Dell Boomi / Boomi' },
          { value: 'custom', label: 'Custom messaging (Kafka, RabbitMQ)' },
          { value: 'tbd', label: 'Not yet decided' },
        ],
      },
      {
        id: 'int-esb-mode',
        label: 'Synchronous or asynchronous?',
        type: 'select',
        options: [
          { value: 'sync', label: 'Synchronous (request/response)' },
          { value: 'async', label: 'Asynchronous (message queue / event)' },
          { value: 'mixed', label: 'Mixed — depends on integration' },
        ],
      },
      {
        id: 'int-esb-sla',
        label: 'SLA requirements (availability / latency)',
        type: 'select',
        options: [
          { value: 'business-hours', label: 'Business hours only' },
          { value: '24x5', label: '24x5 with maintenance windows' },
          { value: '24x7', label: '24x7 / 99.9%+ availability', risk: '24x7 high-availability integration platform requires redundant infrastructure, on-call process, and disaster recovery — price separately.' },
        ],
      },
    ],
  },

  {
    workTypeId: 'int-event',
    heading: 'Event Streaming / EDA Scope',
    intro: 'Schema governance and consumer proliferation are the key long-term risks.',
    questions: [
      {
        id: 'int-event-platform',
        label: 'Event streaming platform',
        type: 'select',
        options: [
          { value: 'kafka', label: 'Apache Kafka (self-managed)' },
          { value: 'confluent', label: 'Confluent Platform (managed Kafka)' },
          { value: 'aws-msk', label: 'AWS MSK' },
          { value: 'azure-eh', label: 'Azure Event Hubs' },
          { value: 'pulsar', label: 'Apache Pulsar' },
          { value: 'tbd', label: 'TBD' },
        ],
      },
      {
        id: 'int-event-schema',
        label: 'Schema registry / governance strategy',
        type: 'select',
        options: yn('No schema governance means event consumers will break on schema changes — this is a critical architectural decision.', undefined),
      },
      {
        id: 'int-event-topics',
        label: 'Estimated number of event topics',
        type: 'select',
        options: [
          { value: 'lt10', label: 'Under 10' },
          { value: '10-50', label: '10 – 50' },
          { value: 'gt50', label: 'Over 50', risk: 'Large topic estates need dedicated topic naming, partitioning strategy, and retention policy governance.' },
        ],
      },
      {
        id: 'int-event-consumers',
        label: 'Number of consuming services / applications',
        type: 'select',
        options: [
          { value: 'lt5', label: 'Under 5' },
          { value: '5-20', label: '5 – 20' },
          { value: 'gt20', label: 'Over 20', risk: 'Many consumers means breaking schema changes become a significant coordination problem — invest in consumer registry and versioning strategy.' },
        ],
      },
    ],
  },

  {
    workTypeId: 'int-b2b',
    heading: 'B2B / Partner Integration Scope',
    intro: 'Partner readiness is largely outside your control — plan for delays.',
    questions: [
      {
        id: 'int-b2b-partners',
        label: 'Number of trading partners to integrate',
        type: 'select',
        options: [
          { value: '1-3', label: '1 – 3 partners' },
          { value: '4-10', label: '4 – 10 partners' },
          { value: 'gt10', label: 'Over 10 partners', risk: 'Each partner has their own integration project — timeline is dependent on partner readiness, not just your team\'s velocity.' },
        ],
      },
      {
        id: 'int-b2b-protocol',
        label: 'Integration protocol',
        type: 'select',
        options: [
          { value: 'rest-api', label: 'REST APIs' },
          { value: 'edi', label: 'EDI (AS2 / X12 / EDIFACT)', risk: 'EDI integration requires specialised tooling and often partner-specific configuration — price per-partner, not as a single estimate.' },
          { value: 'sftp', label: 'SFTP / file-based' },
          { value: 'mixed', label: 'Mixed — varies per partner' },
        ],
      },
      {
        id: 'int-b2b-readiness',
        label: 'Partner technical readiness',
        type: 'select',
        options: [
          { value: 'all-ready', label: 'All partners confirmed ready' },
          { value: 'some-ready', label: 'Some partners ready, some TBD' },
          { value: 'none-confirmed', label: 'No partners confirmed yet', risk: 'Partner readiness is outside your control — build buffer time into the delivery plan and define the engagement\'s Done criteria for each partner.' },
        ],
      },
    ],
  },

  // ── AI on Existing ─────────────────────────────────────

  {
    workTypeId: 'ai-layer',
    heading: 'AI Layer on Existing Product',
    intro: 'Data pipeline readiness and model coupling to existing systems are the key risks.',
    questions: [
      {
        id: 'ai-layer-type',
        label: 'AI capability type',
        type: 'select',
        options: [
          { value: 'recommendation', label: 'Recommendations / personalisation' },
          { value: 'search', label: 'Semantic search / discovery' },
          { value: 'nlp', label: 'NLP / text classification / extraction' },
          { value: 'vision', label: 'Computer vision / image recognition' },
          { value: 'genai', label: 'Generative AI / LLM-powered feature' },
          { value: 'other', label: 'Other' },
        ],
      },
      {
        id: 'ai-layer-pipeline',
        label: 'Existing data pipeline quality',
        type: 'select',
        options: [
          { value: 'clean', label: 'Clean and well-structured' },
          { value: 'partial', label: 'Partial — some cleanup needed' },
          { value: 'poor', label: 'Poor quality / fragmented', risk: 'Poor data quality is typically 40–60% of AI project effort — price a data preparation track before modelling.' },
        ],
      },
      {
        id: 'ai-layer-model',
        label: 'Model approach',
        type: 'select',
        options: [
          { value: 'api', label: 'Pre-trained model via API (zero infra)' },
          { value: 'finetune', label: 'Fine-tune existing model', risk: 'Fine-tuning requires training data curation and ML infrastructure.' },
          { value: 'custom', label: 'Build custom model from scratch', risk: 'Custom ML models have uncertain timelines — use fixed-scope sprints with clear acceptance criteria, not fixed-price.' },
        ],
      },
    ],
  },

  {
    workTypeId: 'ai-rpa',
    heading: 'Process Automation (RPA) Scope',
    intro: 'Process count and exception rate are the key cost drivers.',
    questions: [
      {
        id: 'ai-rpa-count',
        label: 'Number of processes to automate',
        type: 'select',
        options: [
          { value: '1-3', label: '1 – 3 processes' },
          { value: '4-10', label: '4 – 10 processes' },
          { value: 'gt10', label: 'Over 10 processes', risk: 'Large RPA programmes need a bot CoE and governance model — price this separately from individual bot builds.' },
        ],
      },
      {
        id: 'ai-rpa-platform',
        label: 'RPA platform',
        type: 'select',
        options: [
          { value: 'uipath', label: 'UiPath' },
          { value: 'power-automate', label: 'Microsoft Power Automate' },
          { value: 'automation-anywhere', label: 'Automation Anywhere' },
          { value: 'blueprism', label: 'Blue Prism' },
          { value: 'tbd', label: 'Not yet decided' },
        ],
      },
      {
        id: 'ai-rpa-exception',
        label: 'Expected exception / error rate per process',
        type: 'select',
        options: [
          { value: 'lt5', label: 'Under 5%' },
          { value: '5-20', label: '5 – 20%' },
          { value: 'gt20', label: 'Over 20%', risk: 'High exception rates mean significant human-in-the-loop handling is still needed — question whether RPA is the right approach.' },
        ],
      },
      {
        id: 'ai-rpa-coe',
        label: 'Bot maintenance / CoE in scope?',
        type: 'select',
        options: yn(undefined, 'Without a CoE or maintenance model, bots break when underlying applications change — budget for ongoing maintenance from day one.'),
      },
    ],
  },

  // ── AMS ────────────────────────────────────────────────

  {
    workTypeId: 'ams-run',
    heading: 'Run & Maintain Scope',
    intro: 'SLA tier and incident volume baseline are the primary commercial risks.',
    questions: [
      {
        id: 'ams-run-apps',
        label: 'Number of applications / services in scope',
        type: 'select',
        options: [
          { value: '1-5', label: '1 – 5 applications' },
          { value: '6-20', label: '6 – 20 applications' },
          { value: 'gt20', label: 'Over 20 applications', risk: 'Large application portfolios need tiered SLAs — not every app warrants P1 response. Define tiers before pricing.' },
        ],
      },
      {
        id: 'ams-run-sla',
        label: 'SLA tier required',
        type: 'select',
        options: [
          { value: 'best-effort', label: 'Best effort (business hours only)' },
          { value: '24x5', label: '24x5 with P1 response time' },
          { value: '24x7', label: '24x7 / 99.9%+ with P1 < 1hr', risk: '24x7 high-availability support requires on-call staffing and shift structure — ensure SLA breach liability is capped in the contract.' },
        ],
      },
      {
        id: 'ams-run-volume',
        label: 'Incident volume baseline (tickets/month)',
        type: 'select',
        options: [
          { value: 'lt30', label: 'Under 30 tickets/month' },
          { value: '30-150', label: '30 – 150 tickets/month' },
          { value: 'gt150', label: 'Over 150 tickets/month', risk: 'High ticket volume needs a tiered triage model and self-service knowledge base — price L1 and L2 separately.' },
          { value: 'unknown', label: 'Unknown — baseline not yet measured', risk: 'Unknown incident volume is a commercial risk — get 3–6 months of history before pricing, or add a capped ramp period.' },
        ],
      },
      {
        id: 'ams-run-enhancement-ratio',
        label: 'Expected break-fix vs enhancement split',
        type: 'select',
        options: [
          { value: 'mostly-fix', label: 'Mostly break-fix (>70%)' },
          { value: 'balanced', label: 'Balanced mix' },
          { value: 'mostly-enhance', label: 'Mostly enhancements (>70%)', risk: 'Primarily enhancement-focused AMS should be priced on story point velocity, not ticket SLA — different commercial model.' },
        ],
      },
    ],
  },

  // ── Advisory / Cross-cutting ───────────────────────────

  {
    workTypeId: 'adv-discovery',
    heading: 'Discovery & Scoping Scope',
    intro: 'Well-bounded discovery is itself a deliverable — define the output.',
    questions: [
      {
        id: 'adv-disc-deliverable',
        label: 'Primary deliverable',
        type: 'select',
        options: [
          { value: 'requirements', label: 'Requirements document / feature backlog' },
          { value: 'architecture', label: 'Solution architecture blueprint' },
          { value: 'business-case', label: 'Business case / ROI analysis' },
          { value: 'rfp', label: 'RFP / vendor selection brief' },
          { value: 'roadmap', label: 'Product / technology roadmap' },
        ],
      },
      {
        id: 'adv-disc-duration',
        label: 'Expected duration',
        type: 'select',
        options: [
          { value: 'lt2w', label: 'Under 2 weeks' },
          { value: '2-4w', label: '2 – 4 weeks' },
          { value: '4-8w', label: '4 – 8 weeks' },
          { value: 'gt8w', label: 'Over 8 weeks' },
        ],
      },
      {
        id: 'adv-disc-stakeholders',
        label: 'Number of stakeholder groups to interview',
        type: 'select',
        options: [
          { value: 'lt5', label: 'Under 5 groups' },
          { value: '5-10', label: '5 – 10 groups' },
          { value: 'gt10', label: 'Over 10 groups', risk: 'Large stakeholder engagement requires structured workshop facilitation and stakeholder management plan.' },
        ],
      },
    ],
  },

  {
    workTypeId: 'adv-arch',
    heading: 'Architecture Design / PoC Scope',
    intro: 'PoC success criteria must be defined before the PoC starts.',
    questions: [
      {
        id: 'adv-arch-type',
        label: 'Primary output',
        type: 'select',
        options: [
          { value: 'arch-blueprint', label: 'Architecture blueprint / design document' },
          { value: 'poc', label: 'Working Proof of Concept (PoC)' },
          { value: 'pilot', label: 'Pilot / production-ready MVP' },
          { value: 'arch-review', label: 'Architecture review of existing system' },
        ],
      },
      {
        id: 'adv-arch-success',
        label: 'PoC / pilot success criteria defined?',
        type: 'select',
        options: yn('Undefined success criteria means the PoC has no agreed endpoint — define BEFORE starting.', undefined),
      },
      {
        id: 'adv-arch-stack',
        label: 'Technology stack (existing or greenfield decision)',
        type: 'text',
        placeholder: 'e.g. AWS / Python / React — or TBD',
      },
    ],
  },

  {
    workTypeId: 'sa-dev',
    heading: 'Developer Augmentation Scope',
    intro: 'Define team composition, duration, and handover plan.',
    questions: [
      {
        id: 'sa-dev-size',
        label: 'Team size needed',
        type: 'select',
        options: [
          { value: '1', label: '1 engineer' },
          { value: '2-3', label: '2 – 3 engineers' },
          { value: '4-6', label: '4 – 6 engineers' },
          { value: 'gt6', label: 'Over 6 engineers', risk: 'Large staff aug engagements require an embedded delivery lead and clear team integration model.' },
        ],
      },
      {
        id: 'sa-dev-stack',
        label: 'Primary technology / skills required',
        type: 'text',
        placeholder: 'e.g. React, Node.js, AWS, Kubernetes',
      },
      {
        id: 'sa-dev-model',
        label: 'Embedded model',
        type: 'select',
        options: [
          { value: 'fully-embedded', label: 'Fully embedded in client team (follows client process)' },
          { value: 'hybrid', label: 'Hybrid — joint team with our process overlay' },
          { value: 'dedicated-squad', label: 'Dedicated squad (our process, client steering)' },
        ],
      },
      {
        id: 'sa-dev-handover',
        label: 'Knowledge transfer / handover plan required?',
        type: 'select',
        options: yn(undefined, 'Without a handover plan, the client becomes dependent on the augmented team — define exit criteria and knowledge transfer milestones upfront.'),
      },
    ],
  },

  // ── ERP / CRM New Implementation ──────────────────────

  {
    workTypeId: 'erp-sap-new',
    heading: 'SAP S/4HANA Implementation Scope',
    intro: 'Business process design decisions are the critical path, not technology.',
    questions: [
      {
        id: 'erp-sap-modules',
        label: 'SAP modules in scope',
        type: 'text',
        placeholder: 'e.g. FI/CO, MM, SD, PP, HR — list all',
      },
      {
        id: 'erp-sap-deployment',
        label: 'Deployment model',
        type: 'select',
        options: [
          { value: 'rise', label: 'RISE with SAP (cloud, managed by SAP)' },
          { value: 'cloud', label: 'SAP Cloud (hyperscaler — AWS/Azure/GCP)' },
          { value: 'on-prem', label: 'On-premises' },
          { value: 'tbd', label: 'TBD' },
        ],
      },
      {
        id: 'erp-sap-data-migration',
        label: 'Legacy data migration in scope?',
        type: 'select',
        options: yn(undefined, 'Data migration from legacy ERP is typically 20–30% of project effort. Ensure it is priced as a separate workstream.'),
      },
      {
        id: 'erp-sap-change-mgmt',
        label: 'Change management / training in scope?',
        type: 'select',
        options: yn('Change management not in scope — risk of low adoption. Consider at least a Super User programme even if full OCM is out of scope.', undefined),
      },
    ],
  },

  {
    workTypeId: 'erp-sfdc-new',
    heading: 'Salesforce Implementation Scope',
    intro: 'Confirm cloud edition and org strategy before sizing.',
    questions: [
      {
        id: 'erp-sfdc-clouds',
        label: 'Salesforce clouds in scope',
        type: 'text',
        placeholder: 'e.g. Sales Cloud, Service Cloud, Marketing Cloud, Experience Cloud',
      },
      {
        id: 'erp-sfdc-org',
        label: 'Org strategy',
        type: 'select',
        options: [
          { value: 'single-org', label: 'Single org' },
          { value: 'multi-org', label: 'Multi-org / subsidiary separation', risk: 'Multi-org architectures require significant data sharing governance and cross-org integration design.' },
          { value: 'tbd', label: 'TBD' },
        ],
      },
      {
        id: 'erp-sfdc-integrations',
        label: 'Number of system integrations',
        type: 'select',
        options: [
          { value: 'lt5', label: 'Under 5' },
          { value: '5-15', label: '5 – 15' },
          { value: 'gt15', label: 'Over 15', risk: 'Large integration estates require dedicated middleware strategy and API governance.' },
        ],
      },
      {
        id: 'erp-sfdc-custom',
        label: 'Custom development expected (Apex, LWC)?',
        type: 'select',
        options: yn(undefined, 'Custom code in Salesforce increases maintenance burden and upgrade risk — minimise with configuration-first approach.'),
      },
    ],
  },

  {
    workTypeId: 'erp-servicenow-new',
    heading: 'ServiceNow Implementation Scope',
    intro: 'Process design must precede configuration — workflows not agreed will be rebuilt.',
    questions: [
      {
        id: 'erp-snow-modules',
        label: 'ServiceNow modules in scope',
        type: 'text',
        placeholder: 'e.g. ITSM, ITOM, HRSD, CSM, SecOps',
      },
      {
        id: 'erp-snow-cmdb',
        label: 'CMDB population in scope?',
        type: 'select',
        options: yn(undefined, 'CMDB population is a significant workstream — define data sources, CI classes, discovery tooling, and ongoing maintenance model.'),
      },
      {
        id: 'erp-snow-process',
        label: 'Process workshops completed pre-engagement?',
        type: 'select',
        options: yn('Process design not done — must be completed before configuration begins. Price a process design phase explicitly.', undefined),
      },
      {
        id: 'erp-snow-integration',
        label: 'Integrations with monitoring / event tooling',
        type: 'text',
        placeholder: 'e.g. Dynatrace, PagerDuty, JIRA, Azure DevOps',
      },
    ],
  },

  {
    workTypeId: 'gf-erp-other',
    heading: 'Enterprise Platform Implementation Scope',
    intro: 'Define the platform, modules, and key workstreams.',
    questions: [
      {
        id: 'erp-other-platform',
        label: 'Platform / product',
        type: 'text',
        placeholder: 'e.g. Workday HCM, Oracle NetSuite, Microsoft D365',
      },
      {
        id: 'erp-other-data-migration',
        label: 'Legacy data migration in scope?',
        type: 'select',
        options: yn(undefined, 'Data migration is a major workstream — price separately.'),
      },
      {
        id: 'erp-other-change-mgmt',
        label: 'Change management in scope?',
        type: 'select',
        options: yn('Low adoption risk without structured change management — flag to client.', undefined),
      },
    ],
  },

  // ── Quality Engineering ────────────────────────────────

  {
    workTypeId: 'qe-automation',
    heading: 'Test Automation Scope',
    intro: 'Framework, coverage targets, and ownership model are the key decisions.',
    questions: [
      {
        id: 'qe-auto-framework',
        label: 'Automation framework (existing or to be selected)',
        type: 'text',
        placeholder: 'e.g. Playwright, Selenium, Cypress, RestAssured',
      },
      {
        id: 'qe-auto-coverage',
        label: 'Coverage target',
        type: 'select',
        options: [
          { value: 'regression', label: 'Regression suite (happy path + critical flows)' },
          { value: 'e2e', label: 'End-to-end journey coverage' },
          { value: 'api', label: 'API / contract testing' },
          { value: 'full', label: 'Full pyramid (unit + integration + E2E)', risk: 'Full pyramid automation requires significant developer collaboration and CI/CD pipeline integration — confirm feasibility with client dev team.' },
        ],
      },
      {
        id: 'qe-auto-existing-tests',
        label: 'Existing automated tests to maintain or migrate?',
        type: 'select',
        options: yn(undefined, 'Inheriting existing test automation requires a technical discovery to assess quality and framework compatibility before estimating migration effort.'),
      },
      {
        id: 'qe-auto-ownership',
        label: 'Automation ownership post-delivery',
        type: 'select',
        options: [
          { value: 'client-team', label: 'Client team maintains after handover' },
          { value: 'our-ams', label: 'Our team in AMS / managed testing' },
          { value: 'tbd', label: 'TBD', risk: 'Undefined ownership means the automation suite will decay — agree on this before delivery.' },
        ],
      },
    ],
  },

  {
    workTypeId: 'qe-perf',
    heading: 'Performance Engineering Scope',
    intro: 'Environment fidelity and NFR definition drive the entire engagement.',
    questions: [
      {
        id: 'qe-perf-tool',
        label: 'Performance testing tool',
        type: 'select',
        options: [
          { value: 'jmeter', label: 'Apache JMeter' },
          { value: 'gatling', label: 'Gatling' },
          { value: 'k6', label: 'Grafana k6' },
          { value: 'neoload', label: 'NeoLoad' },
          { value: 'tbd', label: 'TBD / client-specified' },
        ],
      },
      {
        id: 'qe-perf-nfr',
        label: 'NFRs (performance targets) defined?',
        type: 'select',
        options: yn('NFRs not defined — we cannot determine pass/fail criteria. Define response time, throughput, and concurrency targets before engagement start.', undefined),
      },
      {
        id: 'qe-perf-env',
        label: 'Test environment fidelity vs production',
        type: 'select',
        options: [
          { value: 'like-for-like', label: 'Like-for-like replica' },
          { value: 'scaled-down', label: 'Scaled-down representative environment' },
          { value: 'shared', label: 'Shared non-prod environment', risk: 'Shared environments introduce noise and unpredictable results — performance testing results from shared environments are unreliable.' },
        ],
      },
      {
        id: 'qe-perf-types',
        label: 'Test types required',
        type: 'text',
        placeholder: 'e.g. Load, Stress, Soak, Spike — list all needed',
      },
    ],
  },

  {
    workTypeId: 'qe-managed-qa',
    heading: 'Managed QA / Test Factory Scope',
    intro: 'SLA definition and defect boundary are the most negotiated clauses.',
    questions: [
      {
        id: 'qe-mqa-apps',
        label: 'Number of applications in scope',
        type: 'select',
        options: [
          { value: '1-3', label: '1 – 3 applications' },
          { value: '4-10', label: '4 – 10 applications' },
          { value: 'gt10', label: 'Over 10 applications', risk: 'Large application portfolio requires tiered SLA model and dedicated test management tooling.' },
        ],
      },
      {
        id: 'qe-mqa-sla',
        label: 'Critical defect SLA defined?',
        type: 'select',
        options: yn('SLA not defined — must be agreed before contract. Common failure mode is ambiguous P1/P2 categorisation.', undefined),
      },
      {
        id: 'qe-mqa-env',
        label: 'Test environment provisioning responsibility',
        type: 'select',
        options: [
          { value: 'client', label: 'Client provides and maintains environments' },
          { value: 'us', label: 'We provision and manage environments' },
          { value: 'shared', label: 'Shared responsibility — defined in RACI' },
        ],
      },
      {
        id: 'qe-mqa-releases',
        label: 'Estimated release cadence',
        type: 'select',
        options: [
          { value: 'weekly', label: 'Weekly' },
          { value: 'fortnightly', label: 'Fortnightly' },
          { value: 'monthly', label: 'Monthly' },
          { value: 'on-demand', label: 'Ad-hoc / on demand', risk: 'On-demand releases require on-call test capacity — price this explicitly.' },
        ],
      },
    ],
  },

  // ── Data, BI & Reporting ───────────────────────────────

  {
    workTypeId: 'data-warehouse',
    heading: 'Data Warehouse / Data Mart Scope',
    intro: 'KPI definition and data ownership are the most common delivery blockers.',
    questions: [
      {
        id: 'dw-platform',
        label: 'Target data warehouse platform',
        type: 'select',
        options: [
          { value: 'snowflake', label: 'Snowflake' },
          { value: 'redshift', label: 'AWS Redshift' },
          { value: 'bigquery', label: 'Google BigQuery' },
          { value: 'synapse', label: 'Azure Synapse Analytics' },
          { value: 'databricks', label: 'Databricks Lakehouse' },
          { value: 'tbd', label: 'TBD' },
        ],
      },
      {
        id: 'dw-sources',
        label: 'Number of source systems',
        type: 'select',
        options: [
          { value: 'lt5', label: 'Under 5' },
          { value: '5-15', label: '5 – 15' },
          { value: 'gt15', label: 'Over 15', risk: 'Large source estates require dedicated data integration governance — consider phased delivery.' },
        ],
      },
      {
        id: 'dw-kpi-agreed',
        label: 'Business KPIs and metrics definitions agreed?',
        type: 'select',
        options: yn('KPI definitions not agreed — business units often have conflicting definitions (e.g. "revenue"). This must be resolved before data model design begins.', undefined),
      },
      {
        id: 'dw-historicdata',
        label: 'Historical data load required?',
        type: 'select',
        options: yn(undefined, 'Historical data loading multiplies migration effort — define how many years of history and data quality expectations.'),
      },
    ],
  },

  {
    workTypeId: 'data-bi-reporting',
    heading: 'BI / Reporting & Dashboards Scope',
    intro: 'Report count grows fast in delivery — define the inventory upfront.',
    questions: [
      {
        id: 'bi-tool',
        label: 'BI / reporting tool',
        type: 'select',
        options: [
          { value: 'power-bi', label: 'Microsoft Power BI' },
          { value: 'tableau', label: 'Tableau' },
          { value: 'looker', label: 'Looker / Google Looker Studio' },
          { value: 'qlik', label: 'Qlik Sense' },
          { value: 'sisense', label: 'Sisense' },
          { value: 'tbd', label: 'TBD' },
        ],
      },
      {
        id: 'bi-report-count',
        label: 'Estimated number of reports / dashboards',
        type: 'select',
        options: [
          { value: 'lt20', label: 'Under 20' },
          { value: '20-60', label: '20 – 60' },
          { value: 'gt60', label: 'Over 60', risk: 'Large report portfolios must be tiered — define P1 (critical) reports separately from nice-to-haves before delivery begins.' },
        ],
      },
      {
        id: 'bi-self-service',
        label: 'Self-service capability for business users?',
        type: 'select',
        options: yn(undefined, 'Self-service BI requires data literacy training and a governed semantic layer — scope both, not just the dashboards.'),
      },
      {
        id: 'bi-realtime',
        label: 'Real-time / near-real-time data refresh required?',
        type: 'select',
        options: yn(undefined, 'Real-time dashboards require streaming pipelines — significantly more complex and expensive than batch. Confirm business need before committing to real-time.'),
      },
    ],
  },

  {
    workTypeId: 'data-master',
    heading: 'Master Data Management Scope',
    intro: 'MDM is as much a governance initiative as a technology one.',
    questions: [
      {
        id: 'mdm-domains',
        label: 'MDM domains in scope',
        type: 'text',
        placeholder: 'e.g. Customer, Product, Supplier, Employee, Location',
      },
      {
        id: 'mdm-platform',
        label: 'MDM platform',
        type: 'select',
        options: [
          { value: 'informatica', label: 'Informatica MDM' },
          { value: 'reltio', label: 'Reltio' },
          { value: 'stibo', label: 'Stibo STEP' },
          { value: 'sap-mdg', label: 'SAP Master Data Governance' },
          { value: 'custom', label: 'Custom / bespoke solution' },
          { value: 'tbd', label: 'TBD' },
        ],
      },
      {
        id: 'mdm-stewardship',
        label: 'Data stewardship ownership defined?',
        type: 'select',
        options: yn('No data stewards identified — MDM without stewardship decays within 12 months. Must be a pre-condition for project start.', undefined),
      },
      {
        id: 'mdm-source-systems',
        label: 'Number of contributing source systems',
        type: 'select',
        options: [
          { value: 'lt5', label: 'Under 5' },
          { value: '5-10', label: '5 – 10' },
          { value: 'gt10', label: 'Over 10', risk: 'Many source systems multiply survivorship rule complexity and golden record reconciliation effort.' },
        ],
      },
    ],
  },

  // ── Cybersecurity Engineering ──────────────────────────

  {
    workTypeId: 'sec-vapt',
    heading: 'VAPT / Penetration Testing Scope',
    intro: 'Scope and legal sign-off must precede any testing activity.',
    questions: [
      {
        id: 'sec-vapt-scope',
        label: 'Testing scope',
        type: 'select',
        options: [
          { value: 'web-app', label: 'Web application (OWASP Top 10)' },
          { value: 'mobile', label: 'Mobile application (iOS / Android)' },
          { value: 'api', label: 'API / microservices layer' },
          { value: 'network', label: 'Network / infrastructure' },
          { value: 'cloud', label: 'Cloud configuration (AWS / Azure / GCP)' },
          { value: 'full', label: 'Full scope (all of the above)' },
        ],
      },
      {
        id: 'sec-vapt-remediation',
        label: 'Remediation included in scope?',
        type: 'select',
        options: yn(undefined, 'Remediation is almost always additional effort — price it explicitly or it will be assumed included. Define remediation SLA tiers separately.'),
      },
      {
        id: 'sec-vapt-legal',
        label: 'Engagement letter / scope authorisation signed?',
        type: 'select',
        options: yn('Testing without signed authorisation creates legal liability — this is a hard requirement before any testing activity begins.', undefined),
      },
      {
        id: 'sec-vapt-frequency',
        label: 'One-off assessment or recurring programme?',
        type: 'select',
        options: [
          { value: 'one-off', label: 'One-off assessment' },
          { value: 'annual', label: 'Annual recurring' },
          { value: 'continuous', label: 'Continuous / subscription model' },
        ],
      },
    ],
  },

  {
    workTypeId: 'sec-siem',
    heading: 'SIEM / SOC Implementation Scope',
    intro: 'Log source scope and alert tuning are the key delivery risks.',
    questions: [
      {
        id: 'sec-siem-platform',
        label: 'SIEM platform',
        type: 'select',
        options: [
          { value: 'sentinel', label: 'Microsoft Sentinel' },
          { value: 'splunk', label: 'Splunk Enterprise Security' },
          { value: 'qradar', label: 'IBM QRadar' },
          { value: 'chronicle', label: 'Google Chronicle' },
          { value: 'elastic', label: 'Elastic SIEM' },
          { value: 'tbd', label: 'TBD' },
        ],
      },
      {
        id: 'sec-siem-sources',
        label: 'Number of log sources to onboard',
        type: 'select',
        options: [
          { value: 'lt20', label: 'Under 20 sources' },
          { value: '20-100', label: '20 – 100 sources' },
          { value: 'gt100', label: 'Over 100 sources', risk: 'Large log source onboarding requires a phased approach — price by source tier, not as a single flat estimate.' },
        ],
      },
      {
        id: 'sec-siem-soc',
        label: 'SOC operating model (who responds to alerts?)',
        type: 'select',
        options: [
          { value: 'client-soc', label: 'Client internal SOC team' },
          { value: 'our-soc', label: 'Our managed SOC service' },
          { value: 'hybrid', label: 'Hybrid — shared model' },
          { value: 'tbd', label: 'TBD', risk: 'SIEM without a defined SOC operating model delivers alerts into a void — who responds must be decided before go-live.' },
        ],
      },
      {
        id: 'sec-siem-tuning',
        label: 'Alert tuning / use case development in scope?',
        type: 'select',
        options: yn(undefined, 'Alert tuning is an ongoing effort — price initial tuning sprint plus a retainer model for continued optimisation.'),
      },
    ],
  },

  {
    workTypeId: 'sec-iam',
    heading: 'IAM / PAM / SSO Implementation Scope',
    intro: 'Identity is a dependency for everything — delays block all other workstreams.',
    questions: [
      {
        id: 'sec-iam-platform',
        label: 'IAM platform',
        type: 'select',
        options: [
          { value: 'entra', label: 'Microsoft Entra ID / Azure AD' },
          { value: 'okta', label: 'Okta' },
          { value: 'ping', label: 'PingIdentity' },
          { value: 'sailpoint', label: 'SailPoint (IGA)' },
          { value: 'cyberark', label: 'CyberArk (PAM)' },
          { value: 'tbd', label: 'TBD' },
        ],
      },
      {
        id: 'sec-iam-apps',
        label: 'Number of applications to onboard to SSO',
        type: 'select',
        options: [
          { value: 'lt20', label: 'Under 20 apps' },
          { value: '20-100', label: '20 – 100 apps' },
          { value: 'gt100', label: 'Over 100 apps', risk: 'Large app onboarding requires a tiered approach — price per app tier and include a discovery sprint for custom/legacy app assessment.' },
        ],
      },
      {
        id: 'sec-iam-mfa',
        label: 'MFA / phishing-resistant authentication required?',
        type: 'select',
        options: yn(undefined, 'FIDO2 / hardware key MFA adds device provisioning complexity — include hardware and enrolment logistics in scope.'),
      },
      {
        id: 'sec-iam-pam',
        label: 'Privileged Access Management (PAM) in scope?',
        type: 'select',
        options: yn(undefined, 'PAM onboarding for privileged accounts (jump hosts, break-glass accounts, service accounts) is a significant separate workstream.'),
      },
    ],
  },

  {
    workTypeId: 'sec-grc',
    heading: 'Security GRC / Compliance Scope',
    intro: 'Certification timelines depend on auditor and gap closure — both outside your control.',
    questions: [
      {
        id: 'sec-grc-framework',
        label: 'Target compliance framework(s)',
        type: 'text',
        placeholder: 'e.g. ISO 27001, SOC2 Type II, DPDP, PCI-DSS',
      },
      {
        id: 'sec-grc-gap-done',
        label: 'Gap assessment completed?',
        type: 'select',
        options: yn('Gap assessment not done — price a gap assessment phase before compliance remediation begins.', undefined),
      },
      {
        id: 'sec-grc-certification',
        label: 'Certification with external auditor in scope?',
        type: 'select',
        options: yn(undefined, 'Auditor engagement, scheduling, and evidence collection are a separate workstream — include in scope or explicitly exclude and document.'),
      },
      {
        id: 'sec-grc-tooling',
        label: 'GRC platform / tooling in scope?',
        type: 'select',
        options: yn(undefined, 'GRC tooling implementation (ServiceNow GRC, Vanta, Drata) adds a technology workstream — scope separately from compliance advisory.'),
      },
    ],
  },

  // ── Testing & Quality Uplift (Brownfield) ─────────────

  {
    workTypeId: 'tq-automation-uplift',
    heading: 'Test Automation Uplift Scope',
    intro: 'Existing system testability may require code changes — confirm before pricing.',
    questions: [
      {
        id: 'tq-aup-current-coverage',
        label: 'Current automated test coverage',
        type: 'select',
        options: [
          { value: 'none', label: 'None — starting from scratch', risk: 'No existing tests means testability of the system is unknown. Price a testability assessment sprint before automation begins.' },
          { value: 'lt20', label: 'Under 20% coverage' },
          { value: '20-50', label: '20 – 50% coverage' },
          { value: 'gt50', label: 'Over 50% — uplift targeted areas' },
        ],
      },
      {
        id: 'tq-aup-framework',
        label: 'Target automation framework',
        type: 'text',
        placeholder: 'e.g. Playwright, Cypress, Selenium Grid, RestAssured',
      },
      {
        id: 'tq-aup-ci-integration',
        label: 'CI/CD pipeline integration required?',
        type: 'select',
        options: yn(undefined, 'Pipeline integration requires access to CI/CD tooling and potentially infrastructure changes — confirm access and tooling before estimating.'),
      },
      {
        id: 'tq-aup-ownership',
        label: 'Post-handover ownership',
        type: 'select',
        options: [
          { value: 'client-dev', label: 'Client development team' },
          { value: 'client-qa', label: 'Dedicated client QA team' },
          { value: 'our-ams', label: 'Our team via AMS / managed QA' },
          { value: 'tbd', label: 'TBD', risk: 'Undefined post-handover ownership is the main cause of automation suite decay.' },
        ],
      },
    ],
  },

  {
    workTypeId: 'tq-shift-left',
    heading: 'Shift-Left / DevOps Quality Integration Scope',
    intro: 'Developer buy-in is a prerequisite — tooling alone does not shift quality left.',
    questions: [
      {
        id: 'tq-sl-current-pipeline',
        label: 'Current CI/CD pipeline maturity',
        type: 'select',
        options: [
          { value: 'no-pipeline', label: 'No CI/CD pipeline yet', risk: 'Shift-left requires CI/CD as a foundation — pipeline build must be scoped as a prerequisite workstream.' },
          { value: 'basic', label: 'Basic pipeline (build + deploy only)' },
          { value: 'intermediate', label: 'Intermediate (build, test, deploy with some gates)' },
          { value: 'advanced', label: 'Advanced pipeline — adding quality gates on top' },
        ],
      },
      {
        id: 'tq-sl-gates',
        label: 'Quality gates to implement',
        type: 'text',
        placeholder: 'e.g. Unit tests, SAST, DAST, SCA, code coverage threshold',
      },
      {
        id: 'tq-sl-dev-training',
        label: 'Developer quality training in scope?',
        type: 'select',
        options: yn('Developer training not in scope — tools will be installed but not adopted without coaching. Even a short workshop series significantly improves outcomes.', undefined),
      },
    ],
  },

]

// ── Lookup helper ──────────────────────────────────────────
export function getScopeBlock(workTypeId: string): WorkTypeScopeBlock | undefined {
  return WORK_TYPE_SCOPE_BLOCKS.find(b => b.workTypeId === workTypeId)
}
