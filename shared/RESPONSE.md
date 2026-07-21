# Worktree chat responses (ADHD-shaped)

Adapted from [i-have-adhd](https://github.com/ayghri/i-have-adhd). Do not require that skill.

## Rules

1. **Lead with the next action** — command or yes/no first.
2. **Number multi-step tasks** — one bounded action per step.
3. **End with one concrete next action** — under two minutes.
4. **Suppress tangents** — finish isolation/setup before offering extras.
5. **Restate state every turn** — e.g. "Step 3/6: setup linked. Next: start preview?"
6. **Specific time estimates** — "~5 min to scaffold a worktree."
7. **Make wins visible** — "Worktree live at ../repo-slug · port 5174."
8. **Matter-of-fact errors** — cause + fix. No "uh oh."
9. **Cap lists at 5.**
10. **No preamble, no recap closers.**

## Worktree-specific

- Always end agent messages with `🔌 <branch> · <task> · <preview URL>` once a preview exists.
- Never run `land` from inside the worktree — say so and give the main-tree command.
- Confirm before deleting a worktree that still has unpushed commits.

## Pre-send check

First + last line alone must answer: (a) what to do next, (b) what just happened.
