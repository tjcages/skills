import type { ReactNode } from 'react'
import { AbsoluteFill, useCurrentFrame } from 'remotion'

import {
  CANVAS,
  ZOOM,
  cameraAt,
  cameraTransform,
  frameOn,
  inside,
  type CameraMove,
  type CameraState,
} from './camera'
import { glide, move, ramp } from './motion'
import type { Scene } from './scenes'
import {
  FEATURE_ROW,
  MAX_TRAVEL,
  PANEL,
  Stage,
  controlCentre,
  headerCentre,
  panelCentre,
  rowCentre,
  sidebarCentre,
} from './stage'

const CANVAS_COLOUR = 'var(--promo-canvas, #f4f4f5)'

/**
 * The parts of the brief, by the names the brief uses. Every entry has to be
 * covered by a shot's `covers`, which `validateCoverage` proves when the
 * studio opens. Empty for a single-feature film; a site or portfolio brief
 * lists its pages here.
 */
export const PARTS: string[] = []

/**
 * Every shot is named by what it is about. Two consecutive shots of the same
 * subject at the same tier are a jump cut, so the shot list moves between
 * these deliberately.
 */
const SUBJECT = {
  panel: panelCentre(),
  sidebar: sidebarCentre(),
  header: headerCentre(),
  list: rowCentre(2),
  feature: rowCentre(FEATURE_ROW),
  control: controlCentre(),
} as const

const TRAVEL = Math.min(1200, MAX_TRAVEL)

const wide: CameraState = { scale: ZOOM.BASE, x: 0, y: 0 }

/**
 * Every focus point goes through `inside`, which clamps it so the visible
 * rectangle stays on the panel. Without it, a subject near an edge drags
 * backdrop across part of the frame and no camera move can fix it.
 */
function at(point: { x: number; y: number }, scale: number): CameraState {
  return frameOn(inside(point, scale, PANEL), scale)
}

const push = (point: { x: number; y: number }) => at(point, ZOOM.PUSH)
const close = (point: { x: number; y: number }) => at(point, ZOOM.CLOSE)
const macro = (point: { x: number; y: number }) => at(point, ZOOM.MACRO)

function Shot({
  camera,
  moves = [],
  children,
}: {
  camera: CameraState
  moves?: CameraMove[]
  children: ReactNode
}) {
  const frame = useCurrentFrame()
  const state = cameraAt(frame, camera, moves)

  return (
    <AbsoluteFill style={{ background: CANVAS_COLOUR }}>
      <AbsoluteFill
        style={{
          transform: cameraTransform(state),
          transformOrigin: 'center center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: PANEL.left,
            top: PANEL.top,
            width: PANEL.width,
            height: PANEL.height,
            borderRadius: 24,
            overflow: 'hidden',
            background: 'var(--promo-panel, #ffffff)',
            boxShadow: [
              '0 0 0 1px rgba(12,10,9,0.06)',
              '0 2px 8px rgba(12,10,9,0.04)',
              '0 28px 64px rgba(12,10,9,0.12)',
              'inset 0 1.5px 0 rgba(255,255,255,1)',
              'inset 0 0 0 2px rgba(255,255,255,0.5)',
              'inset 0 0 72px 18px rgba(255,255,255,0.9)',
            ].join(', '),
          }}
        >
          {children}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

/** BASE on the whole product. Content lands while the camera creeps in. */
function Establish() {
  return (
    <Shot
      camera={{ ...wide, scale: ZOOM.BASE }}
      moves={[
        {
          start: 0,
          duration: 48,
          to: at(SUBJECT.panel, ZOOM.BASE * 1.08),
          ease: 'standard',
        },
      ]}
    >
      <Stage entering />
    </Shot>
  )
}

/** PUSH on the navigation. A different part of the product entirely. */
function Sidebar() {
  return (
    <Shot
      camera={at(SUBJECT.sidebar, ZOOM.PUSH * 0.86)}
      moves={[
        { start: 0, duration: 40, to: push(SUBJECT.sidebar), ease: 'standard' },
      ]}
    >
      <Stage />
    </Shot>
  )
}

/** PUSH on the list. A selection travels down toward the feature. */
function List() {
  const frame = useCurrentFrame()

  return (
    <Shot camera={push(SUBJECT.list)}>
      <Stage highlight={glide(frame, [0, 46], [0, FEATURE_ROW - 1])} />
    </Shot>
  )
}

/** PUSH on the feature row. The camera arrives on the thing itself. */
function Feature() {
  return (
    <Shot
      camera={at(SUBJECT.feature, ZOOM.PUSH * 0.82)}
      moves={[
        { start: 0, duration: 44, to: push(SUBJECT.feature), ease: 'standard' },
      ]}
    >
      <Stage highlight={FEATURE_ROW} />
    </Shot>
  )
}

/** MACRO on the feature. The control fills the screen as it is operated. */
function Interact() {
  const frame = useCurrentFrame()

  return (
    <Shot camera={macro(SUBJECT.control)}>
      <Stage highlight={FEATURE_ROW} toggled={frame > 8} pulseAt={10} />
    </Shot>
  )
}

/** PUSH on the header, where the proof lives and does not scroll away. */
function Proof() {
  return (
    <Shot camera={push(SUBJECT.header)}>
      <Stage toggled />
    </Shot>
  )
}

/** PUSH on the list. The result travels through the depth of the content. */
function Travel() {
  const frame = useCurrentFrame()

  return (
    <Shot camera={push(SUBJECT.list)}>
      <Stage offsetY={move(frame, [0, 68], [0, TRAVEL], 'drift')} toggled />
    </Shot>
  )
}

/** BASE on the whole product again, then fade. */
function Resolve() {
  const frame = useCurrentFrame()

  return (
    <AbsoluteFill>
      <Shot
        camera={at(SUBJECT.panel, ZOOM.PUSH * 0.9)}
        moves={[{ start: 0, duration: 44, to: wide, ease: 'standard' }]}
      >
        <Stage offsetY={TRAVEL} toggled />
      </Shot>
      <AbsoluteFill
        style={{
          background: CANVAS_COLOUR,
          opacity: ramp(frame, [48, 70], 'arrive'),
        }}
      />
    </AbsoluteFill>
  )
}

/**
 * Every scene renders longer than it will be used. The handles are what let
 * the edit choose a cut point after watching, instead of baking one in.
 *
 * `tier` and `subject` are what stop the film becoming a series of jump cuts:
 * no two neighbouring shots may share both.
 */
export const SCENES: Scene[] = [
  {
    id: 'establish',
    beat: 'context',
    duration: 60,
    activity: 'entrance',
    tier: 'BASE',
    subject: 'panel',
    motion: { from: 0, to: 48, tag: 'push-in' },
    component: Establish,
  },
  {
    id: 'sidebar',
    beat: 'context',
    duration: 50,
    activity: 'reveal',
    tier: 'PUSH',
    subject: 'sidebar',
    motion: { from: 0, to: 40, tag: 'push-in' },
    component: Sidebar,
  },
  {
    id: 'list',
    beat: 'tension',
    duration: 56,
    activity: 'highlight',
    tier: 'PUSH',
    subject: 'list',
    motion: { from: 0, to: 46, tag: 'travel-down' },
    component: List,
  },
  {
    id: 'feature',
    beat: 'tension',
    duration: 54,
    activity: 'reveal',
    tier: 'PUSH',
    subject: 'feature',
    motion: { from: 0, to: 44, tag: 'push-in' },
    component: Feature,
  },
  {
    id: 'interact',
    beat: 'action',
    duration: 70,
    activity: 'interaction',
    tier: 'MACRO',
    subject: 'feature',
    motion: { from: 0, to: 48, tag: 'settle' },
    component: Interact,
  },
  {
    id: 'proof',
    beat: 'action',
    duration: 48,
    activity: 'reveal',
    tier: 'PUSH',
    subject: 'header',
    motion: { from: 0, to: 38, tag: 'settle' },
    component: Proof,
  },
  {
    id: 'travel',
    beat: 'consequence',
    duration: 80,
    activity: 'travel',
    tier: 'PUSH',
    subject: 'list',
    motion: { from: 0, to: 68, tag: 'travel-up' },
    component: Travel,
  },
  {
    id: 'resolve',
    beat: 'consequence',
    duration: 72,
    activity: 'reveal',
    tier: 'BASE',
    subject: 'panel',
    motion: { from: 0, to: 44, tag: 'pull-out' },
    component: Resolve,
  },
]

export { CANVAS }
