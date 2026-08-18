# Orchestrator

![Orchestrator](./orchestrator.png)

**Assign one agent as orchestrator. It spins up a team of agents and manages the complete build-out of your goal.**

The orchestrator scopes the work, hands out assignments that cannot collide, reviews what each worker turns in, fits the pieces together, and proves the result before calling it done. The rule underneath all of it: one agent stays answerable for the whole thing. Extracted from Ty's recurring "orchestrator" commands and the behavior of the agents that executed them.

## Status

**🧪 v0.2 candidate** — one live dogfood completed at 8/11; its ledger failures are regression-tested and the full workstream lifecycle is now CLI-driven. A second independent passing dogfood and a passing rerun remain required. Do not call this v1 or production-proven.

## Core creed

> Delegation moves work, never accountability. Workers submit; the root accepts. Activity is not progress; accepted evidence is progress. Unverified is not done. A blocker limits one path, not the root's obligation to advance every other authorized path.

## No overwrites

The recurring failure of parallel agents is writers silently clobbering each other. The ledger makes ownership mechanical: every writer records explicit, glob-free, case-insensitive write claims, the validator rejects any overlap, and a claim is held from assignment until the root integrates, rejects, supersedes, or stops the work — a submitted-but-unintegrated diff still owns its paths.

## Pack contents

- `shared/METHODOLOGY.md` — root control loop, state machine, gates, and failure handling
- `shared/WORKER-CONTRACT.md` — mandatory assignment and report formats
- `shared/READINESS.md` — target ledger, completion gate, and scorecard
- `shared/RESPONSE.md` — compact user-facing progress contract
- `shared/EVALS.md` — trigger, behavior, and regression evaluations
- `shared/EXAMPLES.md` — research provenance and dogfood log
- `src/validate-ledger.mjs` — deterministic root-ownership and readiness validator
- `src/ledger-state.mjs` — validated, atomic workstream, revision, and completion lifecycle changes
- `evals/` — positive and negative conformance fixtures plus lifecycle tests
- `scripts/verify.mjs` — one-command pack verification, including source↔install drift

## Verify

```bash
node orchestrator/scripts/verify.mjs
```

`shared/`, `src/`, and `examples/` are canonical. Run `node orchestrator/scripts/sync-skill-assets.mjs` after changing them; verification rejects drift between canonical sources and the self-contained installed skill.

The orchestrator does not install or require a hosted verification mechanism. It discovers and honors any local checks, PR verification, merge gates, or release tests already defined by the target repository.

## Install

The distributable unit is `skills/orchestrator/`; it contains every runtime reference, script, and example without links outside the directory.

```bash
npx skills add tjcages/skills --skill orchestrator --global --yes
```

The skill is listed at [skills.sh/tjcages/skills/orchestrator](https://skills.sh/tjcages/skills/orchestrator). Do not install only `SKILL.md`. To upgrade an existing copy, compare local modifications before replacement and run the bundled v1→v2 ledger migration before resuming active programs.

## Composes with

- [`agent-worktrees`](../agent-worktrees/) — write claims say who owns which paths; worktrees keep the writers physically isolated.
- `linear-discipline` — the root closes the tracker loop as part of integration, not after delivery.
- Cleanup passes (slop review, simplification) run as root-owned integration waves, never as worker side quests.

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
