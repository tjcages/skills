import { readFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
const edit = JSON.parse(readFileSync(new URL('./edit.json', import.meta.url), 'utf8'));
const folder = new URL('./out/qc/', import.meta.url);
mkdirSync(folder, { recursive: true });
const directory = fileURLToPath(folder);
for (const cut of edit.cuts) {
  const frames = [...new Set([cut.in, Math.floor((cut.in + cut.out - 1) / 2), cut.out - 1])];
  for (const frame of frames) {
    const output = join(directory, `${cut.scene}-${String(frame).padStart(4, '0')}.png`);
    execFileSync('npx', ['remotion', 'still', 'src/index.ts', cut.scene, output, `--frame=${frame}`], { stdio: 'ignore' });
    console.log(output);
  }
}
const duration = edit.cuts.reduce((sum, cut) => sum + cut.out - cut.in, 0);
const last = join(directory, 'film-last.png');
execFileSync('npx', ['remotion', 'still', 'src/index.ts', 'launch-film', last, `--frame=${duration - 1}`], { stdio: 'ignore' });
console.log(last);
