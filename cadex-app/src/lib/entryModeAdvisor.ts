// ============================================================
// CADEX — Entry Mode Advisor
// Recommends the appropriate wizard entry mode based on deal
// meta context (sales stage, deadline proximity).
// ============================================================

import type { DealMeta, EntryMode } from '../types'

export interface EntryModeRecommendation {
  mode: EntryMode
  reason: string
}

/**
 * Recommend the most appropriate wizard entry mode for this deal.
 *
 * Logic:
 *  - salesStage == 'proposal' AND deadline within 5 days → 'checker'
 *    (jump straight to pre-submission checklist)
 *  - salesStage == 'awareness' OR 'qualification' → 'quick'
 *    (abbreviated 14-question score to test viability quickly)
 *  - default → 'full'
 *    (complete 5-step assessment wizard)
 */
export function recommendEntryMode(
  meta: Partial<DealMeta>,
): EntryModeRecommendation {
  // Proposal + imminent deadline → go straight to checker
  if (meta.salesStage === 'proposal' && meta.proposalDeadline) {
    const today = new Date()
    const deadline = new Date(meta.proposalDeadline)
    const daysRemaining = Math.ceil(
      (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    )
    if (daysRemaining >= 0 && daysRemaining < 5) {
      return {
        mode: 'checker',
        reason: `Proposal deadline is ${daysRemaining === 0 ? 'today' : `in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`}. Use the Deal Checker to validate proposal readiness quickly.`,
      }
    }
  }

  // Early-stage deals → quick score to test viability
  if (meta.salesStage === 'awareness' || meta.salesStage === 'qualification') {
    return {
      mode: 'quick',
      reason: `Deal is in ${meta.salesStage} stage. Use the Quick Score (14 questions) to rapidly assess viability before investing in full qualification.`,
    }
  }

  // Default → full wizard
  return {
    mode: 'full',
    reason: 'Run the complete 5-step assessment for thorough deal qualification.',
  }
}
