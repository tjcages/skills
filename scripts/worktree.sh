#!/usr/bin/env bash
#
# Parallel-agent worktree helpers.
#   bash scripts/worktree.sh setup
#   bash scripts/worktree.sh land <branch>
#
# Share list: edit SHARE_ITEMS below (or set WORKTREE_SHARE="a b c").
#
set -euo pipefail

SHARE_ITEMS=(${WORKTREE_SHARE:-.dev.vars .wrangler .env .env.local})

MAIN="$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")"
HERE="$(git rev-parse --show-toplevel)"

case "${1:-help}" in
  setup)
    if [ "$HERE" = "$MAIN" ]; then
      echo "This IS the main tree — it owns local env/data. Nothing to link."
      exit 0
    fi
    linked=0
    for item in "${SHARE_ITEMS[@]}"; do
      if [ ! -e "$MAIN/$item" ]; then
        echo "skip: $MAIN/$item doesn't exist yet"
        continue
      fi
      if [ -e "$HERE/$item" ] && [ ! -L "$HERE/$item" ]; then
        rm -rf "${HERE:?}/$item"
      fi
      ln -sfn "$MAIN/$item" "$HERE/$item"
      echo "linked $item  ->  $MAIN/$item"
      linked=1
    done
    if [ "$linked" -eq 0 ]; then
      echo "ok: nothing to share for this stack (no share targets in main)."
      echo "hint: set WORKTREE_SHARE=\"item1 item2\" if this repo later grows local env/data."
    else
      echo "Done — this worktree shares the main tree's configured env/data."
      echo "Note: shared local DBs mean schema migrations affect every worktree; coordinate those."
    fi
    ;;

  land)
    branch="${2:-}"
    if [ -z "$branch" ]; then echo "usage: worktree.sh land <branch>"; exit 1; fi
    if [ "$HERE" != "$MAIN" ]; then echo "Run 'land' from the main tree: $MAIN"; exit 1; fi
    git switch main
    git pull --ff-only origin main 2>/dev/null || true
    if git merge --no-ff "$branch" -m "Merge $branch into main"; then
      echo "Merged $branch. Review, then: git push origin main"
    else
      echo "Merge has conflicts — resolve them, 'git add' the files, then 'git commit'."
      exit 1
    fi
    ;;

  *)
    echo "usage: worktree.sh {setup | land <branch>}"
    echo "env: WORKTREE_SHARE=\"item1 item2\"  (default: .dev.vars .wrangler .env .env.local)"
    ;;
esac
