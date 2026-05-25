// ============================================================
// CADEX — Strategy Selector
// Selects the recommended strategy (A–F) based on axis scores,
// deal meta, and weighted total.
// ============================================================

import type { AxisScores, DealMeta, StrategyId, StrategyResult } from '../types'

// ── Strategy Rationale Lookup ─────────────────────────────────

const STRATEGY_NAMES: Record<StrategyId, string> = {
  A: 'De-Risk & Qualify',
  B: 'Standard Delivery',
  C: 'Strategic Partnership',
  D: 'Fixed-Scope Protect',
  E: 'T&M / Staff-Aug Mode',
  F: 'No-Go / Escalate',
}

// ── Helper ────────────────────────────────────────────────────

function rationale(strategyId: StrategyId, reason: string): StrategyResult {
  return {
    primary: strategyId,
    rationale: [`Strategy ${strategyId} — ${STRATEGY_NAMES[strategyId]}: ${reason}`],
  }
}

// ── Main Selector ─────────────────────────────────────────────

/**
 * Select the recommended deal strategy.
 *
 * Evaluation order (priority highest → lowest):
 *  1.  Any axis score == 1               → F (hard stop)
 *  2.  Weighted total < 25%              → F
 *  3.  CP <= 2 AND competitive == 'open' → F (no competitive position)
 *  4.  VF <= 2                           → F (can't deliver)
 *  5.  total < 50% AND CR < 3            → E (commercial risk too high, restructure as T&M)
 *  6.  total < 50% AND SC < 3            → A (scope too unclear, de-risk first)
 *  7.  total < 50%                       → A primary, B alternative (borderline)
 *  8.  pricingModel == 'staff-aug'       → E variant
 *  9.  engagementType == 'fixed-scope' AND SC < 4 → D (protect fixed scope)
 * 10.  engagementType == 'fixed-agile' AND SC >= 3 AND GR >= 3 → B
 * 11.  CM >= 4 AND GR >= 4 AND SV >= 4 AND CP >= 3 → C (strategic partnership)
 * 12.  Default                           → B
 */
export function selectStrategy(
  axisScores: AxisScores,
  meta: DealMeta,
  weightedTotal: number,
): StrategyResult {
  const { SC, CM, CR, GR, SV, CP, VF } = axisScores

  // ── Rule 1: Any axis at 1 ─────────────────────────────────
  const criticalAxes = (Object.keys(axisScores) as Array<keyof AxisScores>).filter(
    ax => axisScores[ax] <= 1,
  )
  if (criticalAxes.length > 0) {
    const result = rationale(
      'F',
      `One or more axes scored critically low (${criticalAxes.join(', ')} = 1). Escalate for senior review or do not proceed.`,
    )
    result.rationale.push(
      `Axes at critical threshold: ${criticalAxes.join(', ')}. All must score ≥ 2 before proceeding.`,
    )
    return applyCompetitiveModifier(result, CP, meta)
  }

  // ── Rule 2: Weighted total < 25% ─────────────────────────
  if (weightedTotal < 25) {
    return applyCompetitiveModifier(
      rationale(
        'F',
        `Overall deal score (${weightedTotal}%) is below 25% threshold. Deal is not viable in current form.`,
      ),
      CP,
      meta,
    )
  }

  // ── Rule 3: No competitive position on open RFP ──────────
  if (CP <= 2 && meta.competitiveSituation === 'open') {
    return applyCompetitiveModifier(
      rationale(
        'F',
        `Competitive Position score (${CP.toFixed(1)}) is too low for an open competition. Differentiation is insufficient to win.`,
      ),
      CP,
      meta,
    )
  }

  // ── Rule 4: Cannot deliver ────────────────────────────────
  if (VF <= 2) {
    return applyCompetitiveModifier(
      rationale(
        'F',
        `Vendor Capability Fit (${VF.toFixed(1)}) is critically low. Internal capability gaps must be resolved before bidding.`,
      ),
      CP,
      meta,
    )
  }

  // ── Rule 5: Low total + high commercial risk → restructure ─
  if (weightedTotal < 50 && CR < 3) {
    const result = rationale(
      'E',
      `Deal score (${weightedTotal}%) is below 50% and Commercial Risk is elevated (CR=${CR.toFixed(1)}). Restructure to T&M or staff-aug to contain exposure.`,
    )
    result.rationale.push(
      'Consider: time-capped T&M with clear milestone gates, or reframe as a discovery phase before fixed engagement.',
    )
    return applyCompetitiveModifier(result, CP, meta)
  }

  // ── Rule 6: Low total + unclear scope → de-risk ──────────
  if (weightedTotal < 50 && SC < 3) {
    const result = rationale(
      'A',
      `Deal score (${weightedTotal}%) is below 50% and Scope Clarity is low (SC=${SC.toFixed(1)}). Prioritise a paid discovery / scoping engagement first.`,
    )
    result.rationale.push(
      'Next move: propose a time-boxed scoping workshop or inception sprint to raise SC before committing to delivery.',
    )
    return applyCompetitiveModifier(result, CP, meta)
  }

  // ── Rule 7: Low total (borderline) → A primary, B alternative ─
  if (weightedTotal < 50) {
    const result: StrategyResult = {
      primary: 'A',
      alternative: 'B',
      rationale: [
        `Strategy A — ${STRATEGY_NAMES.A}: Deal score (${weightedTotal}%) is below 50%. De-risk approach is preferred.`,
        `Strategy B — ${STRATEGY_NAMES.B} is viable as an alternative if scope and governance can be tightened before proposal.`,
        'Review all amber axes before committing to B.',
      ],
    }
    return applyCompetitiveModifier(result, CP, meta)
  }

  // ── Rule 8: Staff-aug pricing → E variant ─────────────────
  if (meta.pricingModel === 'staff-aug') {
    const result = rationale(
      'E',
      `Pricing model is Staff-Aug. Strategy E (T&M / Staff-Aug Mode) is the natural fit — focus on rate card terms, SLAs, and governance.`,
    )
    result.rationale.push(
      'Ensure clear role definitions, time-tracking governance, and regular review cadences are contractually captured.',
    )
    return applyCompetitiveModifier(result, CP, meta)
  }

  // ── Rule 9: Fixed-scope with insufficient scope clarity ───
  if (meta.engagementType === 'fixed-scope' && SC < 4) {
    const result = rationale(
      'D',
      `Engagement is fixed-scope but Scope Clarity (SC=${SC.toFixed(1)}) is below 4. Strategy D (Fixed-Scope Protect) is needed to manage scope creep risk.`,
    )
    result.rationale.push(
      'Key actions: introduce scope change control clause, define acceptance criteria rigorously, establish a formal sign-off process.',
    )
    return applyCompetitiveModifier(result, CP, meta)
  }

  // ── Rule 10: Fixed-agile with adequate scope + governance → B ─
  if (meta.engagementType === 'fixed-agile' && SC >= 3 && GR >= 3) {
    const result = rationale(
      'B',
      `Fixed-Agile engagement with adequate Scope Clarity (SC=${SC.toFixed(1)}) and Governance Readiness (GR=${GR.toFixed(1)}). Standard delivery approach is appropriate.`,
    )
    return applyCompetitiveModifier(result, CP, meta)
  }

  // ── Rule 11: Strategic partnership opportunity ─────────────
  if (CM >= 4 && GR >= 4 && SV >= 4 && CP >= 3) {
    const result = rationale(
      'C',
      `High Client Maturity (CM=${CM.toFixed(1)}), Governance Readiness (GR=${GR.toFixed(1)}), Strategic Value (SV=${SV.toFixed(1)}), and Competitive Position (CP=${CP.toFixed(1)}) make this an ideal Strategic Partnership opportunity.`,
    )
    result.rationale.push(
      'Lead with outcome language, executive sponsorship, and joint innovation framing.',
    )
    return applyCompetitiveModifier(result, CP, meta)
  }

  // ── Rule 12: Default → B ──────────────────────────────────
  const result = rationale(
    'B',
    `Default strategy: deal passes all red/black thresholds and standard delivery parameters apply.`,
  )
  return applyCompetitiveModifier(result, CP, meta)
}

// ── Competitive Modifier ──────────────────────────────────────

function applyCompetitiveModifier(
  result: StrategyResult,
  CP: number,
  meta: DealMeta,
): StrategyResult {
  if (CP >= 4 && meta.competitiveSituation === 'sole-source') {
    result.competitiveModifier =
      'Trusted position — lead with partnership and outcome language'
  } else if (CP <= 3 && meta.competitiveSituation === 'open') {
    result.competitiveModifier =
      'Competitive pressure — differentiate on risk reduction'
  }
  return result
}
