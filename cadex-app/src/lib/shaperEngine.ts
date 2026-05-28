// ============================================================
// CADEX — Shaper Engine
// Prioritises deal-shaping levers based on axis scores.
// ============================================================

import type { AxisScores, DealMeta, LeverResult } from '../types'
import { LEVERS } from '../data/levers'

/**
 * Filter and rank the lever catalogue for this deal.
 *
 * Process:
 * 1. Filter levers whose triggerCondition(axisScores) returns true.
 * 2. Sort descending by priority(axisScores).
 * 3. Return top 10 as LeverResult[].
 */
export function getPrioritisedLevers(
  axisScores: AxisScores,
  _meta: DealMeta,
): LeverResult[] {
  const triggered = LEVERS.filter(lever => {
    try {
      return lever.triggerCondition(axisScores)
    } catch {
      return false
    }
  })

  triggered.sort((a, b) => {
    const pa = a.priority(axisScores)
    const pb = b.priority(axisScores)
    return pb - pa // descending
  })

  return triggered.slice(0, 10).map(lever => ({
    id: lever.id,
    category: lever.category,
    title: lever.title,
    rationale: lever.rationale,
    action: lever.action,
    contractLanguage: lever.contractLanguage,
    priority: lever.priority(axisScores),
  }))
}
