// Checks the machine before any film work, so environment problems surface in
// one pass instead of one at a time mid-render.
//
//   node scripts/preflight.mjs
//
// Exit 1 on a blocker; warnings print a workaround and do not fail.
import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync } from 'node:fs'

const blockers = []
const warnings = []
const ok = []

const [major, minor] = process.versions.node.split('.').map(Number)
if (major < 22 || (major === 22 && minor < 12)) blockers.push(`Node ${process.versions.node}: need 22.12+`)
else ok.push(`node ${process.versions.node}`)

for (const tool of ['ffmpeg', 'ffprobe']) {
  try {
    execFileSync(tool, ['-version'], { stdio: 'ignore' })
    ok.push(tool)
  } catch {
    blockers.push(`${tool} missing: install FFmpeg (apt-get install ffmpeg / brew install ffmpeg)`)
  }
}

async function reachable(url) {
  try {
    const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(8000) })
    return response.status < 400 ? true : `HTTP ${response.status}`
  } catch (error) {
    return error.cause?.code ?? error.message
  }
}

// Remotion downloads its own Chrome on first render. Sandboxes often block it.
const remotionChrome = await reachable('https://remotion.media/')
if (process.env.REMOTION_CHROME && existsSync(process.env.REMOTION_CHROME)) {
  ok.push(`REMOTION_CHROME=${process.env.REMOTION_CHROME}`)
} else if (remotionChrome !== true) {
  const local = findLocalChromium()
  warnings.push(
    `remotion.media unreachable (${remotionChrome}); Remotion cannot fetch its Chrome.` +
      (local ? ` Set REMOTION_CHROME=${local}` : ' Set REMOTION_CHROME to a local headless Chromium.')
  )
} else ok.push('remotion.media reachable')

// Google Fonts through a proxy can fail TLS inside the render browser even
// when curl works. Self-hosted woff2 via @remotion/fonts always works.
const gstatic = await reachable('https://fonts.gstatic.com/')
if (gstatic !== true) warnings.push(`fonts.gstatic.com: ${gstatic}. Self-host fonts (see references/render.md)`)
else ok.push('fonts.gstatic.com reachable (still prefer self-hosted fonts for determinism)')

try {
  await import('playwright')
  ok.push('playwright (runtime capture)')
} catch {
  warnings.push('playwright not installed here: needed for capture/record.mjs (npm i -D playwright)')
}

function findLocalChromium() {
  const roots = [process.env.PLAYWRIGHT_BROWSERS_PATH, '/opt/pw-browsers', `${process.env.HOME}/.cache/ms-playwright`].filter(Boolean)
  // Prefer a headless shell: it is what Remotion itself downloads.
  const bins = ['chrome-linux/headless_shell', 'chrome-headless-shell-linux64/chrome-headless-shell', 'chrome-linux/chrome']
  for (const bin of bins) {
    for (const root of roots) {
      if (!existsSync(root)) continue
      for (const dir of readdirSync(root)) {
        const path = `${root}/${dir}/${bin}`
        if (existsSync(path)) return path
      }
    }
  }
  return null
}

console.log(ok.map(line => `ok    ${line}`).join('\n'))
if (warnings.length) console.log(warnings.map(line => `warn  ${line}`).join('\n'))
if (blockers.length) {
  console.log(blockers.map(line => `FAIL  ${line}`).join('\n'))
  process.exit(1)
}
