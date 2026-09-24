# Product launch films

This is the launch-film path of the `video-editor` skill. It covers the visual story and render before the soundtrack editor. Use an existing video project when one is present; the bundled Remotion starter is for a new film. The starter's UI is deliberately labeled as a placeholder and must be replaced with product evidence before delivery.

## Brief to shots

Write a short production brief before building the film:

```text
Audience: Who sees it, and where?
Claim: What single useful change does the product make?
Proof: What visible event demonstrates that change?
Source: Which real screen, component, or approved capture proves it?
Delivery: Aspect ratio, duration, silent/sound, and output format.
```

If the proof is a list of unrelated features, choose one thread or make multiple films. Map the thread into an opening that orients, a visible before state, an interaction, and a held after state. A broad product or portfolio brief may need more shots; cover every part the brief explicitly names. Write each shot as one sentence and identify what state carries into the next shot. Keep a single source of truth for copy, values, and state so later shots do not reset the product.

## Product surface

Use approved captures or the product's presentational components and tokens. Fixture data is appropriate for privacy and repeatability. Check the actual interaction and resulting state before depicting it; simplify labels and layout for readability without claiming a capability the product lacks. If the real UI depends on timers, portals, network data, CSS transitions, or interactive hooks, make a frame-driven presentation of the relevant visible states. Avoid shipping real customer data in the film or starter.

The screen is evidence, not decoration. The action should be close enough to understand at playback size. One title or caption can orient a viewer when the UI alone cannot; choose the product's type and voice. Hold text long enough to read at final viewing size. Prefer a short, specific line over several fast lines. A final brand card is useful only when it serves the brief.

## Start a new render project

Copy [`assets/launch`](../skills/video-editor/assets/launch) into a standalone working directory. Install there with `npm ci`, then run `npm run studio`. Replace the demo surface and copy in `src/scene.tsx` with the real product. Keep shot IDs and cuts in `edit.json` aligned with that scene code. `npm run validate` catches duplicate scenes, invalid trims, and example cue frames outside a shown cut. `npm run qc` creates entrance, middle, and exit stills for every scene plus the film's last frame in `out/qc/`; inspect them rather than treating the script's exit code as a visual verdict. `npm run render` writes `out/film.mp4`. The starter is 1920 × 1080, 30 fps; adjust composition dimensions to the delivery brief. Keep output and source media outside Git.

For an existing Remotion project, retain its structure and use its own render command. Produce an `edit.json` with unique scene IDs and source-frame `in`/`out` trims if the soundtrack editor needs scene labels or relative cues. A film without a cut map can still be soundtracked with absolute film-frame cues.

## Motion and edit

Use the frame number as the animation clock. In Remotion, animate from `useCurrentFrame()` and deterministic inputs. Sample motion across several frames; a still at the end of a move does not show whether the move arrived cleanly. The starter uses independent scenes placed on one timeline. Change cut points in `edit.json`, then render again; picture cuts alter the film and require a new soundtrack review.

Give each shot a specific reason to exist: orient, expose the before state, show the action, or prove the result. Remove a shot if its absence leaves the claim equally clear. Match adjacent shots for state, direction, and eye target. A cut may jump in scale or place, but the viewer should still know what to follow. Avoid a long wide shot when the meaningful control is small.

## Review before sound

1. Render one still from every scene, including the beginning and final frame of each scene and the film's last frame. Inspect clipping, empty space, text size, UI fidelity, and the before/after state.
2. Watch the silent film at its intended size. Confirm the viewer can name the action and result without an explanation. Check that no interaction appears before its cause and nothing resets across cuts.
3. Revise the edit and render the final silent MP4. Run `npm run validate` and `npx tsc --noEmit` for the starter. Confirm its duration matches `edit.json` (`sum(out - in) / 30`).
4. Add scene-local cues in `cues.example.json` at the actual frame where an event is visible. Start the bundled sound editor with `--video`, `--edit`, and `--cues`, then follow [METHODOLOGY.md](METHODOLOGY.md) to mix and export.

The final deliverable is the encoded MP4, the saved mix recipe when sound is used, and enough source to make a correction. Play the encoded file through; a preview inside either editor is an editing aid.
