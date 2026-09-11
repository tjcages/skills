# Methodology — iOS Apple-Quality Harness (0.2.0-draft)

## Thesis

Treat every native iOS **code and design** change as if Apple Design and Tyler craft review will reject it. Prefer system frameworks. Calibrate against **measured** CRAFT_SPEC rules (R1–R110) and CORPUS Mobbin evidence — not HIG slogans. Prove with screenshots against VISUAL_GATE before showing humans.

## Layers

1. **Law** — distilled Apple HIG (`apple-hig` / equivalent).
2. **Measured craft** — `shared/CRAFT_SPEC.md` (R1–R110) + `shared/IPAD_CRAFT.md` for regular width.
3. **Visual gate** — `shared/VISUAL_GATE.md` (R100–R110): screenshot self-QA; forbids emoji chrome + vertical docks + sparse rows.
4. **Taste calibration** — `shared/CORPUS.md` + Mobbin: pull 2–3 in-archetype screens before inventing chrome (R109).
5. **Recipes** — `shared/RECIPES/*.md` lock layout skeletons for Totem admin surfaces.
6. **Craft skills** — SwiftUI Pro + Liquid Glass; avoid LLM footguns.
7. **Proof** — VISUAL_GATE pass → Coot IPA links / Revyl cloud evidence / simulator screenshots.
8. **Contract** — path-scoped Cursor skill + `AGENTS.md` requiring CRAFT_SPEC + VISUAL_GATE.

## 2026-09-11 lesson

A Figma pass that ignored measured dock geometry, row anatomy, and SF Symbol chrome was rejected as horrible. **Design outputs inherit the same anti-patterns as code (R100).** Never present a frame that fails the hard-stop trio (R110): vertical dock / missing secondary line / emoji chrome.

## Liquid Glass

- System bars, sheets, and controls adopt glass on the latest SDK — prefer them.
- Custom `glassEffect` only on **functional** controls and navigation, never content backgrounds.
- Group siblings in `GlassEffectContainer`; morph with `glassEffectID` + `@Namespace`.
- Apply `.glassEffect` after layout/appearance modifiers.
- `.interactive()` only on tappable/focusable elements.
- Gate with `#available(iOS 26, *)` and ship a material fallback.

## Default workflow

1. Clarify platform and navigation paradigm.
2. Load CRAFT_SPEC + VISUAL_GATE (+ IPAD_CRAFT if iPad/regular).
3. Pull 2–3 CORPUS/Mobbin references in-category (R109).
4. Open matching recipe; apply tokens (gutter 20, section 24–32, dock stadium, one accent).
5. System components first; Liquid Glass only on chrome.
6. Screenshot self-QA vs R101 checklist; fix until green.
7. Caption with R#; accessibility pass; device proof via Coot/Revyl.
8. HIG / App Review sanity before shipping.

## Hard forbids

Emoji chrome · vertical floating docks · title-only sparse rows · flat solid-hue avatars · fake status bars · presenting without VISUAL_GATE screenshot pass · inventing chrome without CORPUS pull.

## Upstream skills (install script)

- `dpearson2699/swift-ios-skills` (SwiftUI + a11y + review slice)
- `twostraws/swiftui-agent-skill` → `swiftui-pro`
- `dimillian/skills` → `swiftui-liquid-glass`
- `justinwetch/HIGAgentSkills`
- `PasqualeVittoriosi/swift-accessibility-skill`

## Tooling

| Need | Tool |
|------|------|
| Design references | Mobbin + CORPUS.md |
| Measured rules | CRAFT_SPEC + VISUAL_GATE |
| Code intelligence | swift-lsp |
| Physical iPhone install link | Coot CLI |
| Cloud device proof | Revyl |
| Local simulator | XcodeBuildMCP / Xcode MCP |
