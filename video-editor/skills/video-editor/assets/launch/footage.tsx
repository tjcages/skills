import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame } from 'remotion'

import { CANVAS, cameraAt, cameraTransform, frameOn, inside, type CameraMove, type CameraState } from './camera'
import { CURSOR_BOX, CURSOR_TIP, Cursor, type CursorKind } from './cursors'

/**
 * Recorded primary UI under the film camera. Clips come from
 * assets/capture/record.mjs: `public/footage/<clip>.mp4` plus the pointer
 * path in `<clip>.cursor.json`. The footage fills the canvas, so one CSS
 * pixel of the recording is `CANVAS.width / viewport.width` canvas pixels;
 * `css()` converts recorded geometry for framing, never a hand-typed number.
 */

type Sample = { f: number; x: number; y: number; down: boolean; kind: CursorKind }
export type CursorTrack = {
  viewport: { width: number; height: number }
  frames: number
  samples: Sample[]
}

export function cssScale(track: CursorTrack): number {
  return CANVAS.width / track.viewport.width
}

/** A recorded CSS-pixel point in canvas coordinates. */
export function css(track: CursorTrack, x: number, y: number) {
  const k = cssScale(track)
  return { x: x * k, y: y * k }
}

const SCREEN = { left: 0, top: 0, width: CANVAS.width, height: CANVAS.height }

/** Centre a recorded point at a zoom, clamped so the frame stays on screen. */
export function aim(track: CursorTrack, x: number, y: number, scale: number): CameraState {
  return frameOn(inside(css(track, x, y), scale, SCREEN), scale)
}

/**
 * Pointer position at a clip frame. The press eases in over the two frames
 * before the recorded down, holds at least three frames (a recorded click can
 * be near-instant, which would never show), and releases over four.
 */
export function pointerAt(track: CursorTrack, frame: number) {
  const s = track.samples
  let i = 0
  while (i + 1 < s.length && s[i + 1].f <= frame) i++
  const a = s[i]
  const b = s[Math.min(i + 1, s.length - 1)]
  const span = b.f - a.f
  const t = span > 0 ? Math.min(1, Math.max(0, (frame - a.f) / span)) : 0

  let press = 0
  let downAt: number | null = null
  for (const sample of s) {
    if (sample.down && downAt === null) downAt = sample.f
    if (!sample.down && downAt !== null) {
      const upAt = Math.max(sample.f, downAt + 3)
      const p =
        frame < downAt - 2 ? 0
        : frame < downAt ? (frame - (downAt - 2)) / 2
        : frame <= upAt ? 1
        : Math.max(0, 1 - (frame - upAt) / 4)
      press = Math.max(press, p)
      downAt = null
    }
  }
  if (downAt !== null && frame >= downAt) press = 1

  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, kind: a.kind, press }
}

export function Footage({
  clip,
  track,
  offset = 0,
  camera,
  moves = [],
  cursor = true,
  background = '#000',
}: {
  clip: string
  track: CursorTrack
  /** Footage frame shown on scene frame 0. */
  offset?: number
  camera: CameraState
  moves?: CameraMove[]
  cursor?: boolean
  /** What shows if a move ever reveals past the footage edge. */
  background?: string
}) {
  const frame = useCurrentFrame()
  const state = cameraAt(frame, camera, moves)
  const k = cssScale(track)
  const pointer = cursor ? pointerAt(track, frame + offset) : null
  const size = 24 * k
  const tip = pointer ? CURSOR_TIP[pointer.kind] : undefined
  const unit = size / CURSOR_BOX

  return (
    <AbsoluteFill style={{ background, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: cameraTransform(state), transformOrigin: 'center center' }}>
        <OffthreadVideo
          src={staticFile(`footage/${clip}.mp4`)}
          startFrom={offset}
          muted
          style={{ position: 'absolute', inset: 0, width: CANVAS.width, height: CANVAS.height }}
        />
        {pointer ? (
          <Cursor
            kind={pointer.kind}
            x={pointer.x * k - (tip ? tip.x * unit : 0)}
            y={pointer.y * k - (tip ? tip.y * unit : 0)}
            press={pointer.press}
            size={size}
          />
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  )
}
