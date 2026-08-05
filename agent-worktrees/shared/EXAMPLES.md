# EXAMPLES — agent-worktrees dogfood

## 2026-07-21 — visual-cursor (Tool / npm package)

**Shape:** pure library, no `.env` / `.dev.vars` / `.wrangler`.

| Step | Result |
|---|---|
| Create worktree | Pass |
| `setup` | "Nothing linked" — correct, but felt like a failure |
| `land` from worktree | Correctly refused |
| Cleanup | Pass |

**Friction absorbed into methodology:**
1. **Empty share list is success, not failure.** When no share targets exist, print `ok: nothing to share for this stack` and exit 0. Rubric dimension #2 scores 2 when N/A is correctly detected.
2. Pure packages still benefit from worktrees (file isolation) — don't skip the skill just because `setup` is a no-op.

**Rubric on visual-cursor (without installing protocol into CLAUDE.md):** 6/12 — script worked in dogfood tree only; protocol not installed; auto-port N/A (no preview server required for this test).

## 2026-07-21 — socials (Product / Workers + D1)

**Shape:** has `.dev.vars` + `.wrangler`.

| Step | Result |
|---|---|
| Create worktree | Pass |
| `setup` | Linked both share targets to main |
| Symlink verify | `readlink` → main tree paths |
| Cleanup (no land) | Pass — did not merge dogfood branch |

**Friction:**
1. Socials already ships its own `scripts/worktree.sh` with a narrower share list (`.dev.vars` `.wrangler` only). Pack script's default also tries `.env` / `.env.local` — harmless skips. Prefer repo-local script when present; pack script is the bootstrap.
2. Copying pack script *into* an existing worktree as a differently named file worked for testing; real install should replace or reconcile with the repo script.

**Rubric on socials (already has protocol in CLAUDE.md):** 11/12 — missing only "smoke-test this session left artifacts in-repo" (intentionally cleaned).

## 2026-07-21 — keyframe (Tool / library monorepo) — 🔁 non-source dogfood

**Shape:** public `tjcages/keyframe` — showcase + `@keyframe/react` library. No `.dev.vars` / `.env` in checkout. Has `wrangler.jsonc` but not a `.wrangler` data dir to share.

| Step | Result |
|---|---|
| Copy pack `worktree.sh` into clone | Pass |
| Create worktree + `setup` (defaults) | Pass — skips missing targets, prints `ok: nothing to share` |
| `land` from worktree | Correctly refused |
| `teardown` from main | Pass — removed tree + deleted branch |
| `worktree.share` comment-only | **Bug found:** fell through to default skips → fixed same day (file present = intentional empty list) |

**Rubric (script smoke only; protocol not installed into keyframe CLAUDE.md):** **8/12**

| # | Score | Note |
|---|---|---|
| 1 Script present | 2 | setup / land / teardown worked |
| 2 Share list | 2 | N/A correctly detected after fix |
| 3 Protocol in agent instructions | 0 | Not installed into keyframe this pass |
| 4 Auto-port | 1 | Showcase has `dev` scripts; not exercised |
| 5 Status line | 0 | Not installed |
| 6 Smoke this session | 2 | setup → refuse land → teardown |

**Friction absorbed (v0.2):**
1. `worktree.share` existence must short-circuit defaults.
2. New worktrees don't inherit uncommitted `scripts/` — install to main *before* branching, or copy into the worktree for bootstrap tests.
3. keyframe public tree has no `docs/north-star.md` (manifesto dogfood may still be local-only) — noted for that pack's 🔁 backlog.

**v1 gate for agent-worktrees:** still need one target with protocol **installed** (dimensions 3+5) on a non-Socials repo scoring ≥10. keyframe is the candidate — install pass next.

## 2026-07-21 — skills monorepo install (🔁 → ✅ v1)

**Shape:** this repo (`tjcages/skills`) — methodology monorepo, no preview server, no secrets.

**Blocked path:** cloud bot cannot push to `tjcages/keyframe` (403). Shipped `dogfood/keyframe-install.patch` + `APPLY-keyframe.md` for manual apply.

**Installed here instead:**

| Artifact | Path |
|---|---|
| Script | `scripts/worktree.sh` |
| Share config | `worktree.share` (intentionally empty) |
| Protocol | `CLAUDE.md` + `AGENTS.md` → Parallel agents section + status line |

**Smoke:** setup on main (ok) → worktree setup (empty share ok) → land refused from worktree → teardown ok.

**Rubric: 12/12**

| # | Score | Note |
|---|---|---|
| 1 Script | 2 | setup / land / teardown |
| 2 Share list | 2 | empty `worktree.share` honored |
| 3 Protocol in instructions | 2 | CLAUDE + AGENTS |
| 4 Auto-port | 2 | N/A documented (no preview in this repo) |
| 5 Status line | 2 | Required in agent instructions |
| 6 Smoke this session | 2 | Full path exercised |

**v1 exit:** two independent non-Socials dogfoods — visual-cursor (package / empty share) + skills (full install ≥10). Socials remains source validation. Keyframe patch pending human apply (nice-to-have, not blocking).

## 2026-07-21 — keyframe `git apply` (local) + push blocked

**Done in cloud env:**

1. `git apply` / commit on `/tmp/keyframe` → branch `cursor/agent-worktrees-install-2b41` @ `9ff0c43`
2. Smoke on install tip: setup → `ok: nothing to share` → teardown (worktree + branch deleted)
3. Refreshed `dogfood/keyframe-install.patch` + added `PUSH-keyframe.sh`

**Blocked:** `git push` → 403 `Permission denied to cursor[bot]`. `viewerPermission` empty on `tjcages/keyframe`.

**Rubric if landed:** would be **12/12** (same shape as skills install — empty share + protocol in CLAUDE/AGENTS). Until push/merge, keyframe remote remains without protocol.

## 2026-07-21 — keyframe push succeeded (owner)

Owner ran `git am` + push from local machine. Branch `cursor/agent-worktrees-install-2b41` on `tjcages/keyframe` · PR: https://github.com/tjcages/keyframe/pull/1

**Rubric once merged:** **12/12** (script + empty share + protocol in CLAUDE/AGENTS + status line).
