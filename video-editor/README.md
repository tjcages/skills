# Video editor

Local visual editor and Agent Skill for soundtracking an existing film. Import music, align an excerpt to a cut, place sound effects at frames, save a mix, and export an MP4.

Install the Agent Skill from [`skills/video-editor`](skills/video-editor). The bundled editor lives in [`skills/video-editor/assets/editor`](skills/video-editor/assets/editor); run `npm install` there, then `npm start -- --video /absolute/film.mp4`. Node 22.12+, FFmpeg, and FFprobe are needed for native export. Optional `--edit` and `--cues` load an existing 30 fps scene cut map and scene-local effects sheet.

`npm test` in the editor directory checks timing, cue resolution, mixing, and export validation. Film, music, downloads, and generated sound samples stay outside Git.

Status: v0.1 draft extracted from the komo editor. Independent-target dogfood is required before v1.
