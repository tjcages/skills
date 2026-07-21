# Product Manifesto Methodology

**Version:** 1.0.0 — extracted from Socials/Obi (`docs/manifesto.md` + the manifesto→SCOPE→roadmap trio); dogfooded Tool (keyframe, skills) + Product (Obi re-anchor + Cursor enrichment), 2026-07-21

> **What this is.** How to give a product a **manifesto** — a North Star doc every feature is judged against — before (or while) tracking and building. The missing theory that stops the loop: build → ship → hate how it feels → rebuild.
>
> **The differentiator.** READMEs describe what exists. Roadmaps describe what happens next. A manifesto describes **what's true regardless of what's built yet**. Linear-methodology already *consumes* a North Star; this skill teaches how to **author and govern** one.
>
> **Target user.** Anyone building a non-trivial product/tool with AI agents that otherwise invent structure from vibes.

---

## 0. Core thesis

**Tracking and features without a shared theory of the product decay into a pile nobody trusts.** The fix is not a better ticket template — it's anchoring every later decision to a manifesto:

1. **Manifesto** — what's true (premise, model, non-negotiables, creed)
2. **Proof / state** — what's built today (SCOPE / inventory)
3. **Plan** — what happens next (phased roadmap)

**When they conflict, the manifesto wins** and the other docs get corrected — never the other way around.

Calibrate weight to project size. A weekend script does not need a 12-part manifesto. A multi-platform product does.

---

## 1. Step zero — does a North Star already exist?

Search before writing:

- `docs/manifesto.md`, `CONSTITUTION.md`, `VISION.md`, `docs/north-star.md`
- README sections titled Premise / Vision / Principles / Non-negotiables
- A short "this is / this isn't" block the owner already treats as law

**If a good one exists** — say so out loud ("README-as-North-Star is enough"). Do not rewrite it. Offer a **drift audit** (§6) or a lightweight **decision checklist** install (§5) instead.

**If README is fine but thin** (pitch only; no who-for / non-negotiables / out-of-scope) — say **"Linear-ready, not manifesto-ready"** in one line. Offer the lightweight Tool page (§1 table). Don't silently pass the rubric, and don't rewrite the README into a manifesto without consent.

**If nothing exists** — fork by size:

| Shape | Move |
|---|---|
| Disposable / weekend script | Skip. Say so. One-sentence pitch in README is enough. |
| Tool / library shipping publicly | Lightweight manifesto (≤1 page): pitch, who-for, 3–5 non-negotiables, out-of-scope. |
| Product (multi-surface, long life) | Full manifesto (§3) + consider proof + plan companions (§4). |

Never silently skip on a substantial product. Never force a heavyweight doc on a toy.

---

## 2. Anchoring questions (ask these; don't invent answers)

When no North Star exists and the project warrants one, ask — then write from the answers:

1. **One-sentence pitch** — what is this?
2. **Who is this for?** — the specific person, not "users"
3. **3–5 non-negotiables** — true regardless of what's built yet
4. **Explicitly out of scope** — what it is *not*
5. **What "done" philosophically means** — not a date; the feeling of finished
6. **The broken pattern this replaces** — the loop you're ending (optional but sharp)

These are product questions. (Linear-methodology's "why track in Linear?" is a *tracking* meta-goal — adjacent, not the same. Hand off to `linear-setup` after the manifesto exists.)

---

## 3. Manifesto shape (full form)

A working manifesto usually has:

| Part | Job |
|---|---|
| **Premise** | The broken pattern + the one-sentence product |
| **Model** | The spine metaphor / object model (the river, the atom, …) — whatever makes "does this belong?" answerable |
| **Modes / surfaces** | How the user meets the product (IN/OUT, capture vs publish, …) |
| **Engine / agent rules** | If AI acts on user data: accept-gated? quiet? proportional? (see sibling skill `accept-gated-ai`) |
| **Extension law** | The only legal ways to grow the system (e.g. "Five Doors") |
| **Never-forget / never-regress** | Invariants that survive refactors |
| **Creed** | ≤10 scannable laws — the thing agents re-read under pressure |
| **How to use this book** | A 5–6 question decision checklist for any new idea |

**Writing style:** theory, not feature list. Scannable. Named metaphors beat abstract architecture talk. Creed lines are short enough to quote in a PR.

**Obi reference:** `/Users/ty/Workspace/socials/docs/manifesto.md` — Parts I–XII + Creed + decision checklist. Steal structure, not vocabulary.

---

## 4. Companion docs (conditional)

| Doc | When | Job |
|---|---|---|
| **Proof / inventory-audit** | Migrating or re-architecting an existing codebase | Every existing behavior → named destination; RETIRE only when replacement is live |
| **State / SCOPE** | Any long-running build | What's built, file map, conventions — *current reality* |
| **Plan / roadmap** | Phased work ahead | Phases that Linear milestones will mirror 1:1 |

Not every project needs all three. Manifesto is closest to mandatory for non-trivial work. Proof is mandatory for lossless migrations (sibling: `lossless-migration`). Plan is mandatory before `linear-setup` invents milestones.

---

## 5. Decision checklist (install into agent instructions)

Once a manifesto exists, add a short always-on ritual:

> Before designing or building a feature, answer the manifesto's decision checklist. If any answer breaks a Creed line, the idea isn't ready — or it isn't ours.

Obi's six (adapt, don't copy blindly):

1. Which inlet / surface does this enter?
2. What atom / object does it become?
3. Which state of the lifecycle does it live in?
4. Does it reduce to the one spine (or does it invent a second home)?
5. Which primitive renders it — reuse first, never fork?
6. Is it lovable without the agent, and does the agent stay quiet + accept-gated?

---

## 6. Drift audits

Cadence: at phase/milestone boundaries (not arbitrary calendar dates).

Procedure:

1. Re-read the manifesto.
2. Walk what shipped since the last audit.
3. Answer explicitly: still serving the thesis? Scope creep with no home? Should the manifesto *deliberately* evolve (rare, conscious edit) or should the built thing correct back?
4. Land findings as tracked issues + a status note — an audit nobody acts on is just a document.

Proactively *suggest* a drift audit when a phase closes.

---

## 7. Conflict rule (non-negotiable)

**Manifesto > SCOPE/state > roadmap > tickets > vibes.**

When SCOPE and the manifesto disagree, fix SCOPE. When a ticket proposes something that breaks the Creed, change the ticket or reject the idea — do not quietly patch the Creed to match the ticket.

---

## 8. Anti-patterns

| Symptom | Why it's bad | Fix |
|---|---|---|
| Feature list posing as vision | Ages instantly; no judgment power | Rewrite as premise + non-negotiables |
| Manifesto that restates the roadmap | Two plans drift | Strip dates/phases; keep laws |
| Silent rewrite of the Creed mid-build | Loses the whole point | Conscious edit + say why |
| Skipping the doc on a real product | Agents invent theory per session | §2 questions → lightweight page |
| Forcing a manifesto on a toy | Overhead kills trust in the method | Skip; say so (§1) |
| README and manifesto that contradict | Agents pick at random | Conflict rule (§7) |

---

## 9. Readiness rubric

Score 0 / 1 / 2. Max 14. **≥10 and no load-bearing 0 on #1–#4** = manifesto-ready.

| # | Dimension | 2 = |
|---|---|---|
| 1 | North Star exists and is findable | Linked from agent instructions |
| 2 | Pitch + who-for + non-negotiables | Answerable in <2 min |
| 3 | Conflict rule stated | Manifesto wins, written down |
| 4 | Decision checklist installable | Agents can run it on a new idea |
| 5 | Size-calibrated | Not over/under-built for the project |
| 6 | Companions present if needed | Proof/plan only when shape demands |
| 7 | Drift cadence known | Suggest at phase boundaries |

---

## 10. Dogfood protocol

1. Walk §1–§2 by hand on a repo that is **not** Socials.
2. Either accept README-as-North-Star out loud, or draft from anchoring questions (confirm before writing files).
3. Score §9. Log friction in EXAMPLES.md same day.
4. Second dogfood: one Product-shaped, one Tool-shaped.

**Exit criteria for v1:** two dogfoods, rubric usable without undocumented judgment, clean handoff note to `linear-setup` ("manifesto exists → derive milestones from plan").

---

## 11. Open gaps

- [x] Template file (`shared/north-star.template.md`) — 2026-07-21
- [x] How aggressive when README is "fine but thin" — **flag it**: Linear-ready ≠ manifesto-ready; offer lightweight Tool page, don't silently pass (keyframe dogfood 2026-07-21)
- [ ] Relationship to `to-prd` / `grill-with-docs` — compose, don't compete
- [x] Accept-gated AI chapter: point at sibling + `docs/agent-trust.md` (skills monorepo install)
- [x] Second Tool install dogfood — skills monorepo north-star **13/14** (2026-07-21)
- [x] Product dogfood — Obi manifesto exists; owner re-anchor + drift audit **14/14** (2026-07-21). Wrong-repo discovery (`tjcages/obi` Gmail) corrected.
- [x] Optional: land “Cursor for context” enrichment — **owner confirmed + pasted into Socials** (2026-07-21)
- [x] Call pack ✅ v1 — Tool×2 + Product re-anchor/enrichment (2026-07-21)
- [ ] 🚀 skills.sh publish (separate; LICENSE + install URLs)
---

## 12. Relationship to other skills

- **linear-setup** — consumes the North Star; does not author the product theory. Run `manifesto` *before* or *as Gate 2* of setup.
- **lossless-migration** — owns the proof/inventory companion when rewriting in place.
- **accept-gated-ai** — owns the agent-trust chapter when the product has write-access AI.
- **traces** — progress log is the visual changelog; manifesto is the judgment frame. Both stay.
