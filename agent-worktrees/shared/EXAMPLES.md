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
