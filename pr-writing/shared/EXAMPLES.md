# PR writing examples

Every "before" is a real shape you will produce if you skip the skill.

---

## 1. Subject line

| Before | Why it fails | After |
|---|---|---|
| `fixed the bug where users couldnt login sometimes` | lowercase, past tense, 49 chars of vagueness, no cause | `Fix login retry on expired refresh tokens` |
| `Updates to the auth module.` | not imperative, trailing period, names no change | `Move token refresh into the auth client` |
| `WIP` | says nothing, survives forever in history | `Add failing test for the null-session path` |
| `refactor(api): restructure the response serialization layer` | 58 chars, noun cluster of 4 | `Extract response serializer from the API` |
| `🎉 ship the new dashboard!` | emoji, trailing punctuation, breaks `--oneline` alignment | `Add the metrics dashboard route` |
| `Fix flaky auth test race condition handling` | five-word noun cluster wearing a verb | `Fix the race between login and token refresh` |

---

## 2. Full commit message

### Before

```
fixed a bunch of stuff in the queue worker - we noticed it was dropping jobs sometimes so I just added a retry and also cleaned up some of the logging while I was in there. Should be fine now. see ticket
```

Failures: lowercase, past tense, no blank line, single 200-column line, `we`, `just`, "a bunch of stuff", "also" (two changes in one commit), "should be fine" (no verification), unlinked ticket.

### After

```
Retry queue jobs dropped by a closed connection

The worker acknowledged a job before it wrote the result. When the
database connection closed mid-write, the job was gone: acknowledged
upstream, never persisted. Production lost 41 jobs on 2026-08-04.

This change moves the acknowledgement after the write and retries the
write three times with backoff. A retried job is idempotent because the
result table keys on the job ID.

The alternative was an outbox table. It is more correct under a worker
crash, but it needs a migration and a second consumer, and this bug is
losing jobs now. Track the outbox in ABC-461.

Cost: a job that fails all three writes now blocks its partition until
the visibility timeout expires.

Closes ABC-455
```

The logging cleanup became its own commit.

---

## 3. Sentence-level rewrites

| Before | Rule broken | After |
|---|---|---|
| `The event is dropped when the buffer is full.` | passive, no agent | `The consumer drops the event when the buffer is full.` |
| `We should probably leverage the existing cache utility in order to avoid duplicating this logic.` | `we`, `leverage`, `in order to`, hedging, 16 words of padding | `Use the existing cache utility. It already handles eviction.` |
| `Simply run the migration and it will just work.` | `simply`, `just`, no expected result | `Run the migration. The `sessions` table gains a `revoked_at` column.` |
| `Run the migration if you are deploying to staging.` | condition after the instruction | `If you deploy to staging, run the migration first.` |
| `account creation failure notification handler` | 5-word noun cluster | `the handler that notifies on a failed account creation` |
| `Fix race in scheduler` | dropped articles | `Fix the race in the scheduler` |
| `The parser is unhappy with trailing commas.` | anthropomorphism | `The parser rejects trailing commas.` |
| `Stop the worker and drain the queue while watching the lag metric.` | three instructions, 12+ words | `Stop the worker. Drain the queue. Watch the lag metric.` |
| `This was fixed on 08/12/26.` | ambiguous date, passive | `This change fixes it on 2026-08-12.` |

---

## 4. PR body

### Before

```
## Description
This PR does some cleanup of the settings page and also fixes a couple of
bugs we found. Should be pretty straightforward to review!

## Testing
Tested locally, works fine.
```

Failures: pre-announcing, `we`, "some"/"a couple", two unrelated changes, no why, no risk, unverifiable testing claim, no ticket.

### After

```markdown
## What changed
The settings page reads its feature flags from the `flags` context instead
of a per-component fetch. The page now issues one request on mount rather
than seven.

## Why
Each settings section fetched its own flag, so opening the page fired seven
identical requests and the sections rendered in a random order. The context
already existed for the dashboard, so this change reuses it instead of
adding a settings-specific cache.

## How to verify
1. Open `/settings` with the network tab recording.
2. Confirm one request to `/api/flags`, not seven.
3. Toggle **Beta features** off. Every section hides in the same frame.

## Risk
A stale context leaves the whole page on old flags rather than one section.
The context refetches on focus, so the window is one tab-switch wide.
Roll back by reverting this commit; no migration is involved.

Closes ABC-472
```

---

## 5. Branch log that reads as a story

```
$ git log --oneline main..HEAD
a1b2c3d Add failing test for the null-session refresh
e4f5g6h Guard the refresh path against a null session
i7j8k9l Log the guard hit at warn level
m0n1o2p Document the session lifetime in the auth README
```

Compare against the shape to avoid:

```
a1b2c3d wip
e4f5g6h more wip
i7j8k9l fix tests
m0n1o2p address review comments
```
