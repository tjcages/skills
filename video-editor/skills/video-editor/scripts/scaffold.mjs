import { cpSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const target = process.argv[2]
if (!target) {
  console.error('Usage: node scripts/scaffold.mjs /absolute/project-directory')
  process.exit(1)
}

const destination = resolve(target)
if (existsSync(join(destination, 'package.json'))) {
  console.error('Target already has a package.json; choose a new directory.')
  process.exit(1)
}

const source = resolve(dirname(fileURLToPath(import.meta.url)), '../assets/launch')
const rootFiles = ['package.json', 'remotion.config.ts', 'tsconfig.json', 'build.mjs', 'qc.mjs', 'similarity.mjs', 'beats.mjs', 'montage.mjs', 'scan-wallclock.mjs', '.gitignore']
const sourceFiles = ['index.ts', 'Root.tsx', 'style.css', 'camera.ts', 'motion.ts', 'scenes.ts', 'edit.json', 'text.ts', 'cursors.tsx', 'site.ts', 'fonts.ts', 'footage.tsx', 'transitions.ts', 'beats.ts', 'montage.tsx', 'montage.example.json']
mkdirSync(join(destination, 'src'), { recursive: true })
for (const file of rootFiles) cpSync(join(source, file), join(destination, file))
for (const file of sourceFiles) cpSync(join(source, file), join(destination, 'src', file))
cpSync(join(source, 'stage.template.tsx'), join(destination, 'src/stage.tsx'))
cpSync(join(source, 'film.template.tsx'), join(destination, 'src/film.tsx'))
// Runtime capture lives beside the film: capture/record.mjs + shots.mjs.
const capture = resolve(dirname(fileURLToPath(import.meta.url)), '../assets/capture')
mkdirSync(join(destination, 'capture'), { recursive: true })
cpSync(join(capture, 'record.mjs'), join(destination, 'capture/record.mjs'))
cpSync(join(capture, 'shots.example.mjs'), join(destination, 'capture/shots.mjs'))
console.log(`Scaffolded ${destination}`)
console.log('Next: node <skill>/scripts/preflight.mjs, then read references/render.md')
