# Orchestrator examples and dogfood log

## 2026-08-17 — conversation corpus extraction (research evidence, not dogfood)

**Corpus:** three historical user orchestration commands across 36 tasks, plus the current research request. The full inventory and deduplication method are in `research/orchestrator-conversations.md`.

Recurring execution shape:

1. Inspect authoritative state before splitting work.
2. Define the target and non-negotiables.
3. Delegate bounded, independent discovery or implementation.
4. Keep structural seams and integration under root control.
5. Question results instead of trusting worker completion language.
6. Continue independent paths around blockers.
7. Deliver evidence, links, checks, and honest limitations.

Important correction supplied by Ty after the corpus review:

> The orchestrator is the sole owner of readiness, task progression, questioning results, and keeping agents on track.

That correction became the root identity gate, worker downgrade rule, Submitted→Challenged boundary, and completion gate in v0.1.

**Dogfood status:** none. This is retrospective source evidence only.

## Live dogfood template

```text
Date / target:
Program shape:
Why orchestration materially helped:
Target ledger location:
Workstreams and write claims:
Worker submission challenged:
Integrated verification:
Blocker or target-change behavior:
Score (READINESS.md):
Friction discovered:
Methodology change made:
Remaining gap:
```
