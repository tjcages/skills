# Product video scenes and cuts

The stage is built. This is how it is shot and cut.

Two tools, and they are not interchangeable:

- **A move** happens inside one shot. The viewer stays oriented.
- **A cut** replaces the shot. The viewer re-orients, which costs a moment of
  attention and buys pace.

Move to explain. Cut to accelerate. A launch can use a match cut, color or
shape bridge, or deliberate impact to connect different product capabilities;
it need not travel through one continuous camera move.

## How this is built

**Every scene is its own composition, rendered to its own clip. The film is
assembled afterwards by trimming and joining those clips.**

That is not a technical detail, it is the whole method:

1. **Every movement is animated to completion,** inside a scene that is longer
   than it will be used. Those spare frames are handles.
2. **You watch each clip on its own** before deciding anything about the edit.
3. **The cut point is chosen in `edit.json`,** by trimming. Change your mind
   about a cut and you re-assemble in seconds without re-rendering.

The rule that follows from this, and the one most likely to be broken:

> **Never author a movement to be chopped off. Author it to finish, then trim
> it.**

They are not the same thing. A movement designed to be cut mid-flight has to
skip its slow-out, and motion that never decelerates reads as mechanical and
wrong. A movement that eases properly and is *trimmed* before it lands is
still a complete movement; you simply stop showing it. The pixels differ, and
so does how it feels.

## Editorial motion

The curves below apply to camera, titles, and accessory graphics. Primary UI
uses the product's actual animation and timing; see [fidelity](fidelity.md).
Never use a skill preset to replace a product transition.

| Easing     | Curve                    | Use for                                              |
| ---------- | ------------------------ | ---------------------------------------------------- |
| `standard` | `0.65, 0, 0.35, 1`       | Camera moves. Symmetrical, confident, unhurried ends  |
| `arrive`   | `0.16, 1, 0.3, 1`        | Anything appearing: entrances, reveals, a panel open  |
| `leave`    | `0.7, 0, 0.84, 0`        | Anything exiting frame. Commits early, gone quickly   |
| `glide`    | `0.45, 0, 0.55, 1`       | A highlight or selection moving between two places    |
| `drift`    | `0.33, 0, 0.2, 1`        | Long scroll travel. Near-constant middle, eased ends  |
| `snap`     | `0.4, 0, 0.2, 1`         | Small mechanical moves, such as a toggle knob         |

Springs are different and live in `motion.ts` as `SPRING`. Use a spring when
something should settle physically, an easing when something travels a known
distance in a known time.

| Spring     | Feel                                    | Use for                    |
| ---------- | --------------------------------------- | -------------------------- |
| `entrance` | Barely overshoots                       | Content arriving           |
| `pop`      | Overshoots visibly, settles             | Something landing          |
| `snap`     | Crisp, no bounce                        | A surface opening          |
| `flick`    | Fast and mechanical                     | A control being operated   |

## Effects

Everything in `motion.ts`. Reach for these before writing an `interpolate` by
hand; a film reads as one piece when every element settles with the same
physics.

| Effect          | What it does                                                        |
| --------------- | ------------------------------------------------------------------- |
| `entrance()`    | Rise and fade in, staggered with `staggerDelay()`                    |
| `pop()`         | Overshooting scale, for something that lands                         |
| `snap()`        | Crisp open, for a surface                                            |
| `flick()`       | Fast mechanical throw, for a control being used                      |
| `glide()`       | One element moving continuously between positions, never crossfading |
| `wave()`        | Magnification that travels through a list with a scroll              |
| `attention()`   | A single expanding ring that fades. Once, never looped               |
| `anticipate()`  | A small counter-move before the real move                            |
| `followThrough()` | The same progress, delayed, for secondary elements                 |
| `reveal()`      | A mask wipe, as a percentage for `clip-path`                         |
| `parallax()`    | A fraction of the foreground's travel, for depth                     |
| `countUp()`     | A number counting to its value rather than appearing                 |
| `move()`        | Eased travel between two values. The workhorse                       |
| `ramp()`        | An eased 0 to 1 over a frame range                                   |

### The animation principles that actually apply

Borrowed from character animation, and all of them survive the translation to
interface film:

- **Slow in and slow out.** Every curve above. This is the one that makes
  motion look real, and removing it is what makes a film feel broken.
- **Anticipation.** A few frames of counter-movement before a big camera push
  or a list scroll. `anticipate()`. The eye then reads the main move as
  intended rather than as a jump.
- **Follow through and overlapping action.** Nothing stops at once. When the
  camera settles, let secondary elements settle two or three frames later with
  `followThrough()`. When a list moves, stagger the rows.
- **Arcs.** A camera move that changes both x and y should not travel a
  straight diagonal. Split it into two overlapping moves with different
  durations and the path curves on its own.
- **Exaggeration.** The overshoot in `pop()`. Slightly more than physical is
  what reads as deliberate on screen.
- **Secondary action.** The feature toggles; the header count updates a beat
  later. One primary action, one quiet echo, never two competing.
- **Staging.** One idea per shot. If you cannot say what a shot is about in
  four words, it is two shots.
- **Timing.** Below.

**Show the feature acting.** The thing the film exists to show must change
through its real interaction, not merely be arrived at by the camera. If the
actual UI is static, show its real before/after or the real effect it has.
Do not add a pulse, flick, or count-up to primary UI unless the product has it.
Editorial elements may move around the product when they help the story.

## The cut

`edit.json` is the cut list. Each entry trims one scene and declares how it
relates to the one before it.

```json
{ "scene": "interact", "in": 0, "out": 46, "continuity": "momentum" }
```

| Continuity | Meaning                                                                 |
| ---------- | ----------------------------------------------------------------------- |
| `momentum` | Outgoing is still travelling, incoming is already travelling. The default |
| `match`    | A subject holds the same screen position while the framing changes       |
| `impact`   | Deliberate discontinuity marking a new beat. Two per film, maximum. Still must change the picture |
| `punch`    | Same surface, at least two tiers closer or wider. Emphasis, used rarely  |
| `handoff`  | Invisible cut: outgoing ends on a designed frame the incoming starts from (see Transitions) |

**Momentum is what makes a cut feel purposeful.** One shot is pushing in; the
cut lands, and the next shot is already pushing in, faster. The eye never
stops, so it reads the edit as one continuous intent rather than as two
unrelated pictures stapled together.

`validateEdit` proves it rather than trusting you. Each scene declares the
frame range of its primary movement, and a `momentum` cut must satisfy all
three:

- the outgoing clip's `out` falls **inside** the outgoing scene's motion range
- the incoming clip's `in` falls **inside** the incoming scene's motion range
- the two motions are not exact opposites, because reversing direction across
  a cut reads as a mistake

Trim past the end of a movement and it throws, naming the frame to trim before.
That error is the single most useful thing in this bundle: it is the difference
between a cut that carries and a cut that lands on a corpse.

### What else a scene declares

- **`surface`**: the physical thing on screen (`panel`, `popover`, `page`,
  `title`). Consecutive shots of one surface are one shot reframed; see
  "The cut has to change the picture".
- **`text`**: the line a text scene shows. The edit fails if its cut ends
  before `readingFrames(text)`.
- **`covers`**: the parts of the brief this shot covers, by the brief's own
  names. `validateCoverage(SCENES, cuts, PARTS)` fails when a part named in
  `PARTS` has no shot in the edit. A single-feature film leaves `PARTS`
  empty; a site film lists its pages.
- **`scroll`**: `{ from, to }` in site pixels for every shot that scrolls a
  page. `validateEdit` fails when a shot starts before the previous one
  ended, because a page that scrolls backwards across a cut resets the
  state thread.

### Every shot needs an edge

A frame that contains only body copy looks like an unstyled document, not a
product. This is the most common way a close shot fails, and it fails in a way
that reads as "the styles did not load" even when everything rendered
perfectly.

**Every shot must contain at least one structural edge:** a card boundary, a
panel edge, a table rule, a control, a sidebar. Something with a border, a
surface change or a shape. Prose alone is not a subject, however important the
words are.

Check it on the still: cover the text with your hand. If what is left is a
blank rectangle, reframe, either wider so a container edge enters the frame,
or onto an element rather than a paragraph.

This is also why focus points must be clamped. `inside(point, scale, PANEL)`
in `camera.ts` keeps the visible rectangle within the product, so a subject
near an edge cannot drag backdrop across a third of the shot. Pass every focus
point through it.

### The cut has to change the picture

Momentum makes a cut feel intentional. **A changed picture is what makes it a
cut at all.**

Cutting to a frame that looks basically the same, the same panel on the same
page with a slightly different zoom, is the most common way a product film
feels awkward. The viewer cannot tell an edit from a stutter, and every
individual shot still looks fine. In the Panels dogfood, six of nine cuts were
this, and the old checks passed all six (see `../../../dogfood/`).

Across every cut, the picture must change in one of these ways:

- **A different surface.** Popover instead of panel, title instead of page,
  a card instead of the list it came from.
- **A visibly different state** of the same surface: dark after light, a new
  row, a recoloured field. The change has to read in the first frame.
- **A declared `punch`:** the same surface at least two tiers closer or wider
  (BASE to CLOSE, PUSH to MACRO), used for emphasis, rarely.

A smaller reframe of the same surface is not a cut. **Make it one continuous
camera move inside one scene instead**; if two beats happen on the same
surface, they are one shot. Record them as one take too (see
[staging](staging.md)): a separate take reloads the page and loses UI-only
state, such as an expanded row, which then visibly jumps across the cut.

Three checks enforce this, because it fails silently:

- Declare `surface` on every product scene. `validateEdit` rejects two
  consecutive shots of one surface unless the cut is a `punch` of 2+ tiers
  or a designed `handoff`. Subject names do not help, since renaming the
  same panel "sliders" then "field" passes a subject check.
- `qc.mjs` aligns the frames either side of every cut (`similarity.mjs`
  searches zoom and offset) and warns when the incoming frame is the
  outgoing picture again. Impact cuts are not exempt.
- You read the in and out stills side by side. Cover the labels: if the two
  thumbnails are the same shape, it is the same shot.

### Rhythm: snappy by default

Vary the clip lengths, and shorten them as the film approaches its payoff.
Equal lengths read as a slideshow no matter how good each shot is.

Dead air is the other pacing failure: a pointer drifting toward a control, a
settled result held a beat too long. Defaults that keep a launch snappy:

| Moment | Frames at 30 fps |
| --- | --- |
| Pointer arriving at a control | 10-12 (record it entering near the target) |
| Arrival to press | 2-4 |
| Result hold before the cut | 12-20 |
| Product clip in a launch | 30-60 |
| Breadth montage glimpse | 8-14 |
| Title card | its `readingFrames()` and no more |

Trim each clip in to just before the action starts and out as soon as the
result has read. When a recorded take has a long approach, speed the camera
and trim; do not play the approach. A launch that runs past 25 s usually has
dead air, not too many features.

### Transitions

Most cuts should be straight cuts that change the picture and carry motion.
When a beat deserves a designed transition, it has to come out of the
product: the colour that floods is the theme the user just picked, the wipe
runs the way the slider moved, the element that grows is the one that was
clicked. A generic dissolve or slide between unrelated screens gives the
viewer no reason to follow.

Scenes render as separate clips joined by concatenation, so nothing overlaps
across a cut. A designed transition is therefore a **handoff**: the outgoing
scene ends on a shared frame and the incoming scene starts from exactly that
frame, and the edit marks the cut `continuity: 'handoff'`. `transitions.ts`
has frame-driven pieces for the common ones:

| Transition | Built from | Use when |
| --- | --- | --- |
| State flood | `flood()` grows the new theme or accent colour from the clicked control | A toggle changes the whole look; the next scene starts on that colour |
| Directional wipe | `wipe()` in the gesture's direction | A before/after of the same surface, inside one scene |
| Push through | `pushThrough()` scales the camera into a swatch or card until it fills the frame | The next scene is about what that element contains |
| Element carry | An element ends at a fixed position; the next scene starts with it there | The same object moves to a new context, such as a pin to its row |

Keep a film to two or three designed transitions. More turns the product
into a showreel of effects.

## Focused-demo starter

The eight-scene scaffold illustrates camera and cut mechanics for a focused
demo. Replace its story and stage for the actual product. A launch needs a
feature inventory and its own shot list; do not preserve these eight subjects
just because the scaffold ships them.

| Scene       | Motion        | What happens                                 |
| ----------- | ------------- | -------------------------------------------- |
| `establish` | `push-in`     | Content lands while the camera creeps in     |
| `sidebar`   | `push-in`     | The push continues onto the sidebar          |
| `list`      | `travel-down` | A selection glides toward the feature        |
| `feature`   | `push-in`     | The camera arrives on the feature            |
| `interact`  | `settle`      | The control is operated, the result pulses   |
| `proof`     | `settle`      | The header shows what just changed, held     |
| `travel`    | `travel-up`   | The result travels through the content       |
| `resolve`   | `pull-out`    | Pull back over the held proof, then fade     |

## Zoom, and why it is mostly close

Four tiers only, and these exact numbers, from `camera.ts`:

| Tier    | Scale | Visible canvas | Films                         |
| ------- | ----- | -------------- | ----------------------------- |
| `BASE`  | 1.0   | 1920 x 1080    | The whole app. Once, at the start |
| `PUSH`  | 1.5   | 1280 x 720     | A region: a list, a panel, a sidebar |
| `CLOSE` | 2.2   | 873 x 491      | A component: a card, a row     |
| `MACRO` | 3.3   | 582 x 327      | A control: a toggle, a field, a value |

For a focused demo, an inward zoom arc can orient once, move toward the
interaction, and pull back for its result. A launch can alternate isolated
components, wide visual outcomes, and titles. Film small interactions close
enough to read. If every shot stays at one scale, the edit will feel flat.

At `MACRO` a single control fills the screen. That shot is where a film stops
looking like a screen recording. If you never reach `MACRO`, you have almost
certainly shot the whole film too wide.

Design the stage against those rectangles. They are the only numbers that
matter when deciding how wide a component may be.

Most of the film is closer than feels comfortable while editing. A product
interface at full width is unreadable at typical playback size and the viewer
cannot tell what changed. Being close is what makes a small interaction
legible.

**`BASE` is an establish shot, not a legibility shot.** At `BASE` the product's
body text is genuinely small in a 1920 frame, and that is fine: the shot exists
to say where you are. Check every legibility question on a `CLOSE` or `PUSH`
still instead.

`BASE` is bounded by geometry rather than taste. The panel times `BASE`, plus
its shadow falloff, has to leave an even canvas border on all four sides. With
the default 1520x880 panel in a 1920x1080 canvas, anything above 1.0 clips the
panel's rounded corners.

**Frame shots on real coordinates.** `stage.tsx` exports `rowCentre()` and the
panel geometry; `camera.ts` exports `frameOn(point, tier)`. Never hand-write a
focus coordinate, and never reuse one tier's translate at another scale, which
puts the subject where neither shot intended.

## Move speed

26 to 34 frames per zoom or translate segment, about one second. Longer reads
as sluggish. The closing pull-back may run to 42 frames because it plays over
the resolve.

**No motion blur on any transition.** Blur reads as smear, not speed. Speed
comes from short durations, the easings above, and the cuts. Material blur is
different: a glass surface's `backdropFilter` is a surface treatment and stays.

## The interaction

Give each selected feature a legible interaction and result. A focused demo
may need only one; a launch usually needs several distinct feature proofs.

Good: a control being operated, a value changing because of it, a list
re-sorting after a filter, a panel resolving to a result. Avoid a change that
lands off-screen or multiple interactions competing within one short shot.

Order matters. The camera arrives, then the element acts. An element that acts
before the camera lands wastes the arrival, which was the setup for it.

**The interaction has to be reachable at the tier you shoot it at.** At `PUSH`
the camera sees 1280px of canvas width, and at `CLOSE` 873px. If the product's chrome and its content
column cannot share a close frame, the interaction cannot live in the chrome.
When the proof genuinely lives in unreachable chrome, put the interaction after
the travel rather than before it.

## The cursor

When the pointer explains a real click or drag, show it. In a captured product
interaction, keep the recorded cursor when useful. In a rendered scene, the
bundled `cursors.tsx` provides optional editorial pointers. The cursor or
press effect must not change the product's actual response.

### Two styles, chosen by what the film needs

`cursors.tsx` ships one `Cursor` component with two styles of glyph, and
the choice is binary:

- **The soft cursor, `kind="soft"` and the default, when one cursor does
  one thing.** A single arc-in and a click is most films' entire pointer
  budget, and the soft glyph's heavier white outline reads bolder at
  `CLOSE` and `MACRO` than a native arrow.
- **The native set when the cursor itself changes state.** A drag that
  needs `grab` becoming `grabbing`, a caret entering text (`text`), a
  panel edge being pulled (the `resize-*` family), a zoomable canvas
  (`zoom-in`). State changes are what the native cursors are for; the
  soft glyph has no states.

Never mix the two styles in one film: the soft cursor next to a native
hand reads as two different products.

### One box, positioned by centre

Every glyph, soft and native, is normalised into the same centred 32 unit
box at matching glyph scale, so **switching `kind` mid-film never
jumps**: `grab` becomes `grabbing` on the grab frame with no reposition.
The component is positioned by its centre. For the arrow glyphs,
`CURSOR_TIP` carries the centre-to-tip offset; subtract it, scaled by
`size / CURSOR_BOX`, when a click must land tip-exact on a small control.

Kinds: `soft`, `default`, `pointer`, `grab`, `grabbing`, `text`,
`crosshair`, `move`, `context-menu`, `zoom-in`, `zoom-out`, and the
`resize-*` family. The same glyphs ship as standalone files in
`assets/launch/cursors/` for anything outside a composition, such as a poster
frame. That folder also carries `wait.svg`, the beachball, deliberately
absent from the component: a spinning wait cursor in a product film is
an argument against the product.

### Moving and pressing

- **The white outline is baked into every glyph**; the component adds
  only the soft cast shadow, so each kind reads on any surface, light or
  dark.
- **Arrive on an arc from off-frame.** Two overlapping moves, x on
  `standard` and y on `arrive`, offset by a few frames, curve the path
  without a hand-drawn spline.
- **The press is a mirrored dip.** `press` to 1 over two frames, the
  target to about 0.9 with it, both released on `arrive`. The camera
  holds still through the press; the dip is the event.
- **The cursor changes state on the frame the state changes.** `grab`
  flips to `grabbing` on the first drag frame and back on release;
  `text` appears when the caret does. A cursor that changes early reads
  as prescient, late as broken.

## Title cards

A demo may use a brief title if it helps orient the viewer. A launch may use
short titles between vignettes. Their recipe, from the product's own
face and the word-by-word rise to the reading-time maths that decides how
long each one holds, lives in [text.md](text.md), or read
`text.md` directly. Load it before writing any
on-screen words: a title cut away before it can be read is worse than no
title, and `validateEdit` cannot catch that for you.

## Framing rules

Every frame where the camera settles must stand alone as a still.

| Tier    | Rule                                                                                                                                                                   |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BASE`  | The whole panel plus its shadow falloff is in frame, with even canvas border on all four sides. Never crop the panel's rounded corners.                                   |
| `CLOSE` | Frame the content, not the panel. The subject fills the middle two thirds of the width, with at least 60px clearance between anything that must read and the frame edge. |
| `PUSH`  | The target sits in the centre third, with at least one neighbouring element visible on each side so the viewer keeps orientation.                                        |

Never cut a line of text or an interactive control at the frame edge. A clipped
focus ring is the single most common review catch.

## Hold the proof, in the chrome

Hold the real result long enough to read. If it scrolls away, adjust the shot
or cut sooner. Do not move or add a product status marker solely to manufacture
a persistent payoff.

## Ending

Hold a real product result or a deliberate brand moment long enough to read.
Choose the ending to fit the story; do not require a pull-back or add a result
marker that is absent from the product.

## Handing off

The shot list and `edit.json` are done. Go back to [video-editor](../SKILL.md), or
read `../SKILL.md` directly, for the still-frame QC loop
and the render. Do not skip the QC pass: one still per scene, plus the last
frame of any travelling scene.
