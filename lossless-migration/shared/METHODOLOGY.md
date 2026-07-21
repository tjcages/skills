# Lossless Migration Methodology

**Version:** 0.1.0 — extracted from Socials/Obi (`docs/inventory-audit.md` + `docs/migration-roadmap.md`), 2026-07-21

> **What this is.** How to re-architecture or reframe an existing product **without losing behavior** — inventory every table/endpoint/engine/component, map each to a named destination, delete only when the replacement is live and zero-caller.
>
> **The differentiator.** Most migrations start coding. This one starts with a **proof document**: “zero regressions” is a table you can read, not a hope. Companion to `constitution-first` (the *why*) and the phased roadmap (the *when*).
>
> **Target user.** Anyone rewriting, consolidating engines, or “just cleaning up” a non-trivial codebase that users already trust.

---

## 0. Core thesis

**Inventory every behavior → name its destination → ship replacement → then delete.**

A migration is lossless only when:

1. **Every existing thing has a row** in the audit (table, endpoint, engine, component, admin one-off).
2. **Every row has a destination tag** — reframe, consolidate, view, infra, **GAP**, or **RETIRE**.
3. **RETIRE never ships before its destination is live** with zero remaining callers.
4. **Each phase leaves the tree cleaner** than it found it (delete the superseded thing, don’t comment it out).

Obi’s headline finding generalizes: **most “rewrites” are reframes** (~80% already the target model in disguise). The audit’s job is to prove that before anyone opens a green-field PR.

---

## 1. Step zero — is this even a lossless migration?

| Signal | Move |
|---|---|
| Green-field product, nothing to preserve | Skip. Use `constitution-first` + build. |
| Disposable prototype, no users | Skip or light README note. |
| Existing users / data / behaviors you must keep | **This pack.** |
| “Big bang rewrite in a new repo” urged | Stop — run the audit first; usually it’s reframe-in-place. |

If a constitution does not exist yet, run `constitution-first` **before** inventing destinations — the audit maps *to* the model the constitution names.

---

## 2. The three-doc trio

| Doc | Job | Skill |
|---|---|---|
| **Constitution** | What’s true (doors, creed, model) | `constitution-first` |
| **Inventory audit** | What’s built → destination proof | **this pack** |
| **Migration roadmap** | Phased plan Linear will mirror | this pack §7 + `linear-setup` |

**Conflict rule:** constitution > audit destinations > roadmap sequencing > tickets. If the roadmap wants to drop a behavior the audit marked keep, the roadmap is wrong.

---

## 3. Destination legend (tags)

Steal Obi’s tags; rename to the product’s model — keep the *shape*.

| Tag | Meaning |
|---|---|
| **ATOM / ENTITY** | Becomes the canonical record |
| **FACET / FIELD** | Property on that record |
| **FORM / TYPE** | Shape discriminator |
| **RELATION** | Wire between records |
| **SPACE / CONTAINER** | Aggregate / parent role |
| **ENGINE-TOOL** | Collapses into one tool registry |
| **INLET** | Capture/ingestion pipe |
| **VIEW** | Projection (not its own data) |
| **OUTLET** | Publish / export surface |
| **PRIMITIVE** | Presentation component with behavior |
| **INFRA** | Auth, queues, vault, OAuth — stays |
| **GAP** | Constitution needs it; doesn’t exist |
| **RETIRE** | Dead/redundant — drop on purpose |

Every audit row gets **exactly one primary tag** (plus a short mapping note). “Unknown” is not allowed past the first pass — escalate to the user.

---

## 4. Audit procedure

### 4.1 Enumerate (breadth first)

Walk these buckets — miss one and “lossless” is fiction:

1. **Data model** — tables / collections / schemas
2. **Endpoints / RPC / jobs** — every public and cron entry
3. **Engines** — AI functions, recommenders, planners, classifiers
4. **UI surfaces** — routes, dialogs, sheets, admin pages
5. **Primitives** — shared components that *are* behavior
6. **One-offs** — admin repairs, dev seeds, shadow columns

### 4.2 Map each row

For each item write:

- **Destination tag** (§3)
- **Mapping** — one line: how it becomes the new model
- **Confidence** — high / med / ask
- **Phase hint** — invisible reframe vs visible green-field vs scrub

### 4.3 Score the buckets

End the audit with a verdict table:

| Bucket | Approx % | Meaning |
|---|---|---|
| Reframe in place | | Already the model; rename/access-layer |
| Consolidate | | N copies → 1 (engines, dialogs, stores) |
| GAP (net-new) | | Constitution requires; build |
| RETIRE | | Drop on purpose after replacement |

If “rewrite from scratch” still feels necessary after this table, the audit failed or the constitution is wrong — fix those, don’t start a parallel app.

### 4.4 Prove gaps and retires

- **GAP list** — numbered, honest, status-trackable
- **RETIRE list** — each names *what supersedes it* and *which phase deletes it*

**Nothing is dropped by accident.** If you can’t name the destination, it is not ready to delete.

---

## 5. Engine consolidation (special case)

When many overlapping AI/functions exist (Obi: ~14 → ~6 tools):

1. List every function/endpoint that “does AI.”
2. Cluster by **job** (propose / route / consolidate / learn / …) — jobs come from the constitution’s one-engine rule.
3. Target registry = one row per job; old functions become thin callers, then die.
4. UI sprawl follows the same rule (five dialogs → one surface family).

This is usually the highest-leverage consolidate bucket. Pair with `accept-gated-ai` when tools gain write access.

---

## 6. Cross-cutting phase doctrines

Every phase of the roadmap obeys:

1. **Leave it cleaner than you found it** — supersedes deleted, not commented out.
2. **No parallel surfaces** — extend or replace in place; never a second way “temporarily.”
3. **Lossless or it doesn’t ship** — RETIRE only after destination live + zero callers.
4. **Ship platforms together** — if multi-surface, same phase lands both (or explicitly sequence with a parity contract — see `behavior-contracts`).
5. **Land on canonical main often** — owner tests there.
6. **Invisible before visible** — reframe/consolidate phases change no pixels when possible; if a “reframe” changes behavior, scope is wrong.
7. **Accept-gated for agent writes** — optimistic local UX ≠ silent AI authorship (`accept-gated-ai`).

---

## 7. Roadmap shape

Derive phases from the audit buckets — do not invent phases from vibes.

Typical sequence (adapt counts):

| Order | Theme | Visible? | Job |
|---|---|---|---|
| 0 | Clear the brush | no | Dead weight + wire the three docs |
| 1 | Access / model layer | no | Speak the new model internally |
| 2 | Consolidate engines | no | N → few tools; delete duplicates |
| 3 | Green-field loop | **yes** | Build GAP core surfaces |
| 4 | Re-point outlet / ingestion / contracts | yes | Align remaining systems |
| 5 | Converge & scrub | no | Physical schema lean; final deletes |

**Sequencing logic:** de-risk with invisible unify → build visible net-new on clean base → align edges → scrub physical leftovers.

Linear milestones = these phases 1:1 (`linear-setup`).

---

## 8. Anti-patterns

| Symptom | Why it’s bad | Fix |
|---|---|---|
| Rewrite repo before audit | Loss is invisible until users scream | §4 first |
| RETIRE “to clean up” mid-phase | Orphans behavior | Destination live + zero callers |
| Parallel “new app” + old app | Two sources of truth | Reframe-in-place (§0) |
| Comment-out graveyard | Tree lies about what’s live | Delete when phase done (§6.1) |
| Visible changes in “invisible” phase | Scope wrong; burns trust | Split phase |
| Roadmap without GAP/RETIRE lists | Can’t prove lossless | §4.4 |
| Engine sprawl renamed not collapsed | Same disease, new labels | §5 |
| Audit that maps only tables | Misses engines/UI/one-offs | §4.1 buckets |

---

## 9. Readiness rubric

Score 0 / 1 / 2. Max 16. **≥12 and no load-bearing 0 on #1–#5** = ready to execute roadmap.

| # | Dimension | 2 = |
|---|---|---|
| 1 | Constitution exists | Destinations have a model to map to |
| 2 | Full inventory buckets | Data + endpoints + engines + UI + primitives + one-offs |
| 3 | Every row tagged | No “unknown” left unasked |
| 4 | GAP list explicit | Numbered net-new with status |
| 5 | RETIRE list explicit | Each names supersede + phase |
| 6 | Verdict buckets % | Reframe/consolidate/GAP/RETIRE stated |
| 7 | Roadmap phases derive from audit | Invisible→visible→scrub |
| 8 | Phase doctrines written | Cleaner / no parallel / lossless / platforms |

---

## 10. Dogfood protocol

1. Prefer a target **other than** the extraction source when possible; if only Obi docs are available, score the *methodology’s clarity* against that audit as a worked example (note the limitation).
2. Walk §4 on one real subsystem (even a slice) or re-score a published audit with §9.
3. Log friction in EXAMPLES.md same day.
4. v1 exit: one full audit authored with this pack + one phase executed without silent drops.

---

## 11. Open gaps

- [ ] Machine-checkable “zero callers” script vs honor-system grep
- [x] Template file `shared/inventory-audit.template.md` (legend + empty tables) — 2026-07-21
- [ ] How aggressive to force reframe when leadership wants a green-field rewrite
- [ ] Data backfill / dual-read windows — mention vs full online-migration guide
- [ ] Live Socials tree re-verify when mounted
- [x] Non-Obi authored inventory slice — visual-cursor agent-extract **12/16** (2026-07-21)
- [x] Skills monorepo publish inventory — **14/16** + `docs/inventory-audit.md` (2026-07-21)
- [ ] Full Product roadmap + audit outside Obi family (v1 exit still wants Product depth)---

## 12. Relationship to other skills

- **constitution-first** — required input; destinations are constitution doors.
- **accept-gated-ai** — when consolidated engines write user data.
- **behavior-contracts** — multi-platform parity during/after re-point phases.
- **linear-setup** — milestones mirror roadmap phases 1:1.
- **agent-worktrees** — parallel agents during migration still isolate git trees; does not replace the audit.
