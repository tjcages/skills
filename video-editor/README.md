# Video editor

One Agent Skill for a product launch film, from visual story and frame-driven render through music, effects, and final MP4. It includes a working Remotion launch starter and a local visual sound editor.

Install the Agent Skill from [`skills/video-editor`](skills/video-editor). For a new film, copy [`assets/launch`](skills/video-editor/assets/launch) into a standalone work directory, run `npm ci`, replace the labeled demo surface with real product evidence, then `npm run render`. Existing render projects can supply their own film. The soundtrack editor is in [`assets/editor`](skills/video-editor/assets/editor); run `npm ci` there, then `npm start -- --video /absolute/film.mp4 --edit /absolute/edit.json --cues /absolute/cues.json`. Node 22.12+, FFmpeg, and FFprobe are needed for native export.

`npm run validate`, `npx tsc --noEmit`, and `npm run qc` in the launch starter check scene/cue structure, types, and visual stills. `npm test` in the editor checks timing, cue resolution, mixing, and export validation. Film, music, downloads, and generated sound samples stay outside Git.

Status: v0.2 draft built from the komo launch film and editor. Independent-target dogfood is required before v1.
