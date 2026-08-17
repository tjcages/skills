#!/usr/bin/env node
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const skillRoot = join(packRoot, "skills/orchestrator");
const check = process.argv.includes("--check");

const mappings = [
  ...[
    "EVALS.md",
    "EXAMPLES.md",
    "LEDGER.md",
    "METHODOLOGY.md",
    "READINESS.md",
    "RESPONSE.md",
    "WORKER-CONTRACT.md",
  ].map((name) => ({ source: join(packRoot, "shared", name), destination: join(skillRoot, "references", name) })),
  {
    source: join(packRoot, "src/validate-ledger.mjs"),
    destination: join(skillRoot, "scripts/validate-ledger.mjs"),
  },
  {
    source: join(packRoot, "examples/ledger.example.json"),
    destination: join(skillRoot, "examples/ledger.example.json"),
  },
];

function files(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  });
}

if (check) {
  const failures = [];
  const expected = mappings.map(({ destination }) => relative(skillRoot, destination)).sort();
  const actual = ["references", "scripts", "examples"]
    .flatMap((directory) => files(join(skillRoot, directory)))
    .map((file) => relative(skillRoot, file))
    .sort();
  if (JSON.stringify(expected) !== JSON.stringify(actual)) failures.push("installed asset file set differs from canonical mappings");
  for (const { source, destination } of mappings) {
    if (!existsSync(destination)) {
      failures.push(`missing ${relative(packRoot, destination)}`);
      continue;
    }
    if (readFileSync(source, "utf8") !== readFileSync(destination, "utf8")) {
      failures.push(`drift ${relative(packRoot, destination)}`);
    }
  }
  if (failures.length > 0) {
    for (const failure of failures) console.error(failure);
    console.error("Run `node orchestrator/scripts/sync-skill-assets.mjs`.");
    process.exit(1);
  }
  console.log(`Skill assets match ${mappings.length} canonical sources.`);
} else {
  for (const directory of ["references", "scripts", "examples"]) {
    rmSync(join(skillRoot, directory), { recursive: true, force: true });
  }
  for (const { source, destination } of mappings) {
    mkdirSync(dirname(destination), { recursive: true });
    cpSync(source, destination, { force: true });
  }
  console.log(`Synced ${mappings.length} assets into ${relative(packRoot, skillRoot)}.`);
}
