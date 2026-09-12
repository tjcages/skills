# VISUAL_GATE — Design-output hard rules (R100–R110)

**Load this file + `CRAFT_SPEC.md` before any UI invent / review / design / Figma / Paper / HTML / simulator show.**
**Source of truth:** extracted from `CRAFT_SPEC.md` §R. If they diverge, CRAFT_SPEC wins — re-extract.

**Hard-stop quartet (instant reject):** (1) vertical dock (2) missing secondary line on feed rows (3) emoji / emoji-like chrome icons (4) non-SF / custom UI fonts (Inter, etc.).

**Good refs:** `ap300-integrate/today_idle.png`, `pipeline_list.png`, `pipeline_deal_detail.png`; `ap300-linear-refs/linear_inbox.jpg`, `linear_issue_detail.jpg`  
**Fail refs (2026-09-11):** `totem-craft-figma/01-today.png`, `02-pipeline.png`, `03-deal-detail.png`

---

## R. Visual / design-output gate (R100–R110)

**Applies to:** Figma, Paper, HTML mockups, SwiftUI previews, simulator screenshots, and any artboard shown to a human. Design outputs are judged by the **same** craft bar as code — not a lower “concept” bar.

**Evidence baseline (good):** `/workspace/ap300-integrate/today_idle.png`, `pipeline_list.png`, `pipeline_deal_detail.png`; `/workspace/ap300-linear-refs/linear_inbox.jpg`, `linear_issue_detail.jpg`.  
**Evidence baseline (fail):** `/workspace/totem-craft-figma/01-today.png`, `02-pipeline.png`, `03-deal-detail.png` (2026-09-11 rejection).

### R100. Design outputs inherit §D + R98

Figma / Paper / HTML / simulator frames **must pass the same §D anti-patterns and R98 catalog** as production SwiftUI. “It’s just a concept” is not a waiver. Wireframe sparsity, emoji chrome, vertical docks, and fake status bars are **hard fails**, not WIP notes.

### R101. Mandatory pre-show screenshot self-critique

Before showing **any** screen to the user, capture/export a full-frame screenshot and self-critique against this checklist. Do **not** present until every item is green:

1. Dock is **horizontal stadium** (not vertical stack) — R103  
2. Search (if present) is a **detached circle**, same height/baseline as dock — R103  
3. **Zero emoji** in tabs, search, toolbar, or chrome — R102  
4. Every feed row has **title + secondary context** (and optional status) — R104  
5. Avatars/thumbs are **realistic** (photo, gradient, or branded art) — not flat solid hue — R107  
6. Section gaps are **24–32 pt**, not huge empty voids — R105 / R2  
7. Status bar is correct iPhone treatment **or omitted cleanly** — never broken fake dots/bars  
8. Icon weights/sizes match dock vs list roles — R106  
9. Artboard caption cites **R#** + CORPUS refs — R108  
10. At least **2–3 CORPUS** screens were pulled before inventing chrome — R109
11. Typography is **SF system text styles only** (no Inter/custom UI fonts) — R111
12. Nav/toolbar buttons are Liquid Glass (iOS 26+) — R112
13. Segment switchers use small glass variants — R112  

If any item fails → fix, re-screenshot, re-check. **Never** ship the failing frame to the user (R110).

### R102. No emoji chrome

**FORBIDDEN:** emoji, sticker glyphs, or emoji-like pictographs as tab icons, search icons, toolbar icons, segmented control glyphs, or any system chrome.  
**REQUIRED:** SF Symbols (or equivalent vector paths matching SF Symbol optical weight). User-content reactions (e.g. Linear “eyes” reaction on issue detail) may use emoji **only** inside content, never chrome.  
**Fail evidence:** totem-craft-figma docks with sun/tuning-fork/emoji-like glyphs.

### R103. Floating dock geometry (horizontal stadium)

Totem / Linear-class phone chrome:

| Spec | Value |
|---|---|
| Orientation | **Horizontal only** — never a vertical icon tower |
| Outer shape | Stadium / capsule (continuous) |
| Tab cell fixed width | **~52–56 pt** |
| Tab cell / dock height | **~40–44 pt** icon hit inside island height **52–66 pt** (R57) |
| Selected state | **Filled inner pill** (soft gray/tinted rounded rect) behind the active icon — not underline, not outer stroke alone |
| Detached search | **Circle**, **same height + baseline** as the stadium, gap **8–12 pt** |
| Side inset | **12–24 pt**; bottom inset **16–32 pt** above home indicator |
| Material | ultraThin / thin / Liquid Glass on chrome only; soft shadow OK on floating chrome |

**Reject:** vertical pill of stacked icons in a corner; search circle vertically misaligned; emoji inside dock cells.

**Canon:** Linear Inbox · Totem `today_idle` / `pipeline_list` · Music/Photos floating docks.

### R104. Feed row mandatory anatomy

Every admin/product feed row **MUST** include:

1. **Leading media** — circle avatar **40–44 pt** (feeds) **or** rounded-rect thumb **~12 pt** radius (deals/releases)  
2. **Primary title** — headline / 17 semibold, truncating  
3. **Secondary context line** — footnote/13 secondary (e.g. `Reply to Label · The Satellites`, `Northbound · Northline Music`, comment snippet)  
4. **Trailing meta** — relative time or equivalent, tertiary, top-aligned to title baseline  
5. **Optional status** — colored dot + short label (`Response Due`, `Pricing Shared`) on/near the secondary stack  

**Reject:** title-only rows; title + trailing date with no secondary line; missing leading media. Comfortable row band **64–80 pt** (R3) for Linear-class feeds.

### R105. Density floor vs wireframe

Compare every designed list to **Linear Inbox** and current Totem integrate screens before shipping:

- Section gap **24–32 pt** (R2) — not 48–80+ voids between sparse items  
- Rows carry **≥2 text lines** of content (title + secondary)  
- Visible structure: section labels + counts, hairlines **only** when density mode calls for them (Totem may use inset separators; Linear feeds often whitespace-only — pick deliberately via R97)  
- Detail screens: metadata as **pill island** or dense inset group — not a sparse 4-row card with huge internal whitespace  

**Fail:** totem-craft-figma Today/Pipeline/Deal detail (wireframe emptiness). **Pass bar:** `ap300-integrate/*` + Linear refs.

### R106. Iconography — SF Symbol weight & size

| Role | Size (pt) | Weight | Notes |
|---|---|---|---|
| Dock / tab glyphs | **22–24** optical | Regular / Medium | Selected may tint; sit inside filled inner pill |
| Detached search | **18–22** | Regular / Medium | Centered in circle |
| List leading system icons | **20–24** in ~36–40 circle | Regular | Linear notification glyphs |
| Toolbar / top capsule | **17–20** | Regular / Medium | Group in stadium capsule |
| Inline status / meta | **12–14** | Regular | Dots, chevrons, badges |

Never mix emoji scale with SF optical sizes. Prefer one family (`SF Pro` / SF Symbols) across chrome.

### R107. Avatar / media realism bar

| Surface | Treatment | Radius |
|---|---|---|
| Feed person/org avatar | Photo, initials-on-gradient, or branded art — **not** flat solid hue fill | Circle **40–44** |
| Deal / release / album thumb | Artwork or gradient placeholder with depth | Rounded rect **~10–12** (list) / **~16** (detail hero) |
| Badge overlays | Small SF Symbol on circle at bottom-trailing of thumb | ~14–16 badge |

**Reject:** flat purple/blue/orange/green solid circles or squares as the only “avatar.” Initials on a soft gradient are acceptable; solid `#7B61FF`-style circles are not.

### R108. Caption every artboard with R# citations

Every Figma/Paper/HTML artboard or exported frame **must** carry a caption (or sticky annotation) listing:

- Primary **R#** rules applied (e.g. R57, R103, R104, R105)  
- CORPUS / Mobbin URLs or local ref paths used  
- Density mode (comfortable vs compact — R97)  

PRs that include design stills cite the same R# set in the description.

### R109. Mobbin / CORPUS pull mandatory before inventing chrome

Before inventing **any** new chrome (dock, top capsules, composers, sheets, empty states):

1. Open `shared/CORPUS.md` (or research `CORPUS.md`)  
2. Pull **2–3** screens in the same archetype (`floating-tab`, `borderless-list`, `metadata-island`, `composer`, …)  
3. Match geometry to measured rules — do **not** freestyle a vertical dock or emoji tabs  

Skipping Mobbin/CORPUS for “speed” is a **process fail** equal to a visual fail.

### R110. Never present a failing screen

If a frame fails **dock horizontal**, **secondary-line**, or **emoji-chrome** checks (or any R101 item), it is **not presentable**. Fix first. Showing a known-failing design to solicit “direction” is forbidden — the craft bar is not optional feedback.

**Hard stop trio (instant reject):**
1. Vertical dock  
2. Missing secondary line on feed rows  
3. Emoji (or emoji-like) chrome icons  

---


### R111. SF system fonts only (no custom UI typefaces)

Admin / product UI uses **Apple system text styles** only (`Font.largeTitle`, `.title2`, `.headline`, `.body`, `.subheadline`, `.footnote`, `.caption`, …) so Dynamic Type and SF Pro / SF Compact tracking apply automatically.

**Forbidden in chrome, lists, detail, sheets, docks:** Inter, Roboto, Geist, custom brand display fonts, hardcoded `Font.custom(...)` for UI chrome.

**Allowed exceptions:** user-authored document canvas body (Notes-like) may use a reading face if product requires it — never for chrome/navigation/lists.

**Figma/Paper:** set type to SF Pro / SF Compact / New York only; never Inter for Totem admin frames.

**Evidence:** HIG Typography; R33 SF mapping; 2026-09-12 Tyler: “use Apple default fonts.”

### R112. Liquid Glass nav buttons + small glass segments (always)

See CRAFT_SPEC R112. Pre-show checklist add:

12. Nav/toolbar header buttons are **Liquid Glass** (iOS 26+) — no opaque gray/blue chrome squares — R112  
13. Deals/People (and similar) segments use **small glass** variants, not hard fills — R112

