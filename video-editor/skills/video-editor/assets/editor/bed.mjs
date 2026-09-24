// Original, license-free music bed for a product film. No dependencies.
//
//   node bed.mjs --film 25.2 --drop 3.8 [--bpm 112] [--key 0] [--seed 7] [--out bed.wav]
//
// Soft and bright: detuned-saw pad, sub bass on eighths, four-on-the-floor
// kick, offbeat hats, a clap and 16th ghosts from the second phrase, and a
// pluck arpeggio with a dotted-eighth echo. Pad-only until the drop, where
// the groove enters; put the drop on the film's first product reveal.
// It lasts `film + 3 s` so the editor's excerpt covers the whole film. The
// printed `start` is the song offset that lands the drop at `--drop` s.
//
// Dogfood note (Panels, 2026-09): this bed at 112 BPM, pad intro, groove on
// the reveal, was the part of the film that landed best. Keep it as default.
import { writeFileSync } from "node:fs"
import { encodeWav } from "./effects.mjs"

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > 0 ? process.argv[i + 1] : fallback
}
const SR = 48000
const BPM = Number(arg("bpm", 112))
const KEY = Number(arg("key", 0)) // semitones from F major
const FILM = Number(arg("film", 30))
const DROP = Number(arg("drop", 4))
const OUT = arg("out", "bed.wav")
let seed = Number(arg("seed", 7))

const BEAT = 60 / BPM
const BAR = BEAT * 4
const INTRO_BARS = Math.max(1, Math.round(DROP / BAR))
const START = +(INTRO_BARS * BAR - DROP).toFixed(3)
const BARS = Math.ceil((FILM + START + 3) / BAR)
const N = Math.ceil((BARS * BAR + 3) * SR)
const L = new Float32Array(N)
const R = new Float32Array(N)

const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296) * 2 - 1
const midi = (n) => 440 * 2 ** ((n + KEY - 69) / 12)

function place(sig, t, pan = 0, gain = 1) {
  const i = Math.floor(t * SR)
  const gl = Math.sqrt(0.5 * (1 - pan)) * gain
  const gr = Math.sqrt(0.5 * (1 + pan)) * gain
  for (let k = 0; k < sig.length && i + k < N; k++) {
    if (i + k < 0) continue
    L[i + k] += sig[k] * gl
    R[i + k] += sig[k] * gr
  }
}

// RBJ biquad, run in place.
function biquad(x, type, freq, q = Math.SQRT1_2) {
  const w = (2 * Math.PI * freq) / SR
  const alpha = Math.sin(w) / (2 * q)
  const cos = Math.cos(w)
  const b = type === "low" ? [(1 - cos) / 2, 1 - cos, (1 - cos) / 2] : [(1 + cos) / 2, -(1 + cos), (1 + cos) / 2]
  const a0 = 1 + alpha
  const a1 = -2 * cos
  const a2 = 1 - alpha
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0
  for (let i = 0; i < x.length; i++) {
    const y = (b[0] * x[i] + b[1] * x1 + b[2] * x2 - a1 * y1 - a2 * y2) / a0
    x2 = x1; x1 = x[i]; y2 = y1; y1 = y
    x[i] = y
  }
  return x
}
const lowpass = (x, f) => biquad(x, "low", f)
const highpass = (x, f) => biquad(x, "high", f)

function envelope(n, attack, decay, sustain, release, hold) {
  const e = new Float32Array(n)
  for (let i = 0; i < n; i++) {
    const t = i / SR
    e[i] =
      t < attack ? t / attack
      : t < attack + decay ? 1 - ((1 - sustain) * (t - attack)) / decay
      : t < hold ? sustain
      : sustain * Math.exp(-(t - hold) / release)
  }
  return e
}
const multiply = (x, e) => {
  for (let i = 0; i < x.length; i++) x[i] *= e[i]
  return x
}

// Fmaj9 - Am7 - Dm9 - Bbmaj7(#11), two bars each.
const CHORDS = [
  [53, 60, 64, 67, 69],
  [57, 60, 64, 67, 72],
  [50, 57, 60, 64, 65],
  [46, 57, 62, 65, 69],
]
const ROOTS = [41, 45, 38, 46]
const chordAt = (bar) => Math.floor(bar / 2) % 4

// Pad
for (let b = 0; b < BARS; b += 2) {
  const n = Math.floor((BAR * 2 + 1.5) * SR)
  const sig = new Float32Array(n)
  for (const note of CHORDS[chordAt(b)]) {
    for (const d of [-0.004, 0, 0.005]) {
      const f = midi(note) * (1 + d)
      for (let i = 0; i < n; i++) sig[i] += 2 * ((i * f / SR) % 1) - 1
    }
  }
  lowpass(lowpass(sig, b >= INTRO_BARS ? 1400 : 900), b >= INTRO_BARS ? 1400 : 900)
  multiply(sig, envelope(n, 0.6, 0.4, 0.8, 0.9, BAR * 2))
  place(sig, b * BAR, -0.25, 0.028)
  place(sig, b * BAR + 0.013, 0.25, 0.028)
}

for (let b = INTRO_BARS; b < BARS; b++) {
  const at = b * BAR
  // Sub bass on eighths, ducked like a sidechain.
  for (let k = 0; k < 8; k++) {
    const n = Math.floor((BEAT / 2) * SR)
    const f = midi(ROOTS[chordAt(b)])
    const sig = new Float32Array(n)
    for (let i = 0; i < n; i++) sig[i] = Math.sin((2 * Math.PI * f * i) / SR) + 0.25 * Math.sin((4 * Math.PI * f * i) / SR)
    multiply(sig, envelope(n, 0.005, 0.08, 0.7, 0.05, BEAT / 2 - 0.05))
    place(sig, at + (k * BEAT) / 2, 0, 0.16 * (k % 2 ? 0.85 : 0.55))
  }
  // Kick
  for (let k = 0; k < 4; k++) {
    const n = Math.floor(0.35 * SR)
    const sig = new Float32Array(n)
    let phase = 0
    for (let i = 0; i < n; i++) {
      const t = i / SR
      phase += (2 * Math.PI * (48 + 90 * Math.exp(-t * 28))) / SR
      sig[i] = Math.sin(phase) * Math.exp(-t * 9) + 0.3 * random() * Math.exp(-t * 200)
    }
    place(sig, at + k * BEAT, 0, 0.3)
  }
  // Hats on the offbeats; 16th ghosts from the second phrase.
  for (let k = 0; k < 8; k++) {
    const n = Math.floor(0.09 * SR)
    const sig = new Float32Array(n)
    for (let i = 0; i < n; i++) sig[i] = random()
    highpass(highpass(sig, 7000), 7000)
    multiply(sig, Float32Array.from({ length: n }, (_, i) => Math.exp((-i / SR) * 55)))
    if (k % 2) place(sig, at + (k * BEAT) / 2, 0.3, 0.1)
    else if (b >= INTRO_BARS + 4) place(sig, at + (k * BEAT) / 2 + BEAT / 4, -0.3, 0.025)
  }
  // Clap on 2 and 4 from the second phrase.
  if (b >= INTRO_BARS + 4) {
    for (const k of [1, 3]) {
      const n = Math.floor(0.25 * SR)
      const sig = new Float32Array(n)
      for (let i = 0; i < n; i++) sig[i] = random()
      lowpass(highpass(sig, 900), 5000)
      multiply(sig, Float32Array.from({ length: n }, (_, i) => Math.exp((-i / SR) * 22)))
      place(sig, at + k * BEAT, 0, 0.11)
    }
  }
  // Pluck arpeggio from the second bar of the groove.
  if (b >= INTRO_BARS + 2) {
    const PATTERN = [0, 2, 4, 1, 3, 4, 2, 1]
    const tones = CHORDS[chordAt(b)].slice(1)
    for (let k = 0; k < 16; k++) {
      const f = midi(tones[PATTERN[k % 8] % 4] + 12)
      const n = Math.floor(0.5 * SR)
      const sig = new Float32Array(n)
      for (let i = 0; i < n; i++) {
        const t = i / SR
        sig[i] = ((2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * f * t)) + 0.3 * Math.sin(4 * Math.PI * f * t)) * Math.exp(-t * 11)
      }
      lowpass(lowpass(sig, 4200), 4200)
      const pan = k % 2 ? 0.35 : -0.35
      place(sig, at + (k * BEAT) / 4, pan, 0.06 * (k % 4 === 0 ? 1 : 0.7))
      place(sig, at + (k * BEAT) / 4 + BEAT * 0.75, -pan, 0.021)
    }
  }
}

// Ring out on the tonic.
{
  const n = 3 * SR
  const sig = new Float32Array(n)
  for (const note of CHORDS[0]) {
    const f = midi(note) * 1.003
    for (let i = 0; i < n; i++) sig[i] += 2 * ((i * f / SR) % 1) - 1
  }
  lowpass(sig, 1600)
  multiply(sig, envelope(n, 0.01, 0.3, 0.5, 1.2, 0.4))
  place(sig, BARS * BAR, 0, 0.02)
}

// Soft-clip master at about -1.5 dBFS peak.
highpass(L, 28)
highpass(R, 28)
let peak = 0
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]))
const drive = Math.tanh(1.3)
for (let i = 0; i < N; i++) {
  L[i] = (Math.tanh((L[i] / peak) * 1.3) / drive) * 0.84
  R[i] = (Math.tanh((R[i] / peak) * 1.3) / drive) * 0.84
}
writeFileSync(OUT, encodeWav([L, R], SR))
console.log(
  `${OUT}: ${(N / SR).toFixed(1)} s at ${BPM} BPM, groove at ${(INTRO_BARS * BAR).toFixed(3)} s. ` +
    `Use mix "start": ${START} so the drop lands at ${DROP} s of the film.`,
)
