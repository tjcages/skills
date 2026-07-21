# Skills monorepo — agent instructions

**👉 Read [`KICKOFF.md`](./KICKOFF.md) first** when continuing extraction work.

**North Star:** [`docs/north-star.md`](./docs/north-star.md) — manifesto for this monorepo. When it conflicts with KICKOFF/tickets/vibes, the North Star wins. Before a new pack or pack shape change, run its decision checklist.

**Agent trust:** [`docs/agent-trust.md`](./docs/agent-trust.md) — coding-agent / PR rules here; product accept-gates live in `accept-gated-ai`.

## Linear tracking (non-negotiable)

Team **Off-brand** · project **[extracted-skills](https://linear.app/off-brand-studio/project/extracted-skills-4d7c79e03387)**.

Milestones = packs: `1 — agent-worktrees` · `2 — manifesto` · `3 — accept-gated-ai` · `4 — lossless-migration` · `5 — behavior-contracts`.

- Search before create. Non-trivial work → issue + milestone.
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
