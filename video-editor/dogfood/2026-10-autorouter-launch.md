# Dogfood: AutoRouter launch film (2026-10)

Second independent run of the skill: a ~33 s launch film for AutoRouter, a macOS app that routes each Codex and Claude Code turn to a model. The brief asked for a film "indistinguishable from a screen recording", polished and fast but not frantic, after the product's previous film used a stylized filmed-monitor look the owner didn't love. Source: `tjcages/autorouter-videos`, `scenes/launch-film/` (branch `launch-film`).

## What the run did differently

The featured UI is native (SwiftUI) and lives inside another company's Electron app (Codex), so neither import nor `capture/record.mjs` applied: nothing could be recorded without taking over the owner's screen, and the routing it shows needs live inference. The film was built instead as a deterministic HTML scene in the product's existing video repo, filmed with that repo's renderer, from exact specs:

| Surface | How it was made truthful |
| --- | --- |
| Codex window | Its installed renderer bundle (`app.asar`) was extracted read-only: stylesheets, the JS theme engine's colour formulas (colours are computed at runtime, not in CSS), and all 1,116 icons as SVG |
| AutoRouter notice, handle, HUD | Three research agents wrote cited specs from the Swift source (sizes, springs, glass layers, copy), plus the few real captures that existed |
| macOS chrome | SF Symbols exported with a 30-line AppKit script; the real pointer glyphs from the skill |

## What worked

| What | Why it worked | Fold back as |
| --- | --- | --- |
| Spec agents before building | Three parallel agents (product UI, HUD, host app) returned cited values in ~15-30 min each; the build then had almost no guessing | staging.md: when the product's UI is native or embedded in a third-party app, run cited spec passes first |
| Reading the host app's own bundle | Exact tokens and icons for an app we don't own, without launching it | staging.md, Part 2: an Electron host's `app.asar` is readable source for accessory context |
| A flat "screen" look | No lens: capture at 2x, average sub-frames only when the camera or pointer moves, skip the post pass entirely for still frames | render.md: a screen-recording look needs motion blur and nothing else |
| macOS behaviours as realism | The pointer hides while typing and reappears on the next move; the list opens scrolled to the checked row; an inactive window greys its traffic lights; hover is instant | scenes.md: list the host OS's behaviours, they read as "real" more than any effect |
| Later turns arrive already sent | Typing once establishes the gesture; cutting in on later prompts as they're sent keeps three turns under 6 s | story.md, core loop |
| Beat grid inside the scene | `onBeat()` snaps every cut and card to the bed's half beats at schedule time, so retiming never falls off the grid | beats.mjs can stay for edit.json films; a scene that schedules itself can snap at source |
| Sample-accurate foley | Typing at ~20 keys/s is finer than the cue sheet's 30 fps frames; synthesizing keys, clicks and result cues straight from the scene's event times avoided stacked cues | SOUND-DESIGN.md: typing needs per-key timing, not frame cues |

## What didn't, and the fixes

1. **Page heights measured before content existed.** The HUD pages were measured before their text and bars were filled, then again with a menu open, so one page clipped and one had a 180 px gap. Fix: fill a component's real content (and collapse transient parts) before measuring its resting height.
2. **A tight push-in cropped UI into nonsense.** Framing the routed notice closely left half a diff card on screen as floating "+88 -41" numbers. The old rule ("never cut a line of text") holds for whole components too: frame the full column or none of it.
3. **A dynamic terminal padded to the window height.** Claude Code draws inline, so filler lines pushed its input to the bottom of the window and the camera framed empty space. Model the host's real layout behaviour, not a full-screen TUI.
4. **GPU-bound sub-frames.** 16 sub-frames on every zoom frame made those frames ~10x slower. A cap of 16 at 1.5 px of streak was fine for 1x drafts; keep the cap.

## v2: recording the landing's chart with capture/record.mjs

The owner's v1 notes asked for the landing page's "Your plans, used smarter" chart, a multi-stage animation (frontier drains, two lines run past it, flags, a springing axis). Porting it would have been a guess, so it was filmed with the recorder. Four fixes came out of it, all now in `assets/capture/record.mjs`:

1. **rAF ran K² too slow.** The recorder slowed the document timeline with CDP `Animation.setPlaybackRate(1/K)`, which also slows the timestamps rAF hands its callbacks, and then the init patch divided them by K again. Anything timed from rAF (the chart's whole loop) ran ~K times too slow while timers and CSS were right. The patch now passes rAF callbacks the patched `performance.now()`. A probe (clip width after 0.6 s virtual, with and without the CDP rate) shows the two now agree.
2. **Captures came back slow, then at 1x.** `page.screenshot` at DSF 3 took ~1.3 s; CDP `Page.captureScreenshot` with `optimizeForSpeed` is several times faster, but a CDP session needs its own `Emulation.setDeviceMetricsOverride` or it captures at 1x.
3. **Heavy pages starve the capture loop.** The landing's ambient WebGL canvases cost every frame; `BLOCK` in the shots file aborts named scripts. Blocking a module another one imports (`wires.js`, imported by `page.js`) silently kills the importer, so the chart never played: check the import graph first.
4. **`--fps`.** The recorder resampled to a hard-coded 30 fps; a 60 fps film needs `--fps=60`.

Also: a section that starts on screen begins its scroll-triggered animation during the recorder's setup wait, so the take starts mid-animation. A spacer before the section keeps it off screen until the take scrolls it in. Worst gap at K=60 was 28 ms for 540 frames from 517 captures; the warning to raise K is worth reading.

Footage plays inside the HTML scene as a `<video>` seeked per frame: `seek()` returns a promise that settles on `seeked` plus two rAFs, which the renderer awaits. The renderer's static server needed byte-range support for the seek, and the footage a short keyframe interval (`-g 15`) so each seek decodes few frames. A title card hands off to the recorded section by gliding its line onto the section's own heading; matching the heading's exact metrics (tracking and line height) and measuring the line's resting box at render time, not in a separate pass, made the overlap land within a pixel.

## v4: recorded keys, library music, the landing's ink

The owner asked for real keyboard sounds (Klack), a Magic Mouse click and licensed library music (Screen Studio's), all already on the machine.

| What | How | Fold back as |
| --- | --- | --- |
| Library music and clicks | Screen Studio's `app.asar` holds plain MP3s and WAVs; its music index names each track's BPM in a comment. Measured tempos were exact integers (114, 120, 122), so `onBeat()` retimed the whole cut by changing one constant | SOUND-DESIGN.md: check the host's library before generating a bed; a scene that snaps at source retimes for free |
| Placing the track | A per-bar loudness map found the sections; starting the track so its own ending falls on the closing card beats a fade for a loop | SOUND-DESIGN.md: end-align the track, then check that a bar lands on the first cut |
| Keys from Klack | Its sounds are encrypted in the bundle, so it was *played*: a Swift tool posts each film key at its cue time with a marker, Klack's tap hears it, a tail-appended tap at the annotated session level drops it before any app, and ScreenCaptureKit records the audio on the plan's clock | assets/: a recorder for any key-event-driven sound app |
| Recording a windowless app | `SCContentFilter(including:)` can't pick a windowless agent (it isn't listed); excluding every listed app leaves it. A take fails if its lead-in isn't silent or a hand-typed key arrives | capture notes |
| Gotchas | A sandboxed app's container locks once it has run (`Operation not permitted`), so drive it through its AppleScript, not its prefs. Klack is silent for a few seconds after launch; probe with one key until it sounds | capture notes |
| Mastering | Two-pass linear loudnorm to -18 LUFS keeps the stem balance (single-pass loudnorm compresses) | mix.mjs |

## v5 and after: making the next film fast

The owner signed off v5 and asked for a repeatable rhythm. What went into `tjcages/autorouter-videos` (PR #1) that a generic project could reuse:

| What | Result | Fold back as |
| --- | --- | --- |
| Draft, review and final qualities | 540p draft (motion blur capped at 4 sub-frames) in ~1.5 min, 1080p review in ~3.5 min, 4K only on "final" | render.md: never iterate at the master's resolution; the reviewer watches the share size |
| One browser per render job | One browser encodes every page's screenshots on one process, so pages in one browser topped out near 2x; a browser per job reached 3.3x at 6 jobs (8 was slower) | render.md, for any Playwright capture loop |
| One scoring command | cues, clicks, cached keys take, music mix in one pass; a take is recorded only when the keystrokes change | editor: a recipe that re-runs in seconds when only the picture changed |
| A taste file the agent updates after every review | Notes that apply beyond one film replace what they contradict | SKILL.md step 6 |
| Prettier on a scene | Reformatting an element styled `white-space: pre` moved text; compare stills before and after formatting, and keep such markup on one line with `prettier-ignore` | scenes.md |
