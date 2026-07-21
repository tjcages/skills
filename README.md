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
| [`agent-worktrees/`](./agent-worktrees) | ✅ v1 | 1.0.0 | Installed on skills monorepo (12/12). Keyframe patch ready (bot 403). Not 🚀 skills.sh yet |
| [`constitution-first/`](./constitution-first) | 🧪 Solid (Tool only) | v0.1 | keyframe north-star wrote (may be local-only on remote); needs Product-shaped 🔁 |
| [`accept-gated-ai/`](./accept-gated-ai) | 🧪 Thin→Solid mix | v0.2 | Tasks 9/16 + Obi docs 14/16; 🧱 live Socials UI |
| [`lossless-migration/`](./lossless-migration) | 🧪 Thin (source docs) | v0.1 | Obi audit re-score 16/16; needs non-Obi 🔁 |
| [`behavior-contracts/`](./behavior-contracts) | 🧪 Thin (issue evidence) | v0.1 | 8/16; needs live kit paths / in-repo contracts doc |

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
