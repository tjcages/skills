// Snap the edit's cut points to the music.
//
//   node beats.mjs --bed ../editor/bed.json            report only
//   node beats.mjs --bed ../editor/bed.json --write    snap and save edit.json
//
// Options: --grid 0.5 (cut on beats and off-beats; 1 = beats only),
// --tolerance 2 (frames a cut may sit off a line), --max-shift 5 (the most a
// trim moves to reach a line). Reads `music` from src/edit.json when --bed is
// omitted. Each cut's `out` moves; the next clip is untouched, so every later
// boundary shifts with it and is snapped in turn.
//
// This only edits numbers. Open the studio or run `npx tsc --noEmit` and
// `node qc.mjs` afterwards: validateEdit re-checks every motion range and
// reading hold the new trims touch, and names any snap that broke one.
import { readFileSync, writeFileSync } from 'node:fs'

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`)
  return i > 0 ? process.argv[i + 1] : fallback
}
const EDIT = 'src/edit.json'
const edit = JSON.parse(readFileSync(EDIT, 'utf8'))
const bed = arg('bed') ? JSON.parse(readFileSync(arg('bed'), 'utf8')) : null
const music = {
  ...(edit.music ?? {}),
  ...(bed ? { bpm: bed.bpm, start: bed.start, phase: bed.phase ?? 0 } : {}),
}
if (!music.bpm || music.start === undefined) {
  console.error('No music grid: pass --bed <bed.json> from bed.mjs, or add "music": { "bpm", "start" } to edit.json.')
  process.exit(1)
}
music.grid = Number(arg('grid', music.grid ?? 0.5))
music.tolerance = Number(arg('tolerance', music.tolerance ?? 2))
const maxShift = Number(arg('max-shift', 5))
const fps = 30
const step = (60 / music.bpm) * music.grid * fps
const origin = ((music.phase ?? 0) - music.start) * fps
const nearest = frame => origin + Math.round((frame - origin) / step) * step

const cuts = edit.cuts.map(cut => ({ ...cut }))
let boundary = 0
let onGrid = 0
const rows = []
cuts.slice(0, -1).forEach((cut, index) => {
  boundary += cut.out - cut.in
  const line = nearest(boundary)
  const offset = boundary - line
  let action = 'on the music'
  if (Math.abs(offset) <= music.tolerance) onGrid += 1
  else {
    const shift = Math.round(line) - boundary
    if (Math.abs(shift) <= maxShift) {
      cut.out += shift
      boundary += shift
      onGrid += 1
      action = `out ${cut.out - shift} -> ${cut.out} (${shift > 0 ? '+' : ''}${shift})`
    } else action = `off by ${offset.toFixed(1)}; nearest line needs ${shift} frames, beyond --max-shift`
  }
  rows.push(`${`${cut.scene} | ${cuts[index + 1].scene}`.padEnd(30)} frame ${String(boundary).padStart(4)}  ${action}`)
})

console.log(`grid: ${music.bpm} BPM, a line every ${step.toFixed(2)} frames (${music.grid} beat), tolerance ${music.tolerance}`)
console.log(rows.join('\n'))
console.log(`${onGrid}/${cuts.length - 1} cuts on the music`)

if (process.argv.includes('--write')) {
  const { bpm, start, phase, grid, tolerance } = music
  writeFileSync(EDIT, JSON.stringify({ ...edit, music: { bpm, start, phase, grid, tolerance }, cuts }, null, 2) + '\n')
  console.log(`wrote ${EDIT}. Now run npx tsc --noEmit (or open the studio) and node qc.mjs.`)
}
