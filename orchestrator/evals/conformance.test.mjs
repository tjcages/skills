import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { validateLedger } from "../src/validate-ledger.mjs";

const fixtureUrl = new URL("../examples/ledger.example.json", import.meta.url);
const base = JSON.parse(await readFile(fixtureUrl, "utf8"));

function copy() {
  return structuredClone(base);
}

function activeClone(item, { id, owner, claim }) {
  return {
    ...structuredClone(item),
    id,
    owner,
    dependencies: [],
    writeClaims: [claim],
    evidence: [],
    reliedOn: false,
    state: "active",
    transitions: [
      { state: "candidate", by: "root" },
      { state: "scoped", by: "root" },
      { state: "assigned", by: "root" },
      { state: "active", by: owner },
    ],
    acceptance: undefined,
  };
}

const cases = [
  {
    name: "accepts a root-owned, challenged, integrated delivery",
    ledger: copy(),
    valid: true,
  },
  {
    name: "accepts installed PR verification that passed on the current revision",
    ledger: (() => {
      const ledger = copy();
      ledger.verification.prChecks = [
        {
          name: "required repository check",
          required: true,
          status: "passed",
          revision: "example-revision-123",
          evidence: "provider reports pass for example-revision-123",
          waivedByUser: false,
        },
      ];
      ledger.verification.noPrChecksReason = "";
      return ledger;
    })(),
    valid: true,
  },
  {
    name: "rejects a complete next gate while the program remains in progress",
    ledger: (() => {
      const ledger = copy();
      ledger.program.status = "in-progress";
      ledger.program.readinessDeclaredBy = null;
      return ledger;
    })(),
    codes: ["critical-path-complete-status"],
  },
  {
    name: "rejects a complete next gate while authorized work remains",
    ledger: (() => {
      const ledger = copy();
      ledger.criticalPath.remainingAuthorizedPaths = ["finish integration"];
      return ledger;
    })(),
    codes: ["critical-path-complete-work"],
  },
  {
    name: "rejects verified repository readiness while a required check is unavailable",
    ledger: (() => {
      const ledger = copy();
      ledger.program.status = "in-progress";
      ledger.program.readinessDeclaredBy = null;
      ledger.criticalPath.nextGate = "Restore the repository test wrapper";
      ledger.verification.localChecks[0].status = "unavailable";
      ledger.verification.localChecks[0].revision = "";
      ledger.verification.localChecks[0].evidence = "required wrapper is unavailable";
      return ledger;
    })(),
    codes: ["verification-criterion-state"],
  },
  {
    name: "rejects passed verification evidence from a stale revision",
    ledger: (() => {
      const ledger = copy();
      ledger.verification.localChecks[0].revision = "older-revision";
      return ledger;
    })(),
    codes: ["verification-check-revision"],
  },
  {
    name: "accepts one blocked path while another authorized path advances",
    ledger: (() => {
      const ledger = copy();
      ledger.program.status = "in-progress";
      ledger.program.readinessDeclaredBy = null;
      ledger.program.integratedChecks = [];
      ledger.program.delivery = { status: "pending", artifacts: [], notApplicableReason: "" };
      ledger.program.blockers = ["worker-one lacks deployment credentials"];
      ledger.readiness.criteria = ledger.readiness.criteria.map((criterion) => criterion.id === ledger.verification.readinessCriterionId ? criterion : {
        ...criterion,
        status: "pending",
        evidence: [],
      });
      ledger.criticalPath.nextGate = "Finish local verification while deployment remains blocked";
      ledger.criticalPath.blockedPaths = ["deployment"];
      ledger.criticalPath.remainingAuthorizedPaths = ["finish local verification"];
      ledger.workstreams = [
        {
          ...activeClone(ledger.workstreams[0], { id: "deployment", owner: "worker-one", claim: "system:preview" }),
          state: "blocked",
          transitions: [
            { state: "candidate", by: "root" },
            { state: "scoped", by: "root" },
            { state: "assigned", by: "root" },
            { state: "active", by: "worker-one" },
            { state: "blocked", by: "worker-one" },
          ],
        },
        activeClone(ledger.workstreams[1], { id: "local-verification", owner: "worker-two", claim: "tests/settings" }),
      ];
      return ledger;
    })(),
    valid: true,
  },
  {
    name: "rejects completion while a required local repository test is failing",
    ledger: (() => {
      const ledger = copy();
      ledger.verification.localChecks[0].status = "failed";
      ledger.verification.localChecks[0].revision = "";
      ledger.verification.localChecks[0].evidence = "test output reports one failing integration test";
      return ledger;
    })(),
    codes: ["verification-required-check"],
  },
  {
    name: "rejects completion while an installed required PR check is pending",
    ledger: (() => {
      const ledger = copy();
      ledger.verification.prChecks = [
        {
          name: "required repository check",
          required: true,
          status: "pending",
          revision: "",
          evidence: "",
          waivedByUser: false,
        },
      ];
      ledger.verification.noPrChecksReason = "";
      return ledger;
    })(),
    codes: ["verification-required-check"],
  },
  {
    name: "rejects a self-asserted verification waiver",
    ledger: (() => {
      const ledger = copy();
      ledger.verification.localChecks[0].status = "waived";
      ledger.verification.localChecks[0].evidence = "agent claims the user waived this check";
      return ledger;
    })(),
    codes: ["verification-waiver-authority"],
  },
  {
    name: "rejects a root readiness declaration while work is in progress",
    ledger: (() => {
      const ledger = copy();
      ledger.program.status = "in-progress";
      return ledger;
    })(),
    codes: ["premature-readiness"],
  },
  {
    name: "rejects worker readiness ownership",
    ledger: (() => {
      const ledger = copy();
      ledger.program.readinessDeclaredBy = "worker-ui";
      return ledger;
    })(),
    codes: ["readiness-owner", "done-owner"],
  },
  {
    name: "rejects recursive worker delegation",
    ledger: (() => {
      const ledger = copy();
      ledger.workstreams[0].maySpawn = true;
      return ledger;
    })(),
    codes: ["recursive-worker"],
  },
  {
    name: "rejects a worker moving its submission into challenge",
    ledger: (() => {
      const ledger = copy();
      ledger.workstreams[0].transitions[5].by = "worker-ui";
      return ledger;
    })(),
    codes: ["transition-authority"],
  },
  {
    name: "rejects an unassigned worker becoming active",
    ledger: (() => {
      const ledger = copy();
      ledger.program.status = "in-progress";
      ledger.program.readinessDeclaredBy = null;
      ledger.workstreams = [activeClone(ledger.workstreams[0], { id: "worker", owner: "worker-one", claim: "src/worker" })];
      ledger.workstreams[0].transitions.splice(2, 1);
      return ledger;
    })(),
    codes: ["worker-unassigned"],
  },
  {
    name: "rejects overlapping active write claims",
    ledger: (() => {
      const ledger = copy();
      ledger.program.status = "in-progress";
      ledger.program.readinessDeclaredBy = null;
      ledger.workstreams = [
        activeClone(ledger.workstreams[0], { id: "ui-one", owner: "worker-one", claim: "src/settings" }),
        activeClone(ledger.workstreams[1], { id: "ui-two", owner: "worker-two", claim: "src/settings/ui" }),
      ];
      return ledger;
    })(),
    codes: ["write-claim-overlap"],
  },
  {
    name: "rejects wildcard write ownership",
    ledger: (() => {
      const ledger = copy();
      ledger.workstreams[0].writeClaims = ["src/settings/**"];
      return ledger;
    })(),
    codes: ["write-claim-wildcard"],
  },
  {
    name: "rejects an incomplete worker assignment contract",
    ledger: (() => {
      const ledger = copy();
      delete ledger.workstreams[0].stopConditions;
      return ledger;
    })(),
    codes: ["assignment-contract"],
  },
  {
    name: "rejects relied-on work without root acceptance",
    ledger: (() => {
      const ledger = copy();
      delete ledger.workstreams[0].acceptance;
      return ledger;
    })(),
    codes: ["acceptance-missing"],
  },
  {
    name: "rejects program blocker paralysis",
    ledger: (() => {
      const ledger = copy();
      ledger.program.status = "blocked";
      ledger.program.readinessDeclaredBy = null;
      ledger.program.blockers = ["deployment credentials missing"];
      ledger.criticalPath.remainingAuthorizedPaths = ["finish local documentation"];
      return ledger;
    })(),
    codes: ["blocker-paralysis"],
  },
  {
    name: "rejects work that advanced through an owner-only gate without evidence",
    ledger: (() => {
      const ledger = copy();
      ledger.workstreams[0].requiresUserAuthority = true;
      return ledger;
    })(),
    codes: ["authority-evidence"],
  },
  {
    name: "rejects completion while an active worker can change readiness",
    ledger: (() => {
      const ledger = copy();
      ledger.workstreams.push(
        activeClone(ledger.workstreams[0], { id: "late-worker", owner: "worker-late", claim: "docs/settings" }),
      );
      return ledger;
    })(),
    codes: ["done-active-work"],
  },
  {
    name: "rejects dependency cycles",
    ledger: (() => {
      const ledger = copy();
      ledger.workstreams[0].dependencies = ["settings-api"];
      ledger.workstreams[1].dependencies = ["settings-ui"];
      return ledger;
    })(),
    codes: ["dependency-cycle"],
  },
  {
    name: "rejects work advancing before its dependency is done",
    ledger: (() => {
      const ledger = copy();
      ledger.program.status = "in-progress";
      ledger.program.readinessDeclaredBy = null;
      ledger.criticalPath.nextGate = "Finish the API before starting the UI";
      ledger.workstreams[0] = activeClone(ledger.workstreams[0], { id: "settings-ui", owner: "worker-ui", claim: "src/settings/ui" });
      ledger.workstreams[0].dependencies = ["settings-api"];
      ledger.workstreams[1] = activeClone(ledger.workstreams[1], { id: "settings-api", owner: "worker-api", claim: "src/settings/api" });
      return ledger;
    })(),
    codes: ["dependency-not-ready"],
  },
];

let failures = 0;
for (const testCase of cases) {
  const errors = validateLedger(testCase.ledger);
  try {
    if (testCase.valid) {
      assert.deepEqual(errors, []);
    } else {
      const actualCodes = new Set(errors.map((error) => error.code));
      for (const code of testCase.codes) assert(actualCodes.has(code), `missing ${code}; got ${[...actualCodes].join(", ")}`);
    }
    console.log(`pass: ${testCase.name}`);
  } catch (error) {
    failures += 1;
    console.error(`fail: ${testCase.name}`);
    console.error(error instanceof Error ? error.message : String(error));
  }
}

if (failures > 0) process.exitCode = 1;
else console.log(`Conformance evals passed: ${cases.length}/${cases.length}`);
