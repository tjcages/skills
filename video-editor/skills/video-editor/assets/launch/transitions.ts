import type { CSSProperties } from 'react'
import { interpolate } from 'remotion'

import { CANVAS, EASE, type EaseName } from './camera'

/**
 * Handoff transitions. Scenes render as separate clips and are joined by
 * concatenation, so nothing overlaps across a cut. A designed transition is
 * therefore split in two: the outgoing scene *ends* on a shared frame and the
 * incoming scene *starts* from the same frame, then the cut between them is
 * invisible (`continuity: 'handoff'` in edit.json).
 *
 * Every transition must be motivated by the product: the colour that floods
 * is the theme the user just switched to, the wipe runs the way the slider
 * was dragged, the element that carries is the one that was clicked. A
 * generic dissolve between unrelated screens is still not a transition.
 *
 * All of these are pure functions of the frame; no CSS animation.
 */

function progress(frame: number, range: [number, number], ease: EaseName) {
  return interpolate(frame, range, [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE[ease],
  })
}

const DIAGONAL = Math.hypot(CANVAS.width, CANVAS.height)

/**
 * A circle of `colour` grows from `origin` (the control that caused it, in
 * canvas pixels) until it covers the frame. Put it on top of the outgoing
 * scene's last frames; start the incoming scene on `colour` and reveal it
 * with `flood(..., 'out')` or simply let its content enter on that colour.
 */
export function flood(
  frame: number,
  range: [number, number],
  origin: { x: number; y: number },
  colour: string,
  direction: 'in' | 'out' = 'in',
  ease: EaseName = direction === 'in' ? 'leave' : 'arrive'
): CSSProperties {
  const p = progress(frame, range, ease)
  const reach =
    Math.max(
      Math.hypot(origin.x, origin.y),
      Math.hypot(CANVAS.width - origin.x, origin.y),
      Math.hypot(origin.x, CANVAS.height - origin.y),
      Math.hypot(CANVAS.width - origin.x, CANVAS.height - origin.y)
    ) || DIAGONAL
  const radius = (direction === 'in' ? p : 1 - p) * reach
  return {
    position: 'absolute',
    inset: 0,
    background: colour,
    clipPath: `circle(${radius}px at ${origin.x}px ${origin.y}px)`,
  }
}

/**
 * A straight wipe travelling `toward` a side. Use it for the incoming layer
 * inside one scene (two states of the same product), or with a solid colour
 * to hand off, running in the direction of the gesture that caused it.
 */
export function wipe(
  frame: number,
  range: [number, number],
  toward: 'left' | 'right' | 'up' | 'down',
  ease: EaseName = 'glide'
): CSSProperties {
  const hidden = `${(1 - progress(frame, range, ease)) * 100}%`
  const inset = {
    right: `inset(0 ${hidden} 0 0)`,
    left: `inset(0 0 0 ${hidden})`,
    down: `inset(0 0 ${hidden} 0)`,
    up: `inset(${hidden} 0 0 0)`,
  }[toward]
  return { position: 'absolute', inset: 0, clipPath: inset }
}

/**
 * Push through: the camera accelerates into a point until it is inside the
 * subject (a swatch, a card), which then fills the frame with one colour or
 * texture the next scene starts from. Returns the extra scale to multiply
 * into the camera for the outgoing scene's last frames.
 */
export function pushThrough(frame: number, range: [number, number], depth = 12): number {
  const p = progress(frame, range, 'leave')
  return 1 + (depth - 1) * p * p
}
