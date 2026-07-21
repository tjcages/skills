#!/usr/bin/env node
// Installs the linear-tracking skill pack + file-based always-on snippets.
// Prefer: npx skills add tjcages/linear-methodology-skill -g -a '*' -y
// Then (Cursor): say "finish linear-tracking install"

import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const pkgRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const skillsSrc = join(pkgRoot, "skills");
const alwaysOnPath = join(pkgRoot, "shared", "ALWAYS_ON.md");

const DEST_ROOTS = [
  join(homedir(), ".claude", "skills"),
  join(homedir(), ".cursor", "skills"),
  join(homedir(), ".codex", "skills"),
  join(homedir(), ".agents", "skills"),
];

const ALWAYS_ON_FILES = [
  join(homedir(), ".claude", "CLAUDE.md"),
  join(homedir(), ".codex", "AGENTS.md"),
  join(homedir(), ".agents", "AGENTS.md"),
];

const MARK_START = "<!-- linear-tracking-always-on -->";
const MARK_END = "<!-- /linear-tracking-always-on -->";

const SKILL_NAMES = readdirSync(skillsSrc).filter((name) =>
  existsSync(join(skillsSrc, name, "SKILL.md")),
);

if (SKILL_NAMES.length === 0) {
  console.error("✗ No skills/*/SKILL.md found — corrupt package.");
  process.exit(1);
}

if (!existsSync(alwaysOnPath)) {
  console.error("✗ shared/ALWAYS_ON.md missing — corrupt package.");
  process.exit(1);
}

const alwaysOnBody = readFileSync(alwaysOnPath, "utf8").trim();

function installSkill(root, skillName) {
  const src = join(skillsSrc, skillName);
  const dest = join(root, skillName);
  if (existsSync(dest)) {
    if (!existsSync(join(dest, "SKILL.md"))) {
      console.error(`✗ ${dest} exists but has no SKILL.md — skipping.`);
      return false;
    }
    rmSync(dest, { recursive: true });
  }
  mkdirSync(root, { recursive: true });
  cpSync(src, dest, { recursive: true });
  console.log(`✓ ${dest}`);
  return true;
}

function upsertAlwaysOn(filePath) {
  const block = `${MARK_START}\n${alwaysOnBody}\n${MARK_END}`;
  mkdirSync(dirname(filePath), { recursive: true });
  let existing = existsSync(filePath) ? readFileSync(filePath, "utf8") : "";
  if (existing.includes(MARK_START) && existing.includes(MARK_END)) {
    existing = existing.replace(
      new RegExp(`${MARK_START}[\\s\\S]*?${MARK_END}`),
      block,
    );
    writeFileSync(filePath, existing);
    console.log(`↻ Always-on updated → ${filePath}`);
    return;
  }
  const sep = existing.trim().length ? "\n\n" : "";
  writeFileSync(filePath, `${existing.trimEnd()}${sep}${block}\n`);
  console.log(`✓ Always-on written → ${filePath}`);
}

let ok = 0;
for (const root of DEST_ROOTS) {
  mkdirSync(root, { recursive: true });
  for (const name of SKILL_NAMES) {
    if (installSkill(root, name)) ok += 1;
  }
}

if (ok === 0) {
  console.error("✗ No skill installs completed.");
  process.exit(1);
}

console.log("");
for (const file of ALWAYS_ON_FILES) {
  try {
    upsertAlwaysOn(file);
  } catch (err) {
    console.error(`✗ Always-on failed for ${file}: ${err.message}`);
  }
}

const version = JSON.parse(readFileSync(join(pkgRoot, "package.json"), "utf8")).version;
console.log(`\n✓ linear-methodology ${version} → ${ok} skill installs across ${DEST_ROOTS.length} roots`);
console.log(`  Skills: ${SKILL_NAMES.join(", ")}`);
console.log(`\nCursor User Rules cannot be written from this CLI.`);
console.log(`Next (one sentence in Cursor Agent chat):`);
console.log(`  finish linear-tracking install`);
console.log(`That writes the Cursor always-on rule and checks Linear auth (Automation optional).`);
console.log(`\nOr: npx skills add tjcages/linear-methodology-skill -g -a '*' -y`);
console.log(`Then the same finish sentence. Full steps: INSTALL.md`);
