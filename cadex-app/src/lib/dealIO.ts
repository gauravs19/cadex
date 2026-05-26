// ============================================================
// CADEX — Deal Import / Export / URL sharing
// ============================================================

import LZString from 'lz-string'
import type { Deal } from '../types'

// ── JSON file export ──────────────────────────────────────────

export function exportDealJson(deal: Deal): void {
  const json = JSON.stringify(deal, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `cadex-${(deal.meta.name || deal.id).replace(/[^a-z0-9]/gi, '-').toLowerCase()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function parseDealJson(jsonString: string): Deal {
  let parsed: unknown
  try {
    parsed = JSON.parse(jsonString)
  } catch {
    throw new Error('File is not valid JSON')
  }
  const deal = parsed as Deal
  if (!deal.id || !deal.meta || typeof deal.meta !== 'object') {
    throw new Error('File does not appear to be a CADEX deal export')
  }
  return deal
}

// ── URL share (LZ-compressed hash) ───────────────────────────

export function encodeDealToUrl(deal: Deal): string {
  const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(deal))
  const url = new URL(window.location.href)
  url.hash = `deal=${compressed}`
  return url.toString()
}

export function decodeDealFromUrl(): Deal | null {
  const hash = window.location.hash
  const match = hash.match(/deal=([^&]*)/)
  if (!match) return null
  try {
    const json = LZString.decompressFromEncodedURIComponent(match[1])
    if (!json) return null
    const deal = JSON.parse(json) as Deal
    if (!deal.id || !deal.meta) return null
    return deal
  } catch {
    return null
  }
}

export function clearDealFromUrl(): void {
  window.history.replaceState(null, '', window.location.pathname + window.location.search)
}

// ── Clipboard copy ────────────────────────────────────────────

export async function copyShareLinkToClipboard(deal: Deal): Promise<void> {
  const url = encodeDealToUrl(deal)
  await navigator.clipboard.writeText(url)
}
