// ============================================================
// CADEX — Win Theme Engine
// Generates 3 win themes for a deal based on strategy,
// work type, competitive situation, and axis scores.
// ============================================================

import type { AxisScores, CompetitiveSituation, Industry, StrategyId } from '../types'

export interface WinTheme {
  id: string
  headline: string   // 6-12 word punchy title
  body: string       // 2 sentences: what we do + why it matters for this deal
  angle: 'risk' | 'expertise' | 'commercial' | 'speed' | 'partnership'
}

interface ThemeEntry extends WinTheme {
  strategies?: StrategyId[]
  workCategories?: string[]        // L2 work category IDs
  competitive?: CompetitiveSituation[]
  industries?: Industry[]
  minAxis?: Partial<Record<keyof AxisScores, number>>  // axis must be >= this
  maxAxis?: Partial<Record<keyof AxisScores, number>>  // axis must be <= this
}

const THEME_BANK: ThemeEntry[] = [
  // ── Risk-angle themes ──────────────────────────────────────

  {
    id: 'wt-discovery-gate',
    headline: 'Paid discovery phase eliminates fixed-price risk',
    body: 'We propose a time-boxed, fixed-price discovery sprint before any build commitment — so the price you approve is based on validated scope, not assumptions. This model has consistently delivered on-budget outcomes for clients where requirement confidence is below 80%.',
    strategies: ['A'],
    angle: 'risk',
  },
  {
    id: 'wt-phased-commitment',
    headline: 'Phase 1 delivery builds the evidence base for Phase 2 pricing',
    body: 'By committing firmly to Phase 1 and conditionally pricing Phase 2 using Phase 1 velocity data, both parties share the risk of scope evolution rather than one side absorbing it. This structure has never produced a budget overrun on our comparable programmes.',
    strategies: ['B'],
    angle: 'risk',
  },
  {
    id: 'wt-scope-bank',
    headline: 'Scope bank mechanism prevents fixed-price disputes',
    body: 'Our fixed-agile model includes a contractual scope swap mechanism — Must-Haves are locked, Should-Haves are swappable at equal effort. This eliminates the most common cause of fixed-price disputes at the 70% delivery mark.',
    strategies: ['B', 'D'],
    angle: 'risk',
  },
  {
    id: 'wt-no-surprise-spend',
    headline: 'Weekly T&M spend reporting with hard cap protection',
    body: 'Our T&M-capped model provides full spend transparency via weekly reporting and a contractually protected ceiling — you pay for actual work, never for padding. Scope prioritisation decisions stay with you at every sprint.',
    strategies: ['E'],
    angle: 'risk',
  },
  {
    id: 'wt-legacy-risk-pricing',
    headline: 'Legacy complexity pricing model protects both parties',
    body: 'We price brownfield engagements with an explicit technical discovery contingency line item and a contractual discovery-to-replan gate — so legacy surprises become a defined process, not a dispute. Our legacy exposure track record shows 94% of discovery findings remain within the contingency band.',
    workCategories: ['bf-modernisation', 'bf-migration', 'bf-integration'],
    angle: 'risk',
  },
  {
    id: 'wt-erp-process-first',
    headline: 'Business process design before configuration eliminates ERP rework',
    body: 'We enforce a process-freeze gate before any system configuration begins, backed by a signed-off process blueprint from the business — not just IT. This prevents the most common ERP overrun pattern: rebuilding in Sprint 12 what was decided incorrectly in Sprint 2.',
    workCategories: ['gf-erp'],
    angle: 'risk',
  },
  {
    id: 'wt-security-legal-first',
    headline: 'Engagement letter and legal scope control before first test',
    body: 'All penetration testing and security assessment work begins only after a fully executed engagement letter defining systems in scope, exclusion zones, and remediation ownership — eliminating the legal exposure that unscoped security testing creates.',
    workCategories: ['bf-security'],
    angle: 'risk',
  },
  {
    id: 'wt-genai-guardrails',
    headline: 'GenAI delivery with built-in hallucination governance',
    body: 'Our GenAI delivery model includes output quality gates, model evaluation frameworks, and explainability documentation as standard — not optional extras. We have delivered GenAI applications in regulated industries where output liability was a contractual requirement.',
    workCategories: ['gf-ai'],
    angle: 'risk',
  },

  // ── Expertise-angle themes ─────────────────────────────────

  {
    id: 'wt-sap-coe',
    headline: 'Dedicated SAP CoE with active S/4HANA delivery track record',
    body: 'Our SAP Centre of Excellence has active S/4HANA programmes across finance, supply chain, and HR modules — with certified architects and a reusable accelerator library that reduces configuration effort by 20–30%. Reference clients available on request.',
    workCategories: ['gf-erp'],
    angle: 'expertise',
  },
  {
    id: 'wt-cloud-native-platform',
    headline: 'Cloud-native platform engineering with production reference architectures',
    body: 'We deploy proven reference architectures for AWS, Azure, and GCP — covering container orchestration, service mesh, and GitOps pipelines — backed by architects who hold active cloud certifications and have delivered comparable platforms at scale.',
    workCategories: ['gf-platform'],
    angle: 'expertise',
  },
  {
    id: 'wt-data-engineering',
    headline: 'End-to-end data engineering from ingestion to governance',
    body: 'Our data practice covers pipeline engineering, lakehouse architecture, semantic layer design, and data governance tooling — with delivery experience on Snowflake, Databricks, BigQuery, and Azure Synapse. We treat data quality as a first-class deliverable, not a backlog item.',
    workCategories: ['gf-data', 'bf-ai'],
    angle: 'expertise',
  },
  {
    id: 'wt-security-posture',
    headline: 'Cybersecurity engineering embedded in delivery, not bolted on',
    body: 'Our security practice spans VAPT, IAM, SIEM, and cloud posture management — with practitioners who hold OSCP, CISSP, and cloud security certifications. We integrate security controls into the delivery pipeline rather than conducting one-off assessments after go-live.',
    workCategories: ['bf-security'],
    angle: 'expertise',
  },
  {
    id: 'wt-ux-design-system',
    headline: 'Design system architecture that scales beyond this project',
    body: 'Our UX practice builds reusable component libraries and design tokens alongside every digital experience engagement — so the design system becomes a long-term asset, not a one-project artefact. We use Figma as the source of truth with direct code-component mapping.',
    workCategories: ['gf-dx'],
    angle: 'expertise',
  },
  {
    id: 'wt-agile-coaching',
    headline: 'Embedded agile coaching accelerates client team capability',
    body: 'Our delivery model includes embedded agile coaching as a standard practice — not a premium add-on. Sprint reviews, retrospectives, and backlog grooming are facilitated by certified scrum practitioners who upskill the client team in parallel with delivery.',
    angle: 'expertise',
    industries: ['bfsi', 'healthcare', 'public-sector'],
  },
  {
    id: 'wt-qa-shift-left',
    headline: 'Shift-left quality model reduces defect cost by 5x',
    body: 'Our QA practice integrates test automation, SAST, and DAST into the CI/CD pipeline from Sprint 1 — eliminating the test crunch that typically occurs in the final 20% of a delivery. Our managed QA track record shows an average 65% reduction in post-release defects.',
    workCategories: ['gf-quality', 'bf-testing'],
    angle: 'expertise',
  },
  {
    id: 'wt-migration-factory',
    headline: 'Migration factory model with proven volume throughput',
    body: 'Our migration practice operates a factory model for cloud, data, and ERP migrations — with pre-built validation frameworks, automated rollback mechanisms, and a cutover simulation process that has achieved zero data loss on all migrations exceeding 1TB.',
    workCategories: ['bf-migration'],
    angle: 'expertise',
  },

  // ── Commercial-angle themes ────────────────────────────────

  {
    id: 'wt-outcome-alignment',
    headline: 'Outcome-based commercial model aligns incentives completely',
    body: 'Our performance fee structure ties our upside to your business results — we earn the premium only when the agreed KPI is achieved within the measurement window. This model is available because we are confident in our delivery capability.',
    strategies: ['C'],
    angle: 'commercial',
  },
  {
    id: 'wt-open-book-margin',
    headline: 'Open-book cost model with transparent rate card',
    body: 'Our rate card and team composition are fully transparent — you see the blended rate, the role mix, and the margin. This model gives you the commercial confidence to approve the budget without second-guessing what is inside the price.',
    competitive: ['open'],
    angle: 'commercial',
  },
  {
    id: 'wt-phase2-expansion',
    headline: 'Phase 1 is the platform for a defined Phase 2 roadmap',
    body: 'Our proposal includes a clearly mapped Phase 2 expansion path — not a vague "there is more to do" footnote. The Phase 2 scope, indicative price, and activation conditions are defined in the proposal so your budget team can plan ahead.',
    angle: 'commercial',
  },
  {
    id: 'wt-roi-quantification',
    headline: 'Quantified ROI model with conservative and optimistic scenarios',
    body: 'Our proposal includes a business case model showing the financial return on this investment under conservative, base, and optimistic delivery assumptions. We use your own operational data — not benchmark proxies — to build a credible ROI number.',
    industries: ['bfsi', 'healthcare', 'manufacturing'],
    angle: 'commercial',
  },
  {
    id: 'wt-low-risk-entry',
    headline: 'Low-risk engagement entry with no upfront commitment risk',
    body: 'Our discovery phase model means your initial commitment is time-boxed and fixed-price — you can review the outputs and decide whether to proceed before any significant budget is committed. This is a no-surprise entry into the engagement.',
    strategies: ['A', 'B'],
    angle: 'commercial',
  },
  {
    id: 'wt-ams-transition',
    headline: 'Delivery-to-AMS commercial continuity eliminates transition cost',
    body: 'Our AMS practice transitions directly from the delivery team, with no knowledge transfer gap or re-onboarding cost. The team that built the system operates it — eliminating the most common post-go-live cost surprise.',
    workCategories: ['bf-ams'],
    angle: 'commercial',
  },

  // ── Speed-angle themes ─────────────────────────────────────

  {
    id: 'wt-accelerator-library',
    headline: 'Reusable accelerators reduce time-to-first-sprint by 4 weeks',
    body: 'Our practice maintains a library of pre-built accelerators — authentication modules, CI/CD pipelines, monitoring configurations, and integration connectors — that are available immediately at project start, reducing inception effort and accelerating first-sprint velocity.',
    workCategories: ['gf-platform', 'gf-pe', 'gf-dx'],
    angle: 'speed',
  },
  {
    id: 'wt-nearshore-overlap',
    headline: 'Nearshore model maximises overlap hours without cost premium',
    body: 'Our hybrid nearshore model provides 6+ hours of daily overlap with your team — enabling same-day feedback cycles without the cost premium of onshore staffing. Sprint reviews happen in your business day, not in yours tomorrow morning.',
    angle: 'speed',
  },
  {
    id: 'wt-rapid-mobilisation',
    headline: 'Named delivery lead available for mobilisation within 2 weeks',
    body: 'Our delivery lead for this engagement is identified and available — not dependent on a future hire or an internal competition for resources. We can mobilise a complete delivery team within 2 weeks of contract signature.',
    minAxis: { VF: 4 },
    angle: 'speed',
  },
  {
    id: 'wt-mvp-workshop',
    headline: 'MoSCoW scope workshop delivers a signed MVP in one day',
    body: 'Our pre-contract scope workshop produces a MoSCoW-categorised, signed-off MVP feature list in a single facilitated day — eliminating the weeks of email-based requirements discussion that typically precede project start. This becomes the contractual scope exhibit.',
    strategies: ['D'],
    angle: 'speed',
  },

  // ── Partnership-angle themes ───────────────────────────────

  {
    id: 'wt-executive-sponsorship',
    headline: 'Executive sponsor engagement from day one, not escalation',
    body: 'Our account model includes executive sponsor involvement in the initial engagement design and the first steering committee — not just when something goes wrong. This signals commitment at a level that changes how the client team treats the delivery relationship.',
    strategies: ['C'],
    competitive: ['sole-source', 'preferred'],
    angle: 'partnership',
  },
  {
    id: 'wt-joint-innovation',
    headline: 'Joint innovation programme alongside core delivery',
    body: 'We propose a lightweight innovation track running in parallel with delivery — a quarterly technology review, a joint IP register, and an innovation backlog — so the relationship generates future value beyond the current contract.',
    industries: ['tech', 'bfsi'],
    strategies: ['C'],
    angle: 'partnership',
  },
  {
    id: 'wt-incumbent-continuity',
    headline: 'Incumbent knowledge preserved through structured transition',
    body: 'Our transition model includes a structured knowledge capture phase that preserves what the current vendor knows — not just the code, but the business rules, operational decisions, and undocumented behaviours. We treat incumbent knowledge as an asset, not a liability.',
    competitive: ['preferred'],
    angle: 'partnership',
  },
  {
    id: 'wt-bfsi-regulatory',
    headline: 'Regulatory change pipeline visibility from day one',
    body: 'Our BFSI practice maintains an active regulatory change tracker covering FCA, RBI, DPDP, GDPR, and PCI-DSS — and we brief our active clients quarterly on changes that affect their architecture. Regulatory alignment is built into the delivery model, not retrofitted.',
    industries: ['bfsi'],
    angle: 'partnership',
  },
  {
    id: 'wt-public-sector-transparency',
    headline: 'Public sector delivery model with full transparency and audit trail',
    body: 'Our public sector delivery model includes monthly progress reports formatted for ministerial briefing, an accessible RAID log, and an audit-ready documentation trail. We understand that public accountability is not optional in this sector.',
    industries: ['public-sector'],
    angle: 'partnership',
  },
  {
    id: 'wt-healthcare-clinical-alignment',
    headline: 'Clinical governance embedded in technical delivery process',
    body: 'Our healthcare practice includes clinical informatics advisors who review technical designs for clinical risk before architecture sign-off — not after. We have delivered HIPAA-compliant and GDPR-regulated healthcare platforms and understand that patient safety is a first-class non-functional requirement.',
    industries: ['healthcare'],
    angle: 'partnership',
  },
]

// ── Selection function ─────────────────────────────────────

export function generateWinThemes(
  strategyResult: { primary: StrategyId; alternative?: StrategyId },
  meta: { workCategory: string; competitiveSituation: CompetitiveSituation; industry: Industry },
  axisScores: AxisScores,
): WinTheme[] {
  const activeStrategies = [
    strategyResult.primary,
    ...(strategyResult.alternative ? [strategyResult.alternative] : []),
  ]

  // Score each theme
  const scored = THEME_BANK.map((theme) => {
    let score = 0

    // Strategy match: +3
    if (theme.strategies && theme.strategies.some((s) => activeStrategies.includes(s))) {
      score += 3
    }

    // Work category match: +3
    if (theme.workCategories && theme.workCategories.includes(meta.workCategory)) {
      score += 3
    }

    // Competitive match: +2
    if (theme.competitive && theme.competitive.includes(meta.competitiveSituation)) {
      score += 2
    }

    // Industry match: +2
    if (theme.industries && theme.industries.includes(meta.industry)) {
      score += 2
    }

    // Axis minAxis: +1 per axis satisfied
    if (theme.minAxis) {
      for (const [axis, min] of Object.entries(theme.minAxis) as [keyof AxisScores, number][]) {
        if (axisScores[axis] >= min) {
          score += 1
        }
      }
    }

    // Axis maxAxis: +1 per axis satisfied
    if (theme.maxAxis) {
      for (const [axis, max] of Object.entries(theme.maxAxis) as [keyof AxisScores, number][]) {
        if (axisScores[axis] <= max) {
          score += 1
        }
      }
    }

    return { theme, score }
  })

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score)

  // Select top 3 with angle diversity (no 3 themes of same angle),
  // always trying to include at least one 'risk' theme
  const selected: ThemeEntry[] = []
  const usedAngles = new Set<WinTheme['angle']>()

  // First pass: pick the highest-scoring themes while enforcing angle diversity
  for (const { theme } of scored) {
    if (selected.length >= 3) break

    // Allow at most 2 of the same angle (prevents 3 identical angles)
    const angleCount = selected.filter((t) => t.angle === theme.angle).length
    if (angleCount >= 2) continue

    selected.push(theme)
    usedAngles.add(theme.angle)
  }

  // Guarantee at least one risk theme if none selected
  if (!usedAngles.has('risk') && selected.length > 0) {
    const bestRisk = scored.find(({ theme }) => theme.angle === 'risk')
    if (bestRisk) {
      // Replace the last selected theme with the best risk theme (lowest priority slot)
      selected[selected.length - 1] = bestRisk.theme
    }
  }

  // Strip internal fields and return as WinTheme[]
  return selected.map(({ id, headline, body, angle }) => ({ id, headline, body, angle }))
}
