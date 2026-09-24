import { STAGGER_FRAMES } from './motion'

export const READING_WORDS_PER_SECOND = 3

export const READING_SETTLE_FRAMES = 12

export const MIN_READ_HOLD_FRAMES = 45

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

/**
 * The frames a line must stay on screen before anything may exit or cut:
 * the word-by-word entrance, then reading time at on-screen pace with a
 * floor. Hold text through this count; trim after it, never inside it.
 */
export function readingFrames(text: string, fps = 30): number {
  const words = countWords(text)
  const entering = words * STAGGER_FRAMES + READING_SETTLE_FRAMES
  const reading = Math.ceil((words / READING_WORDS_PER_SECOND) * fps)
  return entering + Math.max(reading, MIN_READ_HOLD_FRAMES)
}

/**
 * Throws when a text scene's trimmed length cuts into its reading hold.
 * Run it for every text scene in edit.json; `validateEdit` proves motion,
 * this proves legibility, and neither trusts you.
 */
export function validateReadingHold(
  scene: string,
  text: string,
  trimmedFrames: number,
  fps = 30
): void {
  const needed = readingFrames(text, fps)
  if (trimmedFrames < needed) {
    throw new Error(
      `Scene "${scene}" holds "${text}" for ${trimmedFrames} frames but ` +
        `reading needs ${needed}. Trim later, shorten the line, or split ` +
        `it across chained scenes.`
    )
  }
}
