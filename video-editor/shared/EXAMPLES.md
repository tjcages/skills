# Dogfood record

## 2026-09-24 — extraction from komo

Source: the audio editor on komo's `codex/video-audio-studio` branch. Extracted the music/effects engine, local server, panels UI, and focused timing/effects checks. Removed the launch-film cue sheet, preview deployment script, fixed paths, and komo branding.

## 2026-09-24 — combined launch path

Added an independently written Remotion starter and launch-film method to the same skill. A four-scene, 300-frame placeholder film passed structure validation and TypeScript checks, rendered at 1920 × 1080 / 30 fps, and exported through the bundled mixer as a 10.000-second H.264/AAC MP4 with two scene-local cues. The film intentionally says “Replace with product UI”; it proves tool compatibility, not product fidelity. A real independent product film remains required before v1.

## 2026-09-24 — author-authorized Product Video integration

Replaced the initial visual starter with the supplied author-authorized MIT Product Video workflow. The four former companion guides are now internal references of `video-editor`; its 41 visual assets are packaged under `assets/launch`, with a scaffold command. A copied eight-scene project installed, typechecked, and rendered 370 frames at 30 fps. The encoded MP4 and cut map both measured 12.333 seconds. The placeholder stage produced 13 expected framing warnings in QC and is not a product film. The sound editor's 12 checks passed. Independent-target dogfood remains [OFF-725](https://linear.app/off-brand-studio/issue/OFF-725).

## 2026-09-24 — panels launch-film dogfood and creative correction

The first independent-target film technically passed TypeScript, QC, rendering, and audio export, but failed the actual launch brief. It showed one amplitude slider inside a made-up “Wave lab” page; camera zoom carried most of the movement, while transitions and sparse cues did little to connect product capabilities. The editor's technical checks did not detect this creative failure. The owner rejected it after watching.

The replacement was built in `/Users/ty/Workspace/panels-video-dogfood/`, outside Git. Product inventory from `tjcages/panels` led to four visible capabilities: live state tuning, gradient/color controls, floating/dockable panel movement, and GIF/video/PNG capture. Eight component-led scenes show these actions over 634 frames / 21.133 seconds. Brief title and brand holds replace the fake persistent page header, footer, and “live preview” chrome. The package's real dark skin, labels, hero field, and logo inform frame-driven presentational versions. Features not shown (JSON, production no-op, collections, overlays) are recorded as deliberate omissions in `BRIEF.md`.

Friction and skill corrections: the entrypoint treated every brief like a one-proof demo; the story reference said to cut every second feature; the template validator capped any film at 450 frames and any clip at 75; scene/text guides prescribed one inward zoom arc and one-line cards. The skill now routes launch versus focused demo, requires evidence-backed feature selection and creative playback review, and accepts justified launch edit limits while retaining trim, coverage, and motion validation. The sound editor remains packaged as runnable UI rather than loaded as instructions.

Verification: local TypeScript check passed; QC checked both ends of all eight cuts with intentional full-bleed art marked wide and reported no defects. The full silent film rendered at 1920×1080/30 fps. The packaged editor loaded the 21.13-second film, eight cuts, and 13 scene-local cues; imported the user's 40-second `komo-demo-120bpm.wav`, saved the mix, and exported a 21.133-second H.264/AAC MP4. Encoded picture and audio durations match. Creative acceptance remains with the owner; technical export is not a claim that the film now meets their taste bar.
