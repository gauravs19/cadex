// ============================================================
// CADEX — Work-Category Objection Bank
// Domain-specific client objections with scripted rebuttals
// ============================================================

export interface Objection {
  q: string  // the client objection
  a: string  // scripted rebuttal (2–4 sentences)
}

export const OBJECTION_BANK: Record<string, Objection[]> = {

  'gf-data': [
    {
      q: 'Our data is clean — we just need you to build the dashboard.',
      a: 'Every client tells us their data is clean until we run a profiling sprint — and in our experience across hundreds of data projects, we find meaningful quality issues in over 80% of cases. Unresolved data quality problems surface during UAT when business users start questioning the numbers, which is the most expensive time to fix them. We recommend a short data profiling sprint upfront so that any cleansing effort is scoped and funded before it becomes a timeline crisis. That protects both of us.'
    },
    {
      q: 'We can extract the data ourselves — you just need to build the pipelines on top.',
      a: 'We\'re happy to design the architecture around your extract capability, but the integration boundary needs to be precisely defined in the SOW — including format, frequency, completeness guarantees, and who is accountable when a feed fails. In our experience, handoff points with unclear ownership are where data projects lose the most time. If your team handles extracts, we\'ll include a documented interface contract and a formal SLA for feed delivery so there\'s no ambiguity during delivery.'
    },
    {
      q: 'Why does a BI project need so much governance work? We just want reports.',
      a: 'Governance work in a data project is not bureaucracy — it is the mechanism that stops your reports from contradicting each other six months after go-live. Without agreed data owners, authoritative definitions, and documented business rules, every department will calculate the same KPI differently, and the dashboards will lose credibility fast. The governance artefacts we produce are lightweight and practical — data dictionaries, ownership assignments, and a decision log — but they are what makes the analytics sustainable rather than a one-time deliverable.'
    }
  ],

  'gf-ai': [
    {
      q: 'Why not just use ChatGPT or an off-the-shelf AI model? Why is this so expensive?',
      a: 'Off-the-shelf models are a great starting point, and we build on them wherever possible — that\'s part of how we control cost. The investment is in the integration layer, the grounding data, the evaluation framework, and the safety and compliance controls that turn a general-purpose model into a reliable business tool. A generic model applied to your domain without prompt engineering, retrieval augmentation, and quality measurement will hallucinate at a rate your users will notice very quickly. We\'re pricing the work that makes it trustworthy, not just the API calls.'
    },
    {
      q: 'We have all the training data we need and it\'s already labelled.',
      a: 'That\'s a great position to be in, and if the data holds up to profiling we can move faster. In our experience, datasets that are assumed to be labelled often have inconsistent labelling conventions, class imbalances, or coverage gaps in edge cases that matter for production accuracy. We\'d like to include a data quality assessment milestone early in the project — it takes two to three days and either confirms your confidence or surfaces issues before they affect the model training timeline.'
    },
    {
      q: 'We don\'t need explainability — we just care about accuracy.',
      a: 'Accuracy without explainability is a risk that tends to surface at the worst possible moment — a regulator audit, a high-stakes decision that gets challenged, or a model behaviour that no one can explain to the press. Even in sectors without explicit AI regulation today, the EU AI Act and equivalent national frameworks are changing the landscape rapidly, and retrofitting explainability is far more expensive than building it in. We\'ll scope explainability proportionally to your regulatory exposure and risk tolerance, but we need to have that conversation explicitly rather than assume it is out of scope.'
    }
  ],

  'gf-dx': [
    {
      q: 'We\'ve already done the UX design internally — just build what we\'ve designed.',
      a: 'We\'re absolutely able to build to your existing designs, and we\'ll start with a design review to confirm technical feasibility, accessibility compliance, and interaction consistency before development begins. If we find issues in that review — and we frequently do — it is far cheaper to resolve them before a sprint starts than after code is written. We\'ll flag any concerns with recommended solutions and agree how to handle them, but we cannot accept designs as a fixed input without a brief validation step.'
    },
    {
      q: 'Accessibility is a nice-to-have — our users are internal employees, not the general public.',
      a: 'Accessibility obligations in most jurisdictions apply to enterprise applications as well as public-facing ones, and internal employees with disabilities have the same legal protection as external users. Beyond compliance, accessible applications typically have higher usability scores across all users, not just those with specific needs. We recommend building to WCAG 2.1 AA as a baseline — it adds a modest effort to implementation but eliminates a disproportionate legal and reputational risk.'
    },
    {
      q: 'The payment and identity integrations are the vendor\'s responsibility — we\'ll sort those out separately.',
      a: 'Third-party integrations that are managed separately are the most common cause of go-live delays on digital experience projects. If we cannot test against a payment sandbox or identity provider before UAT, we are effectively building blind to a major risk. We\'d like to include a third-party integration readiness milestone in the project plan, owned by your team, so that by the time we reach integration testing all vendor APIs are available and contracts are signed.'
    }
  ],

  'gf-erp': [
    {
      q: 'We\'ve done SAP before — this should be straightforward.',
      a: 'Previous SAP experience absolutely helps, and we\'ll build on your institutional knowledge throughout the project. The risk we see with experienced clients is that the assumptions from the last implementation — organisational structure, data quality, process maturity — are applied to this one without re-validation. Every ERP project is a business transformation as much as a technical one, and the differences between your last state and your current TO-BE are where the real complexity lives. A targeted discovery phase protects your investment by surfacing those differences before they become change requests.'
    },
    {
      q: 'The vendor says their out-of-the-box functionality covers 90% of our needs — this should be a small project.',
      a: 'Vendor estimates of out-of-the-box coverage typically measure feature availability, not process fit — and the 10% gap is rarely the simple 10%. In our experience, that residual gap often includes the most business-critical processes, and the configuration and change management work to close it can represent 40–60% of delivery effort. We\'ll validate the coverage claim during discovery with your process owners and give you a firmer view of the real fit gap before we commit to a delivery model and price.'
    },
    {
      q: 'Change management isn\'t in scope — our team will handle user adoption internally.',
      a: 'We respect that decision and we\'ve delivered successfully with client-led change management before. What we need from your team is a named change lead with dedicated capacity, a communications plan, and a training delivery schedule aligned to our sprint calendar — because if those are not in place, go-live adoption rates fall and our system gets blamed for a change management failure. If you can confirm those three things, we\'ll build the integration points into our plan and support your team with the artefacts they need.'
    }
  ],

  'gf-cloud-native': [
    {
      q: 'Cloud is just infrastructure — why does this need a development team?',
      a: 'Modern cloud-native delivery is primarily a software engineering discipline — infrastructure as code, CI/CD pipeline design, security policy as code, and observability tooling are all software artefacts that require the same engineering rigour as application code. A cloud environment provisioned by clicking in the console is not repeatable, auditable, or safe to hand back to your operations team. The value we deliver is a cloud environment that your team can operate, evolve, and audit without depending on the people who built it.'
    },
    {
      q: 'Our cloud costs are under control — we don\'t need FinOps work.',
      a: 'Cloud cost control tends to feel manageable at the point of initial deployment and starts to drift as workloads scale and teams add resources independently. The time to establish tagging standards, budget alerts, and a cost accountability model is before that drift begins, not after the first quarter-end surprise. We\'re proposing a lightweight FinOps foundation — not an ongoing managed service — that gives your team the tools to maintain control themselves without any dependency on us post-delivery.'
    },
    {
      q: 'We want a multi-cloud strategy to avoid vendor lock-in.',
      a: 'Multi-cloud is a legitimate strategy and we design for it when it is commercially and operationally justified. The honest conversation is that genuine multi-cloud portability requires investment in abstraction layers, consistent tooling choices, and operational complexity that typically costs more than the lock-in risk it mitigates — especially at the scale of most initial cloud programmes. We\'d like to work through the specific lock-in risks you are concerned about and design the right level of portability for your situation, rather than defaulting to multi-cloud as a blanket approach.'
    }
  ],

  'gf-integration': [
    {
      q: 'Integration is just plumbing — why does it need an architect?',
      a: 'Integration design decisions made early — event schema design, error handling strategy, idempotency patterns, API versioning policy — have a compounding effect on the maintainability and resilience of the platform for years after delivery. Poor integration architecture is one of the most expensive technical debts to remediate because it touches every consuming system simultaneously. An architect at the start prevents patterns that look fine in development and fail catastrophically in production under load or partial failure conditions.'
    },
    {
      q: 'The consuming teams will update their systems to use the new APIs — we don\'t need to manage that.',
      a: 'We fully expect consuming teams to own their integration work, and we\'ll support them with documentation and sandbox access. The risk we want to mitigate is consuming teams requesting schema or contract changes mid-delivery that generate rework on our side without a change control process. We\'d like to establish a simple API contract governance process — a schema registry and a change-request workflow — so that any API changes go through a controlled process rather than arriving as informal requests during a sprint.'
    },
    {
      q: 'We have a simple point-to-point integration — we don\'t need a full ESB or event streaming platform.',
      a: 'If the integration scope is genuinely point-to-point and is unlikely to grow, a lightweight approach is absolutely appropriate and we\'ll design accordingly. What we want to validate is the growth trajectory — point-to-point architectures that scale to more than five or six connections become exponentially harder to manage, and retrofitting an integration platform later costs significantly more than designing for it from the start. A short scoping conversation about your integration roadmap will let us right-size the approach with confidence.'
    }
  ],

  'bf-migration': [
    {
      q: 'Migration is just copy-paste — why does it take this long and cost this much?',
      a: 'Data migration appears simple until you encounter the gap between what the source system stores and what the target system requires — different schemas, different data models, different referential integrity rules, and years of accumulated data quality debt. The time is in profiling, mapping, cleansing, reconciliation, and the dry-run cycles needed to make the cutover safe. A migration that goes wrong at cutover can take a business offline for days; the upfront investment in rigour is what prevents that outcome.'
    },
    {
      q: 'We don\'t need a rollback plan — we\'re fully committed to the new platform.',
      a: 'Commitment to the new platform is exactly the right mindset, and a rollback plan does not contradict that commitment — it is a safety mechanism you hope to never use. Go/no-go criteria and a rollback procedure give your leadership team the confidence to proceed with cutover, because they know that if a critical issue surfaces in the first 24 hours there is a structured response rather than a crisis. In our experience, clients without a rollback plan tend to delay go-live indefinitely rather than accept the residual risk of proceeding without one.'
    },
    {
      q: 'Our legacy system documentation is good enough to migrate from.',
      a: 'We\'ll take you at your word on that and we\'d like to validate it during a documentation review early in the project. In our experience, "good enough" documentation tends to cover the main flows well and have significant gaps in edge cases, exception handling, and historical data transformations that are not in the system — they\'re in the heads of people who have worked with it for years. Identifying those gaps early means we can address them with targeted workshops rather than discovering them during a dry run when the timeline is at risk.'
    }
  ],

  'bf-modernisation': [
    {
      q: 'Why do we need a discovery phase? We know our own systems.',
      a: 'Your team\'s knowledge of the business logic and operational behaviour of the system is invaluable and we\'ll rely on it throughout the project. What discovery surfaces is the things no one has needed to articulate before — undocumented integrations, implicit business rules embedded in code, shared database dependencies between systems that were supposed to be independent. These are not gaps in your team\'s knowledge; they are artefacts of organic system growth that only become visible when you try to move them. Two to three weeks of structured discovery typically saves months of rework later.'
    },
    {
      q: 'We want to modernise the whole system in one release — incremental is too slow.',
      a: 'We understand the appeal of a single clean cutover, and if the system is small enough we can design for that safely. For larger systems, big-bang modernisation projects have a significantly higher failure rate than incremental approaches — not because of execution quality but because the integration surface and test coverage required to safely replace everything at once grows non-linearly with system size. We\'ll propose the fastest safe approach for your specific system and be explicit about the risk profile of each option so you can make an informed decision.'
    },
    {
      q: 'We don\'t have budget for training — our developers will learn the new stack on the job.',
      a: 'Learning on the job during a modernisation project works well when the learning is structured and the team has protected time for it — it is not effective when it competes with sprint velocity commitments. What we propose is structured knowledge transfer embedded in delivery: pair programming, architecture review sessions, and explicit time in each sprint for capability building. This does not require a separate training budget; it requires an honest velocity expectation that accounts for learning time rather than assuming full productivity from day one on an unfamiliar stack.'
    }
  ],

  'bf-ams': [
    {
      q: 'We want a fixed monthly price for support — we don\'t know what we\'ll need.',
      a: 'A fixed monthly retainer works well when we can agree the scope of what is included — service tiers, incident response SLAs, change request capacity, and clear exclusions for major enhancements. Without those parameters, a fixed price forces us to price conservatively to cover worst-case scenarios, which typically costs you more than a capacity-based model would. Let us work through a service catalogue together and we\'ll give you the predictability you want with a price that reflects your actual expected demand.'
    },
    {
      q: 'Why do we need a dedicated team for AMS? Our developers can handle support alongside project work.',
      a: 'Development teams context-switching between new feature delivery and production incidents consistently underperform on both. Production support has different skills requirements, different SLA pressures, and different tooling from greenfield development — and incidents do not respect sprint boundaries. A dedicated support capability protects your development team\'s productivity and gives you a team that is measured on operational outcomes rather than story points. The cost is typically recovered in the first quarter through reduced incident duration and faster resolution times.'
    },
    {
      q: 'We only need break-fix support — we don\'t need proactive monitoring or optimisation.',
      a: 'Break-fix support is the minimum viable model and we can absolutely operate that way. The risk is that reactive support is inherently more expensive per incident than proactive monitoring, because issues are discovered by users rather than by tooling, and the blast radius by then is larger. We recommend a lightweight proactive layer — alerting thresholds and a weekly health check — as a baseline that typically prevents the two or three P1 incidents per year that cost more than the monitoring service itself.'
    }
  ],

  'bf-security': [
    {
      q: 'You\'re doing a pen test, not building software — why is it this expensive?',
      a: 'A professional penetration test involves weeks of manual exploitation, business logic testing, and attack chain analysis that automated scanners cannot perform. The report you receive is only valuable if it tells you something an automated scan would not — and that requires experienced security engineers spending significant time understanding your specific application and infrastructure context. What you are paying for is the assurance that a skilled attacker with your attack surface would have found your critical vulnerabilities before a malicious one did.'
    },
    {
      q: 'We just need a report for the auditor — we\'re not planning to remediate everything.',
      a: 'We will produce a report that meets your audit requirements, and we respect that remediation is a business prioritisation decision. What we would caution against is treating the report as the end of the engagement — an auditor\'s approval and a secure posture are not the same thing, and a report that documents critical unpatched vulnerabilities can become a liability document if an incident occurs. We recommend at minimum agreeing a remediation plan for critical and high findings, even if the timeline extends beyond the project, so you have a documented risk acceptance position.'
    },
    {
      q: 'We\'ve passed our ISO 27001 audit — our security posture is already strong.',
      a: 'ISO 27001 certification is a meaningful baseline for security management processes, and we\'ll use your existing controls documentation to focus our assessment rather than starting from scratch. Certification confirms that your security management system meets the standard\'s requirements at the time of audit — it does not continuously validate the technical security of individual applications or the effectiveness of those controls against current attack techniques. A targeted technical assessment complements your certification by testing whether your policies translate into a secure operational posture.'
    }
  ],

  'bf-testing': [
    {
      q: 'We already have a QA team — why do we need you to build test automation?',
      a: 'Your QA team\'s domain knowledge is exactly what makes this engagement valuable, and we\'ll be working with them rather than replacing them. What we bring is the automation engineering capability and framework architecture to convert their manual test knowledge into a sustainable automated suite — a different skill set from manual testing expertise. The outcome is your QA team running and maintaining automation they understand and own, not a dependency on us for every test run.'
    },
    {
      q: 'Automated testing will slow down our development team during a critical delivery phase.',
      a: 'Introducing test automation to a team mid-sprint does create a short-term friction, which is why we recommend starting with the regression suite rather than embedding in the active development flow. The productivity case for automation is well-evidenced: teams with mature automated regression suites deploy more frequently, with higher confidence, and spend significantly less time on manual regression cycles before each release. The short-term friction is an investment in release velocity, not a drag on it.'
    },
    {
      q: 'We don\'t need performance testing — our system handles the current load fine.',
      a: 'Current load and projected load are often very different numbers, and performance issues typically emerge as non-linear scaling problems that are invisible at low volume. The cost of discovering a performance ceiling in production — with real users and reputational exposure — is orders of magnitude higher than finding it in a controlled load test. Performance testing is not just about finding problems; it gives your architecture team evidence-based capacity planning data that informs infrastructure decisions for the next 12–24 months.'
    }
  ]
}
