# Machine-readable target ledger

The root orchestrator maintains this ledger. Workers report evidence to the root; they never edit readiness, acceptance, or program status directly.

## Start a ledger

Copy `examples/ledger.template.json` to durable task state outside the product diff. The template is valid, in-progress state; `ledger.example.json` is a completed reference and must not be used to initialize a run. Use `.orchestration/<slug>.json` only when that path is already ignored or explicitly accepted by the repository. Otherwise use an external task-state directory and attach or summarize the final record in the existing tracker. Do not add tracking-policy files merely to host the ledger.

Before the first worker starts:

```bash
node <skill-directory>/scripts/validate-ledger.mjs <ledger.json>
```

Run the same command after every assignment wave, target change, acceptance decision, compaction recovery, and before any readiness claim. A non-zero exit blocks progression until the root repairs or explicitly supersedes the invalid state.

Use the bundled lifecycle command for revision and completion changes instead of editing related fields independently:

```bash
node <skill-directory>/scripts/ledger-state.mjs stamp-revision <ledger.json> <revision>
node <skill-directory>/scripts/ledger-state.mjs record-check <ledger.json> local "<name>" passed <revision> "<evidence>"
node <skill-directory>/scripts/ledger-state.mjs record-waiver <ledger.json> local "<name>" <revision> "<exact user approval>"
node <skill-directory>/scripts/ledger-state.mjs record-criterion <ledger.json> <criterion-id> <revision> "<evidence>"
node <skill-directory>/scripts/ledger-state.mjs attest-workstream <ledger.json> <workstream-id> <revision> "<evidence>"
node <skill-directory>/scripts/ledger-state.mjs record-integrated-check <ledger.json> "<name>" <revision> "<evidence>"
node <skill-directory>/scripts/ledger-state.mjs record-delivery <ledger.json> <revision> "<artifact>"
node <skill-directory>/scripts/ledger-state.mjs reopen <ledger.json> "<next observable gate>"
node <skill-directory>/scripts/ledger-state.mjs resolve-path <ledger.json> "<completed authorized path>"
node <skill-directory>/scripts/ledger-state.mjs complete <ledger.json>
```

Updates are validated before an atomic write. `stamp-revision` invalidates repository checks plus product criteria, relied-on workstream attestations, integrated checks, and delivery state. `reopen` invalidates the product layers and creates explicit remaining work even when the revision has not changed. The four evidence-recording commands restore those layers only for the current revision. `record-waiver` preserves a separate user-approval record; ordinary check recording cannot create a waiver. `resolve-path` removes only an exact named path. `complete` never clears remaining work and refuses active work, blockers, stale evidence, missing delivery, or incomplete criteria.

Schema v2 links verification to readiness and records exact revisions. Upgrade a v1 ledger before using any other lifecycle command:

```bash
node <skill-directory>/scripts/ledger-state.mjs migrate-v1 <ledger.json>
```

Migration supports v0.1 `schemaVersion: 1` ledgers with the documented top-level records and arrays. Because v0.1 did not require an executable definition of done, write `target.definitionOfDone` explicitly before migration; the command refuses to infer it. Migration preserves old claims in `evidenceHistory`, resets product and verification evidence to pending, and requires fresh current-revision attestation. It never promotes legacy prose into current evidence.

## Required top-level records

| Record | Purpose |
|---|---|
| `root` | Stable agent ID and `user-facing-root` identity proof |
| `target` | Outcome, in/out scope, allowed authority, and owner-only gates |
| `readiness.criteria` | Required conditions with verified or user-deferred evidence |
| `criticalPath` | Observable next gate, blocked paths, and remaining authorized paths |
| `workstreams` | Bounded ownership, dependencies, write claims, transitions, and acceptance |
| `verification` | Current revision, repository-defined local checks, installed PR checks, and evidence |
| `program` | Readiness owner, integrated checks, delivery, blockers, and approvals |

## Workstream rules

Each workstream records:

```json
{
  "id": "settings-ui",
  "role": "Settings UI implementer",
  "objective": "Implement the settings form",
  "why": "The user workflow depends on it",
  "owner": "worker-ui",
  "authoritativeInputs": ["settled API contract"],
  "dependencies": [],
  "writeClaims": ["src/settings/ui"],
  "forbidden": ["API implementation", "merge", "deployment"],
  "expectedOutput": "Settings form with focused evidence",
  "stopConditions": ["API contract drifts", "write ownership overlaps"],
  "maySpawn": false,
  "requiresUserAuthority": false,
  "requiredEvidence": ["focused tests"],
  "evidence": [],
  "reliedOn": true,
  "state": "assigned",
  "transitions": [
    { "state": "candidate", "by": "root" },
    { "state": "scoped", "by": "root" },
    { "state": "assigned", "by": "root" }
  ]
}
```

Use explicit path or `system:<name>` claims. Globs are rejected because overlap cannot be proven safely. The root records the acceptance object only after challenging a worker submission.

## Validator guarantees

The deterministic validator rejects:

1. non-root orchestration identity or readiness declarations;
2. recursive workers and worker-owned root transitions;
3. invalid state transitions, missing evidence, and dependency cycles;
4. overlapping active write claims and owner-only work without approval evidence;
5. blockers while authorized paths remain or completion with unfinished work;
6. completion without required criteria, root acceptance, integrated checks, or delivery evidence;
7. a Complete gate with an in-progress program, remaining work, blockers, or stale evidence from any completion layer.

The validator proves ledger consistency, not real-world truth. The root must still reproduce evidence and inspect authoritative integrated state.

## Repository-defined verification

The orchestrator does not require or install a PR verification system. It must adapt to one when the target repository already has it.

Record:

```json
{
  "verification": {
    "applicable": true,
    "readinessCriterionId": "repository-verification",
    "revision": "current-commit-or-artifact-id",
    "sources": ["AGENTS.md", "package.json", "repository PR settings"],
    "localChecks": [
      {
        "name": "repository test suite",
        "command": "npm test",
        "required": true,
        "status": "passed",
        "revision": "current-commit-or-artifact-id",
        "evidence": "test output for current revision",
        "waivedByUser": false
      }
    ],
    "prChecks": [],
    "noPrChecksReason": "No PR checks are installed",
    "notApplicableReason": ""
  }
}
```

Use `pending`, `passed`, `failed`, `unavailable`, or `waived`. Link verification to one readiness criterion with `readinessCriterionId`. Passing and waived checks record an exact `revision`; every required check must match `verification.revision` before that criterion may be verified or the program may be done. Completion also requires matching revision bindings on every verified criterion, relied-on workstream, integrated check, and delivery record.

## State transitions

Normal path:

```text
candidate → scoped → assigned → active → submitted → challenged → integrated → verified → done
```

Workers may record only `active`, `submitted`, or `blocked` for their own workstream. Root-only transitions include `candidate`, `scoped`, `assigned`, `challenged`, `integrated`, `verified`, `done`, `rejected`, `superseded`, and `stopped`.
