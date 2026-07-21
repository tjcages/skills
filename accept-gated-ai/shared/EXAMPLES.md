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

## 2026-07-21 — Manifesto extraction notes (Parts VI / XII)

Pulled into §0–§2 / §7 without copying product vocabulary as universal law:

- Part VI: one engine · quiet · always asks · interrogates (don’t inflate)
- Part XI: re-routing accept-gated + non-destructive
- Creed #5–#7, #9: quiet multiplayer · always ask · rethought not reorganized · lovable if AI did nothing
