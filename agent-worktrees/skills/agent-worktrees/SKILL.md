---
name: agent-worktrees
version: 1.0.0
description: >-
  Isolate parallel AI agents on one git repo via branch+worktree, shared env
  symlinks, auto-ported previews, status lines, claims, and a land-from-main
  ritual. Use when ≥2 agents will touch this or any repo, the user asks to set
  up worktrees / parallel agents / agent isolation, or an agent is about to
  share a working tree with another. NOT for ordinary single-agent work on main.
---

# Agent worktrees

Chat: [RESPONSE.md](./RESPONSE.md). Full method: [METHODOLOGY.md](./METHODOLOGY.md).

## Operating order

### 1. Should we isolate? (§1)

≥2 agents on this repo → yes. User/product says share → obey. Overlapping structural files → serialize even with worktrees.

### 2. Already isolated?

If you're already in a worktree (common dir ≠ toplevel of a single checkout) and a branch exists for this task → skip create; run `setup` if share links missing.

### 3. Create branch + worktree (§2.1)

Off `main`. Prefer Linear branch name when tracked. Don't double-create Claude Code's `claude/<name>` trees.

### 4. Share env (§2.2)

```bash
bash scripts/worktree.sh setup
```

Symlink, never copy. Configure share list for this stack (see METHODOLOGY §2.2 table).

### 5. Preview + claim + status (§2.3–2.5)

Own auto-ported server. Declare `<branch> · <task>`. End every message with:

`🔌 <branch> · <one-line task> · <preview URL>`

### 6. Land + teardown (§2.6–2.7)

```bash
bash scripts/worktree.sh land <branch>
git push origin main
bash scripts/worktree.sh teardown ../<repo>-<slug> <branch>
```

Clear the claim. Stop the preview before teardown.

### 7. Done check (§6)

Rubric ≥10/12, no zeros.

## Install into a repo

See METHODOLOGY §4. Prefer existing repo `scripts/worktree.sh`; else copy from this pack. Optional `worktree.share`. Write the six-step protocol into agent instructions; smoke-test once.

## Out of scope

Single-agent main-tree work. Schema-migration strategy beyond "serialize on shared DB." Idle-time autopull (sibling concern).
