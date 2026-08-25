# Progress Check

Sparse, evidence-based progress updates for long-running AI agent work.

## Status

**v0.1.0 — drafting and dogfood.** Not published yet.

## What it changes

- Uses one 20-cell overall progress bar.
- Advances percentages only from verified milestones.
- Limits routine updates to meaningful changes at least 30 minutes apart.
- Reports actionable blockers and completion immediately.
- Works across compatible agents through one global Agent Skills install.

## Install globally

```bash
npx skills add tjcages/skills --skill progress-check -g --agent '*'
```

Install for one agent by replacing `'*'` with its Agent Skills identifier, such
as `codex`, `claude-code`, or `cursor`.

## Example

```text
Performance rollout  [██████████████████░░] 90%
```

## Source

- Method: [`shared/METHODOLOGY.md`](./shared/METHODOLOGY.md)
- Chat shape: [`shared/RESPONSE.md`](./shared/RESPONSE.md)
- Examples: [`shared/EXAMPLES.md`](./shared/EXAMPLES.md)
- Tracking: [Progress Check](https://linear.app/off-brand-studio/project/progress-check-6b74524bd9fe)

## License

[MIT](./LICENSE)
