import { buildEditorUI } from "./build-ui.mjs";
const editorBundle = await buildEditorUI();
import { ensureCuelume } from "./cuelume-bank.mjs";
import { SOUNDS } from "./effects.mjs";
const bankDirectory = await ensureCuelume();
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { createHash, randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { dirname, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";
const here = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2),
  options = {};
for (let i = 0; i < args.length; i += 2) {
  if (
    !["--video", "--edit", "--cues", "--port"].includes(args[i]) ||
    !args[i + 1]
  )
    throw Error(
      "Use --video /path/film.mp4 --edit /path/edit.json --port 4341",
    );
  options[args[i].slice(2)] = args[i + 1];
}
const video = options.video ? resolve(options.video) : null;
const edit = options.edit ? resolve(options.edit) : null;
const projectKey = createHash("sha256")
  .update(
    [video, edit, options.cues && resolve(options.cues)]
      .map((file) => {
        if (!file) return "none";
        if (!existsSync(file)) return `${file}:missing`;
        const { size, mtimeMs } = statSync(file);
        return `${file}:${size}:${mtimeMs}`;
      })
      .join("|"),
  )
  .digest("hex");
const files = new Map(
  [
    "index.html",
    "style.css",
    "studio.mjs",
    "timing.mjs",
    "effects.mjs",
    "effects-ui.mjs",
    "project-store.mjs",
    "browser-export.mjs",
  ].map((name) => [`/${name}`, resolve(here, name)]),
);
for (const name of [
  ...Object.keys(SOUNDS).map((name) => `${name}.wav`),
  "LICENSE.txt",
])
  files.set(`/cuelume/${name}`, fileURLToPath(new URL(name, bankDirectory)));
files.set("/panels-ui.mjs", editorBundle);
files.set("/", resolve(here, "index.html"));
if (video) files.set("/film.mp4", video);
if (edit) files.set("/edit.json", edit);
if (options.cues) files.set("/cues.json", resolve(options.cues));
const types = {
  ".html": "text/html",
  ".css": "text/css",
  ".mjs": "text/javascript",
  ".json": "application/json",
  ".mp4": "video/mp4",
  ".wav": "audio/wav",
  ".txt": "text/plain",
};
const port = Number(options.port || 4341);
if (!Number.isInteger(port) || port < 1024 || port > 65535)
  throw Error("Invalid port.");
let exporting = false;
const exports = new Map();
const run = promisify(execFile);
createServer(async (req, res) => {
  if (req.url === "/capabilities.json" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ localExport: true, projectKey }));
    return;
  }
  if (req.url === "/export" && req.method === "POST") {
    // A local encoder is not an open service: only this studio may submit.
    if (
      req.headers.origin !== `http://127.0.0.1:${port}` ||
      req.headers.host !== `127.0.0.1:${port}`
    ) {
      res.writeHead(403);
      res.end("Export must be started from the local studio.");
      return;
    }
    if (exporting) {
      res.writeHead(409);
      res.end("An export is already running.");
      return;
    }
    exporting = true;
    let temp;
    try {
      const limit = 160 * 1024 * 1024;
      let size = 0;
      const chunks = [];
      if (Number(req.headers["content-length"]) > limit)
        throw Error("Export files exceed 160 MB.");
      req.setTimeout(30000, () => req.destroy());
      for await (const chunk of req) {
        size += chunk.length;
        if (size > limit) throw Error("Export files exceed 160 MB.");
        chunks.push(chunk);
      }
      const form = await new Response(Buffer.concat(chunks), {
        headers: { "Content-Type": req.headers["content-type"] || "" },
      }).formData();
      const picture = form.get("video"),
        music = form.get("song"),
        recipe = form.get("mix");
      if (
        !picture ||
        typeof picture === "string" ||
        !picture.size ||
        typeof recipe !== "string" ||
        recipe.length > 100000
      )
        throw Error("Provide a video and valid mix settings.");
      if (music && typeof music === "string")
        throw Error("Invalid music file.");
      temp = await mkdtemp(resolve(tmpdir(), "video-export-"));
      const input = resolve(temp, "video.input"),
        mix = resolve(temp, "mix.json"),
        output = resolve(temp, "video-with-sound.mp4");
      await writeFile(input, new Uint8Array(await picture.arrayBuffer()));
      await writeFile(mix, recipe);
      const args = [
        resolve(here, "mix.mjs"),
        "--video",
        input,
        "--mix",
        mix,
        "--out",
        output,
      ];
      if (music) {
        const track = resolve(temp, "song.input");
        await writeFile(track, new Uint8Array(await music.arrayBuffer()));
        args.push("--song", track);
      }
      await run(process.execPath, args, {
        timeout: 120000,
        maxBuffer: 1024 * 1024,
      });
      const download = `/exports/${randomUUID()}.mp4`;
      const directory = temp;
      const remove = async () => {
        files.delete(download);
        exports.delete(download);
        await rm(directory, { recursive: true, force: true });
      };
      await rm(input);
      await rm(mix);
      if (music) await rm(resolve(temp, "song.input"));
      files.set(download, output);
      exports.set(download, remove);
      if (exports.size > 5) await exports.values().next().value();
      setTimeout(() => remove().catch(() => {}), 10 * 60 * 1000).unref();
      temp = undefined;
      res.writeHead(200, {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      });
      res.end(JSON.stringify({ download }));
    } catch (error) {
      if (!res.headersSent && !res.destroyed) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end(
          `Could not export. Check the media, mix settings and FFmpeg installation. ${String(error.stderr || error.message).slice(-1800)}`,
        );
      }
    } finally {
      if (temp) await rm(temp, { recursive: true, force: true });
      exporting = false;
    }
    return;
  }
  const file = files.get(new URL(req.url, "http://localhost").pathname);
  if (!["GET", "HEAD"].includes(req.method) || !file || !existsSync(file)) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  const { size } = statSync(file);
  const headers = {
    "Content-Type": types[extname(file)] || "application/octet-stream",
    "Accept-Ranges": "bytes",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  };
  if (exports.has(req.url))
    headers["Content-Disposition"] =
      'attachment; filename="video-with-sound.mp4"';
  let start = 0,
    end = size - 1,
    code = 200;
  if (req.headers.range) {
    const range = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range);
    if (!range) {
      res.writeHead(416, { "Content-Range": `bytes */${size}` });
      res.end();
      return;
    }
    start = Number(range[1]);
    end = range[2] ? Math.min(Number(range[2]), size - 1) : end;
    if (start > end || start >= size) {
      res.writeHead(416, { "Content-Range": `bytes */${size}` });
      res.end();
      return;
    }
    headers["Content-Range"] = `bytes ${start}-${end}/${size}`;
    code = 206;
  }
  headers["Content-Length"] = end - start + 1;
  res.writeHead(code, headers);
  if (req.method === "HEAD") res.end();
  else createReadStream(file, { start, end }).pipe(res);
}).listen(port, "127.0.0.1", () =>
  console.log(
    `Video editor: http://127.0.0.1:${port}\nVideo: ${video || "choose in browser"}\nEdit: ${edit || "none"}`,
  ),
);
