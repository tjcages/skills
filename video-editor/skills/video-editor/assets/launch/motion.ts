import { interpolate, spring } from 'remotion'

import { EASE, type EaseName } from './camera'

/**
 * Spring configs. Springs are for things that settle physically; the easing
 * curves in `camera.ts` are for things that travel a known distance.
 */
export const SPRING = {
  /** Content arriving. Barely overshoots. */
  entrance: { damping: 21, mass: 0.65, stiffness: 160 },
  /** Something landing that should feel satisfying. Overshoots visibly. */
  pop: { damping: 13, mass: 0.5, stiffness: 320 },
  /** A surface opening. Crisp, no bounce. */
  snap: { damping: 26, mass: 0.45, stiffness: 260 },
  /** A control being operated. Fast and mechanical. */
  flick: { damping: 18, mass: 0.35, stiffness: 420 },
} as const

export const STAGGER_FRAMES = 3

/** Shorthand for an eased 0 to 1 ramp over a frame range. */
export function ramp(
  frame: number,
  range: [number, number],
  ease: EaseName = 'standard'
): number {
  return interpolate(frame, range, [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE[ease],
  })
}

/** Eased travel between two values. The workhorse for scroll and position. */
export function move(
  frame: number,
  range: [number, number],
  values: [number, number],
  ease: EaseName = 'standard'
): number {
  return interpolate(frame, range, values, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE[ease],
  })
}

export function entrance(
  frame: number,
  fps: number,
  delay = 0
): { opacity: number; translateY: number } {
  const progress = spring({ frame, fps, delay, config: SPRING.entrance })
  return { opacity: progress, translateY: 20 * (1 - progress) }
}

export function pop(frame: number, fps: number, delay = 0): number {
  return spring({ frame, fps, delay, config: SPRING.pop })
}

export function snap(frame: number, fps: number, delay = 0): number {
  return spring({ frame, fps, delay, config: SPRING.snap })
}

export function flick(frame: number, fps: number, delay = 0): number {
  return spring({ frame, fps, delay, config: SPRING.flick })
}

export function staggerDelay(index: number, step = STAGGER_FRAMES): number {
  return index * step
}

/**
 * Anticipation. A small move against the direction of travel just before the
 * real move, so the main action reads as intended rather than as a jump. Add
 * it to whatever the primary movement is.
 */
export function anticipate(
  frame: number,
  start: number,
  distance = 12,
  windUp = 6
): number {
  const back = ramp(frame, [start - windUp, start], 'arrive')
  const release = ramp(frame, [start, start + windUp], 'standard')
  return -distance * back * (1 - release)
}

/**
 * Follow through. The same progress as the primary movement, delayed by a few
 * frames, so secondary elements settle after the thing that carried them
 * rather than in lockstep with it.
 */
export function followThrough(
  frame: number,
  range: [number, number],
  lag = 4,
  ease: EaseName = 'arrive'
): number {
  return ramp(frame, [range[0] + lag, range[1] + lag], ease)
}

/**
 * One continuous position, never per-item crossfades. Feed the result to a
 * single highlight element so it glides across items instead of hopping.
 */
export function glide(
  frame: number,
  frames: [number, number],
  positions: [number, number]
): number {
  return move(frame, frames, positions, 'glide')
}

/**
 * Dock-style magnification that travels with `activePos`, so emphasis moves
 * physically through a list rather than switching on and off.
 */
export function wave(
  index: number,
  activePos: number
): { magnify: number; ink: number } {
  const distance = Math.abs(index - activePos)
  return {
    magnify: 1 + 0.5 * Math.exp(-(distance * distance) / 0.9),
    ink: 0.2 + 0.8 * Math.max(0, 1 - distance),
  }
}

/**
 * A single attention pulse on the element the shot is about: a ring that
 * expands and fades exactly once. Never loop it, and never run two at a time.
 */
export function attention(
  frame: number,
  start: number,
  length = 24
): { scale: number; opacity: number } {
  const progress = ramp(frame, [start, start + length], 'arrive')
  return { scale: 1 + 0.28 * progress, opacity: (1 - progress) * 0.55 }
}

/**
 * A wipe or mask reveal, as a 0 to 100 percentage for `clip-path` insets.
 * Reveals read as the product drawing itself rather than fading in.
 */
export function reveal(
  frame: number,
  range: [number, number],
  ease: EaseName = 'arrive'
): number {
  return 100 - 100 * ramp(frame, range, ease)
}

/**
 * Parallax. Give background layers a fraction of the foreground's travel so
 * depth reads without anything moving independently.
 */
export function parallax(offset: number, depth = 0.4): number {
  return offset * depth
}

/**
 * Count a number up. Product films are full of values that should land rather
 * than appear: totals, percentages, prices.
 */
export function countUp(
  frame: number,
  range: [number, number],
  values: [number, number]
): number {
  return Math.round(move(frame, range, values, 'arrive'))
}
