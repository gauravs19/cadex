// ============================================================
// CADEX — Work Type Profiles: AI / Analytics on Existing Systems
// ============================================================

import type { WorkTypeProfile } from '../../types'

export const BF_AI_PROFILES: WorkTypeProfile[] = [

  // ── ai-layer: AI Layer on Existing Product ───────────────────

  {
    workTypeId: 'ai-layer',
    axisModifiers: { SC: 1.3, CM: 1.3, TC: 1.3, CR: 1.1 },
    questions: [
      {
        id: 'WT-BAI-L1',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'TC',
        text: 'Is the existing product\'s data pipeline — ingestion quality, feature availability, labelling, and inference latency path — assessed and ready to support an AI layer?',
        scaleLabels: [
          'No data assessment done; AI layer expected to work with whatever data exists',
          'Data exists but quality, coverage, and latency not evaluated; major gaps likely',
          'Data assessed at high level; quality issues identified but not quantified or scoped',
          'Data readiness assessment complete; gaps identified and scoped as pre-conditions',
          'Data pipeline fully validated; inference latency path designed; feature store or serving layer agreed'
        ],
        coachingTip: 'Bolting an AI layer onto a product with poor data infrastructure produces an unreliable feature, not a capability. A data readiness assessment is not optional scope — it determines whether the AI project is feasible at all.',
        triggerWorkTypes: ['ai-layer', 'bf-ai-other'],
      },
      {
        id: 'WT-BAI-L2',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'SC',
        text: 'Are model performance expectations — accuracy, false positive/negative tolerance, and the business consequence of wrong predictions — explicitly agreed and contractually reasonable?',
        scaleLabels: [
          'No performance expectations defined; accuracy assumed to be "better than manual"',
          'Informal expectation ("around 90%") with no tolerance definition or business impact analysis',
          'Targets proposed; false positive/negative tolerance discussed but not contractually defined',
          'Performance targets agreed with tolerance bands; business consequence of failures documented',
          'Performance targets, tolerances, and measurement methodology contractually defined and baselined'
        ],
        coachingTip: 'A 95% accurate model that gets the wrong 5% on high-value decisions can be worse than no model. Define the acceptable false positive and false negative rates before build — the business impact of each error type determines what "good enough" means.',
        triggerWorkTypes: ['ai-layer', 'bf-ai-other'],
      },
      {
        id: 'WT-BAI-L3',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'CM',
        text: 'Does the client have a process for reviewing, validating, and acting on AI-generated outputs — including a human-in-the-loop escalation path for low-confidence predictions?',
        scaleLabels: [
          'No review process; AI output expected to be actioned automatically in all cases',
          'Human review acknowledged as needed but no process, tooling, or escalation designed',
          'Review process discussed; human-in-loop threshold undefined; tooling not selected',
          'Review process designed; confidence thresholds defined; escalation path documented',
          'Full human-in-loop workflow deployed; confidence thresholds tested; escalation SLA agreed'
        ],
        coachingTip: 'AI without a human review process for low-confidence outputs creates liability. Define the confidence threshold below which a human must review, and make that workflow a contractual acceptance criterion before the model goes live.',
        triggerWorkTypes: ['ai-layer', 'bf-ai-other'],
      },
    ],
  },

  // ── ai-predictive: Predictive Analytics on Existing Data ────

  {
    workTypeId: 'ai-predictive',
    axisModifiers: { SC: 1.3, TC: 1.3, CM: 1.2 },
    questions: [
      {
        id: 'WT-BAI-P1',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'TC',
        text: 'Is historical data of sufficient depth, breadth, and labelling quality available — with a confirmed data access route and no legal or consent barriers to model training?',
        scaleLabels: [
          'Historical data existence unconfirmed; legal access and consent not assessed',
          'Data exists but access requires legal approval; quality and depth unknown',
          'Data accessible; legal access confirmed; quality and labelling gaps partially assessed',
          'Data assessed; access confirmed; quality issues scoped; labelling plan agreed',
          'Full data audit complete; access confirmed; labelling done; model training feasibility validated'
        ],
        coachingTip: 'Predictive models trained on biased, incomplete, or illegally sourced historical data are a reputational and legal liability. Confirm data access rights and quality before any model development begins — not during sprint 3.',
        triggerWorkTypes: ['ai-predictive'],
      },
      {
        id: 'WT-BAI-P2',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'SC',
        text: 'Are the prediction targets — what is being predicted, for whom, at what frequency, and how the output will be consumed — agreed with the business stakeholders who will act on them?',
        scaleLabels: [
          'Prediction targets undefined; project scope is "use AI to improve the business"',
          'Target described loosely ("predict churn") but use case, frequency, and consumer unspecified',
          'Target defined; consumer identified; frequency and output format under discussion',
          'Prediction target, frequency, output format, and consumer workflow documented',
          'Full prediction use case agreed; downstream workflow designed; model output integrated into process'
        ],
        coachingTip: 'Predictive models nobody acts on are expensive dashboards. Define the prediction target, who receives it, how it changes their behaviour, and what "better" looks like for the business — before training a single model.',
        triggerWorkTypes: ['ai-predictive'],
      },
    ],
  },

  // ── ai-rpa: Process Automation (RPA / Intelligent Automation) ─

  {
    workTypeId: 'ai-rpa',
    axisModifiers: { SC: 1.3, TC: 1.2, CR: 1.1 },
    questions: [
      {
        id: 'WT-BAI-R1',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'SC',
        text: 'Are the target processes fully documented — including all decision branches, exception paths, and manual overrides — before automation design begins?',
        scaleLabels: [
          'Processes documented at high level only; exceptions and variations unknown',
          'Main process flow documented; exception handling and edge cases not mapped',
          'Core flow and main exceptions mapped; edge cases partially identified',
          'Full process map including exceptions; manual override scenarios documented',
          'End-to-end process map validated with process owners; all exceptions scoped and agreed'
        ],
        coachingTip: 'RPA scope grows when undocumented process variations are discovered after automation starts. Map the process at exception level before design — the edge cases are where 60% of the effort hides.',
        triggerWorkTypes: ['ai-rpa'],
      },
      {
        id: 'WT-BAI-R2',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'TC',
        text: 'Are the target systems stable, API-accessible, and unlikely to undergo UI or schema changes during the automation delivery period?',
        scaleLabels: [
          'Target systems in active development; UI and schema changes expected during delivery',
          'Some systems stable but key targets undergoing changes; impact not assessed',
          'Most systems stable; one or two planned changes; impact being assessed',
          'Systems stable for the delivery period; change freeze agreed or change impact documented',
          'All target systems stable, API-first, with confirmed change freeze during delivery'
        ],
        coachingTip: 'RPA built against changing UIs breaks constantly and becomes maintenance overhead rather than automation value. Confirm system stability and ideally an API-first integration approach before committing to automation scope.',
        triggerWorkTypes: ['ai-rpa'],
      },
    ],
  },

  // ── ai-aiops: Observability / AIOps ─────────────────────────

  {
    workTypeId: 'ai-aiops',
    axisModifiers: { TC: 1.3, GR: 1.2, SC: 1.1 },
    questions: [
      {
        id: 'WT-BAI-O1',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'TC',
        text: 'Is telemetry instrumentation coverage across all in-scope services confirmed — including log formats, metric cardinality, distributed trace propagation, and data volume estimates?',
        scaleLabels: [
          'No instrumentation audit done; telemetry assumed to be available and sufficient',
          'Some services instrumented but coverage, format consistency, and volume unknown',
          'Instrumentation audit in progress; coverage gaps identified but not fully mapped',
          'Coverage assessment complete; gaps scoped as workstream; format standardisation agreed',
          'Full instrumentation audit done; coverage confirmed; volume estimated; schema standardised'
        ],
        coachingTip: 'AIOps tools produce noise, not insight, when built on inconsistent or incomplete telemetry. An instrumentation audit is the first deliverable — not an assumption. Treat telemetry gaps as fixed scope, not the customer\'s problem after launch.',
        triggerWorkTypes: ['ai-aiops'],
      },
      {
        id: 'WT-BAI-O2',
        section: 'W',
        sectionTitle: 'Work-Type Specific',
        axis: 'GR',
        text: 'Is there a named operations team who will own alert tuning, runbook maintenance, and AIOps model retraining — and are they embedded in delivery from the start?',
        scaleLabels: [
          'No ops team identified; observability platform expected to run itself',
          'Ops team exists but not engaged in delivery; tuning and ownership post-launch undefined',
          'Ops team identified; participation planned but not formalised; runbook ownership unclear',
          'Ops team embedded in delivery; alert tuning process agreed; runbook ownership defined',
          'Ops team co-developing runbooks; alert tuning workflow in place; retraining cadence agreed'
        ],
        coachingTip: 'An observability platform deployed without an owner generates alert fatigue within 3 months and gets switched off. Make ops team embedding from sprint 1 and runbook ownership a contractual acceptance criterion.',
        triggerWorkTypes: ['ai-aiops'],
      },
    ],
  },
]
