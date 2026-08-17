#!/usr/bin/env node
import { existsSync, lstatSync, readFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const packRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skillRoot = resolve(packRoot, "skills/orchestrator");
const skillFile = resolve(skillRoot, "SKILL.md");

function fail(message) {
  console.error(message);
  process.exit(1);
}

function run(...arguments_) {
  const result = spawnSync(process.execPath, arguments_, { cwd: resolve(packRoot, ".."), stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function assertSelfContained(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (lstatSync(path).isSymbolicLink()) fail(`Installed skill contains a symlink: ${path}`);
    if (entry.isDirectory()) assertSelfContained(path);
  }
}

const skill = readFileSync(skillFile, "utf8");
const frontmatter = skill.match(/^---\n([\s\S]*?)\n---/);
if (!frontmatter) fail("SKILL.md frontmatter is missing or malformed.");
const name = frontmatter[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
const descriptionBlock = frontmatter[1].match(/^description:\s*>-\n([\s\S]*)$/m)?.[1];
if (name !== "orchestrator") fail("SKILL.md name must be orchestrator.");
if (!descriptionBlock) fail("SKILL.md folded description is required.");
const description = descriptionBlock.split("\n").map((line) => line.trim()).join(" ").trim();
if (!description.includes("Use when")) fail("SKILL.md description must contain trigger language.");
if (description.length > 1024) fail("SKILL.md description exceeds 1024 characters.");
if (skill.split("\n").length > 100) fail("SKILL.md exceeds 100 lines.");

for (const match of skill.matchAll(/\]\((\.\/[^)#]+)(?:#[^)]+)?\)/g)) {
  const target = resolve(skillRoot, match[1]);
  if (!existsSync(target)) fail(`Broken SKILL.md reference: ${match[1]}`);
}
assertSelfContained(skillRoot);
console.log("Skill metadata, line budget, and references are valid.");

run("orchestrator/scripts/sync-skill-assets.mjs", "--check");
run("orchestrator/evals/conformance.test.mjs");
run("orchestrator/src/validate-ledger.mjs", "orchestrator/examples/ledger.example.json");
run("orchestrator/skills/orchestrator/scripts/validate-ledger.mjs", "orchestrator/skills/orchestrator/examples/ledger.example.json");
console.log("Orchestrator verification passed.");
