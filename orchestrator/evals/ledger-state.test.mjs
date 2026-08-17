import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import {
  attestWorkstream,
  completeProgram,
  migrateV1,
  recordCheck,
  recordCriterion,
  recordDelivery,
  recordIntegratedCheck,
  recordWaiver,
  reopenProgram,
  resolvePath,
  stampRevision,
} from "../src/ledger-state.mjs";
import { validateLedger } from "../src/validate-ledger.mjs";

const fixtureUrl = new URL("../examples/ledger.example.json", import.meta.url);
const base = JSON.parse(await readFile(fixtureUrl, "utf8"));

const legacy = structuredClone(base);
legacy.schemaVersion = 1;
delete legacy.verification.readinessCriterionId;
for (const check of [...legacy.verification.localChecks, ...legacy.verification.prChecks]) delete check.revision;
const legacyWithoutDefinition = structuredClone(legacy);
delete legacyWithoutDefinition.target.definitionOfDone;
assert.throws(() => migrateV1(legacyWithoutDefinition), /target\.definitionOfDone/);
const migrated = migrateV1(legacy);
assert.equal(migrated.schemaVersion, 2);
assert.equal(migrated.program.status, "in-progress");
assert.equal(migrated.verification.localChecks[0].status, "pending");
assert.equal(migrated.verification.localChecks[0].evidenceHistory[0].status, "passed");
assert.deepEqual(validateLedger(migrated), []);

const reopened = reopenProgram(base, "Apply requested review changes");
assert.equal(reopened.program.status, "in-progress");
assert.equal(reopened.program.readinessDeclaredBy, null);
assert.equal(reopened.readiness.criteria.find((item) => item.id !== "repository-verification").status, "pending");
assert.equal(reopened.program.delivery.status, "pending");
assert.deepEqual(validateLedger(reopened), []);
assert.throws(() => completeProgram(reopened), /critical-path-complete-work|done-criterion|done-workstream-revision/);

const stamped = stampRevision(base, "example-revision-456");
assert.equal(stamped.verification.revision, "example-revision-456");
assert.equal(stamped.verification.localChecks[0].status, "pending");
assert.equal(stamped.readiness.criteria.find((item) => item.id === "repository-verification").status, "pending");
assert.deepEqual(validateLedger(stamped), []);

const checked = recordCheck(
  stamped,
  "local",
  "repository test suite",
  "passed",
  "example-revision-456",
  "repository tests passed on example-revision-456",
);
assert.equal(checked.readiness.criteria.find((item) => item.id === "repository-verification").status, "verified");
assert.deepEqual(validateLedger(checked), []);

assert.throws(() => completeProgram(checked), /critical-path-complete-work|done-criterion-revision|done-workstream-revision/);

let reattested = checked;
for (const criterion of reattested.readiness.criteria.filter((item) => item.id !== "repository-verification")) {
  reattested = recordCriterion(reattested, criterion.id, "example-revision-456", `${criterion.id} verified on example-revision-456`);
}
for (const workstream of reattested.workstreams.filter((item) => item.reliedOn === true)) {
  reattested = attestWorkstream(reattested, workstream.id, "example-revision-456", `${workstream.id} verified on example-revision-456`);
}
for (const integratedCheck of reattested.program.integratedChecks) {
  reattested = recordIntegratedCheck(reattested, integratedCheck.name, "example-revision-456", `${integratedCheck.name} passed on example-revision-456`);
}
reattested = recordDelivery(reattested, "example-revision-456");
const completed = completeProgram(reattested);
assert.equal(completed.program.status, "done");
assert.equal(completed.criticalPath.nextGate, "Complete");
assert.deepEqual(validateLedger(completed), []);

assert.throws(() => completeProgram(stamped), /verification-required-check|done-criterion/);
assert.throws(
  () => recordCheck(stamped, "local", "repository test suite", "passed", "older-revision", "stale pass"),
  /verification-check-revision/,
);
const waived = recordWaiver(stamped, "local", "repository test suite", "example-revision-456", "User explicitly waived this check for example-revision-456");
assert.equal(waived.verification.localChecks[0].status, "waived");
assert.equal(waived.program.userApprovalEvidence[0].verificationCheck, "repository test suite");
assert.deepEqual(validateLedger(waived), []);

let reopenedAndReattested = reopened;
for (const criterion of reopenedAndReattested.readiness.criteria.filter((item) => item.id !== "repository-verification")) {
  reopenedAndReattested = recordCriterion(reopenedAndReattested, criterion.id, base.verification.revision, `Re-opened ${criterion.id} verified`);
}
for (const workstream of reopenedAndReattested.workstreams.filter((item) => item.reliedOn === true)) {
  reopenedAndReattested = attestWorkstream(reopenedAndReattested, workstream.id, base.verification.revision, `Re-opened ${workstream.id} verified`);
}
for (const integratedCheck of reopenedAndReattested.program.integratedChecks) {
  reopenedAndReattested = recordIntegratedCheck(reopenedAndReattested, integratedCheck.name, base.verification.revision, "Re-opened integrated flow passed");
}
reopenedAndReattested = recordDelivery(reopenedAndReattested, base.verification.revision);
reopenedAndReattested = resolvePath(reopenedAndReattested, "Apply requested review changes");
const reclosed = completeProgram(reopenedAndReattested);
assert.equal(reclosed.program.status, "done");

console.log("Ledger lifecycle tests passed: 11/11");
