# KICKOFF — cloud agent

Read this first. Continue the skill-extraction work. Do not re-discover from scratch.

## Repo

This monorepo: **`skills`** (`/Users/ty/Workspace/skills` locally).

Source of truth for *content inspiration*: `/Users/ty/Workspace/socials` (read-only reference — manifesto, CLAUDE.md, inventory-audit, etc.).

## State (2026-07-21)

**Done**
1. `linear-methodology/` — already shipped pack, moved into this monorepo
2. `agent-worktrees/` — v0.1 methodology + `scripts/worktree.sh`; dogfooded on `visual-cursor` + `socials`
3. `constitution-first/` — v0.1 methodology; dogfooded by writing `keyframe/docs/north-star.md` (rubric 12/14)
<<<<<<< HEAD
4. `accept-gated-ai/` — v0.1 methodology + SKILL + RESPONSE + EXAMPLES; dogfooded against Tasks agent rules (OFF-183/174/187/189) + Linear-mirrored manifesto Parts VI/XI/XII (OFF-266)

**Next (do this now)**
1. **Stop here for pack 3** — wait before `lossless-migration` (owner gate after rubric + open gaps report)
2. Optional polish: live Socials EditProposal UI audit when `socials` checkout is available

**Then**
3. `lossless-migration` ← `socials/docs/inventory-audit.md` + migration-roadmap doctrines
4. `behavior-contracts` ← manifesto Part IX + macos-convergence parity matrix
=======
4. `accept-gated-ai/` — v0.2 on branch `cursor/accept-gated-ai-v01-2b41` (OFF-266/268)
5. `lossless-migration/` — v0.1 methodology; dogfooded by re-scoring Obi inventory audit (16/16) — OFF-269

**Next (do this now)**
1. Optional: live Socials checkout re-verify for packs 3–4
2. **Pack 5: `behavior-contracts`** ← manifesto Part IX + macos-convergence parity matrix

**Then**
3. Publish polish / skills.sh when packs stabilize
>>>>>>> 25559db (feat: draft lossless-migration v0.1 methodology + dogfood)

## How these skills work (do not confuse layers)

| Layer | What | Example |
|-------|------|---------|
| **Skill pack** | Reusable methodology for agents | `constitution-first/` |
| **Product North Star** | One app’s constitution (skill *output*) | `keyframe/docs/north-star.md` |

A pack teaches *how*. A north-star doc is *one result* of running that pack on a product.

## Pack authoring rules (match linear-methodology)

1. Methodology > mechanics
2. `METHODOLOGY.md` is the source; `SKILL.md` ≤ ~100 lines operating order
3. `RESPONSE.md` = ADHD-shaped chat (action-first, numbered, no preamble)
4. `EXAMPLES.md` = dated dogfood friction → fold fixes into methodology same day
5. Rubric + anti-patterns + open gaps
6. Always-on discipline separate from heavyweight setup when needed
7. Dogfood on a *different* repo than the extraction source before calling v1 done

## Reference paths (Socials)

- Creed / accept-gate: `socials/docs/manifesto.md` Parts VI, XI, XII
- Inventory pattern: `socials/docs/inventory-audit.md`
- Worktrees origin: `socials/CLAUDE.md` “Parallel agents” + `socials/scripts/worktree.sh`
- Skill-building style reference: `skills/linear-methodology/shared/METHODOLOGY.md`

## Linear issues already open

- [OFF-256](https://linear.app/off-brand-studio/issue/OFF-256/draft-agent-worktrees-v01) — agent-worktrees (still open; polish/publish later)
- [OFF-257](https://linear.app/off-brand-studio/issue/OFF-257/draft-constitution-first-v01) — Done
- [OFF-266](https://linear.app/off-brand-studio/issue/OFF-266/draft-accept-gated-ai-v01) — accept-gated-ai v0.1 (draft + dogfood)

## Install for local dogfood while drafting

```bash
ln -sfn "$(pwd)/accept-gated-ai/skills/accept-gated-ai" ~/.claude/skills/accept-gated-ai
ln -sfn "$(pwd)/accept-gated-ai/shared/METHODOLOGY.md" ~/.claude/skills/accept-gated-ai/METHODOLOGY.md
ln -sfn "$(pwd)/accept-gated-ai/shared/RESPONSE.md" ~/.claude/skills/accept-gated-ai/RESPONSE.md
# same for ~/.cursor/skills/
```

## Out of scope for this session

- Republishing linear-methodology to skills.sh (separate; keep install paths working)
- Deleting old sibling folders `~/Workspace/linear-methodology-skill`, `agent-worktrees-skill`, `constitution-first-skill` until this monorepo is the pushed GitHub remote and installs are updated
- Building accept-gated UI inside Socials — this pack is the *methodology*, not a Socials feature PR

## First message checklist

1. Read this file + `README.md`
2. Skim `linear-methodology/shared/METHODOLOGY.md` §0 (tone/shape)
3. Read Socials manifesto Parts VI + XII
4. Draft `accept-gated-ai` METHODOLOGY + SKILL
5. Dogfood (audit an existing AI-write path or draft against Tasks agent rules)
6. Commit + Linear comment
