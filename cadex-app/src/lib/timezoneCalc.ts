// ============================================================
// CADEX — Timezone Overlap Calculator
// Computes the number of overlapping business hours between
// a client timezone and one or more delivery timezones.
// ============================================================

import type { TimezoneRegion } from '../types'

// ── Timezone UTC offsets (midpoint hours) ─────────────────────
// Using representative midpoint offsets for each region.

export const TIMEZONE_OFFSETS: Record<TimezoneRegion, number> = {
  'americas': -6,           // UTC-6 (Central US average)
  'europe-uk': 1,           // UTC+1 (BST/CET average)
  'mea': 3,                 // UTC+3 (Middle East & Africa average)
  'south-asia': 5.5,        // UTC+5:30 (IST)
  'east-asia-pacific': 8,   // UTC+8 (Singapore/Beijing/Hong Kong)
}

// Standard business day is 9:00–17:00 local time (8 hours)
const BUSINESS_START = 9  // 09:00
const BUSINESS_END = 17   // 17:00
const BUSINESS_HOURS = BUSINESS_END - BUSINESS_START // 8

/**
 * Calculate the overlap in hours between two business day windows.
 *
 * Both windows are normalised to UTC:
 *   window = [BUSINESS_START - offset, BUSINESS_END - offset] (in UTC hours)
 *
 * Overlap is the intersection of the two windows, clamped to [0, BUSINESS_HOURS].
 */
function overlapBetweenTwo(offsetA: number, offsetB: number): number {
  // Convert local business windows to UTC
  const startA = BUSINESS_START - offsetA
  const endA = BUSINESS_END - offsetA
  const startB = BUSINESS_START - offsetB
  const endB = BUSINESS_END - offsetB

  const overlapStart = Math.max(startA, startB)
  const overlapEnd = Math.min(endA, endB)
  return Math.max(0, overlapEnd - overlapStart)
}

/**
 * Calculate the average overlap hours between the client timezone
 * and all delivery timezones.
 *
 * If multiple delivery timezones are specified, the function returns
 * the average overlap across all of them (representative of the
 * blended delivery team).
 *
 * Returns a value between 0 and 8.
 */
export function calcOverlapHours(
  clientTz: TimezoneRegion | string,
  deliveryTzs: (TimezoneRegion | string)[],
): number {
  const clientOffset = TIMEZONE_OFFSETS[clientTz as TimezoneRegion] ?? 0

  if (deliveryTzs.length === 0) return BUSINESS_HOURS // no constraint

  const overlaps = deliveryTzs.map(tz => {
    const deliveryOffset = TIMEZONE_OFFSETS[tz as TimezoneRegion] ?? 0
    return overlapBetweenTwo(clientOffset, deliveryOffset)
  })

  const averageOverlap =
    overlaps.reduce((sum, h) => sum + h, 0) / overlaps.length

  // Round to 1 decimal place
  return Math.round(averageOverlap * 10) / 10
}
