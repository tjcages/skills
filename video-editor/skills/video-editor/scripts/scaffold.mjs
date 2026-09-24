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
const rootFiles = ['package.json', 'remotion.config.ts', 'tsconfig.json', 'build.mjs', 'qc.mjs', 'scan-wallclock.mjs', '.gitignore']
const sourceFiles = ['index.ts', 'Root.tsx', 'style.css', 'camera.ts', 'motion.ts', 'scenes.ts', 'edit.json', 'text.ts', 'cursors.tsx', 'site.ts', 'fonts.ts']
mkdirSync(join(destination, 'src'), { recursive: true })
for (const file of rootFiles) cpSync(join(source, file), join(destination, file))
for (const file of sourceFiles) cpSync(join(source, file), join(destination, 'src', file))
cpSync(join(source, 'stage.template.tsx'), join(destination, 'src/stage.tsx'))
cpSync(join(source, 'film.template.tsx'), join(destination, 'src/film.tsx'))
console.log(`Scaffolded ${destination}`)
