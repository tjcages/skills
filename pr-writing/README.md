# PR writing

**One style contract for everything git carries as prose.** Commit subjects, commit bodies, PR titles, PR descriptions, squash messages, release notes.

Merges four sources and treats all of them as hard requirements:

- Tim Pope, [A Note About Git Commit Messages](https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html) — the 50/72 shape and why the tooling needs it.
- Chris Beams, [How to Write a Git Commit Message](https://cbea.ms/git-commit/) — the seven rules.
- **ASD-STE100** Simplified Technical English — sentence construction that cannot be misread.
- **Google developer documentation style guide** — voice, person, tense, formatting.

The git essays fix the shape of a message and say nothing about the sentences inside it. STE fixes the sentences. Google fixes voice. This pack is the union, plus a linter.

## Status

**v0.1.0 — ✍️ Draft.** Linter smoke-tested; no rubric dogfood yet. Not published to skills.sh.

## Skills

| Skill | Job |
|-------|-----|
| `pr-writing` | Write or review any commit message, PR title, or PR body |

## The rules, compressed

Subject: ≤50 chars · capitalized · no period · imperative (`If applied, this commit will ___`). Blank line. Body wrapped at 72, explaining **what and why, never how**. Active voice, present tense, ≤20 words per instruction, articles kept, noun clusters ≤3 words, `you` not `we`, conditions before instructions, no `simply` / `just` / `leverage` / `This PR ...`.

Full contract: [`shared/METHODOLOGY.md`](./shared/METHODOLOGY.md). Before/after: [`shared/EXAMPLES.md`](./shared/EXAMPLES.md).

## Lint

```bash
bash pr-writing/scripts/pr-lint.sh          # lint HEAD's message
bash pr-writing/scripts/pr-lint.sh msg.txt  # lint a draft
```

Optional commit-msg hook:

```bash
ln -sf ../../pr-writing/scripts/pr-lint.sh .git/hooks/commit-msg
```

## Install (local, while drafting)

```bash
ln -sfn "$(pwd)/pr-writing/skills/pr-writing" ~/.claude/skills/pr-writing
```

One link is enough. The shared docs are checked in as relative symlinks inside `skills/pr-writing/`, so they follow the skill wherever you link it.

## License

MIT (intended; LICENSE pending first publish)
