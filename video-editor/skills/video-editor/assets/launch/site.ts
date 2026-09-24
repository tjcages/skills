/**
 * Filming a whole site page instead of a single feature.
 *
 * A site laid out at its real size has 14px body text and a 12px mark, too
 * small to carry a 1080p frame even at MACRO. Rendering the page at a
 * narrower viewport and scaling it into the panel keeps every proportion the
 * site's own CSS produces while making the close tiers legible. The default
 * viewport is 1216 x 704 site pixels scaled 1.25x into the 1520 x 880 panel,
 * which is a width the site really lays out at.
 */
export type Rect = { left: number; top: number; width: number; height: number }

export const DEFAULT_PANEL: Rect = { left: 200, top: 100, width: 1520, height: 880 }

export type SiteViewport = {
  /** Site pixels to canvas pixels. */
  scale: number
  /** The viewport the page is laid out at, in site pixels. */
  width: number
  height: number
  panel: Rect
}

export function siteViewport(scale = 1.25, panel: Rect = DEFAULT_PANEL): SiteViewport {
  return { scale, width: panel.width / scale, height: panel.height / scale, panel }
}

/** Canvas coordinates of a point given in site pixels at a scroll offset. */
export function sitePoint(
  view: SiteViewport,
  x: number,
  y: number,
  scroll = 0
): { x: number; y: number } {
  return {
    x: view.panel.left + x * view.scale,
    y: view.panel.top + (y - scroll) * view.scale,
  }
}

/** The furthest the page can scroll before the viewport runs out of page. */
export function maxScroll(view: SiteViewport, pageHeight: number): number {
  return Math.max(0, pageHeight - view.height)
}

/**
 * The scroll offset that centres a page element in the viewport, clamped to
 * the page. Derive every travel from this rather than typing offsets.
 */
export function scrollTo(
  view: SiteViewport,
  pageHeight: number,
  elementTop: number,
  elementHeight: number
): number {
  const wanted = elementTop + elementHeight / 2 - view.height / 2
  return Math.min(Math.max(wanted, 0), maxScroll(view, pageHeight))
}

export type Sticky = {
  /** Where the element sits in the page before it sticks, in site pixels. */
  naturalTop: number
  /** The `top` it sticks at. */
  offset: number
  /** The bottom edge of its containing block, in page pixels. */
  containerBottom: number
  /** The element's own height. */
  height: number
}

/**
 * The viewport `top` of a `position: sticky` element at a scroll offset:
 * it scrolls with the page until it reaches `offset`, holds there, and
 * leaves again with the bottom of its container, exactly as the browser
 * lays it out. Model sticky chrome with this instead of pinning it, so a
 * travel looks like the real page scrolling.
 */
export function stickyTop(scroll: number, sticky: Sticky): number {
  const stuck = Math.max(sticky.offset, sticky.naturalTop - scroll)
  return Math.min(stuck, sticky.containerBottom - scroll - sticky.height)
}
