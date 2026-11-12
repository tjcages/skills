# Product video text

Words on screen are spent, not decorated. A focused demo may stay wordless;
a launch film may use brief title cards between feature proofs. This skill
owns every word that does appear: the face it is set in, how it enters, and
above all how long it holds, because text that is cut away mid-read is worse
than no text at all.

## The face comes from the product

Text in the film is set in the product's own typeface, never a stand-in.
The root [video-editor](../SKILL.md) skill's font section owns the wiring; the rules
that matter for text are:

- **Grep the design system for `@font-face` first.** A self-hosted woff2
  resolves through the symlink with no configuration, and loading a Google
  copy on top of it gives you a different cut of the same face.
- Only when nothing is self-hosted, load the family with
  `@remotion/google-fonts` and set both `fontFamily` and the CSS variable
  the design system expects, such as `--font-sans`.
- **Copy the product's root font size** into `style.css`. A product pinned
  to `html { font-size: 13px }` sets every rem-based text size in the film
  off by the ratio, silently.
- **Set display text at the type scale's largest step and zoom the camera**
  to about 1.3 instead of inventing a bigger font size. Text scenes share
  the film's camera system or they read as slides pasted in.

## The copy: one idea, on point

Give each title card one idea, concise enough to read at playback speed.
Two to five words is a useful starting point. A line break can improve the
composition; a second sentence or explanatory caption should earn its own
reading time. Remove persistent labels that repeat the product name or narrate
an action the UI already shows.

## The treatment

Word-by-word rise is the default treatment, not the law. **Design one
treatment for the film**, and spend a moment actually designing it: the
right treatment echoes what the film is about. Some that work, all built
from the presets:

| Treatment       | Built from                                                   |
| --------------- | ------------------------------------------------------------ |
| Word rise       | Rise and fade per word, `arrive` or `entrance`, `staggerDelay()` |
| Mask reveal     | The line wipes in with `reveal()`, as if drawn                |
| Blur clear      | Words rise while a small blur resolves to sharp               |
| Directional glide | The line glides in from one side, `followThrough()` on a detail |
| Counted claim   | `countUp()` lands a number while the words rise around it     |
| Scale settle    | The line lands with the `entrance` spring, barely overshooting |

Invent beyond the table freely, within the rules that keep it a product
film:

- Every frame of it comes from `useCurrentFrame()` through the presets.
  No CSS animation, ever.
- The entrance finishes inside the entering budget that `readingFrames()`
  assumes, `words * 3 + 12` frames, so the hold maths stays true. A
  slower entrance is not more elegant, it is unreadable for longer.
- **One reading treatment per film.** Every line the viewer must read
  uses it; variety lives across films, not within one. A `typography`
  section of the reel may go further (type that slams, stacks, or becomes
  the layout), as long as each line still gets its reading hold.
- Keep the frame alive through type, product elements, or a deliberate camera
  move. A repeated slow zoom is not a treatment by itself.
- Entrances happen once, in the scene that introduces the line, as
  everywhere else in the bundle.

## Reading time, the rule this skill exists for

A viewer reads on-screen text at roughly three words per second, and only
after the last word has finished entering. Cutting before that leaves the
viewer mid-word, and it is the single most common way text fails in a
product film: every still looks perfect, and the film feels rushed.

`text.ts` carries the maths. `readingFrames(text, fps)` returns the frames
a line must hold from its first entrance frame:

```
entering = words * STAGGER_FRAMES + READING_SETTLE_FRAMES
reading  = ceil(words / READING_WORDS_PER_SECOND * fps), floor 45 frames
hold     = entering + reading
```

At 30fps:

| Line                          | Words | Hold        |
| ----------------------------- | ----- | ----------- |
| `Ship films, not screenshots` | 4     | 69 frames   |
| A two word title              | 2     | 63 frames   |
| An eight word supporting line | 8     | 116 frames  |

The rules that follow:

- **A scene with text is at least `readingFrames()` long, plus handles.**
  Author the scene longer and trim, as with every movement in the bundle.
- **The cut may not land before the hold expires, and `validateEdit`
  proves it.** Put the line in the scene's `text` field; the edit fails
  with the frame count the line actually needs. (`validateReadingHold()`
  remains for text that is not a scene's single line.) Do not cut text on
  feel.
- **Exits wait for the hold too.** A line that starts leaving while the
  viewer is still reading is the same failure with extra motion.

When a title feels like it drags at its computed hold, the title has too
many words. Shorten the line rather than the hold.

## More words means more scenes

When the message genuinely needs more than one line, do not stack lines
and do not stretch one scene. **Chain text scenes behind one another**,
one line each, cut together like every other pair of shots:

- Each scene in the chain holds its own `readingFrames()` and passes its
  own `validateReadingHold()`. The maths never spans scenes.
- All scenes in the chain share the film's one treatment, and each
  carries its own zoom drift, so every cut in the chain lands on moving
  picture and reads as one thought continuing.
- Two or three lines chain well. A chain of four is a paragraph read
  aloud; cut the copy instead.
- A chained line answers the one before it, the way vignettes answer each
  other: claim, then consequence.

## Title cards

- **Two to five words, sentence case, benefit-led.** A title is a claim
  about what the viewer gains, never a chapter heading.
- One idea per title. A film that needs a fourth title has vignettes that
  are not carrying the story.
- Two or three per film, in launch films only. Walkthrough films make
  their argument with the product, not with copy.

## Handing off

Text scenes are scenes: they take their place in `edit.json`, cut with
momentum, and pass the still QC like every other shot. Go back to
[scenes.md](scenes.md) for the cut rules, or [video-editor](../SKILL.md) for the QC
loop and the render, or read `scenes.md` and
`../SKILL.md` directly.
