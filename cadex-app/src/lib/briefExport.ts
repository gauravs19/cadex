// ============================================================
// CADEX — Deal Brief Export
// Generates a 1-page print-ready A4 HTML brief from a Deal.
// Opens in a new browser tab via a blob URL.
// ============================================================

import type { AxisCode, Deal } from '../types'
import { STRATEGIES } from '../data/strategies'
import { WORK_TYPES } from '../data/workTypes'
import { generateWinThemes } from './winThemeEngine'

// ── Label maps ────────────────────────────────────────────────

const PRICING_LABELS: Record<string, string> = {
  'fixed-price': 'Fixed Price', 'tm': 'Time & Materials', 'tm-cap': 'T&M with Cap',
  'retainer': 'Retainer', 'outcome': 'Outcome-Based', 'staff-aug': 'Staff Augmentation',
}
const DURATION_LABELS: Record<string, string> = {
  'lt3m': '< 3 months', '3-6m': '3–6 months', '6-12m': '6–12 months', 'gt12m': '12+ months',
}
const DEAL_SIZE_LABELS: Record<string, string> = {
  'lt100k': '< $100K', '100k-500k': '$100K–$500K', '500k-2m': '$500K–$2M', 'gt2m': '> $2M',
}
const BAND_LABEL: Record<string, string> = {
  green: 'Low Risk — Go', amber: 'Amber — Shape First', red: 'High Risk — Caution', black: 'No-Bid',
}
const AXIS_LABELS: Record<AxisCode, string> = {
  SC: 'Scope Clarity', CM: 'Client Maturity', CR: 'Commercial Risk',
  TC: 'Technical Complexity', GR: 'Governance Readiness',
  SV: 'Strategic Value', CP: 'Competitive Position', VF: 'Vendor Capability Fit',
}
const AXIS_CODES: AxisCode[] = ['SC', 'CM', 'CR', 'TC', 'GR', 'SV', 'CP', 'VF']
const SECTION_LABELS: Record<string, string> = {
  commercial: 'Commercial', scope: 'Scope', governance: 'Governance',
  risk: 'Risk', relationship: 'Relationship', strategic: 'Strategic',
  competitive: 'Competitive', vendor: 'Vendor Fit', 'post-delivery': 'Post-Delivery',
}

// ── Helpers ───────────────────────────────────────────────────

const e = (s: unknown) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const wtLabel = (id: string) => WORK_TYPES.find(n => n.id === id)?.label ?? id

function barClass(score: number): string {
  if (score >= 3.5) return 'bar-green'
  if (score >= 2.5) return 'bar-amber'
  return 'bar-red'
}

function bandClass(band: string): string {
  if (band === 'green') return 'band-green'
  if (band === 'amber') return 'band-amber'
  if (band === 'red') return 'band-red'
  return 'band-black'
}

function verdictClass(verdict: string): string {
  if (verdict === 'go') return 'vb-go'
  if (verdict === 'conditional') return 'vb-cond'
  return 'vb-nogo'
}

function verdictLabel(verdict: string): string {
  if (verdict === 'go') return 'Go'
  if (verdict === 'conditional') return 'Conditional Go'
  return 'No-Go'
}

function sectionBarClass(score: number): string {
  if (score >= 70) return 'bar-green'
  if (score >= 45) return 'bar-amber'
  return 'bar-red'
}

// ── Main generator ────────────────────────────────────────────

export function generateBriefHtml(deal: Deal): void {
  const { meta, assessment, strategy, shaperLevers, checklist, assumptions } = deal

  const today = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  // Strategy card
  const stratCard = strategy ? STRATEGIES[strategy.primary] : null

  // Win themes — require both strategy and assessment
  const winThemes = (strategy && assessment)
    ? generateWinThemes(
        { primary: strategy.primary, alternative: strategy.alternative },
        { workCategory: meta.workCategory, competitiveSituation: meta.competitiveSituation, industry: meta.industry },
        assessment.axisScores,
      )
    : []

  // Top levers for risks section (sorted by priority desc, top 4)
  const topLevers = [...(shaperLevers ?? [])].sort((a, b) => b.priority - a.priority).slice(0, 4)

  // High/medium impact assumptions only
  const keyAssumptions = assumptions.filter(a => a.ifFalseImpact === 'high' || a.ifFalseImpact === 'medium')

  // ── Axis bars HTML ──────────────────────────────────────────
  const axisBarsHtml = assessment
    ? AXIS_CODES.map(code => {
        const score = assessment.axisScores[code] ?? 0
        const pct = Math.round((score / 5) * 100)
        const cls = barClass(score)
        return `
        <div class="axis-row">
          <div class="axis-name-small">${e(AXIS_LABELS[code])}</div>
          <div class="axis-header">
            <span class="axis-code">${code}</span>
            <span class="axis-score">${score.toFixed(1)} / 5</span>
          </div>
          <div class="bar-track"><div class="bar-fill ${cls}" style="width:${pct}%"></div></div>
        </div>`
      }).join('\n')
    : '<div style="font-size:.72rem;color:#78716c;padding:8px 0">Assessment not yet completed.</div>'

  // ── Strategy HTML ───────────────────────────────────────────
  const strategyHtml = stratCard
    ? `
      <div class="strategy-id">Strategy ${e(strategy!.primary)}</div>
      <div class="strategy-name">${e(stratCard.name)}</div>
      <div class="strategy-pitch">${e(stratCard.tagline)}</div>
      <div class="strategy-moves">
        ${stratCard.keyMoves.slice(0, 3).map((m, i) => `
        <div class="move-item">
          <div class="move-dot">${i + 1}</div>
          <div>${e(m)}</div>
        </div>`).join('\n')}
      </div>`
    : '<div style="font-size:.72rem;color:#78716c;padding:8px 0">Strategy not yet selected.</div>'

  // ── Deal info rows ──────────────────────────────────────────
  const infoRows: [string, string][] = [
    ['Client', meta.clientName],
    ['Work type', `${meta.projectNature === 'greenfield' ? 'Greenfield' : meta.projectNature === 'brownfield' ? 'Brownfield' : meta.projectNature} · ${e(wtLabel(meta.workType))}`],
    ['Pricing model', PRICING_LABELS[meta.pricingModel] ?? meta.pricingModel],
    ['Deal size', DEAL_SIZE_LABELS[meta.dealSize] ?? meta.dealSize],
    ['Duration', DURATION_LABELS[meta.duration] ?? meta.duration],
    ['Competitive', meta.competitiveSituation === 'sole-source' ? 'Sole Source' : meta.competitiveSituation === 'preferred' ? 'Preferred Vendor' : meta.competitiveSituation === 'open' ? 'Open Competition' : 'Unknown'],
    ['Incumbent', meta.incumbentVendor || 'None / Unknown'],
    ['Assessed by', 'Presales Lead · ' + today],
  ]

  const dealInfoHtml = infoRows.map(([k, v]) => `
    <div class="info-row">
      <div class="info-key">${e(k)}</div>
      <div class="info-val">${e(v)}</div>
    </div>`).join('\n')

  // ── Top risks / levers ──────────────────────────────────────
  const risksHtml = topLevers.length > 0
    ? topLevers.map(lev => {
        const isHighRisk = lev.category === 'risk' || lev.category === 'governance'
        const dotClass = isHighRisk ? 'high' : 'med'
        return `
        <div class="risk-item">
          <div class="risk-dot ${dotClass}"></div>
          <div>
            <div class="risk-text">${e(lev.rationale)}</div>
            <div class="risk-axis">${e(lev.title)} — Action: ${e(lev.action.substring(0, 80))}…</div>
          </div>
        </div>`
      }).join('\n')
    : '<div style="font-size:.72rem;color:#78716c">No levers available — complete the Deal Shaper step.</div>'

  // ── Win themes ──────────────────────────────────────────────
  const themesHtml = winThemes.length > 0
    ? winThemes.map(t => `
      <div class="theme-item">
        <div class="theme-angle">${e(t.angle)}</div>
        <div class="theme-headline">${e(t.headline)}</div>
        <div class="theme-body">${e(t.body)}</div>
      </div>`).join('\n')
    : '<div style="font-size:.72rem;color:#78716c">Complete Strategy step to generate win themes.</div>'

  // ── Checker verdict ─────────────────────────────────────────
  const checkerHtml = checklist
    ? (() => {
        const blockerNote = checklist.hardBlockers.length > 0
          ? `${checklist.hardBlockers.length} hard blocker${checklist.hardBlockers.length > 1 ? 's' : ''} open. Resolve before submission.`
          : 'No hard blockers.'
        const sectionEntries = Object.entries(checklist.sectionScores)
          .filter(([id]) => id !== 'vendor')
          .slice(0, 8)
        const sectionRows = sectionEntries.map(([id, score]) => {
          const pct = Math.round(score)
          const cls = sectionBarClass(pct)
          return `
          <div class="cs-item">
            <span class="cs-name">${e(SECTION_LABELS[id] ?? id)}</span>
            <div class="cs-bar"><div class="cs-fill ${cls}" style="width:${pct}%"></div></div>
            <span class="cs-score">${pct}%</span>
          </div>`
        }).join('\n')
        return `
          <div class="verdict-row">
            <div class="verdict-badge ${verdictClass(checklist.verdict)}">${e(verdictLabel(checklist.verdict))}</div>
            <div style="font-size:.7rem;color:var(--slate);line-height:1.4">${e(blockerNote)}</div>
          </div>
          <div class="checker-sections">${sectionRows}</div>`
      })()
    : '<div style="font-size:.72rem;color:#78716c">Complete the Deal Checker step to see verdict.</div>'

  // ── Assumptions ────────────────────────────────────────────
  const assumptionsHtml = keyAssumptions.length > 0
    ? keyAssumptions.slice(0, 5).map(a => `
      <div class="assumption-item">
        <div class="impact-dot ${a.ifFalseImpact === 'high' ? 'imp-high' : 'imp-med'}">${a.ifFalseImpact.toUpperCase()}</div>
        <div class="assumption-text">${e(a.text)}</div>
      </div>`).join('\n')
    : '<div style="font-size:.72rem;color:#78716c">No assumptions recorded.</div>'

  // ── Score band ──────────────────────────────────────────────
  const band = assessment?.scoreBand ?? 'black'
  const score = assessment?.weightedTotal ?? 0

  // ── Full HTML ───────────────────────────────────────────────
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CADEX Brief — ${e(meta.name)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --ink:#0C0A09;--amber:#D97706;--amber-light:#F59E0B;--amber-pale:#FFFBEB;
  --amber-border:#FDE68A;--green:#15803D;--green-pale:#F0FDF4;
  --red:#B91C1C;--red-pale:#FEF2F2;--amber-band:#92400E;
  --slate:#57534E;--slate-light:#A8A29E;--border:#E7E5E4;--bg:#FAFAF9;
}
body{font-family:'Inter',system-ui,sans-serif;color:var(--ink);background:#fff;-webkit-font-smoothing:antialiased;font-size:10px;line-height:1.5}
.page{width:210mm;min-height:297mm;margin:24px auto;background:#fff;border:1px solid var(--border);box-shadow:0 4px 24px rgba(0,0,0,.08);display:flex;flex-direction:column;overflow:hidden}
.header{background:var(--ink);color:#fff;padding:18px 24px 16px;display:grid;grid-template-columns:1fr auto;align-items:start;gap:16px}
.brand{font-size:.68rem;font-weight:900;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.4);margin-bottom:6px}
.deal-name{font-size:1.4rem;font-weight:800;color:#fff;line-height:1.2;margin-bottom:4px}
.deal-meta{font-size:.72rem;color:rgba(255,255,255,.45);display:flex;gap:12px;flex-wrap:wrap}
.deal-meta span{display:flex;align-items:center;gap:4px}
.deal-meta .sep{color:rgba(255,255,255,.2)}
.header-right{text-align:right}
.band-badge{display:inline-block;font-size:.65rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;padding:4px 12px;border-radius:4px;margin-bottom:6px}
.band-green{background:#166534;color:#4ADE80}
.band-amber{background:#78350F;color:var(--amber-light)}
.band-red{background:#7F1D1D;color:#F87171}
.band-black{background:rgba(255,255,255,.1);color:rgba(255,255,255,.4)}
.score-big{font-size:2rem;font-weight:900;color:#fff;line-height:1;font-variant-numeric:tabular-nums}
.score-label{font-size:.62rem;color:rgba(255,255,255,.35);margin-top:2px}
.body{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:0}
.section{padding:16px 20px;border-right:1px solid var(--border);border-bottom:1px solid var(--border)}
.section:nth-child(even){border-right:none}
.section-title{font-size:.58rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--slate-light);margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid var(--border)}
.axes{grid-column:1/3;padding:16px 20px;border-bottom:1px solid var(--border)}
.axis-bars{display:grid;grid-template-columns:repeat(4,1fr);gap:10px 16px;margin-top:2px}
.axis-row{display:flex;flex-direction:column;gap:4px}
.axis-header{display:flex;justify-content:space-between;align-items:baseline}
.axis-code{font-size:.62rem;font-weight:800;color:var(--slate);font-variant-numeric:tabular-nums}
.axis-score{font-size:.72rem;font-weight:800;color:var(--ink);font-variant-numeric:tabular-nums}
.axis-name-small{font-size:.6rem;color:var(--slate-light);margin-bottom:2px}
.bar-track{height:5px;background:var(--border);border-radius:3px;overflow:hidden}
.bar-fill{height:100%;border-radius:3px}
.bar-green{background:var(--green)}.bar-amber{background:var(--amber)}.bar-red{background:var(--red)}
.strategy-id{font-size:.6rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--amber);margin-bottom:4px}
.strategy-name{font-size:.92rem;font-weight:800;color:var(--ink);margin-bottom:6px}
.strategy-pitch{font-size:.75rem;color:var(--slate);line-height:1.55}
.strategy-moves{margin-top:10px}
.move-item{display:flex;gap:7px;margin-bottom:5px;align-items:flex-start;font-size:.72rem;color:var(--slate);line-height:1.4}
.move-dot{width:14px;height:14px;border-radius:50%;background:var(--amber-pale);border:1px solid var(--amber-border);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:.5rem;color:var(--amber-band);font-weight:800;margin-top:1px}
.info-rows{display:flex;flex-direction:column;gap:7px}
.info-row{display:flex;gap:8px;align-items:flex-start}
.info-key{font-size:.65rem;font-weight:600;color:var(--slate-light);min-width:88px;flex-shrink:0;line-height:1.4}
.info-val{font-size:.72rem;color:var(--ink);line-height:1.4;font-weight:500}
.risk-list{display:flex;flex-direction:column;gap:7px}
.risk-item{display:flex;gap:8px;align-items:flex-start}
.risk-dot{width:7px;height:7px;border-radius:50%;flex-shrink:0;margin-top:4px}
.risk-dot.high{background:var(--red)}.risk-dot.med{background:var(--amber)}.risk-dot.low{background:var(--green)}
.risk-text{font-size:.72rem;color:var(--ink);line-height:1.45}
.risk-axis{font-size:.6rem;font-weight:600;color:var(--slate-light);margin-top:1px}
.theme-list{display:flex;flex-direction:column;gap:7px}
.theme-item{}
.theme-angle{font-size:.6rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--amber);margin-bottom:2px}
.theme-headline{font-size:.75rem;font-weight:700;color:var(--ink);line-height:1.35}
.theme-body{font-size:.68rem;color:var(--slate);line-height:1.45;margin-top:2px}
.verdict-row{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.verdict-badge{font-size:.65rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;padding:4px 12px;border-radius:4px}
.vb-go{background:var(--green-pale);color:var(--green)}.vb-cond{background:var(--amber-pale);color:var(--amber-band)}.vb-nogo{background:var(--red-pale);color:var(--red)}
.checker-sections{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.cs-item{display:flex;align-items:center;justify-content:space-between;gap:6px}
.cs-name{font-size:.65rem;color:var(--slate)}
.cs-score{font-size:.65rem;font-weight:700;color:var(--ink);font-variant-numeric:tabular-nums}
.cs-bar{flex:1;height:4px;background:var(--border);border-radius:2px;overflow:hidden}
.cs-fill{height:100%;border-radius:2px}
.assumption-list{display:flex;flex-direction:column;gap:6px}
.assumption-item{display:flex;gap:7px;align-items:flex-start}
.impact-dot{font-size:.58rem;font-weight:700;letter-spacing:.04em;padding:1px 5px;border-radius:3px;flex-shrink:0;margin-top:2px}
.imp-high{background:var(--red-pale);color:var(--red)}.imp-med{background:var(--amber-pale);color:var(--amber-band)}
.assumption-text{font-size:.7rem;color:var(--ink);line-height:1.4}
.brief-footer{padding:10px 20px;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;background:var(--bg)}
.brief-footer-brand{font-size:.6rem;font-weight:800;letter-spacing:.06em;color:var(--slate-light)}
.brief-footer-note{font-size:.6rem;color:var(--slate-light)}
.brief-footer-date{font-size:.6rem;color:var(--slate-light)}
.toolbar{width:210mm;margin:0 auto 12px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.toolbar-title{font-family:'Inter',sans-serif;font-size:.8rem;font-weight:600;color:#57534E}
.toolbar-btn{font-family:'Inter',sans-serif;font-size:.78rem;font-weight:700;background:#0C0A09;color:#fff;border:none;cursor:pointer;padding:8px 18px;border-radius:6px;transition:opacity .15s}
.toolbar-btn:hover{opacity:.8}
@media print{
  body{background:#fff;font-size:10px}
  .page{width:100%;min-height:unset;margin:0;border:none;box-shadow:none;page-break-after:avoid}
  .no-print{display:none!important}
  @page{size:A4;margin:0}
}
</style>
</head>
<body>

<div class="toolbar no-print">
  <span class="toolbar-title">CADEX Deal Brief — ${e(meta.name)}</span>
  <button class="toolbar-btn" onclick="window.print()">Print / Save PDF</button>
</div>

<div class="page">

  <div class="header">
    <div class="header-left">
      <div class="brand">CADEX · Deal Brief</div>
      <div class="deal-name">${e(meta.name)}</div>
      <div class="deal-meta">
        <span>${e(meta.clientName)}</span>
        <span class="sep">·</span>
        <span>${e(wtLabel(meta.workType))}</span>
        <span class="sep">·</span>
        <span>${meta.projectNature === 'greenfield' ? 'Greenfield' : meta.projectNature === 'brownfield' ? 'Brownfield' : e(meta.projectNature)} · ${e(PRICING_LABELS[meta.pricingModel] ?? meta.pricingModel)}</span>
        <span class="sep">·</span>
        <span>${e(DURATION_LABELS[meta.duration] ?? meta.duration)} · ${e(DEAL_SIZE_LABELS[meta.dealSize] ?? meta.dealSize)}</span>
      </div>
    </div>
    <div class="header-right">
      <div class="band-badge ${bandClass(band)}">${e(BAND_LABEL[band] ?? band)}</div>
      <div class="score-big">${score > 0 ? Math.round(score) + '%' : '—'}</div>
      <div class="score-label">Weighted risk score</div>
    </div>
  </div>

  <div class="body">

    <div class="section axes">
      <div class="section-title">Risk Axes — Weighted Scores (1–5 scale)</div>
      <div class="axis-bars">
        ${axisBarsHtml}
      </div>
    </div>

    <div class="section">
      <div class="section-title">Recommended Strategy</div>
      ${strategyHtml}
    </div>

    <div class="section">
      <div class="section-title">Deal Information</div>
      <div class="info-rows">
        ${dealInfoHtml}
      </div>
    </div>

    <div class="section">
      <div class="section-title">Top Risks &amp; Actions</div>
      <div class="risk-list">
        ${risksHtml}
      </div>
    </div>

    <div class="section">
      <div class="section-title">Win Themes</div>
      <div class="theme-list">
        ${themesHtml}
      </div>
    </div>

    <div class="section">
      <div class="section-title">Quality Gate — Checker Verdict</div>
      ${checkerHtml}
    </div>

    <div class="section">
      <div class="section-title">Key Assumptions — If False, High Impact</div>
      <div class="assumption-list">
        ${assumptionsHtml}
      </div>
    </div>

  </div>

  <div class="brief-footer">
    <div class="brief-footer-brand">CADEX · Deal Brief v0.5</div>
    <div class="brief-footer-note">Internal use only — VF axis visible. Remove before sharing externally.</div>
    <div class="brief-footer-date">Generated ${today}</div>
  </div>

</div>

</body>
</html>`

  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
}
