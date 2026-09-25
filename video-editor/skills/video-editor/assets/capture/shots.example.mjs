// Shot scripts for record.mjs. Copy to shots.mjs and replace with the
// product's real surfaces. One shot = one continuous take of one surface.
// Everything is in CSS pixels and virtual milliseconds.

export const URL = "http://localhost:5173/"

// DSF sets footage sharpness. The film canvas is 1920 wide; the closest
// camera tier the film uses on this footage decides the minimum:
//   DSF >= zoom * 1920 / VIEWPORT.width
// CLOSE (2.2) on a 1440-wide viewport needs ~2.9, so 3. Higher costs render
// time: 3x footage is 4320x2430 and slows Remotion enough to need a longer
// delayRender timeout (see remotion.config.ts).
export const VIEWPORT = { width: 1440, height: 810 }
export const DSF = 3

// Snappy defaults. The pointer enters close to its target and acts quickly;
// the result gets the hold. Long approaches become dead air on film.
const ARRIVE = 380 // ms for the pointer to reach a control
const SETTLE = 90 // ms between arriving and pressing
const RESULT = 700 // ms to hold a visible result before the take ends

async function drag(api, selector, toFraction, ms = 600) {
  const track = await api.box(selector)
  await api.move(track.x + track.width * 0.35, track.cy, ARRIVE, "arrive")
  await api.wait(SETTLE)
  await api.down()
  await api.move(track.x + track.width * toFraction, track.cy, ms)
  await api.wait(60)
  await api.up()
}

export const SHOTS = {
  // A continuous take covering two beats on the same surface. The film cuts
  // it into scenes with camera moves instead of reframing across a cut.
  controls: {
    cursorStart: { x: 1200, y: 420 },
    run: async (api) => {
      await api.wait(150)
      await drag(api, '[role=slider][aria-label="Amplitude"]', 0.85)
      await api.wait(250)
      await drag(api, '[role=slider][aria-label="Lines"]', 0.9)
      await api.wait(RESULT)
    },
    // What the next shot needs to start from the same state.
    state: ({ page }) => page.evaluate(() => window.__state),
  },
  theme: {
    from: "controls",
    url: (previous) => `${URL}?s=${encodeURIComponent(JSON.stringify(previous))}`,
    run: async (api) => {
      const dark = await api.box('button[aria-label="Dark"]')
      await api.move(dark.cx, dark.cy, ARRIVE, "arrive")
      await api.wait(SETTLE)
      await api.click()
      await api.wait(RESULT)
    },
  },
}
