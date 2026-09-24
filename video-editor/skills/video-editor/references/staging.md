# Product video staging

Everything the camera films. The story skill has already decided the claim,
the proof and the four beats. This skill builds only what those need.

## Before anything: build less than you think

The story skill's simplification rule is the one that decides whether this
works, so it is repeated here in the file where it gets broken:

> **You are making an argument, not a screenshot.** Build only what the claim
> touches, simpler and sparser than the real product, with shorter copy.
> Changing the product to read better is correct. Inventing capability is not.

A faithful reproduction of a dense product is illegible at the tiers that make
a film exciting, and it costs three times as long to build. If you find
yourself porting a fourth component that the claim never mentions, stop.

## Where the product comes from

| Situation                                    | What you do                          |
| -------------------------------------------- | ------------------------------------ |
| You have the codebase and can import from it  | Use its real components and tokens   |
| You have only a URL, or a build you cannot run | Rebuild the one screen the claim needs |
| The film announces a tool, a skill or a capability | Film component vignettes: Part 3 |

In every case nothing is embedded, framed or screenshotted into the film: a
product film is rendered, deterministically, from components you control.

## Part 1: filming from a codebase

### 1. Find the real UI

Do not guess class names or colours. Read the source. Answer these in order
before writing any JSX:

| What                                       | How to find it                                                                                        |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| **Where the shared components live**       | Look for `components/ui`, `packages/ui`, `design-system`, or a `cva(` call. In most repos this is a folder inside the app, not a package |
| **How the app imports them**               | Open a file that uses one and read its import. `@/components/ui/button` means one app; `@scope/ui` or `@ui/...` means a separate tree     |
| **How much of the feature is renderable**  | Grep the feature's own files for `useContext`, `useQuery`, `atom`, `zustand`, `Provider`, `createPortal`. A 1,500 line component wired to four contexts cannot be imported, and finding that out early changes the whole plan |
| The package or app's own docs              | `AGENTS.md`, `CLAUDE.md`, `README.md` near the components, before the source                             |
| **The Tailwind entry**                     | The `globals.css` or `app.css` that has `@import 'tailwindcss'`. Carries the root font size, `@theme`, `@plugin`, `@custom-variant`       |
| Colour tokens                              | Usually in that same file under `@theme` or `:root`. In a monorepo, a `styles/` folder in the package    |
| Spacing and elevation                      | Grep `--spacing` and `shadow-` in the same stylesheet                                                    |
| Icons                                      | Read the feature file's imports, and check for a repo policy banning direct icon imports                 |
| Domain copy                                | The feature's own strings, plus any `PRD.md`, `README` or fixture files. Real vocabulary, shortened      |

Row three is the one that decides your plan, and it is worth doing before you
get attached to reusing anything. If the feature's components are wired to
application state, **rebuild a simplified version** rather than fighting it.
That is the expected outcome, not a failure.

**The root font size is often not beside the tokens.** A repo may pin
`html { font-size: 13px }` in the app's Tailwind entry while the rem scale
lives elsewhere. Miss it and every size in the film is off by the ratio, with
no error and no obvious tell.

### 2. Wire it up

Two shapes. The import you read in step 1 tells you which.

#### Shape 1: one app, components inside it

**This is the common case.** A Next.js or Vite app with shadcn-style
components in `components/ui`, Tailwind and tokens in `app/globals.css`, and
no separate package anywhere.

```bash
npm install
ln -sfn /abs/path/to/product app-pkg
```

```ts
// remotion.config.ts, inside the existing alias block
'@': path.resolve('app-pkg/src'),        // or 'app-pkg' if the app has no src/
```

```jsonc
// tsconfig.json
"baseUrl": ".",
"paths": {
  "@/*": ["app-pkg/src/*"],
  "react": ["node_modules/@types/react"],
  "react/*": ["node_modules/@types/react/*"],
  "react-dom": ["node_modules/@types/react-dom"],
  "react-dom/*": ["node_modules/@types/react-dom/*"]
}
```

```css
/* style.css */
@import 'tailwindcss';
@import '../app-pkg/src/app/globals.css';
@source '/abs/path/to/product/src';
```

Match the alias to whatever the app actually uses. Most use `@/`, some use
`~/`, some use relative imports only, in which case there is no alias to
declare and you import through the symlink path directly.

#### Shape 2: a separate package

A monorepo where components live in their own tree and the app imports them by
name or through a path alias.

```bash
ln -sfn /abs/path/to/product/packages/ui ui-pkg
```

Declare the same alias the app uses in `remotion.config.ts`, `tsconfig.json`
`paths`, and `@source` in `style.css`. If the app also has its own components
you need, symlink and alias that tree too; two aliases is normal.

The package's stylesheet is often **not** an export but an internal path such
as `src/styles/index.css`. Import the file that actually declares the tokens.

#### Both shapes

- **Map React to `@types/react`, never `node_modules/react`.** Mapping the
  runtime JS makes every file fail with "could not find a declaration file for
  module 'react'" and takes `JSX.IntrinsicElements` with it. The `react/*` glob
  is required; without it `react/jsx-runtime` stays split and the JSX
  intrinsics mismatch.
- **Copy the Tailwind entry's plugins and variants.** `@plugin
  "@tailwindcss/typography"` and friends have to be installed in the video
  project too, not just declared. A `@custom-variant dark` the components are
  authored against must be copied or half their classes never generate.
- **Watch for spaces in absolute paths.** `@source` with an unescaped space
  silently matches nothing, and the film renders unstyled with no error.
- **Symlinks make the project non-portable.** It only builds on a machine with
  the product checked out at that path. Keep the video project as a sibling
  directory and do not commit it into the product repo.
- **Load the product's face before the first frame.** `fonts.ts` wraps
  `@remotion/fonts` so a render waits for the files; pass the self-hosted
  woff2 through the symlink, or the CDN URL when the CDN allows any origin.
  A frame captured in a fallback face is a defect the still QC cannot see.

### 3. Import, or rebuild

**Scan first, then read.** `node scan-wallclock.mjs app-pkg/src/components`
lists every animation library import, spring, timer, clock read, portal,
CSS animation, and app-state hook in the tree, file by file. Treat the list
as the set of decisions to make: each finding is inert in the fixed state
the film needs, or it is ported to `useCurrentFrame()`, or the component is
rebuilt. The table of equivalents for a port:

| In the product                       | In the film                                   |
| ------------------------------------ | --------------------------------------------- |
| Motion `useSpring`, `animate` spring | `spring()` from `motion.ts` with a `SPRING`   |
| Motion keyframes, `animate` tween    | `move()` or `ramp()` with an `EASE`           |
| CSS transition or `@keyframes`       | `interpolate` over a frame range              |
| `useMotionValue` progress            | a number derived from the frame               |
| `setTimeout`, `setInterval`          | a frame offset                                |
| `Math.random`, `Date.now`            | a constant, chosen once                       |

**Read the component before importing it.** Category is not a reliable signal:

- A `Button` that wraps itself in a tooltip when icon-sized is a portal, and
  portals are not deterministic. Some have an escape hatch such as
  `tooltip={false}`, which is worth looking for before giving up on the real
  component.
- A status dot rendering `animate-ping` is a CSS keyframe on wall-clock time
  and will flicker between frames.

Import directly when the component is inert in a fixed state. **Rebuild a
simplified version** when it portals, subscribes, holds state across frames,
carries an `animate-` class, or is simply too dense for the frame.

`transition-*` alone is not a reason to rebuild. A CSS transition only fires
when a property changes, and in a deterministic render nothing changes, so it
is inert. Design systems put `transition-colors` on nearly every interactive
primitive; treating that as disqualifying means rebuilding the whole library.

Reading the component also catches its **API**: a ring that wants `0` to `1`
and is handed `72` renders full, silently.

### 4. Compose the stage

- Real domain vocabulary, shortened. `Item 1` and `lorem ipsum` read as a
  prototype instantly; so does a paragraph nobody can finish in one second.
- **Size the content to the tier that films it.** A `CLOSE` frame is 873px
  wide and a `MACRO` frame is 582px. A subject should fill roughly three
  quarters of its frame. The web instinct of a 640px column leaves a close
  shot two-thirds empty.
- **Make every height explicit.** Variable-height content cannot be framed,
  because the camera needs a coordinate. Fixed row heights, fixed card
  heights, computed positions. This is the single most useful constraint when
  the content is a transcript, a feed or anything else that grows.
- Build depth only where the story travels through it, and remember that a
  scroll inside a panel that also has a header and a composer travels less
  than the content height suggests: it is content minus the visible region,
  not content minus the panel.
- Show the product mid-use. States with history read as real.
- Stagger entrances around the feature, not from index zero. A three frame
  stagger across twenty six items puts the last one 78 frames in, past the end
  of the scene.

### 5. Fit every subject to its frame

Checked **before** anything is shot.

| Tier    | Scale | Visible canvas |
| ------- | ----- | -------------- |
| `BASE`  | 1.0   | 1920 x 1080    |
| `PUSH`  | 1.5   | 1280 x 720     |
| `CLOSE` | 2.2   | 873 x 491      |
| `MACRO` | 3.3   | 582 x 327      |

`visibleRect(scale)` returns these. For every subject the shot list names,
check its bounding box against the tier that films it, with 60px of clearance.

Failures and their fixes, in order:

1. **Resize the component to the frame.** Too wide and a close frame cuts its
   text in half; too narrow and the shot is mostly empty surface.
2. **Move it into the region the camera can reach.** Chrome pinned to a panel
   edge is outside every close frame by definition.
3. **Film it wider.** Last resort: the close tiers are where the film gets its
   energy.

Three symptoms that all mean this step was skipped: text cut mid-word at the
frame edge, half a card in frame, and a large empty area on one side.

**The panel and the tiers must be compatible.** A `PUSH` frame is 720 tall. If
the panel's inner region between header and footer is shorter than that, every
`PUSH` shot will cut some chrome. Either make the panel taller, or accept and
plan which edge gets cut.

### 6. Compose the canvas

- Flat background in a colour one step away from the product's own surface. If
  the product's canvas and the panel are the same colour, the panel edge
  vanishes; pick a third level and treat it as chrome.
- The panel is narrower than the canvas, for example 1520x880 centred in
  1920x1080. Rounded corners, `overflow: hidden`, layered shadow.
- **The panel is the whole app window** when the app puts its own chrome on
  its page canvas.
- Absolutely positioned siblings paint in DOM order. A `z-50` copied from a
  component's recipe does nothing when the wrapper you positioned has no
  `z-index`.
- The spacing scale may not be the default. `--spacing: 3px` makes `p-4` twelve
  pixels. Do structural layout in explicit pixels and let components carry
  their own classes.

### 7. Filming a whole site page

When the brief is a site rather than a feature, the stage is the page
itself, and it has to scroll. Three numbers and one helper keep it honest:

- **Lay the page out at 1216 x 704 site pixels and scale it 1.25x into the
  1520 x 880 panel.** `siteViewport()` in `site.ts` carries both. At its real
  size the site's 14px body and 12px mark cannot carry a 1080p frame even at
  MACRO; at 1216 wide the site's own CSS still lays out as a desktop page,
  and 1.25x makes the close tiers legible without touching a proportion.
- **Model sticky chrome, do not pin it.** `stickyTop()` gives a sticky
  element's viewport position at any scroll: it scrolls with the page until
  its offset, holds, and leaves with its container, exactly as the browser
  does. A pinned nav in a scrolling page is the tell of a fake.
- **Derive every scroll from geometry.** `scrollTo()` returns the offset
  that centres an element; `maxScroll()` stops the page at its end. Declare
  each scrolling shot's `scroll: { from, to }` on its scene, and
  `validateEdit` proves the page only ever moves forward across cuts.
- **Frame with `sitePoint()`**, which turns site pixels at a scroll offset
  into canvas coordinates, so `frameOn` never sees a hand-typed number.

The simplification rule still applies inside every part: fewer blocks per
section, shorter copy, only the assets the claim needs. Two blocks per
project instead of six is the usual cut.

## Part 2: rebuilding from a URL

No codebase, or a build you cannot run. **Rebuild the one screen the claim
needs**, in plain JSX and Tailwind.

There is no design system to import, no tokens to resolve, and no package to
alias. `style.css` is just `@import 'tailwindcss'`. That is the whole setup.

Look at the site and take:

- **The layout skeleton.** Where the nav sits, how the content column is
  placed, the density of the whole thing.
- **The type hierarchy.** Relative sizes and weights matter far more than the
  exact family. Use a close web font.
- **The spacing rhythm.** Generous or tight, and roughly what unit.
- **The colours, as literal values.** Read them off the page and write them as
  hex. No tokens, no theme layer, no ceremony.
- **The vocabulary.** Real product words, shortened.

Then apply every rule from Part 1 above: fixed heights, sized to the tier,
edges in frame, one claim's worth of content and no more. Rebuilding is
usually *faster* than wiring a codebase, and it is always more legible,
because you build only what the film needs at the size it needs to be.

The bar is not "indistinguishable from the site". The bar is "obviously that
product, obviously that screen, and readable at `MACRO`".

## Part 3: component vignettes

When the film announces a tool, a skill or a capability rather than walking
through an app, there is no screen to tour. Rebuilding a whole product
workspace anyway is the instinct, and it fails in a specific way: the film
looks finished and feels flat, because every element on screen competes
with the one the shot is about, and nothing is bold enough to carry a
close-up.

Throw away the workspace and film components one at a time:

- **One component per scene, dead centre,** on a flat canvas one step
  darker than the component's surface. No panel, no sidebar, no header, no
  chrome.
- **The component is the animation.** Every vignette moves under its own
  power. A static component with a camera push is a slide, not a shot.
- **Bold beats faithful.** An element the product renders at 13px can fill
  a MACRO frame. Let scale, spacing and weight serve the shot; the tokens,
  faces and radii still come from the design system, so it stays
  unmistakably the product's.
- **Continuity is causal, not spatial.** The film never pulls back to an
  assembly shot, so the components never need to coexist on one surface.
  Each vignette is about what the previous one produced; that is the
  thread.
- **Crop lines still land in padding.** Centring each vignette and sizing
  it to its tier gives this for free; read the still anyway.
- Entrances only in the scene that introduces a component, as everywhere
  else.

Vignette shapes that carry a scene each:

| Vignette            | Its motion                                              |
| ------------------- | ------------------------------------------------------- |
| Prompt input        | Text types out; the camera follows the caret            |
| Pointer click       | The pointer arcs in; the press dips pointer and target  |
| Segmented timeline  | Segments grow in sequence; labels count up beneath      |
| Nested frames       | Rings draw inward one by one; the innermost pulses once |
| Large counter       | A display-size number counts up over a filling bar      |
| Checklist           | Bold checks cascade down; labels slide in after         |
| Result card         | Lands with a pop; its action chip follows a beat later  |

End on the result or on a title card, never on a pull-back: there is
nothing behind the vignettes to pull back to. The cursor has its recipe
in [scenes.md](scenes.md); title cards and reading time in
[text.md](text.md).

## Filming a design system itself

When the product is a component library there is no feature to film. Film its
preview or documentation app: a page of real primitives in real states is the
product, and one component's interaction is the interaction beat.

**Dark mode will half-render if you try to flip it mid-film.** Most systems
declare light tokens on `:root` and dark overrides on `[data-theme=dark]`,
with semantic tokens derived from a ramp. In Remotion you can only put the
attribute on a nested wrapper, so the ramp re-points but the derived tokens
were already substituted on `:root` and merely inherit. Direct literals invert;
anything derived does not. Either shoot one theme per render and cut two films
together, or re-declare every derived token under your own nested selector.

## Handing off

The stage is done when a single still at `BASE` looks like a screenshot
someone would post, **and** a still at `MACRO` on the feature is legible and
full. If either fails, no camera move will save it.

Only then go to [scenes.md](scenes.md), or read
`scenes.md` directly.
