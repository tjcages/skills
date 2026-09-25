import { ZOOM } from './camera'
import { aim, footageScene } from './footage'
import { nearestTier, type Scene } from './scenes'

/**
 * A breadth montage: many real capabilities, each a short glimpse of a
 * recorded state change, cut to the beat. Data lives in `src/montage.json`;
 * `node montage.mjs` writes the beat-aligned cuts into edit.json, and
 * `montageScenes()` turns the same data into scenes for SCENES:
 *
 *   import montage from './montage.json'
 *   export const SCENES = [...heroScenes, ...montageScenes(montage), ...outro]
 *
 * Each glimpse starts a few frames before its state change (`at`, a frame
 * of the recorded clip) so the change happens on screen, and drifts in
 * slightly (never below its tier) so every cut lands on moving picture.
 */
export type Glimpse = {
  id: string
  /** Recorded clip in public/footage, from capture/record.mjs. */
  clip: string
  /** Clip frame where the visible change happens. */
  at: number
  /** Recorded CSS-pixel point to frame on. */
  x: number
  y: number
  /** Camera zoom; must be a tier (BASE 1, PUSH 1.5, CLOSE 2.2, MACRO 3.3). */
  zoom: number
  /** What is on screen. Neighbouring glimpses must differ. Defaults to the clip. */
  surface?: string
  /** The capability this glimpse proves, for validateCoverage. Defaults to the id. */
  covers?: string
}

export type Montage = {
  viewport: { width: number; height: number }
  /** Beats per glimpse: 1 is ~16 frames at 112 BPM, 0.5 is ~8. */
  beats: number
  /** The scene the montage follows in the edit. */
  after: string
  glimpses: Glimpse[]
}

/** Frames of lead-in before the change, so the viewer sees it happen. */
export const MONTAGE_LEAD = 4
/** Rendered frames per glimpse; the cut uses the first 8-24 of them. */
const GLIMPSE_FRAMES = 40
const DRIFT = 1.06

export function montageId(glimpse: Glimpse): string {
  return `montage-${glimpse.id}`
}

export function montageScenes(montage: Montage): Scene[] {
  const recording = { viewport: montage.viewport }
  return montage.glimpses.map(glimpse => {
    const tier = nearestTier(glimpse.zoom)
    return footageScene({
      id: montageId(glimpse),
      beat: 'action',
      activity: 'montage',
      tier,
      subject: glimpse.id,
      surface: glimpse.surface ?? glimpse.clip,
      covers: [glimpse.covers ?? glimpse.id],
      duration: GLIMPSE_FRAMES,
      motion: { from: 0, to: GLIMPSE_FRAMES, tag: 'push-in' },
      clip: glimpse.clip,
      viewport: montage.viewport,
      offset: Math.max(0, glimpse.at - MONTAGE_LEAD),
      cursor: false,
      // Push in from the tier, never out past it: below BASE the footage
      // edge shows as a border.
      camera: aim(recording, glimpse.x, glimpse.y, ZOOM[tier]),
      moves: [{ start: 0, duration: GLIMPSE_FRAMES, to: aim(recording, glimpse.x, glimpse.y, ZOOM[tier] * DRIFT), ease: 'drift' }],
    })
  })
}
