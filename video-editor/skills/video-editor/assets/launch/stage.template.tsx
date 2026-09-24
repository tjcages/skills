import { useCurrentFrame, useVideoConfig } from 'remotion'

import { attention, entrance, flick, pop, staggerDelay } from './motion'

/**
 * The product surface. Replace everything below with the real product: the
 * staging skill decides whether that is the product's own components with
 * mock data, or a framed live page.
 *
 * Keep the exported geometry. The film frames its shots with `rowCentre` and
 * `COLUMN`, so a camera never contains a hand-guessed coordinate.
 */
export const PANEL = { left: 200, top: 100, width: 1520, height: 880 } as const
export const SIDEBAR_WIDTH = 260
export const HEADER_HEIGHT = 76
export const COLUMN = { width: 720, padding: 40 } as const
export const ROW = { height: 96, gap: 16, count: 18 } as const

const PITCH = ROW.height + ROW.gap

export const CONTENT_HEIGHT =
  HEADER_HEIGHT + COLUMN.padding * 2 + ROW.count * ROW.height + (ROW.count - 1) * ROW.gap

/** The payoff can never travel further than this without running off the end. */
export const MAX_TRAVEL = CONTENT_HEIGHT - PANEL.height

/** Canvas centre of the panel chrome, for shots that are about the chrome. */
export function headerCentre(): { x: number; y: number } {
  return {
    x: PANEL.left + SIDEBAR_WIDTH + (PANEL.width - SIDEBAR_WIDTH) / 2,
    y: PANEL.top + HEADER_HEIGHT / 2,
  }
}

export function sidebarCentre(): { x: number; y: number } {
  return {
    x: PANEL.left + SIDEBAR_WIDTH / 2,
    y: PANEL.top + 220,
  }
}

export function panelCentre(): { x: number; y: number } {
  return {
    x: PANEL.left + PANEL.width / 2,
    y: PANEL.top + PANEL.height / 2,
  }
}

/**
 * Canvas coordinates of the control inside the feature row.
 *
 * A MACRO frame is 582px wide, narrower than the content column, so a MACRO
 * shot must be framed on the control itself and not on the row that contains
 * it. Framing on the row puts the control outside the frame, which is the
 * whole subject of the shot.
 */
export function controlCentre(): { x: number; y: number } {
  const columnLeft =
    PANEL.left + SIDEBAR_WIDTH + (PANEL.width - SIDEBAR_WIDTH - COLUMN.width) / 2
  return {
    x: columnLeft + COLUMN.width - 24 - CONTROL_WIDTH / 2 - MACRO_BIAS,
    y: rowCentre(FEATURE_ROW).y,
  }
}

/** Canvas coordinates of a row, so shots are framed on the real thing. */
export function rowCentre(index: number, offsetY = 0): { x: number; y: number } {
  return {
    x: PANEL.left + SIDEBAR_WIDTH + (PANEL.width - SIDEBAR_WIDTH) / 2,
    y:
      PANEL.top +
      HEADER_HEIGHT +
      COLUMN.padding +
      index * PITCH +
      ROW.height / 2 -
      offsetY,
  }
}

const INK = {
  hairline: 'rgba(12,10,9,0.08)',
  surface: 'rgba(12,10,9,0.035)',
  soft: 'rgba(12,10,9,0.09)',
  mid: 'rgba(12,10,9,0.16)',
  strong: 'rgba(12,10,9,0.78)',
} as const

const TITLE_WIDTHS = [196, 168, 232, 184, 212, 156, 204, 176, 224] as const
const META_WIDTHS = [312, 264, 348, 288, 328, 244, 300, 276, 336] as const

/** The row the film is about. Everything else is context. */
export const FEATURE_ROW = 4

/** Width of the control in that row, so MACRO can be framed on it. */
export const CONTROL_WIDTH = 76

/**
 * Framing dead on the control leaves the far side of the frame empty. Biasing
 * back toward the row's content fills the frame while keeping the control
 * comfortably inside it.
 */
const MACRO_BIAS = 90

type StageProps = {
  /** Only the scene that introduces the content animates it in. */
  entering?: boolean
  offsetY?: number
  /** Float row index. Fractional values are mid-glide, which is intended. */
  highlight?: number
  toggled?: boolean
  /** Frame the attention pulse on the feature starts. Omit for no pulse. */
  pulseAt?: number
}

export function Stage({
  entering = false,
  offsetY = 0,
  highlight,
  toggled = false,
  pulseAt,
}: StageProps) {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const pulse = pulseAt === undefined ? null : attention(frame, pulseAt)

  return (
    <>
      <div
        style={{
          position: 'absolute',
          inset: '0 auto 0 0',
          width: SIDEBAR_WIDTH,
          borderRight: `1px solid ${INK.hairline}`,
          padding: '26px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          background: 'var(--promo-panel, #ffffff)',
          zIndex: 3,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '0 8px',
            marginBottom: 18,
          }}
        >
          <div style={{ width: 26, height: 26, borderRadius: 8, background: INK.strong }} />
          <div style={{ width: 88, height: 12, borderRadius: 6, background: INK.mid }} />
        </div>
        {[0, 1, 2, 3, 4, 5].map(index => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              height: 40,
              padding: '0 8px',
              borderRadius: 12,
              background: index === 1 ? INK.surface : 'transparent',
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 6,
                background: index === 1 ? INK.mid : INK.soft,
              }}
            />
            <div
              style={{
                width: 74 + ((index * 23) % 46),
                height: 10,
                borderRadius: 5,
                background: index === 1 ? INK.mid : INK.soft,
              }}
            />
          </div>
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          inset: `0 0 auto ${SIDEBAR_WIDTH}px`,
          height: HEADER_HEIGHT,
          borderBottom: `1px solid ${INK.hairline}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          background: 'var(--promo-panel, #ffffff)',
          zIndex: 2,
        }}
      >
        <div style={{ width: 148, height: 16, borderRadius: 8, background: INK.mid }} />
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div
            style={{
              width: 84,
              height: 32,
              borderRadius: 999,
              background: toggled ? INK.strong : INK.surface,
              border: `1px solid ${toggled ? 'transparent' : INK.hairline}`,
              transform: `scale(${toggled ? 0.9 + 0.1 * pop(frame, fps, 6) : 1})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {toggled ? (
              <div
                style={{
                  width: 40,
                  height: 10,
                  borderRadius: 5,
                  background: 'rgba(255,255,255,0.9)',
                }}
              />
            ) : null}
          </div>
          <div style={{ width: 32, height: 32, borderRadius: 999, background: INK.soft }} />
        </div>
      </div>

      <div
        style={{
          transform: `translateY(${-offsetY}px)`,
          position: 'relative',
          width: COLUMN.width,
          marginLeft: SIDEBAR_WIDTH + (PANEL.width - SIDEBAR_WIDTH - COLUMN.width) / 2,
          paddingTop: HEADER_HEIGHT + COLUMN.padding,
          paddingBottom: COLUMN.padding,
        }}
      >
        {highlight === undefined ? null : (
          <div
            style={{
              position: 'absolute',
              left: -10,
              top: HEADER_HEIGHT + COLUMN.padding - 10 + highlight * PITCH,
              width: COLUMN.width + 20,
              height: ROW.height + 20,
              borderRadius: 22,
              boxShadow: `0 0 0 2px ${INK.strong}`,
            }}
          />
        )}
        {pulse === null ? null : (
          <div
            style={{
              position: 'absolute',
              left: -10,
              top: HEADER_HEIGHT + COLUMN.padding - 10 + FEATURE_ROW * PITCH,
              width: COLUMN.width + 20,
              height: ROW.height + 20,
              borderRadius: 22,
              boxShadow: `0 0 0 3px ${INK.strong}`,
              opacity: pulse.opacity,
              transform: `scale(${pulse.scale})`,
              transformOrigin: 'center center',
            }}
          />
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: ROW.gap }}>
          {Array.from({ length: ROW.count }, (_, index) => index).map(index => {
            const { opacity, translateY } = entering
              ? entrance(frame, fps, staggerDelay(index))
              : { opacity: 1, translateY: 0 }
            const isFeature = index === FEATURE_ROW

            return (
              <div
                key={index}
                style={{
                  opacity,
                  transform: `translateY(${translateY}px)`,
                  background: INK.surface,
                  border: `1px solid ${INK.hairline}`,
                  height: ROW.height,
                  borderRadius: 18,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 20,
                  padding: '0 24px',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    background: INK.soft,
                    flexShrink: 0,
                  }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                  <div
                    style={{
                      width: TITLE_WIDTHS[index % TITLE_WIDTHS.length],
                      height: 13,
                      borderRadius: 7,
                      background: INK.mid,
                    }}
                  />
                  <div
                    style={{
                      width: META_WIDTHS[index % META_WIDTHS.length],
                      height: 11,
                      borderRadius: 6,
                      background: INK.soft,
                    }}
                  />
                </div>
                {isFeature ? (
                  <div
                    style={{
                      width: 76,
                      height: 40,
                      borderRadius: 999,
                      background: toggled ? INK.strong : INK.mid,
                      display: 'flex',
                      alignItems: 'center',
                      padding: 5,
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 999,
                        background: '#fff',
                        transform: `translateX(${toggled ? 36 * flick(frame, fps, 2) : 0}px)`,
                      }}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      width: 64,
                      height: 26,
                      borderRadius: 999,
                      background: INK.soft,
                      flexShrink: 0,
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
