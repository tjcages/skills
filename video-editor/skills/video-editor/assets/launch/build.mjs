import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Render every clip at its trimmed range, then join them.
 *
 * Trimming happens at render time via Remotion's `--frames`, which is frame
 * accurate and deterministic. Joining uses the concat demuxer with stream
 * copy, so nothing is re-encoded and the clips stay exactly as rendered.
 *
 * Clips render muted. A silent AAC track per clip survives the concat and
 * each one carries its own encoder priming, which pushes the joined duration
 * past the frame count.
 *
 *   node build.mjs            render every clip, then assemble
 *   node build.mjs --assemble assemble from clips already on disk
 *   node build.mjs list feature  render only these scenes, then assemble
 */

const ENTRY = 'src/index.ts'
const CLIP_DIR = 'out/clips'
const OUTPUT = 'out/film.mp4'

const { cuts } = JSON.parse(readFileSync('src/edit.json', 'utf8'))
const args = process.argv.slice(2)
const assembleOnly = args.includes('--assemble')
const only = args.filter(arg => !arg.startsWith('--'))

function remotion(commandArgs) {
  execFileSync('npx', ['remotion', ...commandArgs], { stdio: 'inherit' })
}

mkdirSync(CLIP_DIR, { recursive: true })

const clips = cuts.map((cut, index) => ({
  ...cut,
  file: `${CLIP_DIR}/${String(index).padStart(2, '0')}-${cut.scene}.mp4`,
}))

if (!assembleOnly) {
  for (const clip of clips) {
    if (only.length > 0 && !only.includes(clip.scene)) continue
    console.log(`\nrendering ${clip.scene} ${clip.in}-${clip.out}`)
    remotion([
      'render',
      ENTRY,
      clip.scene,
      clip.file,
      `--frames=${clip.in}-${clip.out - 1}`,
      '--muted',
    ])
  }
}

const listPath = `${CLIP_DIR}/concat.txt`
writeFileSync(
  listPath,
  clips.map(clip => `file '${resolve(clip.file)}'`).join('\n') + '\n'
)

console.log('\njoining clips')
remotion([
  'ffmpeg',
  '-f',
  'concat',
  '-safe',
  '0',
  '-i',
  listPath,
  '-c',
  'copy',
  '-y',
  OUTPUT,
])

const total = clips.reduce((sum, clip) => sum + (clip.out - clip.in), 0)
console.log(`\n${OUTPUT} — ${clips.length} clips, ${total} frames`)
