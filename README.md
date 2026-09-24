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
| [`ea/`](./ea) | Supervised early access | 0.2.1 | [skills.sh](https://skills.sh/tjcages/skills/ea) · [offbr.co](https://offbr.co/skills/ea) |
| [`linear-methodology/`](./linear-methodology) | 🚀 Published | 1.0.2 | [GitHub](./linear-methodology) · [skills.sh](https://skills.sh/tjcages/skills/linear-methodology) · [offbr.co](https://offbr.co/skills/linear-methodology) |
| [`constitution-first/`](./constitution-first) | 🧪 Solid (Tool only) | v0.1 | keyframe north-star wrote (may be local-only on remote); needs Product-shaped 🔁 |
| [`accept-gated-ai/`](./accept-gated-ai) | 🧪 Thin→Solid mix | v0.2 | Tasks 9/16 + Obi docs 14/16; 🧱 live Socials UI |
| [`lossless-migration/`](./lossless-migration) | 🧪 Thin (source docs) | v0.1 | Obi audit re-score 16/16; needs non-Obi 🔁 |
| [`behavior-contracts/`](./behavior-contracts) | 🧪 Thin (issue evidence) | v0.1 | 8/16; needs live kit paths / in-repo contracts doc |
| [`orchestrator/`](./orchestrator) | 🧪 Dogfood 1 | v0.2 candidate | Connect 8/11; hardened ledger needs one passing rerun + independent second dogfood |
| [`pr-writing/`](./pr-writing) | 🚀 Published | 1.0.0 | [GitHub](./pr-writing) · [skills.sh](https://skills.sh/tjcages/skills/pr-writing) · [offbr.co](https://offbr.co/skills/pr-writing) |
| [`progress-check/`](./progress-check) | 🚀 Published | 1.0.1 | [GitHub](./progress-check) · [skills.sh](https://skills.sh/tjcages/skills/progress-check) · [offbr.co](https://offbr.co/skills/progress-check) |
| [`wip-frames/`](./wip-frames) | 🧪 Thin dogfood | v0.2.0 | Approval boards: dotted mat, 1 desktop or 3 mobiles, iOS 18 kit status bar. Theme tokens for project tint. |
| [`video-editor/`](./video-editor) | ✍️ Draft | v0.4.0 | Focused demos and product launches, Remotion starter, packaged sound editor, and MP4 export. |
| [`apple-native/`](./apple-native) | Public preview | 0.1.0 | Lightweight native iOS skill · [Catalogue](https://native.offbr.co) |

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

Team **Off-brand**. Each pack is its own `Tool` project. Do not file on [extracted-skills](https://linear.app/off-brand-studio/project/extracted-skills-4d7c79e03387) (Completed).

- [Linear](https://linear.app/off-brand-studio/project/linear-9633010d001a)
- [Orchestrator](https://linear.app/off-brand-studio/project/orchestrator-e850288469eb)
- [PR Writing](https://linear.app/off-brand-studio/project/pr-writing-add8062c9094)

## Cloud kickoff

See [`KICKOFF.md`](./KICKOFF.md).
