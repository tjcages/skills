import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join, relative } from 'node:path'

/**
 * Lists every wall-clock dependency in a component tree before anything is
 * imported into the film, so the import-or-rebuild decision is made from a
 * list rather than from what happened to be read.
 *
 *   node scan-wallclock.mjs app-pkg/src/components [more dirs]
 */
const SIGNALS = [
  [/from\s+['"](motion|motion\/react|framer-motion|react-spring|@react-spring\/[a-z-]+|gsap|animejs|lottie-web|@lottiefiles\/[a-z-]+)['"]/, 'animation library on wall-clock time'],
  [/\b(useSpring|useMotionValue|useAnimate|useAnimationFrame|useTransform|animate)\(/, 'motion runtime call'],
  [/\b(setTimeout|setInterval|requestAnimationFrame)\(/, 'timer'],
  [/\b(Date\.now|performance\.now)\(\)|\bnew Date\(\)/, 'reads the clock'],
  [/\bMath\.random\(\)/, 'randomness'],
  [/\bcreatePortal\(|<Portal\b|\bPortal\./, 'portal, not deterministic'],
  [/\banimate-(?!none\b)[a-z0-9-]+/, 'tailwind animation utility'],
  [/@keyframes|\banimation(-name)?\s*:/, 'css animation'],
  [/\b(useContext|useQuery|useMutation|useStore|useAtom|useSelector)\(/, 'wired to app state, rebuild candidate'],
]
const EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.css'])
const SKIP = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'out'])

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue
    const path = join(dir, name)
    if (statSync(path).isDirectory()) walk(path, files)
    else if (EXTENSIONS.has(extname(name))) files.push(path)
  }
  return files
}

const roots = process.argv.slice(2)
if (roots.length === 0) {
  console.error('usage: node scan-wallclock.mjs <dir> [more dirs]')
  process.exit(2)
}
for (const root of roots) {
  if (!existsSync(root) || !statSync(root).isDirectory()) {
    console.error(`scan-wallclock: ${root} is not a directory. Pass the component tree, for example app-pkg/src/components.`)
    process.exit(2)
  }
}

let hits = 0
const byFile = new Map()
for (const root of roots) {
  for (const file of walk(root)) {
    const lines = readFileSync(file, 'utf8').split('\n')
    lines.forEach((line, index) => {
      for (const [pattern, label] of SIGNALS) {
        if (!pattern.test(line)) continue
        const key = relative(process.cwd(), file)
        if (!byFile.has(key)) byFile.set(key, [])
        byFile.get(key).push(`  ${index + 1}: ${label}  ${line.trim().slice(0, 90)}`)
        hits += 1
        break
      }
    })
  }
}

for (const [file, findings] of byFile) {
  console.log(file)
  for (const finding of findings) console.log(finding)
}
console.log(
  hits === 0
    ? 'clean: nothing here depends on wall-clock time'
    : `${hits} wall-clock dependencies in ${byFile.size} files. Import a component only when its findings are inert in the fixed state the film needs; otherwise port it to useCurrentFrame or rebuild it.`
)
