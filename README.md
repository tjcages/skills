# Skills

Monorepo of **methodology-first Agent Skills** — extracted from real builds (especially Socials/Obi), dogfooded, then packaged.

Each folder is one **pack** (router skill + methodology + shared docs), same shape as `linear-methodology`.

## Packs

| Pack | Status | Job |
|------|--------|-----|
| [`linear-methodology/`](./linear-methodology) | Shipped | How to track projects in Linear well |
| [`agent-worktrees/`](./agent-worktrees) | v0.1 dogfood | Parallel AI agents on one git repo |
| [`constitution-first/`](./constitution-first) | v0.1 dogfood | Author/govern a product North Star |
| [`accept-gated-ai/`](./accept-gated-ai) | Stub — **next** | Write-access AI must be accept-gated |
| [`lossless-migration/`](./lossless-migration) | Stub | Inventory before rewrite; zero loss |
| [`behavior-contracts/`](./behavior-contracts) | Stub | Cross-platform parity via behavior contracts |

## Pack shape (every folder)

```
<pack>/
  README.md
  shared/           # METHODOLOGY.md, RESPONSE.md, EXAMPLES.md, …
  skills/<name>/    # SKILL.md (+ symlinks to shared)
  scripts/          # optional
```

Mirror `linear-methodology/` when in doubt.

## Linear

Team **Off-brand** · project **[extracted-skills](https://linear.app/off-brand-studio/project/extracted-skills-4d7c79e03387)**

## Cloud kickoff

See [`KICKOFF.md`](./KICKOFF.md).
