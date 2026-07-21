# Agent Worktrees

**Isolate parallel AI agents on one git repo — without reseeding, port fights, or silent clobbers.**

Extracted from Socials/Obi's multi-agent protocol. Methodology-first (not just `git worktree add`).

## Status

**✅ v1.0.0** — dogfooded on visual-cursor + skills monorepo install (12/12). Not 🚀 published to skills.sh yet.

Keyframe apply patch (bot lacks push): [`dogfood/APPLY-keyframe.md`](./dogfood/APPLY-keyframe.md).

## Skills

| Skill | Job |
|-------|-----|
| `agent-worktrees` | Set up / run the isolation protocol |

## Dogfood targets

1. `visual-cursor` — empty-share success
2. `socials` — Workers share symlinks (extraction source)
3. `keyframe` — smoke + patch ready to apply
4. **`skills` monorepo** — full install ≥10/12 (v1 gate)

## Install (local)

```bash
ln -sfn "$(pwd)/agent-worktrees/skills/agent-worktrees" ~/.claude/skills/agent-worktrees
ln -sfn "$(pwd)/agent-worktrees/shared/METHODOLOGY.md" ~/.claude/skills/agent-worktrees/METHODOLOGY.md
ln -sfn "$(pwd)/agent-worktrees/shared/RESPONSE.md" ~/.claude/skills/agent-worktrees/RESPONSE.md
```

This monorepo already ships root `scripts/worktree.sh` + `worktree.share` + CLAUDE/AGENTS sections.

## License

MIT (intended; LICENSE pending first publish)
