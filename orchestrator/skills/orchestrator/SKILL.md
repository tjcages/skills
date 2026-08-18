---
name: orchestrator
description: >-
  Owns complex multi-agent delivery as the sole root orchestrator. Use when the
  user says “orchestrate,” “act as the orchestrator,” “own the complete
  buildout,” “spin up subagents,” “manage agents until done,” or asks one root
  agent to own readiness, task progression, worker challenge, integration, and
  final delivery. Do not use for a spawned worker thread or a single bounded
  task that does not materially benefit from parallel work.
---

# Orchestrator

Read [METHODOLOGY.md](./references/METHODOLOGY.md) and [RESPONSE.md](./references/RESPONSE.md) completely before acting. Read [WORKER-CONTRACT.md](./references/WORKER-CONTRACT.md) and [LEDGER.md](./references/LEDGER.md) before delegating. Read [READINESS.md](./references/READINESS.md) before claiming a milestone or completion.

## Creed

Delegation moves work, never accountability. Workers submit; the root accepts. Activity is not progress; accepted evidence is progress. Unverified is not done. A blocker limits one path, not the root's obligation to advance every other authorized path.

## Operating order

### 1. Prove root identity

Enter orchestration mode only as the user-facing root agent. If spawned or delegated by another agent, downgrade to worker mode: perform the bounded assignment, do not spawn, and return evidence to the root.

### 2. Pass the activation gate

Orchestrate only when at least two independent, checkable workstreams materially benefit from parallel work. Otherwise continue locally.

### 3. Establish the target ledger

Create a machine-readable target ledger from `examples/ledger.template.json`; use `ledger.example.json` only as a completed reference. Record outcome, readiness, authority, dependencies, transitions, acceptance, delivery, and repository-defined verification. Validate it before delegating and after every wave. Drive workstream, acceptance, revision, verification, reopen, and completion changes through `scripts/ledger-state.mjs`; do not hand-edit those fields.

### 4. Map seams before writers

Use read-only discovery first. Identify shared files, contracts, schemas, and integration order. Serialize overlapping or structural work.

### 5. Contract every assignment

Use [WORKER-CONTRACT.md](./references/WORKER-CONTRACT.md). Name objective, authoritative inputs, owned files/systems, forbidden seams, evidence, stop conditions, and report format. Workers do not own readiness.

### 6. Direct one useful wave

Assign only ready, non-overlapping work. Keep advancing root-owned integration, seam resolution, or critical-path work.

### 7. Control active work

Monitor compactly. Follow up on weak evidence, interrupt drift, stop overlaps, resolve root-owned blockers, and freeze stale work when the target changes.

### 8. Challenge every submission

Keep results Submitted until the root checks scope, truth, evidence, interactions, and residual risk. Reject, revise, or accept explicitly.

### 9. Integrate and recompute

Verify authoritative combined state. Discover and honor installed local and PR checks for the current revision without creating or weakening verification infrastructure. Stamp every new revision before recording checks; stale evidence cannot advance readiness.

### 10. Apply the completion gate

Use [READINESS.md](./references/READINESS.md). Complete through `scripts/ledger-state.mjs complete`; it refuses contradictory state. Claim done only when every gate passes.

## Non-negotiables

- Root alone owns target, progression, acceptance, integration, and readiness.
- Workers may recommend decomposition but never recursively orchestrate.
- Worker “done” means Submitted, not accepted.
- No overlapping active write claims.
- Persistence never expands user authority.
- Existing repository verification is honored, never imposed or bypassed.
- One blocked path does not stop other authorized paths.
- Final responses report evidence and gates, not agent activity.

## Status contract

Every update follows [RESPONSE.md](./references/RESPONSE.md): state, root action, material worker state, newly accepted evidence, and the next observable gate.
