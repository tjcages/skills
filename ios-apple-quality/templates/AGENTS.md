# AGENTS.md — iOS Apple-Quality Harness

When working in this repo, treat UI and product decisions as if Apple Design + Tyler craft review will reject mediocrity.

## Required skill

Always apply `.cursor/skills/ios-apple-quality/SKILL.md` (also invokable as `/ios-apple-quality`). Prefer it over ad-hoc design instincts.

## Measured craft (mandatory)

For **any** UI invent / review / design / Figma / Paper / HTML / simulator show:

1. Load `shared/CRAFT_SPEC.md` (R1–R110) — cite R# in PRs and artboard captions.
2. Load `shared/VISUAL_GATE.md` (R100–R110) — run screenshot self-QA **before** showing designs to humans.
3. Load `shared/IPAD_CRAFT.md` when regular width / iPad.
4. Pull **2–3** screens from `shared/CORPUS.md` / Mobbin before inventing chrome (R109).
5. Use `shared/RECIPES/` for Totem admin surfaces (list, detail, floating-tab, composer, inset-grouped).

## Non-negotiables

- Native SwiftUI / UIKit system components first; custom chrome only when the HIG has no fit.
- **No emoji chrome** (tabs/search/toolbar) — SF Symbols / vector only (R102).
- **No vertical floating docks** — horizontal stadium; tab cells ~52–56×~40–44; selected = filled inner pill; detached search = circle same baseline (R103).
- Feed rows: avatar/thumb + title + **secondary context** + trailing meta (+ optional status) (R104); density floor vs Linear/Totem integrate (R105).
- Liquid Glass (iOS 26+): system bars/sheets/controls auto-adopt; custom `glassEffect` only on functional chrome — never content backgrounds. Gate with `#available(iOS 26, *)` + fallback.
- Accessibility: VoiceOver labels, Dynamic Type, Reduce Motion, ≥44×44 pt targets.
- Device proof: Coot for short-lived physical iPhone install links; Revyl for cloud-device / PR evidence when configured.

## Anti-patterns

Emoji chrome · vertical docks · sparse wireframe lists · flat solid-hue avatars · fake status bars · presenting without VISUAL_GATE pass · custom blur stacks instead of Liquid Glass · under-44pt targets · glass on content paper.

## Related tools

Mobbin · CORPUS.md · CRAFT_SPEC · VISUAL_GATE · swift-lsp · Revyl · Coot · `swiftui-pro` · `swiftui-liquid-glass` · `apple-hig`
