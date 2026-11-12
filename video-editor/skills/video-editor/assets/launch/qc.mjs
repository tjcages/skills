import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync } from 'node:fs'
import { inflateSync } from 'node:zlib'

import { compareFrames, isSamePicture } from './similarity.mjs'

/**
 * Renders the frames that matter and checks them for the defects that are
 * invisible in code and obvious in a picture: content clipped at the frame
 * edge, an empty band where the content ran out, and a cut that lands on a
 * near-identical picture. Warnings exit 1 so they cannot be skipped; every
 * one names the frame to open.
 *
 *   node qc.mjs                       every cut's in and out frame
 *   node qc.mjs --wide=establish,resolve --flat=title
 *
 * `--wide` names the shots allowed to touch the edge (BASE shots framing the
 * whole panel). `--flat` names the shots allowed a large flat area (a title
 * card on a plain canvas). The film's last frame is never checked for
 * flatness, because it has faded to the canvas by design.
 */
const ENTRY = 'src/index.ts'
const EDIT = 'src/edit.json'
const OUT_DIR = 'out/qc'
const MARGIN = 60
const MARGIN_FILL_LIMIT = 0.02
const FLAT_BAND_LIMIT = 0.35
const COLOUR_TOLERANCE = 24

const args = new Map(
  process.argv.slice(2).map(arg => {
    const [key, value = ''] = arg.replace(/^--/, '').split('=')
    return [key, new Set(value.split(',').filter(Boolean))]
  })
)
const wide = args.get('wide') ?? new Set()
const flat = args.get('flat') ?? new Set()

function still(scene, frame) {
  const path = `${OUT_DIR}/${scene}-${String(frame).padStart(4, '0')}.png`
  execFileSync('npx', ['remotion', 'still', ENTRY, scene, path, `--frame=${frame}`], {
    stdio: ['ignore', 'ignore', 'inherit'],
  })
  return path
}

function paeth(a, b, c) {
  const p = a + b - c
  const pa = Math.abs(p - a)
  const pb = Math.abs(p - b)
  const pc = Math.abs(p - c)
  if (pa <= pb && pa <= pc) return a
  return pb <= pc ? b : c
}

function decodePng(path) {
  const data = readFileSync(path)
  let offset = 8
  let width = 0
  let height = 0
  let channels = 0
  const idat = []
  while (offset < data.length) {
    const length = data.readUInt32BE(offset)
    const type = data.toString('ascii', offset + 4, offset + 8)
    const body = data.subarray(offset + 8, offset + 8 + length)
    if (type === 'IHDR') {
      width = body.readUInt32BE(0)
      height = body.readUInt32BE(4)
      const colourType = body[9]
      channels = colourType === 6 ? 4 : colourType === 2 ? 3 : 0
      if (body[8] !== 8 || channels === 0 || body[12] !== 0) {
        throw new Error(`${path}: only 8-bit RGB or RGBA non-interlaced PNGs are supported`)
      }
    }
    if (type === 'IDAT') idat.push(body)
    offset += 12 + length
  }
  const raw = inflateSync(Buffer.concat(idat))
  const stride = width * channels
  const pixels = Buffer.alloc(width * height * 3)
  let previous = Buffer.alloc(stride)
  let at = 0
  for (let y = 0; y < height; y++) {
    const filter = raw[at]
    const line = Buffer.from(raw.subarray(at + 1, at + 1 + stride))
    at += 1 + stride
    for (let x = 0; x < stride; x++) {
      const left = x >= channels ? line[x - channels] : 0
      const up = previous[x]
      const upLeft = x >= channels ? previous[x - channels] : 0
      if (filter === 1) line[x] = (line[x] + left) & 255
      else if (filter === 2) line[x] = (line[x] + up) & 255
      else if (filter === 3) line[x] = (line[x] + ((left + up) >> 1)) & 255
      else if (filter === 4) line[x] = (line[x] + paeth(left, up, upLeft)) & 255
    }
    for (let x = 0; x < width; x++) {
      const source = x * channels
      const target = (y * width + x) * 3
      pixels[target] = line[source]
      pixels[target + 1] = line[source + 1]
      pixels[target + 2] = line[source + 2]
    }
    previous = line
  }
  return { width, height, pixels }
}

function differs(image, index, r, g, b) {
  const at = index * 3
  return (
    Math.abs(image.pixels[at] - r) > COLOUR_TOLERANCE ||
    Math.abs(image.pixels[at + 1] - g) > COLOUR_TOLERANCE ||
    Math.abs(image.pixels[at + 2] - b) > COLOUR_TOLERANCE
  )
}

/** The canvas colour: what the very corner of the frame is painted in. */
function background(image) {
  return [image.pixels[0], image.pixels[1], image.pixels[2]]
}

function marginFill(image) {
  const [r, g, b] = background(image)
  let inside = 0
  let total = 0
  for (let y = 0; y < image.height; y++) {
    const edgeRow = y < MARGIN || y >= image.height - MARGIN
    for (let x = 0; x < image.width; x++) {
      if (!edgeRow && x >= MARGIN && x < image.width - MARGIN) continue
      total += 1
      if (differs(image, y * image.width + x, r, g, b)) inside += 1
    }
  }
  return inside / total
}

function longestFlatBand(image) {
  let longest = 0
  let run = 0
  for (let y = 0; y < image.height; y++) {
    const start = y * image.width * 3
    const r = image.pixels[start]
    const g = image.pixels[start + 1]
    const b = image.pixels[start + 2]
    let isFlat = true
    for (let x = 0; x < image.width; x += 4) {
      if (differs(image, y * image.width + x, r, g, b)) {
        isFlat = false
        break
      }
    }
    run = isFlat ? run + 1 : 0
    longest = Math.max(longest, run)
  }
  return longest / image.height
}

const cuts = JSON.parse(readFileSync(EDIT, 'utf8')).cuts
mkdirSync(OUT_DIR, { recursive: true })
const warnings = []
let previousOut = null

// The hook lands in the first second, so the film's first frame must
// already show something: not a blank canvas waiting for a fade or a title.
function blankShare(image) {
  const [r, g, b] = background(image)
  let same = 0
  let total = 0
  for (let i = 0; i < image.width * image.height; i += 7, total++) if (!differs(image, i, r, g, b)) same++
  return same / total
}

cuts.forEach((cut, index) => {
  const inPath = still(cut.scene, cut.in)
  const outPath = still(cut.scene, cut.out - 1)
  const frames = [
    [cut.in, decodePng(inPath), inPath],
    [cut.out - 1, decodePng(outPath), outPath],
  ]

  const lastFrameOfFilm = index === cuts.length - 1 ? cut.out - 1 : -1
  if (index === 0) {
    const blank = blankShare(frames[0][1])
    if (blank > 0.985) {
      warnings.push(
        `${cut.scene} frame ${cut.in}: the film opens on a blank frame (${(blank * 100).toFixed(1)}% one colour). The hook lands in the first second: start on something striking already in motion. Open ${inPath}.`
      )
    }
  }

  for (const [frame, image, path] of frames) {
    const fill = marginFill(image)
    if (!wide.has(cut.scene) && fill > MARGIN_FILL_LIMIT) {
      warnings.push(
        `${cut.scene} frame ${frame}: ${(fill * 100).toFixed(1)}% of the ${MARGIN}px margin band is content, so something reads right at the edge. Open ${path}. Reframe, or pass --wide=${cut.scene} if this shot frames the whole panel on purpose.`
      )
    }
    const band = longestFlatBand(image)
    if (!flat.has(cut.scene) && frame !== lastFrameOfFilm && band > FLAT_BAND_LIMIT) {
      warnings.push(
        `${cut.scene} frame ${frame}: an empty band covers ${(band * 100).toFixed(0)}% of the height. Open ${path}. The content ran out, or the subject is off-frame; pass --flat=${cut.scene} only for a plain title card.`
      )
    }
  }

  // A cut must change the picture. Pixel difference is fooled by a reframe
  // (every pixel moves, the viewer sees the same shot), so the frames are
  // aligned first; see similarity.mjs. Impact cuts are not exempt: a hard
  // cut to the same surface reads as a glitch, not as emphasis. Only a
  // declared `punch` (two or more tiers, checked by validateEdit) may.
  if (index > 0 && previousOut && cut.continuity !== 'punch' && cut.continuity !== 'handoff') {
    const same = compareFrames(previousOut.image, frames[0][1])
    if (isSamePicture(same)) {
      warnings.push(
        `${previousOut.scene} to ${cut.scene}: the incoming frame is the outgoing picture again, reframed about ${same.zoom.toFixed(2)}x (structure ${same.correlation.toFixed(2)}, colour distance ${same.colour.toFixed(0)}). A near-identical cut reads as a stutter. Make the two shots one continuous camera move, or cut to a different surface or a visibly changed state, or declare a "punch" of two or more tiers.`
      )
    }
  }
  previousOut = { scene: cut.scene, image: frames[1][1] }
})

if (warnings.length === 0) {
  console.log(`qc: ${cuts.length * 2} frames checked, nothing to report. Now read them anyway; the checks catch the obvious, not the taste.`)
  process.exit(0)
}
console.log(`qc: ${warnings.length} warning${warnings.length === 1 ? '' : 's'}\n- ${warnings.join('\n- ')}`)
process.exit(1)
