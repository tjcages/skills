# Product video scenes and cuts

The stage is built. This is how it is shot and cut.

Two tools, and they are not interchangeable:

- **A move** happens inside one shot. The viewer stays oriented.
- **A cut** replaces the shot. The viewer re-orients, which costs a moment of
  attention and buys pace.

Move to explain. Cut to accelerate.

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

## Easings

Nothing is ever linear, and nothing invents its own curve. Every easing lives
in `camera.ts` as `EASE`, and every one is slow in and slow out to some
degree, because that is what makes motion look like it obeys physics.

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

**Animate the feature, always.** The thing the film exists to show must move
under its own power, not merely be arrived at by the camera. A camera pushing
onto a static element is a photograph with a zoom. Give it an `attention()`
pulse, a `flick()`, a `countUp()`, something. Every other element on screen
should be animated too, but the feature is non-negotiable.

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
| `impact`   | Deliberate discontinuity marking a new beat. Two per film, maximum       |

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

### Two more things a scene declares

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

Momentum makes a cut feel intentional. **Variety is what makes it a cut at
all.**

Two consecutive shots of the same subject at the same image size are a jump
cut: the viewer cannot tell an edit from a dropped frame, and a film made of
them feels random no matter how well the motion carries. This is the single
most common way a product film fails, and it fails silently, because every
individual shot looks fine.

Across every cut, change at least one of:

- **the image size**, by a whole tier, or
- **the subject**, to a different part of the product

Each scene declares `tier` and `subject`, and `validateEdit` throws when
neighbouring shots share both. Reach for a subject change when you can; a
tier change on the same subject is a punch-in, which is legitimate but reads
as emphasis, so it is worth spending on the feature rather than on filler.

The tiers are 1.0, 1.5 and 2.2 precisely so a tier change is visible. Roughly
1.5x is the smallest difference in image size that registers as a different
shot. Tiers closer than that, say 1.8 against 2.0, produce cuts that look
like a rendering glitch, and no amount of momentum rescues them.

Other rules it enforces: clips between 15 and 75 frames, at least one scene
with `activity: 'interaction'`, clip lengths that vary, and a total between 300
and 450 frames.

### Rhythm

Vary the clip lengths, and shorten them as the film approaches its payoff. Equal
lengths read as a slideshow no matter how good each shot is. A useful shape:
open long enough to orient, tighten through the middle, the shortest clips
around the interaction, then a longer resolve that lets the viewer breathe.

### Crossfades

There are none, by design. The bundled ffmpeg has no `xfade` filter, hard cuts
are what fast films are made of, and a dissolve between two shots of the same
interface reads as a mistake. If you genuinely need one, that is a system
ffmpeg and a re-encode, and it is almost never the right call.

## The default shot list

Eight scenes, about twelve seconds. Every scene moves, and every cut carries.

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

**The zoom arc runs inward.** Open at `BASE` so the viewer knows where they
are, then film every following beat closer than the last, and pull back only
once at the very end. **The feature is filmed at `CLOSE` or `MACRO`, never
wider.** A film that stays at `PUSH` throughout is the most common way a product film
ends up dull: everything is visible and nothing is exciting.

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

One interaction per film. It has to be the one that proves the feature, and it
has to be visible at the zoom tier you chose.

Good: a control being operated, a value changing because of it, a list
re-sorting after a filter, a panel resolving to a result. Bad: typing a long
string, anything requiring reading, anything where the change is off-screen,
more than one interaction competing for one scene.

Order matters. The camera arrives, then the element acts. An element that acts
before the camera lands wastes the arrival, which was the setup for it.

**The interaction has to be reachable at the tier you shoot it at.** At `PUSH`
the camera sees 1280px of canvas width, and at `CLOSE` 873px. If the product's chrome and its content
column cannot share a close frame, the interaction cannot live in the chrome.
When the proof genuinely lives in unreachable chrome, put the interaction after
the travel rather than before it.

## The cursor

Product films have no cursor, with one exception: a launch film where a
click, a drag or a typed prompt is itself the interaction. **Whenever a
button or any other control is operated on screen, the click is performed
by a shipped cursor from `cursors.tsx`.** Never an OS screenshot cursor,
never a freshly drawn arrow, and never a press with no pointer at all,
which reads as the interface glitching on its own.

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

## Title cards, for launch films only

A walkthrough film stays wordless. A launch film may spend two or three
large text titles between vignettes. Their recipe, from the product's own
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

Whatever marks the result stays until the final fade. If the payoff travels
1200px, a mark left in the scrolling content is 1200px off-screen by the time
the film ends. Put the proof somewhere that does not scroll: a panel header, a
status pill, a count.

## Ending

Pull back to `BASE`, hold the result, then fade to the canvas colour over the
last 20 frames of the final scene. No title card, no logo, no fade to black.

## Handing off

The shot list and `edit.json` are done. Go back to [video-editor](../SKILL.md), or
read `../SKILL.md` directly, for the still-frame QC loop
and the render. Do not skip the QC pass: one still per scene, plus the last
frame of any travelling scene.
