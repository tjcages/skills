---
name: video-editor
description: Add music and frame-placed sound effects to an existing video with a local visual editor. Use when a rendered film needs soundtrack timing, beat alignment, cue editing, or MP4 export; this skill does not create or cut the picture.
license: MIT
metadata:
  version: "0.1.0"
  status: draft
---

# Video editor

Use the bundled local editor in [assets/editor](assets/editor). Read [METHODOLOGY.md](../../shared/METHODOLOGY.md) for the editing decisions and [RESPONSE.md](../../shared/RESPONSE.md) for the handoff shape. The editor is a reusable extraction of the audio studio built for komo; no komo media or cue sheet is bundled.

1. Get the rendered video. If an edit uses scene-local cues, also get its cut map and cue sheet. Do not infer cue times from scene names alone.
2. From `assets/editor`, run `npm install` and `npm start -- --video /absolute/film.mp4 --edit /absolute/edit.json --cues /absolute/cues.json`. Only `--video` is needed for a plain film, and the browser can import a video if it is omitted. Open the localhost URL printed by the server.
3. Import a licensed song or use the synthetic demo. Set the excerpt, BPM estimate, beat alignment, speed, fades, and level. Add and audition sound cues at the playhead. Check each cut in playback.
4. Save the mix JSON. Export MP4 in the local editor, or run `node mix.mjs --video /absolute/film.mp4 --song /absolute/song.wav --mix /absolute/video-mix.json --out /absolute/finished.mp4`. Omit `--song` for an effects-only mix with music disabled. Keep rendered media and the mix outside the skill source.
5. Review the exported file from beginning to end, including the first frame, cuts, peaks, and ending. Report the exported path, recipe path, and any timing uncertainty.

The visual editor changes soundtrack and cue timing. It does not move video cuts, time-stretch the source video, or grant rights to a song. A saved recipe references media; keep its song and film alongside it. The local server binds to `127.0.0.1` and runs FFmpeg for export. Node 22.12+, FFmpeg, and FFprobe are required for the full workflow.
