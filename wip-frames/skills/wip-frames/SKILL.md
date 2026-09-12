---
name: wip-frames
license: MIT
metadata:
  version: "0.1.0"
  status: draft
description: >-
  Use this when sharing WIP screens for approval. Off-white dotted board.
  Mobile status info is the official Figma iOS kit Status Bar at 50% opacity,
  vertically centered on a mat-colored pill. Titles use SF if available,
  otherwise Arial. Desktop uses Apple overlay scrollbars.
---

Full method: [METHODOLOGY.md](../../shared/METHODOLOGY.md).
Compositor: [compose.py](../../scripts/compose.py).

# WIP frames

The board is the share format. Raw screenshots, Figma page dumps, and browser chrome are not.

Do not bake in a product, channel, or person.

## Board

- Background `#F5F5F5`, 1px dots `#D2D2D2` on a 24px grid
- **80px** pad (floor 64). **32px** gap (floor 24)
- No ribbons, watermarks, emoji, or fake device bezels
- Punch Figma phone chrome. Desktop 16px radius. Mobile ~47pt corners
- PNG, long edge ≤ 2400px

## Titles

Left-aligned above each frame. **20px**, `#6B6B6B`. SF Pro / SF NS, else Arial, else Liberation Sans. Never Inter.

## Mobile status bar

Official Apple iOS 18 `Status Bar - iPhone` only. Cached at `scripts/assets/ios18-statusbar-alpha.png`.

- Kit icons and time at **50% opacity**
- Pill matches the mat (`#F5F5F5`)
- Vertically center kit content on the pill
- Do not redraw time, cellular, wifi, or battery

## Desktop scrollbars

Paint out OS gutters. Apple overlay thumb: 6px capsule, ~35% black, 3px inset, no track.

## Layout

One desktop per board. Mobiles: 1–3 in a row, scaled together.

```
python3 scripts/compose.py --out /tmp/wip.png --titles "Today,Pipeline,Deal detail" -- a.png b.png c.png
```
