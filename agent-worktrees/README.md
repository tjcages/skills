# Agent Worktrees

**Isolate parallel AI agents on one git repo — without reseeding, port fights, or silent clobbers.**

Extracted from Socials/Obi's multi-agent protocol. Methodology-first (not just `git worktree add`).

## Status

**✅ v1.0.0** — ready for testing publish to offbr.co.  
Install (once GitHub repo exists): `npx skills add tjcages/agent-worktrees-skill -g -a '*' -y`  
Owner publish steps: [`../docs/PUBLISH-offbr.md`](../docs/PUBLISH-offbr.md)

## Skills

| Skill | Job |
|-------|-----|
| `agent-worktrees` | Set up / run the isolation protocol |

## Dogfood

visual-cursor · skills monorepo (12/12) · keyframe [PR #1](https://github.com/tjcages/keyframe/pull/1)

## Install (from monorepo, while drafting)

```bash
ln -sfn "$(pwd)/agent-worktrees/skills/agent-worktrees" ~/.claude/skills/agent-worktrees
ln -sfn "$(pwd)/agent-worktrees/shared/METHODOLOGY.md" ~/.claude/skills/agent-worktrees/METHODOLOGY.md
ln -sfn "$(pwd)/agent-worktrees/shared/RESPONSE.md" ~/.claude/skills/agent-worktrees/RESPONSE.md
```

## License

MIT — see [LICENSE](./LICENSE)
