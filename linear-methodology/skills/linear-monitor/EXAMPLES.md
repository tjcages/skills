# Examples — before / after

Grounded transformations showing what the methodology changes in practice. Each ties back to a section in [METHODOLOGY.md](./METHODOLOGY.md). Real projects are named where the change actually happened; specifics are illustrative, not exhaustive history.

---

## 1. Blank slate → provable history (§4 backfill)

**Before:** visual-cursor tracked from zero — one open milestone, a few forward issues. The 4-file tool that already shipped looked *less* mature than it was.

**After:** one read of the README + shipped source produced 5 `Done` issues with evidence, in a backfill milestone. Linear now reflects real maturity from day one.
→ §4 (backfill algorithm), §4.5 (cross-check reconstructs the roadmap).

## 2. Vibe-check "done" → scoreable done (§18)

**Before:** "tracking's set up" meant *some milestones exist*. No way to say whether it was actually complete.

**After:** score the §18 rubric — orphan issues (dim #4) and no agent-instructions discipline (dim #9) came back at 0, total 13/20 = SOFT. The gaps were named, not guessed.
→ §18 (rubric), §26 (the audit that produces the score).

## 3. Project type predicted the wrong structure → the goal did (§7, §17)

**Before:** visual-cursor was a tiny `Tool`, so the expected shape was one milestone and a handful of issues.

**After:** §1b question 5 ("ship to npm and launch") converted it into three tracks — backfill / launch readiness / rollout — with real cross-track `blockedBy` relations. Size predicted nothing; the meta-goal predicted everything.
→ §17 (shape ceiling vs. meta-goal amount), §7 (launch track keyed off the goal, not the type).

## 4. Confusing shared labels → namespaced label group (§4, §24)

**Before:** a `Tool`'s internal-seam labels (`stamp`/`agent`/`overlay`) would land in the same team namespace as Obi's issues, where a bare `agent` label is actively confusing.

**After:** a Linear label group named after the project (`isGroup` + `parent`), children = the module labels. Cross-project labels (`Bug`, `iOS`) stay top-level.
→ §4 (label groups), §13 (multi-project conventions), §24 (labels answer *what part of the code*, milestones answer *when*).

## 5. Doc says "complete" → live issue says otherwise (§4.8)

**Before:** Obi's `macos-convergence-plan.md` closed with "macOS is now one-for-one with iPhone" — which read as evidence to mark the open issue OFF-6 `Done`.

**After:** corroborated with the user first; the work was still in progress. Left OFF-6 untouched, logged the discrepancy. A doc's own claim is evidence, not proof.
→ §4 step 8 (corroborate before a doc overrides a live issue).

## 6. "Already tracked" → a whole untracked initiative (§22b)

**Before:** Obi's primary North Star trio was fully mirrored, so the project read as complete.

**After:** the §4.5 cross-check prompted a `docs/` scan that surfaced `native-editor-plan.md` — a substantial, already-shipped track with zero Linear presence. Filed as its own milestone set (8 milestones, 8 issues), the existing side untouched.
→ §22b (half-tracked rescue), §4.7 (scan for unmirrored tracks).

---

## Worked example — a deliberately messy project, fixed step by step

**"widget-cli" — the mess (fictional, illustrative).** A 6-month-old CLI, tracked haphazardly by a couple of parallel sessions:

- 40 issues, flat — **9 have no milestone** at all.
- **11 milestones**, several named `Work on parser`, `More CLI stuff`, `Bugfixes round 2`.
- 4 issues sitting `In Progress` for three weeks; two were actually shipped, one abandoned.
- Every issue body **re-types the roadmap** from `docs/plan.md`.
- 3 target dates, none with an estimate behind them.
- No always-loaded tracking protocol (`CLAUDE.md` / `AGENTS.md` / rules) — which is *why* it decayed.

**Step 1 — audit, don't touch (§26).** Enumerate everything, score the §18 rubric: orphans (#4=0), lifecycle rot (#6=0), no discipline (#9=0), anti-patterns live (#10=0). Total 8/20 = **FAIL**. Emit the gap list. Get consent before writing (§1a).

**Step 2 — kill the orphans (§4, §19 issue soup).** Assign the 9 milestone-less issues to the right phase, or delete the dead ones. Every issue gets a milestone.

**Step 3 — collapse milestone spam (§23).** 11 → 4 outcome-named milestones: `Phase 1 — Parser`, `Phase 2 — CLI UX`, `1.0 stability`, `Launch readiness`. Rename `Bugfixes round 2` out of existence.

**Step 4 — fix the lifecycle (§5).** The two shipped `In Progress` issues → `Done` with evidence. The abandoned one → `Backlog` with a comment on why. Nothing lingers `In Progress` without a reason.

**Step 5 — de-duplicate the roadmap (§19).** Strip the re-typed plan from issue bodies; each issue points at `docs/plan.md`. One source of truth.

**Step 6 — fix the dates (§9, §19 fake precision).** Drop the three fabricated dates. Re-set only those that survive an estimate + dependency sanity-check.

**Step 7 — wire dependencies (§4).** `Launch readiness` beats `blockedBy` the `1.0 stability` items that gate them. The critical path lives in Linear, not someone's head.

**Step 8 — install the discipline (§5).** Write the tracking protocol into the repo's always-loaded agent instructions (`widget-cli/CLAUDE.md`, and `AGENTS.md` / `.cursor/rules/` if those agents are in play) with real team/project/milestone/label names — so the next session can't re-rot it.

**Step 9 — re-score (§18/§26).** Rubric back to 17/20 = **PASS**. Post one status update recording the cleanup (§20). Done means the score says so.
