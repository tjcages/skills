// Write a beat-aligned breadth montage into edit.json.
//
//   node montage.mjs            report the planned cuts
//   node montage.mjs --write    replace the montage-* cuts in src/edit.json
//
// Reads src/montage.json (see montage.tsx for the shape) and the music grid
// in edit.json (`node beats.mjs --bed … --write` puts it there). Glimpses
// follow the scene named by montage.after; each cut boundary lands on the
// music, every `beats` beats. Checks each glimpse fits its recorded clip and
// that neighbours show different surfaces, then leaves the rest of the
// checking to validateEdit and qc.mjs.
import { existsSync, readFileSync, writeFileSync } from 'node:fs'

const EDIT = 'src/edit.json'
const montage = JSON.parse(readFileSync('src/montage.json', 'utf8'))
const edit = JSON.parse(readFileSync(EDIT, 'utf8'))
const music = edit.music
if (!music?.bpm || music.start === undefined) {
  console.error('edit.json has no "music" grid. Run node beats.mjs --bed <bed.json> --write first.')
  process.exit(1)
}
const LEAD = 4
const MIN = 8
const fps = 30
const beatFrames = (60 / music.bpm) * fps
const origin = ((music.phase ?? 0) - music.start) * fps
const step = beatFrames * montage.beats

const problems = []
const kept = edit.cuts.filter(cut => !cut.scene.startsWith('montage-'))
const afterIndex = kept.findIndex(cut => cut.scene === montage.after)
if (afterIndex < 0) {
  console.error(`montage.after "${montage.after}" is not a scene in edit.json`)
  process.exit(1)
}
let boundary = kept.slice(0, afterIndex + 1).reduce((sum, cut) => sum + cut.out - cut.in, 0)

// Each glimpse ends on the next grid line at least MIN frames on.
const cuts = montage.glimpses.map((glimpse, i) => {
  const n = Math.ceil((boundary + MIN - origin) / step - 1e-6)
  const end = Math.round(origin + n * step)
  const length = end - boundary
  boundary = end
  const surface = glimpse.surface ?? glimpse.clip
  const previous = montage.glimpses[i - 1]
  if (previous && (previous.surface ?? previous.clip) === surface) {
    problems.push(`${glimpse.id}: same surface "${surface}" as ${previous.id}; reorder so neighbours differ`)
  }
  const track = `public/footage/${glimpse.clip}.cursor.json`
  if (existsSync(track)) {
    const frames = JSON.parse(readFileSync(track, 'utf8')).frames
    if (Math.max(0, glimpse.at - LEAD) + length > frames) {
      problems.push(`${glimpse.id}: needs clip frames up to ${Math.max(0, glimpse.at - LEAD) + length}, ${glimpse.clip} has ${frames}`)
    }
  }
  return { scene: `montage-${glimpse.id}`, in: 0, out: length, continuity: 'momentum' }
})

const start = kept.slice(0, afterIndex + 1).reduce((sum, cut) => sum + cut.out - cut.in, 0)
console.log(`montage after ${montage.after} at frame ${start}: ${cuts.length} glimpses, a cut every ${montage.beats} beat(s) (${step.toFixed(1)} frames)`)
cuts.forEach(cut => console.log(`  ${cut.scene.padEnd(28)} ${String(cut.out).padStart(3)} frames`))
console.log(`  total ${(cuts.reduce((sum, cut) => sum + cut.out, 0) / fps).toFixed(2)} s`)
if (problems.length) {
  console.log(`\n${problems.map(p => `- ${p}`).join('\n')}`)
  process.exit(1)
}
if (process.argv.includes('--write')) {
  const next = [...kept.slice(0, afterIndex + 1), ...cuts, ...kept.slice(afterIndex + 1)]
  writeFileSync(EDIT, JSON.stringify({ ...edit, cuts: next }, null, 2) + '\n')
  console.log(`wrote ${EDIT}. The cut after the montage may now sit off the music: run node beats.mjs.`)
}
