# Agent Worktrees

**Isolate parallel AI agents on one git repo — without reseeding, port fights, or silent clobbers.**

Extracted from Socials/Obi's multi-agent protocol. Methodology-first (not just `git worktree add`).

## Status

**v0.1.0 — drafting + dogfood.** Not published to skills.sh yet.

## Skills

| Skill | Job |
|-------|-----|
| `agent-worktrees` | Set up / run the six-step isolation protocol |

## Dogfood targets

1. `visual-cursor` (in progress)
2. TBD second stack

## Install (local, while drafting)

```bash
ln -sfn /Users/ty/Workspace/agent-worktrees-skill/skills/agent-worktrees ~/.claude/skills/agent-worktrees
ln -sfn /Users/ty/Workspace/agent-worktrees-skill/shared/METHODOLOGY.md ~/.claude/skills/agent-worktrees/METHODOLOGY.md
ln -sfn /Users/ty/Workspace/agent-worktrees-skill/shared/RESPONSE.md ~/.claude/skills/agent-worktrees/RESPONSE.md
```

Copy `scripts/worktree.sh` into the target repo's `scripts/`.

## License

MIT (intended; LICENSE pending first publish)
