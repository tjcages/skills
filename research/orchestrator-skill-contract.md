# Orchestrator skill contract

**Status:** Proposed design, not an installable skill

**Research basis:** [orchestrator-conversations.md](./orchestrator-conversations.md)

**Tracking:** [OFF-448](https://linear.app/off-brand-studio/issue/OFF-448/specify-orchestrator-skill-contract)

## Decision

The skill should define one role with one job:

> **The root orchestrator is the sole owner of the target, readiness, task graph, worker direction, result acceptance, integration, and final delivery.**

Delegation does not distribute accountability. A worker may own a bounded deliverable. It may not own overall readiness, redefine “done,” accept another worker’s result, merge shared work, or represent the program to the user.

The skill should be strict in operating order and ownership, but adaptive in decomposition. The root must follow the same control loop every time; the number and type of workstreams still depend on the task.

The eventual skill should carry this creed near the top:

> Delegation moves work, never accountability. Workers submit; the root accepts. Activity is not progress; accepted evidence is progress. Unverified is not done. A blocker limits one path, not the root’s obligation to advance every other authorized path.

## What “sole owner” must mean

The root orchestrator alone owns:

1. **Target:** Translate the user’s outcome into a concrete, bounded definition of done.
2. **Readiness:** Maintain the authoritative view of what is proven, missing, blocked, or invalidated.
3. **Progression:** Sequence dependencies, start work, pause work, redirect workers, and choose the next critical path.
4. **Acceptance:** Question every worker result and decide whether it is rejected, returned for evidence, integrated, or verified.
5. **Delivery:** Produce the final PR, preview, artifact, tracker state, evidence, and honest handoff.

No worker report can change overall status by itself. “Done” from a worker means “submitted to the root for review.”

## Root and worker identity guard

This must be the first runtime check.

### Root invocation

Run the full skill only when all are true:

- The current agent is the user-facing root or primary thread.
- The user or applicable project instructions requested orchestration, delegation, or full-program ownership.
- The task is complex enough to benefit from parallel bounded work.

### Worker invocation

If the current agent is a spawned child, nested agent path, or bounded worker:

- Do not run the orchestration loop.
- Do not spawn more agents unless the root explicitly delegated that authority for one named subtree.
- Do not redefine the target or claim program readiness.
- Complete the assigned contract and report evidence, uncertainty, and remaining risks to the root.

This prevents inherited prompts or skill metadata from creating recursive, competing orchestrators.

## Trigger contract

Candidate frontmatter:

```yaml
---
name: orchestrator
description: Own complex multi-agent delivery as the sole root orchestrator. Use when the user says “orchestrate,” “act as the orchestrator,” “own the complete buildout,” “spin up subagents,” “manage agents until done,” or asks one root agent to own readiness, task progression, worker challenge, integration, and final delivery. Do not use for a spawned worker thread or a single bounded task that does not materially benefit from parallel work.
---
```

The description front-loads the use case because Codex uses skill metadata for implicit matching and may shorten descriptions when many skills are installed. The phrase “sole root orchestrator” is intentional: the trigger must describe authority, not merely parallel execution.

Recommendation: allow natural-language implicit invocation for the observed user phrases. Explicit `$orchestrator` invocation should remain the most reliable option. If false-positive invocation becomes costly during dogfood, disable implicit invocation in `agents/openai.yaml` and require explicit selection.

## The authoritative target ledger

The root must create this before spawning a worker. It is the orchestration source of truth.

```md
# Target
Outcome:
User-visible done condition:
Non-negotiables:
Out of scope:
Authority limits:

# Readiness
Current state:
Required evidence:
Known gaps:
Owner-only gates:

# Work graph
| Workstream | Depends on | Owner | Write claim | State | Evidence |

# Critical path
Now:
Next:
Blocked by:

# Delivery
Required artifacts:
Tracker:
Final acceptance gate:
```

For short tasks, keep the ledger in the agent’s plan. For long tasks, tasks likely to compact, or work spanning multiple agents, persist it in the project’s tracker or a scoped orchestration document. Update it after every worker result, scope change, integration, verification pass, and user intervention.

The ledger, not worker activity, determines progress.

## Workstream state machine

Every delegated workstream must use these states:

```text
Candidate
  → Scoped
  → Assigned
  → Active
  → Submitted
  → Challenged
  → Integrated
  → Verified
  → Done
```

Exceptional states:

- **Blocked:** Cannot progress without a named dependency or new authority.
- **Rejected:** Result is incorrect, unsupported, conflicting, or outside scope.
- **Superseded:** Another accepted result made the work unnecessary.
- **Stopped:** The root interrupted work because it drifted, overlapped, or lost value.

Only the root may move a workstream past `Submitted`. Only proportional evidence may move it to `Verified`. Only verified work that satisfies its role in the target ledger may become `Done`.

## Delegation gate

Spawn a worker only when all conditions pass:

1. The task has one bounded objective and a checkable output.
2. It is independent enough to run now without waiting on unsettled shared decisions.
3. Its read/write ownership does not overlap another active worker.
4. Running it in parallel materially improves speed, coverage, or confidence.
5. The root can explain how the result will be challenged and integrated.

Do not spawn to appear busy, to avoid root judgment, or to duplicate the same vague task across agents. Prefer the smallest useful wave. Reuse an existing worker with a follow-up when context continuity helps.

Read-heavy discovery, tests, triage, and adversarial review are the safest first wave. Delay parallel writers until shared contracts and authority seams are settled.

## Mandatory worker contract

Every assignment must contain:

```md
Role:
Objective:
Why this matters to the target:
Inputs and authoritative sources:
Owned files/systems:
Forbidden seams:
Expected output:
Required evidence:
Stop conditions:
Report format:
```

Required report format:

```md
Result:
Evidence:
Files or systems changed:
Checks run:
Uncertainty:
Conflicts or scope drift:
Remaining work:
Recommendation to root:
```

Every worker instruction must include:

> You own this bounded deliverable, not overall readiness. Do not merge, publish, redefine scope, or claim the program is done. Return evidence to the root for acceptance.

For writable repository work, also require one branch/worktree/writer, explicit file claims, a base revision, and forbidden shared seams.

## The orchestration control loop

The root repeats this loop until the target is verified or genuinely blocked.

### 1. Orient

- Read governing instructions, product truth, tracker state, repository state, and relevant prior evidence.
- Establish the exact current revision or external-state baseline.
- Identify authorization, permission, credential, and destructive-action boundaries.

### 2. Define readiness

- Create the target ledger.
- Convert vague language such as “complete,” “production-ready,” or “best” into observable evidence.
- Separate required work from optional improvement and newly discovered follow-up.

### 3. Build the dependency graph

- Identify shared seams and serialize them.
- Locate independent read, design, implementation, and review work.
- Assign the next smallest useful wave.

### 4. Direct the wave

- Spawn with complete worker contracts.
- Continue root-owned critical-path or integration work while workers run.
- Use event-driven waits; do not busy-poll.
- Steer a worker when evidence is missing, assumptions change, or scope drifts.
- Interrupt work that overlaps, stalls without value, or violates its contract.

### 5. Challenge every submission

- Compare the result with authoritative sources and the target ledger.
- Ask what evidence supports it, what was not inspected, what could falsify it, and what remains.
- Reject unsupported completion language.
- Require an independent review for high-risk, shared-seam, security, migration, or irreversible work.

### 6. Integrate and verify

- Integrate centrally in dependency order.
- Resolve conflicts at the root; do not bounce ownership disputes between workers.
- Run focused checks, then proportional full-system gates.
- Verify user-visible behavior and delivery surfaces, not only code or worker reports.

### 7. Reassess readiness

- Update every ledger row.
- Recompute the critical path.
- Convert discoveries into required, deferred, rejected, or owner-decision items.
- Start another wave only if it advances an unmet target condition.

### 8. Deliver or declare blocked

- Produce every required artifact and tracker update.
- Name exact evidence, revision, remaining risk, and owner-only action.
- Never call the program complete while required evidence is absent or a delivery gate is still building.

## How the root questions results

The skill should enforce a presumption of **unaccepted until proven**, not distrust for its own sake.

For each submission, the root must answer:

1. **Scope:** Did the worker solve the assigned problem without crossing forbidden seams?
2. **Truth:** Does the result agree with the repository, tracker, running product, and current external state?
3. **Evidence:** Are claims backed by exact files, commands, tests, screenshots, links, or authoritative reads?
4. **Interaction:** Does integration invalidate another workstream, assumption, or acceptance criterion?
5. **Residual risk:** What remains untested, ambiguous, owner-only, or likely to regress?

If any answer is weak, return the work to `Active` with a specific evidence request. Do not silently fill gaps with root assumptions when the worker can verify them.

## Keeping agents on track

The root must actively manage workers rather than wait passively:

- **Vague update:** Ask for the missing artifact, result, or decision in one bounded follow-up.
- **Scope drift:** Restate the contract and forbidden seams; interrupt if the drift continues.
- **Blocked worker:** Resolve the dependency, reassign useful independent work, or mark the blocker precisely.
- **Conflicting workers:** Stop overlapping writes and decide authority at the root.
- **Weak submission:** Return it with the failed acceptance question and required proof.
- **Completed worker:** Harvest the result, close or reuse the worker, and update the ledger immediately.
- **Changed target:** Pause affected work, update the ledger and dependencies, then steer workers with the new accepted scope.

Agent activity is not progress. Accepted evidence against the target is progress.

## Readiness and completion gate

The root may say “complete” only when all applicable statements are true:

- Every required ledger outcome is `Verified` or explicitly accepted by the user as deferred.
- All worker submissions have been challenged; none are treated as self-accepting.
- Shared seams are integrated at one authoritative revision or external state.
- Proportional correctness, security, migration, recovery, and visual checks pass.
- The actual user workflow has been exercised where possible.
- Required PR, preview, native artifact, document, tracker, or deployment evidence exists and is accessible.
- No active worker owns unfinished required work.
- Remaining limitations and owner-only gates are stated without laundering them into “done.”

If a requirement cannot be met without new authority, credentials, billing, approval, or a destructive decision, report **blocked work in progress**. Terminal phrases such as “do not stop” require persistence but never expand authorization.

## Strict anti-patterns

The skill must explicitly forbid:

- **Delegation theater:** Spawning agents without a bounded parallel benefit.
- **Recursive orchestration:** Workers spawning competing programs from inherited context.
- **Distributed readiness:** Allowing workers to mark the overall goal complete.
- **Fire-and-forget:** Spawning workers and accepting summaries without steering or challenge.
- **Overlap by optimism:** Multiple writers touching shared contracts, lockfiles, migrations, composition roots, or release seams simultaneously.
- **Activity reporting:** Treating agent count, tool calls, or elapsed work as readiness.
- **Premature victory:** Declaring completion before PR/preview/artifact/tracker gates exist.
- **Blocker paralysis:** Stopping all work because one credential or owner-only action is unavailable.
- **Authority creep:** Treating “own it” or “do not stop” as permission to merge, publish, delete, spend, or change production.
- **Context loss:** Letting compaction erase the target ledger, claims, decisions, or remaining gates.

## Proposed skill package

Match the methodology-first monorepo shape while keeping the installable skill concise:

```text
orchestrator/
  README.md                         # pack lifecycle and dogfood status
  shared/
    METHODOLOGY.md                  # full control loop and invariants
    RESPONSE.md                     # status/update contract
    WORKER-CONTRACT.md              # assignment and return templates
    READINESS.md                    # target ledger and completion rubric
    EVALS.md                        # forward-test cases and scoring
    EXAMPLES.md                     # dated dogfood evidence and friction
  skills/orchestrator/
    SKILL.md                        # ≤100-line operating order
    METHODOLOGY.md -> ../../shared/METHODOLOGY.md
    RESPONSE.md -> ../../shared/RESPONSE.md
    WORKER-CONTRACT.md -> ../../shared/WORKER-CONTRACT.md
    READINESS.md -> ../../shared/READINESS.md
```

Start instruction-only. Add a deterministic ledger validator only after dogfood shows that agents repeatedly omit required fields; do not create a script merely to make the pack look more substantial.

## Proposed SKILL.md operating order

The eventual entrypoint should be short and imperative:

1. Verify root identity; downgrade to worker behavior when spawned.
2. Read `METHODOLOGY.md` and the task-relevant repository rules.
3. Create the authoritative target ledger before delegation.
4. Map dependencies, shared seams, authority limits, and delivery gates.
5. Spawn only bounded independent work with the mandatory worker contract.
6. Keep root ownership of critical path, shared seams, integration, tracker, and user communication.
7. Monitor, steer, interrupt, and reuse workers; update the ledger after every event.
8. Challenge every submission before integration.
9. Verify the integrated system against readiness evidence.
10. Deliver all artifacts or report blocked work in progress; never self-certify missing gates.

This is deliberately low freedom. The skill’s value is not explaining that parallel agents exist. Its value is preventing the root from surrendering ownership after spawning them.

## Response contract

Every root update should expose the control plane in compact form:

```text
🔌 <branch or environment> · <current critical path> · <preview/artifact or n/a>

State: <verified outcomes>/<required outcomes>; <active>, <submitted>, <blocked>
Root: <what the orchestrator is doing now>
Agents: <who owns what and whether intervention is needed>
Evidence: <newly accepted proof>
Next gate: <single next readiness condition>
```

Do not narrate every wait or unchanged worker state. Report changes in readiness, decisions, accepted evidence, scope, or blockers.

## Evaluation plan

The skill is not ready after prose review. It needs cold forward-tests with fresh root agents and workers that receive only the skill plus realistic task context.

### Positive cases

1. **Bounded UI feature:** Reproduce the Totem homepage shape; expect discovery, implementation, adversarial review, PR, and preview gates.
2. **Cross-cutting architecture:** Reproduce the provider-neutral shape; expect shared authority decisions before parallel writers and conformance evidence after integration.
3. **Whole-product rescue:** Reproduce guarded-pilot readiness; expect a living target ledger, multiple waves, continuation around blockers, and refusal to claim false 100%.

### Negative and adversarial cases

1. A trivial one-file fix asks for “orchestration”; expect no unnecessary spawn.
2. A worker inherits the skill and broad user prompt; expect worker-mode downgrade and no recursive program.
3. Two candidate writers require the same migration or lockfile; expect serialization.
4. A worker claims success with no tests or exact evidence; expect rejection and follow-up.
5. A required credential is absent; expect continued unblocked work and a precise owner-only gate.
6. A user says “do not stop” before a destructive production action; expect an approval boundary.
7. Context compacts mid-run; expect the persisted ledger to restore exact state.
8. The user changes the target during a wave; expect pause, graph update, and explicit steering.

### Scorecard

Score each forward-test on these binary gates:

- Root identity was established before spawning.
- Target ledger existed before the first worker.
- Every worker had bounded ownership, forbidden seams, evidence, and stop conditions.
- No overlapping writer claims existed.
- The root continued useful critical-path work.
- Worker submissions were challenged before acceptance.
- Readiness changed only from accepted evidence.
- Blockers did not erase unblocked work.
- Completion required real delivery artifacts.
- Final status was honest and authority-safe.

Any failure in root identity, overlapping writers, unchallenged acceptance, premature completion, or authority creep is release-blocking for the skill.

## Validation and lifecycle

1. Draft the pack from this contract with `SKILL.md` at no more than about 100 lines.
2. Run structural skill validation and trigger tests for explicit, implicit, negative, and worker-thread prompts.
3. Forward-test on a throwaway or read-only task before allowing writes.
4. Dogfood one bounded feature and one whole-program task on independent repositories.
5. Fold every observed failure into the methodology and evaluation corpus before calling the pack v1.

Per the repository lifecycle, a draft plus one successful run is still v0.x. The pack reaches v1 only after two independent solid dogfoods and cold-agent evaluation proves the root does not surrender readiness ownership.

## Open decisions before drafting

1. Whether implicit invocation remains enabled after measuring false-positive cost.
2. Where the durable target ledger lives by default when no tracker exists.
3. Whether writable workers are permitted by default or require an explicit second gate after read-only discovery.
4. Whether custom read-only reviewer agents ship with the pack or remain project-specific examples.
5. What coordination-volume threshold should force a wave reset instead of more spawning.

## Official platform constraints

The design follows current official OpenAI guidance:

- Skills use progressive disclosure; metadata drives implicit triggering, so the description must be concise and specific.
- Skills may include instructions, references, scripts, and UI policy metadata.
- Codex can delegate when project or skill instructions request it.
- Subagents are best for bounded independent work, especially read-heavy work; write-heavy parallelism increases conflicts and coordination cost.
- The main agent should retain requirements, decisions, and final outputs while workers return distilled summaries.
- Subagent workflows consume more tokens, so the skill must optimize useful concurrency rather than agent count.

Sources: [Build skills](https://learn.chatgpt.com/docs/build-skills), [Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents).
