#!/usr/bin/env bash
# One-shot install: Apple-quality iOS / Liquid Glass agent skills for Cursor
# Run on the Mac where you develop iOS apps (Node required for npx).
set -euo pipefail

need_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

need_cmd npx
need_cmd node

echo "==> Installing core SwiftUI + Liquid Glass slice (dpearson2699/swift-ios-skills)"
npx skills add dpearson2699/swift-ios-skills \
  --skill swiftui-liquid-glass \
  --skill swiftui-animation \
  --skill swiftui-navigation \
  --skill swiftui-patterns \
  --skill swiftui-performance \
  --skill swiftui-layout-components \
  --skill ios-accessibility \
  --skill app-store-review \
  --skill widgetkit

echo "==> Installing Paul Hudson SwiftUI Pro"
npx skills add https://github.com/twostraws/swiftui-agent-skill --skill swiftui-pro

echo "==> Installing Dimillian Liquid Glass specialist"
npx skills add https://github.com/dimillian/skills --skill swiftui-liquid-glass

echo "==> Installing distilled Apple HIG (justinwetch/HIGAgentSkills)"
npx skills add justinwetch/HIGAgentSkills

echo "==> Installing Swift accessibility skill"
npx skills add https://github.com/PasqualeVittoriosi/swift-accessibility-skill

echo ""
echo "Done. In Cursor, pick Cursor when the skills CLI asks which agents to target."
echo "Optional next:"
echo "  brew install coot-ai/tap/coot && coot init && coot login"
echo "  npx skills check   # verify / update later"
