# Skills monorepo — agent instructions

**👉 Read [`KICKOFF.md`](./KICKOFF.md) first** when continuing extraction work.

## Linear tracking (non-negotiable)

No factory. **[extracted-skills](https://linear.app/off-brand-studio/project/extracted-skills-4d7c79e03387) is Completed** — do not file there.

Each pack is its own Linear `Tool` project. If none exists, run `linear-setup` on that pack before non-trivial work (create project + `<pack>/CLAUDE.md`).

Live:
- `linear-methodology/` → **[Linear](https://linear.app/off-brand-studio/project/linear-9633010d001a)**
- `orchestrator/` → **[Orchestrator](https://linear.app/off-brand-studio/project/orchestrator-e850288469eb)**

- Search before create. Non-trivial work → issue + milestone on **that pack’s project**.
- `Backlog` → `In Progress` at start → `Done` when shipped (merged, dogfood logged).
- Close the loop before session end.
- Prefer Linear branch names.

## Conventions

- One folder per pack; mirror `linear-methodology/` layout.
- Always commit meaningful units.
- Dogfood before calling a pack v1.
- Socials is reference material, not the place to land skill source of truth.


## Parallel agents (worktrees)

When ≥2 agents touch this repo, isolate — do not share one working tree.

1. **Own branch + worktree** off `main` (prefer Linear branch name when tracked). Cloud agents already branch; still use worktrees for parallel local agents.
2. **Share env:** `bash scripts/worktree.sh setup` (this repo’s `worktree.share` is intentionally empty).
3. **Own preview** if any — auto-port; stop when done.
4. **Claim** the pack/files you own; clear when landed.
5. **Land from main:** `bash scripts/worktree.sh land <branch>` then push (or PR).
6. **Teardown:** `bash scripts/worktree.sh teardown ../skills-<slug> <branch>`.

Status line on every agent message:

`🔌 <branch> · <one-line task> · <preview URL or n/a>`

Pack source: [`agent-worktrees/`](./agent-worktrees/).
