#!/usr/bin/env bash
#
# Parallel-agent worktree helpers.
#   bash scripts/worktree.sh setup
#   bash scripts/worktree.sh land <branch>
#   bash scripts/worktree.sh teardown <worktree-path> [branch]
#
# Share list (first match wins):
#   1. WORKTREE_SHARE env  ("a b c")
#   2. worktree.share file in repo root (whitespace / newline separated)
#   3. Default: .dev.vars .wrangler .env .env.local
#
# Prefer this repo's scripts/worktree.sh when present; the pack copy is bootstrap.
#
set -euo pipefail

MAIN="$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")"
HERE="$(git rev-parse --show-toplevel)"

load_share_items() {
  if [ -n "${WORKTREE_SHARE:-}" ]; then
    # shellcheck disable=SC2206
    SHARE_ITEMS=(${WORKTREE_SHARE})
    return
  fi
  share_file=""
  if [ -f "$HERE/worktree.share" ]; then
    share_file="$HERE/worktree.share"
  elif [ -f "$MAIN/worktree.share" ]; then
    share_file="$MAIN/worktree.share"
  fi
  if [ -n "$share_file" ]; then
    # File present = intentional config. Comments/blank → empty share list (success).
    # Do NOT fall through to defaults when the file exists.
    mapfile -t SHARE_ITEMS < <(grep -vE '^\s*(#|$)' "$share_file" | tr -s '[:space:]' '\n' | grep -v '^$' || true)
    return
  fi
  SHARE_ITEMS=(.dev.vars .wrangler .env .env.local)
}

load_share_items

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
      echo "hint: add a worktree.share file or set WORKTREE_SHARE=\"item1 item2\" if needed."
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

  teardown)
    path="${2:-}"
    branch="${3:-}"
    if [ -z "$path" ]; then echo "usage: worktree.sh teardown <worktree-path> [branch]"; exit 1; fi
    if [ "$HERE" != "$MAIN" ]; then echo "Run 'teardown' from the main tree: $MAIN"; exit 1; fi
    # Best-effort: stop common preview PIDs recorded by agents is out of scope;
    # human/agent should kill their own server first.
    if [ -d "$path" ]; then
      git worktree remove --force "$path" 2>/dev/null || git worktree remove "$path"
      echo "removed worktree: $path"
    else
      echo "skip: path not found: $path"
    fi
    if [ -n "$branch" ]; then
      if git show-ref --verify --quiet "refs/heads/$branch"; then
        git branch -D "$branch"
        echo "deleted local branch: $branch"
      else
        echo "skip: branch not found: $branch"
      fi
    fi
    git worktree prune
    ;;

  *)
    echo "usage: worktree.sh {setup | land <branch> | teardown <worktree-path> [branch]}"
    echo "share: WORKTREE_SHARE env · worktree.share file · or default .dev.vars .wrangler .env .env.local"
    ;;
esac
