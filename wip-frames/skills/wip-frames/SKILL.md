---
name: wip-frames
license: MIT
metadata:
  version: "0.2.0"
  status: draft
description: >-
  Use when sharing in-progress UI, product, or social screens for approval.
  Composes 1 desktop or 1–3 mobiles onto a dotted mat. Not for marketing
  heroes, App Store shots, final production, or raw Figma dumps.
---

Full method: [METHODOLOGY.md](../../shared/METHODOLOGY.md).
Chat: [RESPONSE.md](../../shared/RESPONSE.md).
Examples: [EXAMPLES.md](../../shared/EXAMPLES.md).
Compositor: [compose.py](../../scripts/compose.py).

# WIP frames

**These are requirements, not preferences.** A raw screenshot, Figma dump, or browser chrome is not the share.

## Operating order

1. Collect the real screens only. Crop browser chrome and Figma page junk first.
2. Classify: width ≤ 500 or width/height < 0.72 is mobile. Do not mix desktop and mobile.
3. One desktop per board. Mobiles: 1–3 in a row, same scale. A fourth screen is a second board.
4. Titles: page names, left-aligned. `--titles "Today,Pipeline,Deal"` or derive from the filename. Never Inter.
5. Load theme if the project has one (`wip-frames.theme.json` or `.wip-frames.json`). Otherwise use defaults. Do not invent chrome outside the token list.
6. Run `scripts/compose.py`. Attach the PNG. One line of titles. Stop.

```
python3 scripts/compose.py --out /tmp/wip.png --titles "Today,Pipeline,Deal detail" -- a.png b.png c.png
```

## Locked

Official iOS 18 kit status bar only. Status is the lowest z-index (no covering plate; island is a cutout). Kit icons at theme opacity (default 50%), centered on the pill. Punch Figma phone chrome. Apple overlay scrollbars. PNG, long edge ≤ 2400. No ribbons, watermarks, emoji, or fake bezels.

## Theme

A project may tint the mat. Allowed keys: `mat`, `dot`, `title`, `title_size`, `pad`, `gap`, `status_opacity`, `pill`, `desktop_radius`.

Defaults: mat `#F5F5F5`, dots `#D2D2D2`, titles 20px `#6B6B6B`, pad 80, gap 32, status 0.5, pill `#0000001A` (black at 10%).

Load order: `--theme path` → `wip-frames.theme.json` → `.wip-frames.json` → defaults. CLI flags win last.

Unknown keys are ignored. Do not add fonts, bezels, or custom status icons via theme.

## Never

- Inter or a display face on titles
- Custom status icons, or icons at full opacity
- Mixing desktop and mobile
- Inventing a look that is not in the theme file
