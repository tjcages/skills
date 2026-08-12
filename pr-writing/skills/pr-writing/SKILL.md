---
name: pr-writing
version: 0.1.0
description: >-
  Hard style contract for commit messages, PR titles, and PR descriptions —
  tpope + cbea.ms seven rules, ASD-STE100 Simplified Technical English, and the
  Google developer documentation style guide. Use BEFORE writing any commit
  message, PR title, PR body, `git commit -m`, `gh pr create`, merge/squash
  message, or release note, and when asked to review or rewrite one. NOT for
  code comments, chat replies, or docs pages.
---

# PR writing

Full rules: [METHODOLOGY.md](./METHODOLOGY.md). Before/after: [EXAMPLES.md](./EXAMPLES.md). Chat shape: [RESPONSE.md](./RESPONSE.md).

**These are requirements, not preferences.** A message that breaks one gets rewritten, not shipped.

## Operating order

### 1. Read the diff first

`git diff main...HEAD --stat` then the real hunks. You cannot state *why* from a file list.

### 2. Write the subject (§1)

Under 50 characters. Capitalized. No period. Imperative mood.

Test every subject: **"If applied, this commit will ___."** If the sentence breaks, the subject is wrong.

```
Add retry guard to the token refresh path
```

Banned first words: `Added`, `Adding`, `Adds`, `Fixed`, `Fixes`, `Updated`, `Changes`, `WIP`, `Misc`, `Various`. Banned anywhere in a subject: emoji, ticket IDs, `[tags]`, trailing `.`.

### 3. Blank line, then body wrapped at 72 (§1)

No exceptions — `rebase`, `format-patch`, and `git log` all break without the blank line, and the default pager does not wrap.

### 4. Body says what and why, never how (§2)

The diff already says how. The body says: the problem that existed, why this solution, what you rejected, what it costs.

### 5. Apply the language contract (§3–4)

Every sentence, in commits and PR bodies both:

| Rule | Source | Test |
|---|---|---|
| Active voice, present tense | Google | Who does it? Name them. |
| ≤20 words per instruction, ≤25 per statement | STE | Count it. |
| One instruction per sentence | STE | Two verbs → two sentences. |
| One word, one meaning, everywhere | STE | Same thing, same noun. No synonyms. |
| Keep articles (`the`, `a`) | STE | Telegraph style is a defect. |
| ≤3 words per noun cluster | STE | `user account creation failure` → rewrite. |
| Second person `you`, never `we` | Google | `we refactored` → `this change refactors`. |
| Conditions before instructions | Google | `If X, do Y` — never `Do Y if X`. |
| Sentence case headings, serial commas | Google | — |
| Code font for identifiers, paths, flags | Google | — |
| ISO dates (`2026-08-12`) | Google | Never `08/12/26`. |

Banned words: `simply`, `just`, `easily`, `obviously`, `please`, `leverage`, `utilize`, `in order to`, `various improvements`, `under the hood`, `out of the box`, `low-hanging fruit`. Banned opener: `This PR ...` — do not pre-announce.

### 6. Fill the PR body template (§5)

```markdown
## What changed
<1–3 sentences. Active voice, present tense.>

## Why
<The problem. The reason for this solution. What you rejected.>

## How to verify
1. <One action per step.>
2. <Expected result, stated concretely.>

## Risk
<What breaks if this is wrong. How to roll it back.>

Closes ABC-123
```

Drop a section only when it is genuinely empty, and say so: `Risk: none — docs only.`

### 7. Gate before you push

```bash
bash scripts/pr-lint.sh
```

Exit non-zero → fix the message. Do not run `gh pr create` on a failing message.

## Non-negotiables

1. Never `git commit -m` for a change that needs a body. Use a message file or a heredoc.
2. The PR title obeys the subject rules exactly — 50 characters, imperative, no period.
3. A squash-merge message is a commit message. Same rules.
4. Never let a template heading survive with placeholder text under it.
5. If you cannot state the *why*, you do not understand the change yet. Go read the diff again.
