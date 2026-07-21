# Agent Worktrees Methodology

**Version:** 0.2.0 — extracted from Socials/Obi (`CLAUDE.md` + `scripts/worktree.sh`), 2026-07-21; polished after keyframe dogfood

> **What this is.** How multiple AI agents work the same git repo without clobbering each other's files, env, or preview servers.
>
> **The differentiator.** Most guidance says "use worktrees." What's missing is the full operating protocol: shared env without reseeding, auto-ported previews, a status broadcast the human can scan, a claim so agents don't collide on the same file, and a land ritual that keeps `main` canonical.
>
> **Target user.** Someone running ≥2 agents (Claude Code / Cursor / Codex) on one codebase at once.

---

## 0. Core thesis

**Sharing one working tree across parallel agents is the bug.** Agents overwrite each other's uncommitted files, fight over the same port, and leave the human guessing which preview is whose. The fix is not "be careful" — it's **branch + worktree isolation + shared env via symlink + explicit claim + land-from-main**.

Validated on Socials/Obi under heavy multi-agent load. Defaults, not hard rules — defer to the user's explicit choice and any product isolation toggle (e.g. Claude Code worktree mode).

---

## 1. When to isolate

| Signal | Action |
|---|---|
| ≥2 agents on the same repo | Isolate (this protocol) |
| One agent, one task | Main tree is fine |
| User / product says "share the tree" | Obey — do not force isolation |
| Work touches the same structural files (schema, shell, nav) | Serialize — isolation does not make overlapping edits safe |

**Only parallelize independent work.** Shared/structural seams stay serial regardless of worktrees.

---

## 2. The six steps (every isolated agent)

### 2.1 Own branch + worktree

```bash
# From main tree:
git fetch origin
git worktree add -b <agent>/<task-slug> ../<repo>-<slug> origin/main
cd ../<repo>-<slug>
```

Claude Code's `claude/<name>` worktrees already do this — don't double-create. Prefer Linear's generated branch name when the work is tracked (`user/proj-N-slug`).

### 2.2 Share env + data — don't recreate it

One-time per worktree:

```bash
bash scripts/worktree.sh setup
```

The script **symlinks** main-tree local secrets/data into the worktree (never copies).

**Share list resolution (first match wins):**

1. `WORKTREE_SHARE="a b c"` env
2. Repo-root `worktree.share` file (see `worktree.share.example`) — **if the file exists, defaults are skipped** (empty/comment-only = intentional nothing-to-share)
3. Default: `.dev.vars` `.wrangler` `.env` `.env.local`

**Prefer the repo-local `scripts/worktree.sh`** when the product already ships one; the pack script is bootstrap. Don't overwrite a tighter product share list without reading it.

**Why symlink, not copy:** reseeding / re-login / re-pasting keys per agent is the failure mode this kills. One vault, many trees.

**Caveat:** shared local DB means schema migrations affect every worktree. Coordinate migrations, or isolate the DB binding when that cost is real.

### 2.3 Own preview, auto-ported

Each worktree runs its own dev server on its own port. Never hardcode the default port (5173 / 3000 / etc.). Prefer `autoPort: true` (or equivalent) in the launch config. **Stop the server when the agent is done** so it doesn't zombie.

### 2.4 Status line on every message

End every agent message with a scannable line the human can click:

```text
🔌 <branch> · <one-line task> · <preview URL>
```

No status line = the human cannot tell which agent owns which preview. This is load-bearing UX, not decoration.

### 2.5 Declare the claim

On start, record `<branch> · <task>` somewhere the other agents (or the human) can see — `active-agents` memory, a tiny `ACTIVE.md`, or the product's own claim surface. Clear the claim when the branch lands. Mark which SCOPE / roadmap item you own if the repo has one.

**Two agents claiming the same file family = stop and serialize.**

### 2.6 Land small and often

From the **main** tree:

```bash
bash scripts/worktree.sh land <branch>
git push origin main
```

Keep `main` as the canonical preview tree. Land finished work promptly — other agents (and devices that follow `main`) stay current.

### 2.7 Teardown when done

From the **main** tree:

```bash
bash scripts/worktree.sh teardown ../<repo>-<slug> <branch>
```

Removes the worktree directory and optionally deletes the local branch. Stop your preview server first — the script does not hunt ports.

---

## 3. Script contract (`worktree.sh`)

Minimum viable interface every adopting repo should ship (or install from this pack):

| Command | Runs from | Behavior |
|---|---|---|
| `setup` | worktree | Symlink configured share targets from main → here. No-op if already main. Empty share = success. |
| `land <branch>` | main tree only | `git switch main` → ff-pull → `merge --no-ff <branch>`. Surface conflicts; never force. |
| `teardown <path> [branch]` | main tree only | `git worktree remove` + optional `branch -D` + prune |

Detect main via `git rev-parse --path-format=absolute --git-common-dir`.

Optional later: `claim`, `status`. Don't invent them until dogfood asks for them.

---

## 4. Install into a repo

1. Copy `scripts/worktree.sh` (or install via pack installer).
2. Add a short **"Parallel agents (worktrees)"** section to always-loaded agent instructions (`CLAUDE.md` / `AGENTS.md` / `.cursor/rules/`) pointing at the six steps + script.
3. Configure the **share list** for this stack (edit the script or a tiny `worktree.share` file).
4. Ensure launch config supports **auto-port** if the repo has a preview server.
5. Smoke-test: create a throwaway worktree → `setup` → confirm symlinks → make a no-op commit → `land` from main → remove worktree.

---

## 5. Anti-patterns

| Symptom | Why it's bad | Fix |
|---|---|---|
| Two agents in one working tree | File clobber, dirty git fights | Worktrees (§2.1) |
| Copying `.env` into each worktree | Drift + secret sprawl | Symlink via `setup` (§2.2) |
| Hardcoded preview port | Collisions, "wrong app" debugging | Auto-port (§2.3) |
| No status line | Human can't route attention | §2.4 every message |
| Silent claim | Two agents edit the same seam | §2.5 |
| Land from the worktree | Easy to merge the wrong way | `land` only from main (§2.6) |
| Parallel schema migrations on shared D1 | Cross-worktree breakage | Serialize migrations |
| `git pull` inside a build pre-action | Cancels mid-build when other agents land | Idle-time background pull (separate concern; never put pull on the build critical path) |

---

## 6. Readiness rubric

Score each 0 / 1 / 2. Max 12. **≥10 and no 0** = worktree-ready.

| # | Dimension | 2 = |
|---|---|---|
| 1 | `worktree.sh` (or equiv) present | `setup` + `land` work |
| 2 | Share list matches stack | Secrets/data symlink, no reseed — **or** correctly detected N/A ("nothing to share") |
| 3 | Protocol in agent instructions | Six steps written where agents read |
| 4 | Auto-port or documented port scheme | Two previews can run at once |
| 5 | Status line convention known | Agents end messages with it |
| 6 | Smoke-test passed this session | setup → edit → land → cleanup |

---

## 7. Dogfood protocol

Before calling the skill "done":

1. Walk this doc by hand on a real repo (not Socials — that's the source, not the test).
2. Log every friction point into EXAMPLES.md the same day.
3. Confirm rubric ≥10 on the target.
4. Second dogfood on a different stack if the first was Workers-shaped.

**Exit criteria for v1:** two successful dogfoods on independent repos, share-list generalization documented, no undocumented judgment calls in the six steps.

---

## 8. Open gaps

- [x] Empty share list is success, not failure — fixed 2026-07-21 (visual-cursor dogfood)
- [x] `worktree.share` config file — added v0.2 (keyframe dogfood)
- [x] Prefer repo-local `scripts/worktree.sh` when present — documented §2.2 / §4 (v0.2)
- [x] `teardown` helper — added v0.2
- [x] Comment-only `worktree.share` must not fall through to defaults — fixed v0.2 (keyframe)
- [ ] Claim surface that works across Cursor + Claude Code without a shared memory product
- [ ] Windows path behavior (symlink privileges)
- [ ] Interaction with Cursor's native worktree / cloud-agent isolation — detect and defer
- [ ] Auto-stop preview ports on teardown

---

## 9. Relationship to other skills

- **linear-discipline / linear-setup** — branch names come from Linear when work is tracked; this skill does not replace issue lifecycle.
- **traces** — progress log still updates from whichever worktree owns the task; land doesn't replace logging.
- **Idle-time autopull** (Socials `autopull.sh`) — complementary: keeps main current without putting `git pull` on the build path. Out of scope for v0.1; candidate for a thin sibling skill later.
