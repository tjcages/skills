import type { ComponentType } from 'react'

import { TIER_RANK, ZOOM, cameraAt, type CameraMove, type CameraState, type Tier } from './camera'
import { readingFrames } from './text'
import { nearestGridLine, type MusicGrid } from './beats'

/**
 * What moves in a scene. There is deliberately no `static` option: a shot
 * where nothing happens is the failure mode this field exists to prevent.
 */
export type SceneActivity =
  | 'entrance'
  | 'interaction'
  | 'travel'
  | 'reveal'
  | 'highlight'
  /** A rapid real-product glimpse in a breadth montage; may run 8-14 frames. */
  | 'montage'

/**
 * Which of the four story beats this shot belongs to. A beat may span several
 * shots; a shot never spans two beats.
 */
export type Beat = 'context' | 'tension' | 'action' | 'consequence'

const BEAT_ORDER: Beat[] = ['context', 'tension', 'action', 'consequence']

export type MotionTag =
  | 'push-in'
  | 'pull-out'
  | 'travel-up'
  | 'travel-down'
  | 'settle'

/** Reversing direction across a cut reads as a mistake, so it is forbidden. */
const OPPOSITE: Partial<Record<MotionTag, MotionTag>> = {
  'push-in': 'pull-out',
  'pull-out': 'push-in',
  'travel-up': 'travel-down',
  'travel-down': 'travel-up',
}

/**
 * One scene is one Remotion composition, rendered to its own clip.
 *
 * `duration` is the full length including handles. **Always animate the
 * movement to completion inside that length.** The cut is chosen later, by
 * trimming in the edit. A movement authored to be chopped off mid-flight
 * reads as broken, because nothing in the world stops at full speed.
 *
 * `motion` is the frame range of the scene's primary movement, in the scene's
 * own frames. The edit uses it to prove a cut lands while the picture is
 * actually moving.
 */
export type Scene = {
  id: string
  duration: number
  activity: SceneActivity
  /** The story beat this shot carries. */
  beat: Beat
  /** The image size this shot is filmed at. */
  tier: Tier
  /**
   * What the shot is about, as a short name such as 'list', 'feature-row' or
   * 'header'. Two consecutive shots of the same subject at the same tier are
   * a jump cut, so this is what the variety check compares.
   */
  subject: string
  /**
   * The physical thing on screen: 'panel', 'page', 'popover', 'title'. Two
   * consecutive shots of the same surface are one shot reframed, however the
   * subjects are named, unless the cut is a declared `punch`. Declare it on
   * every product shot; the variety check cannot see through renamed
   * subjects without it, and qc.mjs checks the pixels either way.
   */
  surface?: string
  /**
   * The line a text scene shows. The edit fails if the cut ends before
   * `readingFrames(text)`; no separate reading-hold call to forget.
   */
  text?: string
  /**
   * The shot's camera, when the scene frames a stage or footage with
   * `cameraAt`. With it, `validateEdit` checks the zoom actually on screen:
   * every camera target must sit on a tier, and the punch and same-surface
   * rules compare the real zoom at each cut rather than the declared `tier`.
   * `footageScene()` in footage.tsx fills it in.
   */
  camera?: SceneCamera
  motion: { from: number; to: number; tag: MotionTag }
  /**
   * Which parts of the brief this shot covers, by the names the brief uses.
   * `validateCoverage` proves every named part appears in the edit.
   */
  covers?: string[]
  /**
   * The scroll offsets a page travels between in this shot, in site pixels.
   * Declared on every shot that scrolls, so the edit can prove the page
   * only ever moves forward across cuts.
   */
  scroll?: { from: number; to: number }
  component: ComponentType
}

export type SceneCamera = { start: CameraState; moves?: CameraMove[] }

const TIERS = Object.keys(ZOOM) as Tier[]
/** How far a camera target may sit from its tier: a drift, not a new size. */
export const TIER_TOLERANCE = 0.1

/** The tier whose zoom is nearest `scale`, measured as a ratio. */
export function nearestTier(scale: number): Tier {
  return TIERS.reduce((best, tier) =>
    Math.abs(Math.log(scale / ZOOM[tier])) < Math.abs(Math.log(scale / ZOOM[best])) ? tier : best
  )
}

/** The tier a scene is actually at on a frame: its camera if declared. */
export function tierOnFrame(scene: Scene, frame: number): Tier {
  if (!scene.camera) return scene.tier
  return nearestTier(cameraAt(frame, scene.camera.start, scene.camera.moves ?? []).scale)
}

/**
 * Camera targets between tiers are the drift the dogfood film had (1.12,
 * 1.16): sizes too close to a tier to read as a new shot and too far to
 * match it. Each target must be within TIER_TOLERANCE of a tier.
 */
function offTierTargets(scene: Scene): string[] {
  if (!scene.camera) return []
  const targets = [
    { label: 'start', scale: scene.camera.start.scale },
    ...(scene.camera.moves ?? []).map((move, i) => ({ label: `move ${i + 1}`, scale: move.to.scale })),
  ]
  return targets.flatMap(({ label, scale }) => {
    const tier = nearestTier(scale)
    const off = scale / ZOOM[tier] - 1
    return Math.abs(off) > TIER_TOLERANCE
      ? [`${scene.id}: camera ${label} zoom ${scale.toFixed(2)} is ${(off * 100).toFixed(0)}% off ${tier} (${ZOOM[tier]}). Use a tier, within ${TIER_TOLERANCE * 100}% for a drift.`]
      : []
  })
}

/**
 * How a cut relates the outgoing shot to the incoming one.
 *
 * `momentum` carries movement across the cut: the outgoing clip is still
 * travelling and the incoming clip is already travelling. This is what makes
 * a cut feel deliberate rather than accidental, and it is the default.
 *
 * `match` holds a subject in the same screen position while the framing
 * changes around it. Use when both shots are settled on the same thing.
 *
 * `impact` is a deliberate discontinuity marking a new beat. Powerful and
 * expensive: two per film is the ceiling. It must still change the picture.
 *
 * `punch` is a deliberate jump in on the same surface: at least two tiers
 * (BASE to CLOSE, PUSH to MACRO). Anything smaller reads as a stutter; make
 * it one continuous camera move instead.
 *
 * `handoff` is an invisible cut: the outgoing scene ends on a designed shared
 * frame (a colour flood, a shape, an element at a fixed position) and the
 * incoming scene starts from that same frame. See the transitions in
 * `transitions.ts`.
 */
export type Continuity = 'momentum' | 'match' | 'impact' | 'punch' | 'handoff'

export type Cut = {
  scene: string
  in: number
  out: number
  continuity: Continuity
}

const MIN_CLIP = 15
const MIN_MONTAGE_CLIP = 8
const MAX_CLIP = 75
const MIN_FILM = 300
const MAX_FILM = 450
const MAX_IMPACT = 2

export type EditProfile = {
  mode?: 'focused' | 'launch'
  minFilmFrames?: number
  maxFilmFrames?: number
  maxClipFrames?: number
}

export function clipLength(cut: Cut): number {
  return cut.out - cut.in
}

export function filmDuration(cuts: Cut[]): number {
  return cuts.reduce((total, cut) => total + clipLength(cut), 0)
}

function isMoving(scene: Scene, frame: number): boolean {
  return frame >= scene.motion.from && frame < scene.motion.to
}

/**
 * Fails loudly before anything renders. Every rule encodes a note a reviewer
 * would otherwise give you after watching the assembled film.
 */
export function validateEdit(
  scenes: Scene[],
  cuts: Cut[],
  profile: EditProfile = {},
  music?: MusicGrid
): Cut[] {
  const problems: string[] = []
  const byId = new Map(scenes.map(scene => [scene.id, scene]))
  const maxClip = profile.maxClipFrames ?? MAX_CLIP
  const minFilm = profile.minFilmFrames ?? MIN_FILM
  const maxFilm = profile.maxFilmFrames ?? MAX_FILM
  if (
    ![maxClip, minFilm, maxFilm].every(Number.isInteger) ||
    maxClip < MIN_CLIP || minFilm < MIN_CLIP || maxFilm < minFilm ||
    (profile.mode !== undefined && !['focused', 'launch'].includes(profile.mode))
  ) {
    problems.push('invalid edit profile limits')
  }

  cuts.forEach((cut, index) => {
    const scene = byId.get(cut.scene)

    if (!scene) {
      problems.push(`cut ${index}: no scene called "${cut.scene}"`)
      return
    }
    if (cut.in < 0 || cut.out > scene.duration) {
      problems.push(
        `${cut.scene}: trim ${cut.in}-${cut.out} falls outside its ${scene.duration} frames`
      )
    }
    problems.push(...offTierTargets(scene))
    const minClip = scene.activity === 'montage' ? MIN_MONTAGE_CLIP : MIN_CLIP
    if (clipLength(cut) < minClip) {
      problems.push(`${cut.scene}: ${clipLength(cut)} frames is too short to read`)
    }
    if (clipLength(cut) > maxClip) {
      problems.push(`${cut.scene}: ${clipLength(cut)} frames outstays its welcome`)
    }
    if (scene.text && clipLength(cut) < readingFrames(scene.text)) {
      problems.push(
        `${cut.scene}: holds "${scene.text}" for ${clipLength(cut)} frames but reading needs ${readingFrames(scene.text)}. Trim later or shorten the line.`
      )
    }

    const previousCut = index > 0 ? cuts[index - 1] : undefined
    const previousScene = previousCut ? byId.get(previousCut.scene) : undefined

    if (previousScene) {
      const sameSubject = previousScene.subject === scene.subject
      // The zoom on screen either side of the cut, from the cameras when
      // declared, else the declared tiers.
      const outgoingTier = tierOnFrame(previousScene, previousCut!.out - 1)
      const incomingTier = tierOnFrame(scene, cut.in)
      const sizeChange = Math.abs(TIER_RANK[incomingTier] - TIER_RANK[outgoingTier])

      const sameSurface =
        previousScene.surface !== undefined && previousScene.surface === scene.surface
      if (cut.continuity === 'punch') {
        if (sizeChange < 2) {
          problems.push(
            `${previousScene.id} to ${scene.id}: a punch must jump at least two tiers (${outgoingTier} to ${incomingTier} is ${sizeChange}). Smaller reframes of one surface read as a stutter; make them one camera move.`
          )
        }
      } else if (sameSurface && cut.continuity !== 'handoff') {
        problems.push(
          `${previousScene.id} to ${scene.id}: both shots film the same surface "${scene.surface}", so the cut is a reframe of one picture. Merge them into one continuous camera move, cut to a different surface or a visibly changed state, or declare a "punch" of two or more tiers.`
        )
      }
      if (sameSubject && sizeChange === 0) {
        problems.push(
          `${previousScene.id} to ${scene.id}: same subject "${scene.subject}" at the same tier "${incomingTier}" is a jump cut. Change the image size by a tier, or point the shot at something else.`
        )
      }
      if (
        previousScene.scroll &&
        scene.scroll &&
        scene.scroll.from < previousScene.scroll.to
      ) {
        problems.push(
          `${previousScene.id} leaves the page at scroll ${previousScene.scroll.to} and ${scene.id} starts at ${scene.scroll.from}, so the page scrolls backwards across the cut and the state thread resets`
        )
      }
    }

    if (cut.continuity !== 'momentum') return

    if (previousCut && previousScene) {
      const previous = previousScene
      if (!isMoving(previous, previousCut.out - 1)) {
        problems.push(
          `${previous.id} has settled by frame ${previousCut.out}, so the cut out of it has no momentum to carry. Trim before ${previous.motion.to}.`
        )
      }
      if (OPPOSITE[previous.motion.tag] === scene.motion.tag) {
        problems.push(
          `${previous.id} is "${previous.motion.tag}" and ${scene.id} is "${scene.motion.tag}", which reverses direction across the cut`
        )
      }
    }

    if (!isMoving(scene, cut.in)) {
      problems.push(
        `${scene.id} is not moving at frame ${cut.in}, so the cut lands on a still. Trim into its motion, which runs ${scene.motion.from}-${scene.motion.to}.`
      )
    }
  })

  const inEdit = cuts
    .map(cut => byId.get(cut.scene))
    .filter((scene): scene is Scene => Boolean(scene))

  const requiredBeats = profile.mode === 'launch'
    ? BEAT_ORDER.filter(beat => beat !== 'tension')
    : BEAT_ORDER
  const missing = requiredBeats.filter(beat => !inEdit.some(s => s.beat === beat))
  if (missing.length > 0) {
    problems.push(
      `the edit has no ${missing.join(' and no ')} beat, so it is a tour rather than an argument`
    )
  }

  let highest = -1
  inEdit.forEach(scene => {
    const rank = BEAT_ORDER.indexOf(scene.beat)
    if (profile.mode !== 'launch' && rank < highest) {
      problems.push(
        `${scene.id} is a "${scene.beat}" shot after a later beat, so the story runs backwards`
      )
    }
    highest = Math.max(highest, rank)
  })

  const feature = inEdit.find(scene => scene.activity === 'interaction')
  if (feature && TIER_RANK[feature.tier] < TIER_RANK.CLOSE) {
    problems.push(
      `${feature.id} is the interaction and is filmed at "${feature.tier}". Film the feature at CLOSE or MACRO, or it will not read.`
    )
  }

  if (!inEdit.some(scene => TIER_RANK[scene.tier] >= TIER_RANK.CLOSE)) {
    problems.push('no shot is closer than PUSH, so the whole film is shot too wide')
  }

  const impacts = cuts.filter(cut => cut.continuity === 'impact').length
  if (impacts > MAX_IMPACT) {
    problems.push(`${impacts} impact cuts; ${MAX_IMPACT} is the ceiling`)
  }

  const used = new Set(cuts.map(cut => cut.scene))
  if (!scenes.some(s => used.has(s.id) && s.activity === 'interaction')) {
    problems.push('no scene in the edit shows an interaction, which is what proves the feature')
  }

  const lengths = new Set(cuts.map(clipLength))
  if (cuts.length > 3 && lengths.size < 3) {
    problems.push('every clip is nearly the same length, which reads as a slideshow')
  }

  // Cuts on the music. Only when edit.json declares its grid; beats.mjs
  // proposes the snapped trims.
  if (music) {
    const tolerance = music.tolerance ?? 2
    let boundary = 0
    cuts.slice(0, -1).forEach((cut, index) => {
      boundary += clipLength(cut)
      const { frame, offset } = nearestGridLine(music, boundary)
      if (Math.abs(offset) > tolerance) {
        problems.push(
          `cut ${cut.scene} to ${cuts[index + 1].scene} at film frame ${boundary} is ${offset > 0 ? '+' : ''}${offset.toFixed(1)} frames off the music (nearest line ${frame.toFixed(1)}). Run node beats.mjs to snap it, within ${tolerance} frames.`
        )
      }
    })
  }

  const total = filmDuration(cuts)
  if (total < minFilm || total > maxFilm) {
    problems.push(`film is ${total} frames, outside ${minFilm} to ${maxFilm}`)
  }

  if (problems.length > 0) {
    throw new Error(`Edit problems:\n- ${problems.join('\n- ')}`)
  }

  return cuts
}

/**
 * Proves the edit covers every part the brief names. A shot declares what it
 * covers in `covers`; a named part that no shot in the edit covers fails,
 * because a film that skips half of what was asked for is not simplified,
 * it is incomplete. Cut a part deliberately by leaving it out of `parts`
 * and saying why in the notes.
 */
export function validateCoverage(
  scenes: Scene[],
  cuts: Cut[],
  parts: string[]
): string[] {
  const used = new Set(cuts.map(cut => cut.scene))
  const covered = new Set(
    scenes.filter(scene => used.has(scene.id)).flatMap(scene => scene.covers ?? [])
  )
  const missing = parts.filter(part => !covered.has(part))
  if (missing.length > 0) {
    throw new Error(
      `Coverage problems:\n- the brief names ${missing.join(', ')} and no shot in the edit covers ${missing.length === 1 ? 'it' : 'them'}. Give ${missing.length === 1 ? 'it' : 'each'} a beat, or leave it out of the parts on purpose and say why.`
    )
  }
  return parts
}
