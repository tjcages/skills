# Orchestrator

**Own complex multi-agent delivery from target definition through verified acceptance.**

Extracted from Ty's recurring “orchestrator” commands and the behavior of the agents that executed them. The defining rule is not parallelism: one root agent remains solely accountable for readiness, progression, challenge, integration, and final delivery.

## Status

**✍️ v0.1 draft** — research-derived and structurally validated. No live dogfood yet. Do not call this v1 or production-proven.

## Skill

| Skill | Job |
|---|---|
| `orchestrator` | Run a root-owned, evidence-gated multi-agent program |

## Core creed

> Delegation moves work, never accountability. Workers submit; the root accepts. Activity is not progress; accepted evidence is progress. Unverified is not done. A blocker limits one path, not the root's obligation to advance every other authorized path.

## Pack contents

- `shared/METHODOLOGY.md` — root control loop, state machine, gates, and failure handling
- `shared/WORKER-CONTRACT.md` — mandatory assignment and report formats
- `shared/READINESS.md` — target ledger, completion gate, and scorecard
- `shared/RESPONSE.md` — compact user-facing progress contract
- `shared/EVALS.md` — trigger, behavior, and regression evaluations
- `shared/EXAMPLES.md` — research provenance and future dogfood log

## Release gate

1. Run two independent live programs where parallel work materially helps.
2. Include at least one rejected or corrected worker submission.
3. Demonstrate resumption after context compaction from the persisted ledger.
4. Score every release-blocking dimension in `READINESS.md` as passing.
5. Fold observed friction into the methodology before v1.

## Source research

- [`../research/orchestrator-conversations.md`](../research/orchestrator-conversations.md)
- [`../research/orchestrator-skill-contract.md`](../research/orchestrator-skill-contract.md)
