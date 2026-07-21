# Accept-Gated AI Methodology

**Version:** 0.2.0 — extracted from Socials/Obi (`docs/manifesto.md` Parts VI, XI, XII + Creed) and the `atom_proposals` / EditProposal substrate; dogfooded against Tasks agent rules (OFF-183 / OFF-174 / OFF-187 / OFF-189) + Obi Phase 3 accept-gated path (inventory/roadmap), 2026-07-21

> **What this is.** How to make **write-access AI** trustworthy — the doctrine that every AI mutation is proposed, diffed, accept-gated, reversible, proportional, and allowed to be a no-op.
>
> **The differentiator.** Most “AI agent” guidance teaches *how to call tools*. What’s missing is the *trust contract*: when AI may write, what must be visible before apply, how undo works, and when silence is the correct answer. Linear MCP / tool registries already cover mechanics. This pack owns the creed.
>
> **Target user.** Anyone shipping a product where an agent can mutate user data (tasks, notes, CRM, inbox, docs) and trust would collapse if those writes were silent.

---

## 0. Core thesis

**Write-access AI is only trustworthy if every edit is:**

1. **Diffed** — the change is visible as before → after (per field when possible)
2. **Accept-gated** — nothing lands in the user’s source of truth until they accept (or an explicitly declared exception applies — §5)
3. **Reversible** — accept still leaves a changelog / undo path; dismiss leaves the original untouched
4. **Proportional** — a one-sentence input never returns a ten-paragraph rewrite
5. **Willing to do nothing** — silence is a valid, correct output; busywork is a bug

Obi’s Creed line 6 is the load-bearing law: *every edit is accept-gated, diffed, and reversible, with the original preserved. The reservoir is never silently rewritten.*

A brain (or task list) that rewrites itself overnight without asking is worse than no brain.

---

## 1. Step zero — does this product even need write-access AI?

| Signal | Move |
|---|---|
| Agent only answers / cites (read-only) | Skip this pack. Say so. |
| Agent creates or mutates user-owned records | This pack applies. |
| “Helpful” background enrichment already writes fields silently | Audit as a **gate leak** (§5, §8) — do not normalize it. |
| Product is lovable with AI off (Creed #9) | Keep that true. Accept-gating is a superpower layer, not the load-bearing wall. |

If the product has no agent writes and none planned, stop. Do not invent an accept-gate for a read-only chatbot.

---

## 2. The five laws (operating creed)

Steal the spirit of Obi Parts VI + XII; adapt vocabulary to the product.

| # | Law | Failure mode if broken |
|---|---|---|
| 1 | **Always ask** | Silent rewrite → user stops trusting the store |
| 2 | **Show the diff** | Blind accept → rubber-stamping → same as silent |
| 3 | **Preserve the original** | Accept/dismiss both need a recoverable before-state |
| 4 | **Stay proportional + quiet** | Over-eager AI manufactures work; noise kills triage |
| 5 | **Undo after accept** | Gate alone is not enough once applied — mutations stay reversible |

**Quiet** (Part VI) is not optional flavor:

- Fine recommending **nothing**
- Come in **small** unless asked for more
- Err to **caution over confidence** (“not enough context” beats a wrong write)
- Do **not** manufacture busywork from already-tracked state

**Rethought, not reorganized** (Creed #7): overnight / batch AI *develops thinking in the user’s voice*; it does not move furniture or inflate a sentence into an essay.

---

## 3. Proposal substrate (the pattern to implement)

Obi’s reference shape (`atom_proposals` / EditProposal) generalizes:

```
propose → pending → accepted | dismissed
              ↑
         per-field diff + why
         stale detection
         editedBy: "ai" on apply
```

### 3.1 Required fields of a proposal

| Field | Job |
|---|---|
| **Target id** | What record would change (or a typed “create” shape — see §3.4) |
| **Edits** | Per-field `{ field, before, after }` — not a blob rewrite when fields exist |
| **Why** | One short reason the agent proposed this (scannable in triage) |
| **Status** | `pending` / `accepted` / `dismissed` |
| **Provenance** | What input triggered it (source message, email id, overnight pass, user ask) |
| **Dedupe key** | Stops the next pass from re-proposing the same suggestion with new wording |

### 3.2 Accept / dismiss semantics

- **Accept** — apply the diff; refuse if the `before` no longer matches (stale → 409 / conflict with the fields that moved). Stamp changelog `editedBy: "ai"` (or product equivalent).
- **Dismiss** — leave the record untouched; feed the dedupe set so it doesn’t come back tomorrow.
- **Never** apply on propose. Propose is a write to the *proposal* table, not to the user’s source of truth.

### 3.3 UI contract (minimum)

A proposal the user cannot *see as a change* is not accept-gated — it’s a dark pattern.

Minimum affordances (Tasks OFF-189 shape):

1. Visible **AI-origin marker** that survives scroll/search
2. **Source / why** affordance (tap → originating context)
3. **One-tap dismiss**
4. Optional **confidence / volume control** so triage stays tunable

### 3.4 Create vs edit

Obi’s early substrate gated **edits** to existing atoms (`proposeAtomEdit`). **Creates** (new posts / opportunities / suggested to-dos) need the same lifecycle — a “create proposal” is still a pending object with provenance + dismiss, not a silent insert into the primary list.

If the product already has two stores (edit-proposals vs new-thing opportunities), union them in one inbox (`listProposals` pattern). Do not make the user learn two triage systems.

### 3.5 Conflict UX (beyond HTTP 409)

Stale refuse is necessary but not sufficient. When accept fails because `before` drifted:

1. **Show the three-way state** — proposed-after · current-now · original-before (at least current vs proposed).
2. **Offer re-base, not blind force** — “Update proposal to current” (recompute diff) or “Dismiss.” Never “Overwrite anyway” as the default.
3. **Multi-device** — proposals are server rows; clients subscribe/refetch. Local optimistic accept must reconcile to server refuse. Last-write-wins on the *proposal status* only after a successful apply; the source-of-truth record stays conflict-checked.
4. **Partial multi-field** — if one field conflicts and others don’t, accept the clean fields only when the product can say so out loud; otherwise refuse the whole proposal (safer default).

### 3.6 Confidence & volume

Two knobs, different owners:

| Knob | Owner | Job |
|---|---|---|
| **Model confidence** | Agent / scoring | Rank or suppress low-signal proposals before they hit the inbox |
| **User volume threshold** | Settings | Cap how many proposals surface per day / per pass |

Rules:

- Confidence never bypasses the accept-gate.
- Below threshold → **don’t propose** (willing to do nothing), don’t silently apply.
- User threshold defaults conservative; raising it is opt-in.
- Log suppressions for audit, not for guilt-tripping the user.

---

## 4. Agent tool registry rules (CRUD with a gate)

When the agent gets verbs beyond “answer,” treat the registry as a **trust surface**:

| Verb class | Default posture |
|---|---|
| Read / cite | Free |
| Create (user-initiated, explicit ask) | May apply immediately **if** undo is mandatory and visible (§6) |
| Create (agent-initiated / proactive) | Proposal / suggestion lane — not the primary list |
| Update existing user content | **Propose + diff**, except §4.1 interactive apply |
| Delete / archive | Blocked until undo exists; prefer propose or confirm |
| Batch / overnight | Always proposals; quiet-by-default; proportional |

**Owner rule from Tasks (OFF-183):** full CRUD is allowed only when each mutation threads a real undo path, and multi-action turns are first-class (not a single nullable `action` field that drops half the verbs on the floor).

**Never ship delete to the agent before delete is reversible** (OFF-174 prerequisite pattern).

### 4.1 Interactive apply rule (chat / voice)

**Hard rule.** Apply+undo *without* a proposal card is allowed only when **all** of these are true:

1. **User-explicit this turn** — the user asked for this exact mutation (“rename X to Y”, “mark milk done”, “add buy eggs”), not a vague “clean this up.”
2. **Narrow scope** — ≤3 fields on ≤5 records; no overnight/batch; no “fix everything.”
3. **Undo armed** — the mutation path offers undo from itself (§6) before the turn ends.
4. **Authored content respect** — if rewriting user prose beyond a surgical replace they dictated, use a proposal + diff instead.
5. **Confirm when ambiguous** — if target match is unclear (two tasks named “milk”), ask; do not guess-apply.

Otherwise: **propose**. Proactive, overnight, multi-record “improvements,” and any delete stay gated or confirmed.

Install this rule into product agent instructions via the [agent-trust template](./agent-trust.template.md).

---

## 5. Declared exceptions (gate leaks you must name)

Some products write AI fields without a human accept — e.g. Obi’s `categorizeItem` overwriting `kind` / `aiSummary` / `aiTags` / inferred `projectId`. That tension is real (called out in OFF-187).

Rules for exceptions:

1. **Name them in the manifesto / agent rules** — silent enrichment is not “also fine.”
2. Restrict exceptions to **derived annotations** the user does not treat as their words (tags, embeddings, routing guesses) — never body/title the user authored.
3. Prefer **soft** derived fields: displayable as “Obi thinks…” and easy to override.
4. If an exception starts shaping what the user *believes is true* in the primary list, **promote it to a proposal**.
5. Re-audit exceptions at every phase boundary (§9).

An unnamed exception is a methodology failure, not an implementation detail.

---

## 6. Reversibility (undo is part of the gate)

Accept-gate without undo is a half-door.

| Layer | Requirement |
|---|---|
| **Pre-accept** | Dismiss = no-op on source of truth |
| **On accept** | Changelog entry with before-state |
| **Post-accept UX** | Toast / shake / ⌘Z — undo offered **from the mutation itself**, so every caller (UI, Siri, agent) is covered (OFF-174 pattern) |
| **Machine writes** | `withoutUndoToasts` (or equivalent) only for writes the user never asked for (e.g. recurring materialization) — and those writes still must not corrupt authorship |

**Rule:** if the agent can do it, the user can undo it in ≤1 gesture for a short window, and via history afterward.

---

## 7. Proportionality & “willing to do nothing”

Operational checks before an agent emits writes/proposals:

1. Did the user ask for this class of change?
2. Is the smallest useful diff a **no-op**? Prefer no-op.
3. Is the output sized to the input? (one line in → one line out)
4. Would applying this create busywork from already-settled state?
5. If context is thin: ask or abstain — do not invent confidence.

Overnight / batch passes (Obi’s rethink): **quiet-by-default**; output = accept-gated proposals into a morning inbox, never direct reservoir mutation (OFF-36 pattern).

---

## 8. Anti-patterns

| Symptom | Why it’s bad | Fix |
|---|---|---|
| Silent field overwrite on user content | Reservoir becomes untrustworthy | Propose + diff (§3) |
| “Accept” with no visible diff | Rubber-stamp = silent write | Per-field before/after UI |
| Agent delete before undo exists | Irreversible AI damage | Block verb until OFF-174-class undo ships |
| Proactive creates land in the primary list | List fills with rows you didn’t write → silent distrust (OFF-189) | Suggestion lane + dismiss + provenance |
| Duplicate proposals next day | Triage fatigue | Dedupe key + spent-source set |
| Stale accept applies anyway | Clobbers user edits | Refuse when `before` ≠ current |
| Over-eager overnight rewrite | Creed #7 violation | Proportional rethink → proposals only |
| Unnamed enrichment exceptions | Doctrine decays | §5 — declare or gate |
| Read-only chatbot forced through this pack | Ceremony without value | §1 skip |
| Force-overwrite on stale accept | Clobbers concurrent human edits | §3.5 re-base or dismiss |
| Confidence used to skip the gate | High score ≠ consent | §3.6 |

---

## 9. Audit protocol (dogfood / drift)

Use this on any AI-write path (product code **or** agent-rules doc):

1. **Enumerate write sites** — every code path or tool verb that mutates user-owned data.
2. **Classify each** — gated proposal / user-explicit apply+undo / declared exception / **leak**.
3. **Score §10.** Leaks are zeros on load-bearing dimensions.
4. **File gaps** as issues (search-before-create). Do not silently “fix” product code in this skill’s name — this pack authors *methodology* and audit findings.
5. Log friction in [EXAMPLES.md](./EXAMPLES.md) same day; fold durable fixes back into this doc.

Cadence: when adding agent verbs, before enabling overnight passes, and at phase/milestone boundaries.

---

## 10. Readiness rubric

Score 0 / 1 / 2. Max 16. **≥12 and no load-bearing 0 on #1–#5** = accept-gate-ready for write-access AI.

| # | Dimension | 2 = |
|---|---|---|
| 1 | Thesis stated in-repo | Creed / agent rules quote the five laws (§2) |
| 2 | Proposal substrate exists | Pending → accept/dismiss with per-field diff |
| 3 | Diff visible in UI | User sees before/after before apply |
| 4 | Stale / conflict handling | Accept refuses drifted `before` |
| 5 | Undo / changelog after apply | Mutations reversible; AI edits stamped |
| 6 | Quiet + proportional | No-op allowed; batch is proposal-only |
| 7 | Create vs edit lanes clear | Proactive creates don’t silently fill primary list |
| 8 | Exceptions declared | Enrichment leaks named or eliminated (§5) |

---

## 11. Dogfood protocol

1. Prefer a target that is **not** only the extraction source: audit Socials’ live AI-write path **or** draft/score against Tasks agent rules (KICKOFF allows either).
2. Walk §9 by hand. Score §10. Log in EXAMPLES.md same day.
3. Second dogfood (v1 exit): one Product with overnight proposals, one Tool/agent with interactive CRUD+undo.

**Exit criteria for v1:** two dogfoods, rubric usable without undocumented judgment, clear handoff note to product manifesto (`manifesto` owns where the creed lives; this pack owns the write-trust chapter).

---

## 12. Open gaps

- [x] Template: `shared/agent-trust.template.md` — install into `docs/agent-trust.md` or fold creed lines into North Star (v0.2)
- [x] Interactive apply hard rule — §4.1 (v0.2)
- [x] Conflict UX beyond 409 — §3.5 (v0.2)
- [x] Confidence vs volume thresholds — §3.6 (v0.2)
- [x] Coding-agent boundary — §13 (v0.2): product data writes here; repo/file agents stay on `agent-worktrees` + human PR review
- [ ] Live Socials checkout — re-verify EditProposal UI pixels + every direct AI write in `atom.server.ts` when tree is mounted
- [x] Independent Tool dogfood outside Obi/Tasks — visual-cursor apply+undo scored **10/16** (zeros on #3/#4) — 2026-07-21
- [ ] Second independent **Product** dogfood outside Obi/Tasks family (v1 exit still needs Product, not only Tool)
- [ ] Partial multi-field accept — product examples beyond “refuse whole proposal”
- [x] Coding-agent “apply + undo” vs proposal accept — named in EXAMPLES; keep §13 boundary

---

## 13. Relationship to other skills

- **manifesto** — owns where the creed / decision checklist lives. This pack *fills* the “agent rules / accept-gated?” chapter; use [agent-trust.template.md](./agent-trust.template.md) as the installable slice.
- **linear-methodology** — track the gaps the audit files; does not define trust doctrine.
- **behavior-contracts** — platform parity for how accept/diff/undo *feel* on iOS vs web.
- **lossless-migration** — when re-pointing old AI engines into one registry, inventory every write site first.
- **agent-worktrees** — parallel **coding** agents on a git repo. Orthogonal: worktree isolation ≠ product accept-gate. Coding agents still need human review (PR/diff) before landing shared `main`; do not stretch this pack’s proposal tables onto source files unless the product *is* a document store.
- **visual-cursor-shaped tools** — interactive **apply + undo** (auto-land + ⌘Z) scores well on undo/proportionality and poorly on pre-land diff + stale refusal. Count as Tool dogfood; do not treat as Product accept-gate pass.
