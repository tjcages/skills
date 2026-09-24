# Video editor

One Agent Skill for a focused product demo or a broader launch film: product discovery, feature selection, real-product staging, frame-driven scenes, creative review, music, effects, and final MP4 export. A request such as “make a product launch video” starts with product inspection and a feature inventory. Install [`skills/video-editor`](skills/video-editor); its production guides are internal references, not separate skills.

For a new film, follow the [skill](skills/video-editor/SKILL.md) and copy the bundled [Remotion assets](skills/video-editor/assets/launch) into a standalone work directory using the [render guide](skills/video-editor/references/render.md). The scaffold renders eight placeholder shots; replace them with truthful product evidence. The local [sound editor](skills/video-editor/assets/editor) is packaged as runnable UI, not material the model must load into context. It accepts the rendered MP4 and the same `edit.json` cut map. Node 22.12+, FFmpeg, and FFprobe are needed for native export.

Run `npx tsc --noEmit`, `node qc.mjs`, and `node build.mjs` in the copied film project. The placeholder stage intentionally triggers QC framing warnings; resolve them against the real product film. Inspect the QC images and encoded video. Run `npm test` in the sound editor. Keep films, music, downloads, generated samples, and `node_modules` outside Git.

The visual production material is adapted from the author-authorized MIT release of Product Video by [launchvideo.dev](https://launchvideo.dev/). See [NOTICE](NOTICE.md) for attribution. The sound editor and packaging are authored separately; Cuelume sound attribution is in the [methodology](shared/METHODOLOGY.md).

Status: v0.4 draft. The `panels` launch-film dogfood exposed a creative failure in the first cut and drove the launch-specific story, pacing, and review rules. User acceptance of the replacement film remains open before v1.
