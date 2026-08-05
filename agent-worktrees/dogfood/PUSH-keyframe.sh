#!/usr/bin/env bash
# Run on a machine with write access to tjcages/keyframe
set -euo pipefail
ROOT="${1:-.}"
cd "$ROOT"
git fetch origin
git checkout -B cursor/agent-worktrees-install-2b41 origin/main
git am "$(dirname "$0")/keyframe-install.patch"
git push -u origin cursor/agent-worktrees-install-2b41
gh pr create --base main --head cursor/agent-worktrees-install-2b41 \
  --title "chore: install agent-worktrees protocol" \
  --body "Installs worktree.sh + empty worktree.share + parallel-agents section in CLAUDE.md/AGENTS.md."
