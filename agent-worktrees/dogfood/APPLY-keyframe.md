# Apply agent-worktrees to keyframe (manual push)

Cloud agent **applied** the patch locally on branch `cursor/agent-worktrees-install-2b41` (commit `9ff0c43`) and smoke-tested setup → empty share → teardown. **Push still 403** for `cursor[bot]` — owner must push.

## Owner one-liner

```bash
bash agent-worktrees/dogfood/PUSH-keyframe.sh /path/to/keyframe
```

Or by hand:

```bash
cd /path/to/keyframe
git fetch origin
git checkout -B cursor/agent-worktrees-install-2b41 origin/main
git am /path/to/skills/agent-worktrees/dogfood/keyframe-install.patch
git push -u origin cursor/agent-worktrees-install-2b41
```

Adds: `scripts/worktree.sh` · empty `worktree.share` · Parallel-agents section on `CLAUDE.md` + `AGENTS.md`

## Smoke (after apply)

```bash
# from the install branch tip (not origin/main until merged)
git worktree add -b dogfood/wt ../keyframe-wt HEAD
cd ../keyframe-wt && bash scripts/worktree.sh setup
cd /path/to/keyframe && bash scripts/worktree.sh teardown ../keyframe-wt dogfood/wt
```
