# Dogfood record

## 2026-09-24 — extraction from komo

Source: the audio editor on komo's `codex/video-audio-studio` branch. Extracted the music/effects engine, local server, panels UI, and focused timing/effects checks. Removed the launch-film cue sheet, preview deployment script, fixed paths, and komo branding.

## 2026-09-24 — combined launch path

Added an independently written Remotion starter and launch-film method to the same skill. A four-scene, 300-frame placeholder film passed structure validation and TypeScript checks, rendered at 1920 × 1080 / 30 fps, and exported through the bundled mixer as a 10.000-second H.264/AAC MP4 with two scene-local cues. The film intentionally says “Replace with product UI”; it proves tool compatibility, not product fidelity. A real independent product film remains required before v1.

## 2026-09-24 — author-authorized Product Video integration

Replaced the initial visual starter with the supplied author-authorized MIT Product Video workflow. The four former companion guides are now internal references of `video-editor`; its 41 visual assets are packaged under `assets/launch`, with a scaffold command. A copied eight-scene project installed, typechecked, and rendered 370 frames at 30 fps. The encoded MP4 and cut map both measured 12.333 seconds. The placeholder stage produced 13 expected framing warnings in QC and is not a product film. The sound editor's 12 checks passed. Independent-target dogfood remains [OFF-725](https://linear.app/off-brand-studio/issue/OFF-725).
