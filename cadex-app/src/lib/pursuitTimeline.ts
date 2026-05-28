import type { Deal } from '../types'

export type TimelineActivityStatus = 'done' | 'overdue' | 'due-soon' | 'upcoming' | 'no-deadline'
export type TimelineOwner = 'presales' | 'delivery' | 'account' | 'leadership'

export interface TimelineActivity {
  id: string
  name: string
  detail: string          // one sentence explaining why this matters
  owner: TimelineOwner
  daysBeforeDeadline: number  // how many days before proposal deadline this should be done
  targetDate: string | null   // ISO date string, null if no deadline set
  status: TimelineActivityStatus
  isBlocking: boolean     // if overdue, blocks submission
}

interface ActivityDefinition {
  id: string
  name: string
  detail: string
  owner: TimelineOwner
  daysBeforeDeadline: number
  isBlocking: boolean
}

const ACTIVITY_DEFINITIONS: ActivityDefinition[] = [
  { id: 'intake', name: 'Complete deal intake', detail: 'All intake sections completed — deal basics, work type, economics, competitive context, compliance, and geography.', owner: 'presales', daysBeforeDeadline: 21, isBlocking: true },
  { id: 'risk-assessment', name: 'Run risk assessment', detail: 'All 29 questions answered across 8 risk axes — score and strategy selected.', owner: 'presales', daysBeforeDeadline: 18, isBlocking: true },
  { id: 'capability-review', name: 'Internal capability review', detail: 'Delivery lead has reviewed the work type, team availability, and any capability gaps — documented in assumptions.', owner: 'delivery', daysBeforeDeadline: 16, isBlocking: true },
  { id: 'strategy-alignment', name: 'Strategy & shaper review with account team', detail: 'Account lead and presales have aligned on deal strategy, win themes, and commercial structure.', owner: 'account', daysBeforeDeadline: 14, isBlocking: false },
  { id: 'champion-mapping', name: 'Identify and brief internal champion', detail: 'A named internal champion at the client has been identified and briefed on our approach before proposal submission.', owner: 'account', daysBeforeDeadline: 14, isBlocking: false },
  { id: 'checklist-complete', name: 'Complete Go/No-Go checklist', detail: 'All checklist sections reviewed — hard blockers resolved, conditional items documented.', owner: 'presales', daysBeforeDeadline: 7, isBlocking: true },
  { id: 'proposal-draft', name: 'Proposal draft complete', detail: 'First complete draft of proposal reviewed internally — executive summary, solution, commercial, and team sections complete.', owner: 'presales', daysBeforeDeadline: 7, isBlocking: true },
  { id: 'delivery-signoff', name: 'Delivery lead proposal sign-off', detail: 'Delivery lead has reviewed and signed off on scope assumptions, team composition, and timeline — not just the commercial terms.', owner: 'delivery', daysBeforeDeadline: 4, isBlocking: true },
  { id: 'leadership-review', name: 'Leadership pricing approval', detail: 'Deal pricing and margin have been reviewed and approved at the appropriate authority level.', owner: 'leadership', daysBeforeDeadline: 3, isBlocking: true },
  { id: 'submission', name: 'Proposal submission', detail: 'Final proposal submitted on or before the deadline.', owner: 'presales', daysBeforeDeadline: 0, isBlocking: true },
]

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function toISODateString(date: Date): string {
  return date.toISOString().slice(0, 10)
}

function isCompleted(id: string, deal: Deal): boolean {
  switch (id) {
    case 'intake':
      return deal.currentStep >= 2
    case 'risk-assessment':
      return !!(
        deal.assessment?.completedAt &&
        Object.keys(deal.assessment.responses).length >= 10
      )
    case 'capability-review':
      return deal.assumptions.length > 0
    case 'strategy-alignment':
      return deal.currentStep >= 3
    case 'champion-mapping':
      return (
        deal.meta.competitiveSituation !== 'unknown' &&
        deal.meta.incumbentVendor !== ''
      )
    case 'checklist-complete':
      return !!deal.checklist?.completedAt
    case 'proposal-draft':
      return deal.currentStep >= 6
    case 'delivery-signoff':
      return deal.checklist?.checks?.['V1-1']?.state === 'pass'
    case 'leadership-review':
      return deal.checklist?.checks?.['C1-1']?.state === 'pass'
    case 'submission':
      return false
    default:
      return false
  }
}

export function generatePursuitTimeline(deal: Deal): TimelineActivity[] {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const rawDeadline = deal.meta.proposalDeadline
  const deadlineDate = rawDeadline ? new Date(rawDeadline) : null
  const deadlineValid = deadlineDate !== null && !isNaN(deadlineDate.getTime())

  return ACTIVITY_DEFINITIONS.map((def): TimelineActivity => {
    const done = isCompleted(def.id, deal)

    if (!deadlineValid) {
      return {
        id: def.id,
        name: def.name,
        detail: def.detail,
        owner: def.owner,
        daysBeforeDeadline: def.daysBeforeDeadline,
        targetDate: null,
        status: done ? 'done' : 'no-deadline',
        isBlocking: def.isBlocking,
      }
    }

    const targetDate = addDays(deadlineDate!, -def.daysBeforeDeadline)
    targetDate.setHours(0, 0, 0, 0)
    const targetDateStr = toISODateString(targetDate)

    let status: TimelineActivityStatus
    if (done) {
      status = 'done'
    } else {
      const diffMs = targetDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
      if (diffDays < 0) {
        status = 'overdue'
      } else if (diffDays <= 3) {
        status = 'due-soon'
      } else {
        status = 'upcoming'
      }
    }

    return {
      id: def.id,
      name: def.name,
      detail: def.detail,
      owner: def.owner,
      daysBeforeDeadline: def.daysBeforeDeadline,
      targetDate: targetDateStr,
      status,
      isBlocking: def.isBlocking,
    }
  })
}
