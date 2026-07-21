---
name: accept-gated-ai
version: 0.1.0
description: >-
  Make write-access AI trustworthy: every edit diffed, accept-gated, reversible,
  proportional, and willing to do nothing. Use when designing or auditing an
  agent that creates/updates/deletes user data, when adding overnight/batch AI
  passes, when a product’s AI writes feel silent or over-eager, or when the user
  asks for accept-gates / EditProposal / proposal substrate / undo-before-delete.
  NOT for read-only Q&A bots or coding-agent file isolation (see agent-worktrees).
---

# Accept-gated AI

Chat: [RESPONSE.md](./RESPONSE.md). Full method: [METHODOLOGY.md](./METHODOLOGY.md).

## Operating order

### 1. Need write-access AI? (§1)

Read-only → skip. Silent enrichment already writing user fields → treat as leak audit (§9).

### 2. State the five laws (§2)

Diffed · accept-gated · original preserved · proportional+quiet · undo after accept. Confirm they belong in the product creed / agent rules.

### 3. Map write sites (§9)

Enumerate every tool verb / code path that mutates user-owned data. Classify: gated / apply+undo / declared exception / leak.

### 4. Substrate or fix (§3–§6)

Missing proposals → design pending→accept/dismiss with per-field diff, why, provenance, dedupe, stale refuse. Missing undo → block destructive verbs. Name §5 exceptions out loud.

### 5. UI contract (§3.3)

AI marker · source/why · dismiss · (optional) volume control. Blind accept is not a gate.

### 6. Score (§10)

Rubric ≥12/16, no load-bearing 0 on #1–#5. Log friction in EXAMPLES.md same day.

### 7. Hand off

Creed home → `constitution-first`. Tracked gaps → Linear. Platform parity of the gate UX → `behavior-contracts`.

## Sub-flows

| Ask | Move |
|---|---|
| Audit an existing AI-write path | §9 + §10 |
| Design proposal substrate | §3 |
| Agent CRUD tool registry | §4 + §6 |
| Overnight / batch pass | §7 (proposals only, quiet-by-default) |

## Out of scope

Authoring a full product manifesto (use `constitution-first`). Inventory tables for migrations (`lossless-migration`). Coding-agent worktree isolation (`agent-worktrees`). Building Socials UI in this pack’s name.
