---
name: ios-apple-quality
license: MIT
metadata:
  version: "0.2.0-draft"
  status: draft
description: >-
  Use when building, designing, reviewing, or shipping native iOS/iPadOS/SwiftUI
  apps, inventing Figma/Paper chrome, adopting Liquid Glass, checking HIG,
  accessibility, or running device previews with Mobbin, Revyl, or Coot.
  Enforces measured CRAFT_SPEC (R1–R110) + VISUAL_GATE — forbids emoji chrome
  and vertical docks.
paths: "**/*.swift,**/*.xcworkspace/**,**/*.xcodeproj/**,**/Package.swift,**/Info.plist,**/*.xcstrings,**/*.stringsdict"
---

Full methodology: [METHODOLOGY.md](./METHODOLOGY.md). Chat shape: [RESPONSE.md](./RESPONSE.md).  
Measured encyclopedia: [../../shared/CRAFT_SPEC.md](../../shared/CRAFT_SPEC.md).  
Visual hard gate: [../../shared/VISUAL_GATE.md](../../shared/VISUAL_GATE.md).  
Corpus: [../../shared/CORPUS.md](../../shared/CORPUS.md).  
iPad: [../../shared/IPAD_CRAFT.md](../../shared/IPAD_CRAFT.md).  
Recipes: [../../shared/RECIPES/](../../shared/RECIPES/).

# iOS Apple-Quality Harness (0.2.0-draft)

Treat every iOS **code and design** change as if Apple Design + Tyler craft review will reject mediocrity. Prefer native system APIs. Calibrate against **measured** rules (R#) — not HIG platitudes.

## Always load (UI invent / review / design)

Before inventing, redesigning, reviewing, or **showing** any screen:

1. **`shared/CRAFT_SPEC.md`** — full numbered rules (R1–R110). Cite R# in PRs and artboard captions.
2. **`shared/VISUAL_GATE.md`** — R100–R110 hard gate (screenshot self-QA). **Mandatory** for Figma/Paper/HTML/simulator.
3. **`shared/IPAD_CRAFT.md`** — when regular width / iPad / `NavigationSplitView`.
4. **`shared/CORPUS.md`** — pull **2–3** Mobbin screens in-archetype **before inventing chrome** (R109).
5. **Matching recipe** under `shared/RECIPES/` (list, detail, floating-tab, composer, inset-grouped, …).

Also keep: HIG / `swiftui-pro` / Liquid Glass / a11y skills as supporting layers — they do **not** replace CRAFT_SPEC.

## Hard forbids (instant reject)

- **Emoji / emoji-like glyphs as chrome** (tabs, search, toolbar, segmented controls) — SF Symbols / vector only (R102).
- **Vertical floating docks** / icon towers — dock MUST be **horizontal stadium**; tab cells fixed ~52–56×~40–44; selected = filled inner pill; detached search = **circle** same height baseline (R103).
- **Title-only / wireframe-sparse rows** — every feed row needs avatar/thumb + title + secondary context + trailing meta (+ optional status) (R104–R105).
- **Flat solid-hue avatar circles** — use photo, gradient, or branded artwork (R107).
- **Showing designs without screenshot self-QA** against VISUAL_GATE (R101, R110).

## Liquid Glass rules

- Rebuild with latest Xcode SDK so standard bars, sheets, and controls adopt glass automatically.
- Custom glass only on **functional** controls and navigation — not content backgrounds (R45).
- Group sibling glass views in `GlassEffectContainer`; morph with `glassEffectID` + `@Namespace`.
- Apply `.glassEffect` after layout/appearance modifiers.
- Use `.interactive()` only on tappable/focusable elements.
- Gate with `#available(iOS 26, *)` and provide a material / non-glass fallback.
- Prefer `.buttonStyle(.glass)` / `.glassProminent` for actions.

## Tool harness

| Need | Tool |
|------|------|
| Design reference screens | Mobbin connector + `shared/CORPUS.md` |
| Measured craft rules | `shared/CRAFT_SPEC.md` + `VISUAL_GATE.md` |
| Code intelligence | swift-lsp (SourceKit-LSP) |
| Real iPhone install link | Coot CLI (`coot` after `coot init` / `coot login`) |
| Cloud device proof / PR evidence | Revyl skills + CLI |
| Local simulator build/debug | XcodeBuildMCP or Xcode MCP when configured |

## Default workflow (new UI / redesign / Figma)

1. Clarify platform (iPhone / iPad / Mac Catalyst) and navigation paradigm.
2. Load CRAFT_SPEC + VISUAL_GATE (+ IPAD_CRAFT if regular width).
3. Pull **2–3** CORPUS/Mobbin references in the same archetype (R109).
4. Open the matching **recipe** (Totem: Today → `list` + `floating-tab`; Pipeline → `list`; Deal → `detail` + `composer`; Settings → `inset-grouped`).
5. Sketch with system components first; apply R57/R103 dock geometry; R104 row anatomy.
6. Implement SwiftUI with Liquid Glass only on chrome; or draw Figma to the same tokens.
7. **Screenshot self-QA** vs VISUAL_GATE R101 checklist — fix until green (R110).
8. Caption artboards / PR notes with **R#** citations (R108).
9. Accessibility pass; device proof via Coot / Revyl when configured.

## Totem admin surface → recipe map (R99)

| Surface | Recipes | Primary R# |
|---------|---------|------------|
| Today / Home | `list.md` + `floating-tab.md` | R57, R103–R105 |
| Pipeline list | `list.md` + `floating-tab.md` | R71–76, R104 |
| Deal / issue detail | `detail.md` + `composer.md` | R77–81, R107 |
| Settings | `inset-grouped.md` | R79, R11.3 |
| Search | `floating-tab.md` (search circle) | R57, R89, R103 |

## Anti-patterns (reject these)

- Emoji chrome; vertical docks; sparse wireframe lists
- Flat solid avatars; fake/broken status bars
- Custom blur stacks instead of Liquid Glass APIs
- Purple neon / harsh undiffused shadows / one radius everywhere
- Touch targets under 44×44 pt; glass on content paper
- Shipping / presenting without Dynamic Type / VoiceOver / VISUAL_GATE pass

## When reviewing a PR or existing screen

Load CRAFT_SPEC + VISUAL_GATE → run §D + R101 → cite failing R# → fix or file concrete diffs. Prefer measured tokens over taste opinions.
