# iPad / Mac-class Craft Spec

**Companion to** `CRAFT_SPEC.md` (phone rules R1–R99).  
**Purpose:** Enforceable sidebar / split / inspector / document-canvas rules for regular-width layouts.  
**Evidence reality:** Mobbin iOS corpus is **mostly phone (≈299 px)**. True Finder/Preview/landscape iPad frames are sparse. Where Mobbin lacks landscape iPad captures, metrics are **HIG + SwiftUI API docs + document-chrome inferred** from Freeform / Notes markup / Obsidian phone patterns extrapolated to regular width. Marked **(HIG)** vs **(Mobbin phone→infer)** vs **(measured phone)**.

**Scale note:** Do **not** apply ×1.304 to 768 / 1280 frames. Report native widths. Phone evidence still informs radii, materials, tool palette anatomy.

---

## 1. When to leave phone chrome behind

| Size class | Primary navigation | Detail |
|---|---|---|
| Compact (iPhone, iPad Slide Over) | Floating island / stack push | Full-width push |
| Regular (iPad landscape, Mac) | **NavigationSplitView sidebar** | Persistent detail / canvas |
| Regular narrow (iPad portrait) | Sidebar overlay or `.prominentDetail` | Detail dominant |

**Anti-pattern:** Shipping only a phone floating tab island on iPad while wasting horizontal space (CRAFT_SPEC R98.15).

---

## 2. NavigationSplitView structure

### 2.1 Two-column vs three-column

- **Two-column:** Sidebar (destinations or list) + Detail. Use for Settings-like, simple master-detail.  
- **Three-column:** Sidebar (app sections) + Content (list) + Detail (entity/canvas). **Default for Totem admin** (Inbox | Issue list | Issue detail).

### 2.2 Column width rules (HIG / Apple docs)

Apple documents preferred widths as *suggestions* the system may override.

| Column | API | Craft preferred range | Apple doc example |
|---|---|---|---|
| Sidebar | `navigationSplitViewColumnWidth` | **ideal 240–280**; min **200**; max **320** | Fixed **150** in snippet (minimum-class) |
| Content (middle) | `navigationSplitViewColumnWidth(min:ideal:max:)` | **min 150, ideal 200–280, max 400** | **min 150, ideal 200, max 400** |
| Detail | flexible | Remaining width; readable measure for text ~60–80 ch | — |
| Inspector (trailing) | `inspectorColumnWidth` | **ideal 225**; min **150**; max **400** | Fixed **225**; flexible 150/225/400 |

**(HIG/docs)** Sources: `navigationSplitViewColumnWidth(_:)`, `navigationSplitViewColumnWidth(min:ideal:max:)`, `inspectorColumnWidth(_:)`, `inspectorColumnWidth(min:ideal:max:)`.

### 2.3 Craft rule IP-R1 — Sidebar width band
Implement sidebar with `min: 200, ideal: 260, max: 320` for admin apps unless icon-rail mode (see §5). Do not lock to 150 unless icon-only rail.

### 2.4 Craft rule IP-R2 — Content list width
Middle list: `min: 150, ideal: 220, max: 400` so entity titles + meta breathe without starving the detail canvas.

### 2.5 Craft rule IP-R3 — Inspector
Use `.inspector` for **supplementary** metadata/filters — not primary navigation. Ideal **225**. Collapse allowed; on iPhone inspector becomes sheet automatically.

---

## 3. Split styles

| Style | Behavior | Use |
|---|---|---|
| `.balanced` | Side-by-side in landscape; more even columns | Triage admin (Linear-like inbox) |
| `.prominentDetail` | Detail emphasized; sidebar may overlay in portrait | Document editing, Freeform-like canvas |
| `.automatic` | System chooses (often balanced landscape / prominent portrait) | Default OK |

**IP-R4:** Totem Pipeline / Inbox → `.balanced`. Totem document / notes / markup → `.prominentDetail`.

---

## 4. Sidebar anatomy

**IP-R5. Sidebar list metrics**  
- Row height: **compact 44** / standard **52**.  
- Internal horizontal padding: **12–16** (tighter than phone 20).  
- Section headers: Caption/Subhead secondary; optional uppercase.  
- Selected row: **fill** rounded rect inset **4–8** from sidebar edges (Linear phone menu card selection language scaled).  
- Icons: SF Symbol leading **20–22** pt; accent sparingly on selected only.

**IP-R6. Sidebar materials**  
Sidebar may use distinct background (`sidebar` / secondary background). Do not put Liquid Glass across the entire sidebar content list — glass on toolbar/chrome only (R23/R45).

**IP-R7. sidebarAdaptable TabView**  
When using iPadOS tab+sidebar convertible pattern, primary tabs = main destinations; `sidebarOnly` for secondary. Prefer this for consumer apps; admin with deep hierarchy prefers explicit `NavigationSplitView`.

---

## 5. Document / Preview-adjacent multi-pane

**(Mobbin phone→infer + HIG)** Freeform, Notes markup, Obsidian, PDF preview.

### 5.1 Pane grammar (IP-R8)

```
[ Icon rail 48–64 ] [ List 200–280 ] [ Canvas flexible ] [ Inspector 150–225 ]
```

- **Icon rail:** narrow vertical tool/destination glyphs (Preview-like). Optional.  
- **List:** files, pages, outlines.  
- **Canvas:** document / board / PDF.  
- **Inspector:** properties, filters, comments — toggleable.

Never four *equal* columns. Rail is icon-width only.

### 5.2 Floating markup toolbars (IP-R9)

From Freeform / Notes markup **(measured phone)**:

- Stadium **tool palette** floating over canvas; material ultraThin/thin; height ~56–90 (PencilKit taller).  
- Circular **Done** tinted check (Notes yellow / Freeform blue).  
- Contextual **selection pill** (duplicate, delete, opacity, color).  
- Color popover **~6×2** swatches, radius ~20–24.  
- On iPad: palette may dock to edge or float near selection; keep **≥16** from screen edges; avoid covering home indicator / window controls.

### 5.3 PDF / dark chrome (IP-R10)

- PDF preview often uses **dark chrome** (toolbars) over dark/sepia page — OK.  
- Freeform/Notes stay **light** paper + light glass.  
- Do not mix dark chrome with light inset-grouped admin lists in the same column without a clear mode switch.

### 5.4 Page thumbnail strip + zoom (IP-R11)

- Horizontal or vertical thumbnail strip: thumb radius **4–8**; selected = accent stroke.  
- Zoom cluster: `−` / `%` / `+` in capsule; or pinch-only with HUD.  
- Place strip opposite inspector or along bottom of canvas column.

---

## 6. Toolbars on iPad

**IP-R12.** Prefer system `Toolbar` + large window title. Group actions into capsules. Leading sidebar toggle is system-provided — do not invent duplicate hamburger unless custom.

**IP-R13.** Inspector toggle belongs in trailing toolbar. Filters that affect the list belong in content column toolbar, not buried only in inspector.

---

## 7. Lists & detail in columns

**IP-R14.** Middle list may use **borderless Linear-style** rows (R15) even on iPad — separators optional.  
**IP-R15.** Detail column: metadata island (R77) at top; body scrolls; comments as split bottom or inspector thread.  
**IP-R16.** Empty detail: `ContentUnavailableView` — blank pane reads as broken on Mac/iPad (HIG guidance).

---

## 8. Sheets & popovers on regular width

**IP-R17.** Prefer **popover** from toolbar item for short menus; **sheet** for large forms; **inspector** for persistent properties.  
**IP-R18.** Sheet detents less critical on iPad — often centered card or full column. Radii still **20–32**.

---

## 9. Totem admin iPad recipes

| Surface | Columns | Style | Inspector? |
|---|---|---|---|
| Today / Inbox | Sidebar destinations + list + detail | balanced | Optional filters |
| Pipeline | Sidebar + deals list + deal detail | balanced | Deal properties |
| Relationships | Sidebar + people list + profile | balanced | Activity |
| Releases | Sidebar + releases + release detail | balanced | Checklist |
| Settings | Sidebar settings graph + detail form | automatic | No |
| Document / attachments markup | Rail + files + canvas | prominentDetail | Properties |
| Metrics dashboard | Sidebar + full-width detail dashboard | prominentDetail | Date range |

---

## 10. Mapping phone rules → iPad

| Phone rule | iPad adaptation |
|---|---|
| R57 floating island | Becomes sidebar selection + optional compact tab when collapsed |
| R11.2 composer | Bottom of detail column or keyboard-attached bar spanning detail |
| R82 Photos micro-grid | Increase columns with width (4–6); keep 1–2 pt only for photo tiles |
| R68 markup chrome | Same tool language; more horizontal room for palette |
| R1 gutter 20 | Detail: 20–28; sidebar: 12–16 |

---

## 11. Anti-patterns (iPad-specific)

1. Phone floating tab as the **only** nav on regular width.  
2. Sidebar wider than **320** without user resize affordance.  
3. Inspector used as primary IA (should be NavigationSplitView).  
4. Empty detail with no `ContentUnavailableView`.  
5. Glass material over entire canvas.  
6. Ignoring `columnVisibility` / compact collapse testing.  
7. Hard-coded frame widths that break Stage Manager / multitasking.  
8. Copying Photos 1 pt gutters into sidebar lists.

---

## 12. Verification checklist

- [ ] `NavigationSplitView` on regular; stack on compact.  
- [ ] Sidebar ideal width in 200–320.  
- [ ] Content ideal ~200–280 when 3-column.  
- [ ] Inspector ideal ~225 when used.  
- [ ] Style chosen deliberately (balanced vs prominentDetail).  
- [ ] Document mode uses floating tools / Done circle language.  
- [ ] Mobbin phone evidence cited for radii/materials; HIG cited for column widths.  
- [ ] Stage Manager: columns still usable at ~320 pt window slices.

---

## 13. Canon references

**HIG / Docs**  
- https://developer.apple.com/documentation/swiftui/view/navigationsplitviewcolumnwidth(_:)  
- https://developer.apple.com/documentation/swiftui/view/navigationsplitviewcolumnwidth(min:ideal:max:)  
- https://developer.apple.com/documentation/swiftui/view/inspectorcolumnwidth(_:)  
- https://developer.apple.com/documentation/swiftui/view/inspectorcolumnwidth(min:ideal:max:)  
- https://developer.apple.com/design/human-interface-guidelines/sidebars  

**Mobbin (phone document chrome → infer)**  
- Freeform canvas: https://mobbin.com/screens/cedf8662-2591-40fe-8340-f362b8499f14  
- Notes markup: https://mobbin.com/screens/d4a43dca-7d3f-4cc0-88c7-0351549c6033  
- Obsidian: https://mobbin.com/screens/feb7584c-e395-47a0-a4f2-f8fcbc47036c  

**Wide assets on disk:** agent `assets/` includes **768×521** and **1280×656/800** frames — measure those with native px; do not ×1.304. Prefer them when labeling multi-pane web/document chrome.

---

*IPAD_CRAFT rules: IP-R1…IP-R18 (+ sections 9–12 checklists).*
