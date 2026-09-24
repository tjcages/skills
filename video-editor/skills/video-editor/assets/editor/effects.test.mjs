import { loadCuelume } from "./cuelume-bank.mjs";
await loadCuelume();
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  SOUNDS,
  replaceCueSounds,
  resolveCues,
  validateEffects,
  renderSoundtrack,
  synthesize,
  encodeWav,
} from "./effects.mjs";
const base = {
  version: 2,
  duration: 2,
  fps: 30,
  start: 0,
  volume: 0.5,
  fadeIn: 0,
  fadeOut: 0,
  musicEnabled: false,
  effectsEnabled: true,
  effectsVolume: 1,
  effects: [],
};
test("scene cues account for trims and omit removed animation events", () => {
  const edit = {
    cuts: [
      { scene: "intro", in: 10, out: 40 },
      { scene: "click", in: 5, out: 65 },
    ],
  };
  const cues = resolveCues(edit, {
    version: 1,
    fps: 30,
    cues: [
      {
        id: "a",
        scene: "click",
        frame: 20,
        sound: "click",
        volume: 0.5,
        label: "Click",
      },
      { id: "b", scene: "intro", frame: 4 },
    ],
  });
  assert.equal(cues.length, 1);
  assert.equal(cues[0].frame, 45);
  assert.throws(() =>
    resolveCues(edit, {
      version: 1,
      fps: 30,
      cues: [{ scene: "unknown", frame: 0 }],
    }),
  );
});
test("effects are sample-aligned, deterministic and layered on both music channels", () => {
  const cue = {
    id: "click",
    label: "Click",
    frame: 15,
    sound: "click",
    volume: 0.5,
  };
  const mix = { ...base, effects: [cue] };
  const stem = renderSoundtrack(mix, [], 48000).channels;
  assert.equal(
    stem[0].slice(0, 24000).some((v) => v !== 0),
    false,
  );
  assert.ok(stem[0].slice(24000, 25000).some((v) => v !== 0));
  assert.deepEqual(stem, renderSoundtrack(mix, [], 48000).channels);
  const music = [
    new Float32Array(96000).fill(0.1),
    new Float32Array(96000).fill(0.2),
  ];
  const result = renderSoundtrack(
    { ...mix, musicEnabled: true },
    music,
    48000,
  ).channels;
  assert.ok(Math.abs(result[0][24010] - (0.05 + stem[0][24010])) < 1e-6);
  assert.ok(Math.abs(result[1][24010] - (0.1 + stem[1][24010])) < 1e-6);
});
test("overlap preserves headroom and effect mute produces silence", () => {
  const cue = { id: "1", label: "Click", frame: 0, sound: "click", volume: 1 };
  const loud = {
    ...base,
    effects: Array.from({ length: 20 }, (_, i) => ({ ...cue, id: String(i) })),
  };
  const result = renderSoundtrack(loud);
  assert.ok(result.headroom < 1);
  assert.ok(result.channels[0].every((v) => Math.abs(v) <= 0.950001));
  assert.ok(
    renderSoundtrack({ ...loud, effectsEnabled: false }).channels[0].every(
      (v) => v === 0,
    ),
  );
  assert.ok(synthesize("press").some((value) => value !== 0));
  assert.equal(
    new DataView(encodeWav(result.channels).buffer).getUint16(20, true),
    3,
  );
});
test("rejects bad cue frames, duplicate IDs, unknown sounds and unbounded allocations", () => {
  const cue = { id: "1", label: "Click", frame: 0, sound: "click", volume: 1 };
  for (const patch of [
    { frame: -1 },
    { frame: 60 },
    { frame: 0.5 },
    { sound: "constructor" },
    { volume: NaN },
  ])
    assert.throws(() =>
      validateEffects({ ...base, effects: [{ ...cue, ...patch }] }),
    );
  assert.throws(() => validateEffects({ ...base, effects: [cue, cue] }));
  assert.throws(() => validateEffects({ ...base, duration: Infinity }));
});

test("all 17 Cuelume samples are finite, audible and shared with legacy cue names", () => {
  assert.equal(Object.keys(SOUNDS).length, 17);
  for (const name of Object.keys(SOUNDS)) {
    const pcm = synthesize(name);
    assert.ok(pcm.every(Number.isFinite), name);
    assert.ok(
      pcm.some((value) => Math.abs(value) > 0.00001),
      name,
    );
    assert.ok(pcm.length < 48000 * 4, `${name} tail fits the render window`);
  }
  assert.equal(synthesize("click"), synthesize("press"));
  assert.equal(synthesize("pop"), synthesize("droplet"));
  assert.equal(synthesize("whoosh"), synthesize("page"));
});

test("track speeds change source duration without shifting effect trigger frames", () => {
  const rate = 48000,
    music = new Float32Array(rate * 4);
  music[rate / 2] = 0.4;
  music[rate / 2 + 1] = 0.4;
  for (const speed of [0.5, 1, 2]) {
    const rendered = renderSoundtrack(
      {
        ...base,
        musicEnabled: true,
        effectsEnabled: false,
        volume: 1,
        musicSpeed: speed,
      },
      [music],
      rate,
    ).channels[0];
    const index = rate / 2 / speed;
    if (index < rendered.length) assert.equal(rendered[index], music[rate / 2]);
  }
  const cue = {
    id: "cue",
    label: "Press",
    sound: "press",
    frame: 15,
    volume: 1,
  };
  const normal = renderSoundtrack({ ...base, effects: [cue] }).channels[0];
  const fast = renderSoundtrack({ ...base, effects: [cue], effectsSpeed: 2 })
    .channels[0];
  assert.ok(fast.slice(0, 24000).every((v) => v === 0));
  assert.equal(fast[24000 + 100], normal[24000 + 200]);
  assert.throws(() => renderSoundtrack({ ...base, musicSpeed: 0 }));
});

test("bulk replacement preserves cue timing, levels and unrelated sounds", () => {
  const cues = [
    { id: "a", sound: "droplet", frame: 77, volume: 0.65, label: "Comment" },
    { id: "b", sound: "press", frame: 80, volume: 0.4, label: "Click" },
    { id: "c", sound: "pop", frame: 94, volume: 0.3, label: "Legacy" },
  ];
  const result = replaceCueSounds(cues, "droplet", "pulse");
  assert.deepEqual(result, [
    { ...cues[0], sound: "pulse" },
    cues[1],
    { ...cues[2], sound: "pulse" },
  ]);
  assert.equal(cues[0].sound, "droplet");
  assert.throws(() => replaceCueSounds(cues, "droplet", "missing"));
});
