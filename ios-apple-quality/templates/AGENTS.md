# AGENTS.md — iOS Apple-Quality Harness

When working in this repo, treat UI and product decisions as if Apple Design is reviewing the build.

## Required skill

Always apply `.cursor/skills/ios-apple-quality/SKILL.md` (also invokable as `/ios-apple-quality`). Prefer it over ad-hoc design instincts.

## Non-negotiables

- Native SwiftUI / UIKit system components first; custom chrome only when the HIG has no fit.
- Liquid Glass (iOS 26+): system bars/sheets/controls auto-adopt; custom `glassEffect` only on functional controls and navigation — never content backgrounds. Use `GlassEffectContainer`, `glassEffectID` + `@Namespace` for grouped/morphing glass. Gate with `#available(iOS 26, *)` and ship a fallback.
- Accessibility: VoiceOver labels, Dynamic Type, Reduce Motion, ≥44×44 pt targets.
- Before inventing UI, check Mobbin for real shipping iOS patterns in the same category.
- Device proof: Coot for short-lived physical iPhone install links; Revyl for cloud-device / PR evidence when configured.

## Anti-patterns

Custom blur stacks instead of Liquid Glass APIs; hard-coded bar metrics; under-44pt targets; glass on large content surfaces; shipping without a11y labels.

## Related tools

Mobbin · swift-lsp · Revyl · Coot (`coot init` / `coot login` on the Mac) · `swiftui-pro` · `swiftui-liquid-glass` · `apple-hig`
