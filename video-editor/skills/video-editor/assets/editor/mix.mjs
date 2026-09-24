import { loadCuelume } from "./cuelume-bank.mjs";
await loadCuelume();
import { execFileSync } from "node:child_process";
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdtempSync,
  rmSync,
} from "node:fs";
import { resolve, join } from "node:path";
import { tmpdir } from "node:os";
import { validateMix } from "./timing.mjs";
import {
  validateEffects,
  renderSoundtrack,
  encodeWav,
  SAMPLE_RATE,
} from "./effects.mjs";
const args = process.argv.slice(2),
  options = {};
for (let i = 0; i < args.length; i += 2) {
  if (
    !["--video", "--song", "--mix", "--out"].includes(args[i]) ||
    !args[i + 1] ||
    args[i + 1].startsWith("--")
  )
    throw Error(
      "Use --video film.mp4 [--song song.wav] --mix video-mix.json --out mixed.mp4",
    );
  options[args[i].slice(2)] = resolve(args[i + 1]);
}
if (!["video", "mix", "out"].every((key) => options[key]))
  throw Error("Provide --video, --mix and --out.");
if (existsSync(options.out))
  throw Error("Output already exists. Choose a new output path.");
const probe = (file) =>
  JSON.parse(
    execFileSync(
      "ffprobe",
      ["-v", "error", "-show_format", "-show_streams", "-of", "json", file],
      { encoding: "utf8" },
    ),
  );
const video = probe(options.video),
  picture = video.streams.find((s) => s.codec_type === "video");
if (!picture) throw Error("Expected a video stream.");
const duration = Number(picture.duration || video.format.duration);
const mix = JSON.parse(readFileSync(options.mix, "utf8"));
if (mix.version === 2) validateEffects(mix);
let songDuration,
  music = [];
if (mix.musicEnabled !== false) {
  if (!options.song) throw Error("This mix needs --song.");
  const song = probe(options.song),
    sound = song.streams.find((s) => s.codec_type === "audio");
  if (!sound) throw Error("Expected an audio stream.");
  if (sound.channels > 2) throw Error("Use a mono or stereo song.");
  songDuration = Number(sound.duration || song.format.duration);
}
validateMix(mix, duration, songDuration);
if (mix.musicEnabled !== false) {
  const raw = execFileSync(
    "ffmpeg",
    [
      "-v",
      "error",
      "-i",
      options.song,
      "-ss",
      String(mix.start),
      "-t",
      String(mix.duration * (mix.musicSpeed ?? 1)),
      "-map",
      "0:a:0",
      "-ar",
      String(SAMPLE_RATE),
      "-ac",
      "2",
      "-f",
      "f32le",
      "pipe:1",
    ],
    { maxBuffer: 256 * 1024 * 1024 },
  );
  const count = Math.floor(raw.length / 8);
  music = [new Float32Array(count), new Float32Array(count)];
  for (let i = 0; i < count; i++) {
    music[0][i] = raw.readFloatLE(i * 8);
    music[1][i] = raw.readFloatLE(i * 8 + 4);
  }
}
const { channels, headroom } = renderSoundtrack(mix, music, SAMPLE_RATE, 0);
const temp = mkdtempSync(join(tmpdir(), "video-soundtrack-"));
try {
  const wav = join(temp, "soundtrack.wav");
  writeFileSync(wav, encodeWav(channels));
  execFileSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-v",
      "warning",
      "-n",
      "-i",
      options.video,
      "-i",
      wav,
      "-map",
      "0:v:0",
      "-map",
      "1:a:0",
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      "-t",
      String(duration),
      "-movflags",
      "+faststart",
      options.out,
    ],
    { stdio: "inherit" },
  );
} finally {
  rmSync(temp, { recursive: true, force: true });
}
console.log(
  `Exported ${options.out}: ${mix.musicEnabled === false ? "no music" : "music"} + ${mix.effectsEnabled ? mix.effects.length : 0} effects; ${duration.toFixed(3)}s. Picture copied. Peak headroom gain ${headroom.toFixed(3)}.`,
);
