# Recipe: Floating tab island + detached search circle

**Surfaces:** Totem phone shell (Today / Pipeline / …), Linear Inbox, Music/Photos docks.  
**Primary rules:** R27, R32, R45, R56–R58, **R102–R103**, R106, R110.  
**CORPUS:** Linear Inbox `f97b18e7-…` · Music Library `e7448a59-…` · Photos Library `e0fcd8e0-…` · Totem `today_idle.png`, `pipeline_list.png`.

## Layout skeleton

```
                    content scrolls above dock

     ┌──────────────────────────┐   ┌────┐
     │  [◉]  [ ]  [ ]  [ ]      │   │ 🔍 │
     │   ↑ filled inner pill    │   │    │
     └──────── stadium ─────────┘   └circle┘
        ← same baseline / height →
     side inset 12–24 · bottom inset 16–32
```

## Geometry (R103 — non-negotiable)

| Spec | Value |
|------|-------|
| Orientation | **Horizontal only** |
| Island shape | Stadium / capsule |
| Island height | **52–66 pt** (Totem token ~58) |
| Tab cell | Fixed width **~52–56**, hit height **~40–44** |
| Selected | Soft **filled inner pill** behind icon (gray/tint) — not underline |
| Search | **Detached circle**, same height + baseline, gap **8–12** |
| Icons | SF Symbols only, optical **22–24** (R102, R106) |
| Material | ultraThin / thin / Liquid Glass; soft shadow OK |

## Variants

- **Linear / Totem 4–5 tab island** + search circle  
- **Photos dual-segment** (Library | Collections) + search FAB  
- **Music:** mini-player capsule stacked **above** tab island (8 pt gap) — do not merge  

## Anti-patterns (instant reject)

- **Vertical** icon stack / corner tower (fail: totem-craft-figma docks)  
- Emoji or emoji-like dock glyphs  
- Search circle vertically misaligned or merged into a weird L-shape  
- Full-bleed opaque custom UITabBar paint  
- Underline-only selected indicator as default  

## SwiftUI sketch

See CRAFT_SPEC §H1 `AdminFloatingDock`. Prefer fixed-width cells over `maxWidth: .infinity` stretch if tab count is small — keep optical ~52–56.

## Totem notes

Phone shell always uses this recipe. iPad regular width → **do not** copy as sole IA; use `NavigationSplitView` (`IPAD_CRAFT`).
