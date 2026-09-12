# WIP frames methodology

The board is the share format. Raw screenshots, Figma page dumps, and browser chrome are not.

This pack is generic. Do not bake in a product, channel, or person.

## Board

- Background: `#F5F5F5`. Not tan.
- Pattern: 1px dots, `#D2D2D2`, 24px grid, offset 12px.
- Screens sit as a single centered cluster.
- Minimum padding: **80px** (floor 64px).
- Gap between screens: **32px** (floor 24px).
- No ribbons, watermarks, or emoji.
- No fake device bezels. Punch Figma device chrome (corner-connected grey). No grey plate around a phone.
- Desktop: 16px radius. Mobile: iPhone corners (~47pt at 390).
- Export PNG. Cap long edge at 2400px.

## Titles

Page name above each frame, left-aligned to that frame.

- **20px**, `#6B6B6B`.
- Font, in order: SF Pro / SF NS if the file is on disk, else Arial, else Liberation Sans (Arial metrics).
- Never Inter.
- 8px gap above the frame.
- `--titles "Today,Pipeline,Deal detail"` or derive from the filename.

## Mobile status bar

Official Figma iOS kit only. Do not redraw time, cellular, wifi, or battery.

- Apple **iOS 18** library, `Status Bar - iPhone`.
- Cached export: `scripts/assets/ios18-statusbar-alpha.png`.
- Draw the kit icons and time at **50% opacity**.
- Pill matches the board (`#F5F5F5`) and sits in the kit's Dynamic Island spacer.
- Vertically center the kit bar's content on the pill.
- Wipe custom status chrome on the source, then overlay the kit bar.

## Desktop scrollbars

Paint out OS gutters. Apple overlay thumb only: 6px capsule, ~35% black, 3px inset, no track.

## Layout

- Mobile: width ≤ 500 or width/height < 0.72.
- One desktop per board. Mobiles: 1–3 in a row.
- Scale mobiles uniformly.

## How to build

```
python3 scripts/compose.py --out /tmp/wip.png --titles "Today,Pipeline,Deal detail" -- a.png b.png c.png
```

## Never

- Inter or a display face on titles.
- Custom status icons.
- Status icons at full opacity.
- Status icons sitting above or below the pill.
- Tan mats, grey phone chrome, fat OS scrollbars.
