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

**Dogfood status:** retrospective evidence only. The first live dogfood is recorded below.

## 2026-08-17 — anti-slop quality benchmark (architecture evidence, not dogfood)

**Reference:** [dmmulroy/anti-slop](https://github.com/dmmulroy/anti-slop)

Quality traits adopted into this pack:

1. canonical sources synchronized into a self-contained installed skill;
2. deterministic drift detection instead of trusting duplicated assets;
3. positive and negative executable conformance cases;
4. one local verification command covering the complete pack;
5. explicit installation, upgrade, source-of-truth, and lifecycle boundaries.

Domain-specific Oxlint rules and vendoring behavior were not copied. For orchestrator, executable enforcement applies to ledger consistency; live dogfood must still prove agent behavior and real-world evidence quality.

## 2026-08-17 — Connect speaker partial frames (live dogfood 1)

**Target:** [Cloudflare Connect PR #77](https://github.com/tjcages/cloudflare-connect-2026/pull/77), merged as `182d32b`. Two read-only audits mapped the current site and engine seams before one bounded writer implemented the speaker effect.

**What worked:** root identity remained singular; write claims did not overlap; the root rejected an initial compositor that performed one full-canvas blit per mask fragment; the revision used one compound clip and one blit; integrated tests, browser checks, PR checks, deployed preview, and merge evidence were collected.

**Score:** **8/11**. Passed root identity, dependency graph, worker contracts, write ownership, challenge, integration, blocker behavior, and authority. Failed target-ledger currency, verification compatibility, and completion.

**Friction:**

1. The 480-line hand-edited ledger drifted across related fields.
2. `nextGate` said Complete while the program and root integration remained active.
3. Passing evidence named final revision `6350c3b`, while structured verification remained on `0d814e2` and required local checks were unavailable.
4. User-requested scope expansions were appended without an explicit re-contract event.
5. The ledger entered product history and required a cleanup commit before review.

**Methodology changes folded into v0.2:** cross-record completion invariants; exact revision fields on passing checks; a readiness criterion linked to verification; dependency readiness enforcement; atomic revision/check/reopen/complete commands; external or explicitly ignored ledger storage by default.

**Remaining gap:** re-run on a new live revision to prove the hardened lifecycle, then complete an independent second dogfood with explicit target change and compaction recovery.

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
