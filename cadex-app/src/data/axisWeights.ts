// ============================================================
// CADEX — Axis Weight Tables
// Weights by engagement type, pricing model modifiers,
// work type modifiers, and geography modifiers.
// All weights as decimals summing to 1.0 per engagement type.
// ============================================================

import type { AxisCode, EngagementType, PricingModel, WeightTable } from '../types'

// ── Base Weights by Engagement Type ──────────────────────────
// From spec §5.2 — converted to decimals (e.g. 22% → 0.22)

export const BASE_WEIGHTS: Record<EngagementType, WeightTable> = {
  'fixed-agile': {
    SC: 0.22,
    CM: 0.18,
    CR: 0.18,
    TC: 0.13,
    GR: 0.13,
    SV: 0.05,
    CP: 0.06,
    VF: 0.05,
  },
  'fixed-scope': {
    SC: 0.24,
    CM: 0.14,
    CR: 0.20,
    TC: 0.15,
    GR: 0.10,
    SV: 0.05,
    CP: 0.06,
    VF: 0.06,
  },
  'tm': {
    SC: 0.12,
    CM: 0.13,
    CR: 0.22,
    TC: 0.18,
    GR: 0.13,
    SV: 0.08,
    CP: 0.08,
    VF: 0.06,
  },
  'outcome': {
    SC: 0.18,
    CM: 0.22,
    CR: 0.18,
    TC: 0.13,
    GR: 0.13,
    SV: 0.05,
    CP: 0.06,
    VF: 0.05,
  },
  'hybrid': {
    SC: 0.18,
    CM: 0.16,
    CR: 0.20,
    TC: 0.15,
    GR: 0.12,
    SV: 0.06,
    CP: 0.07,
    VF: 0.06,
  },
} as const

// ── Pricing Model Additive Modifiers ─────────────────────────
// Applied on top of engagement type base weights.
// Values are additive adjustments; normalisation is done by scorer.ts.
// Positive = elevate this axis weight, Negative = reduce it.

export const PRICING_MODIFIERS: Record<PricingModel, Partial<Record<AxisCode, number>>> = {
  'fixed-price': {
    SC: +0.04,   // Scope clarity critical for fixed-price
    CR: +0.02,   // Commercial risk elevated
    GR: +0.02,   // Governance must be tight
  },
  'tm': {
    CR: +0.04,   // Runaway spend risk
    SC: -0.04,   // Scope clarity less critical on T&M
    SV: +0.02,
  },
  'tm-cap': {
    CR: +0.03,
    SC: +0.02,
    GR: +0.01,
  },
  'retainer': {
    CR: +0.03,   // Scope creep on retainer = commercial risk
    SC: -0.02,
    CM: +0.02,   // Client maturity matters for retainer relationships
    SV: +0.02,
  },
  'outcome': {
    CM: +0.05,   // Outcome deals need mature clients
    GR: +0.04,   // Strong governance needed to define outcomes
    SC: -0.03,   // Scope less critical — outcome-focused
    CR: +0.02,
  },
  'staff-aug': {
    SC: -0.08,   // Scope barely relevant for staff aug
    CM: -0.04,
    CR: +0.05,   // Rate card and contract terms dominate
    GR: +0.06,   // Who manages these people?
    CP: +0.02,   // Competitive on rate
  },
} as const

// ── Work Type Modifiers ───────────────────────────────────────
// Keyed by work type L3 ID (see workTypes.ts).
// Multipliers applied to base weights before normalisation.
// 1.0 = no change; 1.3 = 30% higher weight; 0.7 = 30% lower.

export const WORK_TYPE_MODIFIERS: Record<string, Partial<Record<AxisCode, number>>> = {
  // ── Digital Experience ────────────────────────────────
  'dx-portal': {
    SC: 1.3,   // Scope inflation risk: stakeholder alignment
    GR: 1.2,   // Multiple business unit sponsors
  },
  'dx-mobile': {
    SC: 1.3,   // Blank canvas effect
  },
  'dx-spa': {
    SC: 1.2,
    TC: 1.1,
  },
  'dx-ecommerce': {
    SC: 1.3,
    TC: 1.4,   // Payments, ERP, inventory integrations
    CR: 1.2,
  },
  'dx-omnichannel': {
    SC: 1.3,
    TC: 1.3,
    GR: 1.2,
  },

  // ── Product Engineering ───────────────────────────────
  'pe-saas': {
    CM: 1.3,   // PO engagement critical
    GR: 1.2,   // Product vision governance
    SV: 1.2,   // Usually strategic
  },
  'pe-embedded': {
    TC: 1.5,   // Hardware dependencies, irreversible HW decisions
  },
  'pe-api-platform': {
    TC: 1.2,
    SC: 1.2,
  },
  'pe-dev-tool': {
    TC: 1.2,
    CM: 1.1,
  },
  'pe-ai-ml': {
    SC: 1.4,   // Exploratory nature
    CM: 1.3,   // Data readiness requires client maturity
    TC: 1.4,   // Data pipeline complexity
  },

  // ── Platform & Infrastructure ─────────────────────────
  'plat-data': {
    SC: 1.3,   // Data schema drift risk
    TC: 1.3,   // Data quality, volume surprises
  },
  'plat-integration': {
    TC: 1.3,
    GR: 1.2,   // Cross-team integration governance
  },
  'plat-cloud-native': {
    TC: 1.3,
  },
  'plat-devsecops': {
    TC: 1.2,
    GR: 1.2,
  },
  'plat-iot-edge': {
    TC: 1.5,
    SC: 1.2,
  },

  // ── Greenfield AI/Analytics ───────────────────────────
  'ai-feature-new': {
    SC: 1.3,
    TC: 1.4,
    CM: 1.2,
  },
  'ai-analytics-new': {
    SC: 1.3,
    TC: 1.3,
  },
  'ai-ml-pipeline': {
    SC: 1.4,
    TC: 1.4,
    CM: 1.3,
  },
  'ai-genai-app': {
    SC: 1.4,
    TC: 1.4,
    CM: 1.3,
    CR: 1.2,   // GenAI risk profile uncertain
  },

  // ── Migration ─────────────────────────────────────────
  'mig-cloud-lift': {
    TC: 1.3,   // Discovery gaps in legacy estate
    SC: 1.1,
  },
  'mig-replatform': {
    TC: 1.3,
    SC: 1.2,
  },
  'mig-data': {
    SC: 1.3,   // Data quality, lineage, volume surprises
    TC: 1.3,
  },
  'mig-erp-crm': {
    SC: 1.3,   // ERP scope grows fast
    CR: 1.2,   // Budgets blow
    TC: 1.4,   // Customisation debt
    GR: 1.3,   // Business change management
  },
  'mig-infra': {
    TC: 1.3,
    SC: 1.1,
  },

  // ── Modernisation ─────────────────────────────────────
  'mod-re-arch': {
    SC: 1.4,   // Legacy debt scope unknown until inside
    TC: 1.4,
  },
  'mod-cloud-native': {
    TC: 1.3,   // Architectural decisions hard to reverse
    SC: 1.2,
  },
  'mod-ui-ux': {
    SC: 1.2,
    CM: 1.1,
  },
  'mod-api-enable': {
    TC: 1.3,
    SC: 1.2,
    GR: 1.2,   // Cross-system integration governance
  },
  'mod-tech-stack': {
    TC: 1.2,
    SC: 1.1,
  },

  // ── Integration ───────────────────────────────────────
  'int-esb': {
    SC: 1.3,   // Undocumented APIs
    TC: 1.3,
    GR: 1.2,
  },
  'int-saas': {
    TC: 1.2,
    SC: 1.2,
  },
  'int-etl': {
    SC: 1.3,
    TC: 1.2,
  },
  'int-b2b': {
    SC: 1.2,
    TC: 1.2,
    GR: 1.3,   // External party governance
  },

  // ── AI on Existing ─────────────────────────────────────
  'ai-layer': {
    SC: 1.3,
    CM: 1.3,   // Data readiness expectations
    TC: 1.3,
  },
  'ai-predictive': {
    SC: 1.3,
    TC: 1.3,
    CM: 1.2,
  },
  'ai-rpa': {
    SC: 1.2,
    TC: 1.2,
  },
  'ai-aiops': {
    TC: 1.2,
    GR: 1.2,
  },

  // ── AMS ────────────────────────────────────────────────
  'ams-run': {
    SC: 1.0,   // Standard
    CR: 1.3,   // SLA definition and scope creep risk
    GR: 1.2,   // Who defines "done" and "support"?
  },
  'ams-enhancements': {
    SC: 1.2,   // Enhancement vs fix boundary
    CR: 1.2,
  },
  'ams-incident': {
    CR: 1.3,
    GR: 1.2,
    SC: 0.8,   // Scope less of a driver for incident management
  },
  'ams-testing': {
    SC: 1.1,
    TC: 1.1,
    CR: 1.1,
  },
} as const

// ── Geography / Timezone Modifiers ───────────────────────────
// Applied when calculated timezone overlap is low.
// timezoneOverlapHours < 3 → GR elevated significantly.

export const GEOGRAPHY_MODIFIERS: Record<string, Partial<Record<AxisCode, number>>> = {
  'overlap-lt3h': {
    GR: 1.4,   // Async agile on fixed deals: high governance risk
    CM: 1.2,   // Client maturity required to handle async
  },
  'overlap-3-6h': {
    GR: 1.2,
  },
  'overlap-gt6h': {
    // No modifier — adequate overlap
  },
  'in-country-contractual': {
    CR: 1.2,   // Cost of in-country elevated
    TC: 1.1,
  },
} as const
