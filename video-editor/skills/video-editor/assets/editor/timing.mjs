/** Pure timing shared by the browser editor and the lossless-picture exporter. */
export const FPS = 30;
export function cutTimeline(edit, fps = FPS) {
  if (
    !Number.isFinite(fps) ||
    fps <= 0 ||
    !Array.isArray(edit.cuts) ||
    !edit.cuts.length
  )
    throw Error("Invalid edit or frame rate.");
  let frame = 0;
  const cuts = edit.cuts.map((cut) => {
    if (
      ![cut.in, cut.out].every(Number.isInteger) ||
      cut.in < 0 ||
      cut.out <= cut.in
    )
      throw Error("Invalid cut range.");
    const at = frame / fps;
    frame += cut.out - cut.in;
    return { name: cut.scene, at, duration: (cut.out - cut.in) / fps };
  });
  return { cuts, duration: frame / fps, fps };
}

// A cut grid suggestion, not a claim about the music or the animation's tempo.
export function suggestTempo(cuts) {
  if (cuts.length < 3) return null;
  const intervals = cuts.slice(1).map((c, i) => c.at - cuts[i].at);
  const ranked = [];
  for (let bpm = 70; bpm <= 180; bpm += 0.5) {
    const beat = 60 / bpm;
    const error =
      intervals.reduce(
        (sum, t) => sum + Math.abs(t / beat - Math.round(t / beat)),
        0,
      ) / intervals.length;
    ranked.push({ bpm, error });
  }
  ranked.sort(
    (a, b) =>
      a.error - b.error || Math.abs(a.bpm - 120) - Math.abs(b.bpm - 120),
  );
  return ranked[0];
}

/** RMS onset envelope + normalized autocorrelation; estimates have half/double-time ambiguity. */
export function analyzeSamples(samples, sampleRate) {
  const hop = Math.max(1, Math.round(sampleRate / 100));
  const energy = [];
  const peaks = [];
  for (let i = 0; i < samples.length; i += hop) {
    let sum = 0;
    for (let j = i; j < Math.min(i + hop, samples.length); j++)
      sum += samples[j] ** 2;
    energy.push(Math.sqrt(sum / Math.min(hop, samples.length - i)));
  }
  for (let i = 0; i < 800; i++) {
    const start = Math.floor((i * samples.length) / 800);
    const end = Math.floor(((i + 1) * samples.length) / 800);
    let peak = 0;
    for (let j = start; j < end; j++)
      peak = Math.max(peak, Math.abs(samples[j]));
    peaks.push(peak);
  }
  const onset = energy.map((e, i) => Math.max(0, e - (energy[i - 1] || 0)));
  const strength = onset.reduce((sum, v) => sum + v * v, 0);
  if (strength < 1e-6 || samples.length / sampleRate < 4)
    return { bpm: null, confidence: 0, firstBeat: 0, peaks };
  const rate = sampleRate / hop;
  let best = { score: 0, lag: 0 };
  for (
    let lag = Math.floor((rate * 60) / 180);
    lag <= Math.ceil((rate * 60) / 70);
    lag++
  ) {
    let dot = 0,
      a = 0,
      b = 0;
    for (let i = lag; i < onset.length; i++) {
      dot += onset[i] * onset[i - lag];
      a += onset[i] ** 2;
      b += onset[i - lag] ** 2;
    }
    const score = dot / (Math.sqrt(a * b) || 1);
    if (score > best.score) best = { score, lag };
  }
  if (best.score < 0.12)
    return { bpm: null, confidence: best.score, firstBeat: 0, peaks };
  let phase = 0,
    max = -1;
  for (let offset = 0; offset < best.lag; offset++) {
    let sum = 0;
    for (let i = offset; i < onset.length; i += best.lag) sum += onset[i];
    if (sum > max) {
      max = sum;
      phase = offset;
    }
  }
  return {
    bpm: Math.round(((60 * rate) / best.lag) * 10) / 10,
    confidence: best.score,
    firstBeat: phase / rate,
    peaks,
  };
}

export function snapStart(start, cut, bpm, firstBeat, maxStart) {
  if (
    !(bpm > 0) ||
    ![start, cut, firstBeat, maxStart].every(Number.isFinite) ||
    maxStart < 0
  )
    throw Error("Invalid beat timing.");
  const beat = 60 / bpm;
  const minimum = Math.ceil((cut - firstBeat) / beat);
  const maximum = Math.floor((maxStart + cut - firstBeat) / beat);
  if (minimum > maximum) return null;
  const n = Math.max(
    minimum,
    Math.min(maximum, Math.round((start + cut - firstBeat) / beat)),
  );
  return firstBeat + n * beat - cut;
}

export function validateMix(mix, videoDuration, songDuration) {
  if (
    ![
      videoDuration,
      ...(mix.musicEnabled === false ? [] : [songDuration]),
    ].every((value) => Number.isFinite(value) && value > 0)
  )
    throw Error("Could not determine media duration.");
  for (const key of ["musicSpeed", "effectsSpeed"]) {
    const speed = mix[key] ?? 1;
    if (!Number.isFinite(speed) || speed < 0.5 || speed > 2)
      throw Error("Audio speed must be between 0.5× and 2×.");
  }
  if (![1, 2].includes(mix.version)) throw Error("Unsupported mix version.");
  for (const key of ["start", "duration", "volume", "fadeIn", "fadeOut"]) {
    if (!Number.isFinite(mix[key]) || mix[key] < 0)
      throw Error(`Invalid ${key}.`);
  }
  if (
    mix.duration <= 0 ||
    mix.volume > 1 ||
    mix.fadeIn + mix.fadeOut > mix.duration
  )
    throw Error("Invalid mix levels or fades.");
  if (Math.abs(mix.duration - videoDuration) > 0.08)
    throw Error(
      "The video duration changed. Reopen the editor and save a new mix.",
    );
  if (
    mix.musicEnabled !== false &&
    mix.start + mix.duration * (mix.musicSpeed ?? 1) > songDuration + 0.025
  )
    throw Error("The song is too short for this excerpt.");
  return mix;
}

export function gainAt(time, mix) {
  return (
    mix.volume *
    Math.min(
      1,
      mix.fadeIn ? Math.max(0, time / mix.fadeIn) : 1,
      mix.fadeOut ? Math.max(0, (mix.duration - time) / mix.fadeOut) : 1,
    )
  );
}
