# Sound design for product films

How to choose, design, and place the small sounds under a product film: the clicks, toggles, swooshes, and chimes the picture's events deserve. The music bed and mixing live in [METHODOLOGY](METHODOLOGY.md); this is about what each cue *is*.

Adapted from [ui-sound-design](https://github.com/dannyjpwilliams/ui-sound-design-skill) by Danny Williams (MIT), a skill for designing sounds that ship inside a UI. Its recipes, vocabulary bridge, category bounds, and synthesis rules carry over almost unchanged. What changes for film is the job: a product's sounds must stay out of the user's way, and a film's sounds must read *over music*, at playback speed, to someone who is not touching anything.

## First: does the product make sounds?

If the product ships its own sounds, those are primary product audio, exactly like primary UI in [fidelity](../skills/video-editor/references/fidelity.md): record or import them, and do not replace them with nicer ones. Design sounds only for what the product leaves silent, and keep them in the product's register.

## Four questions per cue

Ask them for every event before choosing a sound:

1. **What happens on screen?** A press, a toggle, an arrival, a result, a camera move. Name the frame.
2. **What should it feel like?** Satisfying, precise, playful, calm, urgent. One word, shared by the whole film.
3. **How prominent?** A gesture (the user's hand) or a result (what the product did). Results outrank gestures.
4. **Any reference?** A product, a platform, or a file. For a file, run `node analyze-sound.mjs ref.wav` in the editor: its profile names a recipe and parameters to start from.

A vague brief ("add sounds") gets sensible defaults from the recipes. Don't over-ask.

## The sound grammar

A film teaches its viewer what its sounds mean within a few cues, then relies on it:

- **One role, one sound.** Every press sounds like every other press. Cues carry a `role`, and `render-mix.mjs` fails a role that uses two sounds.
- **Direction is meaning.** Up for on, open, add, success; down for off, close, remove, error. A toggle's sweep direction *is* the state.
- **Gestures under results.** The click of a press is quieter than the change it causes. The mixer warns when a gesture cue is louder than a result cue.
- **Sound the contact, not the travel.** A pointer moving to a control is silent; the press is not. Motion gets a sound only when it is the point (a throw, a transition), and then the sound lasts exactly as long as the motion.
- **Space the cues.** Three cues inside 6 frames is clutter. Merge them, or let one carry the moment.
- **Leave the music its hits.** A cue on the drop or a kick disappears. `listen.mjs` flags it; move it a frame or let the music carry that beat.

Role vocabulary: gestures are `hover`, `press`, `release`, `grab`, `type`, `tick`; results are `open`, `close`, `add`, `remove`, `toggle-on`, `toggle-off`, `pick`, `result`, `success`, `error`, `reveal`, `dock`, `impact`, `brand`. Name roles for the action, never for "result" generically: two different results should sound different; two presses should not.

## Categories

| Category | Duration | Character | Film use |
| --- | --- | --- | --- |
| Click | 10-80 ms | Band-passed noise burst | Press and release on controls |
| Toggle | 80-200 ms | Sine sweep; up = on, down = off | Switches, segmented controls, theme changes |
| Hover | 30-80 ms | Faint high sine | Rarely: only when a hover reveals something |
| Pop | 30-80 ms | Sine with a fast pitch drop | Something appears or is picked |
| Success | 200-500 ms | Ascending interval (third; fifth is triumphant) | A completed action, an item added |
| Error | 150-400 ms | Descending, dark, buzzy | A refusal the film deliberately shows |
| Warning | 150-350 ms | Double pulse | A caution state |
| Notification | 200-800 ms | FM bell | Something arrives: a panel, a message |
| Whoosh | as long as the motion | Noise through a sweeping filter; rising toward, falling away | Throws, transitions, push-throughs |

These durations come from product use and hold in film. In-product volume guidance, such as hover at 0.03-0.08 and "barely perceptible", does not: in a film every kept cue must clear the music (see the level report in METHODOLOGY). Prominence is kept *relative*, gestures under results, rather than absolute.

## Vocabulary bridge

Plain words to parameters. `sfx.mjs` applies these as `words`:

| Say | Change |
| --- | --- |
| brighter / darker | frequencies x1.5 / x0.67 |
| warmer | frequencies x0.75, sine wave |
| heavier / lighter | lower and longer / higher and shorter |
| snappier, shorter, crisper | durations x0.6 / x0.7 / x0.6 with a tighter filter |
| longer | durations x1.6 |
| softer / louder | quieter and slightly darker / louder (capped) |
| playful | higher, triangle wave |
| minimal | quieter and shorter |
| retro | square wave |
| triumphant | success interval widens to a fifth |

Refine in small steps: "I like it but..." moves one or two parameters; "completely wrong" means a different recipe.

## Designing sounds: sfx.mjs

```sh
node sfx.mjs sounds.json --out sounds/
```

Each entry names a recipe, optional `params`, `words`, and `frames` (the length from the picture, which wins over any word's timing). Output is 48 kHz mono WAV at -12 dBFS peak, level-matched to the Cuelume bank, plus `sounds/sounds.json` with each sound's measured attack, which `listen.mjs` uses for its timing allowance. Cue a designed sound as `"custom:<name>"` and pass `--sounds sounds/` to `render-mix.mjs` and `listen.mjs`. The visual editor still offers only the Cuelume bank.

The recipes follow the source skill's synthesis rules, which matter whenever you write or review audio code, including a product's own:

- Never `exponentialRampToValueAtTime(0, …)`; ramp to 0.001.
- `setValueAtTime` before every ramp; one captured `now` per sound.
- Stop a source at least 10 ms after its envelope ends.
- Exponential ramps for anything audible; linear only under 50 ms.
- Noise for percussive sounds, oscillators for pitched ones, a filter on both.
- Filter Q under 15; peak gain at or under 0.8.

## Worked example: the Panels film

The dogfood film used 17 stock Cuelume cues. A designed palette with one sound per role put every cue 7-18 dB over the bed, and `listen.mjs` heard all 16 at their frames:

| Role | Sound | From |
| --- | --- | --- |
| press / release | soft click / shorter, lower click | click, `softer` / `softer snappier` |
| pick | playful pop | pop, `playful` |
| toggle-off | falling sweep | toggle, `on: false` |
| add | quick ascending third | success, `snappier` |
| throw | 12-frame heavy whoosh | whoosh, `frames: 12`, `heavier` |
| open | warm bell | notification, `warmer` |

The first attempt at it found three rules now in the tools: designed sounds rendered at -6 dBFS were far hotter than the bank (now -12); sharp clicks under make-up gain overshot true peak (the mixer now pulls gain until true peak clears -1 dBTP); and a whoosh has no transient, so the listening report judges swells by the level they add, not by onset.
