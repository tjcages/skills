/**
 * The music's beat grid in film frames, so cuts can land on the beat.
 *
 * `edit.json` carries it as `"music"`, written by `node beats.mjs --bed
 * bed.json --write` (bed.mjs prints and saves these numbers):
 *
 *   "music": { "bpm": 112, "start": 0.456, "grid": 0.5, "tolerance": 2 }
 *
 * - `bpm`: tempo of the song.
 * - `start`: song time, in seconds, playing at film frame 0 (the mix's
 *   excerpt start). The song's first beat is at song time `phase` (default 0).
 * - `grid`: cut positions allowed, in beats. 1 = on the beat, 0.5 = on the
 *   beat or the off-beat. Half-beats give the edit room without losing sync.
 * - `tolerance`: frames a cut may sit from a grid line. 2 frames is under
 *   70 ms, below what reads as late.
 */
export type MusicGrid = {
  bpm: number
  start: number
  phase?: number
  grid?: number
  tolerance?: number
  fps?: number
}

export function gridStep(music: MusicGrid): number {
  const fps = music.fps ?? 30
  return (60 / music.bpm) * (music.grid ?? 0.5) * fps
}

/** Film frame of grid line `n` (fractional). */
function lineFrame(music: MusicGrid, n: number): number {
  const fps = music.fps ?? 30
  const origin = ((music.phase ?? 0) - music.start) * fps
  return origin + n * gridStep(music)
}

/** The nearest grid line to a film frame, and how far off the frame is. */
export function nearestGridLine(music: MusicGrid, frame: number): { frame: number; offset: number } {
  const fps = music.fps ?? 30
  const origin = ((music.phase ?? 0) - music.start) * fps
  const n = Math.round((frame - origin) / gridStep(music))
  const line = lineFrame(music, n)
  return { frame: line, offset: frame - line }
}

/** Every grid line inside the first `frames` frames of the film. */
export function gridLines(music: MusicGrid, frames: number): number[] {
  const lines: number[] = []
  const fps = music.fps ?? 30
  const origin = ((music.phase ?? 0) - music.start) * fps
  const first = Math.ceil(-origin / gridStep(music))
  for (let n = first; lineFrame(music, n) < frames; n++) lines.push(lineFrame(music, n))
  return lines
}

/** Frames per glimpse for a montage cut every `beats` beats. */
export function beatLength(music: MusicGrid, beats: number): number {
  const fps = music.fps ?? 30
  return (60 / music.bpm) * beats * fps
}
