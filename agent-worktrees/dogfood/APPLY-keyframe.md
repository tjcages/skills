# Apply agent-worktrees to keyframe (manual)

This cloud agent **cannot push** to `tjcages/keyframe` (403). Apply locally:

```bash
cd /path/to/keyframe
git apply /path/to/skills/agent-worktrees/dogfood/keyframe-install.patch
# or: git am agent-worktrees/dogfood/keyframe-install.patch
```

Adds:

- `scripts/worktree.sh`
- `worktree.share` (intentionally empty)
- Parallel-agents section on `CLAUDE.md` + `AGENTS.md`

Then smoke:

```bash
git worktree add -b dogfood/wt ../keyframe-wt origin/main
cd ../keyframe-wt && bash scripts/worktree.sh setup
cd /path/to/keyframe && bash scripts/worktree.sh teardown ../keyframe-wt dogfood/wt
```
