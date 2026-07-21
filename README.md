# Skills

Monorepo of **methodology-first Agent Skills** — extracted from real builds (especially Socials/Obi), dogfooded, then packaged.

**North Star:** [`docs/north-star.md`](./docs/north-star.md) · **Agent trust:** [`docs/agent-trust.md`](./docs/agent-trust.md) · **Publish inventory:** [`docs/inventory-audit.md`](./docs/inventory-audit.md)

Each folder is one **pack** (router skill + methodology + shared docs), same shape as `linear-methodology`.

## Lifecycle (read this)

| Phase | Meaning |
|-------|---------|
| 📝 Stub | Folder exists, thesis only |
| ✍️ Draft | METHODOLOGY + SKILL written |
| 🧪 Thin dogfood | Scored, but docs/Linear-only or incomplete install |
| 🧪 Solid dogfood | Live repo smoke; rubric near pass; friction folded |
| 🔁 2nd dogfood | Independent non-extraction-source target (required for **v1**) |
| 🧱 Blocked | Waiting on access (e.g. private Socials tree) or product install consent |
| ✅ v1 | Two solid dogfoods + rubric usable cold |
| 🚀 Published | skills.sh / install paths announced |

**v0.x = drafted + first dogfood. Not complete. Not publish-ready.**

## Packs

| Pack | Phase | Version | Detail |
|------|-------|---------|--------|
| [`linear-methodology/`](./linear-methodology) | 🚀 Published | 1.x | Only pack at ship quality |
| [`agent-worktrees/`](./agent-worktrees) | ✅ v1 | 1.0.0 | Skills 12/12; keyframe PR open: [keyframe#1](https://github.com/tjcages/keyframe/pull/1) |
| [`constitution-first/`](./constitution-first) | 🔁 → near ✅ | v0.1 | keyframe 12 · skills 13 · Obi manifesto re-anchor 14 |
| [`accept-gated-ai/`](./accept-gated-ai) | 🔁 | v0.2 | Tasks 9 · Obi 14 · visual-cursor 10 · skills agent-trust installed |
| [`lossless-migration/`](./lossless-migration) | 🔁 | v0.1 | Obi 16 · visual-cursor 12 · skills publish audit 14 |
| [`behavior-contracts/`](./behavior-contracts) | 🔁 | v0.1 | Issues 8 · visual-cursor draft 10 · template shipped |

## Pack shape (every folder)

```
<pack>/
  README.md
  shared/           # METHODOLOGY.md, RESPONSE.md, EXAMPLES.md, templates…
  skills/<name>/    # SKILL.md (+ symlinks to shared)
  scripts/          # optional
```

Mirror `linear-methodology/` when in doubt.

## Linear

Team **Off-brand** · project **[extracted-skills](https://linear.app/off-brand-studio/project/extracted-skills-4d7c79e03387)**

## Cloud kickoff

See [`KICKOFF.md`](./KICKOFF.md).
