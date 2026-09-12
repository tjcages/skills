# WIP frames methodology

The board is the share format. Raw screenshots, Figma page dumps, and browser chrome are not.

**These are requirements, not preferences.**

This pack is generic. Do not bake in a product, channel, or person.

## When

Use when someone needs to approve in-progress UI, product, or social screens.

## Not for

Marketing heroes. App Store shots. Final production. Social posts. Leaving a raw capture in chat.

## Operating order

1. Collect the real screens only. Crop browser chrome and Figma page junk first.
2. Classify: width ≤ 500 or width/height < 0.72 is mobile. Do not mix desktop and mobile on one board.
3. One desktop per board. Mobiles: 1–3 in a row, same scale. A fourth screen is a second board.
4. Titles: page names, left-aligned. `--titles "Today,Pipeline,Deal"` or derive from the filename.
5. Load theme if the project has one. Otherwise use defaults. Do not invent chrome outside the token list.
6. Run `scripts/compose.py`. Attach the PNG. One line of titles. Stop.

## Locked

Agents cannot change these, including via theme:

- Official Apple iOS 18 `Status Bar - iPhone` only. Cached at `scripts/assets/ios18-statusbar-alpha.png`.
- Do not redraw time, cellular, wifi, or battery.
- Kit icons at the theme opacity (default 50%), vertically centered on the pill.
- Punch Figma phone chrome. No fake bezels. No grey plate around a phone.
- Apple overlay scrollbars on desktop: 6px capsule, ~35% black, 3px inset, no track.
- PNG, long edge ≤ 2400px.
- No ribbons, watermarks, or emoji.
- Titles: SF Pro / SF NS if on disk, else Arial, else Liberation Sans. Never Inter.

## Theme

A project may tint the mat. That is the only adaptation.

Allowed keys:

| key | default | notes |
|---|---|---|
| `mat` | `#F5F5F5` | Board background. Not tan. |
| `dot` | `#D2D2D2` | 1px dots, 24px grid |
| `title` | `#6B6B6B` | Title color |
| `title_size` | `20` | Pixels. Floor 12. |
| `pad` | `80` | Floor 64. |
| `gap` | `32` | Floor 24. |
| `status_opacity` | `0.5` | Kit icons only. Range 0.1–1.0. |
| `pill` | `mat` | `mat` or a hex |
| `desktop_radius` | `16` | Desktop corners only |

Load order: `--theme path` → `wip-frames.theme.json` → `.wip-frames.json` → defaults. CLI `--mat`, `--dot`, `--title-color`, `--status-opacity`, `--pad`, `--gap` win last.

Unknown keys are ignored. Do not add fonts, bezels, ribbons, or custom status icons via theme.

See [theme.example.json](../scripts/theme.example.json).

## How to build

```
python3 scripts/compose.py --out /tmp/wip.png --titles "Today,Pipeline,Deal detail" -- a.png b.png c.png
python3 scripts/compose.py --theme ./wip-frames.theme.json --out /tmp/wip.png -- a.png
```

## Never

- Inter or a display face on titles
- Custom status icons
- Status icons at full opacity
- Status icons sitting above or below the pill
- Tan mats, grey phone chrome, fat OS scrollbars
- Mixing desktop and mobile
- Inventing a look that is not in the theme file
