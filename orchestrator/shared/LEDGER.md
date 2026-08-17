# Machine-readable target ledger

The root orchestrator maintains this ledger. Workers report evidence to the root; they never edit readiness, acceptance, or program status directly.

## Start a ledger

Copy `examples/ledger.example.json` to a task-scoped path such as `.orchestration/<slug>.json` when repository writes are authorized. Otherwise keep the same structure in a temporary file and preserve the durable summary in the existing tracker.

Before the first worker starts:

```bash
node <skill-directory>/scripts/validate-ledger.mjs <ledger.json>
```

Run the same command after every assignment wave, target change, acceptance decision, compaction recovery, and before any readiness claim. A non-zero exit blocks progression until the root repairs or explicitly supersedes the invalid state.

## Required top-level records

| Record | Purpose |
|---|---|
| `root` | Stable agent ID and `user-facing-root` identity proof |
| `target` | Outcome, in/out scope, allowed authority, and owner-only gates |
| `readiness.criteria` | Required conditions with verified or user-deferred evidence |
| `criticalPath` | Observable next gate, blocked paths, and remaining authorized paths |
| `workstreams` | Bounded ownership, dependencies, write claims, transitions, and acceptance |
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
6. completion without required criteria, root acceptance, integrated checks, or delivery evidence.

The validator proves ledger consistency, not real-world truth. The root must still reproduce evidence and inspect authoritative integrated state.

## State transitions

Normal path:

```text
candidate → scoped → assigned → active → submitted → challenged → integrated → verified → done
```

Workers may record only `active`, `submitted`, or `blocked` for their own workstream. Root-only transitions include `candidate`, `scoped`, `assigned`, `challenged`, `integrated`, `verified`, `done`, `rejected`, `superseded`, and `stopped`.
