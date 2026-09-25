// Records a running product in slow motion and retimes it to 30 fps.
//
// Why: primary UI must be filmed with its real motion (references/fidelity.md),
// and a headless browser cannot screenshot full-resolution frames at 30 fps.
// So every clock the page reads is slowed by K together, input is replayed K
// times slower, and frames are sampled at 30 fps of *virtual* time. The page
// sees a normal-speed user; easing, springs, drag velocity and throw physics
// are the shipped behavior.
//
// Slowed together: performance.now, Date.now, rAF timestamps, setTimeout /
// setInterval, Event.timeStamp (drag and throw velocity), and the document
// animation timeline (CSS transitions, keyframes, WAAPI) via CDP
// Animation.setPlaybackRate. Not slowed: <video> playback, audio, Web
// Workers, and canvas/WebGL loops that read clocks this patch cannot reach.
// Check those against the live product before trusting them.
//
//   node record.mjs <shot> [--k=30] [--shots=./shots.mjs]
//
// Writes out/<shot>.mp4, out/<shot>.cursor.json (pointer path and state, for
// the film's Cursor), and out/<shot>.state.json (for the next shot's setup).
import { chromium } from "playwright"
import { execFileSync } from "node:child_process"
import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { pathToFileURL } from "node:url"
import { resolve } from "node:path"

const arg = (name, fallback) =>
  process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3) ?? fallback
const name = process.argv[2]
const K = Number(arg("k", 30))
const config = await import(pathToFileURL(resolve(arg("shots", "./shots.mjs"))).href)
const { URL: BASE, VIEWPORT, DSF, SHOTS } = config
const shot = SHOTS[name]
if (!shot) throw new Error(`Unknown shot "${name}". Known: ${Object.keys(SHOTS).join(", ")}`)

const OUT = resolve("out", name)
await rm(OUT, { recursive: true, force: true })
await mkdir(`${OUT}/frames`, { recursive: true })

const clockPatch = (K) => {
  const pNow = performance.now.bind(performance)
  const t0 = pNow()
  const v = (t) => t0 + (t - t0) / K
  window.__virtualNow = () => v(pNow())
  performance.now = () => v(pNow())
  const dNow = Date.now
  const d0 = dNow()
  Date.now = () => d0 + (dNow() - d0) / K
  const raf = window.requestAnimationFrame.bind(window)
  window.requestAnimationFrame = (cb) => raf((t) => cb(v(t)))
  const st = window.setTimeout.bind(window)
  window.setTimeout = (f, ms = 0, ...a) => st(f, ms * K, ...a)
  const si = window.setInterval.bind(window)
  window.setInterval = (f, ms = 0, ...a) => si(f, ms * K, ...a)
  const ts = Object.getOwnPropertyDescriptor(Event.prototype, "timeStamp").get
  Object.defineProperty(Event.prototype, "timeStamp", {
    configurable: true,
    get() {
      return v(ts.call(this))
    },
  })
}

const browser = await chromium.launch({
  executablePath: process.env.CAPTURE_CHROME || undefined,
  args: ["--force-color-profile=srgb", "--hide-scrollbars"],
})
const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: DSF })
await context.addInitScript(clockPatch, K)
const page = await context.newPage()
page.on("pageerror", (e) => console.error("pageerror", e.message))
const cdp = await context.newCDPSession(page)

// Continuity: a shot can start from the state another shot ended on. Prefer
// one continuous take for beats on the same surface: a reload loses UI-only
// state (an expanded row, a scroll position) that no state file carries.
let previous = null
if (shot.from) previous = JSON.parse(await readFile(resolve("out", `${shot.from}.state.json`), "utf8"))
await page.goto(shot.url ? shot.url(previous) : BASE)
await page.evaluate(() => document.fonts.ready)
await cdp.send("Animation.enable")
await cdp.send("Animation.setPlaybackRate", { playbackRate: 1 / K })
if (shot.setup) await shot.setup({ page, previous })
await page.waitForTimeout(400 * K)

const realStart = Date.now()
const virtStart = await page.evaluate(() => window.__virtualNow())
const vnow = () => virtStart + (Date.now() - realStart) / K

const samples = []
let pos = shot.cursorStart ?? { x: VIEWPORT.width + 60, y: VIEWPORT.height * 0.7 }
let down = false
let kind = "default"
const log = () => samples.push({ t: vnow(), x: pos.x, y: pos.y, down, kind })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const ease = {
  standard: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  arrive: (t) => 1 - Math.pow(1 - t, 4),
  linear: (t) => t,
  throw: (t) => t * t,
}

// Virtual-time helpers handed to each shot. Durations are virtual ms.
const api = {
  page,
  previous,
  wait: async (ms) => {
    const end = vnow() + ms
    while (vnow() < end) {
      log()
      await sleep(Math.min(16 * K, (end - vnow()) * K))
    }
  },
  move: async (x, y, ms, curve = "standard") => {
    const from = { ...pos }
    const steps = Math.max(1, Math.round(ms / 16))
    for (let i = 1; i <= steps; i++) {
      const e = ease[curve](i / steps)
      pos = { x: from.x + (x - from.x) * e, y: from.y + (y - from.y) * e }
      await page.mouse.move(pos.x, pos.y)
      log()
      await sleep(16 * K)
    }
  },
  down: async () => {
    down = true
    await page.mouse.down()
    log()
  },
  up: async () => {
    down = false
    await page.mouse.up()
    log()
  },
  /** A real click holds the button ~70 ms; an instant one is invisible on film. */
  click: async () => {
    await api.down()
    await api.wait(70)
    await api.up()
  },
  kind: (k) => {
    kind = k
  },
  press: async (keys) => {
    await page.keyboard.press(keys, { delay: 60 * K })
    log()
  },
  box: async (selector) => {
    const b = await page.locator(selector).first().boundingBox()
    if (!b) throw new Error(`No box for ${selector}`)
    return { ...b, cx: b.x + b.width / 2, cy: b.y + b.height / 2 }
  },
}

// Headless screencast is capped at CSS pixels, so take full-resolution
// screenshots in a loop, each stamped with the midpoint of its capture.
const frames = []
let frameNo = 0
let capturing = true
const grab = (async () => {
  while (capturing) {
    const t0 = vnow()
    const buf = await page.screenshot({ type: "jpeg", quality: 93 })
    const t1 = vnow()
    const file = `${OUT}/frames/${String(frameNo++).padStart(6, "0")}.jpg`
    frames.push({ t: (t0 + t1) / 2, file })
    await writeFile(file, buf)
  }
})()

await page.mouse.move(pos.x, pos.y)
const start = vnow()
log()
await shot.run(api)
const end = vnow()
const endState = shot.state ? await shot.state({ page }) : null
capturing = false
await grab
await browser.close()

// Resample to 30 fps of virtual time: each output frame shows the newest
// captured frame at or before its timestamp.
frames.sort((a, b) => a.t - b.t)
const fps = 30
const count = Math.floor(((end - start) / 1000) * fps)
const list = []
let j = 0
for (let i = 0; i < count; i++) {
  const t = start + (i * 1000) / fps
  while (j + 1 < frames.length && frames[j + 1].t <= t) j++
  list.push(`file '${frames[j].file}'\nduration ${1 / fps}`)
}
await writeFile(`${OUT}/list.txt`, list.join("\n") + "\n")
execFileSync("ffmpeg", [
  "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", `${OUT}/list.txt`,
  "-r", "30", "-pix_fmt", "yuv420p", "-c:v", "libx264", "-crf", "12", "-preset", "medium",
  resolve("out", `${name}.mp4`),
])
await writeFile(
  resolve("out", `${name}.cursor.json`),
  JSON.stringify({
    viewport: VIEWPORT,
    frames: count,
    samples: samples.map((s) => ({ ...s, f: ((s.t - start) / 1000) * fps })),
  }),
)
if (endState) await writeFile(resolve("out", `${name}.state.json`), JSON.stringify(endState))

// Events for the cue sheet: every press and release, in clip frames.
const events = []
for (let i = 1; i < samples.length; i++) {
  if (samples[i].down !== samples[i - 1].down) {
    events.push(`${samples[i].down ? "press" : "release"} @ ${(((samples[i].t - start) / 1000) * fps).toFixed(1)}`)
  }
}
const gaps = frames.slice(1).map((f, i) => f.t - frames[i].t)
const worst = Math.max(...gaps)
console.log(`${name}: ${count} frames @30fps from ${frames.length} captures; worst gap ${worst.toFixed(1)} ms virtual`)
if (worst > 1000 / fps) console.log(`  gap exceeds one frame: raise --k for smoother motion`)
if (events.length) console.log(`  ${events.join(", ")}`)
