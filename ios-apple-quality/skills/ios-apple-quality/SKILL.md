---
name: ios-apple-quality
license: MIT
metadata:
  version: "0.1.0"
  status: draft
description: >-
  Use when building, designing, reviewing, or shipping native iOS/iPadOS/SwiftUI
  apps, adopting Liquid Glass, checking HIG, accessibility, or running device
  previews with Mobbin, Revyl, or Coot.
paths: "**/*.swift,**/*.xcworkspace/**,**/*.xcodeproj/**,**/Package.swift,**/Info.plist,**/*.xcstrings,**/*.stringsdict"
---

Full methodology: [METHODOLOGY.md](./METHODOLOGY.md). Chat shape: [RESPONSE.md](./RESPONSE.md).

# iOS Apple-Quality Harness

Treat every iOS change as if Apple Design shipped it. Prefer native system APIs over custom chrome.

## Always load / follow

1. **HIG** — `apple-hig` / distilled Human Interface Guidelines for layout, typography, navigation, and platform idioms.
2. **SwiftUI craft** — `swiftui-pro` (Paul Hudson): avoid LLM footguns (deprecated APIs, VoiceOver-blind controls, surprise performance).
3. **Liquid Glass** — `swiftui-liquid-glass` (prefer native `glassEffect`, `GlassEffectContainer`, glass button styles).
4. **Accessibility** — VoiceOver, Dynamic Type, Reduce Motion, 44pt targets, Nutrition Labels readiness.
5. **Visual calibration** — when inventing or reviewing UI, search **Mobbin** for real shipping iOS patterns in the same category before freelancing.

## Liquid Glass rules

- Rebuild with latest Xcode SDK so standard bars, sheets, and controls adopt glass automatically.
- Custom glass only on **functional** controls and navigation — not content backgrounds.
- Group sibling glass views in `GlassEffectContainer`; morph with `glassEffectID` + `@Namespace`.
- Apply `.glassEffect` after layout/appearance modifiers.
- Use `.interactive()` only on tappable/focusable elements.
- Gate with `#available(iOS 26, *)` and provide a material / non-glass fallback.
- Prefer `.buttonStyle(.glass)` / `.glassProminent` for actions.

## Tool harness (use what's connected)

| Need | Tool |
|------|------|
| Design reference screens | Mobbin connector |
| Code intelligence | swift-lsp (SourceKit-LSP) |
| Real iPhone install link (short-lived IPA) | Coot CLI (`coot` after `coot init` / `coot login`) |
| Cloud device proof / PR evidence | Revyl skills + CLI |
| Local simulator build/debug | XcodeBuildMCP or Xcode MCP when configured |

## Default workflow for new UI or big redesigns

1. Clarify platform (iPhone / iPad / Mac Catalyst) and navigation paradigm.
2. Pull 2–3 Mobbin references in the same product category.
3. Sketch with system components first (TabView, NavigationStack, sheets, toolbars).
4. Implement SwiftUI with Liquid Glass only where Apple would (chrome, not content).
5. Run accessibility pass (`swiftui-pro` + accessibility skill).
6. Preview on device: Coot link for physical iPhone, and/or Revyl cloud device for proof.
7. App Review / HIG sanity check before shipping.

## Anti-patterns (reject these)

- Custom blur stacks instead of Liquid Glass APIs
- Purple neon / harsh undiffused shadows / non-squircle corners as default chrome
- Touch targets under 44×44 pt
- Hard-coded bar heights that fight system Liquid Glass metrics
- Glass on large content surfaces that hurt legibility
- Shipping without Dynamic Type / VoiceOver labels

## When reviewing a PR or existing screen

Check: HIG navigation, Liquid Glass correctness, accessibility, performance invalidation, and whether Mobbin-quality polish is present — then fix or file concrete diffs.
