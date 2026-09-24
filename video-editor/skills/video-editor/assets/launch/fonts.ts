import { loadFont } from '@remotion/fonts'

export type SiteFont = {
  family: string
  url: string
  weight?: string
  style?: string
  format?: 'woff2' | 'woff' | 'truetype' | 'opentype'
}

/**
 * Load the product's own faces before any frame renders. Remotion waits for
 * the returned promise, so no still is ever captured in a fallback face.
 * Self-hosted files come through the symlink; a CDN needs to answer with
 * `access-control-allow-origin`, which most font CDNs do.
 */
export function loadSiteFonts(fonts: SiteFont[]): Promise<void> {
  return Promise.all(
    fonts.map(font =>
      loadFont({
        family: font.family,
        url: font.url,
        weight: font.weight,
        style: font.style,
        format: font.format,
      })
    )
  ).then(() => undefined)
}
