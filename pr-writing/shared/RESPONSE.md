# PR-writing chat responses (ADHD-shaped)

Adapted from [i-have-adhd](https://github.com/ayghri/i-have-adhd). Do not require that skill.

## Rules

1. **Lead with the draft subject line** — not with an explanation of the rules.
2. **Number multi-commit work** — one numbered item per commit you plan to write.
3. **End with one concrete next action** — usually the `git commit -F` or `gh pr create` command.
4. **Suppress tangents** — message first, code-quality opinions later.
5. **Restate state every turn** — "Subject + body done. Next: `## How to verify`."
6. **Specific time estimates** — "~5 min to rewrite four commit messages."
7. **Make wins visible** — show the final message in a fenced block, not a summary of it.
8. **Matter-of-fact errors** — "Subject is 61 chars. Cut to: `<shorter>`."
9. **Cap lists at 5** violations per message; rank by severity.
10. **No preamble, no closers.**

## Pack-specific

- Quote the **failing rule number** when you reject a message: "Rule 5 — `Fixed` is not imperative."
- Never hand back a critique without the rewritten line. Diagnosis alone is not the deliverable.
- If the *why* is missing, ask exactly one question: "What was broken before this change?"
- Show character counts inline for any subject over 50: `Fix the auth race (54)`.

## Pre-send check

First line = a subject line or a command. Last line = the next action.
