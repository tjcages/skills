# Remotion setup, QC, and render

## 1. Non-negotiables

These break renders rather than merely look bad. Check them before every
render.

1. **Every movement comes from `useCurrentFrame()`.** No CSS transitions, no
   CSS keyframes, no `setTimeout`, no `Math.random()`, no `Date.now()`. Anything
   on wall-clock time renders as flicker, because frames are produced out of
   order and in parallel.
2. **Never render the product's interactive or self-animating components.**
   Portals, spring libraries, and toast timers are wall-clock bound. Run
   `node scan-wallclock.mjs app-pkg/src/components` before importing
   anything: it lists every timer, spring, portal, and CSS animation in the
   tree, so the import-or-rebuild decision is made from a list rather than
   from what you happened to read. The staging skill explains what to do
   with each finding.
3. **One React copy, at runtime and at the type level.** The webpack aliases in
   `../assets/launch/remotion.config.ts` handle the runtime. A linked design system also
   carries its own `@types/react`, and two unrelated React type trees make every
   `ref` in the package fail to assign. The staging skill has the `paths` block
   that fixes the type half. Map `@types/react`, never `node_modules/react`,
   and the `react/*` glob is required rather than optional.
4. **Same exact version for every `remotion` and `@remotion/*` package,** with
   no `^`. Mixed versions fail at startup.

## 2. Scaffold

Work in a standalone directory, outside the product repository. From the installed `video-editor` skill, scaffold it with:

```bash
node scripts/scaffold.mjs /absolute/path/to/product-video
cd /absolute/path/to/product-video
```

The scaffold script copies from `assets/launch/` using this mapping:

| From                       | To                     |
| -------------------------- | ---------------------- |
| `../assets/launch/package.json`      | `package.json`         |
| `../assets/launch/remotion.config.ts`| `remotion.config.ts`   |
| `../assets/launch/tsconfig.json`     | `tsconfig.json`        |
| `../assets/launch/index.ts`          | `src/index.ts`         |
| `../assets/launch/Root.tsx`          | `src/Root.tsx`         |
| `../assets/launch/style.css`         | `src/style.css`        |
| `../assets/launch/camera.ts`         | `src/camera.ts`        |
| `../assets/launch/motion.ts`         | `src/motion.ts`        |
| `../assets/launch/scenes.ts`         | `src/scenes.ts`        |
| `../assets/launch/edit.json`         | `src/edit.json`        |
| `../assets/launch/build.mjs`         | `build.mjs`            |
| `../assets/launch/stage.template.tsx`| `src/stage.tsx`        |
| `../assets/launch/film.template.tsx` | `src/film.tsx`         |
| `../assets/launch/text.ts`           | `src/text.ts`          |
| `../assets/launch/cursors.tsx`       | `src/cursors.tsx`      |
| `../assets/launch/site.ts`           | `src/site.ts`          |
| `../assets/launch/fonts.ts`          | `src/fonts.ts`         |
| `../assets/launch/qc.mjs`            | `qc.mjs`               |
| `../assets/launch/scan-wallclock.mjs`| `scan-wallclock.mjs`   |

`cursors.tsx` is only needed when the film uses the cursor recipe from the
scenes skill, `text.ts` only when the film has on-screen words, `site.ts`
only when the film scrolls a whole site page, and `fonts.ts` only when the
product's face has to be loaded from a file or a CDN; skip them otherwise.
`qc.mjs` and `scan-wallclock.mjs` are always copied. The glyphs also ship as standalone SVGs in
`assets/launch/cursors/`, which stays in the skill rather than being copied. The placeholder stage can trigger QC framing warnings; resolve them after replacing it with the real product.

Then install and boot:

```bash
npm install && npx remotion studio src/index.ts
```

The studio lists **one composition per scene**, not one film. That is the
point: every shot is previewed, QC'd and re-rendered on its own. The template
ships eight scenes of a placeholder product, including a highlight glide and a
switch being operated. If they play, the scaffold is sound and everything
after this is content.

`camera.ts`, `motion.ts` and `scenes.ts` are presets, not decoration. They
carry the zoom tiers, the easing catalogue, the spring configs, the effect
library, the translate solver and the edit validator. Import from them instead
of typing new numbers or new curves; a film reads as one piece only when every
element shares the same physics.

`stage.tsx` owns what the product looks like and exports its geometry.
`film.tsx` owns the shots and imports that geometry, so no camera contains a
hand-guessed coordinate. The staging skill owns the first file, the scenes
skill owns the second.

### Fonts and type scale

Load the font the product actually uses and set both the family and the CSS
variable the design system expects:

```ts
import { loadFont } from '@remotion/google-fonts/Inter'

const { fontFamily } = loadFont()
```

Apply `fontFamily` on the root element and, if the design system reads a
variable such as `--font-sans`, set that to the same value so its utility
classes resolve.

**Skip this entirely if the design system self-hosts its font.** Many ship a
woff2 and an `@font-face` in their own stylesheet, which webpack resolves
through the symlink with no configuration. Loading a Google copy on top of
that gives you a different cut of the same typeface and stomps the variable
the system set. Grep the package for `@font-face` before reaching for
`@remotion/google-fonts`.

**Check the product's root font size.** Many design systems pin something like
`html { font-size: 13px }` and author their whole rem scale against it. Miss
that line and every size in the film is off by the ratio, with no error and no
obvious tell in a still: it just looks subtly wrong. Grep the product's global
stylesheet for `font-size` on `html` or `:root` and copy it into `style.css`.

**Check the stylesheet's plugins and variants too.** If the product's CSS
declares `@plugin` or `@custom-variant`, Tailwind will not generate those
classes in your project unless you declare them as well. Copy any
`@custom-variant` the components depend on, such as a `dark` variant. Plugins
that only add animation utilities are safe to skip, since a deterministic
render cannot use them anyway.

## 3. QC before every render

Stills are cheap and renders are fast, so neither cost is the point. Read
stills because **a whole class of defect is invisible in code**: an element
painting behind another, a ring falling back to near-black, text clipped at
the frame edge, an empty band where content ran out, an entrance that replays
after a cut. None of these throw. All of them are obvious in one PNG.

Start with the script, then read:

```bash
node qc.mjs --wide=<base shots> --flat=<title cards>
```

It renders the in and out frame of every cut into `out/qc/` and checks the
three defects a machine can see: content inside the 60px margin band, an
empty band taller than a third of the frame, and a cut whose two sides are
nearly the same picture. Each warning names the frame to open, and the
script exits 1 until the frame is reframed or the shot is declared as a
whole-panel or title shot on purpose. It catches the obvious, not the taste,
so the stills still get read.

```bash
npx remotion still src/index.ts <scene-id> out/check.png --frame=30
```

Because each scene is its own composition, stills use the scene's own frames
and there is no boundary arithmetic:

```bash
npx remotion still src/index.ts interact out/interact.png --frame=30
```

**Read one still per scene, every time.** Not two, not the ones you expect to
be interesting. Most defects in this medium are invisible in code and obvious
in a PNG, and they hide in the shots you did not think to check.

Always include the **last** frame of the travel scene. An empty band where the
content ran out shows up nowhere else.

The scenes skill lists the framing rule each still must satisfy.

## 4. Render and assemble

Each scene renders to its own clip, trimmed to its cut, and the clips are
joined:

```bash
node build.mjs
```

Under 20 seconds for a 364 frame film at 1080p on a recent laptop. Trimming
happens at render time through Remotion's `--frames`, so cuts are frame
accurate; joining uses ffmpeg's concat demuxer with stream copy, so nothing is
re-encoded.

Two things make the loop fast, and both matter more than the total time:

```bash
node build.mjs travel     # re-render one scene, then re-assemble
node build.mjs --assemble # re-cut without re-rendering anything
```

**Changing a cut point costs nothing.** Edit the `in` and `out` in
`src/edit.json`, run `--assemble`, and watch again. Do this a lot; it is what
editing is.

Clips render muted on purpose. A silent audio track per clip survives the
concat, and each one carries its own encoder priming, which stretches the
joined film past its frame count.

The config renders JPEG intermediates at CRF 16. That is a deliberate speed
and size tradeoff, not lossless.

## Checklist

- [ ] Source decided with the staging skill before scaffolding: codebase, URL, or vignettes
- [ ] Exact matching versions for `remotion` and every `@remotion/*` package
- [ ] React aliases in `remotion.config.ts` and `paths` in `tsconfig.json`
- [ ] `style.css` imported from `src/index.ts` before `registerRoot`
- [ ] Root font size and any `@custom-variant` copied from the product
- [ ] Stage built with the staging skill, not improvised
- [ ] Every movement animated to completion, with handles, and trimmed later
- [ ] Every cut carries momentum, proven by `validateEdit`
- [ ] The feature itself animates, not just the camera onto it
- [ ] At least one scene with `activity: 'interaction'`
- [ ] Every operated control shows a shipped cursor from `cursors.tsx`, one style per film
- [ ] One line per text scene, chained scenes for more, holds proven by `validateReadingHold`
- [ ] Entrance animations only in the scene that introduces the content
- [ ] No CSS transitions, timers, randomness, or wall-clock values anywhere, proven by `scan-wallclock.mjs` on every imported tree
- [ ] Every part the brief names is covered by a shot, proven by `validateCoverage`
- [ ] `node qc.mjs` passes, then one still per scene read before rendering
