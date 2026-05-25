// ============================================================
// CADEX — Strategy Cards  (spec §5.3)
// 6 strategies: A=Foundation First, B=Phased Commitment,
// C=Outcome Contract, D=Scope-Locked MVP,
// E=Hybrid T&M Cap, F=No-Bid / Counter
// ============================================================

import type { StrategyCard, StrategyId } from '../types'

export const STRATEGIES: Record<StrategyId, StrategyCard> = {

  // ── Strategy A: Foundation First ──────────────────────────
  A: {
    id: 'A',
    name: 'Foundation First',
    tagline: 'Sell a discovery phase before you price the build.',
    pitch:
      "\"Based on what we've seen so far, the scope has enough open questions that committing to a fixed price on the full build right now would put both of us at risk. We'd like to propose a structured 4–6 week discovery phase — time-boxed, fixed price — so we can validate scope, surface the unknowns, and give you a credible estimate with real confidence. That protects your budget and our delivery.\"",
    keyMoves: [
      'Propose a paid discovery phase as a standalone engagement (4–6 weeks, fixed price). Frame it as risk reduction for the client, not a delay tactic.',
      'Define discovery deliverables precisely: validated user story map, architecture decision record, integration inventory, effort estimate with confidence interval, and a go/no-go recommendation on the full build.',
      'Use the discovery phase to surface all the unknowns before they become scope disputes. Document assumptions, exclusions, and open questions explicitly.',
    ],
    contractNonNegotiables: [
      'Discovery phase is a separate, paid engagement — not part of the build contract. It has its own SOW, timeline, and acceptance criteria.',
      'Discovery output gates the build proposal. If discovery reveals a significantly different scope, the build price is renegotiated — not held to the pre-discovery estimate.',
      'Assumptions documented in discovery become binding scope boundaries in the build contract. Any deviation from those assumptions triggers a formal change order.',
    ],
    objections: [
      {
        q: "We don't have time for a discovery phase — we need to move straight to build.",
        a: "I understand the urgency, and I respect your timeline. The question is whether moving fast now creates a bigger delay later. Discovery doesn't slow the project — it protects the timeline by removing the scope disputes that cause replanning in Sprint 5. We've seen discovery-then-build take 20% longer than a discovery-free approach — but discovery-free projects are 3x more likely to run over time and budget. The choice is: invest 4 weeks in certainty, or risk 4 months in disputes.",
      },
      {
        q: "We already have detailed requirements — why do we need discovery?",
        a: "That's a good sign, and if the requirements are as detailed and stable as you describe, discovery will be short and fast — and will give us both the confidence to commit to a firm price. The discovery phase validates the requirements, not questions them. If they hold up, we have a much stronger foundation for a fixed-price contract. If there are gaps, we'll find them now rather than in Sprint 6.",
      },
      {
        q: "We're not paying for discovery — that's your pre-sales work.",
        a: "I can offer a rapid, lighter-touch discovery — at our cost — if the deal is conditional on it. But what I can't responsibly do is price a full fixed-cost build on a scope that has material unknowns and then carry the risk of those unknowns silently in the price. That kind of pricing either results in padded numbers that waste your budget, or optimistic numbers that erode our margin and your delivery quality. Paid discovery, priced transparently, is the honest option.",
      },
    ],
    close:
      "\"What I'd like to propose is this: a 4-week discovery engagement, fixed price at [X], deliverable being a fully scoped, estimated, and risk-validated build proposal. You get the certainty to approve a budget with confidence. We get the foundation to deliver without padding or surprises. Can we agree on that as the next step?\"",
    redFlags: [
      'Client refuses paid discovery AND insists on a fixed price on undefined scope — this combination creates an undeliverable contract.',
      'Discovery deliverables are accepted without review or challenge — may indicate low client engagement, which creates governance risk in the build.',
      'Client tries to use discovery output to re-tender the build with other vendors — protect discovery IP in the contract.',
    ],
    triggerSummary: 'Triggered when SC score < 3, or total score < 50%, or work type is migration/modernisation with undocumented legacy systems.',
  },

  // ── Strategy B: Phased Commitment ─────────────────────────
  B: {
    id: 'B',
    name: 'Phased Commitment',
    tagline: 'Commit to Phase 1 firmly. Price Phase 2 as a conditional option.',
    pitch:
      "\"Rather than committing to the full programme now — which would require us both to accept more uncertainty than is healthy — we'd like to structure this as a phased engagement. Phase 1 is fixed price, fixed scope, and fully committed. Phase 2 is conditionally priced based on Phase 1 outputs. You get delivery certainty immediately, and the confidence that Phase 2 is based on real data, not pre-sales optimism.\"",
    keyMoves: [
      'Define Phase 1 scope precisely: it should be independently valuable, demonstrably shippable, and not dependent on Phase 2 to be useful. "Phase 1 delivers the core capability; Phase 2 extends it."',
      'Price Phase 2 as a conditional option with a defined pricing mechanism — not a fixed price, but a formula (e.g. "Phase 2 will be estimated using Phase 1 velocity data and repriced before commitment").',
      'Establish Phase 1 governance design as the model for Phase 2. If governance works well in Phase 1, Phase 2 is lower risk. If it doesn\'t, Phase 2 should not proceed on the same terms.',
    ],
    contractNonNegotiables: [
      'Phase 1 and Phase 2 are separate contracts — not a single contract with option years. This protects you from being held to a Phase 2 price based on Phase 1 estimates.',
      'Phase 2 entry conditions are defined in the Phase 1 contract: minimum governance score, scope stability, and Phase 1 delivery performance against SLAs.',
      'Phase 1 acceptance criteria are binary and measurable — not subjective. "System goes live with documented features X, Y, Z accepted by the PO" — not "client is happy with delivery."',
    ],
    objections: [
      {
        q: "We need to approve the full budget now — we can't come back for Phase 2 funding separately.",
        a: "I understand budget approval cycles are real constraints. We can structure this differently: approve a total programme envelope now, with a defined split — 60% committed to Phase 1, 40% conditionally allocated to Phase 2 pending Phase 1 completion. This gives your finance team a total number to approve, while giving both of us the flexibility to reprice Phase 2 when we have real data from Phase 1.",
      },
      {
        q: "We're worried Phase 2 pricing will be inflated once we're committed.",
        a: "That's a legitimate concern, and I'd be worried too if I were in your position. The protection is a pricing mechanism, not a price. We'll include in the contract a formula for Phase 2 pricing based on Phase 1 velocity, team composition, and a pre-agreed rate card. You won't be held hostage to an arbitrary number — and neither will we.",
      },
      {
        q: "Phased delivery means delayed value — we need everything for the launch.",
        a: "The question is what 'everything' means for launch. In our experience, only 30–40% of the originally scoped features are actually needed for a successful launch. The rest are nice-to-haves that feel critical in pre-sales and turn out to be Phase 2 improvements. Let's define the minimum viable launch scope — what would make the launch a success without Phase 2 — and price that as Phase 1.",
      },
    ],
    close:
      "\"Let me summarise the structure I'm proposing: Phase 1 is [X scope], committed at [Y price], delivered in [Z weeks], producing [defined deliverables]. Phase 2 is conditionally priced at [budget envelope], repriced after Phase 1 completion using a defined velocity-based formula. Both phases have the same governance model. Are you comfortable with that structure as the basis for the proposal?\"",
    redFlags: [
      'Client treats Phase 1 as a pilot and reserves the right to re-tender Phase 2 — ensure Phase 2 right of first refusal or preferred supplier status is in the Phase 1 contract.',
      'Phase 1 scope is so large it\'s effectively the full programme — phase boundaries should be meaningful, not cosmetic.',
      'Governance commitment in Phase 1 is weak — if the client doesn\'t engage properly in Phase 1, don\'t proceed to Phase 2 under the same terms.',
    ],
    triggerSummary: 'Safe default for deals scoring 50%+ with adequate SC and GR, or as an alternative to Strategy A when scope is partially defined.',
  },

  // ── Strategy C: Outcome Contract ──────────────────────────
  C: {
    id: 'C',
    name: 'Outcome Contract',
    tagline: 'Price the result, not the work. Lead with value and accountability.',
    pitch:
      "\"We're not proposing to sell you a team for 6 months. We're proposing to deliver a measurable outcome: [specific KPI or business result]. Our price is tied to delivery of that outcome, not to the hours we spend. That means our incentives are completely aligned with yours — we only win when you win.\"",
    keyMoves: [
      'Define the outcome in precise, measurable terms before the proposal. "Increase checkout conversion by 15%" — not "improve the checkout experience." The outcome must be attributable to your delivery and measurable within a defined timeframe.',
      'Structure the commercial model with a base fee (cost of delivery) and a performance fee (tied to outcome achievement). This aligns incentives without creating a pure gamble.',
      'Ensure the client controls the variables you need for outcome delivery: data access, user adoption, business process compliance. An outcome contract you can\'t control is a risk you can\'t price.',
    ],
    contractNonNegotiables: [
      'Outcome definition and measurement methodology are defined and agreed before contract signing — not during delivery. Retrospective outcome definition is a dispute mechanism.',
      'Outcome attribution is explicit: what counts as delivery-attributable performance vs external factors (market conditions, competitor actions, etc.).',
      'Base fee covers cost of delivery regardless of outcome. Performance fee is capped and tied to a defined measurement window.',
    ],
    objections: [
      {
        q: "We've never structured a contract this way — our procurement process only supports fixed-price or T&M.",
        a: "I understand procurement processes are constraints, not preferences. We can structure the commercial model as a fixed-price engagement with a separately agreed success payment that routes through a different approval channel — or we can work with your procurement team to define an outcome-based template. This doesn't have to be exotic; it just requires the outcome definition to be documented alongside the contract.",
      },
      {
        q: "How do we know you won't just game the metric?",
        a: "The metric needs to be genuinely business-meaningful, not gameable. That's the test: if you can hit the number without creating real business value, it's the wrong metric. Let's define the outcome together — I want it to be something you'd be proud to report to your board, not something that looks good in a contract. The safest outcome metrics are customer-facing: conversion, adoption, NPS, revenue. They're hard to game because they require real business change.",
      },
      {
        q: "What if the outcome fails because of factors outside your control?",
        a: "That's exactly why we propose a base fee that covers delivery cost, separate from a performance fee. We're not asking you to pay nothing unless we succeed — we're asking you to pay for the delivery work regardless, and to pay a premium if we hit the target. The risk you're asking about is covered by the base fee structure: we absorb the outcome risk on the performance premium, not on our delivery costs.",
      },
    ],
    close:
      "\"The proposal I want to table is: base engagement at [X] — covers the full delivery team, timeline, and all committed deliverables. Plus a performance fee of [Y] tied to achieving [specific outcome] within [timeframe], measured by [methodology]. Both of us have skin in the game. Shall I structure the proposal on that basis?\"",
    redFlags: [
      'Client wants to retain control over variables that determine outcome achievement — if they won\'t commit to user adoption, data access, or process compliance, the outcome isn\'t in your control.',
      'Outcome definition is vague or shifts during negotiation — lock the metric before signing.',
      'Client uses outcome contract structure to avoid paying a fair base fee — the base fee must cover delivery cost or the model is unsustainable.',
    ],
    triggerSummary: 'Triggered when CM ≥ 4, GR ≥ 4, SV ≥ 4, and CP ≥ 3. Mature client, strategic relationship, high trust.',
  },

  // ── Strategy D: Scope-Locked MVP ──────────────────────────
  D: {
    id: 'D',
    name: 'Scope-Locked MVP',
    tagline: 'Define the smallest shippable scope and lock it. Protect it contractually.',
    pitch:
      "\"We want to propose a fixed-price contract on an MVP scope — not the full product vision, but the minimum set of capabilities that makes the launch successful and creates a foundation for Phase 2. By locking the MVP scope at the start, we protect the timeline and budget, and we avoid the scope inflation that kills most fixed-price projects in the final third.\"",
    keyMoves: [
      'Run a scope definition workshop before the proposal — not as a discovery phase, but as a 1–2 day facilitated session to define MVP. The output is a signed-off feature list, not a requirements document.',
      'Apply MoSCoW to everything: Must (MVP), Should (Phase 2), Could (backlog), Won\'t (explicitly out of scope). Every feature in the contract must have a category.',
      'Define a scope change mechanism in the contract: any Must-Have additions require a formal change order. Should-Haves can be swapped against other Should-Haves within an agreed sprint allocation.',
    ],
    contractNonNegotiables: [
      'The MVP feature list is an exhibit to the contract, not a reference document. Changes to Exhibit A require a signed change order — not a verbal agreement or email exchange.',
      'Acceptance criteria for each MVP feature are agreed before Sprint 1 begins. "Done" is defined in writing before work starts, not at demo time.',
      'Scope swap mechanism is defined: a Should-Have feature can be substituted for another Should-Have of equivalent complexity, with delivery lead agreement. Must-Haves are not swappable.',
    ],
    objections: [
      {
        q: "The MVP as you've defined it doesn't have enough features to launch — we need more.",
        a: "That's the most important conversation we can have right now, before we price anything. Let's look at what you've classified as Must-Have and ask: what would happen to the business if this launch didn't include that feature? If the answer is 'the launch would fail,' it's a Must-Have. If the answer is 'users would be disappointed,' it's a Should-Have. The discipline of that question, applied to every feature, is what produces a realistic MVP — and a contract that delivers on its promises.",
      },
      {
        q: "We've already agreed internally on the full feature set — we can't go back now.",
        a: "Internal agreements on feature lists are starting points, not fixed constraints. We can respect the full vision while being honest about what can be delivered within the time and budget. The alternative — committing to the full feature list at a fixed price — means either the price is padded to absorb the risk, or the delivery team cuts corners to hit the scope. Neither of those is good for you. The conversation you're worried about having internally is easier now than the conversation about why features were cut or budget was exceeded at the end.",
      },
      {
        q: "How do we prevent scope creep if we lock the MVP?",
        a: "The locked MVP is the prevention mechanism. Scope creep happens when there's no agreed list to say 'that's not in the contract.' The locked feature list, with MoSCoW categories and a formal change mechanism, is the contractual protection. Every conversation about adding scope starts with: 'Is this a Must-Have that belongs in the MVP, or a Should-Have that belongs in Phase 2?' That question is only answerable if you have a documented, agreed scope to point to.",
      },
    ],
    close:
      "\"I'd like to propose we take the next step together: a 1-day scope workshop where we work through the feature list, apply MoSCoW, and produce a signed MVP definition. That document becomes the foundation for the fixed-price proposal. The workshop is at our cost. At the end, you'll have a credible scope, and we'll have the certainty to price it accurately. When can we schedule that?\"",
    redFlags: [
      'Client won\'t engage in the MoSCoW exercise — "all features are must-have" is a scope lock failure mode that will recur throughout delivery.',
      'Acceptance criteria remain undefined after scope is locked — features without acceptance criteria cannot be formally accepted.',
      'Client views the locked scope as a starting point, not a contract — "we\'ll add things as we go" behaviour must be addressed in contract negotiation, not tolerated in delivery.',
    ],
    triggerSummary: 'Triggered for Fixed/Scope deals where SC < 4. Pairs with MoSCoW discipline and formal change management.',
  },

  // ── Strategy E: Hybrid T&M Cap ─────────────────────────────
  E: {
    id: 'E',
    name: 'Hybrid T&M Cap',
    tagline: 'T&M for flexibility. A cap for budget protection. Governance for both.',
    pitch:
      "\"We'd like to propose a T&M structure with a defined spending cap — not a fixed-price contract, because the scope still has too many unknowns to price responsibly, but not an open-ended T&M either, because you need budget certainty. The cap gives you a hard ceiling; the T&M model gives us the flexibility to respond to what we discover. If we come in under the cap, you pay less. We both have an incentive to be efficient.\"",
    keyMoves: [
      'Set the cap at a level that reflects realistic scope, not padded contingency. The cap should be the 80th percentile estimate, not the 95th — the remaining risk is managed through scope management, not budget.',
      'Define the governance structure for T&M: weekly spend reporting, scope prioritisation at every sprint, and a clear escalation path when spend reaches 70% and 90% of cap.',
      'Build in a scope-down mechanism: when spend reaches 80% of cap, the team and client jointly review remaining backlog and cut anything below the line. This prevents the "race to the cap" anti-pattern.',
    ],
    contractNonNegotiables: [
      'The cap is a ceiling, not a target. The contract must state explicitly that the client will not be billed beyond the cap, and that any work beyond the cap requires a signed cap amendment.',
      'Weekly spend reporting is mandatory — not monthly. T&M without weekly spend visibility becomes a budget surprise at invoice time.',
      'Rate card and roles are fixed for the duration — T&M commercial risk is rate escalation. Lock the rates at contract signing.',
    ],
    objections: [
      {
        q: "T&M with a cap is just fixed price by another name.",
        a: "It\'s similar in outcome — there\'s a ceiling — but different in how we manage to it. Fixed price means we absorb risk in the estimate. T&M cap means we manage scope actively together to stay under the ceiling. The difference is that you see the spend weekly, you control the priorities, and if things cost less than expected, you pay less. Fixed price means you pay the fixed amount regardless of actual effort.",
      },
      {
        q: "We can't get budget approval for T&M — finance needs a fixed number.",
        a: "The cap is the fixed number for budget approval purposes. Present it as a ceiling commitment: 'The project will not exceed [cap] without a signed amendment.' That gives finance the certainty they need. Internally, we'll track weekly spend — but the external commitment is capped, not open-ended.",
      },
      {
        q: "What stops you from deliberately burning through the cap?",
        a: "The governance structure prevents that. Every sprint prioritisation decision is visible to you. If we're burning budget on lower-priority items, you'll see it in the weekly report and can redirect. The T&M model gives you control over where the budget goes — a fixed-price model gives us control. Which governance model do you prefer?",
      },
    ],
    close:
      "\"The structure I'm proposing: T&M at the agreed rate card, capped at [X], with weekly spend reporting, fortnightly backlog prioritisation, and a formal review at 80% cap utilisation to agree next steps. You have budget certainty and scope flexibility. We have commercial clarity and the ability to manage risk transparently. Can I structure the proposal on those terms?\"",
    redFlags: [
      'Client treats the cap as the target budget, not the ceiling — "you have [X] to spend" changes the incentive structure to burn budget rather than manage it.',
      'Weekly governance falls away mid-project — without regular spend visibility, the cap becomes a surprise at the end.',
      'Rate card becomes a negotiation point mid-project — lock rates at contract signing, not at each invoice.',
    ],
    triggerSummary: 'Triggered when total score < 50% and CR < 3, or pricing model is T&M/T&M-cap, or scope is too uncertain for fixed pricing.',
  },

  // ── Strategy F: No-Bid / Counter ──────────────────────────
  F: {
    id: 'F',
    name: 'No-Bid / Counter-Proposal',
    tagline: "Walking away from a deal structured to fail is not losing. It's protecting your reputation.",
    pitch:
      "\"We've reviewed the RFP carefully and we don't believe we can submit a proposal that honestly represents our cost and a fair price for you. The scope has too many open questions to price responsibly, the timeline creates delivery risk we can't mitigate, and we don't want to win this deal at a price that fails you. We'd like to propose an alternative structure that we believe we can actually deliver.\"",
    keyMoves: [
      'Document the no-bid decision formally, with the specific reasons: which axis scores triggered it, which risk conditions couldn\'t be mitigated, and what alternative you considered.',
      'If a counter-proposal is appropriate, propose a restructured engagement — typically a paid discovery phase or a phased approach — that reduces the risk to an acceptable level.',
      'Communicate the decision early — before the proposal deadline, not after. Early notification preserves the relationship; a last-minute withdrawal damages it.',
    ],
    contractNonNegotiables: [
      'The no-bid decision is documented internally with a rationale that protects the decision-maker from second-guessing. "We walked away because [specific risk conditions]" — not "it didn\'t feel right."',
      'Any counter-proposal is conditional on the client accepting the restructure. Do not provide a counter-proposal that implicitly commits to the original terms.',
      'Follow-up conversation with the client sponsor is scheduled — not a letter, a conversation. The goal is to preserve the relationship for the next opportunity, even if this deal is not right for now.',
    ],
    objections: [
      {
        q: "We've done a lot of work on this proposal — we can't just walk away now.",
        a: "Sunk cost is not a reason to accept unacceptable risk. The question is: given what we know now, is this a deal we can deliver profitably and that will make the client happy? If the answer is no, the cost of walking away now is far less than the cost of delivering a contract that fails. The presales investment is real, but it's smaller than the delivery loss.",
      },
      {
        q: "If we don't bid, we'll lose the relationship with this client.",
        a: "The opposite is more likely. Bidding on a deal you can't deliver profitably, delivering it badly, and having a dispute at the end destroys the relationship permanently. Walking away professionally — with a clear rationale and a counter-proposal — keeps the door open for the next deal that's structured better. Clients remember vendors who are honest about what they can and can't do.",
      },
      {
        q: "Can't we just price in the risk and win at a higher price?",
        a: "If the risk is that large, the price that adequately covers it will be uncompetitive. And if we win at that price, we'll either deliver poorly — because the risk materialises and we absorb it — or we'll fight constant scope disputes about what was and wasn't included. The risk isn't priceable in a way that makes the deal viable. That's what the risk assessment is telling us.",
      },
    ],
    close:
      "\"I'd like to have a direct conversation with [client sponsor] about what we've found in our assessment and what we believe would need to change to make this a deal both parties can be confident in. That conversation is more valuable than a proposal that neither side should sign. Can we set up 30 minutes?\"",
    redFlags: [
      'No-bid decision is overridden by senior leadership without reviewing the risk assessment — ensure the assessment is presented to whoever has authority to override it.',
      'Counter-proposal is accepted without the risk conditions being addressed — a counter-proposal that trades down the price without changing the structure is still a no-bid situation.',
      'No-bid leads to relationship damage — proactive, early, honest communication prevents this; last-minute withdrawal causes it.',
    ],
    triggerSummary: 'Hard triggers: any axis = 1, total score < 25%, CP ≤ 2 in open competition, VF ≤ 2. The deal as structured is not deliverable or winnable.',
  },
}
