import { test } from "node:test";
import assert from "node:assert/strict";
import {
  analyzeSamples,
  cutTimeline,
  snapStart,
  validateMix,
  gainAt,
  suggestTempo,
} from "./timing.mjs";
test("cut timing uses trimmed lengths rather than source frame positions", () => {
  const result = cutTimeline({
    cuts: [
      { scene: "a", in: 10, out: 40 },
      { scene: "b", in: 20, out: 80 },
    ],
  });
  assert.equal(result.duration, 3);
  assert.equal(result.cuts[1].at, 1);
  assert.throws(() => cutTimeline({ cuts: [{ in: 9, out: 1 }] }));
});
test("estimates a known pulse and rejects silence", () => {
  const sr = 8000,
    samples = new Float32Array(sr * 12);
  for (let t = 0.13; t < 12; t += 0.5)
    for (let i = 0; i < 80; i++)
      samples[Math.round(t * sr) + i] = Math.sin(i) * Math.exp(-i / 30);
  const result = analyzeSamples(samples, sr);
  assert.ok(Math.abs(result.bpm - 120) < 1);
  assert.ok(Math.abs(result.firstBeat - 0.13) < 0.02);
  assert.equal(analyzeSamples(new Float32Array(sr * 10), sr).bpm, null);
});
test("snapping preserves a beat at the cut even near track boundaries", () => {
  for (const start of [0, 0.1, 3, 9.9]) {
    const snapped = snapStart(start, 2.2, 120, 0.13, 10);
    assert.ok(snapped >= 0 && snapped <= 10);
    assert.ok(
      Math.abs(
        (snapped + 2.2 - 0.13) / 0.5 - Math.round((snapped + 2.2 - 0.13) / 0.5),
      ) < 1e-9,
    );
  }
  assert.equal(snapStart(0, 0, 120, 0.2, 0.1), null);
});
test("mix prevents short songs, stale video timing, and unsafe filter values", () => {
  const mix = {
    version: 1,
    start: 2,
    duration: 20,
    volume: 0.8,
    fadeIn: 0.2,
    fadeOut: 0.8,
  };
  assert.equal(validateMix(mix, 20, 22), mix);
  assert.throws(() => validateMix(mix, 21, 22));
  assert.throws(() => validateMix(mix, 20, 21));
  assert.throws(() => validateMix({ ...mix, start: "1,amovie=x" }, 20, 30));
  assert.throws(() => validateMix({ ...mix, fadeIn: 30 }, 20, 40));
  assert.throws(() => validateMix({ ...mix, musicSpeed: 2 }, 20, 30));
  assert.doesNotThrow(() => validateMix({ ...mix, musicSpeed: 0.5 }, 20, 12));
  assert.throws(() => validateMix({ ...mix, effectsSpeed: Infinity }, 20, 22));
  assert.equal(gainAt(0, mix), 0);
  assert.equal(gainAt(10, mix), 0.8);
  assert.equal(gainAt(20, mix), 0);
});
test("suggested rhythm follows cut intervals", () => {
  const result = suggestTempo([0, 1.5, 3.5, 4.5, 7].map((at) => ({ at })));
  assert.equal(result.bpm, 120);
  assert.equal(result.error, 0);
});
