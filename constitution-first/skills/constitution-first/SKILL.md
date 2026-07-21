---
name: constitution-first
version: 0.1.0
description: >-
  Author and govern a product North Star (constitution) that every feature is
  judged against — premise, non-negotiables, creed, decision checklist, conflict
  rule. Use when starting a non-trivial product/tool, when agents disagree about
  what the product is, when the user asks for a manifesto / constitution / north
  star / principles doc, before linear-setup on a project with no theory doc, or
  when running a drift audit against an existing constitution. NOT for ticket
  CRUD or disposable weekend scripts.
---

# Constitution-first

Chat: [RESPONSE.md](./RESPONSE.md). Full method: [METHODOLOGY.md](./METHODOLOGY.md).

## Operating order

### 1. Already have a North Star? (§1)

Search manifesto / VISION / README principles. If good enough → say so; offer drift audit or checklist install. Do not rewrite.

### 2. Calibrate size (§1 table)

Toy → skip. Tool → ≤1 page. Product → full form (§3) + companions as needed (§4).

### 3. Ask anchoring questions (§2)

Pitch, who-for, non-negotiables, out-of-scope, philosophical done, broken pattern. **Confirm before writing files.**

### 4. Write the constitution (§3)

Theory, not feature list. End with Creed + decision checklist.

### 5. Wire companions if needed (§4)

Proof for migrations → hand to `lossless-migration`. Plan for phases → hand to `linear-setup`.

### 6. Install the checklist (§5)

Link constitution from always-loaded agent instructions. State the conflict rule (§7).

### 7. Done check (§9)

Rubric ≥10/14, no load-bearing zeros on #1–#4.

## Sub-flows

| Ask | Skill |
|---|---|
| Write / bootstrap a constitution | `constitution-write` (same pack — follow §2–§5 here until split hardens) |
| Drift audit / health vs creed | `constitution-audit` (§6) |

## Out of scope

Linear issue filing (use `linear-setup`). Accept-gated AI deep doctrine (sibling). Inventory tables (sibling `lossless-migration`).
