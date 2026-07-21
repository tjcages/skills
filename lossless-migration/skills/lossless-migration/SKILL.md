---
name: lossless-migration
version: 0.1.0
description: >-
  Inventory-before-rewrite: map every table/endpoint/engine/UI to a destination
  tag, prove zero regressions, retire only when replacement is live. Use when
  migrating/reframing an existing product, consolidating AI engines, or the user
  asks for an inventory audit / lossless migration / “don’t lose anything.”
  NOT for green-field apps with nothing to preserve.
---

# Lossless migration

Chat: [RESPONSE.md](./RESPONSE.md). Full method: [METHODOLOGY.md](./METHODOLOGY.md).

## Operating order

### 1. Migration or skip? (§1)

Green-field / toy → skip. Existing users/behaviors → continue. No constitution → hand to `constitution-first` first.

### 2. Wire the trio (§2)

Constitution (why) · inventory audit (proof) · roadmap (phases). Confirm conflict rule.

### 3. Enumerate (§4.1)

Data · endpoints · engines · UI · primitives · one-offs. Breadth before deep mapping.

### 4. Tag every row (§3–§4.2)

One primary destination tag + one-line mapping. Escalate unknowns — no silent skips. Optional blank: [inventory-audit.template.md](./inventory-audit.template.md).

### 5. Verdict + GAP/RETIRE (§4.3–§4.4)

Reframe % · consolidate % · GAP list · RETIRE list (supersede + phase).

### 6. Engine collapse if needed (§5)

Cluster AI/functions into one registry; old callers thin then die.

### 7. Roadmap + score (§6–§9)

Invisible→visible→scrub. Rubric ≥12/16, no 0 on #1–#5. Log EXAMPLES.md same day.

### 8. Hand off

Phases → `linear-setup`. Agent writes → `accept-gated-ai`. Multi-platform parity → `behavior-contracts`.

## Out of scope

Authoring the product creed (`constitution-first`). Accept-gate UX detail (`accept-gated-ai`). Coding worktree isolation (`agent-worktrees`).
