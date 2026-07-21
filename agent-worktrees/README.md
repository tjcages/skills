# Agent Worktrees

**Isolate parallel AI agents on one git repo — without reseeding, port fights, or silent clobbers.**

Extracted from Socials/Obi's multi-agent protocol. Methodology-first (not just `git worktree add`).

## Status

**v0.2.0 — 🔁 nearly.** Script polished (`worktree.share`, `teardown`). Dogfoods: visual-cursor, socials, keyframe smoke. Not ✅ v1 until a non-Socials repo has the protocol *installed* and scores ≥10/12.

## Skills

| Skill | Job |
|-------|-----|
| `agent-worktrees` | Set up / run the isolation protocol |

## Dogfood targets

1. `visual-cursor` — empty-share success
2. `socials` — Workers share symlinks (extraction source)
3. `keyframe` — 🔁 smoke + `worktree.share` bugfix (install pass still open)

## Install (local, while drafting)

```bash
ln -sfn "$(pwd)/agent-worktrees/skills/agent-worktrees" ~/.claude/skills/agent-worktrees
ln -sfn "$(pwd)/agent-worktrees/shared/METHODOLOGY.md" ~/.claude/skills/agent-worktrees/METHODOLOGY.md
ln -sfn "$(pwd)/agent-worktrees/shared/RESPONSE.md" ~/.claude/skills/agent-worktrees/RESPONSE.md
```

Copy `scripts/worktree.sh` into the target repo (or keep theirs). Optional: `worktree.share` from `worktree.share.example`.

## License

MIT (intended; LICENSE pending first publish)
