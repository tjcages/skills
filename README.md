# Skills

Monorepo of **methodology-first Agent Skills** — extracted from real builds (especially Socials/Obi), dogfooded, then packaged.

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
| [`agent-worktrees/`](./agent-worktrees) | ✅ v1 | 1.0.0 | Skills install 12/12. Keyframe applied locally; **push 403** — run `dogfood/PUSH-keyframe.sh` |
| [`constitution-first/`](./constitution-first) | 🧪 Solid Tool · 🔁 Product discovery | v0.1 | keyframe 12/14; `obi` Product 3/14 (needs owner answers) |
| [`accept-gated-ai/`](./accept-gated-ai) | 🔁 Tool solid · Product thin | v0.2 | Tasks 9/16 · Obi docs 14/16 · visual-cursor 10/16 |
| [`lossless-migration/`](./lossless-migration) | 🔁 Thin→Solid mix | v0.1 | Obi 16/16 · visual-cursor slice 12/16 |
| [`behavior-contracts/`](./behavior-contracts) | 🔁 Thin→Solid mix | v0.1 | Issues 8/16 · visual-cursor contracts draft 10/16 |

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
