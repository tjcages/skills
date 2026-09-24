// Headless soundtrack: cue sheet + cut map + song → mixed, level-checked,
// loudness-mastered MP4. The same recipe the visual editor would save, for
// agents that cannot listen and must measure instead.
//
//   node render-mix.mjs --video film.mp4 --edit edit.json --cues cues.json \
//     --song bed.wav --start 0.456 --out film-with-sound.mp4
//
// Steps: build the v2 mix recipe (saved beside --out as .mix.json so the
// visual editor can reopen it), export with mix.mjs, report every cue's
// peak against the music under it, then master to -14 LUFS / -1.5 dBFS with
// the picture stream copied.
//
// Defaults come from the Panels dogfood: Cuelume samples peak around -12 to
// -21 dBFS, so a bed at editor volume 0.85 buried every cue 15-40 dB down.
// Music 0.3 still left the small press/release clicks 0-4 dB over the bed;
// 0.2 cleared 16 of 17 cues. Mastering restores overall loudness either way.
import { execFileSync, spawnSync } from "node:child_process"
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { resolveCues } from "./effects.mjs"

const here = dirname(fileURLToPath(import.meta.url))
const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > 0 ? process.argv[i + 1] : fallback
}
const video = resolve(arg("video"))
const edit = JSON.parse(readFileSync(arg("edit"), "utf8"))
const sheet = JSON.parse(readFileSync(arg("cues"), "utf8"))
const song = arg("song") ? resolve(arg("song")) : null
const out = resolve(arg("out", "film-with-sound.mp4"))
const MIN_CUE_OVER_BED = Number(arg("min-cue-db", 4))
const LUFS = Number(arg("lufs", -14))

// A concat-copied film may carry no stream duration; fall back to the container.
const probe = (entries) =>
  Number(execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", entries, "-of", "csv=p=0", video], { encoding: "utf8" }).trim())
const duration = [probe("stream=duration"), probe("format=duration")].find((value) => Number.isFinite(value) && value > 0)
if (!duration) throw Error(`Could not read the duration of ${video}`)
const mix = {
  version: 2,
  start: Number(arg("start", 0)),
  duration,
  volume: Number(arg("music", 0.22)),
  fadeIn: 0.4,
  fadeOut: Math.min(1.6, duration / 4),
  musicSpeed: 1,
  effectsSpeed: 1,
  fps: 30,
  effects: resolveCues(edit, sheet),
  effectsVolume: Number(arg("effects", 1)),
  effectsEnabled: true,
  musicEnabled: Boolean(song),
}
const recipe = out.replace(/\.mp4$/, "") + ".mix.json"
writeFileSync(recipe, JSON.stringify(mix, null, 2))

const temp = mkdtempSync(join(tmpdir(), "render-mix-"))
const exportMix = (settings, file) => {
  const path = join(temp, `${file}.json`)
  writeFileSync(path, JSON.stringify(settings))
  const args = [join(here, "mix.mjs"), "--video", video, "--mix", path, "--out", join(temp, `${file}.mp4`)]
  if (settings.musicEnabled) args.push("--song", song)
  execFileSync(process.execPath, args, { stdio: ["ignore", "ignore", "inherit"] })
  return join(temp, `${file}.mp4`)
}
// One astats pass over a short window; returns the last matching value.
const astat = (file, at, span, stat) => {
  const { stderr } = spawnSync(
    "ffmpeg",
    ["-hide_banner", "-ss", String(Math.max(0, at)), "-t", String(span), "-i", file, "-af", "astats=metadata=0", "-f", "null", "-"],
    { encoding: "utf8" },
  )
  const value = Number(stderr.split("\n").filter((line) => line.includes(stat)).at(-1)?.split(":").at(-1))
  return Number.isFinite(value) ? value : -Infinity
}

try {
  const mixed = exportMix(mix, "mixed")

  // Level report: each cue's peak in the effects-only render against the
  // music-only RMS over the same 150 ms.
  if (song && mix.effects.length) {
    const effectsOnly = exportMix({ ...mix, musicEnabled: false }, "effects")
    const musicOnly = exportMix({ ...mix, effectsEnabled: false }, "music")
    const buried = []
    console.log("cue                              over bed")
    for (const cue of mix.effects) {
      const at = cue.frame / mix.fps
      const peak = astat(effectsOnly, at, 0.15, "Peak level dB")
      const bed = astat(musicOnly, at, 0.15, "RMS level dB")
      const over = peak - bed
      console.log(`${cue.label.slice(0, 32).padEnd(33)}${over.toFixed(1).padStart(6)} dB`)
      if (over < MIN_CUE_OVER_BED) buried.push(`${cue.label} (${over.toFixed(1)} dB)`)
    }
    if (buried.length) {
      console.log(
        `\n${buried.length} cue(s) under +${MIN_CUE_OVER_BED} dB will not read over the music: ${buried.join(", ")}.` +
          ` Lower --music or raise those cues' volume.`,
      )
    }
  }

  // Master: linear gain to the target, then a limiter at -1.5 dBFS.
  const integrated = (() => {
    const { stderr } = spawnSync("ffmpeg", ["-hide_banner", "-i", mixed, "-af", "ebur128", "-f", "null", "-"], { encoding: "utf8" })
    const summary = stderr.slice(stderr.lastIndexOf("Summary"))
    return Number(summary.match(/I:\s+(-?[\d.]+) LUFS/)?.[1])
  })()
  const gain = +(LUFS - integrated).toFixed(2)
  execFileSync("ffmpeg", [
    "-v", "error", "-y", "-i", mixed, "-c:v", "copy",
    "-af", `volume=${gain}dB,alimiter=limit=0.84:level=false`,
    "-t", String(duration), "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out,
  ])
  console.log(`\n${out}: ${integrated} LUFS mix, ${gain >= 0 ? "+" : ""}${gain} dB to ${LUFS} LUFS; recipe ${recipe}`)
  console.log("Measured, not heard: listen once through the final frame before calling it done.")
} finally {
  rmSync(temp, { recursive: true, force: true })
}
