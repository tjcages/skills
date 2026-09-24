import { Easing, interpolate } from 'remotion'

export const CANVAS = { width: 1920, height: 1080, fps: 30 } as const

/**
 * Four tiers, never a fifth. Pick the nearest one instead of inventing a
 * per-shot zoom value: consistent tiers are what make cuts read as one camera.
 *
 * BASE is bounded by geometry, not taste: the panel times BASE, plus its
 * shadow falloff, has to leave an even canvas border on all four sides. With
 * the default 1520x880 panel in a 1920x1080 canvas, anything above 1.0 clips
 * the panel's rounded corners.
 *
 * The gaps between tiers are the point. Each is roughly 1.5x the last, which
 * is the smallest change in image size that reads as a different shot. Tiers
 * closer than that make every cut between them look like a glitch, because
 * the viewer cannot tell an edit from a stutter.
 *
 * MACRO exists because product film is almost always shot too wide. At MACRO
 * the camera sees 582px of canvas, so a single control fills the screen. The
 * feature the film is about should be filmed at CLOSE or MACRO, never wider.
 */
export const ZOOM = { BASE: 1, PUSH: 1.5, CLOSE: 2.2, MACRO: 3.3 } as const

/** Rank by image size. A cut needs a rank change or a subject change. */
export const TIER_RANK = { BASE: 0, PUSH: 1, CLOSE: 2, MACRO: 3 } as const

export type Tier = keyof typeof ZOOM

/**
 * The canvas rectangle a tier can actually see. Anything a shot needs to read
 * has to fit inside this with room to spare, so check the subject's bounds
 * against it while building the stage rather than discovering the clip in a
 * still.
 */
export function visibleRect(scale: number): {
  width: number
  height: number
} {
  return { width: CANVAS.width / scale, height: CANVAS.height / scale }
}

/**
 * The easing catalogue. Nothing in a film is ever linear, and nothing invents
 * its own curve: pick the one that matches what the movement is doing.
 *
 * Every curve here is slow in and slow out to some degree, which is the point.
 * A movement that starts or stops at full speed reads as a glitch, not as
 * energy. Speed comes from short durations, not from removing the ease.
 */
export const EASE = {
  /** Camera moves. Symmetrical, unhurried at both ends, confident. */
  standard: Easing.bezier(0.65, 0, 0.35, 1),
  /** Anything arriving: entrances, reveals, a panel opening. Lands softly. */
  arrive: Easing.bezier(0.16, 1, 0.3, 1),
  /** Anything leaving frame. Commits early, gone before you follow it. */
  leave: Easing.bezier(0.7, 0, 0.84, 0),
  /** A highlight or selection moving between two places. Gentle both ends. */
  glide: Easing.bezier(0.45, 0, 0.55, 1),
  /** Long scroll travel. Nearly constant through the middle, eased at ends. */
  drift: Easing.bezier(0.33, 0, 0.2, 1),
  /** Small, fast, mechanical moves such as a toggle knob. */
  snap: Easing.bezier(0.4, 0, 0.2, 1),
} as const

export type EaseName = keyof typeof EASE

export type CameraState = { scale: number; x: number; y: number }

export type CameraMove = {
  start: number
  duration: number
  to: CameraState
  ease?: EaseName
}

/**
 * Translate that puts canvas point `canvasX` at screen x `screenX` under
 * `scale`. Derived from screen = center + scale * (point - center + translate).
 */
export function solveTranslateX(
  canvasX: number,
  screenX: number,
  scale: number
): number {
  const center = CANVAS.width / 2
  return (screenX - center) / scale + center - canvasX
}

export function solveTranslateY(
  canvasY: number,
  screenY: number,
  scale: number
): number {
  const center = CANVAS.height / 2
  return (screenY - center) / scale + center - canvasY
}

/**
 * Centre a canvas point in the frame at a given tier. Always solve the
 * translate for the tier you are using: reusing one tier's translate at
 * another scale puts the subject somewhere neither shot intended.
 */
export function frameOn(
  point: { x: number; y: number },
  scale: number
): CameraState {
  return {
    scale,
    x: solveTranslateX(point.x, CANVAS.width / 2, scale),
    y: solveTranslateY(point.y, CANVAS.height / 2, scale),
  }
}

/**
 * Clamp a focus point so the frame stays on the product.
 *
 * Aiming at a subject near an edge puts backdrop across part of the shot,
 * which the framing rules forbid and which no camera move can fix. This keeps
 * the visible rectangle inside `bounds`, usually the panel, and centres on
 * `bounds` when the tier sees more than the panel contains.
 */
export function inside(
  point: { x: number; y: number },
  scale: number,
  bounds: { left: number; top: number; width: number; height: number }
): { x: number; y: number } {
  const view = visibleRect(scale)
  const halfWidth = view.width / 2
  const halfHeight = view.height / 2

  const minX = bounds.left + halfWidth
  const maxX = bounds.left + bounds.width - halfWidth
  const minY = bounds.top + halfHeight
  const maxY = bounds.top + bounds.height - halfHeight

  return {
    x: minX > maxX ? bounds.left + bounds.width / 2 : Math.min(Math.max(point.x, minX), maxX),
    y: minY > maxY ? bounds.top + bounds.height / 2 : Math.min(Math.max(point.y, minY), maxY),
  }
}

export function cameraAt(
  frame: number,
  from: CameraState,
  moves: CameraMove[]
): CameraState {
  let state = from

  for (const move of moves) {
    const progress = interpolate(
      frame,
      [move.start, move.start + move.duration],
      [0, 1],
      {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: EASE[move.ease ?? 'standard'],
      }
    )
    state = {
      scale: state.scale + (move.to.scale - state.scale) * progress,
      x: state.x + (move.to.x - state.x) * progress,
      y: state.y + (move.to.y - state.y) * progress,
    }
  }

  return state
}

export function cameraTransform(state: CameraState): string {
  return `scale(${state.scale}) translate(${state.x}px, ${state.y}px)`
}
