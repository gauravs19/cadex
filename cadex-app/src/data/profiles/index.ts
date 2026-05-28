// ============================================================
// CADEX — Work Type Profiles: Aggregator
//
// Single import point for all WorkTypeProfile definitions.
// Derives PROFILE_QUESTIONS and PROFILE_AXIS_MODIFIERS which
// are merged into workTypeQuestions.ts and axisWeights.ts.
//
// To add a new work type:
//   1. Add its WorkTypeProfile to the relevant category file
//   2. Re-export nothing else — the derivations below handle it
//
// To extract to JSON: JSON.stringify(ALL_PROFILES) gives a
// complete, self-contained representation of all work type data.
// ============================================================

import type { WorkTypeProfile } from '../../types'
import type { AxisCode } from '../../types'
import { GF_PE_PROFILES }                  from './gf-pe'
import { GF_PLATFORM_PROFILES }            from './gf-platform'
import { BF_AI_PROFILES }                  from './bf-ai'
import { BF_AMS_PROFILES }                 from './bf-ams'
import { BF_SEC_PROFILES, BF_TQ_PROFILES, GF_QUALITY_PROFILES } from './bf-sec-tq'

// ── All profiles in one place ─────────────────────────────────

export const ALL_PROFILES: WorkTypeProfile[] = [
  ...GF_PE_PROFILES,
  ...GF_PLATFORM_PROFILES,
  ...BF_AI_PROFILES,
  ...BF_AMS_PROFILES,
  ...BF_SEC_PROFILES,
  ...BF_TQ_PROFILES,
  ...GF_QUALITY_PROFILES,
]

// ── Derived: all domain questions from profiles ───────────────
// Merged into workTypeQuestions.ts via PROFILE_QUESTIONS export.

export const PROFILE_QUESTIONS = ALL_PROFILES.flatMap(p => p.questions)

// ── Derived: axis modifier lookup from profiles ───────────────
// Merged into axisWeights.ts WORK_TYPE_MODIFIERS via spread.

export const PROFILE_AXIS_MODIFIERS: Record<string, Partial<Record<AxisCode, number>>> =
  Object.fromEntries(
    ALL_PROFILES
      .filter(p => Object.keys(p.axisModifiers).length > 0)
      .map(p => [p.workTypeId, p.axisModifiers])
  )

// ── Re-exports for convenience ────────────────────────────────

export { GF_PE_PROFILES, GF_PLATFORM_PROFILES, BF_AI_PROFILES, BF_AMS_PROFILES }
export { BF_SEC_PROFILES, BF_TQ_PROFILES, GF_QUALITY_PROFILES }
