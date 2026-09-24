# Product video story

Read this before the staging skill, before a line of JSX, before opening the
product. Everything downstream is cheaper when this is decided.

## A film is an argument, not a tour

A product film makes exactly **one claim** and shows exactly **one proof**.

> Claim: _this product does X for you._
> Proof: _here is X happening._

Write both as single sentences before building anything. If the claim needs
two sentences, it is two films. If you cannot write the proof as something
visible on a screen, the brief is not ready and no camera work will save it.

The test that matters, applied at the end: **a viewer who has never seen the
product should be able to say what changed and why it is good.** Not what the
product is, not what else it does. One change, one reason.

## Two shapes of brief

The rules above are written for a **feature film**: one screen, one change,
one proof. A brief can also ask for a **site or portfolio film**: "highlight
the main parts of this site", "introduce this product", "show what this
person does". The claim is then the person or the product, and the proof is
the parts themselves, so the beats may span pages and the film may travel.

The one rule that changes is coverage. In a feature film, everything the
claim does not touch is cut. In a site film, **every part the brief names
gets a beat**, and cutting one is a decision written down, not an omission.
Name the parts in `PARTS` in `film.tsx` exactly as the brief does, mark each
shot with `covers`, and `validateCoverage` fails the edit when a named part
has no shot. Simplify inside each part as hard as ever; do not simplify the
brief.

Everything else holds: one thread of state, the zoom arc inward with one
pull-back, an interaction filmed close, and a film that is an argument for
the person or product rather than a tour of their pages.

## The four beats

Every product film is the same shape. It is a very old shape and it works.

| Beat            | Question it answers            | Roughly |
| --------------- | ------------------------------ | ------- |
| **Context**     | Where am I, and what is this?  | 15%     |
| **Tension**     | What is the problem, right now? | 20%    |
| **Action**      | What does someone do about it? | 40%     |
| **Consequence** | What is different now?         | 25%     |

- **Context** orients. The whole product, once, so the viewer has a place to
  stand. Never longer than it needs to be, and never twice.
- **Tension** is the beat most films skip, and skipping it is why they feel
  like a feature list. Show the state that needs changing: the unresolved
  item, the empty field, the stale number, the thing in the wrong place. The
  viewer must want something to happen before something happens.
- **Action** is the interaction, filmed close. This is most of the film.
- **Consequence** is the proof, held. Something on screen is now different and
  stays different.

Map beats onto scenes when you write the shot list. A beat can be two shots; a
shot can never be two beats.

## Continuity: one thread, not eight postcards

A film feels random when each shot is a nice picture of something unrelated.
It feels continuous when **every shot inherits from the one before it**.

Three threads run through the whole film and none of them may break:

1. **State.** The product is in one continuous state. If a value changed in
   shot four, it stays changed in shots five to eight. Nothing resets. Nothing
   reverts to a fresh page.
2. **Attention.** Each shot is about the thing the previous shot pointed at,
   or about the thing it just produced. The viewer's eye is led, never teleported.
3. **Direction.** The film moves inward. See the zoom arc below.

Before writing the shot list, say each scene out loud as a sentence beginning
with "and then". If a scene does not follow from the one before it, it is in
the wrong place, or it should not exist.

## The zoom arc: start wide, end enormous

Product films are almost always shot too wide, and a wide shot of an interface
is unreadable and unexciting. The arc that works:

1. **Open at `BASE`.** The whole app in frame, once, so the viewer knows where
   they are. This is the only wide shot in the film.
2. **Work inward, and keep going.** Each beat is filmed closer than the one
   before it. `PUSH` for a region, `CLOSE` for a component, `MACRO` for the
   control itself.
3. **The feature is filmed at `CLOSE` or `MACRO`, never wider.** At `MACRO` the
   camera sees 582px of canvas, so a single toggle, field or row fills the
   screen. That is the shot that makes a film feel expensive.
4. **Pull back once, at the end,** to place the consequence back in the
   product.

The instinct to stay wide "so the viewer sees the context" is wrong. Context
was beat one. Everything after it should be uncomfortably close while editing;
it will look right at playback size.

## Simplify. Do not reproduce

**This is the most important rule in the bundle, and the one most often broken.**

Build only what the claim needs, and build it simpler than the real product.

An agent handed a real codebase will try to reproduce the product faithfully,
because that feels like the careful, honest thing to do. It is the wrong
instinct. A faithful reproduction is dense, full of controls the story does
not use, and illegible at the tiers that make a film exciting. **You are making
an argument, not a screenshot.**

What this means in practice:

- **Include only what the claim touches.** If the film is about one toggle in
  one row, you need that row, enough neighbours to prove it is a list, and the
  chrome that identifies the app. Nothing else. Delete the second sidebar
  section, the filter bar, the breadcrumbs, the status footer.
- **Reduce density hard.** Fewer rows, fewer columns, fewer badges, shorter
  copy. Real products are dense because people use them for hours. A viewer
  has twelve seconds.
- **Shorten every string.** Real labels and real body copy are too long to read
  at speed. Keep the vocabulary and the tone; cut the length. Domain words,
  short sentences.
- **You may change the product.** Move a control somewhere it reads better,
  give an element more breathing room, drop a column, simplify a layout that
  was designed for density. Small, honest changes in service of legibility are
  correct. The film shows what the product *does*, not where every pixel sits.
- **Never invent capability.** Simplification is allowed; fiction is not. Do
  not show a feature that does not exist, a result the product cannot produce,
  or a speed it cannot achieve.

The line is: **simplify the presentation, never the truth.**

If a reviewer says "that is not quite what our screen looks like", that is
usually fine and sometimes the point. If they say "it does not do that", start
again.

### When the product is only a URL

There is no framing, embedding or screenshotting a live site into the film.
**Recreate the relevant surface**, using the same rules as everything else.

Look at the site, take what you need, and rebuild the one screen the claim
needs in plain JSX and Tailwind: the layout, the type hierarchy, the spacing
rhythm, the colours as literal values. There is no design system to import and
no tokens to resolve, and that is fine. You are rebuilding one simplified
screen, not the site.

Everything above still applies, and applies harder: fewer elements, shorter
copy, and only what the claim needs.

## What to cut

Cut anything that is true but not load-bearing:

- A second feature, however good.
- Navigation the story never uses.
- An empty state, unless the empty state *is* the tension.
- Any shot you cannot describe in four words.
- Any shot the viewer would still understand the film without.

The last one is the sharpest test. Apply it to every scene before rendering.

## Handing off

The story is done when you can write these five lines:

```
Claim:       ...
Proof:       ...
Context:     ...
Tension:     ...
Consequence: ...
```

Take them to [staging.md](staging.md), or read
`staging.md` directly. They decide what gets
built, and that decision is the one that costs the most to get wrong.
