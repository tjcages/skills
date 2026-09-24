---
name: video-editor
description: Plan, stage, animate, render, and soundtrack a product launch film. Use for product promo stories, frame-driven UI scenes, cut timing, titles, music, effects, and final MP4 export.
license: MIT
metadata:
  version: "0.3.0"
  status: draft
---

# Video editor

One skill owns the film from claim to final MP4. The bundled Remotion launch scaffold and local sound editor share the same `edit.json` cut map. Keep working projects, renders, music, and mix recipes outside this skill. Follow the product's actual capabilities and visual system; the scaffold is a placeholder, not product evidence.

1. **Story:** Read [story](references/story.md). Write the one claim, visible proof, and four beats before choosing shots. For broad launch briefs, cover each part the brief explicitly names.
2. **Stage:** Read [staging](references/staging.md). Choose real product code, approved captures, or a faithful frame-driven reconstruction. Decide what to import and what to rebuild before animating.
3. **Scenes:** Read [scenes](references/scenes.md). Plan one composition per shot, animate moves to completion, and set cuts in `src/edit.json`. Read [text](references/text.md) when the film has titles, captions, or other on-screen words.
4. **Render:** Read [render](references/render.md). Run [scripts/scaffold.mjs](scripts/scaffold.mjs) from the installed skill to create a standalone project from [assets/launch](assets/launch). Inspect QC stills and the silent assembled `out/film.mp4`. A changed cut or picture requires a fresh sound review.
5. **Sound and export:** Read [soundtrack methodology](../../shared/METHODOLOGY.md). In [assets/editor](assets/editor), run `npm ci`, then `npm start -- --video /absolute/film.mp4 --edit /absolute/edit.json --cues /absolute/cues.json`. The cue sheet is optional; without one, add effects in the editor. Import usable music, audition frame-aligned cues, save the mix, and export an MP4. Play the encoded result through the last frame.

The visual editor adjusts music and sound cues; picture cuts live in the Remotion project. `edit.json` uses `{ "cuts": [{ "scene": "name", "in": 0, "out": 60 }] }` at 30 fps, and the bundled sound editor reads it directly. A cue sheet uses scene-local frame numbers; see the [soundtrack methodology](../../shared/METHODOLOGY.md). Keep the film and song with the saved JSON recipe because it references their timing. Node 22.12+, FFmpeg, and FFprobe are required for the full workflow.
