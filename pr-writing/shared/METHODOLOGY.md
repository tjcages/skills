# PR writing methodology

**Version:** 0.1.0 — 2026-08-12

> **What this is.** One enforceable style contract for every piece of prose git carries: commit subjects, commit bodies, PR titles, PR descriptions, squash messages, and release notes.
>
> **Sources, treated as requirements:**
> - Tim Pope, [A Note About Git Commit Messages](https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html) (2008) — the 50/72 format and why the tooling needs it.
> - Chris Beams, [How to Write a Git Commit Message](https://cbea.ms/git-commit/) — the seven rules.
> - **ASD-STE100** Simplified Technical English — controlled sentence construction for readers who are tired, translating, or not native speakers.
> - **Google developer documentation style guide** — voice, person, tense, and formatting.
>
> **Why merge them.** The git essays fix the *shape* of a message and say nothing about the sentences inside it. STE fixes the sentences and says nothing about git. Google fixes voice and formatting. Together they cover the whole artifact.

---

## 0. Core thesis

**A commit message is documentation with the worst possible reading conditions.** It is read years later, by someone bisecting a production incident at 3am, in a terminal, with no author available to ask. Every rule below removes one thing that reader has to decode.

The diff is the *how*. It is already perfect and always current. The message exists for exactly what the diff cannot hold: the problem, the reason, and the rejected alternatives.

---

## 1. Shape — the seven rules

From cbea.ms, with tpope's rationale. All seven are mandatory.

| # | Rule | Why it is not cosmetic |
|---|---|---|
| 1 | Separate subject from body with a blank line | Git treats everything up to the first blank line as the title. `format-patch`, `rebase`, and `shortlog` mis-parse a run-on message. |
| 2 | Limit the subject to 50 characters | Forces you to name one change. GitHub truncates near 72; `--oneline` and rebase todo lists get unreadable past 50. |
| 3 | Capitalize the subject | It is a sentence. Treat it like one. |
| 4 | No period at the end of the subject | It is a title, and the character is not free. |
| 5 | Imperative mood in the subject | Git's own generated messages are imperative: `Merge branch`, `Revert "..."`. Yours must match. |
| 6 | Wrap the body at 72 characters | `git log` indents by 4 and does not wrap. At 72 the body still fits an 80-column terminal with symmetric margins. |
| 7 | Body explains what and why, not how | The code is the how, and the code cannot rot away from itself. The why can only live here. |

### 1.1 The imperative test

Complete this sentence with your subject:

> If applied, this commit will **\_\_\_**.

- `If applied, this commit will add a retry guard to the token refresh path.` ✅
- `If applied, this commit will fixed the login bug.` ❌
- `If applied, this commit will various cleanup.` ❌

### 1.2 Approved subject verbs

`Add` · `Remove` · `Fix` · `Move` · `Rename` · `Update` · `Refactor` · `Revert` · `Extract` · `Inline` · `Replace` · `Split` · `Merge` · `Disable` · `Enable` · `Guard` · `Cache` · `Log` · `Document` · `Test` · `Bump`

Rejected: any `-ed`, `-ing`, or `-s` form. Also `WIP`, `Misc`, `Various`, `Cleanup`, `Changes`, `Stuff`, `Minor`, and bare ticket IDs.

### 1.3 Bullets in the body

Hyphen, one space, blank line between items. Wrap continuation lines at 72 and align them under the text.

```
- Guard the refresh path against a null session. The old code assumed
  a live session because every caller held one, until the webhook
  handler started calling it without one.

- Log the guard hit at warn level so the real fix stays visible.
```

---

## 2. Content — what a body must contain

Answer these, in this order, and stop:

1. **The problem.** What was wrong or missing before this change? State it as fact, in the past-tense-of-record only when describing the old behavior.
2. **The reason for this solution.** Why this shape and not the obvious alternative?
3. **The rejected alternative,** when one exists. One sentence. This is the single highest-value line in most messages.
4. **The cost.** What this makes worse, slower, or harder.
5. **The reference.** Ticket, issue, prior commit SHA.

Never include: a file list (that is `--stat`), a restatement of the diff in English, a changelog of your own working session, or an apology.

### 2.1 The "no why" rule

If you cannot write sentence 1 and sentence 2, the change is not understood or the change is too large. Both are fixed by reading the diff again, not by writing a longer message.

---

## 3. Sentences — ASD-STE100

STE was written so aircraft maintenance manuals could not be misread. The same constraints make a commit body survive a hostile reading.

| Rule | Do | Do not |
|---|---|---|
| One approved meaning per word | `use` | `use`, `utilize`, `leverage`, `employ` for the same act |
| One word per thing | `session` everywhere | `session`, `ctx`, `connection` for one thing |
| ≤20 words per instruction | `Run the migration before you deploy.` | a 40-word chain of clauses |
| ≤25 words per descriptive sentence | — | — |
| One instruction per sentence | `Stop the worker. Then drain the queue.` | `Stop the worker and drain the queue while checking the lag.` |
| Active voice | `The handler drops the event.` | `The event is dropped.` |
| Simple present or simple past | `The cache expires after 60s.` | `The cache will have expired.` |
| Keep the articles | `Fix the race in the scheduler` | `Fix race in scheduler` |
| ≤3 words in a noun cluster | `the handler for account creation failures` | `account creation failure handler config` |
| Verbs for actions, not nouns | `test the parser` | `perform testing of the parser` |
| ≤6 sentences per paragraph, one topic each | — | — |
| Warnings before the step they apply to | `This drops the index. Run the migration.` | `Run the migration. This drops the index.` |
| No idiom, slang, or metaphor | `The lock is held for the whole request.` | `The lock is held under the hood, out of the box.` |

Subject lines inherit these rules. `Fix flaky auth test race condition handling` is a five-word noun cluster wearing a verb.

---

## 4. Voice and format — Google developer documentation style guide

| Rule | Applied to PRs |
|---|---|
| Second person | Address the reviewer as `you`. Never `we`. The change is the actor: `this change adds`, not `we added`. |
| Active voice, agent named | `The scheduler retries the job.` |
| Present tense | Describe the code as it is after the change. |
| Conditions first | `If the token is expired, the client refreshes it.` |
| Sentence case headings | `## How to verify`, never `## How To Verify`. |
| Serial commas | `subject, body, and footer` |
| Code font | Identifiers, paths, flags, commands, and literal values. |
| Descriptive link text | `the retry policy doc`, never `here` or the raw URL. |
| Unambiguous dates | `2026-08-12`. Never `08/12/26`. |
| Do not pre-announce | Delete `This PR will explain ...`. Just explain. |
| Numbered lists for sequences, bullets otherwise | Verification steps are always numbered. |
| No condescension | Delete `simply`, `just`, `easily`, `obviously`, `of course`. |
| No `please` in instructions | `Run the migration first.` |
| No anthropomorphism | `The test fails.` Not `The test is unhappy.` |

---

## 5. The PR body

A PR is one commit message with more room. The title is the subject and obeys §1 exactly.

```markdown
## What changed
<1–3 sentences. Active voice, present tense, second person or the change as actor.>

## Why
<The problem. The reason for this solution. The rejected alternative. The cost.>

## How to verify
1. <One action.>
2. <One action, with the concrete expected result.>

## Risk
<What breaks if this is wrong. The rollback.>

Closes ABC-123
```

Rules:

1. Delete a heading rather than leave it empty, or state the emptiness: `Risk: none — docs only.`
2. Screenshots go under `## What changed`, with alt text.
3. Never let a repo template's placeholder comment survive into the published body.
4. A stacked PR states its base branch in the first line of `## What changed`.
5. Squash-merge messages are commit messages. Rewrite the auto-generated `#123` title into a real subject.

---

## 6. Multi-commit PRs

- Each commit is independently valid under §1–4. `git log --oneline` across the branch reads as an ordered story.
- Never ship `fix review comments`, `address feedback`, or `oops`. Rebase them into the commit they belong to.
- One commit per logical change. If the body needs the word "also", split the commit.

---

## 7. Audit

Run against any existing message:

| Check | Fail condition |
|---|---|
| Subject length | > 50 chars (warn), > 72 (fail) |
| Subject case | first character lowercase |
| Subject punctuation | trailing `.` |
| Subject mood | first word ends `-ed` / `-ing`, or is on the banned list |
| Line 2 | non-empty |
| Body width | any line > 72 chars, excluding code blocks and URLs |
| Banned words | any hit from §4 |
| Why present | body has no sentence answering "why this solution" |

`scripts/pr-lint.sh` enforces the mechanical half. The last row stays human.

---

## 8. Anti-patterns

| Pattern | Why it fails |
|---|---|
| `Update code` | Names nothing. Every commit updates code. |
| `Fixes #123` as the entire subject | The tracker may outlive nothing. The subject must stand alone offline. |
| `feat(auth): add retry` at 80 chars | Conventional Commits is compatible with §1 only when the whole line still fits 50. |
| A body that lists the changed files | `git show --stat` already does it, and stays correct. |
| `Refactor for clarity` | Clarity for whom, and measured how? State the problem. |
| Emoji in the subject | Breaks alignment in `--oneline`, terminals, and email. |
| A wall of text at 200 columns | Unreadable in `git log`. Rule 6 exists for this. |
