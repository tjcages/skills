#!/usr/bin/env node
import { realpathSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const states = new Set([
  "candidate",
  "scoped",
  "assigned",
  "active",
  "submitted",
  "challenged",
  "integrated",
  "verified",
  "done",
  "blocked",
  "rejected",
  "superseded",
  "stopped",
]);

const nextStates = {
  candidate: new Set(["scoped", "superseded", "stopped"]),
  scoped: new Set(["assigned", "active", "superseded", "stopped"]),
  assigned: new Set(["active", "blocked", "superseded", "stopped"]),
  active: new Set(["submitted", "blocked", "superseded", "stopped"]),
  submitted: new Set(["challenged", "rejected", "superseded", "stopped"]),
  challenged: new Set(["integrated", "rejected", "superseded", "stopped"]),
  integrated: new Set(["verified", "rejected", "blocked", "superseded", "stopped"]),
  verified: new Set(["done", "rejected", "superseded"]),
  blocked: new Set(["scoped", "assigned", "active", "superseded", "stopped"]),
  rejected: new Set(["scoped", "assigned", "active", "superseded", "stopped"]),
  done: new Set(),
  superseded: new Set(),
  stopped: new Set(),
};

const rootOnlyStates = new Set([
  "candidate",
  "scoped",
  "assigned",
  "challenged",
  "integrated",
  "verified",
  "done",
  "rejected",
  "superseded",
  "stopped",
]);

const acceptanceStates = new Set(["challenged", "integrated", "verified", "done"]);
const incompleteStates = new Set([
  "candidate",
  "scoped",
  "assigned",
  "active",
  "submitted",
  "challenged",
  "integrated",
  "blocked",
  "rejected",
]);

function object(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function text(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function list(value) {
  return Array.isArray(value) ? value : [];
}

function add(errors, code, path, message) {
  errors.push({ code, path, message });
}

function normalizeClaim(claim) {
  return claim.replaceAll("\\", "/").replace(/^\.\//, "").replace(/\/$/, "");
}

function claimsOverlap(left, right) {
  const a = normalizeClaim(left);
  const b = normalizeClaim(right);
  if (a.startsWith("system:") || b.startsWith("system:")) return a === b;
  return a === b || a.startsWith(`${b}/`) || b.startsWith(`${a}/`);
}

function checkDependencyCycles(workstreams, errors) {
  const byId = new Map(workstreams.map((item) => [item.id, item]));
  const visiting = new Set();
  const visited = new Set();

  function visit(id, trail) {
    if (visiting.has(id)) {
      add(errors, "dependency-cycle", `workstreams.${id}.dependencies`, `Dependency cycle: ${[...trail, id].join(" -> ")}`);
      return;
    }
    if (visited.has(id) || !byId.has(id)) return;
    visiting.add(id);
    const item = byId.get(id);
    for (const dependency of list(item.dependencies)) visit(dependency, [...trail, id]);
    visiting.delete(id);
    visited.add(id);
  }

  for (const item of workstreams) visit(item.id, []);
}

function validateVerificationCheck(check, path, errors, { local }) {
  if (!object(check) || !text(check.name)) {
    add(errors, "verification-check-shape", path, "Verification check requires a name.");
    return;
  }
  if (local && !text(check.command)) {
    add(errors, "verification-check-command", `${path}.command`, "Local verification check requires its exact command.");
  }
  if (typeof check.required !== "boolean") {
    add(errors, "verification-check-required", `${path}.required`, "Verification check required must be boolean.");
  }
  if (!["pending", "passed", "failed", "unavailable", "waived"].includes(check.status)) {
    add(errors, "verification-check-status", `${path}.status`, "Unknown verification check status.");
  }
  if (check.status === "passed" && !text(check.evidence)) {
    add(errors, "verification-check-evidence", `${path}.evidence`, "Passed verification check requires evidence.");
  }
  if (["failed", "unavailable"].includes(check.status) && !text(check.evidence)) {
    add(errors, "verification-check-evidence", `${path}.evidence`, `${check.status} verification check requires diagnostic evidence.`);
  }
  if (check.status === "waived" && (check.waivedByUser !== true || !text(check.evidence))) {
    add(errors, "verification-check-waiver", path, "Waived verification check requires user waiver evidence.");
  }
}

export function validateLedger(ledger) {
  const errors = [];
  if (!object(ledger)) {
    add(errors, "ledger-type", "$", "Ledger must be a JSON object.");
    return errors;
  }
  if (ledger.schemaVersion !== 1) add(errors, "schema-version", "schemaVersion", "schemaVersion must equal 1.");

  const root = object(ledger.root) ? ledger.root : {};
  if (!text(root.agentId)) add(errors, "root-id", "root.agentId", "Root agentId is required.");
  if (root.identity !== "user-facing-root") {
    add(errors, "root-identity", "root.identity", "Only a user-facing root may orchestrate.");
  }
  const rootId = root.agentId;

  const target = object(ledger.target) ? ledger.target : {};
  if (!text(target.outcome)) add(errors, "target-outcome", "target.outcome", "Target outcome is required.");
  if (!object(target.scope) || !Array.isArray(target.scope.in) || !Array.isArray(target.scope.out)) {
    add(errors, "target-scope", "target.scope", "Scope must contain in and out arrays.");
  }
  if (!Array.isArray(target.nonNegotiables)) {
    add(errors, "target-non-negotiables", "target.nonNegotiables", "Target must record a nonNegotiables array.");
  }
  if (!object(target.authority) || !Array.isArray(target.authority.allowed) || !Array.isArray(target.authority.ownerOnly)) {
    add(errors, "target-authority", "target.authority", "Authority must contain allowed and ownerOnly arrays.");
  }

  const criteria = object(ledger.readiness) ? list(ledger.readiness.criteria) : [];
  if (criteria.length === 0) add(errors, "readiness-criteria", "readiness.criteria", "At least one readiness criterion is required.");
  const criterionIds = new Set();
  criteria.forEach((criterion, index) => {
    const path = `readiness.criteria[${index}]`;
    if (!object(criterion) || !text(criterion.id) || !text(criterion.description)) {
      add(errors, "criterion-shape", path, "Criterion requires id and description.");
      return;
    }
    if (criterionIds.has(criterion.id)) add(errors, "criterion-duplicate", `${path}.id`, `Duplicate criterion ${criterion.id}.`);
    criterionIds.add(criterion.id);
    if (typeof criterion.required !== "boolean") add(errors, "criterion-required", `${path}.required`, "Criterion required must be boolean.");
    if (!["pending", "verified", "deferred"].includes(criterion.status)) {
      add(errors, "criterion-status", `${path}.status`, "Criterion status must be pending, verified, or deferred.");
    }
    if (criterion.status === "verified" && list(criterion.evidence).length === 0) {
      add(errors, "criterion-evidence", `${path}.evidence`, "Verified criterion requires evidence.");
    }
    if (criterion.status === "deferred" && (criterion.deferredByUser !== true || list(criterion.evidence).length === 0)) {
      add(errors, "criterion-deferral", path, "Deferred criterion requires user deferral and evidence.");
    }
  });

  const workstreams = list(ledger.workstreams);
  if (workstreams.length === 0) add(errors, "workstreams-empty", "workstreams", "At least one workstream is required.");
  const workstreamIds = new Set();

  workstreams.forEach((item, index) => {
    const path = `workstreams[${index}]`;
    if (!object(item)) {
      add(errors, "workstream-shape", path, "Workstream must be an object.");
      return;
    }
    if (!text(item.id)) add(errors, "workstream-id", `${path}.id`, "Workstream id is required.");
    if (workstreamIds.has(item.id)) add(errors, "workstream-duplicate", `${path}.id`, `Duplicate workstream ${item.id}.`);
    workstreamIds.add(item.id);
    if (!text(item.objective)) add(errors, "workstream-objective", `${path}.objective`, "Objective is required.");
    if (!text(item.owner)) add(errors, "workstream-owner", `${path}.owner`, "Owner is required.");
    if (!states.has(item.state)) add(errors, "workstream-state", `${path}.state`, `Unknown state ${item.state}.`);

    if (item.owner !== rootId && item.maySpawn !== false) {
      add(errors, "recursive-worker", `${path}.maySpawn`, "Workers must have maySpawn=false.");
    }
    if (["assigned", "active", "submitted", "challenged", "integrated", "verified", "done"].includes(item.state) && list(item.requiredEvidence).length === 0) {
      add(errors, "required-evidence", `${path}.requiredEvidence`, "Assigned work requires explicit evidence requirements.");
    }
    if (["assigned", "active", "submitted", "challenged", "integrated", "verified", "done"].includes(item.state)) {
      const missing = [];
      if (!text(item.role)) missing.push("role");
      if (!text(item.why)) missing.push("why");
      if (!Array.isArray(item.authoritativeInputs) || item.authoritativeInputs.length === 0) missing.push("authoritativeInputs");
      if (!Array.isArray(item.dependencies)) missing.push("dependencies");
      if (!Array.isArray(item.writeClaims)) missing.push("writeClaims");
      if (!Array.isArray(item.forbidden) || item.forbidden.length === 0) missing.push("forbidden");
      if (!text(item.expectedOutput)) missing.push("expectedOutput");
      if (!Array.isArray(item.stopConditions) || item.stopConditions.length === 0) missing.push("stopConditions");
      if (typeof item.reliedOn !== "boolean") missing.push("reliedOn");
      if (typeof item.requiresUserAuthority !== "boolean") missing.push("requiresUserAuthority");
      if (missing.length > 0) {
        add(errors, "assignment-contract", path, `Assigned work is missing contract fields: ${missing.join(", ")}.`);
      }
    }
    if (["submitted", "challenged", "integrated", "verified", "done"].includes(item.state) && list(item.evidence).length === 0) {
      add(errors, "submission-evidence", `${path}.evidence`, "Submitted work requires evidence.");
    }

    list(item.writeClaims).forEach((claim, claimIndex) => {
      if (!text(claim)) add(errors, "write-claim-empty", `${path}.writeClaims[${claimIndex}]`, "Write claim must be non-empty.");
      if (typeof claim === "string" && /[*?{}[\]]/.test(claim)) {
        add(errors, "write-claim-wildcard", `${path}.writeClaims[${claimIndex}]`, "Write claims must name explicit paths or systems, not globs.");
      }
    });

    const transitions = list(item.transitions);
    if (transitions.length === 0) {
      add(errors, "transitions-empty", `${path}.transitions`, "Transition history is required.");
    } else {
      transitions.forEach((transition, transitionIndex) => {
        const transitionPath = `${path}.transitions[${transitionIndex}]`;
        if (!object(transition) || !states.has(transition.state) || !text(transition.by)) {
          add(errors, "transition-shape", transitionPath, "Transition requires a known state and actor.");
          return;
        }
        if (transition.by !== rootId && transition.by !== item.owner) {
          add(errors, "transition-actor", `${transitionPath}.by`, "Transition actor must be the root or workstream owner.");
        }
        if (rootOnlyStates.has(transition.state) && transition.by !== rootId) {
          add(errors, "transition-authority", transitionPath, `Only the root may move work to ${transition.state}.`);
        }
        if (transitionIndex === 0) {
          if (transition.state !== "candidate" || transition.by !== rootId) {
            add(errors, "transition-start", transitionPath, "First transition must be candidate by the root.");
          }
          return;
        }
        const previous = transitions[transitionIndex - 1]?.state;
        if (item.owner !== rootId && transition.state === "active" && transition.by === item.owner && previous !== "assigned") {
          add(errors, "worker-unassigned", transitionPath, "A worker may become active only after a root assignment.");
        }
        if (!nextStates[previous]?.has(transition.state)) {
          add(errors, "transition-invalid", transitionPath, `Invalid transition ${previous} -> ${transition.state}.`);
        }
      });
      if (transitions.at(-1)?.state !== item.state) {
        add(errors, "transition-current", `${path}.state`, "Current state must match the final transition.");
      }
    }

    if (item.owner !== rootId && acceptanceStates.has(item.state)) {
      const acceptance = object(item.acceptance) ? item.acceptance : null;
      if (acceptance === null) {
        add(errors, "acceptance-missing", `${path}.acceptance`, "Challenged worker work requires root acceptance evidence.");
      } else {
        if (acceptance.reviewedBy !== rootId) add(errors, "acceptance-owner", `${path}.acceptance.reviewedBy`, "Root must review worker acceptance.");
        for (const field of ["scope", "truth", "evidenceQuality", "interactionSafety"]) {
          if (acceptance[field] !== "pass") add(errors, "acceptance-gate", `${path}.acceptance.${field}`, `${field} must pass.`);
        }
        if (acceptance.residualRisk !== "acceptable") add(errors, "acceptance-risk", `${path}.acceptance.residualRisk`, "Residual risk must be acceptable.");
        if (acceptance.decision !== "accept") add(errors, "acceptance-decision", `${path}.acceptance.decision`, "Accepted work requires decision=accept.");
      }
    }
  });

  workstreams.forEach((item, index) => {
    for (const dependency of list(item.dependencies)) {
      if (!workstreamIds.has(dependency)) add(errors, "dependency-missing", `workstreams[${index}].dependencies`, `Unknown dependency ${dependency}.`);
    }
  });
  checkDependencyCycles(workstreams, errors);

  const activeWriters = workstreams.filter((item) => ["assigned", "active"].includes(item.state));
  for (let leftIndex = 0; leftIndex < activeWriters.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < activeWriters.length; rightIndex += 1) {
      const left = activeWriters[leftIndex];
      const right = activeWriters[rightIndex];
      for (const leftClaim of list(left.writeClaims)) {
        for (const rightClaim of list(right.writeClaims)) {
          if (text(leftClaim) && text(rightClaim) && claimsOverlap(leftClaim, rightClaim)) {
            add(errors, "write-claim-overlap", "workstreams", `${left.id} and ${right.id} overlap on ${leftClaim} / ${rightClaim}.`);
          }
        }
      }
    }
  }

  const program = object(ledger.program) ? ledger.program : {};
  if (!["not-ready", "in-progress", "blocked", "ready-for-review", "done"].includes(program.status)) {
    add(errors, "program-status", "program.status", "Unknown program status.");
  }
  if (program.readinessDeclaredBy !== null && program.readinessDeclaredBy !== undefined && program.readinessDeclaredBy !== rootId) {
    add(errors, "readiness-owner", "program.readinessDeclaredBy", "Only the root may declare program readiness.");
  }
  if (["not-ready", "in-progress", "blocked"].includes(program.status) && program.readinessDeclaredBy !== null && program.readinessDeclaredBy !== undefined) {
    add(errors, "premature-readiness", "program.readinessDeclaredBy", "Readiness cannot be declared while the program is not ready, in progress, or blocked.");
  }

  const verification = object(ledger.verification) ? ledger.verification : {};
  if (typeof verification.applicable !== "boolean") {
    add(errors, "verification-applicable", "verification.applicable", "Verification applicable must be boolean.");
  } else if (verification.applicable === false) {
    if (!text(verification.notApplicableReason)) {
      add(errors, "verification-not-applicable", "verification.notApplicableReason", "Non-applicable verification requires a reason.");
    }
  } else {
    if (!text(verification.revision)) add(errors, "verification-revision", "verification.revision", "Verification must identify the current revision or artifact state.");
    if (!Array.isArray(verification.sources) || verification.sources.length === 0) {
      add(errors, "verification-sources", "verification.sources", "Verification must record inspected repository sources.");
    }
    if (!Array.isArray(verification.localChecks) || !Array.isArray(verification.prChecks)) {
      add(errors, "verification-check-arrays", "verification", "Verification requires localChecks and prChecks arrays.");
    }
    list(verification.localChecks).forEach((check, index) => validateVerificationCheck(check, `verification.localChecks[${index}]`, errors, { local: true }));
    list(verification.prChecks).forEach((check, index) => validateVerificationCheck(check, `verification.prChecks[${index}]`, errors, { local: false }));
    if (list(verification.prChecks).length === 0 && !text(verification.noPrChecksReason)) {
      add(errors, "verification-pr-discovery", "verification.noPrChecksReason", "Record why no installed PR checks apply.");
    }
    if (program.status === "done") {
      for (const [kind, checks] of [["local", list(verification.localChecks)], ["pr", list(verification.prChecks)]]) {
        for (const check of checks.filter((item) => item?.required === true)) {
          if (!["passed", "waived"].includes(check.status)) {
            add(errors, "verification-required-check", `verification.${kind}Checks`, `Required check ${check.name ?? "unknown"} is ${check.status ?? "invalid"}.`);
          }
        }
      }
    }
  }

  const approvals = list(program.userApprovalEvidence);
  workstreams.forEach((item, index) => {
    if (item.requiresUserAuthority === true && !["candidate", "scoped", "blocked", "stopped", "superseded"].includes(item.state)) {
      const approval = approvals.find((entry) => entry?.workstreamId === item.id && text(entry.evidence));
      if (!approval) add(errors, "authority-evidence", `workstreams[${index}]`, `Workstream ${item.id} advanced without user approval evidence.`);
    }
  });

  const criticalPath = object(ledger.criticalPath) ? ledger.criticalPath : {};
  if (!text(criticalPath.nextGate)) add(errors, "next-gate", "criticalPath.nextGate", "An observable next gate is required.");
  if (!Array.isArray(criticalPath.blockedPaths) || !Array.isArray(criticalPath.remainingAuthorizedPaths)) {
    add(errors, "critical-path-shape", "criticalPath", "Critical path requires blockedPaths and remainingAuthorizedPaths arrays.");
  }
  if (program.status === "blocked") {
    if (list(program.blockers).length === 0) add(errors, "blockers-empty", "program.blockers", "Blocked program requires a concrete blocker.");
    if (list(criticalPath.remainingAuthorizedPaths).length > 0) {
      add(errors, "blocker-paralysis", "criticalPath.remainingAuthorizedPaths", "Program cannot be blocked while authorized paths remain.");
    }
  }

  if (program.status === "done") {
    if (program.readinessDeclaredBy !== rootId) add(errors, "done-owner", "program.readinessDeclaredBy", "Done must be declared by the root.");
    for (const criterion of criteria.filter((item) => item?.required === true)) {
      if (!criterion || !["verified", "deferred"].includes(criterion.status)) {
        add(errors, "done-criterion", "readiness.criteria", `Required criterion ${criterion?.id ?? "unknown"} is not verified or deferred.`);
      }
    }
    for (const item of workstreams) {
      if (incompleteStates.has(item.state)) add(errors, "done-active-work", "workstreams", `Program is done while ${item.id} remains ${item.state}.`);
      if (item.reliedOn === true && item.state !== "done") add(errors, "done-relied-work", "workstreams", `Relied-on workstream ${item.id} is not done.`);
    }
    const checks = list(program.integratedChecks);
    if (checks.length === 0 || checks.some((check) => check?.status !== "passed" || !text(check?.evidence))) {
      add(errors, "done-integrated-checks", "program.integratedChecks", "Done requires passed integrated checks with evidence.");
    }
    const delivery = object(program.delivery) ? program.delivery : {};
    if (delivery.status !== "delivered") add(errors, "done-delivery", "program.delivery.status", "Done requires delivered status.");
    if (list(delivery.artifacts).length === 0 && !text(delivery.notApplicableReason)) {
      add(errors, "done-artifacts", "program.delivery", "Delivery requires artifacts or a not-applicable reason.");
    }
    if (list(program.blockers).length > 0) add(errors, "done-blockers", "program.blockers", "Done cannot retain blockers.");
  }

  return errors;
}

export async function validateLedgerFile(file) {
  const input = JSON.parse(await readFile(file, "utf8"));
  return validateLedger(input);
}

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("Usage: node validate-ledger.mjs <ledger.json>");
    process.exit(2);
  }
  try {
    const errors = await validateLedgerFile(resolve(file));
    if (errors.length === 0) {
      console.log(`Valid orchestrator ledger: ${file}`);
      return;
    }
    for (const error of errors) console.error(`${error.code} ${error.path}: ${error.message}`);
    process.exitCode = 1;
  } catch (error) {
    console.error(`ledger-read: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 2;
  }
}

function invokedAsMain() {
  if (!process.argv[1]) return false;
  return realpathSync(fileURLToPath(import.meta.url)) === realpathSync(process.argv[1]);
}

if (invokedAsMain()) await main();
