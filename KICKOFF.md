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

**Next (do this now)**
1. **Pack 3: `accept-gated-ai`** — highest unique value
2. Fill `accept-gated-ai/shared/METHODOLOGY.md` + `skills/accept-gated-ai/SKILL.md` + `RESPONSE.md` + `EXAMPLES.md`
3. Dogfood against Socials/Obi (`docs/manifesto.md` Parts VI + XII, `atom_proposals`, EditProposal UI) and/or Tasks agent CRUD+undo direction
4. Commit as you go (owner rule: always commit meaningful units)
5. Update Linear [extracted-skills](https://linear.app/off-brand-studio/project/extracted-skills-4d7c79e03387) — milestone `3 — accept-gated-ai`; file/update issues

**Then**
6. `lossless-migration` ← `socials/docs/inventory-audit.md` + migration-roadmap doctrines
7. `behavior-contracts` ← manifesto Part IX + macos-convergence parity matrix

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
- Create issue for accept-gated-ai under milestone `3 — accept-gated-ai` when you start

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
