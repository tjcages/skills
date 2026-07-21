# EXAMPLES — accept-gated-ai dogfood

## 2026-07-21 — Tasks agent rules (Linear OFF-183 / OFF-174 / OFF-187 / OFF-189)

**Context:** Socials git tree not available in this cloud env (`tjcages/socials` private). Dogfooded the methodology against Tasks’ documented agent direction + Obi substrate issues (KICKOFF-allowed path). Manifesto Parts VI/XI/XII read from Linear doc [The Manifesto](https://linear.app/off-brand-studio/document/the-manifesto-b2413f5b87dd).

**Write-site map (from issues, not live checkout):**

| Site | Class |
|---|---|
| `create_todo` via archive-chat structured output | User-explicit create — needs undo (OFF-174 shipped) |
| Proactive / stream suggestions → primary to-do list | **Leak risk** if inserted without suggestion lane (OFF-187/189) |
| `categorizeItem` silent `kind` / `aiSummary` / `aiTags` / `projectId` | **Declared-or-leak tension** (OFF-187 names it vs Creed #6) |
| Overnight rethink → `atom_proposals` | Gated (OFF-36 / OFF-32) — reference good path |
| Agent delete / complete / reschedule | Blocked until undo; CRUD registry incomplete (OFF-183) |

**Rubric score (Tasks-as-designed today):** **9/16**

| # | Score | Note |
|---|---|---|
| 1 Thesis in-repo | 1 | Manifesto creed exists on Obi; Tasks agent rules not yet a stated five-laws block |
| 2 Proposal substrate | 2 | `atom_proposals` pending→accept/dismiss + per-field diff (OFF-32) |
| 3 Diff visible in UI | 1 | EditProposal path exists on Obi; Tasks suggestion UI still backlog (OFF-189) |
| 4 Stale/conflict | 2 | accept refuses stale diffs / 409 (OFF-32) |
| 5 Undo/changelog | 2 | OFF-174: undo from mutations; changelog `editedBy: "ai"` on accept |
| 6 Quiet + proportional | 1 | Doctrine yes; chat agent still always-on create bias |
| 7 Create vs edit lanes | 0 | OFF-187: can propose edits, not creates; proactive creates lack provenance/dedupe |
| 8 Exceptions declared | 0 | Silent categorize path called out but not constitutionally declared |

**Load-bearing zeros:** #7, #8 → not accept-gate-ready for expanding agent CRUD / suggestions.

**Friction absorbed into methodology same day:**

1. **Interactive create ≠ proactive create.** User-asked `create_todo` with mandatory undo can apply; agent-initiated rows need the suggestion lane (folded into §3.4 + §4).
2. **Undo is a gate prerequisite, not polish.** OFF-174 before OFF-183 delete — now §4 + §6 hard rule.
3. **Unnamed enrichment is the real Creed #6 leak.** OFF-187’s categorize tension → §5 “declared exceptions.”
4. **Blind trust fails silently.** OFF-189’s premise (“list fills with rows you didn’t write”) → UI contract §3.3 + anti-pattern row.

**Next dogfood (blocked on access):** live Socials checkout — score EditProposal UI + enumerate every `propose*` / direct AI write in `atom.server.ts` against §10.

## 2026-07-21 — Obi Phase 3 accept-gated path (second dogfood, docs)

**Evidence:** Linear [Step-Zero Inventory Audit](https://linear.app/off-brand-studio/document/step-zero-inventory-audit-b4f1eb4d2943) + [Migration Roadmap](https://linear.app/off-brand-studio/document/migration-roadmap-effbf53b4f6f) (repo trees still private). Phase 3e claims accept-gated edit shipped (`atom_proposals` + morning-inbox UI); roadmap doctrine: “Optimistic everywhere, accept-gated for Obi.”

**Rubric (Obi IN-loop path as documented):** **14/16**

| # | Score | Note |
|---|---|---|
| 1 Thesis in-repo | 2 | Creed #5–#7, #9 + Part VI in manifesto |
| 2 Proposal substrate | 2 | `atom_proposals` + unioned listProposals |
| 3 Diff visible in UI | 2 | Edge-pull diff / morning triage (shipped Phase 3e) |
| 4 Stale/conflict | 2 | Refuse stale / 409 (OFF-32); §3.5 still light on three-way UI |
| 5 Undo/changelog | 2 | Changelog facet + `editedBy: "ai"` |
| 6 Quiet + proportional | 2 | Part VI quiet laws; overnight → proposals (OFF-36) |
| 7 Create vs edit lanes | 1 | opportunities + atom_proposals both “Obi proposes”; create-todo suggestions still Tasks gap |
| 8 Exceptions declared | 1 | categorize/enrichment still not a named exception list in-repo agent-trust doc |

**Pass threshold met for the Obi accept-gated *edit* path** (≥12, no 0 on #1–#5). Tasks expansion still fails #7/#8 (first dogfood).

**Friction → v0.2 methodology same day:**

1. Roadmap line “Optimistic everywhere, accept-gated for Obi” → clarified as §4.1 interactive vs §3 proposals (optimistic local UX ≠ ungated AI authorship).
2. Needed installable slice → `agent-trust.template.md`.
3. 409 alone underspecified for humans → §3.5 conflict UX.
4. OFF-189 confidence control → §3.6 model vs user knobs.

## 2026-07-21 — Manifesto extraction notes (Parts VI / XII)

Pulled into §0–§2 / §7 without copying product vocabulary as universal law:

- Part VI: one engine · quiet · always asks · interrogates (don’t inflate)
- Part XI: re-routing accept-gated + non-destructive
- Creed #5–#7, #9: quiet multiplayer · always ask · rethought not reorganized · lovable if AI did nothing

## 2026-07-21 — visual-cursor (Tool / coding-agent write path) — 🔁 independent

**Context:** Public `tjcages/visual-cursor`. Live source audited (`src/agent.ts`, `src/client.tsx`, README). Independent of Obi/Tasks family — Interactive apply + undo, not overnight proposals.

**Write-site map:**

| Site | Class |
|---|---|
| `POST /__agent` → Cursor Agent edits files | Auto-applies after turn; HMR reflects |
| Syntax check on changed files | Auto-revert whole turn if parse broken |
| `POST /__undo` / `/__redo` (⌘Z / ⌘⇧Z) | Restores git-snapshot before/after |
| Loopback + same-origin guards | Hard refuse remote/CSRF (unless `allowRemote`) |

**Rubric: 10/16**

| # | Score | Note |
|---|---|---|
| 1 Thesis in-repo | 1 | README documents undo/syntax/security; no five-laws creed block |
| 2 Proposal substrate | 1 | Apply-then-undo, not pending→accept/dismiss + per-field diff |
| 3 Diff visible in UI | 0 | No before/after panel before land — user sees HMR after |
| 4 Stale/conflict | 0 | No stale-`before` refuse; last turn wins |
| 5 Undo/changelog | 2 | `git stash create` snaps + undo/redo stacks |
| 6 Quiet + proportional | 2 | Single-file scope; empty turn surfaces error, not fake success |
| 7 Create vs edit lanes | 2 | File edits only; no inventing product rows |
| 8 Exceptions declared | 2 | Localhost-only + CSRF refusal documented loudly |

**Load-bearing zeros:** #3, #4 → not accept-gate-ready by *product* proposal standards. Strong **coding-agent** pattern (§13): reversible auto-apply ≠ accept-gated authorship UI.

**Friction absorbed same day:**

1. Name the pattern: **apply + undo** is §4.1-adjacent for *devtool* agents; still fails #3/#4 unless a pre-land diff accept exists.
2. Auto-revert on syntax is a safety net, not an accept gate — user never chose “accept.”
3. Scoring a Tool coding agent against Product proposal rubric is valid for v1 “independent target” — don’t inflate to pass by redefining #2–#4.
