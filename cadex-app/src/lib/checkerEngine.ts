// ============================================================
// CADEX — Checker Engine
// Computes section scores, overall score, verdict, and flags
// hard blockers from the deal checklist responses.
// ============================================================

import type { CheckResult, ChecklistResult, DealMeta } from '../types'

// ── Hard Blocker Check IDs ────────────────────────────────────
// C1-1 = margin check, R1-3 = discovery done, G1-1 = PO identified,
// V1-1 = delivery lead named, V1-4 = comparable project evidence
const HARD_BLOCKER_IDS = new Set(['C1-1', 'R1-3', 'G1-1', 'V1-1', 'V1-4'])

// ── Scoring Constants ─────────────────────────────────────────
const STATE_SCORES: Record<string, number> = {
  pass: 1,
  warning: 0.5,
  fail: 0,
  na: 0, // NA items are excluded from denominator
}

// ── Main Function ─────────────────────────────────────────────

/**
 * Compute the full checklist result from raw check states.
 *
 * Section score = Σ(state scores for applicable items) / count(applicable items) × 100
 * Overall score = average of section scores (sections with no applicable items excluded)
 * Verdict:
 *   ≥ 85 → 'go'
 *   70–84 → 'conditional'
 *   < 70  → 'no-go'
 * Hard blockers: any hard-blocker check ID that is NOT in 'pass' state.
 */
export function computeCheckerResult(
  checks: Record<string, CheckResult>,
  _meta: DealMeta,
): ChecklistResult {
  // Group checks by section (prefix before last '-')
  const sections: Record<string, CheckResult[]> = {}

  for (const check of Object.values(checks)) {
    const sectionId = deriveSectionId(check.id)
    if (!sections[sectionId]) sections[sectionId] = []
    sections[sectionId].push(check)
  }

  // Compute section scores
  const sectionScores: Record<string, number> = {}

  for (const [sectionId, sectionChecks] of Object.entries(sections)) {
    const applicable = sectionChecks.filter(c => c.state !== 'na')
    if (applicable.length === 0) {
      // All items N/A → skip this section from overall average
      sectionScores[sectionId] = -1 // sentinel
      continue
    }

    const scored = applicable.reduce((sum, c) => sum + (STATE_SCORES[c.state] ?? 0), 0)
    sectionScores[sectionId] = Math.round((scored / applicable.length) * 100)
  }

  // Compute overall — exclude sections with sentinel -1
  const validSectionScores = Object.values(sectionScores).filter(s => s >= 0)
  const overallScore =
    validSectionScores.length > 0
      ? Math.round(
          validSectionScores.reduce((a, b) => a + b, 0) / validSectionScores.length,
        )
      : 0

  // Replace sentinels with 0 for UI display
  for (const key of Object.keys(sectionScores)) {
    if (sectionScores[key] === -1) sectionScores[key] = 0
  }

  // Determine verdict
  let verdict: ChecklistResult['verdict']
  if (overallScore >= 85) verdict = 'go'
  else if (overallScore >= 70) verdict = 'conditional'
  else verdict = 'no-go'

  // Identify hard blockers that are not passed
  const hardBlockers: string[] = []
  for (const [checkId, check] of Object.entries(checks)) {
    if (HARD_BLOCKER_IDS.has(checkId) && check.state !== 'pass') {
      hardBlockers.push(checkId)
    }
  }

  return {
    checks,
    sectionScores,
    overallScore,
    verdict,
    hardBlockers,
    completedAt: new Date().toISOString(),
  }
}

// ── Helpers ───────────────────────────────────────────────────

/**
 * Derive section ID from a check ID.
 * Convention: check IDs are like "C1-1", "R1-3", "G1-1", "V1-4"
 * Section = letter prefix + number before hyphen (e.g. "C1", "R1", "G1", "V1").
 */
function deriveSectionId(checkId: string): string {
  const match = checkId.match(/^([A-Z]\d+)/)
  return match ? match[1] : checkId
}
