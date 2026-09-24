import { build } from "esbuild";
import { fileURLToPath } from "node:url";
export async function buildEditorUI() {
  const outfile = fileURLToPath(
    new URL(".cache/panels-ui.mjs", import.meta.url),
  );
  await build({
    entryPoints: [fileURLToPath(new URL("panels-ui.jsx", import.meta.url))],
    outfile,
    bundle: true,
    format: "esm",
    platform: "browser",
    target: "es2022",
    minify: true,
    define: { "process.env.NODE_ENV": '"production"' },
  });
  return outfile;
}
