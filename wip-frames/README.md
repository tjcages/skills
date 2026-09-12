# WIP frames

The board is the share format for in-progress screens.

**v0.2.0 — draft.** Dogfooded on Totem (3-up phones) and Socials (desktop). Theme tokens added. Not announced as v1.

## What it changes

- One dotted mat. Defaults stay `#F5F5F5`.
- One desktop, or up to three mobiles in a row.
- Official Figma iOS 18 status bar at 50% opacity, centered on a mat-colored pill.
- Left-aligned page titles (SF if present, else Arial).
- Apple overlay scrollbars on desktop.
- A project theme file may tint the mat. It cannot invent chrome.

## Install globally

```bash
npx skills add tjcages/skills --skill wip-frames -g --agent '*'
```

## Compose a board

```bash
python3 scripts/compose.py --out /tmp/wip.png --titles "Today,Pipeline,Deal detail" -- a.png b.png c.png
```

Optional project theme: `wip-frames.theme.json` or `--theme path`. See [`scripts/theme.example.json`](./scripts/theme.example.json).

Needs Pillow. Status-bar asset lives at `scripts/assets/ios18-statusbar-alpha.png`.

## Example

Totem iOS admin, three phones: [`examples/totem-ios-admin.png`](./examples/totem-ios-admin.png).

## Source

- Method: [`shared/METHODOLOGY.md`](./shared/METHODOLOGY.md)
- Chat: [`shared/RESPONSE.md`](./shared/RESPONSE.md)
- Examples: [`shared/EXAMPLES.md`](./shared/EXAMPLES.md)
- Router: [`skills/wip-frames/SKILL.md`](./skills/wip-frames/SKILL.md)
- Compositor: [`scripts/compose.py`](./scripts/compose.py)

## License

[MIT](./LICENSE)
