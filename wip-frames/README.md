# WIP frames

Standard board for sharing in-progress UI, product, or social screens for approval.

**v0.1.0 — draft.** Dogfooded on Totem (3-up phones) and Socials (desktop). Not announced.

## What it changes

- One off-white dotted mat (`#F5F5F5`, 80px pad).
- One desktop, or up to three mobiles in a row.
- Official Figma iOS 18 status bar at 50% opacity, centered on a mat-colored pill.
- Left-aligned page titles (SF if present, else Arial).
- Apple overlay scrollbars on desktop.

## Install globally

```bash
npx skills add tjcages/skills --skill wip-frames -g --agent '*'
```

## Compose a board

```bash
python3 scripts/compose.py --out /tmp/wip.png --titles "Today,Pipeline,Deal detail" -- a.png b.png c.png
```

Needs Pillow. Status-bar asset lives at `scripts/assets/ios18-statusbar-alpha.png`.

## Source

- Method: [`shared/METHODOLOGY.md`](./shared/METHODOLOGY.md)
- Router: [`skills/wip-frames/SKILL.md`](./skills/wip-frames/SKILL.md)
- Compositor: [`scripts/compose.py`](./scripts/compose.py)

## License

[MIT](./LICENSE)
