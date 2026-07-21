# Install — agent-worktrees

```bash
npx skills add tjcages/agent-worktrees-skill -g -a '*' -y
```

Copies `agent-worktrees` into `~/.claude/skills`, `~/.cursor/skills`, `~/.codex/skills`, `~/.agents/skills`.

## Into a product repo

1. Copy `scripts/worktree.sh` to the repo (or symlink from the pack).
2. Add `worktree.share` (see `worktree.share.example`) — empty file = intentional no-share.
3. Add the Parallel agents section from the skill methodology into `CLAUDE.md` / `AGENTS.md`.
4. Smoke: `bash scripts/worktree.sh setup` → worktree → teardown.

Site: [offbr.co/skills/agent-worktrees](https://offbr.co/skills/agent-worktrees) (D1 row pending if 404)

| Symptom | Fix |
|---------|-----|
| Eve / PromptScript failed | Expected — no global install. Use `npx skills add tjcages/agent-worktrees-skill` **without** `-g` in the project, or ignore. |
