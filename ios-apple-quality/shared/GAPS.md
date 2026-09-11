# Craft encyclopedia — gap analysis (self-audit against own rules)

**Date:** 2026-09-11  
**Method:** Score corpus + CRAFT_SPEC + STRATEGY success metrics + Totem AP-300 surfaces. Fail anything our own §D / STRATEGY §7 / R99 would reject if an agent shipped it.

## Verdict

Encyclopedia is **strong on phone chrome & spacing**, **weak on sheets/motion/iPad measurement**, and **not yet an implementable pack** (recipes + skill router still missing). Enough logic to design Totem phone screens; **not** enough to claim Finder/Preview/Mail/Messages/Reminders coverage.

---

## P0 — Would fail our own success metrics (STRATEGY §7)

| Gap | Own rule / metric | Impact on Totem |
|---|---|---|
| No `RECIPES/*.md` pack files | STRATEGY pillar C; R99 maps to recipes that don't exist as files | Agents still guess layouts |
| `ios-apple-quality` still ~64-line stub; no thin `ios-craft` router | STRATEGY §6.3; "agents cite R#" | Harness auto-apply still thin taste |
| CRAFT_SPEC not in `tjcages/skills` pack | Publish step unfinished | Public pack ≠ research workspace |
| No `measure_screen.py` / harness assertions | STRATEGY §6.4–6.5 | Numbers not enforceable in CI |
| Only **6** annotated measure crops (Linear/ChatGPT/Music docks) | §F re-measure; CORPUS claims 270+ assets but measure/ thin | Photos/Wallet/Freeform radii not re-verified locally |
| Claimed **R1–R99** but **78** bold `**Rn.**` defs; foundation **R5–R23** are "see §" stubs; **R6,9,12,13,16** never appear | Agents cite R# — broken index | PR notes cite ghosts |

## P1 — Thin sections (fail "3–5× depth" for these surfaces)

| Section | Lines | Problem |
|---|---|---|
| Sheets / popovers / menus (R91–R93) | ~8 | Detents yes; no sheet content anatomy, nested nav, form sheets, share sheet |
| Motion / feedback (R94–R95) | ~7 | No spring constants, toast geometry, selection morph, keyboard avoidance |
| Density modes (R96–R97) | ~7 | No token table Comfortable vs Compact for every Admin* token |
| Grid / media (R82–R85) | ~13 | Music carousel peek measured loosely; no album grid column math by width |
| Detail / form (R77–R81) | ~19 | Missing multi-section forms, date pickers, segmented control in forms |
| List anatomy (R71–R76) | ~27 | Weak on swipe actions, reordering, sticky headers, search-in-list |

## P2 — Corpus holes vs apps you asked for

| Requested | Status |
|---|---|
| Linear, ChatGPT, Notes, Music, Photos, Wallet, App Store | In CORPUS (App Store **1** URL only — thin) |
| Freeform (Preview-adjacent) | In; Preview/Finder **not** measured |
| Files / Finder | **Missing** |
| Apple Mail | Name-drop in O3 only — **no Mail screens** |
| Apple Settings | **Missing** (Notes/Photos settings used as proxy) |
| Reminders | **Missing** |
| Messages | **Missing** |
| Cursor / Grok Bot | **Missing** (inspiring apps) |
| Health | Mentioned in memory ambition — **Missing** |
| iPad landscape / split screens | **HIG + phone→infer** — honestly documented, still a hole |

## P3 — Logic / consistency gaps inside the rules

1. **Gutter conflict surface:** R1 default 20 vs Notes 16 vs ChatGPT 16–26 — decision tree §I exists but agents can still pick wrong without recipe lock-in.  
2. **Floating dock variants underspecified for Totem:** Linear island + search circle vs Photos dual-pill vs Music mini-player stack — Totem Today currently one dock; no rule for when dual-segment vs 4–5 tab island.  
3. **Hairlines:** Linear = none; Notes/Music = inset — Totem Pipeline must pick one density mode (R97) explicitly.  
4. **Liquid Glass:** R45 roles table exists; no `#available` code gate + fallback materials recipe beyond old harness.  
5. **iPad:** IP-R widths good; **zero measured iPad gutters** — Totem iPad shell would be HIG-faithful but not Mobbin-calibrated.  
6. **Accessibility §M** present but short — Dynamic Type dock collapse mentioned in R38, not illustrated.  
7. **Dark mode** R48 one paragraph — no measured dark corpus.  
8. **Totem token map** (R99) invents `AdminDock.height = 58` / `bottomInset = 24` — not re-measured against current `today_idle` / integrate screenshots yet.

## P4 — Totem surfaces we can verify in Paper now (enough rules)

| Screen | Recipe | Primary rules | Confidence |
|---|---|---|---|
| Today / Home feed | list + floating-tab | R1, R3 comfortable→compact?, R15, R57, R97 | High |
| Pipeline list | borderless list + chips | R15, R18, R71–76, R97 | High |
| Deal detail | metadata island + composer | R77–81, R59, H3/H7 | High |
| People / Relationships | standard list | R3, R71 | High |
| Releases catalog | list / cards | R2, R82–ish | Medium |
| Settings | inset grouped | R11.3, R79, H4 | High |
| Search overlay | detached FAB → search | R57, R89 | High |
| iPad shell | NavigationSplitView | IP-R1–3, H10 | Medium (HIG) |

## What “correct logic” means for Paper designs

Each designed screen must:
1. Cite **R# / IP-R#** in a caption.  
2. Use **Admin*** tokens (gutter 20, card 14, sheet 32, dock capsule, one accent).  
3. Pass §D anti-patterns (no full-bleed opaque tab, no hairlines on Linear-style feed, no outline boxes for grouping, glass chrome-only).  
4. Match density **R97 compact admin** for Pipeline/Today lists unless we explicitly choose comfortable.

## Recommended fix order (after Paper verify)

1. Paper: design Today, Pipeline list, Deal detail (± Settings) — prove logic.  
2. Patch CRAFT_SPEC: flesh R5–R23 stubs; fill R6/9/12/13/16; thicken sheets/motion/density.  
3. Pull missing CORPUS: Settings, Reminders, Messages, Files; deepen App Store/Wallet.  
4. Promote pack + recipes into `tjcages/skills`.  
5. Measure current Totem screens against tokens; adjust AdminDock numbers if off.

## Verification failure (Figma 2026-09-11)

**Status:** FAILED — Tyler rejected Totem craft Figma (`totem-craft-figma/01-today.png`, `02-pipeline.png`, `03-deal-detail.png`) as horrible vs `ap300-integrate/*` and Linear refs.

### Concrete fails → remediations

| Fail observed | Rule | Remediation |
|---|---|---|
| Emoji / emoji-like glyphs as dock + chrome icons | R102 | SF Symbols / vector only; forbid emoji in tabs/search/toolbar |
| Floating dock smashed into **vertical** icon stack in corner | R103 | Horizontal stadium; tab cells ~52–56×~40–44; selected = filled inner pill; search = detached circle same baseline |
| Sparse wireframe density — huge voids, title-only rows | R104, R105, R2 | Mandatory title + secondary + optional status; section gaps 24–32; density floor = Linear Inbox / Totem integrate |
| Flat solid-hue circles/rects as avatars | R107 | Photo / gradient / branded artwork; feed avatars circle 40–44; deal thumbs rounded-rect ~12 |
| Broken / fake status-bar chrome (dots + bar) | R101 checklist | Correct iPhone status bar or omit cleanly |
| Designs shown without visual self-QA | R101, R110 | Screenshot self-critique vs VISUAL_GATE before any human show |
| Pack was HIG platitudes; no measured CRAFT_SPEC load | R100, pack SKILL 0.2.0 | Always load `CRAFT_SPEC.md` + `VISUAL_GATE.md`; cite R#; recipes for Totem surfaces |

### P0 elevation

**Visual / design-output gate (R100–R110) is now P0 for the pack.** Agents must not invent or present UI without:

1. Loading `shared/CRAFT_SPEC.md` + `shared/VISUAL_GATE.md`
2. Mobbin/CORPUS pull (2–3 screens) before new chrome (R109)
3. Passing R101 screenshot self-critique (especially hard-stop trio: horizontal dock, secondary line, no emoji chrome)

Prior P0 items (recipes missing, thin router, pack not promoted) are addressed by the 0.2.0-draft pack rebuild that includes recipes + VISUAL_GATE + full CRAFT_SPEC copy.

### Refs for remediation QA

- Good: `ap300-integrate/today_idle.png`, `pipeline_list.png`, `pipeline_deal_detail.png`
- Good: `ap300-linear-refs/linear_inbox.jpg`, `linear_issue_detail.jpg`
- Bad (do not regress): `totem-craft-figma/01-today.png`, `02-pipeline.png`, `03-deal-detail.png`
