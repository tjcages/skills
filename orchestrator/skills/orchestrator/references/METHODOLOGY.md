# Orchestrator methodology

**Version:** 0.1 draft — research-derived; not yet live-dogfooded

## 0. Core thesis

The orchestrator is the sole owner of program readiness. It may delegate execution, discovery, review, or verification, but never delegates the decision that the whole target is ready.

> Delegation moves work, never accountability. Workers submit; the root accepts. Activity is not progress; accepted evidence is progress. Unverified is not done. A blocker limits one path, not the root's obligation to advance every other authorized path.

“Sole owner” means the root owns:

1. the target and definition of done;
2. the dependency graph and next gate;
3. every assignment's boundaries;
4. challenge and acceptance of worker results;
5. authoritative integration and verification;
6. the final readiness claim and delivery.

Workers own bounded deliverables. They do not own overall scope, readiness, publishing, merging, or the meaning of done.

## 1. Root identity gate

Before orchestrating, establish identity.

| Identity | Required behavior |
|---|---|
| User-facing root agent | May enter orchestrator mode |
| Spawned worker or delegated task | Must downgrade to worker mode |
| Identity unclear | Do not spawn; state the ambiguity and proceed locally until resolved |

A worker that receives this skill must not recursively orchestrate. It may recommend a further decomposition to the root, but only the root decides whether to create another worker.

## 2. Activation gate

Use orchestration only when all are true:

1. The user asks for orchestration, delegation, or end-to-end ownership, or the task clearly requires one root to coordinate multiple independent workstreams.
2. At least two bounded workstreams can progress independently.
3. Parallelism materially improves latency, coverage, or adversarial review.
4. The root can define how each result will be challenged and integrated.
5. The environment permits subagents and the action remains within user authority.

Do not spawn for a single bounded task, cosmetic parallelism, or work with overlapping writers on one seam. Continue locally when orchestration adds more coordination than useful evidence.

## 3. Establish the target ledger

Create the ledger before the first assignment. Follow `LEDGER.md` and use the bundled JSON example. When repository writes are authorized, persist it at a scoped path such as `.orchestration/<slug>.json`; otherwise use a temporary JSON file and keep the durable summary in the existing tracker.

The ledger must contain:

```text
Target:
Outcome:
Definition of done:
Non-negotiables:
In scope / out of scope:
Authority and owner-only gates:
Current readiness evidence:
Known gaps and risks:
Critical path / next gate:
Delivery artifacts:
```

Record workstreams with:

```text
ID | Objective | Dependencies | Owner | Write claim | State | Evidence | Next action
```

The ledger is the resumable source of truth. Chat summaries and worker confidence are not substitutes. Run the bundled validator before the first delegation, after each wave or target change, after compaction recovery, and before a readiness claim. A validation failure blocks progression until the root repairs or supersedes the invalid state.

## 4. Build the work graph

Decompose by independently checkable outcomes, not vague roles. Map shared seams before assigning writers.

Use read-only discovery as the default first wave. Permit a worker to write only when:

1. its owned files or systems are explicit;
2. shared contracts and structural seams are settled;
3. no active worker has an overlapping claim;
4. the root knows the integration order;
5. rollback or recovery is understood.

Serialize schema, navigation, shared types, release configuration, and other structural seams unless the assignments are demonstrably disjoint.

## 5. Delegation gate

An assignment may leave the root only if it is:

1. **Bounded** — one outcome, explicit exclusions.
2. **Checkable** — required evidence and acceptance questions are known.
3. **Independent** — it can advance without hidden shared-state conflict.
4. **Worth parallelizing** — it materially improves delivery.
5. **Integrable** — the root knows where and how the result enters the whole.
6. **Authority-safe** — no merge, publish, destructive, or external action beyond user authorization.

Every assignment uses `WORKER-CONTRACT.md`. A task name plus a sentence is not a sufficient contract.

## 6. State machine

Every workstream follows:

```text
Candidate → Scoped → Assigned → Active → Submitted → Challenged → Integrated → Verified → Done
```

Exceptional states:

- **Blocked** — a concrete dependency prevents this path.
- **Rejected** — evidence or result failed acceptance.
- **Superseded** — target or approach changed.
- **Stopped** — root halted drift, conflict, or low-value work.

Only the root may move a workstream beyond **Submitted**. A worker's “done” means “submitted for root challenge.” Count program progress from **Verified**, not Active or Submitted.

## 7. Root control loop

Repeat until the completion gate passes or user authority is required.

### 7.1 Orient

Inspect authoritative state: repository, tracker, live system, prior evidence, and active workers. Discover repository-defined verification from agent instructions, package scripts, hooks, pull-request settings, and existing required checks. Resolve target changes before directing more work.

### 7.2 Define readiness

Translate the request into observable acceptance conditions. Separate required, optional, deferred-by-user, and owner-only gates.

### 7.3 Direct one wave

Assign only ready, non-overlapping work. Keep at least one useful root-owned path: integration preparation, seam resolution, verification setup, or direct critical-path work.

### 7.4 Monitor without theater

Use compact state snapshots. Intervene when a worker:

- drifts outside its contract;
- reports activity without evidence;
- encounters an overlap or stale assumption;
- needs a root-owned decision;
- blocks while another authorized path can advance.

Follow up for missing evidence. Interrupt drift. Stop conflicting work. Do not create replacement agents merely to make the dashboard look active.

### 7.5 Challenge every submission

Ask five groups of questions:

1. **Scope:** Did it satisfy the exact assignment and avoid forbidden seams?
2. **Truth:** Does authoritative state support the claim?
3. **Evidence:** Are checks reproducible and proportional to risk?
4. **Interaction:** Does it conflict with another workstream or shared contract?
5. **Residual risk:** What remains uncertain, untested, or reversible only with cost?

Reproduce important checks where practical. Reject vague reports, screenshots without state proof, tests that never exercise the claim, and implementation that silently changes the target.

### 7.6 Integrate centrally

The root resolves conflicts, reconciles terminology, orders changes, and verifies the combined system. Passing isolated worker checks does not prove integrated readiness.

### 7.7 Honor repository-defined verification

The orchestrator does not create or require a hosted verification mechanism. When the repository already has local check commands, PR verification, merge gates, or release tests:

1. record their source, required/optional status, and current revision in the ledger;
2. run the exact required local commands after authoritative integration;
3. inspect installed PR checks after the final pushed change using the repository's provider and tools;
4. question failures from logs or evidence, fix in-scope causes, and distinguish product defects from external provider failures;
5. keep required pending, failed, or unavailable checks out of **Done** unless the user explicitly waives that gate.

Never create, delete, disable, weaken, bypass, or replace repository verification unless the user explicitly asks. Never treat a stale result from an older revision as evidence for the current one.

### 7.8 Recompute readiness

Update the ledger from accepted evidence. Select the next gate from dependencies and remaining risk, not from which worker is loudest or newest.

### 7.9 Reset when coordination dominates

If managing workers produces more chatter than accepted evidence, stop spawning. Harvest submitted work, terminate low-value paths, integrate what is useful, and rebuild the graph. Do not use an arbitrary worker-count threshold.

## 8. Failure and blocker handling

| Condition | Root action |
|---|---|
| Weak or unverifiable result | Reject; specify missing evidence or take over |
| Worker drift | Interrupt; restate objective and forbidden seams |
| Overlapping writers | Stop one or both; preserve work; serialize integration |
| Worker stalled | Resolve root-owned dependency, narrow task, or reassign |
| Credential/approval blocker | Mark exact path blocked; advance every other authorized path |
| User changes target | Freeze stale work; update ledger; supersede or re-contract assignments |
| Context compaction | Re-read ledger, authoritative state, and active-worker snapshots before acting |
| Worker disappears | Treat unverified work as absent; inspect artifacts before reassignment |

“Do not stop” increases persistence, not authority. It does not permit unsafe writes, invented credentials, publishing, merging, or scope expansion.

## 9. Completion gate

Do not claim readiness until all are true:

1. Every required outcome is Verified, or explicitly deferred by the user.
2. Every relied-on worker submission was challenged by the root.
3. Authoritative integrated state matches the target ledger.
4. Proportional checks pass on the combined result.
5. Required repository-defined local and PR verification passes on the current revision, or the user explicitly waives it.
6. The actual user workflow or delivery path was exercised when possible.
7. Required artifacts, links, handoffs, or previews exist.
8. No unfinished active worker can change the readiness claim.
9. Limitations and blocked owner-only gates are stated plainly.

If one condition fails, report work in progress or blocked—not done.

## 10. Anti-patterns

| Anti-pattern | Correction |
|---|---|
| Delegation theater | Spawn only checkable, material work |
| Recursive orchestration | Workers recommend; root alone delegates |
| Distributed readiness | Root alone accepts and declares readiness |
| Fire-and-forget | Monitor, challenge, and integrate every relied-on result |
| Overlapping writers | Explicit claims; serialize shared seams |
| Activity reporting | Report accepted evidence and next gates |
| Premature victory | Apply the completion gate to integrated state |
| Blocker paralysis | Advance independent authorized paths |
| Authority creep | Separate persistence from permission |
| Context loss | Persist and re-read the target ledger |

## 11. Versioning and dogfood

This draft is not proven by being well specified. Before v1:

1. run two independent live orchestrations;
2. capture at least one challenged/rejected submission;
3. exercise target change or blocker recovery;
4. exercise ledger-based compaction recovery;
5. score the release rubric in `READINESS.md`;
6. update `EXAMPLES.md` with dated friction and methodology changes.
