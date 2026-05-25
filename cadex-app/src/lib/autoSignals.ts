// ============================================================
// CADEX — Auto Signals
// Derives contextual warnings and prompts from deal meta fields
// without requiring full questionnaire completion.
// ============================================================

import type { AutoSignal, DealMeta } from '../types'

/**
 * Evaluate all 9 auto-signal rules against the (possibly partial) deal meta
 * and return the signals that fire.
 *
 * Rules:
 *  1. RFP + fixed-scope + gt2m → high scrutiny required
 *  2. new-logo → complete Section G (governance)
 *  3. fixed-agile + lt3m → compressed timeline risk
 *  4. PII / PHI / financial data → regulated data warning
 *  5. open competition + lt40 win probability → low win probability
 *  6. proposal stage + deadline < 5 days → deadline pressure
 *  7. sub contractor role → governance / dependency risk
 *  8. timezone overlap < 3 hours → async collaboration warning
 *  9. staff-aug + fixed-agile → engagement model mismatch
 */
export function computeAutoSignals(meta: Partial<DealMeta>): AutoSignal[] {
  const signals: AutoSignal[] = []

  // ── Rule 1: RFP + Fixed-Scope + Large deal ─────────────────
  if (
    meta.dealOrigin === 'rfp' &&
    meta.engagementType === 'fixed-scope' &&
    meta.dealSize === 'gt2m'
  ) {
    signals.push({
      id: 'AS-01',
      severity: 'critical',
      message: 'RFP + Fixed-Scope + >$2M deal detected.',
      action:
        'This combination requires mandatory executive review, enhanced scope lock-down, and commercial risk workshop before bid submission.',
    })
  }

  // ── Rule 2: New-logo deal ──────────────────────────────────
  if (meta.dealOrigin === 'new-logo') {
    signals.push({
      id: 'AS-02',
      severity: 'warning',
      message: 'New-logo opportunity detected.',
      action:
        'Ensure Section G (Governance Readiness) is fully completed. New-logo deals require stronger qualification of client readiness and decision-making structure.',
    })
  }

  // ── Rule 3: Fixed-Agile + Short duration ──────────────────
  if (meta.engagementType === 'fixed-agile' && meta.duration === 'lt3m') {
    signals.push({
      id: 'AS-03',
      severity: 'warning',
      message: 'Fixed-Agile engagement with compressed timeline (<3 months).',
      action:
        'Sprint planning, backlog readiness, and acceptance criteria must be agreed before contract signature. Consider if timeline is achievable.',
    })
  }

  // ── Rule 4: Regulated data ─────────────────────────────────
  const regulatedDataClasses = ['pii', 'phi', 'financial-pci', 'classified-govt']
  const hasRegulatedData = meta.dataClassification?.some(dc =>
    regulatedDataClasses.includes(dc),
  )
  if (hasRegulatedData) {
    signals.push({
      id: 'AS-04',
      severity: 'critical',
      message: 'Deal involves regulated data (PII/PHI/Financial/Classified).',
      action:
        'Confirm applicable compliance frameworks, data residency requirements, and security certifications. Engage compliance/legal review early.',
    })
  }

  // ── Rule 5: Open competition + low win probability ─────────
  if (meta.competitiveSituation === 'open' && meta.winProbability === 'lt40') {
    signals.push({
      id: 'AS-05',
      severity: 'warning',
      message: 'Open competition with win probability below 40%.',
      action:
        'Re-evaluate bid/no-bid decision. If proceeding, build a clear differentiation strategy focused on risk reduction and delivery credibility.',
    })
  }

  // ── Rule 6: Proposal stage + imminent deadline ─────────────
  if (meta.salesStage === 'proposal' && meta.proposalDeadline) {
    const today = new Date()
    const deadline = new Date(meta.proposalDeadline)
    const daysUntilDeadline = Math.ceil(
      (deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    )
    if (daysUntilDeadline >= 0 && daysUntilDeadline < 5) {
      signals.push({
        id: 'AS-06',
        severity: 'critical',
        message: `Proposal deadline is in ${daysUntilDeadline} day${daysUntilDeadline === 1 ? '' : 's'}.`,
        action:
          'Immediate action required. Use Quick Score mode to identify the highest-risk areas. Consider using the Deal Checker to validate proposal readiness.',
      })
    } else if (daysUntilDeadline < 0) {
      signals.push({
        id: 'AS-06',
        severity: 'critical',
        message: 'Proposal deadline has passed.',
        action: 'Verify if deadline has been extended. Update the proposal deadline field.',
      })
    }
  }

  // ── Rule 7: Sub-contractor role ────────────────────────────
  if (meta.ourRole === 'sub') {
    signals.push({
      id: 'AS-07',
      severity: 'warning',
      message: 'GlobalLogic is in a sub-contractor role.',
      action:
        'Ensure prime contractor governance, communication channels, and escalation paths are contractually defined. Protect delivery accountability.',
    })
  }

  // ── Rule 8: Timezone overlap < 3 hours ────────────────────
  if (
    meta.timezoneOverlapHours !== undefined &&
    meta.timezoneOverlapHours < 3
  ) {
    signals.push({
      id: 'AS-08',
      severity: 'warning',
      message: `Low timezone overlap: ~${meta.timezoneOverlapHours}h overlap between client and delivery.`,
      action:
        'Define async collaboration protocols, response SLAs, and overlap windows in the project plan. Consider dedicated overlap hours in the contract.',
    })
  } else if (
    meta.clientTimezone &&
    meta.deliveryTimezones &&
    meta.deliveryTimezones.length > 0 &&
    meta.timezoneOverlapHours === undefined
  ) {
    // Timezones set but overlap not yet calculated — signal to compute
    signals.push({
      id: 'AS-08',
      severity: 'info',
      message: 'Timezone overlap has not been calculated yet.',
      action: 'Review client and delivery timezone fields to auto-calculate overlap.',
    })
  }

  // ── Rule 9: Staff-aug + Fixed-Agile mismatch ──────────────
  if (meta.pricingModel === 'staff-aug' && meta.engagementType === 'fixed-agile') {
    signals.push({
      id: 'AS-09',
      severity: 'warning',
      message: 'Engagement model mismatch: Staff-Aug pricing with Fixed-Agile engagement.',
      action:
        'Staff-Aug pricing and Fixed-Agile delivery model are contradictory. Clarify accountability model — who owns delivery outcomes? Consider restructuring to T&M or pure staff-aug.',
    })
  }

  return signals
}
