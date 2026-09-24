import { readFileSync } from 'node:fs';
const edit = JSON.parse(readFileSync(new URL('./edit.json', import.meta.url), 'utf8'));
const cues = JSON.parse(readFileSync(new URL('./cues.example.json', import.meta.url), 'utf8'));
if (!Array.isArray(edit.cuts) || !edit.cuts.length) throw Error('Add at least one cut.');
const names = new Set();
for (const cut of edit.cuts) {
  if (!cut.scene || names.has(cut.scene) || !Number.isInteger(cut.in) ||
      !Number.isInteger(cut.out) || cut.in < 0 || cut.out <= cut.in)
    throw Error(`Invalid or repeated cut: ${cut.scene}`);
  names.add(cut.scene);
}
if (cues.version !== 1 || cues.fps !== 30 || !Array.isArray(cues.cues))
  throw Error('Cue sheet must use version 1 and 30 fps.');
for (const cue of cues.cues) {
  const cut = edit.cuts.find((item) => item.scene === cue.scene);
  if (!cut || !Number.isInteger(cue.frame) || cue.frame < cut.in || cue.frame >= cut.out)
    throw Error(`Cue outside a shown scene: ${cue.id}`);
}
console.log(`Valid: ${edit.cuts.length} cuts, ${edit.cuts.reduce((n, c) => n + c.out - c.in, 0)} frames, ${cues.cues.length} cues.`);
