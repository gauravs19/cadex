// ============================================================
// CADEX — Work Type Profiles: Security & Testing/Quality
// Axis modifiers only — questions handled by WT-S* and WT-TQ*
// in workTypeQuestions.ts.
// ============================================================

import type { WorkTypeProfile } from '../../types'

export const BF_SEC_PROFILES: WorkTypeProfile[] = [
  { workTypeId: 'sec-vapt',         axisModifiers: { SC: 1.4, GR: 1.3, TC: 1.2, CR: 1.2 }, questions: [] },
  { workTypeId: 'sec-siem',         axisModifiers: { SC: 1.3, TC: 1.3, GR: 1.2 },           questions: [] },
  { workTypeId: 'sec-iam',          axisModifiers: { SC: 1.4, TC: 1.3, GR: 1.3 },           questions: [] },
  { workTypeId: 'sec-cloud-posture', axisModifiers: { TC: 1.3, GR: 1.2, CR: 1.1 },          questions: [] },
  { workTypeId: 'sec-grc',          axisModifiers: { GR: 1.4, CR: 1.2, SC: 1.1 },           questions: [] },
  { workTypeId: 'sec-zero-trust',   axisModifiers: { SC: 1.4, TC: 1.3, GR: 1.3 },           questions: [] },
  { workTypeId: 'bf-security-other', axisModifiers: { SC: 1.2, TC: 1.2, GR: 1.2 },          questions: [] },
]

export const BF_TQ_PROFILES: WorkTypeProfile[] = [
  { workTypeId: 'tq-automation-uplift', axisModifiers: { SC: 1.3, TC: 1.2, CM: 1.1 },      questions: [] },
  { workTypeId: 'tq-shift-left',        axisModifiers: { CM: 1.3, GR: 1.2, TC: 1.2 },      questions: [] },
  { workTypeId: 'tq-test-factory',      axisModifiers: { CR: 1.3, GR: 1.2, SC: 1.2 },      questions: [] },
  { workTypeId: 'tq-performance',       axisModifiers: { TC: 1.3, SC: 1.2 },                questions: [] },
  { workTypeId: 'tq-accessibility',     axisModifiers: { CR: 1.2, GR: 1.1 },                questions: [] },
  { workTypeId: 'bf-testing-other',     axisModifiers: { SC: 1.1, TC: 1.1, CR: 1.1 },       questions: [] },
]

export const GF_QUALITY_PROFILES: WorkTypeProfile[] = [
  { workTypeId: 'qe-automation',   axisModifiers: { SC: 1.3, TC: 1.2 },                     questions: [] },
  { workTypeId: 'qe-perf',         axisModifiers: { TC: 1.3, SC: 1.2 },                     questions: [] },
  { workTypeId: 'qe-security-test', axisModifiers: { SC: 1.2, TC: 1.2, GR: 1.1 },           questions: [] },
  { workTypeId: 'qe-managed-qa',   axisModifiers: { CR: 1.3, GR: 1.2, SC: 1.2 },            questions: [] },
  { workTypeId: 'gf-quality-other', axisModifiers: { SC: 1.1, TC: 1.1 },                    questions: [] },
]
