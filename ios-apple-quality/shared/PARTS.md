# AdminChrome — parts catalogue (lego blocks)

**Canon path (Totem):** `apps/admin-ios/Packages/TotemAdminKit/Sources/AdminChrome/`  
**Rule:** Assemble screens from these parts only. **Do not invent new chrome** without explicit user permission. If permission is granted, the new part must match AdminChrome tokens / Liquid Glass / SF rules and be added to this file in the same PR.

Open this file first before any UI invent / redesign / Figma→code pass.

| Part | File | Use when | Forbidden substitutes |
|---|---|---|---|
| Tokens | `AdminChromeTokens.swift` | Any spacing, radius, color, type, dock geometry | Hardcoded literals, Inter, custom glass fills |
| Glass circle button | `GlassCircleButton.swift` | Nav/toolbar 36pt actions (`+`, `≡`, `…`) | Opaque gray squares, fused sausage buttons |
| Floating dock | `FloatingDock.swift` | Root tab chrome (Today / Pipeline / Releases / More) | Vertical docks, emoji tabs, rainbow selected glow |
| Floating search | `FloatingSearchButton.swift` | Detached search beside dock | Search inside dock stadium |
| Small glass segment | `SmallGlassSegment.swift` | Deals\|People, Activity\|Files\|People | Hard fills, washed labels, layout-jumping neighbors |
| Feed row | `FeedRow.swift` | Lists (Today, Pipeline, Releases) | Title-only rows, shared placeholder avatars |
| Metadata island | `MetadataIsland.swift` | Deal detail key/value | Grey slab cards not in Figma |
| Composer bar | `ComposerBar.swift` | Deal comment / dock→composer morph | Opaque gray bars, send outside stadium |
| More menu morph | `MoreMenuMorph.swift` | 4th dock slot overflow | Center Kavsoft popover, illegible white-on-white |
| Header action cluster | `HeaderActionCluster.swift` | Multi actions in nav (Releases, Pipeline) | ≥3 controls jammed in one grey pill |
| Section header | `SectionHeader.swift` | Pipeline / Releases / Today sections | Inconsistent separator x |

## Agent hard rule (R116)

1. **Compose only** — import `AdminChrome` and use catalogue parts.
2. **Need a new part?** Stop. Ask the user. Describe why no existing part fits. Wait for yes.
3. **If yes** — implement as one file under `AdminChrome/`, match tokens, add a row to this catalogue in the same PR.
4. Soft leftovers vs tokens = **FAIL** (see VISUAL_GATE R114–R115).

## Totem screen recipes → parts

| Screen | Parts |
|---|---|
| Today | FloatingDock + FloatingSearch + GlassCircleButton + SectionHeader + FeedRow + MoreMenuMorph |
| Pipeline | FloatingDock + FloatingSearch + GlassCircleButton + SmallGlassSegment + SectionHeader + FeedRow |
| Deal | GlassCircleButton + MetadataIsland + SmallGlassSegment + ComposerBar + FeedRow (activity) |
| Releases | FloatingDock + HeaderActionCluster + SectionHeader + FeedRow |
| Performance / Settings | FloatingDock + tokens shell; no freestyle chrome |
