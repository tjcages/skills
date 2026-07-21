# Skills

Monorepo of **methodology-first Agent Skills** — extracted from real builds (especially Socials/Obi), dogfooded, then packaged.

Each folder is one **pack** (router skill + methodology + shared docs), same shape as `linear-methodology`.

## Lifecycle (read this)

| Phase | Meaning |
|-------|---------|
| 📝 Stub | Folder exists, thesis only |
| ✍️ Draft | METHODOLOGY + SKILL written |
| 🧪 Dogfood | Scored against a real target; friction in EXAMPLES |
| 🔁 2nd dogfood | Different repo than extraction source (required for **v1**) |
| ✅ v1 | Two dogfoods + rubric usable without undocumented judgment |
| 🚀 Published | skills.sh / install paths announced |

**Right now we are mostly in ✍️/🧪 — not ✅ v1 and not 🚀.** Thin dogfood (docs / Linear mirrors) counts for v0.x learning, not for calling a pack done.

## Packs

| Pack | Phase | Version | What's missing for v1 |
|------|-------|---------|------------------------|
| [`linear-methodology/`](./linear-methodology) | 🚀 | 1.x shipped | — |
| [`agent-worktrees/`](./agent-worktrees) | 🧪 | v0.1 | 2nd stack dogfood; OFF-256 still open |
| [`constitution-first/`](./constitution-first) | 🧪 | v0.1 | 2nd Product-shaped dogfood (keyframe was Tool) |
| [`accept-gated-ai/`](./accept-gated-ai) | 🧪 | v0.2 | Live Socials UI audit; Tasks still 9/16 |
| [`lossless-migration/`](./lossless-migration) | 🧪 | v0.1 | Fresh audit on a *non-Obi* repo |
| [`behavior-contracts/`](./behavior-contracts) | 🧪 | v0.1 | Live kit path audit; install contracts doc in a product |

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
