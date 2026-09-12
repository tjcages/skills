# iOS UI Craft Spec — Encyclopedia (Measured)

**Scope:** Enforceable, agent-implementable rules for native iOS / iPadOS / Mac-class SwiftUI admin-quality UI.  
**Method:** Mobbin screenshots at **≈299×678 px** scaled to iPhone width **390 pt** → **scale ≈ 1.304** (`pt = px × 390/299`). Wider frames (768 / 1280) are noted with native dimensions — do not apply ×1.304.  
**Corpus apps:** Linear Mobile, ChatGPT, Apple Notes (+ markup), Apple Music, Apple Photos, Freeform, Apple Wallet, App Store, Obsidian; HIG for iPad split/inspector.  
**Not in scope:** Vague HIG restatements. Every rule cites app evidence and a measurable range.  
**Uncertainty:** ±2–4 pt on gutters/radii (Mobbin compression + aliasing). Prefer the **center of the range** when implementing.

**Rule index:** R1–R23 (foundation, retained); **R24–R99** (encyclopedia); **R100–R110** (visual / design-output gate — mandatory for Figma/Paper/HTML/simulator). Agents cite rule IDs in PR notes and artboard captions.

---

## A. Measurement baselines (this corpus)

| Screen / archetype | Content gutter (pt) | Chrome pattern | Hierarchy method | Frame note |
|---|---|---|---|---|
| Linear Inbox | **20–24** | Floating island tab + detached search circle | Weight/color/space — **no row hairlines** | 299×678 ×1.304 |
| Linear Issue detail | **20–22** | Floating comment island | Gray fill islands + pills — **no boxed borders** | 299 |
| Linear My Issues / View Options | **16–20** | Floating tab; sheet + chip cloud | Selected chip = fill; idle = gray / stroke | 299 |
| ChatGPT chat / composer | **16–26** | Floating Ask capsule (+ voice circle / + FAB) | Weight/color; sparse hairlines | 299 |
| Apple Notes Folders | **16** (inset card edge) | Inset grouped + floating search/compose | White cards on `#F2F2F7`; inset hairlines | 299 |
| Apple Notes markup | **16–20** | Floating PencilKit stadium + Done circle | Canvas paper; selection handles | 299 |
| Apple Music Library / Listen Now | **18–22** | Floating glass tab + mini-player island (+ search FAB) | Accent red; inset separators; carousel gutters ~10–12 | 299 |
| Apple Photos Library | **0** grid / **16–20** chrome text | Dual-segment tab pill + circular search FAB | Edge-to-edge 3-col; micro gutters **1–2 pt** | 299; tile ≈99 px → ≈129 pt |
| Apple Photos Collections / Albums | **16–20** | Same floating dual tab | systemGray6 / media cards **20–28 pt** radius | 299 |
| Freeform canvas | canvas | Floating stadium tool palette + Done circle | Dot grid; selection handles; glass chrome | 299 |
| Apple Wallet stack / Apple Card | **16–20** | Stacked passes; floating circular tools | Continuous card **28–32 pt**; 2-col metric grid **12–16** gutters | 298–299 |
| App Store product | **16–20** | System tab bar; pill Get/Open | Stats row + hairline vertical dividers; peeking carousels | 299 |
| Obsidian note | **16–20** | Floating stadium nav / keyboard accessory | Document chrome; sidebar toggle | 299 |

Pixel samples: Linear Inbox content left ≈15–16 px → **19.6–20.9 pt**; Music ≈15–16 px → **19.6–20.9 pt**; Photos grid seams **1–2 px** → **1.3–2.6 pt**; Notes white card ≈12 px → **15.7 pt**.

---

## B. Numbered craft rules (agent-enforceable)

### 0. Foundation (R1–R23 retained)

**R1. Default side gutter = 20 pt** — primary product/admin feeds. Allow **16** for Settings/Notes inset-grouped; **22–24** for dense Linear avatars.  
**Evidence:** Linear Inbox (~21); Music (~20); Notes Folders (~16); ChatGPT (~16–26).

**R2. Vertical section gap = 24–32 pt** between major blocks.  
**Evidence:** Music Library list→Recently Added; Linear issue title→metadata→body; App Store section stacks.

**R3. Row height bands** — Compact **44**; Standard **52–56**; Comfortable **64–80**. Never interactive **< 44**.  
**Evidence:** Notes/Music ~44–48; Linear Inbox ~65–80.

**R4. Internal card padding = 12–16 pt.**  
**Evidence:** Linear metadata island; Notes cards; Wallet transaction cards.

**R5–R7.** Type scale / title∶body ratio / secondary color — see §2 (expanded).  
**R8–R10.** Radius roles / fills over strokes / shadows on floating chrome only — see §3–4.  
**R11–R14.** Chrome patterns + floating island geometry — see §5.  
**R15–R20.** Hierarchy without borders, chips, empty states, one accent — see §7–8.  
**R21–R23.** Hit targets ≥44; destructive = semantic red; glass on chrome only — see §3, §12.

---

### 1. Spacing system (R24–R32)

**R24. 4/8 pt grid is law**  
All spacing tokens snap to **4 pt** (prefer **8 pt** multiples). Allowed: 4, 8, 12, 16, 20, 24, 28, 32, 40, 48. Reject 6, 10, 14, 18 unless optical centering of icons inside 44 pt targets.

**R25. Phone content gutters by surface**

| Surface | Gutter |
|---|---|
| Admin / product feed (Linear-class) | **20 pt** |
| System inset-grouped (Notes/Settings/Wallet lists) | **16 pt** to card edge |
| Media edge-to-edge grid (Photos Library) | **0** (full bleed) |
| Carousel start inset (Music / App Store) | **16–20 pt** side; peek next card **24–40 pt** visible |

**R26. iPad / regular-width gutters**  
Sidebar column: **12–16 pt** internal list inset. Detail/document canvas: **20–28 pt** from column edge (or follow `safeAreaInsets`). Inspector: **16 pt**. Never copy phone **20** blindly into a 320 pt sidebar — it wastes width.  
**Evidence:** HIG NavigationSplitView examples; Freeform/Notes document chrome; see `IPAD_CRAFT.md`.

**R27. Safe areas**  
- Respect top safe area (Dynamic Island / notch) — large titles sit below status.  
- Floating docks: bottom inset **16–32 pt** above home indicator (not flush).  
- Side safe area on landscape iPhone: keep chrome inside, content may bleed under if full-bleed media.  
**Evidence:** Photos/Music/Linear floating docks; Freeform toolbars.

**R28. Section gaps taxonomy**

| Gap | pt | Use |
|---|---|---|
| Micro | **8** | Within chip rows; icon↔label |
| Tight | **12–16** | Title→subtitle; card internal stacks |
| Section | **24–32** | Between major blocks |
| Chapter | **40–48** | Rare — after hero before first section (Wallet Apple Card; Music hero) |

**R29. List separator inset vs full-bleed**  
1. **No separator** — Linear-style feeds (whitespace only).  
2. **Inset to label column** — Notes Folders, Music category list, Wallet transactions: hairline starts at text, **not** under leading icon; **0.5–1 pt** tertiary.  
3. **Full-bleed hairline** — rare; only inside dense system tables when HIG default. Prefer (2).  
**Reject:** Full-width hairlines under avatars in admin feeds.

**R30. Stack spacing inside rows**  
Avatar/icon → text: **12–16 pt**. Title → subtitle: **2–4 pt**. Trailing meta aligned to first text baseline or optical center of multi-line stack.

**R31. Grid gutters**

| Grid | Columns (phone) | Gutter | Aspect |
|---|---|---|---|
| Photos Library | **3** | **1–2 pt** | 1∶1 tiles |
| Photos Collections cards | **2** (typical) | **12–16 pt** | ~1∶1, radius 20–28 |
| Music album / Recently Added | **2** | **10–16 pt** | 1∶1 art, radius 8–12 |
| Music carousel | horizontal | **10–12 pt** between cards | 1∶1 or 16∶9 video |
| App Store screenshot carousel | horizontal | **12–16**; side margin **16–20** | device-framed |
| Wallet metric widgets | **2-col asymmetric** | **12–16** | variable height |

**Evidence:** Photos Library measured seams 1–2 px → ~1.3–2.6 pt; Music carousels; Wallet Apple Card grid.

**R32. Composer / dock side inset**  
Floating islands inset **12–24 pt** from screen sides; never kiss the edge. Detached search/voice circles share the same bottom baseline as the island with **8–12 pt** gap.

---

### 2. Typography system (R33–R40)

**R33. Full SF text-style mapping (Dynamic Type = Large / default)**

| Text style | Size | Leading | Default weight | Emphasized | Admin role |
|---|---|---|---|---|---|
| Large Title | **34** | 41 | Regular → **Bold** in nav | Bold | Screen titles (Inbox, Library, Folders) |
| Title 1 | **28** | 34 | Regular | Bold | Rare hero |
| Title 2 | **22** | 28 | Regular | Bold | Section headers (Music, App Store, Wallet “Latest…”) |
| Title 3 | **20** | 25 | Regular | Semibold | Subsection / detail titles |
| Headline | **17** | 22 | **Semibold** | Bold | Row titles needing weight |
| Body | **17** | 22 | Regular | Semibold | Primary reading / row titles |
| Callout | **16** | 21 | Regular | Semibold | Dense admin secondary |
| Subhead | **15** | 20 | Regular | Semibold | Meta lines |
| Footnote | **13** | 18 | Regular | Semibold | Timestamps, IDs, captions |
| Caption 1 | **12** | 16 | Regular | Semibold | Micro section labels |
| Caption 2 | **11** | 13 | Regular | Semibold | Uppercase category (Music “PERFORMING ARTISTS”) |

**Source:** Apple HIG Typography (iOS/iPadOS Dynamic Type — Large). Prefer `Font.largeTitle` etc. so Dynamic Type scales automatically.

**R34. Tracking (SF Pro, selected sizes)**  
At body **17 pt**: tracking ≈ **−0.43 pt** (−26/1000 em). At **13**: ≈ −0.08. At **12**: 0. At **11**: +0.06. System fonts apply this automatically — do not hardcode tracking on `Font.system` unless custom fonts.  
**Source:** HIG SF Pro tracking table.

**R35. Title∶body ratio**  
- Large-title screens: **≈ 2.0×** (34/17).  
- Detail screens: **≈ 1.4–1.6×** (22–28 / 17).  
Reject same-size title/body with only color change.

**R36. Caps / micro labels**  
Section micro-headers: **11–13 pt**, Medium/Semibold, `secondaryLabel`, often **uppercase** + slight tracking (Music, Wallet “PREPARE FOR YOUR VISIT”, Photos settings “IN-APP NOTIFICATIONS”).

**R37. Secondary / tertiary color hierarchy**  
- Primary: `label` / near-black.  
- Secondary: `secondaryLabel` / `#8E8E93`-class — timestamps, subtitles, IDs.  
- Tertiary: `tertiaryLabel` — placeholders, disabled.  
On immersive dark media (Music Now Playing, Photos Memory), opacity hierarchy OK. Prefer semantic colors over raw hex in production.

**R38. Dynamic Type requirements**  
All admin text uses text styles or `UIFontMetrics`. Test at **AX2** minimum. Truncate with `lineLimit` + accessibility, never clip mid-glyph. Floating chrome must reflow (dock may switch to icons-only at large sizes).

**R39. Numeric / tabular**  
Currency, IDs, timestamps in lists: prefer **monospacedDigit** / rounded design where columns align (Wallet amounts).

**R40. Document body (Notes / Obsidian / Freeform text)**  
H1 ≈ Large Title / Title 1; H2 ≈ Title 2–3; body 17. Comfortable line length on iPad: **60–80 characters** — constrain readable measure in wide columns.

---

### 3. Color & materials (R41–R48)

**R41. Label colors** — use semantic `Color.primary` / `.secondary` / `.tertiary` / `.quaternary`.

**R42. Fills**

| Token | Approx light | Use |
|---|---|---|
| systemBackground | `#FFFFFF` | Paper |
| secondarySystemBackground | `#F2F2F7` | Grouped canvas |
| tertiarySystemBackground | elevated | Nested |
| systemGray6 | `#F2F2F7` | Islands, chip selected, Photos Collections cards |
| systemGray5 | chip idle stroke fill | Unselected outlined chips |
| systemFill / secondaryFill | overlays | Scrims on glass |

**R43. Separators** — `separator` / `opaqueSeparator`; 0.5–1 pt; low contrast. Never pure black 1 pt.

**R44. Accent** — **one** brand accent (Music red, Notes yellow, Photos blue, Totem blue). Interactive glyphs & active tabs only. Body stays label color.

**R45. Liquid Glass / materials roles (iOS 26+ / prior materials)**

| Role | Material | Allowed on |
|---|---|---|
| Floating tab / mini-player / search FAB | ultraThin / thin / Liquid Glass | Chrome only |
| Sheets / menus / popovers | regular / thick as needed | Overlays |
| Tool palettes (Freeform, Notes markup) | thin + shadow | Document chrome |
| Content paper / message bubbles / list rows | **none** | Opaque fills |
| Full-screen scrims | ultraThin darken | Modals only |

**R46. Vibrancy** — labels on materials use vibrant styles so text stays legible over busy photos (Photos glass menus, Music hero glass buttons).

**R47. Destructive / success** — `systemRed` text/icons for delete/declined (Wallet declined, Notes delete); `systemGreen` for toggles on / success sparingly; Wallet “Done” check often blue circle, not green fill spam.

**R48. Dark mode** — invert paper/canvas; keep accent; glass still chrome-only. Photos Library dark grid still micro-gutter.

---

### 4. Corner radius taxonomy (R49–R55)

**R49. Every role has a radius — never one radius for all**

| Role | Radius (pt) | Shape |
|---|---|---|
| Capsule chrome (tab island, composer, filter pill, Get/Open, Search field capsule) | **height / 2** | True pill / stadium |
| Circular FAB / Done / back glass | **diameter / 2**; target ≥44 hit | Circle |
| Content islands / metadata cards (Linear) | **12–16** | Continuous |
| System inset-grouped containers (Notes) | **10–12** | Continuous |
| Wallet / Pass / Apple Card containers | **28–32** | Continuous (large) |
| Photos Collections / Memory cards | **20–28** | Continuous |
| App Store review / feature cards | **16–28** | Continuous |
| Nested inner card (inside larger card) | **outer − 8 to −12** | Nested radii rule |
| Media thumbnails / album art | **8–12** | Continuous |
| Photos Library grid tiles | **0** (flush) | Sharp |
| Sheets top corners | **28–40** | Continuous |
| Menus / context menus | **14–28** | Continuous |
| Merchant / app icons in lists | **8–12** (squircle) | App-icon-like |
| Selection handles | circle ~6–8 | Freeform/Notes |

**R50. Nested radii** — outer card larger than inner media/review bubble (App Store developer response inside review card; Shop nested review). Rule of thumb: **inner ≈ outer − 8…12 pt**.

**R51. Continuous corners** — prefer SwiftUI continuous corner style for cards ≥12 pt (matches Wallet/Photos softness).

**R52. Pass stack peek** — Wallet stacked passes: large continuous ~28–32; overlapping peek headers offset **~4–8 pt** vertically.

**R53. Chip radius** — always capsule (height/2), height **28–32**.

**R54. Reject** — 4 pt “Material Design” cards; 2 pt outlines; mixing 8 pt pills with 8 pt sheets.

**R55. Sheet grabber** — system grabber; do not invent thick custom handles.

---

### 5. Chrome patterns — phone (R56–R64)

**R56. Sanctioned phone chrome patterns (pick deliberately)**  
1. **Floating island tab** — multi-icon capsule + optional **detached circular search** (Linear, Music, Photos dual-segment).  
2. **Floating composer / comment** — Ask… / + Comment capsule (ChatGPT, Linear detail).  
3. **Inset grouped list** — gray canvas + white rounded groups (Notes, Settings, Wallet lists).  
4. **Document / markup chrome** — floating stadium tool palette + circular Done (Freeform, Notes markup, Mail drawing) — Preview-adjacent.  
5. **System tab bar** — only when matching system apps (App Store); still prefer island for custom admin.  
6. **Stacked pass / hero card** — Wallet.  
**Reject:** Full-bleed opaque custom UITabBar paint; Bootstrap tables; dotted admin backdrops.

**R57. Floating island geometry**  
- Bottom inset **16–32 pt** above home indicator.  
- Side inset **12–24 pt**.  
- Island height **52–66 pt**.  
- Active tab: **soft fill behind icon** (gray or tinted), not underline.  
- Optional **detached search circle** same height baseline, **8–12 pt** gap (Linear, Music, Photos).  
**Evidence:** Linear Inbox; Music Library `e7448a59-…`; Photos Library `e0fcd8e0-…` / `adcf5b0d-…`.

**R58. Photos dual-segment variant**  
Two destinations (Library | Collections) in one stadium pill; selected = tinted rounded rect inside; Search = separate circular FAB. Large title + **Select** capsule top-trailing.  
**Evidence:** Photos Library screens.

**R59. Top chrome prefers floating controls**  
Back / menu / compose as **circle or capsule** over content; group trailing actions in **one capsule** (Linear compose+more; ChatGPT menu; Notes undo+ellipsis + Done circle).

**R60. Mini-player / secondary dock**  
Stack **above** tab island with same inset language (Music). Do not merge into one fat bar. Height ~50–56; thumbnail ~32–36 with ~4–6 radius.

**R61. Large title + trailing capsule**  
Large Title left; trailing Select / filter / compose as capsule or circle cluster (Photos Select; Linear compose+more).

**R62. Toolbar (inline)**  
When using system `Toolbar`, prefer glass material; icon buttons ≥44 hit; group related actions.

**R63. Sheets** — see §11. Detents medium/large; top radius 28–40; grabber on.

**R64. Toasts / ephemeral**  
Floating capsule toast ~**12–16** below safe top or above dock; auto-dismiss; no hard shadow under every row. ChatGPT “Share Message” pill = pattern.

---

### 6. Chrome patterns — iPad / Mac-class (R65–R70)

**R65. NavigationSplitView is default for admin on regular width**  
Two or three columns. Collapse to stack on compact. See `IPAD_CRAFT.md` for full metrics.

**R66. Column width preferences (Apple docs examples + craft)**  

| Column | Preferred | Notes |
|---|---|---|
| Sidebar | **fixed ~150–320**; common craft **240–280** | Apple example fixed **150**; HIG adaptive |
| Content (middle) | **min 150, ideal 200, max 400** | Apple `navigationSplitViewColumnWidth` example |
| Detail | flexible remaining | Document canvas |
| Inspector | **ideal 225**; **min 150, max 400** | `inspectorColumnWidth` — Apple example **225** fixed |

**R67. Split styles** — `.balanced` (side-by-side landscape) vs `.prominentDetail` (detail-focused; sidebar overlay in portrait). Default admin: **balanced** for triage; **prominentDetail** for document editing (Notes/Freeform-class).

**R68. Document canvas chrome (Preview-adjacent)**  
Freeform / Notes markup / Mail drawing / PDF preview:  
- Floating stadium **tool palette** (pens, shapes, color).  
- Circular **Done** (tinted: Notes yellow, Freeform blue).  
- Contextual **selection pill** (duplicate, delete, opacity).  
- Color popover: **~6×2 swatch grid**, large radius ~20–24.  
- Optional page **thumbnail strip** + zoom cluster.  
- Dark chrome OK for PDF; light for Freeform/Notes.  
**Evidence:** Freeform `cedf8662-…`; Notes markup `d4a43dca-…`.

**R69. Multi-pane document shell**  
Icon rail (narrow) → list → canvas → optional inspector. Do not invent a fourth primary nav column. Inspector toggles; not a second sidebar.

**R70. iPad floating vs sidebar**  
On iPad, primary destinations live in **sidebar** (or sidebarAdaptable TabView), not a phone-style bottom island — except when deliberately mirroring Music/Photos compact adaptation. Phone island recipes collapse into sidebar rows.

---

### 7. List anatomy (R71–R76)

**R71. Leading accessories**  
- Avatar **36–44** circle; optional **14–16** badge at bottom-trailing (Linear).  
- Status glyph ~18–22 (Linear issue state).  
- Rounded-square merchant/app icon **40** @ 8–12 radius (Wallet).  
- SF Symbol in gray well for system rows.

**R72. Trailing accessories**  
Chevron `>` tertiary; amount + chevron (Wallet); avatar assignee; ellipsis for menus; toggle for settings. Max **one** primary trailing action + optional chevron.

**R73. Separator rules** — see R29. Linear feeds: **none**.

**R74. Section headers**  
- Large Title style screen headers.  
- Inline section: Title 2/3 or Headline, or caps Caption (R36).  
- Optional trailing `+` / chevron / Filter circle (Wallet transactions; Linear priority sections).

**R75. Empty states**  
Centered `secondary` body ~17; **chromeless**. Optional system `ContentUnavailableView`. **No** bordered dashed empty card.  
**Evidence:** Linear Favorites/My Issues empty.

**R76. Unread / selection affordances**  
Blue leading dot ~6–8 (Linear unread); Photos selection check bottom-trailing on tile; checkmarks in menus leading.

---

### 8. Detail / form anatomy (R77–R81)

**R77. Metadata island**  
Related properties (status, assignee, labels, project, due) in **one soft gray island**, padding 12–16, radius 12–16, wrapping **capsules** — not bordered key/value table.  
**Evidence:** Linear Issue `df737887-…`, `f03367b0-…`.

**R78. Pills / chips in detail** — height 28–32; selected fill; gap 8–12 wrap.

**R79. Field grouping**  
Inset grouped white cards on gray canvas (Notes/Wallet/Photos settings). Caps section headers. Footers as Caption secondary under card.

**R80. Metric widgets (Wallet Apple Card pattern)**  
2-column asymmetric grid, gutters **12–16**, card radius **20–28**, hero gradient card above **28–32**. Map admin dashboards (pipeline health, spend) to this — not HTML tables.

**R81. Forms**  
Label above or leading; text fields in grouped card; steppers/segments per §10. Destructive standalone red row card (“Remove Pass”).

---

### 9. Grid / media layouts (R82–R85)

**R82. Photos Library** — 3-col, edge-to-edge, gutter **1–2 pt**, square tiles, radius 0. Overlays: favorite heart, video badge, selection check.  
**Evidence:** Photos `e0fcd8e0-…`, measured seams.

**R83. Photos Collections** — larger cards radius **20–28**, section chevrons, empty-state cards on systemGray6.

**R84. Music grids / carousels** — album 1∶1 radius 8–12; carousel gutter 10–12; section Title 2 + trailing chevron; video cards ~16∶9 radius 10–12.

**R85. App Store / product media** — peeking horizontal screenshots; side margin 16–20; card radii 16–32; **label iPhone vs iPad screenshot carousels** when both exist; nested radii for review cards.

---

### 10. Controls (R86–R90)

**R86. Buttons**  
- Primary CTA: capsule, filled (App Store Get/Open blue; ChatGPT black send circle). Height **36–50**; hit ≥44.  
- Secondary: gray fill capsule or borderless tint.  
- Circular icon buttons: diameter 36–44 visual, hit 44.

**R87. Chips** — R18/R53. Selected = light fill + primary label; idle = no fill or hairline; Linear view-options idle may use stroke.

**R88. Segmented**  
- Prefer **text chips** or Photos-style dual pill over heavy UISegmentedControl for primary nav.  
- Compact segmented OK inside tool palettes (Freeform stroke styles).

**R89. Search fields**  
Floating capsule search (Notes, Wallet search chrome) or detached circular search FAB that pushes search UI. Height ~36–44; leading magnifying glass; trailing clear.

**R90. Steppers** — Freeform stroke weight ± ; system steppers in forms. Keep ≥44 hit on ±.

---

### 11. Sheets / popovers / menus (R91–R93)

**R91. Sheet detents** — `.medium`, `.large`, or custom; grabber visible; top radius **28–40**. Linear View Options = medium–large with grouped rows + chip cloud.  
**R92. Popovers / menus** — radius **14–28**; material blur; 44 pt rows; leading icons; destructive red; section hairlines. Freeform context menu ~24–28. Photos view-options glass menu.  
**R93. Color popovers** — ~6×2 swatch circles; “No Fill” row; arrow/nub toward source control (Notes markup).

---

### 12. Motion / feedback (R94–R95)

**R94. Springs** — system default sheet present/dismiss; tab selection soft highlight; avoid custom bounce on every row. Selection handles scale subtly (Freeform).  
**R95. Haptics / selection** — light impact on tab/chip select; success on Done; do not haptic every keystroke. Toasts: fade + slight slide.

---

### 13. Density modes (R96–R97)

**R96. Comfortable (default consumer)** — row 56–80; section gap 24–32; gutter 20. Photos chrome, ChatGPT, Music.  
**R97. Compact admin** — row 44–52; section gap 16–24; still ≥44 hit; chip clouds denser (8 pt). Linear lists + View Options. Never go below 44 row height.

---

### 14. Anti-patterns catalog (R98)

Fail the PR if any appear:

1. Gutter outside **16–24** (phone content) without reason / or **0** outside media grids.  
2. Interactive row **< 44 pt**.  
3. Title and body same size.  
4. Full-bleed opaque custom tab bar (use island or system TabView glass).  
5. Hairlines between Linear-style feed rows.  
6. Outline boxes instead of fill islands for grouping.  
7. One radius for pills, cards, and sheets.  
8. Empty state inside bordered/dashed card.  
9. Drop shadow under static list rows.  
10. Glass/material washed across content paper.  
11. Bootstrap / HTML table admin on iOS.  
12. Purple neon / rainbow gradients on chrome.  
13. Underline-only tab indicator as default.  
14. Photos-style **1 pt grid** used for non-media admin lists.  
15. Phone bottom island copied 1∶1 as only iPad nav (use sidebar).  
16. Key/value bordered forms instead of metadata islands / inset grouped.  
17. Nested card radius ≥ outer card radius.  
18. Send/FAB **< 44** hit.  
19. Destructive action as primary filled red button when system menu/alert suffices.  
20. Ignoring Dynamic Type / hard-coded 12 pt body.

---

### 15. Admin app mapping (Totem-like) → recipes (R99)

| Totem / admin surface | Recipe | Primary rules | Canon apps |
|---|---|---|---|
| Today / Home feed | List + Floating tab | R1, R3 comfortable, R15, R57 | Linear Inbox |
| Pipeline / Issues list | List (borderless) + chips | R15, R18, R97 | Linear Issues |
| Deal / Issue detail | Detail + metadata island + composer | R17/R77, R11.2, R59 | Linear Issue |
| Relationships / Accounts | List standard + inset optional | R3, R71 | Notes list / Linear |
| Releases | List + Detail | R77, R2 | Linear project |
| Filters / Views | Chips + sheet | R18, R91 | Linear View Options |
| Search | Detached FAB → search | R57, R89 | Linear/Music/Photos |
| Settings | Inset grouped | R11.3, R79 | Notes / ChatGPT Settings / Photos profile |
| Dashboard metrics | Wallet 2-col widgets | R80, R49 Wallet radii | Apple Card |
| Media library | Photos grid or Music grid | R82–R84 | Photos / Music |
| Comments / AI ask | Composer island | R11.2, R32 | ChatGPT / Linear |
| Document / markup / PDF | Preview-adjacent chrome | R68–R69 | Freeform / Notes markup |
| iPad shell | NavigationSplitView + inspector | R65–R70 | `IPAD_CRAFT.md` |
| Passes / cards stack | Wallet stack | R52, R49 | Apple Wallet |
| Store-like product | App Store product anatomy | R85–R86 | App Store |

**Token mapping (Totem Admin*):**  
`AdminSpace.gutter = 20` · `AdminSpace.section = 28` · `AdminRadius.island = .capsule` · `AdminRadius.card = 14` · `AdminRadius.walletCard = 30` · `AdminRadius.sheet = 32` · `AdminType.largeTitle = 34` · `AdminType.body = 17` · `AdminType.meta = 13` · `AdminDock.height = 58` · `AdminDock.bottomInset = 24`.

---

## C. Per-app pattern cards

### Linear Mobile — Island + borderless feed
Large title + trailing capsule; Inbox avatar+badge multi-line **no dividers**; detail metadata island; floating comment; tab capsule + search circle; sheets with chip clouds.

### ChatGPT — Composer-first
Floating top circles/capsules; bottom Ask capsule + voice/send; suggestion cards radius ~20–24; glass menus; black pill CTAs.

### Apple Notes — Inset grouped + markup
`#F2F2F7` + white 10–12 groups; 34/20/17 ladder; markup: PencilKit stadium, yellow Done circle, selection handles, color popovers.

### Apple Music — Glass dock + media
~20 gutters; inset separators; floating glass tab + mini-player + search; red accent; carousels radius ~8–12.

### Apple Photos — Dual pill + micro-grid
3-col **1–2 pt** gutters; Library|Collections stadium; search FAB; Select capsule; Collections cards 20–28; glass menus.

### Freeform — Document canvas
Dot grid; floating tool stadiums; Done circle; selection handles; context menus ~24–28; connector handles.

### Apple Wallet — Passes + finance detail
Stacked passes 28–32 continuous; Apple Card hero + 2-col metrics 12–16 gutters; inset transaction lists; declined = red + strikethrough; floating tool circles.

### App Store — Product system page
Stats row with **vertical hairline dividers** (ratings / age / chart); peeking screenshot carousels; pill Get/Open; section headers + chevrons; nested review radii; iPhone vs iPad screenshot labeling.

### Obsidian — Pro document
Sidebar toggle; floating stadium accessory / nav pill; H1/H2/body measure; purple accent sparingly.

---

## D. Agent checklist (fail the PR if any fire)

1. Gutter wrong for surface (R25).  
2. Row < 44.  
3. Title = body size.  
4. Opaque full-bleed custom tab bar.  
5. Hairlines on Linear-style feeds.  
6. Outline boxes vs fill islands.  
7. Single radius everywhere.  
8. Bordered empty state.  
9. Shadows on static rows.  
10. Glass on content paper.  
11. Phone island as sole iPad IA.  
12. Nested radius ≥ outer.  
13. Missing Dynamic Type.  
14. Admin HTML table.  
15. Photos micro-gutter on text lists.
16. **Emoji / non-SF Symbols used as tab, search, or chrome icons** (R102).
17. **Vertical floating dock** / stacked icon tower instead of horizontal stadium (R103).
18. Feed rows missing secondary context line or realistic avatar/thumb (R104, R107).
19. Sparse wireframe voids — section gaps ≫ 32 pt with empty content (R105).
20. Design/Figma/Paper shown to user without screenshot self-QA vs VISUAL_GATE (R101, R110).

---

## E. Canon Mobbin URLs

Authoritative list with archetypes: **`CORPUS.md`**. Primary set retained from prior pass plus Photos, Freeform, Notes markup, Wallet, App Store, Obsidian.

**Local assets:** `/home/box/agent-data/agents/91891636-abd4-4db6-b0d6-59158513f75b/assets/` · measure crops `/workspace/ios-ui-craft-research/measure/` · iPad companion **`IPAD_CRAFT.md`**.

---

## F. How to re-measure

1. Mobbin MCP `search_screens` (platform=`ios`).  
2. Confirm width ≈299 (scale=390/width) **or** record native width for iPad/web frames.  
3. Measure left content inset mid-rows; grid seams; dock inset/height.  
4. Classify chrome + hierarchy method.  
5. Append baselines table + `CORPUS.md` row.

---

## G. Scale cheat sheet

| Frame width (px) | Scale to 390 pt phone | Use |
|---|---|---|
| **299** (typical Mobbin phone) | **×1.304** | Default |
| **298** (some Wallet) | **×1.309** | Near-identical |
| **768** | do **not** ×1.304 — treat as iPad point-ish / report raw | Landscape-ish captures |
| **1280** | web / desktop Mobbin — report raw px; infer pt via UI chrome | Document multi-pane |

---

*End of CRAFT_SPEC encyclopedia. Rule count: R1–R23 foundation + R24–R99 expansion (**99** numbered rules).*


---

## H. Deep implementation recipes (SwiftUI-oriented)

### H1. Floating dock (phone)

```swift
// AdminFloatingDock — R57
HStack(spacing: 10) {
  HStack(spacing: 0) {
    ForEach(tabs) { tab in
      DockIcon(tab, selected: tab == selection)
        .frame(maxWidth: .infinity)
    }
  }
  .padding(.horizontal, 12)
  .frame(height: 58)
  .background(.ultraThinMaterial, in: Capsule())
  .shadow(color: .black.opacity(0.12), radius: 16, y: 8)

  Button(action: openSearch) {
    Image(systemName: "magnifyingglass")
      .frame(width: 58, height: 58)
      .background(.ultraThinMaterial, in: Circle())
      .shadow(color: .black.opacity(0.12), radius: 16, y: 8)
  }
  .accessibilityLabel("Search")
}
.padding(.horizontal, 16)
.padding(.bottom, 24) // R27 / R57
```

**Variants:** Photos dual-segment (2 tabs only, tinted selected fill); Music (mini-player stacked above with 8 pt gap).

### H2. Borderless feed row (Linear)

```swift
// R15, R71, R3 comfortable
HStack(alignment: .top, spacing: 12) {
  ZStack(alignment: .bottomTrailing) {
    Avatar(viewModel.avatar).frame(width: 40, height: 40)
    Badge(viewModel.badge).frame(width: 16, height: 16)
  }
  VStack(alignment: .leading, spacing: 2) {
    Text(viewModel.title).font(.headline) // 17 semibold
    Text(viewModel.preview)
      .font(.footnote) // 13
      .foregroundStyle(.secondary)
      .lineLimit(2)
  }
  Spacer(minLength: 8)
  Text(viewModel.relativeTime)
    .font(.caption)
    .foregroundStyle(.tertiary)
}
.padding(.horizontal, 20) // R1
.padding(.vertical, 12)   // → ~64–80 row
// NO Divider()
```

### H3. Metadata island (issue/deal detail)

```swift
// R17 / R77
FlowLayout(spacing: 8) {
  ForEach(properties) { prop in
    Label(prop.title, systemImage: prop.symbol)
      .font(.subheadline)
      .padding(.horizontal, 10)
      .padding(.vertical, 6)
      .background(Color(.secondarySystemFill), in: Capsule())
  }
}
.padding(14) // R4
.background(Color(.systemGray6), in: RoundedRectangle(cornerRadius: 14, style: .continuous))
.padding(.horizontal, 20)
```

### H4. Inset grouped settings (Notes/Wallet)

```swift
List {
  Section("IN-APP NOTIFICATIONS") { // R36 caps via textCase
    Toggle("Shared Album Activity", isOn: $on)
  }
  Section {
    Toggle("Auto-Play Motion", isOn: $a)
  } footer: {
    Text("Automatically adjust…").font(.footnote)
  }
}
.listStyle(.insetGrouped) // radius ~10–12; gutter 16
```

### H5. Photos micro-grid

```swift
// R82 — phone
let cols = [GridItem(.flexible(), spacing: 1.5),
            GridItem(.flexible(), spacing: 1.5),
            GridItem(.flexible(), spacing: 1.5)]
LazyVGrid(columns: cols, spacing: 1.5) {
  ForEach(assets) { asset in
    AssetThumb(asset).aspectRatio(1, contentMode: .fill)
  }
}
.padding(.horizontal, 0)
```

### H6. Wallet metric dashboard

```swift
// R80
VStack(spacing: 14) {
  HeroPassCard().clipShape(RoundedRectangle(cornerRadius: 30, style: .continuous))
  HStack(alignment: .top, spacing: 14) { // 12–16 gutters
    VStack(spacing: 14) {
      MetricCard(title: "Card Balance", value: balance, subtitle: available)
      MetricCard(title: "Yearly Activity", chart: chart)
    }
    MetricCardTall(title: "Nothing to Pay", action: markDone)
  }
}
.padding(.horizontal, 16)
```

### H7. Composer island (ChatGPT / Linear comment)

```swift
// R11.2, R32
HStack(spacing: 12) {
  Button(action: attach) { Image(systemName: "plus").frame(width: 40, height: 40) }
    .background(.regularMaterial, in: Circle())
  HStack {
    TextField("Ask…", text: $text)
    Image(systemName: "mic")
    Button(action: send) {
      Image(systemName: "arrow.up")
        .frame(width: 32, height: 32)
        .foregroundStyle(.white)
        .background(Color.primary, in: Circle())
    }
  }
  .padding(.horizontal, 12)
  .frame(minHeight: 52)
  .background(.regularMaterial, in: Capsule())
}
.padding(.horizontal, 16)
.padding(.bottom, 20)
```

### H8. Document markup chrome (Preview-adjacent)

```swift
// R68
ZStack(alignment: .bottom) {
  DocumentCanvas()
  VStack(spacing: 8) {
    if let selection {
      SelectionPill(selection) // opacity, duplicate, trash
        .background(.ultraThinMaterial, in: Capsule())
    }
    ToolPalette(tools: [.pen, .marker, .eraser, .lasso, .ruler])
      .padding(.horizontal, 16)
      .frame(height: 72)
      .background(.ultraThinMaterial, in: Capsule())
  }
  .padding(.bottom, 20)
}
.toolbar {
  ToolbarItem(placement: .cancellationAction) { BackCircle() }
  ToolbarItem(placement: .primaryAction) {
    Button(action: done) {
      Image(systemName: "checkmark")
        .frame(width: 36, height: 36)
        .foregroundStyle(.white)
        .background(accent, in: Circle()) // Notes yellow / Freeform blue
    }
  }
}
```

### H9. App Store-like stats row

```swift
// R85 vertical hairline dividers
HStack(spacing: 0) {
  StatCell(title: "\(rating)", subtitle: "Ratings")
  Divider().frame(height: 28)
  StatCell(title: age, subtitle: "Age")
  Divider().frame(height: 28)
  StatCell(title: chart, subtitle: "Chart")
}
.font(.footnote)
```

### H10. NavigationSplitView admin shell (iPad)

```swift
// R65–R67 — details in IPAD_CRAFT.md
NavigationSplitView(columnVisibility: $visibility) {
  Sidebar()
    .navigationSplitViewColumnWidth(min: 200, ideal: 260, max: 320)
} content: {
  MiddleList()
    .navigationSplitViewColumnWidth(min: 150, ideal: 200, max: 400)
} detail: {
  DetailOrCanvas()
    .inspector(isPresented: $showInspector) {
      Inspector()
        .inspectorColumnWidth(min: 150, ideal: 225, max: 400)
    }
}
.navigationSplitViewStyle(.balanced)
```

---

## I. Surface decision tree (agent)

1. **Is this compact phone width?** → Phone chrome §5.  
2. **Regular width iPad/Mac?** → Split + inspector (`IPAD_CRAFT.md`); do not ship phone island as sole IA.  
3. **Feed of entities?** → Borderless list (Linear) unless Settings-class → inset grouped.  
4. **Entity detail?** → Metadata island + body + floating composer if commentable.  
5. **Media library?** → Photos micro-grid OR Music comfortable grid — never 1 pt gutters on text.  
6. **Metrics dashboard?** → Wallet 2-col cards.  
7. **Document/PDF/markup?** → Preview-adjacent floating tools.  
8. **Filters?** → Chips first; sheet if > ~8 options.  
9. **Destructive?** → System menu/alert red text (R22).  
10. **Always** run §D checklist + cite R# in PR.

---

## J. Evidence appendix (measurement notes)

| Claim | Evidence |
|---|---|
| Phone scale ×1.304 | Mobbin 299 px → 390 pt |
| Linear gutter ~20–21 pt | Inbox left ≈15–16 px ×1.304; measure crop `linear_inbox_gutters.png` |
| Photos grid gutter 1–2 pt | Seams 1–2 px on Library webps (`adcf5b0d…`, `d230b172…`) |
| Photos dual pill + search FAB | `e0fcd8e0-69be-45fd-a186-446d0d5c0dfe` |
| Music mini-player stack | `e7448a59-…`, Listen Now carousels `7ccff33b-…` |
| Freeform floating tools | `cedf8662-2591-40fe-8340-f362b8499f14` |
| Notes markup Done yellow | `d4a43dca-7d3f-4cc0-88c7-0351549c6033` |
| Wallet card radius 28–32 | `fe3800b2-…`, Apple Card `e5c938d7-…` |
| Wallet metric gutters 12–16 | Apple Card detail |
| App Store stats + Get pill | `8e60f133-1740-449c-bc58-690bb715955f` |
| Split column example 150 / 150–400 | Apple `navigationSplitViewColumnWidth` docs |
| Inspector ideal 225 | Apple `inspectorColumnWidth` docs |
| SF Large Title 34 / Body 17 / leading | Apple HIG Typography |

---

## K. Totem Admin primitive checklist

When implementing Totem-like admin, assert tokens exist:

- [ ] `AdminSpace.gutterPhone = 20`
- [ ] `AdminSpace.gutterGrouped = 16`
- [ ] `AdminSpace.sectionGap = 28`
- [ ] `AdminSpace.gridMicro = 1.5` (media only)
- [ ] `AdminRadius.capsule` / `.card14` / `.card30` / `.sheet32` / `.media10`
- [ ] `AdminType` maps to SF text styles (not raw free-floating sizes only)
- [ ] `AdminFloatingDock` inset ≥16, height 52–66, detached search optional
- [ ] `AdminMetadataIsland` FlowLayout pills
- [ ] `AdminInsetGrouped` for settings
- [ ] iPad: `AdminSplitShell` + `AdminInspector`
- [ ] Unit tests: row min height 44; dock not full-bleed; radii roles distinct

---

## L. Chromeless vs chrome-heavy matrix

| Content type | Chrome weight | Notes |
|---|---|---|
| Notification feed | Light floating dock | Linear |
| Chat / AI | Composer-dominant | ChatGPT |
| Settings | Inset grouped, minimal float | Notes |
| Photo grid | Minimal header + dual pill | Photos |
| Music browse | Medium — mini-player + dock | Music |
| Canvas / markup | Tool palette heavy | Freeform |
| Finance detail | Card stack + widgets | Wallet |
| App product | System page + tab bar | App Store |
| iPad admin | Sidebar heavy, detail airy | Split |

---

## M. Accessibility craft (measurable)

- Hit targets ≥44×44 (R21).  
- Contrast: secondary gray on white must pass AA for non-incidental text; if not, darken.  
- VoiceOver: dock icons have labels; chips announce selected; grids announce index.  
- Reduce Motion: disable decorative parallax on hero cards; keep functional sheet animation shortened.  
- Dynamic Type AX sizes: prefer stacking trailing meta under title rather than clipping.

---

## N. Versioning

| Doc | Role |
|---|---|
| `CRAFT_SPEC.md` | Canonical numbered rules |
| `IPAD_CRAFT.md` | Sidebar / split / inspector |
| `CORPUS.md` | Every Mobbin URL + archetype |
| `STRATEGY.md` | Pack replacement plan |

Cadence: refresh CORPUS when iOS major chrome shifts; bump rule IDs only append-only (never renumber R1–R99; R100+ append-only thereafter).

### 2026-09-11 verification failure (Figma)

Totem craft Figma pass (`/workspace/totem-craft-figma/01-today.png`, `02-pipeline.png`, `03-deal-detail.png`) was **rejected** as horrible vs shipping Totem (`ap300-integrate/*`) and Linear refs (`ap300-linear-refs/*`). Root causes now encoded as **R100–R110**:
1. Emoji / non-SF chrome icons in dock
2. Floating dock smashed into a **vertical** icon stack (must be horizontal stadium + search circle)
3. Sparse wireframe density — title-only rows, huge voids, missing secondary lines
4. Flat solid-hue circles/rects as avatars (no gradient/photo/artwork)
5. Broken/fake status-bar chrome
6. Designs shown to user **without** screenshot self-QA
7. Pack was HIG platitudes without measured CRAFT_SPEC load + fail checklist

**Remediation:** Load `VISUAL_GATE.md` + this §R before any invent/review/design; refuse vertical docks / emoji chrome / title-only rows; caption artboards with R#; Mobbin CORPUS pull mandatory before inventing chrome.


---

## O. Deep measured pattern cards (expanded corpus)

### O1. Apple Photos Library (phone, 299×678 ×1.304)

**Chrome:** Dual-segment stadium pill (Library | Collections); selected = tinted rounded rect inside pill; **detached circular search FAB** same baseline; gap ~8–12 pt. Bottom inset ~16–24 pt.  
**Header:** Large Title “Library” (~34 bold); subtitle count/sync Caption secondary; trailing **Select** capsule + optional filter circle.  
**Grid:** 3 columns, **edge-to-edge**, tile ≈99 px → **~129 pt**, seam gutters **1–2 px → 1.3–2.6 pt**. Radius **0**. Overlays: heart favorite, play badge, selection check bottom-trailing.  
**Menus:** Glass view-options / sort menus radius ~14–24; 44 pt rows; leading checks for toggles.  
**Selection mode:** Top glass capsule (filter + ellipsis) + circular close; bottom selection dock (share | count | trash).  
**Rules:** R58, R82, R57, R49.  
**Canon:** https://mobbin.com/screens/e0fcd8e0-69be-45fd-a186-446d0d5c0dfe

### O2. Apple Photos Collections / Albums

**Cards:** Media or systemGray6 tiles radius **20–28**; section headers with trailing chevrons; Personal/Shared/Activity segmented capsule under nav. Same dual tab + search FAB. Empty-state cards chromeless or soft gray — not dashed.  
**Rules:** R83, R19.

### O3. Freeform / Notes markup / Mail drawing (Preview-adjacent)

**Shared grammar:**  
1. Floating **stadium tool palette** (pens / shapes / paperclip).  
2. Circular **Done** (blue Freeform / yellow Notes).  
3. Top **capsule** undo+share+more; circular back.  
4. Selection = bounding box + circular handles (~6–8 pt).  
5. Contextual pill (opacity, duplicate, trash red).  
6. Color popover **6×2** swatches + No Fill; radius ~20–24.  
7. Dot grid canvas (Freeform); white paper (Notes).  
**iPad:** Promote palette to edge-docked or larger floating; add inspector for object properties (`IPAD_CRAFT` IP-R8–R11).  
**Canon:** Freeform https://mobbin.com/screens/cedf8662-2591-40fe-8340-f362b8499f14 · Notes https://mobbin.com/screens/d4a43dca-7d3f-4cc0-88c7-0351549c6033

### O4. Apple Music Listen Now / Library

**Carousels:** Side inset **16–20**; inter-card **10–12**; art radius **8–12**; section Title 2 + chevron.  
**Mini-player:** Capsule ~50–56 h, thumb ~32 @ ~4–6 r, play trailing; stacks **above** tab island.  
**Dock:** Glass multi-tab island + search circle; active = soft circular fill (red tint OK for glyph).  
**Lists:** Category rows ~44 with **inset** separators; accent red labels sparingly.  
**Canon:** Library https://mobbin.com/screens/e7448a59-c90f-4dce-992b-6bab55501c18 · Listen Now https://mobbin.com/screens/7ccff33b-4781-4c1e-b59c-1203a375fa53

### O5. Apple Wallet stack & Apple Card

**Pass stack:** Continuous corner **28–32**; overlapping peek headers (~4–8 pt reveal); side margin **16–20**.  
**Apple Card detail:** Hero gradient card ~28–32 r; **2-col metric widgets** gutters **12–16**; tall spanning card OK; inset-grouped transactions in **one** white card ~28–32 r; 3-line text stack (merchant / status / time); inset separators under thumbnails; declined = **systemRed** + strikethrough amount.  
**Merchant / transaction:** Map card same large radius; category picker; action sheet ~32 r.  
**Search chrome:** Floating search pill + filter chip + circular dismiss (tool cluster).  
**Genius/pass detail:** Inset grouped toggles; destructive “Remove Pass” standalone red row.  
**Canon:** Apple Card https://mobbin.com/screens/e5c938d7-50d2-44b5-925f-5450cadc2713 · Expired list https://mobbin.com/screens/f17b94c3-5c94-435a-9672-e7dbdca3109f · Pass https://mobbin.com/screens/fe3800b2-59af-4229-9412-115dcb51c881

### O6. App Store product page

**Stats row:** Ratings / age / chart (or similar) separated by **vertical hairline dividers** — not cards.  
**CTA:** Pill **Get** / **Open** (blue fill, white label); may include “In-App Purchases” micro sublabel.  
**Carousels:** Peeking screenshots; side margin ~20; card radii **16–32**; **nested radii** (review outer > developer-response inner).  
**Sections:** Title 2/3 headers + trailing chevrons.  
**Device labeling:** Separate **iPhone** vs **iPad** screenshot carousels when both exist — do not mash.  
**Canon:** https://mobbin.com/screens/8e60f133-1740-449c-bc58-690bb715955f

### O7. Linear admin (reference density)

**Inbox:** Gutter ~20–21 pt (15–16 px×1.304); comfortable rows 64–80; **no hairlines**; dock island + search; trailing compose+more capsule.  
**Detail:** Metadata island 12–16 r; floating comment.  
**View options sheet:** Grabber; grouped pickers; chip cloud selected=fill idle=stroke; nested popover for line count.  
**Canon:** Inbox https://mobbin.com/screens/f97b18e7-5e86-42f2-85df-9e7a000fae0e

### O8. ChatGPT composer

Floating top menu circle + trailing capsule; bottom Ask capsule inset 16–20; + FAB; black circular send/voice; suggestion cards ~20–24 r; toast share pill.  
**Canon:** https://mobbin.com/screens/fcc6d071-3fdf-46a3-9af5-2ee465d1e471

### O9. Obsidian document

Sidebar toggle; H1 ~30–34; floating stadium nav / keyboard accessory; accent purple only on checks/cursor — still “one accent” discipline.

---

## P. Totem end-to-end build order (no guessing)

1. Shell: phone `AdminFloatingDock` **or** iPad `AdminSplitShell` (width class).  
2. Tokens from §15 / §K.  
3. Today = Linear list recipe.  
4. Pipeline = list + detail + metadata island + composer.  
5. Filters = chips + sheet.  
6. Settings = inset grouped.  
7. Dashboard = Wallet metric grid.  
8. Attachments preview = document-markup chrome.  
9. Media = Photos/Music grid rules as appropriate.  
10. Run §D + IPAD §12; attach CORPUS URLs + R# citations.

---

## Q. Rule index cheat sheet

| Block | IDs |
|---|---|
| Foundation | R1–R23 |
| Spacing | R24–R32 |
| Typography | R33–R40 |
| Color/materials | R41–R48 |
| Radii | R49–R55 |
| Phone chrome | R56–R64 |
| iPad chrome | R65–R70 (+ IP-R1–18) |
| Lists | R71–R76 |
| Detail/forms | R77–R81 |
| Grids/media | R82–R85 |
| Controls | R86–R90 |
| Sheets/menus | R91–R93 |
| Motion | R94–R95 |
| Density | R96–R97 |
| Anti-patterns | R98 (20 bullets) |
| Admin mapping | R99 |
| Visual / design-output gate | **R100–R110** (see §R; `VISUAL_GATE.md`) |


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

See `VISUAL_GATE.md` R111. Prefer `Font` text styles (R33); forbid Inter/custom for admin chrome/lists/detail. Figma must use SF Pro family. Cite R111 in PRs that touch typography.

### R112. Liquid Glass on nav chrome + segment switchers (always)

**Nav / toolbar header buttons:** On iOS 26+, **every** navigation-bar and toolbar control (back accessory, `+`, filter/`≡`, overflow `…`, circular menu, trailing capsules) uses **system Liquid Glass** — `.buttonStyle(.glass)` / `.glassProminent` or `.glassEffect` on the control — never opaque gray fills, hard blue squares, or solid white pills as the default chrome. Gate with `#available(iOS 26, *)` and fall back to `.ultraThinMaterial` / plain toolbar items on older OS.

**Segment / text switchers (e.g. Deals | People):** Use a **small Liquid Glass** segmented control or glass capsule with an inner selected pill — same material family as system chrome, not `systemGray6` opaque track + solid white selected alone when glass is available. Selected state = glass prominence / filled inner segment; idle = transparent glass. One accent (R44) tints the **glyph or label**, not a opaque blue chrome block.

**Still chrome-only (R45):** Never wash Liquid Glass across list rows, metadata islands, or content paper.

**Evidence:** Tyler 2026-09-12 (Totem craft): glass on all nav-header buttons always; small glass variants for Deals/People. Kavsoft iOS 26 CustomGlassTabBar / native TabView search-role patterns for dock; apply same material language to header + segments.

