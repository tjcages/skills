# EXAMPLES — constitution-first dogfood

## 2026-07-21 — keyframe (Tool / React animation library)

**Discovery (§1):**
- Has `README.md` (API + pitch: "declarative motion primitives for React, built on GSAP")
- Has `CLAUDE.md` / `AGENTS.md` — **Linear tracking only**, no product theory
- No `docs/manifesto.md`, no Creed, no non-negotiables, no decision checklist

**Size call:** Tool / library shipping publicly → lightweight constitution (≤1 page), not a 12-part manifesto.

**README-as-North-Star?** Thin. Enough for `linear-setup` Gate 2 historically, but constitution-first should flag **"fine but thin"** — pitch exists; who-for / non-negotiables / out-of-scope / philosophical-done do not.

**Rubric (before any write):** 4/14
- #1 North Star findable: 1 (README only)
- #2 Pitch + who-for + non-negotiables: 1 (pitch only)
- #3 Conflict rule: 0
- #4 Decision checklist: 0
- #5 Size-calibrated: 2 (correctly not overbuilt yet)
- #6 Companions: 2 (N/A — no migration)
- #7 Drift cadence: 0

**Next action for dogfood (needs user consent):** ask the 6 anchoring questions, then draft `docs/north-star.md` (≤1 page) — do **not** invent answers.

**Friction absorbed:**
1. Distinguish **Linear-ready** (README ok) from **constitution-ready** (rubric ≥10). keyframe is the former, not the latter.
2. CLAUDE.md that only contains Linear protocol is not a North Star — don't confuse tracking discipline with product theory.

## 2026-07-21 — keyframe write (owner answers → `docs/north-star.md`)

Owner answered all 6 anchoring questions. Drafted lightweight Tool constitution:

- Path: `/Users/ty/Workspace/keyframe/docs/north-star.md`
- Wired into `CLAUDE.md` + `AGENTS.md` (read-first + conflict rule + checklist pointer)
- One-line pointer in `README.md`

**Rubric after write:** 12/14
- #1 North Star findable: 2
- #2 Pitch + who-for + non-negotiables: 2
- #3 Conflict rule: 2
- #4 Decision checklist: 2
- #5 Size-calibrated: 2 (≤1 page Tool form)
- #6 Companions: 2 (N/A)
- #7 Drift cadence: 0 (not yet stated in-repo — acceptable for v0; suggest at next milestone close)

**Pass threshold met** (≥10, no load-bearing 0 on #1–#4).

## 2026-07-21 — obi / Gmail Chat (Product-shaped) — 🔁 discovery only

**Repo:** public `tjcages/obi` (Gmail Chat via inbox.dog — OAuth + Cloudflare Agents + Durable Objects). Multi-surface Product, not a Tool library.

**Discovery (§1):**
- README: pitch + stack + setup — **no** who-for / non-negotiables / out-of-scope / philosophical-done
- No `docs/manifesto.md`, `docs/north-star.md`, `CLAUDE.md`, `AGENTS.md`, Creed, or decision checklist

**Size call:** Product (auth, chat, sandbox tool, hosted Worker) → **full constitution** (§3), not the ≤1-page Tool form.

**README-as-North-Star?** No. Pitch only → **Linear-ready? No** (no agent instructions either). **Constitution-ready? No.**

**Rubric (before any write):** **3/14**

| # | Score | Note |
|---|---|---|
| 1 North Star findable | 0 | README pitch only |
| 2 Pitch + who-for + non-negotiables | 1 | Pitch only |
| 3 Conflict rule | 0 | — |
| 4 Decision checklist | 0 | — |
| 5 Size-calibrated | 2 | Correctly not overbuilt yet (absence ≠ wrong size) |
| 6 Companions | 0 | Product shape will want plan; none present |
| 7 Drift cadence | 0 | — |

**Next action (needs owner answers — do not invent):** ask the 6 anchoring questions (§2), then draft full constitution + wire conflict rule into agent instructions.

**Friction:** Product dogfood without owner present stops at discovery + rubric. Logging the stop is the dogfood — inventing a manifesto fails the skill.
