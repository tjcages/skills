# Agent trust — skills monorepo

This repo authors **methodology**, not a product that mutates user data.

| Write class | Applies here? |
|---|---|
| Gated proposal / overnight AI on user records | **N/A** — no product data plane |
| Interactive apply on user records | **N/A** |
| Coding-agent file edits | **Yes** — agents edit this git tree |

## Coding-agent rule (this repo)

1. Prefer branch + PR (cloud agents already branch).
2. Diff is the accept gate — human review before merge to `main`.
3. Parallel agents use `scripts/worktree.sh` (see `agent-worktrees`).
4. Do not treat pack docs as product accept-gate UI.

For products with write-access AI, copy [`accept-gated-ai/shared/agent-trust.template.md`](../accept-gated-ai/shared/agent-trust.template.md) → that product’s `docs/agent-trust.md`.
