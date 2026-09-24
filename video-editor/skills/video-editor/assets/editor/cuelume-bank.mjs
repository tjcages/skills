// Offline rendering of the unmodified, pinned MIT-licensed Cuelume engine.
import { OfflineAudioContext } from "node-web-audio-api";
import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import {
  SOUNDS,
  SAMPLE_RATE,
  encodeWav,
  installSoundBank,
} from "./effects.mjs";
export const bankDirectory = new URL(
  "./.cache/cuelume-0.2.2/",
  import.meta.url,
);
export async function ensureCuelume() {
  await mkdir(bankDirectory, { recursive: true });
  for (const name of Object.keys(SOUNDS)) {
    const file = new URL(`${name}.wav`, bankDirectory);
    try {
      await readFile(file);
      continue;
    } catch {
      /* Render missing assets. */
    }
    const context = new OfflineAudioContext(1, SAMPLE_RATE * 4, SAMPLE_RATE);
    // Cuelume expects a running browser AudioContext. Bind its normal Web Audio
    // calls to an offline context so its original envelopes/filters stay intact.
    const proxy = new Proxy(context, {
      get(target, key) {
        if (key === "state") return "running";
        const value = Reflect.get(target, key, target);
        return typeof value === "function" ? value.bind(target) : value;
      },
    });
    const oldWindow = globalThis.window,
      oldRandom = Math.random;
    const oldTimeout = globalThis.setTimeout;
    let seed = 127;
    try {
      globalThis.window = {
        AudioContext: class {
          constructor() {
            return proxy;
          }
        },
      };
      Math.random = () =>
        (seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296;
      // Upstream cleanup uses wall time; offline nodes must live until rendering ends.
      globalThis.setTimeout = () => 0;
      const engine = await import(
        new URL(
          `audio/engine.js?render=${name}`,
          import.meta.resolve("cuelume"),
        )
      );
      engine.play(name);
    } finally {
      if (oldWindow === undefined) delete globalThis.window;
      else globalThis.window = oldWindow;
      Math.random = oldRandom;
      globalThis.setTimeout = oldTimeout;
    }
    const audio = (await context.startRendering()).getChannelData(0);
    let end = audio.length;
    while (end > 1 && Math.abs(audio[end - 1]) < 1e-7) end--;
    if (!audio.some((v) => Math.abs(v) > 1e-5))
      throw Error(`Cuelume ${name} rendered silence.`);
    await writeFile(
      file,
      encodeWav([audio.slice(0, Math.min(audio.length, end + 480))]),
    );
  }
  await copyFile(
    new URL("../LICENSE", import.meta.resolve("cuelume")),
    new URL("LICENSE.txt", bankDirectory),
  );
  return bankDirectory;
}
export async function loadCuelume() {
  await ensureCuelume();
  const bank = {};
  for (const name of Object.keys(SOUNDS)) {
    const bytes = await readFile(new URL(`${name}.wav`, bankDirectory));
    bank[name] = new Float32Array(
      bytes.buffer.slice(
        bytes.byteOffset + 44,
        bytes.byteOffset + bytes.byteLength,
      ),
    );
  }
  installSoundBank(bank);
}
