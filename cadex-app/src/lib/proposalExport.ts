// ============================================================
// CADEX — Proposal Deck Export  (v2 — PPT-style slide deck)
// 30-slide HTML deck, 16:9, print-to-PDF ready.
// ============================================================

import type { AxisCode, AxisScores, Deal } from '../types'
import { STRATEGIES } from '../data/strategies'
import { WORK_TYPES } from '../data/workTypes'
import { DISCOVERY_GAPS, DISCOVERY_GAP_CATEGORIES } from '../data/discoveryGaps'
import { generateWinThemes } from './winThemeEngine'
import { WORK_TYPE_SCOPE_BLOCKS } from '../data/workTypeScopeQuestions'
import { OBJECTION_BANK } from '../data/objectionBank'

// ── Label maps ────────────────────────────────────────────────

const PRICING_LABELS: Record<string, string> = {
  'fixed-price': 'Fixed Price', 'tm': 'Time & Materials', 'tm-cap': 'T&M with Cap',
  'retainer': 'Retainer', 'outcome': 'Outcome-Based', 'staff-aug': 'Staff Augmentation',
}
const ENGAGEMENT_LABELS: Record<string, string> = {
  'fixed-agile': 'Fixed Price / Agile Scope', 'fixed-scope': 'Fixed Price / Fixed Scope',
  'tm': 'Time & Materials', 'outcome': 'Outcome / Value-Based', 'hybrid': 'Hybrid',
}
const DELIVERY_LABELS: Record<string, string> = {
  'onshore': 'Onshore', 'nearshore': 'Nearshore', 'offshore': 'Offshore', 'hybrid': 'Hybrid',
}
const DURATION_LABELS: Record<string, string> = {
  'lt3m': 'Under 3 months', '3-6m': '3 – 6 months', '6-12m': '6 – 12 months', 'gt12m': '12+ months',
}
const DEAL_SIZE_LABELS: Record<string, string> = {
  'lt100k': '< $100K', '100k-500k': '$100K – $500K', '500k-2m': '$500K – $2M', 'gt2m': '> $2M',
}
const BAND_LABEL: Record<string, string> = {
  green: 'Low Risk', amber: 'Moderate Risk', red: 'High Risk', black: 'Critical Risk',
}
const BAND_COLOR: Record<string, string> = {
  green: '#16a34a', amber: '#d97706', red: '#dc2626', black: '#0f172a',
}
const AXIS_LABELS: Record<AxisCode, string> = {
  SC: 'Scope Clarity', CM: 'Client Maturity', CR: 'Commercial Risk',
  TC: 'Technical Complexity', GR: 'Governance Readiness',
  SV: 'Strategic Value', CP: 'Competitive Position', VF: 'Vendor Fit',
}
const AXIS_CODES: AxisCode[] = ['SC', 'CM', 'CR', 'TC', 'GR', 'SV', 'CP', 'VF']

// ── Helpers ───────────────────────────────────────────────────

const e = (s: string) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const wtLabel = (id: string) => WORK_TYPES.find(n => n.id === id)?.label ?? id

function scoreColor(score: number): string {
  if (score >= 4) return '#16a34a'
  if (score >= 3) return '#d97706'
  return '#dc2626'
}

// ── Radar SVG ─────────────────────────────────────────────────

function radarSvg(scores: AxisScores, size = 320): string {
  const pad = 72  // padding for labels on all sides
  const cx = size / 2, cy = size / 2, r = (size / 2) - pad
  const n = AXIS_CODES.length

  const pt = (i: number, dist: number) => {
    const a = (i * 2 * Math.PI / n) - Math.PI / 2
    return { x: cx + dist * Math.cos(a), y: cy + dist * Math.sin(a) }
  }

  const gridLines = [1, 2, 3, 4, 5].map(lvl => {
    const pts = AXIS_CODES.map((_, i) => { const p = pt(i, (lvl / 5) * r); return `${p.x.toFixed(1)},${p.y.toFixed(1)}` }).join(' ')
    return `<polygon points="${pts}" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="${lvl === 3 ? 1.5 : 0.8}"/>`
  }).join('')

  const spokes = AXIS_CODES.map((_, i) => {
    const p = pt(i, r)
    return `<line x1="${cx}" y1="${cy}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>`
  }).join('')

  const scorePts = AXIS_CODES.map((ax, i) => {
    const p = pt(i, ((scores[ax] ?? 3) / 5) * r)
    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`
  }).join(' ')

  const dots = AXIS_CODES.map((ax, i) => {
    const p = pt(i, ((scores[ax] ?? 3) / 5) * r)
    const c = scoreColor(scores[ax] ?? 3)
    return `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4" fill="${c}" stroke="white" stroke-width="1.5"/>`
  }).join('')

  const labelR = r + 30
  const labels = AXIS_CODES.map((ax, i) => {
    const p = pt(i, labelR)
    const anchor = Math.abs(p.x - cx) < 15 ? 'middle' : p.x < cx ? 'end' : 'start'
    const score = scores[ax] ?? 3
    return `<text x="${p.x.toFixed(1)}" y="${(p.y - 6).toFixed(1)}" text-anchor="${anchor}" font-size="10" fill="rgba(255,255,255,0.7)" font-family="Inter,sans-serif" font-weight="500">${AXIS_LABELS[ax]}</text>
<text x="${p.x.toFixed(1)}" y="${(p.y + 8).toFixed(1)}" text-anchor="${anchor}" font-size="12" fill="${scoreColor(score)}" font-family="Inter,sans-serif" font-weight="700">${score.toFixed(1)}</text>`
  }).join('')

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" overflow="visible" xmlns="http://www.w3.org/2000/svg">
  ${gridLines}${spokes}
  <polygon points="${scorePts}" fill="rgba(99,102,241,0.25)" stroke="#818cf8" stroke-width="2"/>
  ${dots}${labels}
</svg>`
}

// ── Slide footer ──────────────────────────────────────────────

function footer(company: string, slideNum: number, total: number, section = ''): string {
  return `<div class="slide-footer">
    <span class="footer-company">${e(company)}</span>
    <span class="footer-section">${section}</span>
    <span class="footer-num">${slideNum} / ${total}</span>
  </div>`
}

// ── Slide builders ────────────────────────────────────────────

type SlideOpts = { company: string; num: number; total: number; section?: string }

function slideCover(deal: Deal, o: SlideOpts): string {
  const { meta } = deal
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  return `<div class="slide slide-cover">
    <div class="cover-eyebrow">ENGAGEMENT PROPOSAL · CONFIDENTIAL</div>
    <h1 class="cover-title">${e(meta.name || 'Engagement Proposal')}</h1>
    <div class="cover-client">Prepared for <strong>${e(meta.clientName || 'Client')}</strong></div>
    <div class="cover-meta-row">
      <span class="cover-badge">${e(PRICING_LABELS[meta.pricingModel] ?? meta.pricingModel)}</span>
      <span class="cover-badge">${e(DURATION_LABELS[meta.duration] ?? meta.duration)}</span>
      <span class="cover-badge">${e(DEAL_SIZE_LABELS[meta.dealSize] ?? meta.dealSize)}</span>
    </div>
    <div class="cover-bottom">
      <span>${e(o.company)}</span>
      <span>${today}</span>
    </div>
    <div class="cover-grid-bg"></div>
  </div>`
}

function slideAgenda(_deal: Deal, o: SlideOpts): string {
  const sections = [
    ['01', 'Understanding', 'Our interpretation of your requirements and context'],
    ['02', 'Strategy',      'Recommended engagement model and delivery approach'],
    ['03', 'Delivery',      'Team structure, governance, and delivery model'],
    ['04', 'Risk',          'Risk assessment, assumptions, and discovery gaps'],
    ['05', 'Commercial',    'Pricing, contract structure, and deal protections'],
    ['06', 'Compliance',    'Regulatory, security, and partner ecosystem'],
    ['07', 'Why Us',        'Our capabilities, differentiators, and commitment'],
    ['08', 'Next Steps',    'Quality gate verdict and recommended actions'],
  ]
  return `<div class="slide slide-white">
    <div class="slide-header-bar indigo-bar"></div>
    <div class="slide-content" style="padding-top:40px">
      <div class="slide-eyebrow">Agenda</div>
      <h2 class="slide-title" style="margin-bottom:32px">What We'll Cover</h2>
      <div class="agenda-grid">
        ${sections.map(([num, title, sub]) => `
          <div class="agenda-item">
            <span class="agenda-num">${num}</span>
            <div><div class="agenda-title">${title}</div><div class="agenda-sub">${sub}</div></div>
          </div>`).join('')}
      </div>
    </div>
    ${footer(o.company, o.num, o.total)}
  </div>`
}

function slideExecSummary(deal: Deal, o: SlideOpts): string {
  const { meta, assessment, strategy } = deal
  const strategyCard = strategy?.primary ? STRATEGIES[strategy.primary] : null
  const band = assessment?.scoreBand ?? 'amber'
  const score = assessment?.weightedTotal ?? '—'

  const facts = [
    ['Client', meta.clientName || '—'],
    ['Work type', meta.workType ? wtLabel(meta.workType) : '—'],
    ['Project nature', meta.projectNature.charAt(0).toUpperCase() + meta.projectNature.slice(1)],
    ['Duration', DURATION_LABELS[meta.duration] ?? meta.duration],
    ['Contract value', DEAL_SIZE_LABELS[meta.dealSize] ?? meta.dealSize],
    ['Delivery model', DELIVERY_LABELS[meta.deliveryModel] ?? meta.deliveryModel],
    ['Pricing model', PRICING_LABELS[meta.pricingModel] ?? meta.pricingModel],
  ]

  return `<div class="slide slide-white">
    <div class="slide-header-bar indigo-bar"></div>
    <div class="slide-content two-col" style="padding-top:40px">
      <div class="col-left">
        <div class="slide-eyebrow">Executive Summary</div>
        <h2 class="slide-title">Engagement at a Glance</h2>
        ${meta.scopeSummary ? `<p class="exec-summary-text">${e(meta.scopeSummary)}</p>` : ''}
        <div class="fact-table">
          ${facts.map(([k, v]) => `<div class="fact-row"><span class="fact-key">${k}</span><span class="fact-val">${e(v)}</span></div>`).join('')}
        </div>
      </div>
      <div class="col-right" style="display:flex;flex-direction:column;gap:20px">
        <div class="score-ring-block" style="border-color:${BAND_COLOR[band]}20;background:${BAND_COLOR[band]}08">
          <div class="score-ring-num" style="color:${BAND_COLOR[band]}">${score}%</div>
          <div class="score-ring-label">${BAND_LABEL[band]}</div>
          <div class="score-ring-sub">CADEX risk score</div>
        </div>
        ${strategyCard ? `<div class="strategy-pill-block">
          <div class="spill-label">Recommended strategy</div>
          <div class="spill-name">${e(strategyCard.name)}</div>
          <div class="spill-tag">${e(strategyCard.tagline)}</div>
        </div>` : ''}
      </div>
    </div>
    ${footer(o.company, o.num, o.total, 'Executive Summary')}
  </div>`
}

function slideSectionBreak(num: string, title: string, sub: string, color: string, o: SlideOpts): string {
  return `<div class="slide slide-section-break" style="background:${color}">
    <div class="section-break-num">${num}</div>
    <div class="section-break-title">${title}</div>
    <div class="section-break-sub">${sub}</div>
    ${footer(o.company, o.num, o.total)}
  </div>`
}

function slideUnderstanding(deal: Deal, o: SlideOpts): string {
  const { meta } = deal
  const points = [
    meta.scopeSummary,
    meta.workType ? `Delivering ${wtLabel(meta.workType)} (${meta.projectNature})` : null,
    meta.deliveryModel ? `${DELIVERY_LABELS[meta.deliveryModel]} delivery over ${DURATION_LABELS[meta.duration] ?? meta.duration}` : null,
    meta.competitiveSituation !== 'unknown' ? `Competitive situation: ${meta.competitiveSituation === 'sole-source' ? 'Sole source' : meta.competitiveSituation === 'preferred' ? 'Preferred vendor' : 'Open competition'}` : null,
    meta.budgetApprovalStatus === 'approved' ? 'Budget formally approved' : meta.budgetApprovalStatus === 'pending' ? 'Budget approval pending' : null,
  ].filter(Boolean) as string[]

  return `<div class="slide slide-dark-indigo">
    <div class="slide-content" style="padding-top:60px">
      <div class="slide-eyebrow" style="color:#a5b4fc">Our Understanding</div>
      <h2 class="slide-title" style="color:white;font-size:36px;margin-bottom:40px">What We Heard From You</h2>
      <div class="understanding-points">
        ${points.map((p, i) => `<div class="u-point">
          <div class="u-num" style="color:#818cf8">${String(i + 1).padStart(2, '0')}</div>
          <div class="u-text">${e(p)}</div>
        </div>`).join('')}
      </div>
    </div>
    ${footer(o.company, o.num, o.total, 'Understanding')}
  </div>`
}

function slideScopeOfWork(deal: Deal, o: SlideOpts): string {
  const { meta } = deal
  const items = [
    { label: 'Project nature', value: meta.projectNature.charAt(0).toUpperCase() + meta.projectNature.slice(1) },
    ...(meta.workCategory ? [{ label: 'Work category', value: wtLabel(meta.workCategory) }] : []),
    ...(meta.workType ? [{ label: 'Work type', value: wtLabel(meta.workType) }] : []),
    { label: 'Duration', value: DURATION_LABELS[meta.duration] ?? meta.duration },
    { label: 'Indicative value', value: DEAL_SIZE_LABELS[meta.dealSize] ?? meta.dealSize },
    { label: 'Delivery model', value: DELIVERY_LABELS[meta.deliveryModel] ?? meta.deliveryModel },
    { label: 'Industry', value: meta.industry.charAt(0).toUpperCase() + meta.industry.slice(1) },
  ]
  return `<div class="slide slide-white">
    <div class="slide-header-bar indigo-bar"></div>
    <div class="slide-content" style="padding-top:40px">
      <div class="slide-eyebrow">Understanding</div>
      <h2 class="slide-title">Scope of Work</h2>
      ${meta.scopeSummary ? `<p class="scope-blurb">${e(meta.scopeSummary)}</p>` : ''}
      <div class="scope-grid">
        ${items.map(({ label, value }) => `<div class="scope-item"><div class="scope-label">${label}</div><div class="scope-value">${e(value)}</div></div>`).join('')}
      </div>
    </div>
    ${footer(o.company, o.num, o.total, 'Understanding')}
  </div>`
}

function slideTechContext(deal: Deal, o: SlideOpts): string {
  const { meta } = deal
  const partners = meta.technologyPartners.filter(p => p !== 'none')
  const frameworks = meta.applicableFrameworks.filter(f => f !== 'none')
  return `<div class="slide slide-white">
    <div class="slide-header-bar indigo-bar"></div>
    <div class="slide-content" style="padding-top:40px">
      <div class="slide-eyebrow">Understanding</div>
      <h2 class="slide-title">Technical Context</h2>
      <div class="two-col" style="margin-top:24px;gap:40px">
        <div>
          <div class="section-sub-heading">Technology Partners</div>
          ${partners.length > 0
            ? `<div class="tag-group">${partners.map(p => `<span class="tag tag-indigo">${e(p.toUpperCase().replace(/-/g, ' '))}</span>`).join('')}</div>`
            : '<p class="dim-text">No specific platform partners identified</p>'}
          <div class="section-sub-heading" style="margin-top:24px">Compliance Frameworks</div>
          ${frameworks.length > 0
            ? `<div class="tag-group">${frameworks.map(f => `<span class="tag tag-violet">${e(f.toUpperCase())}</span>`).join('')}</div>`
            : '<p class="dim-text">No specific compliance frameworks identified</p>'}
        </div>
        <div>
          <div class="section-sub-heading">Delivery Geography</div>
          <div class="geo-item"><span class="geo-dot client-dot"></span>Client: ${e(meta.clientTimezone.replace(/-/g, ' / '))}</div>
          <div class="geo-item"><span class="geo-dot delivery-dot"></span>Delivery: ${e((meta.deliveryTimezones ?? []).map(t => t.replace(/-/g, ' / ')).join(', ') || '—')}</div>
          ${meta.timezoneOverlapHours > 0 ? `<div class="overlap-bar-wrap">
            <div class="overlap-label">Daily overlap: <strong style="color:${meta.timezoneOverlapHours < 3 ? '#dc2626' : meta.timezoneOverlapHours < 5 ? '#d97706' : '#16a34a'}">${meta.timezoneOverlapHours}h</strong></div>
            <div class="bar-track"><div class="bar-fill" style="width:${Math.min(100, (meta.timezoneOverlapHours / 8) * 100)}%;background:${meta.timezoneOverlapHours < 3 ? '#dc2626' : meta.timezoneOverlapHours < 5 ? '#d97706' : '#16a34a'}"></div></div>
          </div>` : ''}
          <div class="section-sub-heading" style="margin-top:24px">Our Role</div>
          <div class="tag-group"><span class="tag tag-green">${e(meta.ourRole.toUpperCase().replace(/-/g, ' '))}</span></div>
        </div>
      </div>
    </div>
    ${footer(o.company, o.num, o.total, 'Understanding')}
  </div>`
}

function slideStrategy(deal: Deal, o: SlideOpts): string {
  const { strategy } = deal
  const card = strategy?.primary ? STRATEGIES[strategy.primary] : null
  if (!card) return `<div class="slide slide-white">
    <div class="slide-header-bar indigo-bar"></div>
    <div class="slide-content" style="padding-top:60px">
      <div class="slide-eyebrow">Strategy</div>
      <h2 class="slide-title">Recommended Approach</h2>
      <p class="dim-text" style="margin-top:40px">Complete the Risk Assessment to generate a strategy recommendation.</p>
    </div>
    ${footer(o.company, o.num, o.total, 'Strategy')}
  </div>`

  return `<div class="slide slide-dark-slate">
    <div class="slide-content" style="padding-top:50px">
      <div class="slide-eyebrow" style="color:#94a3b8">Recommended Strategy</div>
      <div class="strategy-letter">${card.id}</div>
      <h2 class="strategy-big-name">${e(card.name)}</h2>
      <div class="strategy-tagline-big">${e(card.tagline)}</div>
      <div class="strategy-pitch-block">${e(card.pitch)}</div>
    </div>
    ${footer(o.company, o.num, o.total, 'Strategy')}
  </div>`
}

function slideKeyMoves(deal: Deal, o: SlideOpts): string {
  const { strategy } = deal
  const card = strategy?.primary ? STRATEGIES[strategy.primary] : null
  const moves = card?.keyMoves ?? ['Define clear scope boundaries before contract signature.', 'Establish governance and decision-making cadence at kick-off.', 'Build in formal change control from sprint 1.']
  return `<div class="slide slide-white">
    <div class="slide-header-bar indigo-bar"></div>
    <div class="slide-content" style="padding-top:40px">
      <div class="slide-eyebrow">Strategy</div>
      <h2 class="slide-title">Key Delivery Moves</h2>
      <div class="moves-grid">
        ${moves.slice(0, 3).map((m, i) => `<div class="move-card">
          <div class="move-num">${String(i + 1).padStart(2, '0')}</div>
          <div class="move-text">${e(m)}</div>
        </div>`).join('')}
      </div>
    </div>
    ${footer(o.company, o.num, o.total, 'Strategy')}
  </div>`
}

function slideWhyStrategy(deal: Deal, o: SlideOpts): string {
  const { strategy } = deal
  const card = strategy?.primary ? STRATEGIES[strategy.primary] : null
  const rationale = strategy?.rationale ?? []
  const altCard = strategy?.alternative ? STRATEGIES[strategy.alternative] : null

  return `<div class="slide slide-white">
    <div class="slide-header-bar indigo-bar"></div>
    <div class="slide-content two-col" style="padding-top:40px">
      <div class="col-left">
        <div class="slide-eyebrow">Strategy</div>
        <h2 class="slide-title">Why This Approach</h2>
        <div class="rationale-list">
          ${rationale.length > 0
            ? rationale.map(r => `<div class="rationale-item"><span class="check-arrow">→</span>${e(r)}</div>`).join('')
            : '<div class="rationale-item"><span class="check-arrow">→</span>Optimised for deal risk profile and client maturity.</div>'}
        </div>
      </div>
      <div class="col-right">
        ${altCard ? `<div class="alt-block">
          <div class="alt-label">Alternative considered</div>
          <div class="alt-name">${e(altCard.name)}</div>
          <div class="alt-tag">${e(altCard.tagline)}</div>
        </div>` : ''}
        ${card?.contractNonNegotiables?.length ? `<div class="non-neg-block">
          <div class="section-sub-heading">Contract Non-Negotiables</div>
          ${card.contractNonNegotiables.slice(0, 3).map(n => `<div class="non-neg-item">◼ ${e(n)}</div>`).join('')}
        </div>` : ''}
      </div>
    </div>
    ${footer(o.company, o.num, o.total, 'Strategy')}
  </div>`
}

function slideDeliveryModel(deal: Deal, o: SlideOpts): string {
  const { meta } = deal
  const overlap = meta.timezoneOverlapHours
  const overlapColor = overlap < 3 ? '#dc2626' : overlap < 5 ? '#d97706' : '#16a34a'

  return `<div class="slide slide-white">
    <div class="slide-header-bar green-bar"></div>
    <div class="slide-content" style="padding-top:40px">
      <div class="slide-eyebrow">Delivery</div>
      <h2 class="slide-title">Delivery Model</h2>
      <div class="delivery-cards">
        <div class="del-card">
          <div class="del-card-label">Model</div>
          <div class="del-card-value">${e(DELIVERY_LABELS[meta.deliveryModel] ?? meta.deliveryModel)}</div>
        </div>
        <div class="del-card">
          <div class="del-card-label">Client Timezone</div>
          <div class="del-card-value">${e(meta.clientTimezone.replace(/-/g, ' / '))}</div>
        </div>
        <div class="del-card">
          <div class="del-card-label">Delivery Zone(s)</div>
          <div class="del-card-value" style="font-size:16px">${e((meta.deliveryTimezones ?? []).map(t => t.replace(/-/g, ' ')).join(', ') || '—')}</div>
        </div>
        <div class="del-card" style="border-color:${overlapColor}40">
          <div class="del-card-label">Daily Overlap</div>
          <div class="del-card-value" style="color:${overlapColor}">${overlap > 0 ? `${overlap}h` : '—'}</div>
          ${overlap > 0 && overlap < 3 ? '<div class="del-card-warn">⚠ Governance risk</div>' : ''}
        </div>
        <div class="del-card">
          <div class="del-card-label">In-Country Presence</div>
          <div class="del-card-value" style="font-size:16px">${meta.inCountryRequired === 'contractual' ? 'Required (contractual)' : meta.inCountryRequired === 'preferred' ? 'Preferred' : 'Not required'}</div>
        </div>
        <div class="del-card">
          <div class="del-card-label">Our Role</div>
          <div class="del-card-value">${e(meta.ourRole.toUpperCase().replace(/-/g, ' '))}</div>
        </div>
      </div>
    </div>
    ${footer(o.company, o.num, o.total, 'Delivery')}
  </div>`
}

function slideTeamGovernance(_deal: Deal, o: SlideOpts): string {
  const roles = [
    ['Engagement Lead', 'Accountable for commercial delivery and client relationship'],
    ['Delivery Manager', 'Sprint planning, progress tracking, risk management'],
    ['Technical Lead / Architect', 'Solution design, code quality, technical decisions'],
    ['Scrum Master', 'Agile ceremony facilitation, impediment removal'],
    ['Business Analyst', 'Requirement refinement, acceptance criteria, UAT'],
    ['QA Lead', 'Test strategy, automation framework, quality gates'],
  ]
  return `<div class="slide slide-white">
    <div class="slide-header-bar green-bar"></div>
    <div class="slide-content" style="padding-top:40px">
      <div class="slide-eyebrow">Delivery</div>
      <h2 class="slide-title">Team Structure & Governance</h2>
      <div class="team-grid">
        ${roles.map(([role, desc]) => `<div class="team-card">
          <div class="team-role">${role}</div>
          <div class="team-desc">${desc}</div>
        </div>`).join('')}
      </div>
    </div>
    ${footer(o.company, o.num, o.total, 'Delivery')}
  </div>`
}

function slideSprintCadence(_deal: Deal, o: SlideOpts): string {
  const phases = [
    ['Kick-off & Setup', 'Wk 1–2', 'Environment, access, team onboarding, backlog grooming'],
    ['Sprint Delivery', 'Wk 3+', '2-week sprints, sprint review, demo with client PO'],
    ['UAT & Hardening', 'Last 2 sprints', 'User acceptance testing, bug fixing, performance tuning'],
    ['Handover & KT', 'Final week', 'Documentation, knowledge transfer, BAU handoff'],
  ]
  return `<div class="slide slide-white">
    <div class="slide-header-bar green-bar"></div>
    <div class="slide-content" style="padding-top:40px">
      <div class="slide-eyebrow">Delivery</div>
      <h2 class="slide-title">Sprint Cadence & Delivery Phases</h2>
      <div class="timeline-steps">
        ${phases.map(([phase, timing, desc], i) => `<div class="timeline-step">
          <div class="ts-dot" style="background:${['#4f46e5','#7c3aed','#0891b2','#16a34a'][i]}"></div>
          <div class="ts-body">
            <div class="ts-phase">${phase}</div>
            <div class="ts-timing">${timing}</div>
            <div class="ts-desc">${desc}</div>
          </div>
        </div>`).join('<div class="ts-connector"></div>')}
      </div>
    </div>
    ${footer(o.company, o.num, o.total, 'Delivery')}
  </div>`
}

function slideRiskRadar(deal: Deal, o: SlideOpts): string {
  const { assessment } = deal
  if (!assessment) return `<div class="slide slide-dark-risk">
    <div class="slide-content" style="padding-top:60px">
      <div class="slide-eyebrow" style="color:#fca5a5">Risk Assessment</div>
      <h2 class="slide-title" style="color:white">No risk data yet</h2>
      <p style="color:#94a3b8">Complete the Risk Scorer to populate the radar.</p>
    </div>
    ${footer(o.company, o.num, o.total, 'Risk')}
  </div>`

  const svg = radarSvg(assessment.axisScores, 300)
  const band = assessment.scoreBand
  return `<div class="slide slide-dark-risk">
    <div class="slide-content two-col" style="padding-top:40px;align-items:center;overflow:visible">
      <div class="col-left">
        <div class="slide-eyebrow" style="color:#fca5a5">Risk Assessment</div>
        <h2 class="slide-title" style="color:white;font-size:32px">8-Axis Risk Profile</h2>
        <div class="risk-summary-box" style="border-color:${BAND_COLOR[band]}50;background:${BAND_COLOR[band]}15;margin-top:28px">
          <div class="rsb-score" style="color:${BAND_COLOR[band]}">${assessment.weightedTotal}%</div>
          <div class="rsb-band" style="color:${BAND_COLOR[band]}">${BAND_LABEL[band]}</div>
          <div class="rsb-sub">Weighted CADEX risk score</div>
        </div>
        ${assessment.criticalFlags.length > 0 ? `<div class="critical-flag-count">
          <span style="color:#f87171;font-weight:700;font-size:20px">${assessment.criticalFlags.length}</span>
          <span style="color:#94a3b8;font-size:13px"> critical flag${assessment.criticalFlags.length > 1 ? 's' : ''} identified</span>
        </div>` : `<div class="critical-flag-count"><span style="color:#4ade80;font-weight:700">✓</span> <span style="color:#94a3b8;font-size:13px">No critical flags</span></div>`}
      </div>
      <div class="col-right" style="display:flex;justify-content:center;align-items:center;overflow:visible;padding:20px">
        ${svg}
      </div>
    </div>
    ${footer(o.company, o.num, o.total, 'Risk')}
  </div>`
}

function slideRiskDimensions(deal: Deal, o: SlideOpts): string {
  const scores = deal.assessment?.axisScores
  return `<div class="slide slide-white">
    <div class="slide-header-bar red-bar"></div>
    <div class="slide-content" style="padding-top:40px">
      <div class="slide-eyebrow">Risk</div>
      <h2 class="slide-title">Risk by Dimension</h2>
      <div class="axis-bars-grid">
        ${AXIS_CODES.filter(ax => ax !== 'VF').map(ax => {
          const score = scores?.[ax] ?? 3
          const color = scoreColor(score)
          return `<div class="axis-bar-row">
            <div class="axis-bar-label">${AXIS_LABELS[ax]}</div>
            <div class="axis-bar-track">
              <div class="axis-bar-fill" style="width:${(score / 5) * 100}%;background:${color}"></div>
            </div>
            <div class="axis-bar-score" style="color:${color}">${score.toFixed(1)}</div>
          </div>`
        }).join('')}
      </div>
      <div class="axis-legend"><span class="legend-dot" style="background:#16a34a"></span>4–5 Low risk &nbsp;&nbsp; <span class="legend-dot" style="background:#d97706"></span>3–4 Moderate &nbsp;&nbsp; <span class="legend-dot" style="background:#dc2626"></span>1–3 High risk</div>
    </div>
    ${footer(o.company, o.num, o.total, 'Risk')}
  </div>`
}

function slideAssumptions(deal: Deal, o: SlideOpts): string {
  const assumptions = deal.assumptions ?? []
  const IMPACT_COLORS: Record<string, string> = { high: '#dc2626', medium: '#d97706', low: '#64748b' }
  const IMPACT_BG: Record<string, string> = { high: '#fef2f2', medium: '#fffbeb', low: '#f8fafc' }

  return `<div class="slide slide-white">
    <div class="slide-header-bar red-bar"></div>
    <div class="slide-content" style="padding-top:40px">
      <div class="slide-eyebrow">Risk</div>
      <h2 class="slide-title">Scope Assumptions</h2>
      <p class="slide-sub-text">If any assumption below proves false, a formal change order will be required.</p>
      ${assumptions.length > 0 ? `<div class="assumption-table">
        <div class="at-header"><span class="at-col-main">Assumption</span><span class="at-col-impact">If False — Impact</span></div>
        ${assumptions.map(a => `<div class="at-row" style="border-left:3px solid ${IMPACT_COLORS[a.ifFalseImpact]};background:${IMPACT_BG[a.ifFalseImpact]}">
          <span class="at-col-main">${e(a.text)}</span>
          <span class="at-col-impact" style="color:${IMPACT_COLORS[a.ifFalseImpact]};font-weight:700">${a.ifFalseImpact.charAt(0).toUpperCase() + a.ifFalseImpact.slice(1)}</span>
        </div>`).join('')}
      </div>` : '<p class="dim-text" style="margin-top:40px">No scope assumptions logged. Add them in the Intake step.</p>'}
    </div>
    ${footer(o.company, o.num, o.total, 'Risk')}
  </div>`
}

function slideDiscoveryGaps(deal: Deal, o: SlideOpts): string {
  const { meta } = deal
  const gaps = deal.discoveryGaps ?? {}
  const relevant = DISCOVERY_GAPS.filter(g => {
    if (g.triggerProjectNature && !g.triggerProjectNature.includes(meta.projectNature)) return false
    if (g.triggerWorkCategories && meta.workCategory && !g.triggerWorkCategories.includes(meta.workCategory)) return false
    if (g.triggerWorkCategories && !meta.workCategory) return false
    return true
  })
  const byCategory = Object.keys(DISCOVERY_GAP_CATEGORIES) as Array<keyof typeof DISCOVERY_GAP_CATEGORIES>
  const summary = byCategory.map(cat => {
    const items = relevant.filter(g => g.category === cat)
    const unknown = items.filter(g => (gaps[g.id] ?? 'unknown') === 'unknown').length
    const known = items.filter(g => gaps[g.id] === 'known').length
    return { cat, label: DISCOVERY_GAP_CATEGORIES[cat].label, total: items.length, unknown, known }
  }).filter(r => r.total > 0)

  return `<div class="slide slide-white">
    <div class="slide-header-bar amber-bar"></div>
    <div class="slide-content" style="padding-top:40px">
      <div class="slide-eyebrow">Risk</div>
      <h2 class="slide-title">Open Discovery Items</h2>
      <p class="slide-sub-text">Questions that must be resolved before contract signature.</p>
      <div class="gap-summary-grid">
        ${summary.map(({ label, total, unknown, known }) => {
          const pct = total > 0 ? Math.round((known / total) * 100) : 0
          const color = unknown === 0 ? '#16a34a' : unknown > 2 ? '#dc2626' : '#d97706'
          return `<div class="gap-cat-card">
            <div class="gap-cat-label">${label}</div>
            <div class="gap-cat-bar-track"><div class="gap-cat-bar" style="width:${pct}%;background:${color}"></div></div>
            <div class="gap-cat-stats">
              <span style="color:${color};font-weight:700">${unknown} open</span>
              <span style="color:#94a3b8"> / ${total} total</span>
            </div>
          </div>`
        }).join('')}
      </div>
    </div>
    ${footer(o.company, o.num, o.total, 'Risk')}
  </div>`
}

function slideCommercial(deal: Deal, o: SlideOpts): string {
  const { meta } = deal
  const hasEcon = meta.quotedPriceK || meta.estimatedCostK
  const margin = (meta.quotedPriceK && meta.estimatedCostK && meta.quotedPriceK > 0)
    ? Math.round(((meta.quotedPriceK - meta.estimatedCostK) / meta.quotedPriceK) * 100) : null
  const marginColor = margin === null ? '#64748b' : margin >= 25 ? '#16a34a' : margin >= 15 ? '#d97706' : '#dc2626'

  return `<div class="slide slide-dark-green">
    <div class="slide-content" style="padding-top:50px">
      <div class="slide-eyebrow" style="color:#86efac">Commercial</div>
      <h2 class="slide-title" style="color:white">Commercial Summary</h2>
      <div class="commercial-big-numbers">
        ${meta.quotedPriceK ? `<div class="comm-num-block">
          <div class="comm-big">$${meta.quotedPriceK.toLocaleString()}K</div>
          <div class="comm-label">Quoted Price</div>
        </div>` : ''}
        ${margin !== null ? `<div class="comm-num-block">
          <div class="comm-big" style="color:${marginColor}">${margin}%</div>
          <div class="comm-label">Gross Margin${margin < 20 ? ' ⚠' : ''}</div>
        </div>` : ''}
        ${meta.contingencyPct ? `<div class="comm-num-block">
          <div class="comm-big">${meta.contingencyPct}%</div>
          <div class="comm-label">Contingency</div>
        </div>` : ''}
        ${meta.quotedPriceK && meta.estimatedCostK ? `<div class="comm-num-block">
          <div class="comm-big">$${Math.round(meta.quotedPriceK - meta.estimatedCostK).toLocaleString()}K</div>
          <div class="comm-label">Gross Profit</div>
        </div>` : ''}
      </div>
      ${!hasEcon ? '<p style="color:#94a3b8;margin-top:40px">Enter bid economics in the Intake step to populate this slide.</p>' : ''}
      <div class="comm-model-row">
        <div class="comm-model-item"><span class="cmi-label">Pricing model</span><span class="cmi-value">${e(PRICING_LABELS[meta.pricingModel] ?? meta.pricingModel)}</span></div>
        <div class="comm-model-item"><span class="cmi-label">Engagement type</span><span class="cmi-value">${e(ENGAGEMENT_LABELS[meta.engagementType] ?? meta.engagementType)}</span></div>
        <div class="comm-model-item"><span class="cmi-label">Deal size band</span><span class="cmi-value">${e(DEAL_SIZE_LABELS[meta.dealSize] ?? meta.dealSize)}</span></div>
      </div>
    </div>
    ${footer(o.company, o.num, o.total, 'Commercial')}
  </div>`
}

function slideContractStructure(deal: Deal, o: SlideOpts): string {
  const { strategy } = deal
  const card = strategy?.primary ? STRATEGIES[strategy.primary] : null
  const nonNegs = card?.contractNonNegotiables ?? []

  return `<div class="slide slide-white">
    <div class="slide-header-bar green-bar"></div>
    <div class="slide-content" style="padding-top:40px">
      <div class="slide-eyebrow">Commercial</div>
      <h2 class="slide-title">Contract Structure</h2>
      <div class="two-col" style="margin-top:24px;gap:40px">
        <div>
          <div class="section-sub-heading">Engagement Type</div>
          <div class="contract-value">${e(ENGAGEMENT_LABELS[deal.meta.engagementType] ?? deal.meta.engagementType)}</div>
          <div class="section-sub-heading" style="margin-top:20px">Key Commercial Principles</div>
          ${['Fixed price means fixed scope — changes via scope bank', 'Scope bank: equal-effort feature swaps, no cost increase', 'Change orders required for any out-of-scope request', 'Sprint reviews are contractual client obligations'].map(p => `<div class="contract-principle">◼ ${p}</div>`).join('')}
        </div>
        <div>
          <div class="section-sub-heading">Non-Negotiables</div>
          ${nonNegs.length > 0
            ? nonNegs.map(n => `<div class="non-neg-card">${e(n)}</div>`).join('')
            : '<p class="dim-text">Complete the Strategy step to generate contract non-negotiables.</p>'}
        </div>
      </div>
    </div>
    ${footer(o.company, o.num, o.total, 'Commercial')}
  </div>`
}

function slideDealProtections(deal: Deal, o: SlideOpts): string {
  const levers = (deal.shaperLevers ?? []).slice(0, 4)
  const catColors: Record<string, string> = {
    scope: '#4f46e5', commercial: '#16a34a', governance: '#d97706', risk: '#dc2626', relationship: '#0891b2',
  }
  return `<div class="slide slide-white">
    <div class="slide-header-bar green-bar"></div>
    <div class="slide-content" style="padding-top:40px">
      <div class="slide-eyebrow">Commercial</div>
      <h2 class="slide-title">Deal Protections</h2>
      ${levers.length > 0 ? `<div class="levers-grid">
        ${levers.map(l => `<div class="lever-card">
          <div class="lever-cat" style="color:${catColors[l.category] ?? '#4f46e5'}">${l.category.toUpperCase()}</div>
          <div class="lever-title">${e(l.title)}</div>
          <div class="lever-action">${e(l.action)}</div>
          ${l.contractLanguage ? `<div class="lever-contract-text">"${e(l.contractLanguage)}"</div>` : ''}
        </div>`).join('')}
      </div>` : '<p class="dim-text" style="margin-top:40px">Complete the Deal Shaper step to generate deal protections.</p>'}
    </div>
    ${footer(o.company, o.num, o.total, 'Commercial')}
  </div>`
}

function slideCompliance(deal: Deal, o: SlideOpts): string {
  const { meta } = deal
  const dc = meta.dataClassification.filter(d => d !== 'none')
  const fw = meta.applicableFrameworks.filter(f => f !== 'none')
  return `<div class="slide slide-white">
    <div class="slide-header-bar violet-bar"></div>
    <div class="slide-content" style="padding-top:40px">
      <div class="slide-eyebrow">Compliance</div>
      <h2 class="slide-title">Compliance & Security</h2>
      <div class="compliance-grid">
        <div class="comp-block">
          <div class="section-sub-heading">Data Classification</div>
          ${dc.length > 0 ? `<div class="tag-group">${dc.map(d => `<span class="tag tag-red">${e(d.toUpperCase().replace(/-/g,' '))}</span>`).join('')}</div>` : '<p class="dim-text">No sensitive data classification</p>'}
        </div>
        <div class="comp-block">
          <div class="section-sub-heading">Compliance Frameworks</div>
          ${fw.length > 0 ? `<div class="tag-group">${fw.map(f => `<span class="tag tag-violet">${e(f.toUpperCase())}</span>`).join('')}</div>` : '<p class="dim-text">No specific frameworks</p>'}
        </div>
        <div class="comp-block">
          <div class="section-sub-heading">Data Residency</div>
          <div class="comp-value">${meta.dataResidencyRequired === 'in-country' ? '⚠ In-country required' : meta.dataResidencyRequired === 'regional' ? 'Regional restriction' : meta.dataResidencyRequired === 'unknown' ? 'TBC' : 'No restriction'}</div>
        </div>
        <div class="comp-block">
          <div class="section-sub-heading">Security Certification</div>
          <div class="comp-value">${meta.securityCertRequired === 'yes' ? '⚠ Mandatory' : meta.securityCertRequired === 'likely' ? 'Likely required' : meta.securityCertRequired === 'no' ? 'Not required' : 'Unknown'}</div>
        </div>
      </div>
    </div>
    ${footer(o.company, o.num, o.total, 'Compliance')}
  </div>`
}

function slideScopeContext(deal: Deal, o: SlideOpts): string {
  const { meta } = deal
  const answers = meta.workTypeScopeAnswers ?? {}
  const block = WORK_TYPE_SCOPE_BLOCKS.find(b => b.workTypeId === meta.workType)

  if (!block || Object.keys(answers).length === 0) {
    return `<div class="slide slide-white">
      <div class="slide-header-bar indigo-bar"></div>
      <div class="slide-content" style="padding-top:40px">
        <div class="slide-eyebrow">Understanding</div>
        <h2 class="slide-title">Scope Context</h2>
        <p class="dim-text" style="margin-top:40px">Complete the scope questions in the Intake step to populate this slide.</p>
      </div>
      ${footer(o.company, o.num, o.total, 'Understanding')}
    </div>`
  }

  const answered = block.questions
    .filter(q => answers[q.id] && answers[q.id] !== '')
    .map(q => {
      const val = answers[q.id]
      const optLabel = q.options?.find(opt => opt.value === val)?.label ?? val
      const risk = q.options?.find(opt => opt.value === val)?.risk
      return { label: q.label, value: optLabel, risk }
    })

  return `<div class="slide slide-white">
    <div class="slide-header-bar indigo-bar"></div>
    <div class="slide-content" style="padding-top:40px">
      <div class="slide-eyebrow">Understanding</div>
      <h2 class="slide-title">${e(block.heading)}</h2>
      <p class="scope-blurb">${e(block.intro)}</p>
      <div class="scope-qa-grid">
        ${answered.map(({ label, value, risk }) => `<div class="sqa-item${risk ? ' sqa-risk' : ''}">
          <div class="sqa-label">${e(label)}</div>
          <div class="sqa-value">${e(value)}</div>
          ${risk ? `<div class="sqa-risk-note">⚠ ${e(risk)}</div>` : ''}
        </div>`).join('')}
      </div>
    </div>
    ${footer(o.company, o.num, o.total, 'Understanding')}
  </div>`
}

function slideWinThemes(deal: Deal, o: SlideOpts): string {
  const { assessment, strategy } = deal
  if (!assessment || !strategy?.primary) {
    return `<div class="slide slide-white">
      <div class="slide-header-bar indigo-bar"></div>
      <div class="slide-content" style="padding-top:40px">
        <div class="slide-eyebrow">Strategy</div>
        <h2 class="slide-title">Win Themes</h2>
        <p class="dim-text" style="margin-top:40px">Complete the Risk Assessment to generate deal-specific win themes.</p>
      </div>
      ${footer(o.company, o.num, o.total, 'Strategy')}
    </div>`
  }

  const themes = generateWinThemes({ primary: strategy.primary, alternative: strategy.alternative }, deal.meta, assessment.axisScores)

  const angleColors: Record<string, { bg: string; border: string; label: string }> = {
    risk:        { bg: '#fef2f2', border: '#fca5a5', label: '#dc2626' },
    expertise:   { bg: '#eef2ff', border: '#c7d2fe', label: '#4f46e5' },
    commercial:  { bg: '#f0fdf4', border: '#bbf7d0', label: '#16a34a' },
    speed:       { bg: '#fff7ed', border: '#fed7aa', label: '#ea580c' },
    partnership: { bg: '#f0f9ff', border: '#bae6fd', label: '#0369a1' },
  }

  return `<div class="slide slide-white">
    <div class="slide-header-bar indigo-bar"></div>
    <div class="slide-content" style="padding-top:40px">
      <div class="slide-eyebrow">Strategy</div>
      <h2 class="slide-title">Win Themes for This Deal</h2>
      <p class="slide-sub-text">Tailored to ${e(deal.meta.workType ? wtLabel(deal.meta.workType) : deal.meta.workCategory ?? 'this engagement')} · ${e(deal.meta.industry)} · Strategy ${e(strategy.primary)}</p>
      <div class="win-themes-stack">
        ${themes.map(t => {
          const c = angleColors[t.angle] ?? angleColors.expertise
          return `<div class="wt-card" style="background:${c.bg};border:1px solid ${c.border}">
            <div class="wt-angle" style="color:${c.label}">${t.angle.charAt(0).toUpperCase() + t.angle.slice(1)}</div>
            <div class="wt-headline">${e(t.headline)}</div>
            <div class="wt-body">${e(t.body)}</div>
          </div>`
        }).join('')}
      </div>
    </div>
    ${footer(o.company, o.num, o.total, 'Strategy')}
  </div>`
}

function slideWhyUs(company: string, deal: Deal, o: SlideOpts): string {
  const { meta, assessment, strategy } = deal
  const partners = meta.technologyPartners.filter(p => p !== 'none' && p !== 'other')

  let winPoints: [string, string][] = []
  if (assessment && strategy?.primary) {
    const themes = generateWinThemes({ primary: strategy.primary, alternative: strategy.alternative }, meta, assessment.axisScores)
    winPoints = themes.slice(0, 2).map(t => [t.headline, t.body])
  }

  const basePoints: [string, string][] = [
    ['Risk-intelligent presales', 'CADEX-driven qualification — we only bid what we can deliver'],
    ['Agile-at-scale delivery', 'Structured sprints, robust governance, transparent reporting'],
    ['Transparent commercial model', 'Fixed scope, scope bank, no hidden cost transfers'],
    ...(partners.length ? [[`${partners.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(', ')} partnership`, 'Certified partner capability with access to platform credits and specialists'] as [string, string]] : []),
    ['Knowledge transfer built-in', 'All delivery includes structured KT, not just handover docs'],
  ]

  const allPoints = winPoints.length > 0
    ? [...winPoints, ...basePoints.slice(0, 4 - Math.min(winPoints.length, 2))]
    : basePoints.slice(0, 6)

  return `<div class="slide slide-dark-indigo">
    <div class="slide-content" style="padding-top:50px">
      <div class="slide-eyebrow" style="color:#a5b4fc">Why Us</div>
      <h2 class="slide-title" style="color:white;margin-bottom:32px">Why ${e(company)}</h2>
      <div class="why-us-grid">
        ${allPoints.map(([title, desc]) => `<div class="why-card">
          <div class="why-title">${e(title)}</div>
          <div class="why-desc">${e(desc)}</div>
        </div>`).join('')}
      </div>
    </div>
    ${footer(o.company, o.num, o.total, 'Why Us')}
  </div>`
}

function slideObjectionHandling(deal: Deal, o: SlideOpts): string {
  const { strategy } = deal
  const card = strategy?.primary ? STRATEGIES[strategy.primary] : null
  const categoryObjns = deal.meta.workCategory ? (OBJECTION_BANK[deal.meta.workCategory] ?? []) : []
  const objections = [
    ...(card?.objections ?? []),
    ...categoryObjns,
  ].slice(0, 3).length > 0
    ? [...(card?.objections ?? []), ...categoryObjns].slice(0, 3)
    : [
        { q: "Your price is higher than the competitor's.", a: "We price for delivery, not for the bid. A lower price that misses scope or runs over is more expensive than a realistic price that delivers. We're happy to walk through our estimate line by line." },
        { q: "We need a fixed price commitment across the full programme.", a: "We can commit firmly to Phase 1. Pricing Phase 2 before Phase 1 outputs are known introduces risk that will show up as padding or disputes. A phased commitment protects your budget and our delivery quality." },
      ]
  return `<div class="slide slide-white">
    <div class="slide-header-bar indigo-bar"></div>
    <div class="slide-content" style="padding-top:40px">
      <div class="slide-eyebrow">Why Us</div>
      <h2 class="slide-title">Anticipating Your Questions</h2>
      <div class="objection-stack">
        ${objections.map(obj => `<div class="objection-card">
          <div class="obj-q">"${e(obj.q)}"</div>
          <div class="obj-a">${e(obj.a)}</div>
        </div>`).join('')}
      </div>
    </div>
    ${footer(o.company, o.num, o.total, 'Why Us')}
  </div>`
}

function slideVerdict(deal: Deal, o: SlideOpts): string {
  const { checklist, assessment } = deal
  const verdictConfig = {
    'go':          { label: 'Go', sub: 'Submit the proposal', color: '#16a34a', bg: '#f0fdf4' },
    'conditional': { label: 'Conditional Go', sub: 'Resolve flagged items first', color: '#d97706', bg: '#fffbeb' },
    'no-go':       { label: 'No-Go', sub: 'Deal restructure required', color: '#dc2626', bg: '#fef2f2' },
  }
  const vc = checklist ? verdictConfig[checklist.verdict] : null

  return `<div class="slide slide-white">
    <div class="slide-header-bar ${vc?.color === '#16a34a' ? 'green-bar' : vc?.color === '#dc2626' ? 'red-bar' : 'amber-bar'}"></div>
    <div class="slide-content two-col" style="padding-top:40px;align-items:center">
      <div class="col-left">
        <div class="slide-eyebrow">Quality Gate</div>
        <h2 class="slide-title">Deal Checker Verdict</h2>
        ${vc ? `<div class="verdict-big-block" style="background:${vc.bg};border:2px solid ${vc.color}30">
          <div class="verdict-big-label" style="color:${vc.color}">${vc.label}</div>
          <div class="verdict-big-sub">${vc.sub}</div>
          <div class="verdict-big-score" style="color:${vc.color}">${Math.round(checklist!.overallScore)}%</div>
        </div>
        ${checklist!.hardBlockers.length > 0 ? `<div class="blocker-warning">⚠ ${checklist!.hardBlockers.length} hard blocker${checklist!.hardBlockers.length > 1 ? 's' : ''} unresolved</div>` : ''}` : '<p class="dim-text">Complete the Deal Checker to see the verdict.</p>'}
      </div>
      <div class="col-right">
        ${assessment ? `<div class="risk-score-side">
          <div class="rss-num" style="color:${BAND_COLOR[assessment.scoreBand]}">${assessment.weightedTotal}%</div>
          <div class="rss-label">Risk Score</div>
          <div class="rss-band" style="color:${BAND_COLOR[assessment.scoreBand]}">${BAND_LABEL[assessment.scoreBand]}</div>
        </div>` : ''}
      </div>
    </div>
    ${footer(o.company, o.num, o.total, 'Quality Gate')}
  </div>`
}

function slideNextSteps(deal: Deal, o: SlideOpts): string {
  const { strategy } = deal
  const card = strategy?.primary ? STRATEGIES[strategy.primary] : null
  const unknownCount = Object.values(deal.discoveryGaps ?? {}).filter(s => s === 'unknown').length
  const steps = [
    { owner: o.company, action: 'Confirm mutual interest and agree next meeting date' },
    { owner: o.company, action: 'Provide formal proposal letter with final commercial terms' },
    { owner: 'Both', action: 'Agree scope bank mechanism and change control process before signature' },
    { owner: 'Client', action: 'Confirm Product Owner availability and decision-making authority' },
    ...(unknownCount > 0 ? [{ owner: 'Both', action: `Resolve ${unknownCount} open discovery question${unknownCount > 1 ? 's' : ''} before contract signature` }] : []),
    { owner: 'Both', action: 'Initiate contract / MSA review with legal teams' },
  ]
  return `<div class="slide slide-white">
    <div class="slide-header-bar indigo-bar"></div>
    <div class="slide-content" style="padding-top:40px">
      <div class="slide-eyebrow">Next Steps</div>
      <h2 class="slide-title">Recommended Next Steps</h2>
      ${card?.close ? `<blockquote class="close-quote">${e(card.close)}</blockquote>` : ''}
      <div class="next-steps-list">
        ${steps.map((s, i) => `<div class="ns-item">
          <div class="ns-num">${String(i + 1).padStart(2, '0')}</div>
          <div class="ns-owner ${s.owner === o.company ? 'ns-us' : s.owner === 'Client' ? 'ns-client' : 'ns-both'}">${e(s.owner)}</div>
          <div class="ns-action">${e(s.action)}</div>
        </div>`).join('')}
      </div>
    </div>
    ${footer(o.company, o.num, o.total, 'Next Steps')}
  </div>`
}

function slideThankYou(deal: Deal, company: string, o: SlideOpts): string {
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  return `<div class="slide slide-cover" style="justify-content:center;align-items:center;text-align:center">
    <div class="ty-company">${e(company)}</div>
    <div class="ty-tagline">Thank you for the opportunity.</div>
    <div class="ty-deal">${e(deal.meta.name || 'Engagement Proposal')}</div>
    <div class="ty-client">Prepared for ${e(deal.meta.clientName || 'Client')} · ${today}</div>
    <div class="cover-grid-bg"></div>
    ${footer(o.company, o.num, o.total)}
  </div>`
}

// ── CSS ───────────────────────────────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

  body{font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0f172a;padding:32px 0;color:#1e293b}

  .deck{display:flex;flex-direction:column;align-items:center;gap:12px}

  .slide{width:1280px;height:720px;position:relative;overflow:hidden;flex-shrink:0;display:flex;flex-direction:column}

  /* Slide types */
  .slide-cover{background:linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%);color:white;padding:70px 80px;justify-content:space-between}
  .slide-white{background:white;color:#1e293b}
  .slide-dark-indigo{background:linear-gradient(135deg,#1e1b4b,#312e81);color:white;padding:60px 80px}
  .slide-dark-slate{background:linear-gradient(135deg,#0f172a,#1e293b);color:white;padding:60px 80px}
  .slide-dark-risk{background:linear-gradient(135deg,#1c0a0a,#450a0a,#1c0a0a);color:white;padding:60px 80px}
  .slide-dark-green{background:linear-gradient(135deg,#052e16,#14532d,#052e16);color:white;padding:60px 80px}
  .slide-section-break{color:white;padding:0;justify-content:center;align-items:flex-start;padding-left:80px;padding-bottom:60px}

  /* Header bars */
  .slide-header-bar{height:5px;width:100%;flex-shrink:0}
  .indigo-bar{background:linear-gradient(90deg,#4f46e5,#7c3aed)}
  .green-bar{background:linear-gradient(90deg,#16a34a,#059669)}
  .red-bar{background:linear-gradient(90deg,#dc2626,#9f1239)}
  .amber-bar{background:linear-gradient(90deg,#d97706,#92400e)}
  .violet-bar{background:linear-gradient(90deg,#7c3aed,#4f46e5)}

  /* Slide content */
  .slide-content{flex:1;padding:40px 70px 20px;overflow:hidden}
  .two-col{display:flex;gap:48px}
  .col-left{flex:1;min-width:0}
  .col-right{flex:1;min-width:0}

  /* Cover */
  .cover-eyebrow{font-size:11px;font-weight:700;letter-spacing:0.18em;color:#818cf8;text-transform:uppercase;margin-bottom:16px}
  .cover-title{font-size:48px;font-weight:900;line-height:1.1;color:white;margin-bottom:16px;max-width:800px}
  .cover-client{font-size:20px;color:#94a3b8;margin-bottom:28px}
  .cover-meta-row{display:flex;gap:12px;flex-wrap:wrap}
  .cover-badge{font-size:12px;font-weight:600;padding:5px 14px;border-radius:20px;background:rgba(79,70,229,0.25);color:#a5b4fc;border:1px solid rgba(99,102,241,0.3)}
  .cover-bottom{display:flex;justify-content:space-between;font-size:13px;color:#64748b;padding-top:16px;border-top:1px solid rgba(255,255,255,0.1)}
  .cover-grid-bg{position:absolute;inset:0;background-image:linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px);background-size:40px 40px;pointer-events:none}

  /* Section break */
  .section-break-num{font-size:120px;font-weight:900;opacity:0.08;position:absolute;right:80px;bottom:60px;line-height:1}
  .section-break-title{font-size:52px;font-weight:900;margin-top:200px;margin-bottom:16px;position:relative;z-index:1}
  .section-break-sub{font-size:18px;opacity:0.7;position:relative;z-index:1;max-width:500px}

  /* Eyebrow + titles */
  .slide-eyebrow{font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#6366f1;margin-bottom:8px}
  .slide-title{font-size:30px;font-weight:800;color:#0f172a;line-height:1.2;margin-bottom:20px}
  .slide-sub-text{font-size:13px;color:#64748b;margin-bottom:16px}
  .dim-text{font-size:14px;color:#94a3b8;font-style:italic}

  /* Footer */
  .slide-footer{position:absolute;bottom:0;left:0;right:0;height:36px;background:rgba(0,0,0,0.04);border-top:1px solid rgba(0,0,0,0.06);display:flex;align-items:center;justify-content:space-between;padding:0 24px;font-size:11px;color:#94a3b8}
  .slide-dark-indigo .slide-footer,.slide-dark-slate .slide-footer,.slide-dark-risk .slide-footer,.slide-dark-green .slide-footer,.slide-cover .slide-footer{background:rgba(0,0,0,0.2);border-top-color:rgba(255,255,255,0.08);color:rgba(255,255,255,0.3)}
  .footer-company{font-weight:600}
  .footer-section{color:#6366f1}
  .slide-dark-indigo .footer-section,.slide-dark-slate .footer-section,.slide-dark-risk .footer-section,.slide-dark-green .footer-section{color:#818cf8}

  /* Agenda */
  .agenda-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .agenda-item{display:flex;gap:16px;align-items:flex-start;padding:12px 16px;border:1px solid #f1f5f9;border-radius:10px}
  .agenda-num{font-size:24px;font-weight:900;color:#e2e8f0;flex-shrink:0;line-height:1}
  .agenda-title{font-size:14px;font-weight:700;color:#1e293b}
  .agenda-sub{font-size:12px;color:#64748b;margin-top:2px}

  /* Exec summary */
  .exec-summary-text{font-size:14px;color:#475569;margin-bottom:16px;line-height:1.6}
  .fact-table{border:1px solid #f1f5f9;border-radius:10px;overflow:hidden}
  .fact-row{display:flex;padding:8px 14px;border-bottom:1px solid #f8fafc}
  .fact-row:last-child{border-bottom:none}
  .fact-key{font-size:12px;color:#94a3b8;width:140px;flex-shrink:0}
  .fact-val{font-size:13px;font-weight:600;color:#1e293b}
  .score-ring-block{border:2px solid;border-radius:16px;padding:24px;text-align:center}
  .score-ring-num{font-size:52px;font-weight:900;line-height:1}
  .score-ring-label{font-size:14px;font-weight:700;margin-top:4px}
  .score-ring-sub{font-size:11px;color:#94a3b8;margin-top:4px}
  .strategy-pill-block{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px}
  .spill-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#94a3b8;margin-bottom:6px}
  .spill-name{font-size:16px;font-weight:800;color:#4f46e5}
  .spill-tag{font-size:12px;color:#64748b;font-style:italic;margin-top:4px}

  /* Understanding */
  .understanding-points{display:flex;flex-direction:column;gap:20px;margin-top:8px}
  .u-point{display:flex;gap:20px;align-items:flex-start;padding:16px 20px;background:rgba(255,255,255,0.05);border-radius:12px;border:1px solid rgba(255,255,255,0.08)}
  .u-num{font-size:28px;font-weight:900;opacity:0.6;line-height:1;flex-shrink:0}
  .u-text{font-size:15px;line-height:1.6;color:#cbd5e1}

  /* Scope */
  .scope-blurb{font-size:14px;color:#475569;margin-bottom:20px;line-height:1.6;padding:12px 16px;background:#f8fafc;border-radius:8px;border-left:3px solid #4f46e5}
  .scope-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
  .scope-item{padding:14px 16px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0}
  .scope-label{font-size:11px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px}
  .scope-value{font-size:14px;font-weight:700;color:#1e293b}

  /* Tags */
  .tag-group{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px}
  .tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600}
  .tag-indigo{background:#eef2ff;color:#4f46e5;border:1px solid #c7d2fe}
  .tag-violet{background:#f5f3ff;color:#7c3aed;border:1px solid #ddd6fe}
  .tag-green{background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0}
  .tag-red{background:#fef2f2;color:#dc2626;border:1px solid #fecaca}

  /* Geo */
  .geo-item{display:flex;align-items:center;gap:10px;font-size:13px;color:#334155;margin-bottom:8px}
  .geo-dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
  .client-dot{background:#4f46e5}
  .delivery-dot{background:#0891b2}
  .overlap-bar-wrap{margin-top:12px}
  .overlap-label{font-size:12px;color:#64748b;margin-bottom:6px}
  .bar-track{height:6px;background:#f1f5f9;border-radius:3px;overflow:hidden}
  .bar-fill{height:100%;border-radius:3px;transition:width 0.3s}

  /* Section sub headings */
  .section-sub-heading{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8;margin-bottom:10px}

  /* Strategy */
  .strategy-letter{font-size:120px;font-weight:900;color:rgba(255,255,255,0.06);line-height:1;position:absolute;right:80px;top:40px}
  .strategy-big-name{font-size:44px;font-weight:900;color:white;margin-bottom:8px}
  .strategy-tagline-big{font-size:18px;color:#94a3b8;font-style:italic;margin-bottom:28px}
  .strategy-pitch-block{font-size:15px;line-height:1.7;color:#cbd5e1;max-width:800px;padding:20px 24px;background:rgba(255,255,255,0.05);border-radius:12px;border-left:3px solid #818cf8}

  /* Key moves */
  .moves-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:24px}
  .move-card{padding:24px;background:#f8fafc;border-radius:14px;border:1px solid #e2e8f0;position:relative}
  .move-num{font-size:40px;font-weight:900;color:#e2e8f0;line-height:1;margin-bottom:12px}
  .move-text{font-size:14px;color:#334155;line-height:1.6}

  /* Why strategy */
  .rationale-list{margin-top:16px;display:flex;flex-direction:column;gap:12px}
  .rationale-item{display:flex;gap:12px;font-size:14px;color:#334155;line-height:1.5}
  .check-arrow{color:#4f46e5;font-weight:700;flex-shrink:0;margin-top:1px}
  .alt-block{background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px;margin-bottom:20px}
  .alt-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#94a3b8;margin-bottom:6px}
  .alt-name{font-size:16px;font-weight:700;color:#1e293b}
  .alt-tag{font-size:12px;color:#64748b;font-style:italic;margin-top:4px}
  .non-neg-block{margin-top:8px}
  .non-neg-card{font-size:12px;color:#334155;padding:8px 12px;border-left:2px solid #4f46e5;margin-bottom:8px;background:#f8fafc;border-radius:0 6px 6px 0;line-height:1.5}
  .non-neg-item{font-size:12px;color:#334155;padding:6px 0;border-bottom:1px solid #f1f5f9;line-height:1.5}

  /* Delivery */
  .delivery-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:20px}
  .del-card{padding:20px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px}
  .del-card-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8;margin-bottom:8px}
  .del-card-value{font-size:22px;font-weight:800;color:#0f172a}
  .del-card-warn{font-size:11px;color:#dc2626;margin-top:4px;font-weight:600}

  /* Team */
  .team-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:20px}
  .team-card{padding:16px 18px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;border-top:3px solid #4f46e5}
  .team-role{font-size:13px;font-weight:700;color:#0f172a;margin-bottom:6px}
  .team-desc{font-size:12px;color:#64748b;line-height:1.5}

  /* Timeline */
  .timeline-steps{display:flex;align-items:flex-start;gap:0;margin-top:32px}
  .timeline-step{flex:1;position:relative;padding:0 12px}
  .ts-dot{width:14px;height:14px;border-radius:50%;margin-bottom:12px;flex-shrink:0}
  .ts-connector{width:2px;height:14px;background:#e2e8f0;margin-top:0;flex-shrink:0;align-self:flex-start;margin-top:6px}
  .ts-phase{font-size:14px;font-weight:700;color:#0f172a;margin-bottom:4px}
  .ts-timing{font-size:11px;font-weight:600;color:#6366f1;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px}
  .ts-desc{font-size:12px;color:#64748b;line-height:1.5}

  /* Risk radar */
  .risk-summary-box{border:2px solid;border-radius:16px;padding:24px;text-align:center;margin-bottom:20px}
  .rsb-score{font-size:52px;font-weight:900;line-height:1}
  .rsb-band{font-size:16px;font-weight:700;margin-top:4px}
  .rsb-sub{font-size:11px;color:rgba(255,255,255,0.4);margin-top:4px}
  .critical-flag-count{font-size:14px;padding:12px 16px;background:rgba(255,255,255,0.05);border-radius:10px;display:flex;align-items:center;gap:8px}

  /* Axis bars */
  .axis-bars-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px 48px;margin-top:16px}
  .axis-bar-row{display:flex;align-items:center;gap:12px}
  .axis-bar-label{font-size:12px;color:#334155;width:160px;flex-shrink:0;font-weight:500}
  .axis-bar-track{flex:1;height:8px;background:#f1f5f9;border-radius:4px;overflow:hidden}
  .axis-bar-fill{height:100%;border-radius:4px;transition:width 0.3s}
  .axis-bar-score{font-size:13px;font-weight:700;width:30px;flex-shrink:0;text-align:right}
  .axis-legend{margin-top:20px;font-size:11px;color:#94a3b8;display:flex;align-items:center;gap:4px}
  .legend-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:4px}

  /* Assumptions */
  .assumption-table{margin-top:16px;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden}
  .at-header{display:flex;padding:8px 14px;background:#f8fafc;border-bottom:1px solid #e2e8f0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8}
  .at-row{display:flex;padding:10px 14px;border-bottom:1px solid #f1f5f9;align-items:baseline}
  .at-col-main{flex:1;font-size:13px;color:#334155;line-height:1.4}
  .at-col-impact{width:120px;flex-shrink:0;font-size:12px;text-align:right}

  /* Discovery gaps */
  .gap-summary-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:20px}
  .gap-cat-card{padding:16px 20px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px}
  .gap-cat-label{font-size:13px;font-weight:700;color:#0f172a;margin-bottom:12px}
  .gap-cat-bar-track{height:8px;background:#e2e8f0;border-radius:4px;margin-bottom:8px;overflow:hidden}
  .gap-cat-bar{height:100%;border-radius:4px;transition:width 0.3s}
  .gap-cat-stats{font-size:12px}

  /* Commercial */
  .commercial-big-numbers{display:flex;gap:48px;margin-top:24px;margin-bottom:24px}
  .comm-num-block{text-align:center}
  .comm-big{font-size:52px;font-weight:900;color:white;line-height:1}
  .comm-label{font-size:13px;color:rgba(255,255,255,0.5);margin-top:6px}
  .comm-model-row{display:flex;gap:0;border:1px solid rgba(255,255,255,0.1);border-radius:12px;overflow:hidden}
  .comm-model-item{flex:1;padding:14px 18px;border-right:1px solid rgba(255,255,255,0.1)}
  .comm-model-item:last-child{border-right:none}
  .cmi-label{display:block;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:rgba(255,255,255,0.4);margin-bottom:4px}
  .cmi-value{display:block;font-size:14px;font-weight:700;color:white}

  /* Contract */
  .contract-value{font-size:20px;font-weight:800;color:#0f172a;margin-bottom:16px}
  .contract-principle{font-size:13px;color:#334155;padding:7px 0;border-bottom:1px solid #f1f5f9;line-height:1.5}

  /* Deal levers */
  .levers-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:16px}
  .lever-card{padding:16px 20px;border:1px solid #e2e8f0;border-radius:12px;background:#fafafa}
  .lever-cat{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:6px}
  .lever-title{font-size:14px;font-weight:700;color:#0f172a;margin-bottom:6px}
  .lever-action{font-size:12px;color:#64748b;line-height:1.5;margin-bottom:8px}
  .lever-contract-text{font-size:11px;color:#4f46e5;background:#eef2ff;padding:6px 10px;border-radius:6px;font-style:italic;line-height:1.4}

  /* Compliance */
  .compliance-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:20px}
  .comp-block{padding:20px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px}
  .comp-value{font-size:15px;font-weight:700;color:#1e293b;margin-top:8px}

  /* Why us */
  .why-us-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
  .why-card{padding:20px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:12px}
  .why-title{font-size:14px;font-weight:700;color:white;margin-bottom:8px}
  .why-desc{font-size:12px;color:#94a3b8;line-height:1.5}

  /* Objections */
  .objection-stack{display:flex;flex-direction:column;gap:20px;margin-top:20px}
  .objection-card{padding:20px 24px;border:1px solid #e2e8f0;border-radius:14px;background:#f8fafc}
  .obj-q{font-size:15px;font-weight:700;color:#0f172a;margin-bottom:12px;padding-bottom:12px;border-bottom:1px solid #e2e8f0}
  .obj-a{font-size:13px;color:#475569;line-height:1.65}

  /* Verdict */
  .verdict-big-block{border-radius:16px;padding:28px 32px;margin-top:16px}
  .verdict-big-label{font-size:28px;font-weight:900;margin-bottom:4px}
  .verdict-big-sub{font-size:13px;opacity:0.7}
  .verdict-big-score{font-size:64px;font-weight:900;line-height:1;margin-top:12px}
  .blocker-warning{font-size:13px;font-weight:700;color:#dc2626;margin-top:12px;padding:8px 12px;background:#fef2f2;border-radius:8px}
  .risk-score-side{text-align:center;padding:32px}
  .rss-num{font-size:80px;font-weight:900;line-height:1}
  .rss-label{font-size:13px;color:#64748b;margin-top:8px}
  .rss-band{font-size:16px;font-weight:700;margin-top:4px}

  /* Next steps */
  .close-quote{font-size:13px;color:#64748b;border-left:3px solid #4f46e5;padding:10px 16px;background:#f8fafc;border-radius:0 8px 8px 0;margin-bottom:20px;font-style:italic;line-height:1.6}
  .next-steps-list{display:flex;flex-direction:column;gap:10px}
  .ns-item{display:flex;gap:16px;align-items:center;padding:10px 16px;background:#f8fafc;border-radius:10px;border:1px solid #f1f5f9}
  .ns-num{font-size:20px;font-weight:900;color:#e2e8f0;width:32px;flex-shrink:0}
  .ns-owner{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;width:90px;flex-shrink:0;padding:3px 8px;border-radius:20px;text-align:center}
  .ns-us{background:#eef2ff;color:#4f46e5}
  .ns-client{background:#fef3c7;color:#92400e}
  .ns-both{background:#f0f9ff;color:#0369a1}
  .ns-action{font-size:13px;color:#334155;flex:1}

  /* Scope Q&A */
  .scope-qa-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px}
  .sqa-item{padding:14px 16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px}
  .sqa-item.sqa-risk{border-color:#fca5a5;background:#fef9f9}
  .sqa-label{font-size:11px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px}
  .sqa-value{font-size:14px;font-weight:700;color:#0f172a}
  .sqa-risk-note{font-size:11px;color:#dc2626;margin-top:6px;font-weight:500}

  /* Win themes */
  .win-themes-stack{display:flex;flex-direction:column;gap:16px;margin-top:16px}
  .wt-card{padding:18px 22px;border-radius:12px}
  .wt-angle{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:6px}
  .wt-headline{font-size:15px;font-weight:800;color:#0f172a;margin-bottom:6px}
  .wt-body{font-size:13px;color:#475569;line-height:1.55}

  /* Thank you */
  .ty-company{font-size:14px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#818cf8;margin-bottom:20px;position:relative;z-index:1}
  .ty-tagline{font-size:40px;font-weight:900;color:white;margin-bottom:12px;position:relative;z-index:1}
  .ty-deal{font-size:20px;color:#94a3b8;margin-bottom:8px;position:relative;z-index:1}
  .ty-client{font-size:14px;color:#64748b;position:relative;z-index:1}

  /* Print */
  @media print {
    @page { size: A4 landscape; margin: 0 }
    body { background: white; padding: 0 }
    .deck { gap: 0; align-items: stretch }
    .slide { width: 100%; height: 100vh; page-break-after: always; page-break-inside: avoid; flex-shrink: 0 }
  }
`

// ── Main export function ───────────────────────────────────────

export function generateProposalHtml(deal: Deal, companyName: string): string {
  const assumptions = deal.assumptions ?? []
  const discoveryGaps = deal.discoveryGaps ?? {}

  // Re-attach so slide builders can access them safely
  const safeDeal: Deal = { ...deal, assumptions, discoveryGaps }

  const TOTAL = 34

  const mkOpts = (num: number, section = ''): SlideOpts => ({ company: companyName, num, total: TOTAL, section })

  const sectionBreakColors: Record<string, string> = {
    Understanding: 'linear-gradient(135deg,#0f172a,#1e1b4b)',
    Strategy:      'linear-gradient(135deg,#1e1b4b,#312e81)',
    Delivery:      'linear-gradient(135deg,#052e16,#166534)',
    Risk:          'linear-gradient(135deg,#1c0a0a,#7f1d1d)',
    Commercial:    'linear-gradient(135deg,#022c22,#14532d)',
    Compliance:    'linear-gradient(135deg,#1e1b4b,#4c1d95)',
    WhyUs:         'linear-gradient(135deg,#0c0a09,#1c1917)',
    Close:         'linear-gradient(135deg,#0f172a,#0f172a)',
  }

  const slides = [
    slideCover(safeDeal, mkOpts(1)),
    slideAgenda(safeDeal, mkOpts(2)),
    slideExecSummary(safeDeal, mkOpts(3, 'Executive Summary')),
    slideSectionBreak('01', 'Understanding', 'Our interpretation of your requirements', sectionBreakColors.Understanding, mkOpts(4)),
    slideUnderstanding(safeDeal, mkOpts(5, 'Understanding')),
    slideScopeOfWork(safeDeal, mkOpts(6, 'Understanding')),
    slideScopeContext(safeDeal, mkOpts(7, 'Understanding')),   // NEW — scope Q&A answers
    slideTechContext(safeDeal, mkOpts(8, 'Understanding')),
    slideSectionBreak('02', 'Strategy', 'Recommended engagement model and approach', sectionBreakColors.Strategy, mkOpts(9)),
    slideStrategy(safeDeal, mkOpts(10, 'Strategy')),
    slideWinThemes(safeDeal, mkOpts(11, 'Strategy')),          // NEW — deal-specific win themes
    slideKeyMoves(safeDeal, mkOpts(12, 'Strategy')),
    slideWhyStrategy(safeDeal, mkOpts(13, 'Strategy')),
    slideSectionBreak('03', 'Delivery', 'How we will deliver this engagement', sectionBreakColors.Delivery, mkOpts(14)),
    slideDeliveryModel(safeDeal, mkOpts(15, 'Delivery')),
    slideTeamGovernance(safeDeal, mkOpts(16, 'Delivery')),
    slideSprintCadence(safeDeal, mkOpts(17, 'Delivery')),
    slideSectionBreak('04', 'Risk', 'Risk assessment, assumptions, and open items', sectionBreakColors.Risk, mkOpts(18)),
    slideRiskRadar(safeDeal, mkOpts(19, 'Risk')),
    slideRiskDimensions(safeDeal, mkOpts(20, 'Risk')),
    slideAssumptions(safeDeal, mkOpts(21, 'Risk')),
    slideDiscoveryGaps(safeDeal, mkOpts(22, 'Risk')),
    slideSectionBreak('05', 'Commercial', 'Pricing, contract structure, and deal terms', sectionBreakColors.Commercial, mkOpts(23)),
    slideCommercial(safeDeal, mkOpts(24, 'Commercial')),
    slideContractStructure(safeDeal, mkOpts(25, 'Commercial')),
    slideDealProtections(safeDeal, mkOpts(26, 'Commercial')),
    slideSectionBreak('06', 'Compliance', 'Regulatory requirements and security posture', sectionBreakColors.Compliance, mkOpts(27)),
    slideCompliance(safeDeal, mkOpts(28, 'Compliance')),
    slideSectionBreak('07', `Why ${companyName}`, 'Our capabilities and differentiators', sectionBreakColors.WhyUs, mkOpts(29)),
    slideWhyUs(companyName, safeDeal, mkOpts(30, 'Why Us')),
    slideObjectionHandling(safeDeal, mkOpts(31, 'Why Us')),
    slideVerdict(safeDeal, mkOpts(32, 'Close')),
    slideNextSteps(safeDeal, mkOpts(33, 'Close')),
    slideThankYou(safeDeal, companyName, mkOpts(34)),
  ]

  const doc = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1280">
  <title>${e(deal.meta.name || 'Proposal')} — ${e(companyName)}</title>
  <style>${CSS}</style>
</head>
<body>
  <div class="deck">
    ${slides.join('\n')}
  </div>
</body>
</html>`

  return doc
}
