# Dogfood record

## 2026-09-24 — extraction from komo

Source: the audio editor on komo's `codex/video-audio-studio` branch. Extracted the music/effects engine, local server, panels UI, and focused timing/effects checks. Removed the launch-film cue sheet, preview deployment script, fixed paths, and komo branding.

## 2026-09-24 — combined launch path

Added an independently written Remotion starter and launch-film method to the same skill. A four-scene, 300-frame placeholder film passed structure validation and TypeScript checks, rendered at 1920 × 1080 / 30 fps, and exported through the bundled mixer as a 10.000-second H.264/AAC MP4 with two scene-local cues. The film intentionally says “Replace with product UI”; it proves tool compatibility, not product fidelity. A real independent product film remains required before v1.
