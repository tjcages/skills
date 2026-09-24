# Product video staging

Everything the camera films. The story guide has chosen a launch by default or
a focused demo for an explicit demo or single-feature brief. Read
[fidelity](fidelity.md) first and classify every filmed surface.

## Preserve the featured product

Build only the surfaces the story needs, but keep the featured UI itself exact.
Crop or isolate a real component to improve legibility. Do not change its
geometry, styling, control design, or animation to fit a preferred shot. A
background site, sample document, or title card can be abstract when it is
accessory context. If the site itself is the film subject, it is primary UI.

## Where the product comes from

| Situation                                    | What you do                          |
| -------------------------------------------- | ------------------------------------ |
| You have the codebase and can import from it | Use its real components and styles; verify the motion |
| The runtime works but the components cannot render in Remotion | Record the actual product interaction |
| You have only a URL | Record the live website or obtain approved captures |
| The film announces a tool, a skill, or a capability | Film real component vignettes: Part 3 |

Recorded UI is valid primary footage. Keep its viewport, state, and interaction
repeatable, and compare it with the source. Do not redraw it merely to keep
every pixel inside a deterministic composition.

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

Row three decides whether to import the feature directly, drive it in a test
fixture, or record its real runtime. Application state or portals are reasons
to choose a capture, not permission to invent a simplified control.

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

### 3. Import, adapt, or record

**Scan first, then read.** `node scan-wallclock.mjs app-pkg/src/components`
lists every animation library import, spring, timer, clock read, portal,
CSS animation, and app-state hook in the tree, file by file. Treat each
finding as a decision to import, drive through an isolated fixture, port
exactly, or record the live interaction. The following are implementation
mechanisms for a verified port, not replacement motion presets:

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

Import directly when the component renders accurately. When it portals,
subscribes, holds state across frames, or relies on CSS animation, capture the
real interaction or adapt its real component and verify the result. If an exact
port is impractical, use footage; do not substitute a lookalike.

`transition-*` alone is not a reason to rebuild. A CSS transition only fires
when a property changes, and in a deterministic render nothing changes, so it
is inert. Design systems put `transition-colors` on nearly every interactive
primitive; treating that as disqualifying means rebuilding the whole library.

Reading the component also catches its **API**: a ring that wants `0` to `1`
and is handed `72` renders full, silently.

### 4. Compose the stage

- Keep primary UI's meaningful labels and vocabulary. Shorten the editorial
  copy around it, or select a real product state with less text.
- **Size the frame around the content.** A `CLOSE` frame is 873px wide and a
  `MACRO` frame is 582px. Choose a camera tier or crop that shows the real
  component clearly; do not resize or redesign primary UI to fill the frame.
- **Measure real geometry.** Use the product's actual row and card heights to
  position the camera. A capture keeps its native layout; a port must not
  impose fixed heights that change it.
- Build depth only where the story travels through it, and remember that a
  scroll inside a panel that also has a header and a composer travels less
  than the content height suggests: it is content minus the visible region,
  not content minus the panel.
- Show the product mid-use. States with history read as real.
- Editorial entrances can be staggered around the feature; primary UI keeps
  its own entrance timing.

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

1. **Choose another crop or tier.** Keep real control geometry intact.
2. **Move the camera or captured viewport.** Do not move primary chrome to a
   position the product never uses.
3. **Film it wider or longer.** Legibility takes priority over a prescribed
   close-up.

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
- A decorative frame may be narrower than the canvas. Match the real product
  window when its frame or chrome is part of the featured UI.
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

For a site that is the subject, preserve the real layout, visible blocks, copy
that affects meaning, and native scrolling behavior. Select fewer sections or
crop more tightly if the film needs to be shorter.

## Part 2: filming from a URL

When the site is primary and no source is available, use browser capture of
the actual page. Record the viewport, route, theme, and action for each shot.
If the page cannot be accessed, ask for a working build or approved footage.
Reconstruction from a URL is appropriate for accessory context or when the
user explicitly authorizes an abstract interpretation of primary UI.

## Part 3: component vignettes

When the film announces a tool, a skill or a capability rather than walking
through an app, there is no screen to tour. Rebuilding a whole product
workspace anyway is the instinct, and it fails in a specific way: the film
looks finished and feels flat, because every element on screen competes
with the one the shot is about, and nothing is bold enough to carry a
close-up.

The workspace can be omitted when it is accessory. Film the real product
components one at a time:

- **One component per scene when useful.** Omit only accessory wrapper chrome.
- **Show its native interaction.** Its own state change should carry the shot.
- **Make it legible through framing.** Camera scale may enlarge the whole
  component; its internal proportions, styles, and motion remain unchanged.
- **Continuity is causal, not spatial.** The film never pulls back to an
  assembly shot, so the components never need to coexist on one surface.
  Each vignette is about what the previous one produced; that is the
  thread.
- **Crop lines still land in padding.** Centring each vignette and sizing
  it to its tier gives this for free; read the still anyway.
- Entrances only in the scene that introduces a component, as everywhere
  else.

Possible vignette subjects, only when the product actually has them:

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

When the product is a component library, its primitives and interactions are
the primary UI. Film the actual components in recognizable states. A preview or
documentation app can establish context but need not remain around every
component vignette.

**Dark mode will half-render if you try to flip it mid-film.** Most systems
declare light tokens on `:root` and dark overrides on `[data-theme=dark]`,
with semantic tokens derived from a ramp. In Remotion you can only put the
attribute on a nested wrapper, so the ramp re-points but the derived tokens
were already substituted on `:root` and merely inherit. Direct literals invert;
anything derived does not. Either shoot one theme per render and cut two films
together, or re-declare every derived token under your own nested selector.

## Handing off

The stage is ready when the featured UI matches its source at representative
states and remains legible at the selected crop. If either fails, change the
capture or framing before editing.

Only then go to [scenes.md](scenes.md), or read
`scenes.md` directly.
