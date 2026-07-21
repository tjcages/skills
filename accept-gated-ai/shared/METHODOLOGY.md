# Accept-Gated AI Methodology

**Version:** 0.1.0 — extracted from Socials/Obi (`docs/manifesto.md` Parts VI, XI, XII + Creed) and the `atom_proposals` / EditProposal substrate; dogfooded against Tasks agent rules (OFF-183 / OFF-174 / OFF-187 / OFF-189), 2026-07-21

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

---

## 4. Agent tool registry rules (CRUD with a gate)

When the agent gets verbs beyond “answer,” treat the registry as a **trust surface**:

| Verb class | Default posture |
|---|---|
| Read / cite | Free |
| Create (user-initiated, explicit ask) | May apply immediately **if** undo is mandatory and visible (§6) |
| Create (agent-initiated / proactive) | Proposal / suggestion lane — not the primary list |
| Update existing user content | **Propose + diff** unless user is mid-turn and confirming an explicit edit request |
| Delete / archive | Blocked until undo exists; prefer propose or confirm |
| Batch / overnight | Always proposals; quiet-by-default; proportional |

**Owner rule from Tasks (OFF-183):** full CRUD is allowed only when each mutation threads a real undo path, and multi-action turns are first-class (not a single nullable `action` field that drops half the verbs on the floor).

**Never ship delete to the agent before delete is reversible** (OFF-174 prerequisite pattern).

---

## 5. Declared exceptions (gate leaks you must name)

Some products write AI fields without a human accept — e.g. Obi’s `categorizeItem` overwriting `kind` / `aiSummary` / `aiTags` / inferred `projectId`. That tension is real (called out in OFF-187).

Rules for exceptions:

1. **Name them in the constitution / agent rules** — silent enrichment is not “also fine.”
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

**Exit criteria for v1:** two dogfoods, rubric usable without undocumented judgment, clear handoff note to product constitution (`constitution-first` owns where the creed lives; this pack owns the write-trust chapter).

---

## 12. Open gaps

- [ ] Template: `docs/agent-trust.md` stub vs creed lines inline in North Star
- [ ] Hard rule for interactive chat: when is “user just asked to rename X” allowed to apply+undo without a proposal card?
- [ ] Cross-device proposal sync / conflict UX beyond HTTP 409
- [ ] Confidence thresholds — product setting vs model score
- [ ] Relationship to coding-agents (Cursor/Claude) file edits — sibling concern; this pack is **product** write-access AI first
- [ ] Socials source tree not mounted in cloud dogfood env — re-verify §10 against live `atom_proposals` + EditProposal UI when socials is available

---

## 13. Relationship to other skills

- **constitution-first** — owns where the creed / decision checklist lives. This pack *fills* the “agent rules / accept-gated?” chapter.
- **linear-methodology** — track the gaps the audit files; does not define trust doctrine.
- **behavior-contracts** — platform parity for how accept/diff/undo *feel* on iOS vs web.
- **lossless-migration** — when re-pointing old AI engines into one registry, inventory every write site first.
- **agent-worktrees** — parallel coding agents; orthogonal (repo isolation ≠ product accept-gate).
