---
name: behavior-contracts
version: 0.1.0
description: >-
  Keep multi-platform products behaviorally one product: write platform-neutral
  behavior contracts per form/primitive, let each kit satisfy them natively,
  audit contract drift (not screenshots). Use when adding a second surface
  (web/iOS/macOS), when parity tickets pile up, when lightboxes/composers fork,
  or the user asks for behavior contracts / platform parity / kit drift.
  NOT for single-platform apps or pure visual QA.
---

# Behavior contracts

Chat: [RESPONSE.md](./RESPONSE.md). Full method: [METHODOLOGY.md](./METHODOLOGY.md).

## Operating order

### 1. Need contracts? (§1)

One platform forever → skip. Second surface or parity pile-up → continue.

### 2. WHAT/HOW clear? (§0)

Domain forms vs kit presentation. No WHAT nouns → `constitution-first` first.

### 3. Author contracts (§4)

Per form: name · verbs (≤12) · invariants · kit owners · 90/10 · one parity check.

### 4. Install (§3)

Constitution chapter and/or `docs/behavior-contracts.md`, linked from agent instructions.

### 5. Drift audit (§6)

Verb × platform = present / partial / missing. File gaps. Log EXAMPLES.md.

### 6. Score (§8)

≥12/16, no 0 on #1–#5.

### 7. Hand off

New surfaces in a migration → `lossless-migration` phase rules.
AI accept/diff verbs → `accept-gated-ai`.

## Out of scope

Pixel-matching. Shared-code mandates. Single-platform kits. Building Socials UI in this pack’s name.
