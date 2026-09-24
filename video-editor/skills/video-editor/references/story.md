# Product video story

Inspect the product's docs, source, live UI, and available assets before writing a shot. Write a feature inventory with the source of each capability, the visible interaction it enables, the viewer benefit, and a keep/cut decision. Choose what can be shown truthfully and legibly, not simply what is easiest to render.

## Choose the film

- **Product launch (default):** one umbrella promise supported by a coherent few distinct features. Choose this for an open-ended video request or an explicit launch brief. Each selected feature gets a recognizable UI moment, an action, and its result. A slider shown from three angles is still one feature.
- **Focused demo:** choose this when the user says “demo” or names one feature without asking for a launch. Show that feature's actual interaction and before/after; keep it as short as the proof allows. An explicit launch request wins even when it centers one feature.
- **Whole website:** a website may be the primary product in either mode. Cover the pages or sections named by the brief, and record deliberate omissions. Use `PARTS`, shot `covers`, and `validateCoverage` to check explicit coverage.

The film should let a new viewer say what the product does and why the demonstrated change matters. Do not invent behavior, results, or speed. For a broad launch, do not reduce the product to one easy-to-animate control.

## When the brief says nothing else

"Make a launch video" is a complete brief. Cover these by default, in roughly this order, and say which ones you dropped and why:

| Beat | What it shows | Typical length |
| --- | --- | --- |
| Hook | The umbrella promise, as a title or as the product's most striking state | 1.5-2.5 s |
| First contact | How the product appears or is invoked, in its real entrance | 1-2 s |
| Core loop | The primary interaction and its result, filmed close | 2-3 s |
| Hero features | 3-4 distinct capabilities, each an action and a visible result on a *different surface or state* | 1.5-2.5 s each |
| Breadth montage | 4-8 more real capabilities as 8-14 frame glimpses, each a changed state, cut on motion to the beat | 2-4 s total |
| Differentiator | The claim a competitor cannot make (compiles out, zero config, speed), as a title or proof shot | 2 s |
| Call to action | Install line, URL, or brand hold | 2-3 s |

Twenty to thirty seconds is the default length. Snappy beats complete.

The inventory has to cover the product's whole surface, not just the easiest part to film. Mark each capability **hero**, **montage**, or **omit** with a reason, list hero and montage items in `PARTS`, and let `validateCoverage` prove each appears. A launch that shows five features of a product with fifteen reads as a smaller product than it is; the montage exists so breadth costs seconds, not minutes. Montage glimpses are still real UI in a real state, and each must look different from its neighbours (see "The cut has to change the picture" in [scenes](scenes.md)).

Order the hero features so consecutive ones land on different surfaces or visibly different states. Two features demonstrated in the same panel at the same framing are one shot with two actions, filmed as a continuous camera move, not two shots.

## Build a story, not a list

Use context → tension → action → consequence as the spine. A focused demo can use the four beats once. A launch can repeat action/consequence for each selected feature and connect them through a benefit, shared visual motif, or state handoff. Show the state before it changes; the viewer needs something to anticipate. Hold the result long enough to read it.

Write each shot as **subject → visible motion → result → transition to next shot**. If the only motion is a camera push over a static mockup, redesign the shot. Pick a cut because shape, direction, action, or sound carries the viewer across it. Do not add effects just to mask an unmotivated cut.

For a package, tool, skill, or capability film, consider component vignettes: isolate a real control, let it act, show what changed, then carry that change into the next vignette. The whole app need not be on screen. A persistent browser or demo-page wrapper consumes space and weakens the product evidence unless its context is necessary.

Use title cards as punctuation, not as labels around a static UI. Keep benefit-led copy short, give it an actual reading hold, and let type, objects, and product elements animate together. No redundant persistent title, footer, version label, or descriptive chrome. End on a result or a deliberate brand hold.

## Stage only what serves the story

Use the actual primary product UI and motion as defined in [fidelity](fidelity.md). Simplify the shot by cropping or isolating a real component, not by simplifying that component. Accessory context can be abstract. State continuity matters when two scenes show the same object. If a new feature uses another surface, make the handoff clear.

Before rendering, write:

```text
Film mode and audience:
Umbrella claim or focused claim:
Inventory: every capability, marked hero / montage / omit, with source and reason:
Default beats covered (hook, first contact, core loop, heroes, montage, differentiator, CTA) and any dropped:
Primary UI versus accessory context for each shot:
Shot list with action, result, transition, and approximate reading hold:
```

At review, watch at normal speed without the brief. If a viewer would remember only the title, the camera movement, or an invented page rather than the product actions, revise the story before polishing sound.
