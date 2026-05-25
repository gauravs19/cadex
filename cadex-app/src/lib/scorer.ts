// ============================================================
// CADEX — Scorer Engine
// Computes weighted axis scores from question responses,
// derives a weighted total, score band, and critical flags.
// ============================================================

import type { AxisCode, AxisScores, DealMeta, Question, ScoreBand } from '../types'
import {
  BASE_WEIGHTS,
  PRICING_MODIFIERS,
  WORK_TYPE_MODIFIERS,
  GEOGRAPHY_MODIFIERS,
} from '../data/axisWeights'

// ── All axis codes in a stable order ─────────────────────────
const AXIS_CODES: AxisCode[] = ['SC', 'CM', 'CR', 'TC', 'GR', 'SV', 'CP', 'VF']

// ── Helpers ───────────────────────────────────────────────────

/** Normalise a weight table so all values sum to 1.0 */
function normalise(weights: Record<AxisCode, number>): Record<AxisCode, number> {
  const total = AXIS_CODES.reduce((sum, ax) => sum + (weights[ax] ?? 0), 0)
  if (total === 0) return { ...weights }
  const result = {} as Record<AxisCode, number>
  for (const ax of AXIS_CODES) {
    result[ax] = (weights[ax] ?? 0) / total
  }
  return result
}

/** Build effective weight table for the given deal meta.
 *  Process:
 *  1. Start with base weights for engagement type.
 *  2. Apply additive pricing-model modifiers (clamp to 0).
 *  3. Apply multiplicative work-type modifiers (if present).
 *  4. Apply geography modifiers.
 *  5. Normalise to sum = 1.0.
 */
export function buildEffectiveWeights(meta: DealMeta): Record<AxisCode, number> {
  // Step 1 — base weights
  const base = BASE_WEIGHTS[meta.engagementType] ?? BASE_WEIGHTS['fixed-agile']
  const weights: Record<AxisCode, number> = { ...base }

  // Step 2 — pricing model additive modifiers
  const pricingMod = PRICING_MODIFIERS[meta.pricingModel]
  if (pricingMod) {
    for (const ax of AXIS_CODES) {
      const delta = (pricingMod as Partial<Record<AxisCode, number>>)[ax] ?? 0
      weights[ax] = Math.max(0, weights[ax] + delta)
    }
  }

  // Step 3 — work type multiplicative modifiers
  if (meta.workType) {
    const workMod = WORK_TYPE_MODIFIERS[meta.workType]
    if (workMod) {
      for (const ax of AXIS_CODES) {
        const mult = (workMod as Partial<Record<AxisCode, number>>)[ax] ?? 1.0
        weights[ax] = Math.max(0, weights[ax] * mult)
      }
    }
  }

  // Step 4 — geography modifiers
  const overlap = meta.timezoneOverlapHours ?? 99
  let geoKey: string | null = null
  if (overlap < 3) geoKey = 'overlap-lt3h'
  else if (overlap < 6) geoKey = 'overlap-3-6h'
  else geoKey = 'overlap-gt6h'

  const geoMod = GEOGRAPHY_MODIFIERS[geoKey]
  if (geoMod) {
    for (const ax of AXIS_CODES) {
      const mult = (geoMod as Partial<Record<AxisCode, number>>)[ax] ?? 1.0
      weights[ax] = Math.max(0, weights[ax] * mult)
    }
  }

  // In-country contractual modifier
  if (meta.inCountryRequired === 'contractual') {
    const inCountryMod = GEOGRAPHY_MODIFIERS['in-country-contractual']
    if (inCountryMod) {
      for (const ax of AXIS_CODES) {
        const mult = (inCountryMod as Partial<Record<AxisCode, number>>)[ax] ?? 1.0
        weights[ax] = Math.max(0, weights[ax] * mult)
      }
    }
  }

  // Step 5 — normalise
  return normalise(weights)
}

// ── Core Functions ────────────────────────────────────────────

/**
 * Compute per-axis scores (1–5) as the average of all answered
 * questions for that axis.  Unanswered questions are excluded.
 * Returns a full AxisScores record; axes with no answers default to 3.
 */
export function computeAxisScores(
  responses: Record<string, number>,
  questions: Question[],
  _meta: DealMeta,
): AxisScores {
  // Group question responses by axis
  const buckets: Record<AxisCode, number[]> = {
    SC: [], CM: [], CR: [], TC: [], GR: [], SV: [], CP: [], VF: [],
  }

  for (const question of questions) {
    const score = responses[question.id]
    if (score !== undefined && score >= 1 && score <= 5) {
      buckets[question.axis].push(score)
    }
  }

  const axisScores = {} as AxisScores
  for (const ax of AXIS_CODES) {
    const vals = buckets[ax]
    axisScores[ax] = vals.length > 0
      ? vals.reduce((a, b) => a + b, 0) / vals.length
      : 3 // neutral default for unanswered axes
  }

  return axisScores
}

/**
 * Compute a weighted total (0–100 percentage) from per-axis scores.
 * Axis scores are 1–5; we convert to 0–100 by mapping:
 *   percentage_for_axis = (score - 1) / 4 × 100
 * Then weighted sum across all axes.
 */
export function computeWeightedTotal(
  axisScores: AxisScores,
  meta: DealMeta,
): number {
  const weights = buildEffectiveWeights(meta)

  let total = 0
  for (const ax of AXIS_CODES) {
    const score = axisScores[ax] ?? 3
    // Convert 1–5 to 0–1 range, then apply weight
    const normalised = (score - 1) / 4
    total += normalised * (weights[ax] ?? 0)
  }

  // total is now in 0–1 range; return as 0–100
  return Math.round(total * 100)
}

/**
 * Map a weighted total percentage to a score band.
 * ≥75% → green, 50–74% → amber, 25–49% → red, <25% → black
 */
export function getScoreBand(weightedTotal: number): ScoreBand {
  if (weightedTotal >= 75) return 'green'
  if (weightedTotal >= 50) return 'amber'
  if (weightedTotal >= 25) return 'red'
  return 'black'
}

/**
 * Return critical flag strings for any axis scoring at 1 (critical risk)
 * and any hard triggers.
 */
export function getCriticalFlags(axisScores: AxisScores): string[] {
  const flags: string[] = []

  const axisLabels: Record<AxisCode, string> = {
    SC: 'Scope Clarity',
    CM: 'Client Maturity',
    CR: 'Commercial Risk',
    TC: 'Technical Complexity',
    GR: 'Governance Readiness',
    SV: 'Strategic Value',
    CP: 'Competitive Position',
    VF: 'Vendor Capability Fit',
  }

  for (const ax of AXIS_CODES) {
    if ((axisScores[ax] ?? 5) <= 1) {
      flags.push(`Critical: ${axisLabels[ax]} (${ax}) scored 1 — deal is high risk`)
    }
  }

  return flags
}
