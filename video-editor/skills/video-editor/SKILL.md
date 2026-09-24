---
name: video-editor
description: Make a product launch film by default, or a focused demo when requested, from an app, package, feature, or website. Show the real product UI and motion, then render and mix the film.
license: MIT
metadata:
  version: "0.5.0"
---

# Video editor

One skill owns the film from product discovery to final MP4. A request such as “make a product launch video” is enough to start: inspect the product and choose the story. The bundled Remotion scaffold and local sound editor are packaged assets to copy or run as needed; their source does not need to be loaded into model context. They share the `edit.json` cut map. Keep working projects, renders, music, and mix recipes outside this skill. The scaffold is a placeholder, not product evidence.

1. **Discover and choose:** Inspect the product's docs, source, live UI, and available assets. Read [story](references/story.md). Default to a launch film with the strongest distinct visual features. Choose a focused demo when the user asks for a demo or names one feature without asking for a launch; an explicit launch request wins. A whole website can be the subject of either mode. Record the selected and omitted features with reasons.
2. **Classify and stage:** Read [fidelity](references/fidelity.md) and [staging](references/staging.md). Mark each visible element as primary product UI or accessory context. Reuse or record the real primary UI and its actual motion by default. Do not invent a replacement component or animation because the source is difficult to render. The user must explicitly request abstraction before primary UI can be redesigned.
3. **Direct:** Read [scenes](references/scenes.md). Plan one composition per shot and set cuts in `src/edit.json`. For a package or capability film, favor isolated product components and causal transitions over a persistent fake app page. Vary composition and scale; the product itself must visibly change. Use title cards only when they earn their reading time. Read [text](references/text.md) when the film has on-screen words.
4. **Render and review:** Read [render](references/render.md). Run [scripts/scaffold.mjs](scripts/scaffold.mjs) from the installed skill to create a standalone project from [assets/launch](assets/launch). Inspect stills and the silent assembled `out/film.mp4`. Compare featured UI states and motion against the running product or source captures, then watch at playback speed to check whether an unfamiliar viewer can name the features and see their results. Technical QC cannot answer either question. Revise weak or inaccurate scenes before sound work. A changed cut or picture requires a fresh sound review.
5. **Sound and export:** Read [soundtrack methodology](../../shared/METHODOLOGY.md). In the packaged [editor](assets/editor), run `npm ci`, then `npm start -- --video /absolute/film.mp4 --edit /absolute/edit.json --cues /absolute/cues.json`. The cue sheet is optional; without one, add effects in the editor. Choose music that supports the edit and sound cues tied to actual entrances, gestures, impacts, and results. Save the mix, export, and watch the encoded MP4 through the last frame. Counted cues or a passing export do not establish creative quality.

The visual editor adjusts music and sound cues; picture cuts live in the Remotion project. `edit.json` uses `{ "cuts": [{ "scene": "name", "in": 0, "out": 60 }] }` at 30 fps, and the bundled sound editor reads it directly. A cue sheet uses scene-local frame numbers; see the [soundtrack methodology](../../shared/METHODOLOGY.md). Keep the film and song with the saved JSON recipe because it references their timing. Node 22.12+, FFmpeg, and FFprobe are required for the full workflow.
