/**
 * Is the incoming frame the outgoing frame again, merely reframed?
 *
 * A plain pixel difference cannot answer that: a 1.3x reframe of a busy
 * picture moves every pixel, scores as "different", and still reads as the
 * same shot to a viewer, which is the jump cut the edit must avoid. This
 * aligns the two frames first. It shrinks both to a thumbnail, searches the
 * zoom and offset that best lay the incoming frame over the outgoing one,
 * and scores the aligned overlap on structure (luminance correlation) and
 * colour. A high score means "same surface, same state, new crop".
 *
 * Pure JS, no dependencies. Inputs are `{ width, height, pixels }` with
 * packed RGB bytes, as `decodePng` in qc.mjs returns.
 */

const W = 96
const H = 54
const ZOOM_MAX = 2.4
const ZOOM_STEP = 1.07
const OFFSET_RANGE = 0.3
const OFFSET_STEP = 2
const MIN_OVERLAP = 0.35

/** Box-filter an RGB image down to W x H, returning luminance and RGB. */
export function thumbnail(image) {
  const lum = new Float32Array(W * H)
  const rgb = new Float32Array(W * H * 3)
  const sx = image.width / W
  const sy = image.height / H
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let r = 0
      let g = 0
      let b = 0
      let n = 0
      const x0 = Math.floor(x * sx)
      const x1 = Math.floor((x + 1) * sx)
      const y0 = Math.floor(y * sy)
      const y1 = Math.floor((y + 1) * sy)
      for (let yy = y0; yy < y1; yy += 2) {
        for (let xx = x0; xx < x1; xx += 2) {
          const at = (yy * image.width + xx) * 3
          r += image.pixels[at]
          g += image.pixels[at + 1]
          b += image.pixels[at + 2]
          n += 1
        }
      }
      const i = y * W + x
      rgb[i * 3] = r / n
      rgb[i * 3 + 1] = g / n
      rgb[i * 3 + 2] = b / n
      lum[i] = (0.2126 * r + 0.7152 * g + 0.0722 * b) / n
    }
  }
  return { lum, rgb }
}

function score(a, b, zoom, dx, dy) {
  const cx = W / 2
  const cy = H / 2
  let n = 0
  let sa = 0
  let sb = 0
  let saa = 0
  let sbb = 0
  let sab = 0
  let colour = 0
  for (let y = 0; y < H; y++) {
    const ay = Math.round(cy + (y - cy) / zoom + dy)
    if (ay < 0 || ay >= H) continue
    for (let x = 0; x < W; x++) {
      const ax = Math.round(cx + (x - cx) / zoom + dx)
      if (ax < 0 || ax >= W) continue
      const ia = ay * W + ax
      const ib = y * W + x
      const va = a.lum[ia]
      const vb = b.lum[ib]
      sa += va
      sb += vb
      saa += va * va
      sbb += vb * vb
      sab += va * vb
      colour +=
        Math.abs(a.rgb[ia * 3] - b.rgb[ib * 3]) +
        Math.abs(a.rgb[ia * 3 + 1] - b.rgb[ib * 3 + 1]) +
        Math.abs(a.rgb[ia * 3 + 2] - b.rgb[ib * 3 + 2])
      n += 1
    }
  }
  const overlap = n / (W * H)
  if (overlap < MIN_OVERLAP) return null
  const va = saa / n - (sa / n) ** 2
  const vb = sbb / n - (sb / n) ** 2
  // Near-flat overlap (a dark page against a title card's background) says
  // nothing about whether the pictures match, so it never scores as same.
  const correlation = va < 25 || vb < 25 ? 0 : (sab / n - (sa / n) * (sb / n)) / Math.sqrt(va * vb)
  return { correlation, colour: colour / n / 3, zoom, overlap, dx, dy }
}

/**
 * Best alignment of `incoming` over `outgoing`. `zoom` > 1 means the
 * incoming frame shows the outgoing picture magnified (a push in).
 */
export function compareFrames(outgoing, incoming) {
  const a = thumbnail(outgoing)
  const b = thumbnail(incoming)
  let best = { correlation: -1, colour: 255, zoom: 1, overlap: 0, dx: 0, dy: 0 }
  const consider = r => {
    if (r && r.correlation > best.correlation) best = r
  }

  // Coarse: geometric zoom steps, a grid of offsets.
  const rangeX = Math.round(W * OFFSET_RANGE)
  const rangeY = Math.round(H * OFFSET_RANGE)
  for (let zoom = 1 / ZOOM_MAX; zoom <= ZOOM_MAX; zoom *= ZOOM_STEP) {
    for (let dy = -rangeY; dy <= rangeY; dy += OFFSET_STEP) {
      for (let dx = -rangeX; dx <= rangeX; dx += OFFSET_STEP) consider(score(a, b, zoom, dx, dy))
    }
  }
  // Fine: around the coarse winner.
  const coarse = best
  for (let zoom = coarse.zoom / ZOOM_STEP; zoom <= coarse.zoom * ZOOM_STEP; zoom *= 1.01) {
    for (let dy = coarse.dy - OFFSET_STEP; dy <= coarse.dy + OFFSET_STEP; dy += 0.5) {
      for (let dx = coarse.dx - OFFSET_STEP; dx <= coarse.dx + OFFSET_STEP; dx += 0.5) consider(score(a, b, zoom, dx, dy))
    }
  }
  return best
}

/**
 * Tuned on the Panels dogfood film (see video-editor/dogfood/): six cuts
 * between reframings of one panel on one page scored 0.93-1.00 correlation
 * with colour distance under 11; genuinely different pictures scored 0.58 or
 * lower, or differed by 22+ in colour. The measured zoom is approximate (a
 * moving background drags it toward 1), so it is reported, never trusted to
 * excuse a cut; the declared tiers of a `punch` cut do that.
 */
export const SAME_PICTURE = { correlation: 0.8, colour: 18 }

export function isSamePicture(result) {
  return result.correlation >= SAME_PICTURE.correlation && result.colour <= SAME_PICTURE.colour
}
