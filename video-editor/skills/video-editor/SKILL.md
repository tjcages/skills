---
name: video-editor
description: Plan, build, render, and soundtrack a product launch film. Use for product promo stories, frame-driven UI scenes, cut and cue timing, music, effects, and final MP4 export; includes a Remotion starter and local sound editor.
license: MIT
metadata:
  version: "0.2.0"
  status: draft
---

# Video editor

This one skill owns the whole film: launch story, product surface, shot timing, render, sound, and final export. Read [LAUNCH.md](../../shared/LAUNCH.md) for the visual film and [METHODOLOGY.md](../../shared/METHODOLOGY.md) for the soundtrack. Use [RESPONSE.md](../../shared/RESPONSE.md) for the handoff. The bundled assets are original reusable starters and the independently authored audio editor; no komo media, cue sheet, or purchased `product-video` skill files are bundled.

1. For a new launch film, write the claim, visible proof, product source, delivery format, and shot list using [LAUNCH.md](../../shared/LAUNCH.md). Use the product's existing render project or copy [assets/launch](assets/launch) into a standalone directory. Replace its labeled demo stage with the real product before delivery.
2. Render and review the silent film. Keep scene IDs and frame trims in `edit.json`; mark visible events in a `cues.json` compatible with the bundled example. The rendered film is the timing authority.
3. For sound, use [assets/editor](assets/editor): `npm ci`, then `npm start -- --video /absolute/film.mp4 --edit /absolute/edit.json --cues /absolute/cues.json`. The browser can also import a video with no command-line media. Import licensed music, align an excerpt, edit and audition cues, save the mix, and export MP4.
4. Review the encoded MP4 through the last frame. Report the film, recipe, source project, and any unverified visual or audio detail. Keep rendered media outside the skill source.

The visual editor changes soundtrack and cue timing; picture cuts live in the render project. A saved recipe references media, so keep its song and film alongside it. The local server binds to `127.0.0.1` and runs FFmpeg for export. Node 22.12+, FFmpeg, and FFprobe are required for the full workflow.
