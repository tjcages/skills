// A listening report for an agent that cannot hear: what a listener would
// notice in the finished film, measured.
//
//   node listen.mjs --video final.mp4 [--recipe final.mix.json] [--edit edit.json] [--out listen.png]
//
// Checks, each printed ok / warn:
// - loudness and true peak against web delivery (-14 LUFS, <= -1 dBTP)
// - audio and picture start and end together (AAC priming, a stale mix)
// - no dead silence mid-film, no silent open, a faded (not chopped) ending
// - every cue in the recipe produces an audible transient at its frame that
//   stands out from the music around it (a cue that does not is masked)
// Writes an annotated picture to look at: spectrogram over waveform, with
// cuts (white), cues (orange, red when masked), and the music drop (green).
// Reading it is the closest an agent gets to listening; a person still
// listens once before the film ships.
import { execFileSync, spawnSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > 0 ? process.argv[i + 1] : fallback
}
const video = resolve(arg("video"))
const recipe = arg("recipe") ? JSON.parse(readFileSync(arg("recipe"), "utf8")) : null
const edit = arg("edit") ? JSON.parse(readFileSync(arg("edit"), "utf8")) : null
const out = resolve(arg("out", video.replace(/\.mp4$/, "") + ".listen.png"))
const fps = recipe?.fps ?? 30

// Time from start to 90% of peak for each bundled Cuelume sound, measured
// from the rendered bank. A slow swell (bloom, success) peaks late by design,
// so timing tolerance is 50 ms plus the sound's own attack.
const ATTACK_MS = {
  press: 5, release: 5, toggle: 5, chime: 10, droplet: 10, pulse: 10, scan: 10, sparkle: 10, tick: 10,
  page: 15, whisper: 25, loading: 30, error: 35, arrival: 45, bloom: 65, success: 130, ready: 140,
}

const results = []
const ok = (text) => results.push(`ok    ${text}`)
const warn = (text) => results.push(`warn  ${text}`)

// Streams
const probe = JSON.parse(
  execFileSync("ffprobe", ["-v", "error", "-show_streams", "-show_format", "-of", "json", video], { encoding: "utf8" }),
)
const v = probe.streams.find((s) => s.codec_type === "video")
const a = probe.streams.find((s) => s.codec_type === "audio")
if (!a) {
  console.log("warn  no audio stream")
  process.exit(1)
}
const duration = Number(v.duration ?? probe.format.duration)
const startGap = Math.abs(Number(a.start_time ?? 0) - Number(v.start_time ?? 0))
const endGap = Math.abs(Number(a.duration ?? duration) - duration)
if (startGap > 1 / fps || endGap > 1 / fps) {
  warn(`audio and picture drift: start ${(startGap * 1000).toFixed(0)} ms, end ${(endGap * 1000).toFixed(0)} ms apart`)
} else ok(`audio and picture aligned within a frame (${(startGap * 1000).toFixed(0)} ms / ${(endGap * 1000).toFixed(0)} ms)`)

// Loudness
const loud = spawnSync("ffmpeg", ["-hide_banner", "-i", video, "-af", "ebur128=peak=true", "-f", "null", "-"], { encoding: "utf8" }).stderr
const summary = loud.slice(loud.lastIndexOf("Summary"))
const lufs = Number(summary.match(/I:\s+(-?[\d.]+) LUFS/)?.[1])
const truePeak = Number(summary.match(/Peak:\s+(-?[\d.]+) dBFS/)?.[1])
if (Math.abs(lufs + 14) > 1.5) warn(`integrated loudness ${lufs} LUFS; web delivery expects about -14`)
else ok(`integrated loudness ${lufs} LUFS`)
if (truePeak > -1) warn(`true peak ${truePeak} dBTP; keep it at or under -1 to survive re-encoding`)
else ok(`true peak ${truePeak} dBTP`)

// Silence
const silence = spawnSync("ffmpeg", ["-hide_banner", "-i", video, "-af", "silencedetect=n=-45dB:d=0.4", "-f", "null", "-"], { encoding: "utf8" }).stderr
const quiet = [...silence.matchAll(/silence_start: (-?[\d.]+)[\s\S]*?silence_end: ([\d.]+)/g)].map((m) => [Number(m[1]), Number(m[2])])
const mid = quiet.filter(([s, e]) => s > 0.3 && e < duration - 0.5)
if (quiet.some(([s, e]) => s <= 0.05 && e > 0.3)) warn(`silent open: nothing audible until ${quiet[0][1].toFixed(2)} s`)
if (mid.length) warn(`dead air: ${mid.map(([s, e]) => `${s.toFixed(2)}-${e.toFixed(2)} s`).join(", ")}`)
if (!mid.length && !quiet.some(([s]) => s <= 0.05)) ok("no dead air")

// Samples for the tail and the cues: mono, 16 kHz, above the kick.
const pcm = execFileSync(
  "ffmpeg",
  ["-v", "error", "-i", video, "-map", "a:0", "-ac", "1", "-ar", "16000", "-af", "highpass=f=1200", "-f", "f32le", "-"],
  { maxBuffer: 1 << 28 },
)
const samples = new Float32Array(pcm.buffer, pcm.byteOffset, Math.floor(pcm.length / 4))
const SR = 16000
const HOP = 80 // 5 ms
const energy = new Float32Array(Math.floor(samples.length / HOP))
for (let i = 0; i < energy.length; i++) {
  let sum = 0
  for (let j = 0; j < HOP; j++) sum += samples[i * HOP + j] ** 2
  energy[i] = 10 * Math.log10(sum / HOP + 1e-10)
}
// Onset strength: rise over the previous 15 ms.
const onset = energy.map((e, i) => (i < 3 ? 0 : Math.max(0, e - Math.max(energy[i - 1], energy[i - 2], energy[i - 3]))))
const rms = (from, to) => {
  let sum = 0
  let n = 0
  for (let i = Math.floor(from * SR); i < Math.min(samples.length, to * SR); i++, n++) sum += samples[i] ** 2
  return 10 * Math.log10(sum / Math.max(1, n) + 1e-10)
}

const tail = rms(duration - 0.12, duration)
const body = rms(Math.max(0, duration - 3), duration - 1)
if (tail > body - 10) warn(`ending not faded: the last 120 ms is ${(tail - body).toFixed(1)} dB against the seconds before; it will sound chopped`)
else ok(`ending fades (${(tail - body).toFixed(1)} dB in the last 120 ms)`)

// Cues: does each one produce a transient that stands out locally?
const marks = []
if (recipe?.effects?.length) {
  const masked = []
  const late = []
  // Cues within 120 ms of each other sound as one event; judge them together.
  const cues = [...recipe.effects].sort((x, y) => x.frame - y.frame)
  const groups = []
  for (const cue of cues) {
    const last = groups.at(-1)
    if (last && cue.frame / fps - last.at(-1).frame / fps <= 0.12) last.push(cue)
    else groups.push([cue])
  }
  for (const group of groups) {
    const first = group[0].frame / fps
    const lastT = group.at(-1).frame / fps
    const i0 = Math.floor(((first - 0.03) * SR) / HOP)
    const i1 = Math.floor(((lastT + 0.09) * SR) / HOP)
    let peak = 0
    let at = i0
    for (let i = Math.max(3, i0); i < Math.min(onset.length, i1); i++) if (onset[i] > peak) (peak = onset[i]), (at = i)
    // Typical transient strength in the surrounding second, cue window excluded.
    const around = []
    for (let i = Math.floor(((first - 0.6) * SR) / HOP); i < Math.floor(((lastT + 0.6) * SR) / HOP); i++) {
      if (i >= 3 && i < onset.length && (i < i0 - 4 || i > i1 + 4) && onset[i] > 0.5) around.push(onset[i])
    }
    around.sort((x, y) => x - y)
    const typical = around.length ? around[Math.floor(around.length * 0.9)] : 1
    const ratio = peak / Math.max(typical, 0.5)
    const heard = (at * HOP) / SR
    const offset = Math.min(...group.map((cue) => Math.abs(heard - cue.frame / fps))) * 1000
    const label = group.map((cue) => cue.label).join(" + ")
    const standsOut = ratio >= 1.2
    if (!standsOut) masked.push(`${label} (${ratio.toFixed(2)}x)`)
    const allowed = 50 + Math.max(...group.map((cue) => ATTACK_MS[cue.sound] ?? 50))
    if (standsOut && offset > allowed) late.push(`${label} (${offset.toFixed(0)} ms, allowed ${allowed})`)
    for (const cue of group) marks.push({ t: cue.frame / fps, colour: standsOut ? "orange" : "red" })
  }
  if (masked.length) warn(`${masked.length} cue(s) do not stand out from the music around them: ${masked.join(", ")}`)
  if (late.length) warn(`cue(s) sound off their frame: ${late.join(", ")}`)
  if (!masked.length && !late.length) ok(`all ${recipe.effects.length} cues stand out at their frames`)
  else if (masked.length) results.push("      a masked cue is usually on a music hit (the drop, a kick): move it a frame or two, raise it, or let the music carry that moment")
}

// The picture to look at.
const W = 1600
const x = (t) => Math.round((t / duration) * (W - 1))
const lines = []
if (edit) {
  let frame = 0
  for (const cut of edit.cuts.slice(0, -1)) {
    frame += cut.out - cut.in
    lines.push(`drawbox=x=${x(frame / fps)}:y=0:w=2:h=ih:color=white@0.8:t=fill`)
  }
}
if (recipe?.start !== undefined && arg("drop")) lines.push(`drawbox=x=${x(Number(arg("drop")))}:y=0:w=3:h=ih:color=green@0.9:t=fill`)
for (const mark of marks) lines.push(`drawbox=x=${x(mark.t)}:y=0:w=2:h=24:color=${mark.colour}@0.95:t=fill`, `drawbox=x=${x(mark.t)}:y=ih-24:w=2:h=24:color=${mark.colour}@0.95:t=fill`)
const graph = [
  `[0:a]showspectrumpic=s=${W}x360:legend=0:scale=log:color=intensity[spec]`,
  `[0:a]showwavespic=s=${W}x120:split_channels=0:colors=0xcfcfcf[wave]`,
  `[spec][wave]vstack=inputs=2${lines.length ? "," + lines.join(",") : ""}[img]`,
].join(";")
execFileSync("ffmpeg", ["-v", "error", "-y", "-i", video, "-filter_complex", graph, "-map", "[img]", "-frames:v", "1", out])

console.log(results.join("\n"))
console.log(`\npicture: ${out} (white = cuts, orange = cues, red = masked cues, green = music drop)`)
console.log("Measured, not heard. Look at the picture, then have a person listen once through the last frame.")
process.exit(results.some((r) => r.startsWith("warn")) ? 1 : 0)
