#!/usr/bin/env bash
# Copy the ios-apple-quality harness skill + AGENTS.md into an iOS repo.
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 /path/to/ios-repo [--force-agents]" >&2
  exit 1
fi

REPO="$(cd "$1" && pwd)"
FORCE_AGENTS=0
if [[ "${2:-}" == "--force-agents" ]]; then
  FORCE_AGENTS=1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$REPO/.cursor/skills/ios-apple-quality"
AGENTS_SRC="$ROOT/templates/AGENTS.md"
AGENTS_DEST="$REPO/AGENTS.md"
SKILL_SRC="$ROOT/skills/ios-apple-quality"

mkdir -p "$REPO/.cursor/skills"
rm -rf "$DEST"
mkdir -p "$DEST"
cp -L "$SKILL_SRC/SKILL.md" "$DEST/SKILL.md"
[[ -f "$ROOT/shared/METHODOLOGY.md" ]] && cp "$ROOT/shared/METHODOLOGY.md" "$DEST/METHODOLOGY.md"
[[ -f "$ROOT/shared/RESPONSE.md" ]] && cp "$ROOT/shared/RESPONSE.md" "$DEST/RESPONSE.md"
echo "Installed harness → $DEST"

if [[ -f "$AGENTS_DEST" && $FORCE_AGENTS -eq 0 ]]; then
  if grep -q "<!-- ios-apple-quality-harness:start -->" "$AGENTS_DEST"; then
    python3 - "$AGENTS_DEST" "$AGENTS_SRC" <<'PY'
import sys
from pathlib import Path
dest, src = Path(sys.argv[1]), Path(sys.argv[2])
text = dest.read_text()
block = (
    "<!-- ios-apple-quality-harness:start -->\n"
    + src.read_text().rstrip()
    + "\n<!-- ios-apple-quality-harness:end -->\n"
)
start = "<!-- ios-apple-quality-harness:start -->"
end = "<!-- ios-apple-quality-harness:end -->"
i, j = text.find(start), text.find(end)
if i != -1 and j != -1:
    text = text[:i] + block + text[j + len(end):].lstrip("\n")
    dest.write_text(text)
    print(f"Updated harness section → {dest}")
else:
    dest.write_text(text.rstrip() + "\n\n" + block)
    print(f"Appended harness section → {dest}")
PY
  else
    {
      echo ""
      echo "<!-- ios-apple-quality-harness:start -->"
      cat "$AGENTS_SRC"
      echo "<!-- ios-apple-quality-harness:end -->"
    } >> "$AGENTS_DEST"
    echo "Appended harness section → $AGENTS_DEST"
  fi
else
  {
    echo "<!-- ios-apple-quality-harness:start -->"
    cat "$AGENTS_SRC"
    echo "<!-- ios-apple-quality-harness:end -->"
  } > "$AGENTS_DEST"
  echo "Wrote AGENTS.md → $AGENTS_DEST"
fi

echo "Open the repo in Cursor; the skill auto-applies on Swift/Xcode files."
