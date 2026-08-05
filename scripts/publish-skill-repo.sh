#!/usr/bin/env bash
# Push a v1 pack from this monorepo to a standalone public *-skill GitHub repo.
# Usage: bash scripts/publish-skill-repo.sh agent-worktrees
#        bash scripts/publish-skill-repo.sh manifesto
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PACK="${1:?pack folder name required (agent-worktrees|manifesto)}"
REPO_NAME="${PACK}-skill"
SRC="$ROOT/$PACK"
STAGING="$(mktemp -d)/$REPO_NAME"

case "$PACK" in
  agent-worktrees|manifesto) ;;
  *)
    echo "Only ✅ v1 packs for testing: agent-worktrees, manifesto" >&2
    echo "Not ready: accept-gated-ai, lossless-migration, behavior-contracts (still v0.x)" >&2
    exit 1
    ;;
esac

test -d "$SRC" || { echo "missing $SRC"; exit 1; }
test -f "$SRC/LICENSE" || { echo "missing LICENSE — pack not publish-ready"; exit 1; }
test -f "$SRC/package.json" || { echo "missing package.json"; exit 1; }

mkdir -p "$STAGING"
# Standalone skill repo layout (mirror linear-methodology-skill)
rsync -a --exclude dogfood --exclude '.git' "$SRC/" "$STAGING/"

cd "$STAGING"
if ! gh repo view "tjcages/$REPO_NAME" >/dev/null 2>&1; then
  gh repo create "tjcages/$REPO_NAME" --public \
    --description "$(node -p "require('./package.json').description")" \
    --homepage "https://offbr.co/skills/$PACK"
fi

git init -q
git add -A
git commit -m "chore: publish $PACK v$(node -p "require('./package.json').version") from skills monorepo"
git branch -M main
git remote remove origin 2>/dev/null || true
git remote add origin "git@github.com:tjcages/$REPO_NAME.git"
git push -u origin main --force

echo ""
echo "✓ https://github.com/tjcages/$REPO_NAME"
echo "  Install: npx skills add tjcages/$REPO_NAME -g -a '*' -y"
echo "  Site:    add D1 row in rust/off-brand → https://offbr.co/skills/$PACK"
echo "  Staging kept at: $STAGING"
