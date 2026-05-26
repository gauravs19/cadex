// ============================================================
// CADEX — Deal Store (Zustand)
// Central state management with localStorage persistence.
// ============================================================

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type {
  AssumptionImpact,
  AxisScores,
  CheckState,
  Deal,
  DealMeta,
  DiscoveryGapStatus,
} from '../types'
import { QUESTIONS } from '../data/questions'
import {
  computeAxisScores,
  applyScopeAnswerImpacts,
  computeWeightedTotal,
  getScoreBand,
  getCriticalFlags,
} from '../lib/scorer'
import { WORK_TYPE_SCOPE_BLOCKS } from '../data/workTypeScopeQuestions'
import { selectStrategy } from '../lib/strategySelector'
import { getPrioritisedLevers } from '../lib/shaperEngine'
import { calcOverlapHours } from '../lib/timezoneCalc'
import { computeCheckerResult } from '../lib/checkerEngine'

// ── Constants ─────────────────────────────────────────────────

const CADEX_VERSION = '0.4'
const STORAGE_KEY = 'cadex-v1'

// ── Default meta values ───────────────────────────────────────

function createDefaultMeta(): DealMeta {
  return {
    name: '',
    clientName: '',
    engagementType: 'fixed-agile',
    pricingModel: 'fixed-price',
    dealOrigin: 'rfp',
    industry: 'tech',
    dealSize: '500k-2m',
    duration: '6-12m',
    deliveryModel: 'hybrid',
    scopeSummary: '',
    projectNature: 'greenfield',
    workCategory: '',
    workType: '',
    competitiveSituation: 'open',
    incumbentVendor: '',
    competitorsKnown: 'unknown',
    winProbability: 'unknown',
    salesStage: 'qualification',
    proposalDeadline: '',
    budgetApprovalStatus: 'unknown',
    presalesEffortInvested: '1-5d',
    dataClassification: [],
    applicableFrameworks: [],
    dataResidencyRequired: 'none',
    securityCertRequired: 'unknown',
    technologyPartners: [],
    ourRole: 'prime',
    otherSIsInvolved: 'unknown',
    partnerCertDependency: 'no',
    clientTimezone: 'europe-uk',
    deliveryTimezones: ['south-asia'],
    timezoneOverlapHours: 0,
    inCountryRequired: 'no',
    languageRequirements: 'english-only',
    workTypeScopeAnswers: {},
  }
}

// ── ID Generation ─────────────────────────────────────────────

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for environments without crypto.randomUUID
  return (
    Math.random().toString(36).slice(2, 10) +
    '-' +
    Date.now().toString(36)
  )
}

// ── Store Interface ───────────────────────────────────────────

export interface DealStore {
  deals: Deal[]
  activeDealId: string | null
  displayStep: number   // which step is currently rendered (UI navigation)

  // ── Deal lifecycle ────────────────────────────────────────
  createDeal: () => string
  setActiveDeal: (id: string) => void
  deleteDeal: (id: string) => void
  importDeal: (deal: Deal) => void

  // ── Field updates ─────────────────────────────────────────
  updateMeta: (meta: Partial<DealMeta>) => void
  setResponse: (questionId: string, value: number) => void
  setCheckState: (checkId: string, state: CheckState, notes?: string) => void
  // Advance progress: increases Deal.currentStep (max reached) AND sets displayStep
  setCurrentStep: (step: number) => void
  // Navigate only: changes displayStep without touching progress
  setDisplayStep: (step: number) => void
  // Assumptions
  addAssumption: (text: string, impact: AssumptionImpact) => void
  updateAssumption: (id: string, text: string, impact: AssumptionImpact) => void
  removeAssumption: (id: string) => void
  // Discovery gaps
  setDiscoveryGap: (gapId: string, status: DiscoveryGapStatus) => void

  // ── Computed ──────────────────────────────────────────────
  getActiveDeal: () => Deal | undefined
  getAxisScores: () => AxisScores | undefined
}

// ── Internal helpers ──────────────────────────────────────────

/** Recompute all scoring derived fields from the current responses */
function recomputeAssessment(deal: Deal): Deal {
  const { assessment, meta } = deal
  if (!assessment) return deal

  const rawAxisScores = computeAxisScores(assessment.responses, QUESTIONS, meta)
  const axisScores = applyScopeAnswerImpacts(rawAxisScores, meta, WORK_TYPE_SCOPE_BLOCKS)
  const weightedTotal = computeWeightedTotal(axisScores, meta)
  const scoreBand = getScoreBand(weightedTotal)
  const criticalFlags = getCriticalFlags(axisScores)

  const updatedAssessment = {
    ...assessment,
    axisScores,
    weightedTotal,
    scoreBand,
    criticalFlags,
    completedAt: new Date().toISOString(),
  }

  // Also recompute strategy and shaper whenever scores change
  const strategy = selectStrategy(axisScores, meta, weightedTotal)
  const shaperLevers = getPrioritisedLevers(axisScores, meta)

  return {
    ...deal,
    assessment: updatedAssessment,
    strategy,
    shaperLevers,
    updatedAt: new Date().toISOString(),
  }
}

/** Recompute timezone overlap whenever meta changes */
function recomputeTimezone(meta: DealMeta): DealMeta {
  if (meta.clientTimezone && meta.deliveryTimezones?.length > 0) {
    const overlap = calcOverlapHours(meta.clientTimezone, meta.deliveryTimezones)
    return { ...meta, timezoneOverlapHours: overlap }
  }
  return meta
}

/** Find a deal in the array and apply an updater */
function updateDealInArray(
  deals: Deal[],
  id: string | null,
  updater: (deal: Deal) => Deal,
): Deal[] {
  if (!id) return deals
  return deals.map(d => (d.id === id ? updater(d) : d))
}

// ── Store ─────────────────────────────────────────────────────

export const useDealStore = create<DealStore>()(
  persist(
    (set, get) => ({
      deals: [],
      activeDealId: null,
      displayStep: 1,

      // ── Deal lifecycle ──────────────────────────────────────

      createDeal: () => {
        const id = generateId()
        const now = new Date().toISOString()
        const meta = createDefaultMeta()

        const newDeal: Deal = {
          id,
          meta,
          assessment: undefined,
          strategy: undefined,
          shaperLevers: undefined,
          checklist: undefined,
          assumptions: [],
          discoveryGaps: {},
          currentStep: 1,
          createdAt: now,
          updatedAt: now,
          version: CADEX_VERSION,
        }

        set(state => ({
          deals: [...state.deals, newDeal],
          activeDealId: id,
          displayStep: 1,
        }))

        return id
      },

      setActiveDeal: (id: string) => {
        set({ activeDealId: id })
      },

      deleteDeal: (id: string) => {
        set(state => ({
          deals: state.deals.filter(d => d.id !== id),
          activeDealId: state.activeDealId === id ? null : state.activeDealId,
        }))
      },

      importDeal: (deal: Deal) => {
        const progressStep = Math.max(1, deal.currentStep ?? 1)
        set(state => {
          const existing = state.deals.find(d => d.id === deal.id)
          if (existing) {
            return {
              deals: state.deals.map(d => (d.id === deal.id ? deal : d)),
              activeDealId: deal.id,
              displayStep: progressStep,
            }
          }
          return {
            deals: [...state.deals, deal],
            activeDealId: deal.id,
            displayStep: progressStep,
          }
        })
      },

      // ── Field updates ───────────────────────────────────────

      updateMeta: (metaUpdate: Partial<DealMeta>) => {
        const { activeDealId } = get()
        if (!activeDealId) return

        set(state => ({
          deals: updateDealInArray(state.deals, activeDealId, deal => {
            const updatedMeta = recomputeTimezone({ ...deal.meta, ...metaUpdate })
            const updatedDeal: Deal = {
              ...deal,
              meta: updatedMeta,
              updatedAt: new Date().toISOString(),
            }
            // Re-score if we already have responses
            if (deal.assessment?.responses) {
              return recomputeAssessment(updatedDeal)
            }
            return updatedDeal
          }),
        }))
      },

      setResponse: (questionId: string, value: number) => {
        const { activeDealId } = get()
        if (!activeDealId) return

        set(state => ({
          deals: updateDealInArray(state.deals, activeDealId, deal => {
            const existingResponses = deal.assessment?.responses ?? {}
            const updatedResponses = { ...existingResponses, [questionId]: value }

            const partialAssessment = {
              ...(deal.assessment ?? {
                responses: {},
                axisScores: { SC: 3, CM: 3, CR: 3, TC: 3, GR: 3, SV: 3, CP: 3, VF: 3 },
                weightedTotal: 50,
                scoreBand: 'amber' as const,
                criticalFlags: [],
                completedAt: new Date().toISOString(),
              }),
              responses: updatedResponses,
            }

            return recomputeAssessment({
              ...deal,
              assessment: partialAssessment,
            })
          }),
        }))
      },

      setCheckState: (checkId: string, state: CheckState, notes?: string) => {
        const { activeDealId } = get()
        if (!activeDealId) return

        set(storeState => ({
          deals: updateDealInArray(storeState.deals, activeDealId, deal => {
            const existingChecks = deal.checklist?.checks ?? {}
            const updatedChecks = {
              ...existingChecks,
              [checkId]: {
                id: checkId,
                state,
                notes: notes ?? existingChecks[checkId]?.notes ?? '',
              },
            }

            // Recompute checklist result
            const checklist = computeCheckerResult(updatedChecks, deal.meta)

            return {
              ...deal,
              checklist,
              updatedAt: new Date().toISOString(),
            }
          }),
        }))
      },

      setCurrentStep: (step: number) => {
        const { activeDealId } = get()
        if (!activeDealId) return
        // Advance progress (Deal.currentStep only increases) and update display
        set(state => ({
          displayStep: step,
          deals: updateDealInArray(state.deals, activeDealId, deal => ({
            ...deal,
            currentStep: Math.max(deal.currentStep, step),
            updatedAt: new Date().toISOString(),
          })),
        }))
      },

      setDisplayStep: (step: number) => {
        set({ displayStep: step })
      },

      addAssumption: (text: string, impact: AssumptionImpact) => {
        const { activeDealId } = get()
        if (!activeDealId) return
        const id = `A-${Date.now()}`
        set(state => ({
          deals: updateDealInArray(state.deals, activeDealId, deal => ({
            ...deal,
            assumptions: [...(deal.assumptions ?? []), { id, text, ifFalseImpact: impact }],
            updatedAt: new Date().toISOString(),
          })),
        }))
      },

      updateAssumption: (id: string, text: string, impact: AssumptionImpact) => {
        const { activeDealId } = get()
        if (!activeDealId) return
        set(state => ({
          deals: updateDealInArray(state.deals, activeDealId, deal => ({
            ...deal,
            assumptions: (deal.assumptions ?? []).map(a =>
              a.id === id ? { ...a, text, ifFalseImpact: impact } : a
            ),
            updatedAt: new Date().toISOString(),
          })),
        }))
      },

      removeAssumption: (id: string) => {
        const { activeDealId } = get()
        if (!activeDealId) return
        set(state => ({
          deals: updateDealInArray(state.deals, activeDealId, deal => ({
            ...deal,
            assumptions: (deal.assumptions ?? []).filter(a => a.id !== id),
            updatedAt: new Date().toISOString(),
          })),
        }))
      },

      setDiscoveryGap: (gapId: string, status: DiscoveryGapStatus) => {
        const { activeDealId } = get()
        if (!activeDealId) return
        set(state => ({
          deals: updateDealInArray(state.deals, activeDealId, deal => ({
            ...deal,
            discoveryGaps: { ...(deal.discoveryGaps ?? {}), [gapId]: status },
            updatedAt: new Date().toISOString(),
          })),
        }))
      },

      // ── Computed ────────────────────────────────────────────

      getActiveDeal: () => {
        const { deals, activeDealId } = get()
        return deals.find(d => d.id === activeDealId)
      },

      getAxisScores: () => {
        const { deals, activeDealId } = get()
        const deal = deals.find(d => d.id === activeDealId)
        return deal?.assessment?.axisScores
      },
    }),

    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ deals: state.deals, activeDealId: state.activeDealId }),
      onRehydrateStorage: () => (state) => {
        if (!state) return
        // Migrate old deals that predate new fields
        state.deals = state.deals.map(d => ({
          ...d,
          assumptions: d.assumptions ?? [],
          discoveryGaps: d.discoveryGaps ?? {},
          currentStep: d.currentStep ?? 1,
        }))
        if (state.activeDealId) {
          const deal = state.deals.find(d => d.id === state.activeDealId)
          if (deal) state.displayStep = Math.max(1, deal.currentStep ?? 1)
        }
      },
    },
  ),
)
