# Soundtrack methodology

## Purpose

Put a repeatable soundtrack under the film created with the [video-editor skill](../skills/video-editor/SKILL.md) or any other existing video. The picture is the timing authority. The editor combines a music excerpt with frame-placed sound cues, then exports one complete MP4.

## Editing order

1. **Confirm the picture.** Use the exact film intended for delivery. A cut map is optional; when provided, its trimmed duration must match the film. If a different film is imported, review the cuts and cues again.
2. **Set music.** With no song supplied, generate an original, license-free bed: `node bed.mjs --film <seconds> --drop <seconds>` in the editor folder. Put the drop (the groove entering) on the film's first product reveal; the printed `start` lines it up. In the Panels dogfood this was the best-received part of the film. Otherwise import a song you can use, select an excerpt long enough for `film duration × music speed`, and adjust volume and fades. Treat estimated BPM as a starting point: syncopation, intros, and half or double time can fool the analyzer.
3. **Place effects.** Put a sound at the visual event's frame. Audition click, arrival, typing, and confirmation cues against the picture. Keep small gestures quieter than decisive actions. Use the editor's sound replacement and undo controls when changing a family of cues.
4. **Preview.** Play through cuts and the final tail. Looping helps audition but the export is one pass. Listen for masking, clipped peaks, missing cues, and sound that anticipates or lags the image.
5. **Save and export.** Save the recipe, export the MP4, and play the exported artifact. The local exporter copies the video stream and encodes an AAC soundtrack; browser export re-encodes the picture. The final encoded file is the review authority.

## Headless mixing, for agents that cannot listen

`node render-mix.mjs --video film.mp4 --edit edit.json --cues cues.json --song bed.wav --start <s> --out final.mp4` builds the same v2 recipe the editor saves (written beside the output, so the visual editor can reopen it), exports through `mix.mjs`, and **reports every cue's peak against the music under it**, then masters to -14 LUFS with a -1.5 dBFS limiter, copying the picture.

Measure because you cannot hear. The bundled Cuelume sounds are UI-quiet (peaks around -12 to -21 dBFS): at editor music volume 0.85 every cue sat 15-40 dB under the bed, and even at 0.3 the small press and release clicks were only 0-4 dB over it. The default music volume is 0.22 with cues near full; the report flags any cue under +4 dB. Raise small gestures to 0.8-1.0 rather than leaving them at the "quiet" levels the editor suggests for listening. A mix that measures well can still sound wrong, so a human listen through the final frame stays the last step.

## Inputs and durability

`--video` accepts a rendered MP4. `--edit` accepts the existing scene cut map in `{ "cuts": [{ "scene": "name", "in": 0, "out": 60 }] }` form at 30 fps. `--cues` accepts `{ "version": 1, "fps": 30, "cues": [{ "id": "event", "scene": "name", "frame": 12, "sound": "press", "volume": 0.5, "label": "Action" }] }`. Cue frames are local to their scene. The editor resolves them through the cut trims and discards cues outside the shown frames. Duplicate or unknown scene names fail instead of drifting silently.

Without a cut map, import the film and add cues at absolute film frames in the visual editor. Save mix settings as JSON after any edit. The browser also saves one current project with its media in IndexedDB on the current device and origin. Starting the server with a different or modified configured film, cut map, or cue sheet starts a fresh project; clearing site data removes the recovery copy. The downloaded JSON contains timing and levels, not the film or song.

## Boundaries and checks

- The picture's first frame is an alignment target. Beat alignment moves the chosen music excerpt; it does not change the cuts.
- Source music must cover the full playback range at the chosen speed. The editor rejects short excerpts, stale film durations, invalid fades, and malformed cues.
- The supplied sounds come from Cuelume 0.2.2 (MIT, Daniel Belyi). The editor generates and caches its samples locally. Preserve upstream attribution when distributing a rendered sound bank.
- Music and effects are mixed with sample peak headroom. Listen to the encoded MP4 because AAC and browser recording can differ from preview playback.
- The studio is local to one machine. Do not turn its local export endpoint into a public service without a separate security and capacity review.

## Readiness rubric

The work is ready for review when the correct picture loads, soundtrack lasts through the final frame, visual events and sounds coincide, no cut reveals an unintended reset, saved recipe reopens with its media, and the exported MP4 plays through without clipping or an unexpected original soundtrack. If one item cannot be checked, name it in the handoff.

## Common failures

| Symptom | Correction |
| --- | --- |
| BPM appears plausible but beats miss cuts | Adjust first beat by ear; try half or double the detected BPM. |
| Cues move after a trim | Recheck the scene-local cue frame against the revised animation and cut map. |
| Preview sounds right but final file differs | Review the encoded MP4; use local FFmpeg export when picture preservation matters. |
| Mix recovers without media elsewhere | Carry the original film and song with the saved JSON recipe. |
