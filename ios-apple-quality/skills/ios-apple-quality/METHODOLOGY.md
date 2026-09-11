# Methodology — iOS Apple-Quality Harness

## Thesis

Treat every native iOS change as if Apple Design is reviewing the build. Prefer system frameworks. Calibrate taste against shipping apps. Prove on real devices.

## Layers

1. **Law** — distilled Apple HIG (`apple-hig` / equivalent).
2. **Craft** — SwiftUI Pro + Liquid Glass specialist skills; avoid LLM footguns.
3. **Taste** — Mobbin references in the same product category before inventing UI.
4. **Proof** — Coot short-lived IPA links; Revyl cloud-device / PR evidence; simulator screenshots.
5. **Contract** — path-scoped Cursor skill + marked `AGENTS.md` so every agent inherits the same rules.

## Liquid Glass

- System bars, sheets, and controls adopt glass on the latest SDK — prefer them.
- Custom `glassEffect` only on **functional** controls and navigation, never content backgrounds.
- Group siblings in `GlassEffectContainer`; morph with `glassEffectID` + `@Namespace`.
- Apply `.glassEffect` after layout/appearance modifiers.
- `.interactive()` only on tappable/focusable elements.
- Gate with `#available(iOS 26, *)` and ship a material fallback.

## Default workflow

1. Clarify platform and navigation paradigm.
2. Pull 2–3 Mobbin references in-category.
3. System components first (`NavigationStack` / `NavigationSplitView`, toolbars, lists, sheets).
4. Liquid Glass only where Apple would (chrome, not content).
5. Accessibility pass: VoiceOver, Dynamic Type, Reduce Motion, ≥44×44 pt targets.
6. Device proof via Coot and/or Revyl when configured.
7. HIG / App Review sanity check before shipping.

## Anti-patterns

Custom blur stacks instead of Liquid Glass APIs · purple neon / harsh undiffused shadows · under-44pt targets · hard-coded bar metrics · glass on large content surfaces · “Bootstrap admin” look · shipping without a11y labels.

## Upstream skills (install script)

- `dpearson2699/swift-ios-skills` (SwiftUI + a11y + review slice)
- `twostraws/swiftui-agent-skill` → `swiftui-pro`
- `dimillian/skills` → `swiftui-liquid-glass`
- `justinwetch/HIGAgentSkills`
- `PasqualeVittoriosi/swift-accessibility-skill`

## Tooling

| Need | Tool |
|------|------|
| Design references | Mobbin |
| Code intelligence | swift-lsp |
| Physical iPhone install link | Coot CLI |
| Cloud device proof | Revyl |
| Local simulator | XcodeBuildMCP / Xcode MCP |
