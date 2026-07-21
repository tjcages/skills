# Agent trust (accept-gated writes)

> Paste into `docs/agent-trust.md` (or fold into the product North Star’s agent chapter).
> Generated from the `accept-gated-ai` skill pack. Adapt product names; keep the laws.

## Five laws

1. **Diffed** — show before → after (per field when possible).
2. **Accept-gated** — user-owned source of truth does not change until accept, except § Interactive apply.
3. **Original preserved** — dismiss is a no-op; accept leaves changelog.
4. **Proportional + quiet** — sized to the ask; silence is valid.
5. **Undo after accept** — every agent mutation is reversible.

## Write-site classes

| Class | When | Behavior |
|---|---|---|
| **Gated proposal** | Proactive, overnight, ambiguous, multi-record, deletes without confirm | `pending → accepted \| dismissed` + diff + why + provenance + dedupe |
| **Interactive apply** | User-explicit this turn, narrow scope, undo armed | Apply now + undo toast / history |
| **Declared exception** | Named derived annotations only (tags, embeddings, routing guesses) | Listed below; never user prose |
| **Leak** | Anything else that writes silently | Bug — gate or declare |

## Interactive apply (all must be true)

1. User asked for this exact mutation this turn.
2. ≤3 fields on ≤5 records; not batch/overnight.
3. Undo armed on the mutation path.
4. Not rewriting user prose beyond what they dictated.
5. Target unambiguous (else ask).

## Declared exceptions

<!-- List each silent AI write. Empty list is ideal. -->

| Field / path | Why ungated | Review cadence |
|---|---|---|
| _e.g. aiTags_ | Derived annotation; shown as “AI thinks…” | Phase boundary |

## Inbox / UI minimum

- AI-origin marker · source/why · one-tap dismiss · optional volume threshold
- Stale accept → show conflict → re-base or dismiss (never default force-overwrite)

## Decision checklist (before shipping an agent verb)

1. Which write-site class is this?
2. Is undo available for every caller (UI, voice, agent)?
3. Does proactive output land in a suggestion lane — not the primary list?
4. Are exceptions still accurate?
5. Would doing **nothing** be more correct today?
