# Orchestrator

**Own complex multi-agent delivery from target definition through verified acceptance.**

Extracted from Ty's recurring “orchestrator” commands and the behavior of the agents that executed them. The defining rule is not parallelism: one root agent remains solely accountable for readiness, progression, challenge, integration, and final delivery.

## Status

**🧪 v0.2 candidate** — one live Connect dogfood completed at 8/11; its ledger failures are now regression-tested. A second independent passing dogfood and a passing rerun remain required. Do not call this v1 or production-proven.

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
- `src/validate-ledger.mjs` — deterministic root-ownership and readiness validator
- `src/ledger-state.mjs` — validated, atomic revision and completion lifecycle changes
- `evals/conformance.test.mjs` — positive and negative conformance fixtures
- `scripts/sync-skill-assets.mjs` — canonical-source synchronization and drift check
- `scripts/verify.mjs` — one-command pack verification

## Verify

```bash
node orchestrator/scripts/verify.mjs
```

`shared/`, `src/`, and `examples/` are canonical. Run `node orchestrator/scripts/sync-skill-assets.mjs` after changing them. The local verification command rejects drift between canonical sources and the self-contained installed skill.

The orchestrator does not install or require a hosted verification mechanism. It discovers and honors any local checks, PR verification, merge gates, or release tests already defined by the target repository.

## Install

The distributable unit is `skills/orchestrator/`; it contains every runtime reference, script, and example without links outside the directory.

```bash
npx skills add tjcages/skills --skill orchestrator
```

The repository install command becomes authoritative after the orchestrator branch merges to the default branch. Before then, review or copy the complete `orchestrator/skills/orchestrator` directory from PR #10. Do not install only `SKILL.md`. To upgrade an existing copy, compare local modifications before replacement and run the bundled v1→v2 ledger migration before resuming active programs.

## Release gate

1. Re-run one live program with the hardened v0.2 ledger contract and score 11/11.
2. Run a second independent program where parallel work materially helps.
3. Demonstrate target-change handling and resumption after context compaction.
4. Score every release-blocking dimension in `READINESS.md` as passing twice.
5. Fold observed friction into the methodology before v1.

## Source research

- [`../research/orchestrator-conversations.md`](../research/orchestrator-conversations.md)
- [`../research/orchestrator-skill-contract.md`](../research/orchestrator-skill-contract.md)
- [`../research/orchestrator-quality-bar.md`](../research/orchestrator-quality-bar.md)
