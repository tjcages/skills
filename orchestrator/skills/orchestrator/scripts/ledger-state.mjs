#!/usr/bin/env node
import { readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { validateLedger } from "./validate-ledger.mjs";

function text(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function checks(ledger) {
  return [...(ledger.verification?.localChecks ?? []), ...(ledger.verification?.prChecks ?? [])];
}

function verificationCriterion(ledger) {
  const id = ledger.verification?.readinessCriterionId;
  return ledger.readiness?.criteria?.find((criterion) => criterion.id === id);
}

function preserveEvidence(record, revision, status, evidence) {
  if (!text(evidence) && !(Array.isArray(evidence) && evidence.length > 0)) return;
  record.evidenceHistory = [
    ...(Array.isArray(record.evidenceHistory) ? record.evidenceHistory : []),
    { revision: text(revision) ? revision : "unknown", status, evidence },
  ];
}

function invalidateProductEvidence(ledger, { includeRepository }) {
  const repositoryCriterion = verificationCriterion(ledger);
  for (const criterion of ledger.readiness?.criteria ?? []) {
    if (criterion.status === "deferred" && criterion.deferredByUser === true) continue;
    if (!includeRepository && criterion === repositoryCriterion) continue;
    preserveEvidence(criterion, criterion.revision, criterion.status, criterion.evidence);
    criterion.status = "pending";
    criterion.revision = "";
    criterion.evidence = [];
    criterion.deferredByUser = false;
  }
  for (const workstream of ledger.workstreams ?? []) {
    if (workstream.reliedOn !== true) continue;
    preserveEvidence(workstream, workstream.verifiedRevision, workstream.state, workstream.evidence);
    workstream.verifiedRevision = "";
  }
  for (const check of ledger.program?.integratedChecks ?? []) {
    preserveEvidence(check, check.revision, check.status, check.evidence);
    check.status = "pending";
    check.revision = "";
    check.evidence = "";
  }
  const delivery = ledger.program?.delivery;
  if (delivery) {
    preserveEvidence(delivery, delivery.revision, delivery.status, delivery.artifacts);
    delivery.status = "pending";
    delivery.revision = "";
  }
}

function refreshVerificationCriterion(ledger) {
  const criterion = verificationCriterion(ledger);
  if (!criterion) return;
  const required = checks(ledger).filter((check) => check.required === true);
  const passing = required.every((check) =>
    ["passed", "waived"].includes(check.status) && check.revision === ledger.verification.revision,
  );
  criterion.status = passing ? "verified" : "pending";
  criterion.revision = passing ? ledger.verification.revision : "";
  criterion.evidence = passing ? required.map((check) => `${check.name}: ${check.evidence}`) : [];
  criterion.deferredByUser = false;
}

function assertValid(ledger) {
  const errors = validateLedger(ledger);
  if (errors.length === 0) return;
  const error = new Error(errors.map((item) => `${item.code} ${item.path}: ${item.message}`).join("\n"));
  error.code = "LEDGER_INVALID";
  throw error;
}

export function stampRevision(input, revision) {
  if (!text(revision)) throw new Error("Revision is required.");
  const ledger = structuredClone(input);
  invalidateProductEvidence(ledger, { includeRepository: true });
  ledger.verification.revision = revision;
  for (const check of checks(ledger)) {
    if (["passed", "failed", "waived"].includes(check.status)) {
      check.status = "pending";
      check.evidence = "";
      check.waivedByUser = false;
    }
    check.revision = "";
  }
  refreshVerificationCriterion(ledger);
  if (["done", "ready-for-review", "blocked"].includes(ledger.program.status)) {
    ledger.program.status = "in-progress";
    ledger.program.readinessDeclaredBy = null;
  }
  ledger.criticalPath.nextGate = `Run repository verification on ${revision}`;
  ledger.criticalPath.remainingAuthorizedPaths = [...new Set([
    ...(ledger.criticalPath.remainingAuthorizedPaths ?? []),
    "repository verification",
    "product readiness re-attestation",
  ])];
  assertValid(ledger);
  return ledger;
}

export function migrateV1(input) {
  if (input.schemaVersion !== 1) throw new Error("migrate-v1 requires a schemaVersion 1 ledger.");
  if (!Array.isArray(input.target?.definitionOfDone) || input.target.definitionOfDone.length === 0) {
    throw new Error("v1 migration requires target.definitionOfDone to be written explicitly before migration.");
  }
  const ledger = structuredClone(input);
  ledger.schemaVersion = 2;
  let criterion = ledger.readiness?.criteria?.find((item) => ["repository-verification", "verification"].includes(item.id));
  if (!criterion) {
    criterion = {
      id: "repository-verification",
      description: "Repository-defined verification passes on the integrated revision",
      required: true,
      status: "pending",
      evidence: [],
      deferredByUser: false,
    };
    ledger.readiness.criteria.push(criterion);
  }
  ledger.verification.readinessCriterionId = criterion.id;
  invalidateProductEvidence(ledger, { includeRepository: true });
  for (const check of checks(ledger)) {
    if (text(check.evidence)) {
      check.evidenceHistory = [
        ...(Array.isArray(check.evidenceHistory) ? check.evidenceHistory : []),
        { schemaVersion: 1, status: check.status, evidence: check.evidence },
      ];
    }
    if (["passed", "failed", "waived"].includes(check.status)) check.status = "pending";
    check.revision = "";
    if (check.status === "pending") check.evidence = "";
    check.waivedByUser = false;
  }
  criterion.status = "pending";
  criterion.revision = "";
  criterion.evidence = [];
  criterion.deferredByUser = false;
  if (["done", "ready-for-review", "blocked"].includes(ledger.program.status)) {
    ledger.program.status = "in-progress";
    ledger.program.readinessDeclaredBy = null;
  }
  ledger.criticalPath.nextGate = "Re-run repository verification after ledger migration";
  ledger.criticalPath.remainingAuthorizedPaths = [...new Set([
    ...(ledger.criticalPath.remainingAuthorizedPaths ?? []),
    "repository verification",
  ])];
  assertValid(ledger);
  return ledger;
}

export function recordCheck(input, kind, name, status, revision, evidence) {
  if (!["local", "pr"].includes(kind)) throw new Error("Check kind must be local or pr.");
  if (!text(name)) throw new Error("Check name is required.");
  if (!["pending", "passed", "failed", "unavailable", "waived"].includes(status)) throw new Error(`Unknown check status ${status}.`);
  if (status === "waived") throw new Error("Use record-waiver so explicit user approval is preserved.");
  const ledger = structuredClone(input);
  const collection = kind === "local" ? ledger.verification.localChecks : ledger.verification.prChecks;
  const check = collection.find((item) => item.name === name);
  if (!check) throw new Error(`Unknown ${kind} check ${name}.`);
  check.status = status;
  check.revision = ["passed", "waived"].includes(status) ? revision : "";
  check.evidence = evidence;
  check.waivedByUser = status === "waived";
  refreshVerificationCriterion(ledger);
  if (verificationCriterion(ledger)?.status === "verified") {
    ledger.criticalPath.remainingAuthorizedPaths = (ledger.criticalPath.remainingAuthorizedPaths ?? [])
      .filter((path) => path !== "repository verification");
    if (/repository verification/i.test(ledger.criticalPath.nextGate)) {
      ledger.criticalPath.nextGate = `Recompute integrated readiness on ${ledger.verification.revision}`;
    }
  }
  assertValid(ledger);
  return ledger;
}

export function recordCriterion(input, id, revision, evidence) {
  if (!text(id) || !text(evidence)) throw new Error("Criterion id and evidence are required.");
  const ledger = structuredClone(input);
  if (revision !== ledger.verification.revision) throw new Error(`Criterion evidence must match current revision ${ledger.verification.revision}.`);
  if (id === ledger.verification.readinessCriterionId) throw new Error("Repository verification criterion is derived from checks; use record-check or record-waiver.");
  const criterion = ledger.readiness.criteria.find((item) => item.id === id);
  if (!criterion) throw new Error(`Unknown readiness criterion ${id}.`);
  criterion.status = "verified";
  criterion.revision = revision;
  criterion.evidence = [evidence];
  criterion.deferredByUser = false;
  ledger.criticalPath.remainingAuthorizedPaths = (ledger.criticalPath.remainingAuthorizedPaths ?? [])
    .filter((path) => path !== "product readiness re-attestation");
  assertValid(ledger);
  return ledger;
}

export function attestWorkstream(input, id, revision, evidence) {
  if (!text(id) || !text(evidence)) throw new Error("Workstream id and evidence are required.");
  const ledger = structuredClone(input);
  if (revision !== ledger.verification.revision) throw new Error(`Workstream evidence must match current revision ${ledger.verification.revision}.`);
  const workstream = ledger.workstreams.find((item) => item.id === id);
  if (!workstream) throw new Error(`Unknown workstream ${id}.`);
  if (workstream.reliedOn !== true || workstream.state !== "done") throw new Error(`Workstream ${id} must be relied-on and done before re-attestation.`);
  workstream.verifiedRevision = revision;
  workstream.evidence = [...new Set([...(workstream.evidence ?? []), evidence])];
  assertValid(ledger);
  return ledger;
}

export function recordIntegratedCheck(input, name, revision, evidence) {
  if (!text(name) || !text(evidence)) throw new Error("Integrated check name and evidence are required.");
  const ledger = structuredClone(input);
  if (revision !== ledger.verification.revision) throw new Error(`Integrated evidence must match current revision ${ledger.verification.revision}.`);
  const check = ledger.program.integratedChecks.find((item) => item.name === name);
  if (!check) throw new Error(`Unknown integrated check ${name}.`);
  check.status = "passed";
  check.revision = revision;
  check.evidence = evidence;
  assertValid(ledger);
  return ledger;
}

export function recordDelivery(input, revision, artifact = "") {
  const ledger = structuredClone(input);
  if (revision !== ledger.verification.revision) throw new Error(`Delivery evidence must match current revision ${ledger.verification.revision}.`);
  if (text(artifact)) ledger.program.delivery.artifacts = [...new Set([...(ledger.program.delivery.artifacts ?? []), artifact])];
  if ((ledger.program.delivery.artifacts ?? []).length === 0 && !text(ledger.program.delivery.notApplicableReason)) {
    throw new Error("Delivery requires an artifact or an existing notApplicableReason.");
  }
  ledger.program.delivery.status = "delivered";
  ledger.program.delivery.revision = revision;
  assertValid(ledger);
  return ledger;
}

export function resolvePath(input, path) {
  if (!text(path)) throw new Error("Resolved path is required.");
  const ledger = structuredClone(input);
  if (!(ledger.criticalPath.remainingAuthorizedPaths ?? []).includes(path)) throw new Error(`Unknown remaining authorized path ${path}.`);
  ledger.criticalPath.remainingAuthorizedPaths = ledger.criticalPath.remainingAuthorizedPaths.filter((item) => item !== path);
  assertValid(ledger);
  return ledger;
}

export function recordWaiver(input, kind, name, revision, evidence) {
  if (!["local", "pr"].includes(kind)) throw new Error("Check kind must be local or pr.");
  if (!text(evidence)) throw new Error("Waiver requires exact user approval evidence.");
  const ledger = structuredClone(input);
  ledger.program.userApprovalEvidence.push({ verificationCheck: name, revision, evidence });
  const collection = kind === "local" ? ledger.verification.localChecks : ledger.verification.prChecks;
  const check = collection.find((item) => item.name === name);
  if (!check) throw new Error(`Unknown ${kind} check ${name}.`);
  check.status = "waived";
  check.revision = revision;
  check.evidence = evidence;
  check.waivedByUser = true;
  refreshVerificationCriterion(ledger);
  assertValid(ledger);
  return ledger;
}

export function completeProgram(input) {
  const ledger = structuredClone(input);
  ledger.program.status = "done";
  ledger.program.readinessDeclaredBy = ledger.root.agentId;
  ledger.criticalPath.nextGate = "Complete";
  assertValid(ledger);
  return ledger;
}

export function reopenProgram(input, nextGate) {
  if (!text(nextGate) || /^(complete|done)$/i.test(nextGate.trim())) throw new Error("Reopen requires a non-complete next gate.");
  const ledger = structuredClone(input);
  invalidateProductEvidence(ledger, { includeRepository: false });
  ledger.program.status = "in-progress";
  ledger.program.readinessDeclaredBy = null;
  ledger.criticalPath.nextGate = nextGate;
  ledger.criticalPath.remainingAuthorizedPaths = [...new Set([
    ...(ledger.criticalPath.remainingAuthorizedPaths ?? []),
    nextGate,
    "product readiness re-attestation",
  ])];
  assertValid(ledger);
  return ledger;
}

async function persist(file, ledger) {
  const path = resolve(file);
  const temporary = resolve(dirname(path), `.${path.split("/").at(-1)}.${process.pid}.tmp`);
  await writeFile(temporary, `${JSON.stringify(ledger, null, 2)}\n`);
  await rename(temporary, path);
}

async function main() {
  const [command, file, ...args] = process.argv.slice(2);
  if (!command || !file) {
    console.error("Usage: ledger-state.mjs <migrate-v1|stamp-revision|record-check|record-waiver|record-criterion|attest-workstream|record-integrated-check|record-delivery|resolve-path|complete|reopen> <ledger.json> [...args]");
    process.exit(2);
  }
  try {
    const ledger = JSON.parse(await readFile(resolve(file), "utf8"));
    let next;
    if (command === "migrate-v1") next = migrateV1(ledger);
    else if (command === "stamp-revision") next = stampRevision(ledger, args[0]);
    else if (command === "record-check") next = recordCheck(ledger, args[0], args[1], args[2], args[3], args[4]);
    else if (command === "record-waiver") next = recordWaiver(ledger, args[0], args[1], args[2], args[3]);
    else if (command === "record-criterion") next = recordCriterion(ledger, args[0], args[1], args[2]);
    else if (command === "attest-workstream") next = attestWorkstream(ledger, args[0], args[1], args[2]);
    else if (command === "record-integrated-check") next = recordIntegratedCheck(ledger, args[0], args[1], args[2]);
    else if (command === "record-delivery") next = recordDelivery(ledger, args[0], args[1]);
    else if (command === "resolve-path") next = resolvePath(ledger, args[0]);
    else if (command === "complete") next = completeProgram(ledger);
    else if (command === "reopen") next = reopenProgram(ledger, args[0]);
    else throw new Error(`Unknown command ${command}.`);
    await persist(file, next);
    console.log(`Updated orchestrator ledger: ${file}`);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

function invokedAsMain() {
  return process.argv[1] && resolve(fileURLToPath(import.meta.url)) === resolve(process.argv[1]);
}

if (invokedAsMain()) await main();
