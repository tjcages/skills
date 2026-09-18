#!/usr/bin/env bash
set -euo pipefail
if [[ $# != 1 ]]; then
  echo "Usage: $0 /path/to/ios-repo" >&2
  exit 1
fi
cd "$1"
npx skills add tjcages/skills --skill apple-native
printf '%s\n' 'Installed Apple Native. Review and replace old ios-apple-quality rules in AGENTS.md; repository instructions were not overwritten.'
