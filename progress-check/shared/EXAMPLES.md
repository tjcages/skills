# Progress Check examples

## Useful milestone update

1. The schema migration passed its apply-twice test.
2. API integration is active.
3. Next: verify the deployed read path.

`API rollout  [████████████░░░░░░░░] 60%`

## Actionable blocker

1. Packaging and validation are complete.
2. Publishing is blocked because the registry session is not authenticated.
3. Next: authorize the registry, then rerun the publish command.

`Skill release  [████████████████░░░░] 80%`

## Completion

1. The package is published and installable from both catalog routes.

`Skill release  [████████████████████] 100%`

## Updates to suppress

Do not send any of these when no material state changed:

- “Still working.”
- “The tests are still running.”
- The same percentage and bar as the prior update.
- Separate bars for every subagent or batch.

## Dogfood log

### 2026-08-25 — Codex and Claude Code install

- Targets: clean temporary Codex and Claude Code projects.
- Command: local `npx skills add` with `--copy` and each agent identifier.
- Friction: the first run skipped all shared references because their relative
  symlinks pointed one directory too high.
- Fix: use `../../shared/*.md`, then require installed-reference read checks in
  both target directories before accepting a dogfood run.
- Behavior friction: Codex dropped the requested fence, while Claude added a
  disclaimer after the bar. Fenced blocks exposed renderer chrome, and the
  first four-space-indented fix still produced a copyable code block.
- Fix: require one inline-code progress line as the final content, with one pair
  of backticks, no indentation, no fence, and no text beneath it.
- Result: Codex and Claude Code both loaded the copied skill and ended on the
  correct 12/20, 60% inline-code bar. Cursor's project install also copied the
  complete skill and all three references through its universal `.agents` path.
