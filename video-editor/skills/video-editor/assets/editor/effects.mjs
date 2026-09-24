import { gainAt } from "./timing.mjs";
export const SOUNDS = Object.freeze(
  Object.fromEntries(
    "chime sparkle droplet bloom whisper tick press release toggle success error page loading ready pulse scan arrival"
      .split(" ")
      .map((name) => [name, true]),
  ),
);
export const SAMPLE_RATE = 48000;
const aliases = { click: "press", pop: "droplet", whoosh: "page" };
export const canonicalSound = (sound) =>
  Object.hasOwn(aliases, sound) ? aliases[sound] : sound;
let soundBank;
export function installSoundBank(bank) {
  soundBank = bank;
}
export async function loadBrowserSounds() {
  const bank = {};
  await Promise.all(
    Object.keys(SOUNDS).map(async (name) => {
      const response = await fetch(`cuelume/${name}.wav`);
      if (!response.ok) throw Error(`Cuelume sound unavailable: ${name}`);
      bank[name] = new Float32Array((await response.arrayBuffer()).slice(44));
    }),
  );
  installSoundBank(bank);
}

// Scene-local frames survive preceding trim changes. Cues removed by a trim
// are omitted; unknown/ambiguous scene names fail rather than drift silently.
export function resolveCues(edit, sheet) {
  if (sheet.version !== 1 || sheet.fps !== 30 || !Array.isArray(sheet.cues))
    throw Error("Invalid cue sheet. Use version 1 at 30 fps.");
  const scenes = new Map();
  let offset = 0;
  for (const cut of edit.cuts) {
    if (scenes.has(cut.scene)) throw Error(`Ambiguous scene: ${cut.scene}`);
    scenes.set(cut.scene, { ...cut, offset });
    offset += cut.out - cut.in;
  }
  return sheet.cues.flatMap((cue) => {
    const cut = scenes.get(cue.scene);
    if (!cut) throw Error(`Unknown cue scene: ${cue.scene}`);
    if (!Number.isInteger(cue.frame) || cue.frame < 0)
      throw Error("Cue frames must be nonnegative integers.");
    if (cue.frame < cut.in || cue.frame >= cut.out) return [];
    return [
      {
        id: cue.id,
        label: cue.label,
        sound: canonicalSound(cue.sound),
        volume: cue.volume,
        frame: cut.offset + cue.frame - cut.in,
      },
    ];
  });
}
export function validateEffects(mix) {
  if (!Number.isFinite(mix.duration) || mix.duration <= 0 || mix.duration > 600)
    throw Error("Use a film between 0 and 600 seconds.");
  if (!Number.isInteger(mix.fps) || mix.fps < 1 || mix.fps > 120)
    throw Error("Invalid cue frame rate.");
  if (!Array.isArray(mix.effects) || mix.effects.length > 500)
    throw Error("Use at most 500 sound cues.");
  if (
    !Number.isFinite(mix.effectsVolume) ||
    mix.effectsVolume < 0 ||
    mix.effectsVolume > 1 ||
    typeof mix.effectsEnabled !== "boolean" ||
    typeof mix.musicEnabled !== "boolean"
  )
    throw Error("Invalid audio layer settings.");
  const ids = new Set();
  for (const cue of mix.effects) {
    if (typeof cue.id !== "string" || !cue.id || ids.has(cue.id))
      throw Error("Cue IDs must be unique.");
    ids.add(cue.id);
    if (
      typeof cue.label !== "string" ||
      cue.label.length > 120 ||
      !Object.hasOwn(SOUNDS, canonicalSound(cue.sound))
    )
      throw Error("Invalid cue label or sound.");
    if (
      !Number.isInteger(cue.frame) ||
      cue.frame < 0 ||
      cue.frame / mix.fps >= mix.duration
    )
      throw Error(`Cue outside the film: ${cue.label}`);
    if (!Number.isFinite(cue.volume) || cue.volume < 0 || cue.volume > 1)
      throw Error("Cue volume must be between 0 and 1.");
  }
}

// Both audition and export consume the same rendered Cuelume samples.
export function synthesize(sound, rate = SAMPLE_RATE) {
  const source = soundBank?.[canonicalSound(sound)];
  if (!source)
    throw Error("Cuelume sounds are unavailable. Reload the studio.");
  if (rate === SAMPLE_RATE) return source;
  const result = new Float32Array(
    Math.round((source.length * rate) / SAMPLE_RATE),
  );
  for (let i = 0; i < result.length; i++) {
    const position = (i * SAMPLE_RATE) / rate,
      index = Math.floor(position),
      fraction = position - index;
    result[i] =
      source[index] * (1 - fraction) + (source[index + 1] ?? 0) * fraction;
  }
  return result;
}

/** Music channels must be decoded/resampled to rate. Both paths share fades,
 * cue samples, summation and peak headroom; normalization never boosts quiet audio. */
export function renderSoundtrack(
  mix,
  musicChannels = [],
  rate = SAMPLE_RATE,
  musicStart = mix.start,
) {
  if (mix.version === 2) validateEffects(mix);
  const musicSpeed = mix.musicSpeed ?? 1,
    effectsSpeed = mix.effectsSpeed ?? 1;
  if (
    ![musicSpeed, effectsSpeed].every(
      (speed) => Number.isFinite(speed) && speed >= 0.5 && speed <= 2,
    )
  )
    throw Error("Audio speed must be between 0.5× and 2×.");
  const sample = (data, position) => {
    const index = Math.floor(position),
      fraction = position - index;
    return (
      (data[index] ?? 0) * (1 - fraction) + (data[index + 1] ?? 0) * fraction
    );
  };
  const length = Math.round(mix.duration * rate);
  if (!Number.isFinite(length) || length < 1 || length > rate * 600)
    throw Error("Invalid soundtrack length.");
  const channels = [new Float32Array(length), new Float32Array(length)];
  if (mix.musicEnabled !== false) {
    if (!musicChannels.length)
      throw Error("Load the music file before exporting.");
    const start = Math.round(musicStart * rate);
    for (let i = 0; i < length; i++) {
      const volume = gainAt(i / rate, mix);
      const position = start + i * musicSpeed;
      channels[0][i] = sample(musicChannels[0], position) * volume;
      channels[1][i] =
        sample(musicChannels[1] ?? musicChannels[0], position) * volume;
    }
  }
  if (mix.effectsEnabled) {
    const cache = new Map();
    for (const cue of mix.effects) {
      if (!cache.has(cue.sound))
        cache.set(cue.sound, synthesize(cue.sound, rate));
      const sound = cache.get(cue.sound),
        start = Math.round((cue.frame / mix.fps) * rate);
      for (
        let i = 0;
        i * effectsSpeed < sound.length && start + i < length;
        i++
      ) {
        const value =
          sample(sound, i * effectsSpeed) * cue.volume * mix.effectsVolume;
        channels[0][start + i] += value;
        channels[1][start + i] += value;
      }
    }
  }
  let peak = 0;
  for (let i = 0; i < length; i++)
    peak = Math.max(peak, Math.abs(channels[0][i]), Math.abs(channels[1][i]));
  const headroom = peak > 0.95 ? 0.95 / peak : 1;
  if (headroom < 1)
    for (const channel of channels)
      for (let i = 0; i < length; i++) channel[i] *= headroom;
  return { channels, headroom };
}
export function encodeWav(channels, rate = SAMPLE_RATE) {
  const length = channels[0].length,
    count = channels.length;
  const bytes = new ArrayBuffer(44 + length * count * 4),
    view = new DataView(bytes);
  const text = (offset, value) =>
    [...value].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)));
  text(0, "RIFF");
  view.setUint32(4, bytes.byteLength - 8, true);
  text(8, "WAVE");
  text(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 3, true);
  view.setUint16(22, count, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * count * 4, true);
  view.setUint16(32, count * 4, true);
  view.setUint16(34, 32, true);
  text(36, "data");
  view.setUint32(40, length * count * 4, true);
  for (let i = 0; i < length; i++)
    for (let ch = 0; ch < count; ch++)
      view.setFloat32(44 + (i * count + ch) * 4, channels[ch][i], true);
  return new Uint8Array(bytes);
}

// Bulk edits change sound identity only, preserving each event's timing and mix.
export function replaceCueSounds(cues, from, to) {
  if (!Object.hasOwn(SOUNDS, from) || !Object.hasOwn(SOUNDS, to))
    throw Error("Choose a valid Cuelume sound.");
  return cues.map((cue) =>
    canonicalSound(cue.sound) === from ? { ...cue, sound: to } : cue,
  );
}
