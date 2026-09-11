# Recipe: Deal / issue detail + metadata island

**Surfaces:** Totem Deal detail, Linear Issue detail, release detail.  
**Primary rules:** R4, R17, R59, R77–R81, **R104–R107**, R110.  
**CORPUS:** Linear Issue detail (local `ap300-linear-refs/linear_issue_detail.jpg`) · Totem `ap300-integrate/pipeline_deal_detail.png`.

## Layout skeleton

```
┌ [○ back]              [✎ ··· capsule]                 ┐
│                                                       │
│ [ art  ]  eyebrow (Album / type)                      │
│ [~16 r ]  Title (large / title2)                      │
│           Subtitle secondary                          │
│                                                       │
│ ┌ metadata island (gray fill, r~14) ───────────────┐  │
│ │ [pill] [pill] [pill] [avatar pill] …             │  │
│ └──────────────────────────────────────────────────┘  │
│                                                       │
│ Next action / Overview|Activity segment               │
│ SECTION  count                                        │
│ rows with title + secondary (+ trailing chevron)      │
│                                                       │
│        [ composer island — see composer.md ]          │
└───────────────────────────────────────────────────────┘
```

## Tokens

| Token | Value |
|-------|-------|
| Gutter | **20–22 pt** |
| Hero thumb | ~56–72, radius **~12–16** |
| Metadata island padding | **12–16** (R4) |
| Island radius | **12–16** continuous |
| Pills | capsule, icon+label, 8 pt gap |
| Section gap | **24–32** |
| Internal card stack | **12–16** — not 32+ voids inside one card |

## Anatomy requirements

- Header: media + title + subtitle (never title alone)  
- Status/properties as **pills in a fill island** — not a sparse key/value card with huge whitespace  
- Relationship / blocker rows: leading icon or avatar + title + **secondary** + optional status pill + chevron  
- Top chrome: floating back circle + trailing action capsule (R59)

## Anti-patterns

- Sparse 4-row label/value card with giant internal gaps (fail: `totem-craft-figma/03-deal-detail.png`)  
- Owner as plain text with no avatar affordance  
- Outline-bordered boxes for grouping (use fill islands)  
- Fake status bar glyphs  
- Presenting without VISUAL_GATE screenshot pass  

## Pair with

`composer.md` for bottom comment island; on iPad use inspector column (`IPAD_CRAFT`).
