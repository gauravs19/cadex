// ============================================================
// CADEX — Share URL Codec
// Encodes a Deal object to a compressed URL-safe string and
// decodes it back — enabling shareable deal links.
// ============================================================

import LZString from 'lz-string'
import type { Deal } from '../types'

/**
 * Compress and encode a Deal to a URL-safe string.
 * Uses LZ-string for compression to keep URLs short.
 */
export function encodeDeal(deal: Deal): string {
  const json = JSON.stringify(deal)
  return LZString.compressToEncodedURIComponent(json)
}

/**
 * Decode and decompress a Deal from a compressed URL-safe string.
 * Returns null if the string is invalid, corrupt, or fails validation.
 */
export function decodeDeal(hash: string): Deal | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(hash)
    if (!json) return null

    const parsed = JSON.parse(json) as unknown

    // Basic structural validation
    if (!parsed || typeof parsed !== 'object') return null
    const deal = parsed as Record<string, unknown>
    if (
      typeof deal.id !== 'string' ||
      typeof deal.currentStep !== 'number' ||
      typeof deal.createdAt !== 'string' ||
      typeof deal.updatedAt !== 'string' ||
      typeof deal.version !== 'string' ||
      !deal.meta ||
      typeof deal.meta !== 'object'
    ) {
      return null
    }

    return parsed as Deal
  } catch {
    return null
  }
}
