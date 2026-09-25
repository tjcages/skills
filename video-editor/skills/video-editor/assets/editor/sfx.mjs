// Designed UI sounds for the film, rendered offline to WAV.
//
//   node sfx.mjs sounds.json [--out sounds/]
//
// sounds.json:
//   { "sounds": [
//       { "name": "grab", "recipe": "click", "words": ["softer"] },
//       { "name": "theme-on", "recipe": "toggle", "params": { "on": true } },
//       { "name": "throw", "recipe": "whoosh", "frames": 12, "words": ["heavier"] }
//   ] }
//
// Each becomes sounds/<name>.wav (48 kHz mono, peak -12 dBFS) that a cue uses
// as "custom:<name>"; pass --sounds sounds/ to mix.mjs / render-mix.mjs.
// `frames` sets a sound's length from the picture (a whoosh as long as the
// camera move it accompanies). `words` apply the vocabulary bridge (see
// shared/SOUND-DESIGN.md). Prints each sound's duration, attack, and
// brightness so the cue sheet and listen.mjs can use them.
//
// Recipes adapted from ui-sound-design by Danny Williams (MIT, see
// licenses/ui-sound-design-LICENSE.txt,
// https://github.com/dannyjpwilliams/ui-sound-design-skill), moved from the
// live AudioContext to OfflineAudioContext. Their rules hold: exponential
// ramps never target zero, every ramp starts from setValueAtTime, sources
// stop after their envelopes, one captured `now`.
import { OfflineAudioContext } from "node-web-audio-api"
import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import { SAMPLE_RATE, encodeWav } from "./effects.mjs"

const FPS = 30
// -12 dBFS, the loud end of the Cuelume bank (-12 to -21), so a designed
// sound and a bundled one sit alike at the same cue volume.
const PEAK = 0.25

function noise(ctx, seconds, seed = 1) {
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * seconds), ctx.sampleRate)
  const data = buffer.getChannelData(0)
  let s = seed
  for (let i = 0; i < data.length; i++) data[i] = ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296) * 2 - 1
  const source = ctx.createBufferSource()
  source.buffer = buffer
  return source
}

function tone(ctx, dest, { type = "sine", freq, to, start, duration, volume, attack = 0 }) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, start)
  if (to) osc.frequency.exponentialRampToValueAtTime(to, start + duration)
  if (attack) {
    gain.gain.setValueAtTime(0.001, start)
    gain.gain.exponentialRampToValueAtTime(volume, start + attack)
  } else gain.gain.setValueAtTime(volume, start)
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration)
  osc.connect(gain).connect(dest)
  osc.start(start)
  osc.stop(start + duration + 0.01)
}

// Each recipe: defaults, and a render into (ctx, dest) at time 0.
const RECIPES = {
  click: {
    defaults: { frequency: 2000, Q: 2, duration: 0.05, volume: 0.3 },
    render(ctx, dest, p) {
      const source = noise(ctx, p.duration)
      const filter = ctx.createBiquadFilter()
      filter.type = "bandpass"
      filter.frequency.value = p.frequency
      filter.Q.value = p.Q
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(p.volume, 0)
      gain.gain.exponentialRampToValueAtTime(0.001, p.duration)
      source.connect(filter).connect(gain).connect(dest)
      source.start(0)
    },
  },
  toggle: {
    // Pitch direction is the state: up for on, down for off.
    defaults: { on: true, low: 500, high: 700, duration: 0.12, volume: 0.25, type: "sine" },
    render(ctx, dest, p) {
      tone(ctx, dest, { type: p.type, freq: p.on ? p.low : p.high, to: p.on ? p.high : p.low, start: 0, duration: p.duration, volume: p.volume })
    },
  },
  hover: {
    defaults: { frequency: 2400, duration: 0.06, volume: 0.08 },
    render(ctx, dest, p) {
      tone(ctx, dest, { freq: p.frequency, start: 0, duration: p.duration, volume: p.volume, attack: 0.01 })
    },
  },
  success: {
    // Ascending major third; `interval` 1.5 is a fifth, more triumphant.
    defaults: { baseFreq: 523, interval: 1.25, noteDuration: 0.12, gap: 0.08, volume: 0.3, type: "sine" },
    render(ctx, dest, p) {
      for (const i of [0, 1]) {
        tone(ctx, dest, { type: p.type, freq: p.baseFreq * p.interval ** i, start: i * (p.noteDuration + p.gap), duration: p.noteDuration, volume: p.volume })
      }
    },
  },
  error: {
    defaults: { startFreq: 400, endFreq: 200, filterFreq: 1500, duration: 0.25, volume: 0.25, type: "sawtooth" },
    render(ctx, dest, p) {
      const filter = ctx.createBiquadFilter()
      filter.type = "lowpass"
      filter.frequency.value = p.filterFreq
      filter.Q.value = 1
      filter.connect(dest)
      tone(ctx, filter, { type: p.type, freq: p.startFreq, to: p.endFreq, start: 0, duration: p.duration, volume: p.volume })
    },
  },
  warning: {
    defaults: { frequency: 600, pulseDuration: 0.08, gap: 0.08, pulses: 2, volume: 0.25, type: "triangle" },
    render(ctx, dest, p) {
      for (let i = 0; i < p.pulses; i++) {
        tone(ctx, dest, { type: p.type, freq: p.frequency, start: i * (p.pulseDuration + p.gap), duration: p.pulseDuration, volume: p.volume })
      }
    },
  },
  notification: {
    // FM bell: modRatio 1.4 is bell-like, 2.0 more electronic.
    defaults: { frequency: 880, modRatio: 1.4, modDepth: 1500, duration: 0.4, volume: 0.25 },
    render(ctx, dest, p) {
      const modulator = ctx.createOscillator()
      const modGain = ctx.createGain()
      modulator.frequency.value = p.frequency * p.modRatio
      modGain.gain.setValueAtTime(p.modDepth, 0)
      modGain.gain.exponentialRampToValueAtTime(0.001, p.duration * 0.8)
      const carrier = ctx.createOscillator()
      const gain = ctx.createGain()
      carrier.frequency.value = p.frequency
      gain.gain.setValueAtTime(p.volume, 0)
      gain.gain.exponentialRampToValueAtTime(0.001, p.duration)
      modulator.connect(modGain).connect(carrier.frequency)
      carrier.connect(gain).connect(dest)
      modulator.start(0)
      carrier.start(0)
      modulator.stop(p.duration + 0.01)
      carrier.stop(p.duration + 0.01)
    },
  },
  whoosh: {
    // Rising filter for movement toward, `reverse` for away. Give it `frames`
    // equal to the camera move or gesture it accompanies.
    defaults: { startFilterFreq: 500, endFilterFreq: 4000, duration: 0.2, Q: 1, volume: 0.2, reverse: false },
    render(ctx, dest, p) {
      const [from, to] = p.reverse ? [p.endFilterFreq, p.startFilterFreq] : [p.startFilterFreq, p.endFilterFreq]
      const source = noise(ctx, p.duration)
      const filter = ctx.createBiquadFilter()
      filter.type = "bandpass"
      filter.Q.value = p.Q
      filter.frequency.setValueAtTime(from, 0)
      filter.frequency.exponentialRampToValueAtTime(to, p.duration)
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.001, 0)
      gain.gain.exponentialRampToValueAtTime(p.volume, p.duration * 0.3)
      gain.gain.exponentialRampToValueAtTime(0.001, p.duration)
      source.connect(filter).connect(gain).connect(dest)
      source.start(0)
    },
  },
  pop: {
    defaults: { startFreq: 1200, endFreq: 300, duration: 0.06, volume: 0.3 },
    render(ctx, dest, p) {
      tone(ctx, dest, { freq: p.startFreq, to: p.endFreq, start: 0, duration: p.duration, volume: p.volume })
    },
  },
}

// The vocabulary bridge: plain words to parameter changes.
const FREQ = ["frequency", "startFreq", "endFreq", "baseFreq", "low", "high", "startFilterFreq", "endFilterFreq", "filterFreq"]
const TIME = ["duration", "noteDuration", "pulseDuration", "gap"]
const scale = (p, keys, k) => keys.forEach((key) => key in p && (p[key] *= k))
const WORDS = {
  brighter: (p) => scale(p, FREQ, 1.5),
  darker: (p) => scale(p, FREQ, 0.67),
  warmer: (p) => (scale(p, FREQ, 0.75), "type" in p && (p.type = "sine")),
  heavier: (p) => (scale(p, FREQ, 0.5), scale(p, TIME, 1.3)),
  lighter: (p) => (scale(p, FREQ, 1.3), scale(p, TIME, 0.8)),
  snappier: (p) => scale(p, TIME, 0.6),
  crisper: (p) => (scale(p, TIME, 0.6), "Q" in p && (p.Q *= 2)),
  shorter: (p) => scale(p, TIME, 0.7),
  longer: (p) => scale(p, TIME, 1.6),
  softer: (p) => ((p.volume *= 0.6), scale(p, FREQ, 0.85)),
  louder: (p) => (p.volume = Math.min(0.8, p.volume * 1.4)),
  playful: (p) => (scale(p, FREQ, 1.2), "type" in p && (p.type = "triangle")),
  minimal: (p) => ((p.volume *= 0.7), scale(p, TIME, 0.7)),
  retro: (p) => "type" in p && (p.type = "square"),
  triumphant: (p) => "interval" in p && (p.interval = 1.5),
}

function envelopeInfo(data) {
  let peak = 0
  let peakAt = 0
  for (let i = 0; i < data.length; i++) if (Math.abs(data[i]) > peak) (peak = Math.abs(data[i])), (peakAt = i)
  let attack = 0
  for (let i = 0; i < data.length; i++) if (Math.abs(data[i]) >= 0.9 * peak) { attack = i; break }
  let end = data.length - 1
  while (end > 0 && Math.abs(data[end]) < peak * 0.01) end--
  // Brightness: share of energy in sample-to-sample change, a cheap centroid proxy.
  let e = 0
  let d = 0
  for (let i = 1; i < data.length; i++) (e += data[i] ** 2), (d += (data[i] - data[i - 1]) ** 2)
  const brightness = Math.round((Math.sqrt(d / Math.max(e, 1e-12)) * SAMPLE_RATE) / (2 * Math.PI))
  return { peak, attackMs: Math.round((attack / SAMPLE_RATE) * 1000), durationMs: Math.round((end / SAMPLE_RATE) * 1000), brightness }
}

const specPath = process.argv[2]
if (!specPath) {
  console.error("Usage: node sfx.mjs sounds.json [--out sounds/]")
  process.exit(1)
}
const outIndex = process.argv.indexOf("--out")
const OUT = outIndex > 0 ? process.argv[outIndex + 1] : "sounds"
mkdirSync(OUT, { recursive: true })
const spec = JSON.parse(readFileSync(specPath, "utf8"))
const report = {}
for (const sound of spec.sounds) {
  const recipe = RECIPES[sound.recipe]
  if (!recipe) throw Error(`${sound.name}: unknown recipe "${sound.recipe}". Known: ${Object.keys(RECIPES).join(", ")}`)
  const p = { ...recipe.defaults, ...(sound.params ?? {}) }
  for (const word of sound.words ?? []) {
    if (!WORDS[word]) throw Error(`${sound.name}: unknown word "${word}". Known: ${Object.keys(WORDS).join(", ")}`)
    WORDS[word](p)
  }
  // The picture wins: a length given in frames overrides any word's timing.
  if (sound.frames) p.duration = sound.frames / FPS
  const seconds = (p.duration ?? 0.3) + (p.gap ?? 0) + (p.noteDuration ?? 0) * 2 + 0.2
  const ctx = new OfflineAudioContext(1, Math.ceil(seconds * SAMPLE_RATE), SAMPLE_RATE)
  recipe.render(ctx, ctx.destination, p)
  const rendered = await ctx.startRendering()
  const data = new Float32Array(rendered.getChannelData(0))
  const info = envelopeInfo(data)
  const k = info.peak > 0 ? PEAK / info.peak : 1
  for (let i = 0; i < data.length; i++) data[i] *= k
  const trimmed = data.subarray(0, Math.min(data.length, Math.ceil(((info.durationMs + 20) / 1000) * SAMPLE_RATE)))
  writeFileSync(join(OUT, `${sound.name}.wav`), encodeWav([trimmed], SAMPLE_RATE))
  report[sound.name] = { recipe: sound.recipe, attackMs: info.attackMs, durationMs: info.durationMs, brightness: info.brightness }
  console.log(`${sound.name.padEnd(18)} ${sound.recipe.padEnd(13)} ${String(info.durationMs).padStart(4)} ms  attack ${String(info.attackMs).padStart(3)} ms  ~${info.brightness} Hz`)
}
writeFileSync(join(OUT, "sounds.json"), JSON.stringify(report, null, 2) + "\n")
console.log(`\n${Object.keys(report).length} sounds in ${OUT}/ (cue them as "custom:<name>"; pass --sounds ${OUT} to the mixer)`)
