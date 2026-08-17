# Orchestrator conversation research

**Snapshot:** 2026-08-17

**Tracking:** [OFF-443](https://linear.app/off-brand-studio/issue/OFF-443/research-orchestrator-conversation-pattern)

**Phase:** Research only. No skill, router, methodology, or installable package exists yet.

## Executive finding

“Orchestrator” is not being used as a synonym for “delegate this.” It is a compact transfer of **program ownership**.

The user expects the root agent to turn a broad outcome into a managed delivery program: understand the system, discover missing scope, split independent work across specialist agents, retain authority over shared seams, integrate the work, verify the result, and carry it to a reviewable artifact. Subagents increase throughput; they do not replace the root agent’s judgment or accountability.

The recurring operating shape is:

> **Inspect → define done → map dependencies → delegate bounded work → integrate centrally → audit adversarially → deliver evidence → continue around blockers.**

## Corpus and counting rules

The local Codex conversation archive was searched for case-insensitive whole-word `orchestrator` matches inside stored `role=user` messages. Injected repository instructions and plugin/context envelopes were excluded.

- **37 tasks** contain the literal word in user-message history as of this snapshot.
- **4 direct user messages** account for those matches: three historical execution commands and this research request.
- **33 child-agent tasks** inherited one of the historical prompts through forked conversation history.
- The historical behavior corpus is therefore **3 distinct commands across 36 tasks**, not 36 independent user requests.
- One additional Prima descendant, `catalog_retention_audit`, belongs to the orchestration tree but no longer contains the literal prompt after context compaction. It is behavior evidence, but it is not counted as a literal match.

This distinction matters. Counting every fork as a separate usage would overstate the guarded-owner-pilot pattern by roughly an order of magnitude.

Codex’s official terminology supports this model: a thread stores conversation history, a turn is one exchange, and a subagent is a specialized child agent. See the [OpenAI glossary](https://learn.chatgpt.com/docs/glossary).

## The three historical command families

### 1. Guarded owner pilot: finish a whole product slice

**Root task:** `Assess Prima production readiness`

**Root thread:** `019fec91-7e97-7dc1-9fe4-e5452c71f7b9`

**Date:** 2026-08-10

**Literal-match tasks:** 28 (root + 27 descendants)

**Additional compacted descendant:** 1

User command:

> Good to know, we will target 100% of a guarded owner pilot in this session. You will be the orchestrator agent to get us there officially, managing tasks and spinning up numerous sub agents to accomplish your tasks to guide us to the final point.
>
> Your analysis & recommendations are welcome. I'd like to also mention that the UI (the only layer I can interact with) is entirely primitive & does not work well. I'd like you to add that as a large undertaking — ultimately we need to achieve mature UI interfaces and UX by the end of this working session so that I may fully test and dogfood this product myself with upcoming other projects.

What was being asked:

- Convert a readiness assessment into a full delivery program.
- Treat “100% guarded owner pilot” as the target, including newly surfaced work.
- Add a major UI/UX workstream, not merely finish backend gaps.
- Make recommendations and keep working until only owner-only blockers remain.

How the root agent acted:

- Turned the goal into tracked workstreams: UI/UX, guarded owner loop, recovery/operations, and release-baseline repair.
- Created or reconciled Linear issues, assigned ownership, and created isolated worktrees.
- Used all available concurrency: 30 spawn calls, 50 follow-up assignments, 98 messages to workers, 158 waits, and 6 interrupts over the full run.
- Continued direct implementation on serialized/shared seams while workers handled bounded slices and audits.
- Added multiple audit waves for identity, security, UX, persistence, recovery, release delivery, and final review.
- Delivered a draft PR, an exact-commit native artifact, reviewed UI evidence, green local gates, and an honest remaining-P1 list.

Observed outcome:

- Draft PR [#102](https://github.com/tjcages/prima/pull/102) and a downloadable native artifact were produced.
- Service, native, repository, secret, and artifact checks were reported green at the final checkpoint.
- The agent explicitly refused to claim 100%: durable Agent Workflow/resume, authenticated Product Publish, and removal of proof-admin plumbing remained.
- Owner-only steps were isolated: restart Codex, provide a Capital API key, restore Cloudflare sign-in, and resolve GitHub billing/spend limits.

### 2. Provider-neutral architecture: own a complete buildout

**Root task:** `Summarize project principle`

**Root thread:** `01a010aa-4ae3-7990-b2ee-33616151218c`

**Date:** 2026-08-17

**Literal-match tasks:** 4 (root + 3 descendants)

User command:

> This is fantastic! I agree wholeheartedly with your analysis. I'd like you to own the complete and utter buildout of this functionality as it's described. Understand the entire process, buildout, boundary conditions, and anything else you can think of to achieve our ultimate goal. Spin up as many sub agents as needed to execute the work, act as the orchestrator of these agents to accomplish the full buildout. Do not stop until we are done.

What was being asked:

- Promote a recommendation from analysis into an end-to-end implementation mandate.
- Include architecture, boundary conditions, migrations, tests, and delivery—not only the obvious feature code.
- Let the agent discover necessary scope without requiring the user to enumerate it.
- Persist to completion and use subagents wherever they improve throughput or confidence.

How the root agent acted:

- Launched three initial read-only audits: provider migration, Artifacts security/lifecycle, and compatibility/testing.
- Established the key authority boundary before parallel writes: accepted source, working store, and encrypted checkpoints are distinct.
- Split isolated implementation claims only after the shared contract was settled.
- Retained constitutional docs, ADRs, shared contracts, and integration seams at the root.
- Reused the same workers through ten follow-up tasks instead of continuously spawning replacements.
- Built cross-provider conformance, real Git mirror/export, compare-and-swap race, token-leak, recovery, and native compatibility evidence.

Observed outcome at snapshot time:

- PR [#125](https://github.com/tjcages/prima/pull/125) was committed and pushed.
- A branch Cloudflare preview was deployed and verified after resolving a global container-name collision.
- 931 runtime tests and 342 native tests were reported green with portability, CAS, and secret proofs.
- Hosted GitHub Actions did not start because of an account spending/payment gate; the agent recorded this as an external blocker instead of a code failure.

### 3. Totem command center: orchestrate a bounded UI feature

**Root task:** `Build admin overview homepage`

**Root thread:** `01a010d2-15a1-7192-9330-181c3fb4f660`

**Date:** 2026-08-17

**Literal-match tasks:** 4 (root + 3 descendants)

User command:

> I'd like you to take a look at our totem admin app — please work as the orchestrator to best spin up sub agents to accomplish your task. I'd like to create a new home page, separate from Albums that provides the best of all details for deal flow, production timelines & progress, upcoming or released albums, analytics, artists, labels, emails, etc. whatever you see most important and fit to include in an all-inclusive homepage. This should give a high level idea of the progress and anything important to focus on without over doing the details or being confusing. It should of course link to the other pages for additional details. Spin up a PR and update a preview link so i may provide feedback as necessary.

What was being asked:

- Use orchestration for a concrete feature, not only a whole-product rescue.
- Resolve an ambiguous information-architecture problem through product judgment.
- Keep the page comprehensive but calm, actionable, and linked to deeper workflows.
- Deliver through a PR and preview so the user can review visually.

How the root agent acted:

- Delegated three complementary discovery tasks: data inventory, UX architecture, and guardrails/tests.
- Chose existing CRM, album-rollout, and 30-day analytics data; explicitly avoided schema changes and heavy reads.
- Root-owned implementation and integration after discovery rather than delegating the whole feature blindly.
- Used a worker as a review agent; four findings were folded back into the implementation before publishing.
- Continued despite Linear reauthentication and local visual-auth blockers, using automated UI contracts and a planned hosted preview.

Observed outcome at snapshot time:

- The `/` Home and `/albums` split, homepage panels, navigation changes, and supporting API work were implemented.
- 1,285 admin/API tests were reported passing before the final corrections; a later focused pass covered 113 admin and 73 API test files.
- Review findings fixed outage-safe metrics, email preview behavior, date stability, and capability-aware fetching.
- The root task was still running its broader gate; PR and preview delivery had not yet been recorded in conversation history.

## Complete literal-match inventory

The child task names below are stable agent paths from the local thread registry. They reveal how the orchestrator decomposed each command.

### Guarded owner pilot — 28 tasks

| Thread | Agent path / role |
|---|---|
| `019fec91-7e97-7dc1-9fe4-e5452c71f7b9` | Root — production-readiness audit and orchestrator |
| `019fecab-1209-7013-9de5-407ea5b76c02` | `off_425_ui` |
| `019fecab-2bcf-7c41-aa86-26570e567717` | `off_403_loop` |
| `019fecab-448e-7b91-a226-2885543526dc` | `off_346_ops` |
| `019fecaf-fee0-7b12-8df9-4ac47fa0b89a` | `off_427_docs` |
| `019fecca-80a5-7103-a2da-60cf883898e7` | `off_329_save` |
| `019fecd1-f8d3-7c72-8be6-d70de7cb2c76` | `ui_final_review` |
| `019feceb-2c06-7ae2-9fd1-cc26bc78630e` | `identity_arch_audit` |
| `019feceb-40d9-74a1-aeed-fbfee1478de1` | `identity_security_audit` |
| `019feceb-57e1-78d2-9f29-9c47b3d0e958` | `identity_ux_audit` |
| `019fed15-be19-7773-9ec4-c5d46a4cb73b` | `proof_admin_map` (nested) |
| `019fed16-5643-7b21-b7bc-e8e2aefb3ece` | `identity_native_flow` |
| `019fed27-aaca-71f1-a5a6-10cec1752acb` | `real_import_design` |
| `019fed3b-c359-7a31-8fe9-8e9ee537253b` | `product_workspace_route` |
| `019fed64-281d-7e71-89f7-b6756235564c` | `source_normalizer` |
| `019fed64-39cf-78e1-a7f1-951b89df4c39` | `normalizer_adversary` |
| `019fed64-4918-7b23-81a6-dc4ffb3fb8e8` | `workspace_binding_design` |
| `019fed67-b4d7-7443-88d7-a2ef149f418f` | `project_directory` |
| `019fed72-4a92-7720-9234-09ca1a17cd6a` | `normalizer_failure_fix` |
| `019fed72-5a0d-7ca0-8d1f-af4cadc7ee6b` | `numeric_repo_scope` |
| `019fed8b-c341-7cf3-98d7-d2b26bc33a8a` | `runtime_import_binding` |
| `019fed94-b227-7d20-b8d0-422e3dad3b2d` | `provider_agent_loop` |
| `019fedb1-03dc-77e0-9650-00c04897dc13` | `final_security_review` |
| `019fedc7-4b77-7592-9669-3a1b11d45d47` | `final_security_audit` |
| `019fedc7-63e7-7513-9740-05f044034406` | `final_ux_audit` |
| `019fedc7-793d-7312-a787-4568027d3174` | `release_delivery_audit` |
| `019fedcc-bad6-7983-a172-7c5110cddecb` | `revision_recovery_design` |
| `019fedcc-d0d1-71f3-bc1c-f0875e6a23e5` | `persistence_retention_design` |

Related compacted descendant: `019fedd7-6b62-7a92-ac44-027e5a1ee013` (`catalog_retention_audit`). It is excluded from the 28 literal matches.

### Provider-neutral buildout — 4 tasks

| Thread | Agent path / role |
|---|---|
| `01a010aa-4ae3-7990-b2ee-33616151218c` | Root — architecture and integration orchestrator |
| `01a010cb-160f-7c32-828c-e3dd05d8d3e6` | `provider_boundary_audit` |
| `01a010cb-2737-7cc2-83c2-c38669fce126` | `artifacts_boundary_audit` |
| `01a010cb-34c3-7930-b52f-ae2d0a79b14c` | `verification_audit` |

### Totem homepage — 4 tasks

| Thread | Agent path / role |
|---|---|
| `01a010d2-15a1-7192-9330-181c3fb4f660` | Root — feature and delivery orchestrator |
| `01a010d5-0902-74e0-8e84-a3a8075ccd02` | `data_inventory` |
| `01a010d5-16ca-7542-bd26-24bacbebd3c1` | `ux_architecture` |
| `01a010d5-20fe-7471-932f-0f84bd0d6db4` | `guardrails_tests` |

### Research request — 1 task

| Thread | Role |
|---|---|
| `01a010e8-2ac8-7232-992a-67b61052cbd7` | Root — this research and preservation task |

## Common themes in the user’s phrasing

### 1. Ownership transfer

The user says “own,” “complete and utter buildout,” “get us there officially,” and “do not stop.” The desired behavior is autonomous management of the outcome, not repeated requests for the next micro-decision.

### 2. Outcome completeness over ticket completion

The command names a destination—guarded pilot, provider-neutral architecture, useful command center—then invites the agent to find boundary conditions and missing work. “Done” is judged by the usable system and review evidence, not by whether the originally obvious code change landed.

### 3. Parallelism as a means, not the product

“Spin up sub agents” appears in every historical command, but the user does not prescribe the decomposition. The root agent is expected to choose useful specialist boundaries and avoid delegation theater.

### 4. Persistence with judgment

The user wants forward motion through long tasks and external blockers. The successful agents keep doing unblocked work, but still preserve approval boundaries and state honestly when the full goal has not been reached.

### 5. Reviewable delivery

The expected endpoint is concrete: PR, deployed preview, native artifact, tests, screenshots, tracked status, or an explicit list of owner-only blockers. A prose summary alone is not enough for build commands.

## Typical root-agent behavior

### Before delegation

1. Load repository rules, governing documents, tracker state, and relevant skills.
2. Translate the broad aspiration into a measurable target and identify the current baseline.
3. Map shared seams, dependency order, authority boundaries, and risky external operations.
4. Decide which work is independent enough for a worker and which must remain serialized.

### During delegation

1. Start with read-only audits when the architecture or scope is uncertain.
2. Give each worker one bounded question or implementation claim.
3. Isolate writers by issue, branch, and worktree; use review agents read-only.
4. Keep the root productive on integration, shared contracts, or another unblocked critical path.
5. Reuse workers with follow-up tasks, interrupt stale work, and spawn a new specialist only when a new independent seam appears.

### During integration and verification

1. Treat worker output as evidence or a candidate patch, not accepted truth.
2. Fold findings into the root’s dependency model and resolve cross-cutting conflicts centrally.
3. Run focused checks early, then full gates, adversarial reviews, security checks, and visual proof as relevant.
4. Convert discovered gaps into tracked work instead of hiding them in chat.
5. Continue around unavailable credentials, auth, billing, or user input; isolate the exact owner-only action.

### At delivery

1. Commit and push an intentional scope.
2. Open a reviewable PR and produce a preview or native artifact.
3. Attach exact-revision evidence and update the tracker.
4. State what is green, what is blocked, and what is still not done.
5. Never merge, publish destructively, or broaden authority merely because the user said “do not stop.”

## What the subagents typically do

The strongest delegations fall into four types:

- **Discovery:** inventory data, map architecture, read governing docs, locate relevant code.
- **Design:** propose a bounded contract, lifecycle, migration, or information architecture.
- **Implementation:** own one isolated tracer bullet or provider/client slice.
- **Adversarial review:** search for security, UX, recovery, retention, compatibility, or test gaps after integration.

Workers generally stop at a recommendation, patch, test result, or PR-ready branch. They do not own the overall definition of done, shared authority decisions, final integration, merge, or user handoff.

## Failure modes and cautions

### 1. Fork amplification can distort the evidence

The same user prompt appears in every descendant’s inherited history. Future research and any skill telemetry must distinguish direct invocations from inherited context.

### 2. “As many agents as needed” can become orchestration overhead

The guarded-pilot run used 30 spawns and hundreds of coordination calls. That produced broad coverage, but also hit a usage limit and required extensive waiting, follow-ups, and compaction. More agents are not automatically more progress.

### 3. Unbounded terminal language is not unlimited authority

“Do not stop” means persist toward the authorized outcome. It does not authorize destructive operations, production changes, billing changes, credential creation, merging, or silently redefining the product.

### 4. Broad goals need a living acceptance model

The agent often discovers work that was absent from the original prompt. Without an explicit target ledger, the run risks either premature completion or endless scope growth. New gaps should be classified as required for the named outcome, deferred, or owner decision.

### 5. A child agent should not inherit vague ownership

Effective children received narrow roles such as `identity_security_audit` or `data_inventory`. Passing the whole broad command to every worker would create overlapping writers, contradictory recommendations, and duplicated work.

## Research hypotheses for a future skill

These are hypotheses to validate, not a skill design.

1. **Invocation meaning:** “Act as orchestrator” should switch the root from task execution to program ownership while preserving the original authorization boundary.
2. **Mandatory first artifact:** the root should create a compact target ledger: objective, acceptance evidence, workstreams, shared seams, dependencies, owner-only gates, and delivery artifacts.
3. **Delegation gate:** spawn only when a task is bounded, independent, and useful in parallel; otherwise the root performs it directly.
4. **Control-plane invariant:** root owns scope, dependency order, shared seams, integration, verification, tracker lifecycle, and final handoff.
5. **Wave discipline:** prefer small waves of specialists, reuse existing workers, and reassess after each wave instead of maximizing agent count immediately.
6. **Evidence gate:** no workstream is complete without its proportional proof; no overall completion without the user-visible delivery artifact.
7. **Honesty rule:** terminal persistence requires continuing around blockers, not claiming success or exceeding authority.
8. **Context rule:** inherited orchestrator prompts must be tagged as ancestry, not counted as new invocations.

## Open research questions

1. Should the future skill have separate modes for bounded feature delivery, whole-product completion, and research/audit orchestration?
2. What objective threshold justifies a subagent versus direct root work?
3. How should the target ledger distinguish “required for this outcome” from newly discovered follow-up work?
4. What concurrency budget best balances speed, coordination cost, usage limits, and context compaction?
5. Which completion artifacts should be mandatory by task type: PR, preview, native artifact, tracker update, visual evidence, or research document?

## Source and privacy note

This document preserves thread IDs, user-authored commands, agent role paths, aggregate coordination counts, and outcome summaries. It intentionally does not copy hidden reasoning, raw tool outputs, credentials, or unrelated conversation content.
