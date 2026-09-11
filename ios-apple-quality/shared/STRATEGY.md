# Strategy: Measured craft encyclopedia → replace `ios-apple-quality`

**Date:** 2026-09-11 (expanded)  
**Problem:** Prior skill (`ios-apple-quality`) was HIG + Liquid Glass + “look at Mobbin” — agents still invent Bootstrap spacing, hairline spam, opaque bars because **taste was not measured**.  
**Replacement thesis:** Ship a **measured craft encyclopedia** agents can fail-check (phone + iPad), a **Mobbin verification loop**, and **admin-app recipes** mapped to Totem Admin primitives — deep enough that an agent can implement an entire admin UI **without guessing**.

---

## 1. Ambition (expanded)

| Prior research pass | This encyclopedia pass |
|---|---|
| ~10% coverage (user estimate) | Aim **full surface coverage** for admin UI |
| R1–R23 only | **R1–R99** + **IP-R1–IP-R18** |
| Phone Linear/ChatGPT/Notes/Music | + Photos, Freeform, Notes markup, Wallet, App Store, Obsidian |
| No iPad doc | **`IPAD_CRAFT.md`** (HIG split/inspector + inferred document chrome) |
| STRATEGY as thin plan | STRATEGY = pack architecture + recipes + migration + success metrics |
| URLs inlined loosely | **`CORPUS.md`** every Mobbin URL + app + archetype |

**Depth target:** CRAFT_SPEC **3–5×** prior (~14 KB / 265 lines → ~40 KB+ / 800+ lines with recipes). Feel: agent can build Totem admin end-to-end citing R#.

---

## 2. What stays vs what goes

| Keep from old skill | Replace / demote |
|---|---|
| Liquid Glass gating (`#available`, chrome-only) | Vague “calibrate against Mobbin” without numbers |
| A11y floor (44 pt, Dynamic Type, VoiceOver) | Purple-neon anti-pattern list as main taste signal |
| Tool table (Mobbin, Coot, Revyl, Xcode) | Monolithic SKILL mixing law + taste |
| Path scoping / AGENTS.md contract | Unmeasured “premium feel” language |

---

## 3. New pack shape

```
ios-craft-pack/
  skills/
    ios-craft/SKILL.md           # thin router → load CRAFT_SPEC + IPAD_CRAFT + recipe
  shared/
    CRAFT_SPEC.md                # encyclopedia R1–R99
    IPAD_CRAFT.md                # sidebar / split / inspector
    CORPUS.md                    # Mobbin URL catalog
    STRATEGY.md                  # this file
    RECIPES/                     # list, detail, filters, composer, floating-tab,
                                 # photos-grid, wallet-dashboard, document-markup, ipad-split
    METHODOLOGY.md               # measure → implement → Mobbin diff
  scripts/
    measure_screen.py            # 299→390pt helpers; wide-frame passthrough
    verify_mobbin.sh             # re-fetch canon URLs
```

Research workspace (source of truth until promoted):  
`/workspace/ios-ui-craft-research/{CRAFT_SPEC,IPAD_CRAFT,STRATEGY,CORPUS}.md`

---

## 4. Three pillars (upgraded)

### Pillar A — Measured craft encyclopedia
- Agents **must cite R# / IP-R#** in PR notes.  
- Tokens: `AdminSpace.*`, `AdminRadius.*`, `AdminType.*`, `AdminFloatingDock`, `AdminMetadataIsland`, `AdminSplitShell`.  
- Separate **phone** vs **iPad** decision tree (CRAFT_SPEC §I).

### Pillar B — Mobbin verification loop
1. Classify recipe (see §5).  
2. Pull 2–3 CORPUS screens in-category.  
3. Measure (scale ×1.304 if ~299 px wide; else note native).  
4. Implement system-first → Admin* map.  
5. Diff CRAFT_SPEC §D + IPAD §12.  
6. Proof via simulator / Coot / Revyl when available.

Cadence: quarterly CORPUS refresh or on iOS major chrome shifts (Photos dual pill, Music island, Liquid Glass).

### Pillar C — Admin recipes (build next)
Each recipe: layout skeleton, tokens, SwiftUI sketch, CORPUS links, anti-patterns.

---

## 5. Recipe catalog (expanded)

| Recipe file | When | Canon |
|---|---|---|
| `list.md` | Inbox, Pipeline, Relationships | Linear Inbox/Issues; Notes list |
| `detail.md` | Issue/Deal/Release | Linear issue; Wallet transaction |
| `filters.md` | Chips, view options | Linear View Options; ChatGPT pills |
| `composer.md` | Comment, Ask | ChatGPT; Linear comment |
| `floating-tab.md` | Phone primary dock | Linear; Music; Photos dual |
| `inset-grouped.md` | Settings | Notes; Photos profile; Wallet |
| `photos-grid.md` | Media libraries | Photos Library/Collections |
| `music-browse.md` | Carousels + mini-player | Music Listen Now / Library |
| `wallet-dashboard.md` | Metrics + hero card | Apple Card detail |
| `document-markup.md` | Canvas / PDF / markup | Freeform; Notes markup |
| `store-product.md` | Product/marketing page | App Store |
| `ipad-split.md` | Regular-width shell | IPAD_CRAFT + HIG |

---

## 6. Build steps (ordered)

1. **Promote corpus** — copy CRAFT_SPEC, IPAD_CRAFT, CORPUS into `ios-craft-pack/shared/`.  
2. **Write recipe markdowns** (§5) with Admin* SwiftUI sketches (see CRAFT_SPEC §H).  
3. **Thin skill router** — `skills/ios-craft/SKILL.md`: always load CRAFT_SPEC; if regular width load IPAD_CRAFT; pick recipe; Mobbin pull; §D checklist. Deprecate `ios-apple-quality` stub.  
4. **Measurement script** — `measure_screen.py`: gutter, dock inset/height, grid seam detection, frame-width branch.  
5. **Harness assertions** — token constants ↔ R1/R5/R8/R49/R57; dock not full-bleed; row ≥44; iPad sidebar width band.  
6. **AP-300 / Totem migration map** — Today→list+dock; Pipeline→list+detail; Settings→inset; iPad→split; dashboards→wallet-dashboard; attachments→document-markup.  
7. **Dry-run** — one Pipeline list + one iPad split screenshot through checklist.  
8. **Publish** — pack tarball; AGENTS.md path; Mobbin MCP required.

---

## 7. Success metrics

- Agents cite **R# / IP-R#** on UI PRs.  
- New screens pass §D without “make it more Linear” loops.  
- Shared tokens: gutter 20, capsule chrome, card 12–16, wallet card ~30, sheet ~32.  
- Mobbin pull mandatory in skill workflow.  
- iPad builds use NavigationSplitView — not phone island alone.  
- CORPUS covers all apps in encyclopedia.  
- Old skill stub redirects within one release.  
- User-facing bar: “agent implements admin UI without guessing.”

---

## 8. Measurement methodology (summary)

| Frame | Action |
|---|---|
| ≈299×678 | `pt = px × 390/299` (×1.304) |
| ≈298×678 | ×1.309 (Wallet) |
| 768 / 1280 | Report raw; classify as iPad/web; **no** phone scale |
| Evidence | Prefer center of ±2–4 pt uncertainty range |

Assets: `/home/box/agent-data/agents/91891636-abd4-4db6-b0d6-59158513f75b/assets/`  
Crops: `/workspace/ios-ui-craft-research/measure/`

---

## 9. Artifacts

| Path | Purpose |
|---|---|
| `CRAFT_SPEC.md` | Encyclopedia R1–R99 + recipes §H |
| `IPAD_CRAFT.md` | Sidebar/split/inspector IP-R1–18 |
| `CORPUS.md` | Mobbin URL × app × archetype |
| `STRATEGY.md` | This plan |
| `measure/` | Annotated crops |

---

## 10. Risk & honesty

- **iPad landscape Mobbin scarcity:** documented in IPAD_CRAFT; column widths from Apple docs; document chrome inferred from phone Freeform/Notes. Do not pretend measured iPad gutters where none exist.  
- **Liquid Glass evolves:** keep materials chrome-only; refresh CORPUS on iOS major.  
- **Totem brand accent:** one accent rule (R20/R44) — map to Totem blue, do not rainbow.
