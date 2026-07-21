# KICKOFF — cloud agent

Read this first. Continue the skill-extraction work. Do not re-discover from scratch.

## Repo

This monorepo: **`skills`** (`/Users/ty/Workspace/skills` locally).

Source of truth for *content inspiration*: `/Users/ty/Workspace/socials` (read-only reference — manifesto, CLAUDE.md, inventory-audit, etc.).

## Lifecycle reminder

📝 Stub → ✍️ Draft → 🧪 Dogfood → 🔁 2nd dogfood (other repo) → ✅ v1 → 🚀 Publish

**v0.x = drafted + first dogfood. v1 = two dogfoods on independent targets.** Do not call packs “complete” at v0.x.

## State (2026-07-21)

**Merged / in-tree**
1. 🚀 `linear-methodology/` — shipped
2. 🧪 `agent-worktrees/` — v0.1 (OFF-256 still In Progress)
3. 🧪 `constitution-first/` — v0.1 (keyframe Tool dogfood)
4. 🧪 `accept-gated-ai/` — v0.2 (Tasks 9/16 + Obi docs 14/16)
5. 🧪 `lossless-migration/` — v0.1 (Obi audit re-score 16/16; source dogfood)
6. 🧪 `behavior-contracts/` — v0.1 (lightbox + Tasks-macOS dogfood → 8/16) — OFF-271

**Next (do this now)**
1. **Slow down** — second dogfoods on independent repos before any ✅ v1 claims
2. Live Socials checkout re-verify (accept-gate UI, inventory paths, kit files)
3. Optional: close OFF-256 agent-worktrees polish

**Later**
4. Publish / skills.sh only at ✅ v1

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
- Behavior contracts: manifesto Part IX + `docs/macos-convergence-plan.md` / web↔iOS kit drift
- Worktrees origin: `socials/CLAUDE.md` “Parallel agents” + `socials/scripts/worktree.sh`
- Skill-building style reference: `skills/linear-methodology/shared/METHODOLOGY.md`

## Linear issues

- [OFF-256](https://linear.app/off-brand-studio/issue/OFF-256/draft-agent-worktrees-v01) — agent-worktrees (In Progress)
- [OFF-257](https://linear.app/off-brand-studio/issue/OFF-257/draft-constitution-first-v01) — Done
- [OFF-266](https://linear.app/off-brand-studio/issue/OFF-266/draft-accept-gated-ai-v01) / [OFF-268](https://linear.app/off-brand-studio/issue/OFF-268/polish-accept-gated-ai-v02) — Done
- [OFF-269](https://linear.app/off-brand-studio/issue/OFF-269/draft-lossless-migration-v01) — Done
- [OFF-271](https://linear.app/off-brand-studio/issue/OFF-271/draft-behavior-contracts-v01) — behavior-contracts v0.1

## Install for local dogfood while drafting

```bash
ln -sfn "$(pwd)/behavior-contracts/skills/behavior-contracts" ~/.claude/skills/behavior-contracts
ln -sfn "$(pwd)/behavior-contracts/shared/METHODOLOGY.md" ~/.claude/skills/behavior-contracts/METHODOLOGY.md
ln -sfn "$(pwd)/behavior-contracts/shared/RESPONSE.md" ~/.claude/skills/behavior-contracts/RESPONSE.md
# same for ~/.cursor/skills/
```

## Out of scope for this session

- Republishing linear-methodology to skills.sh (separate; keep install paths working)
- Deleting old sibling Workspace folders until installs point at this monorepo
- Building Socials UI/feature PRs — packs are *methodology*

## First message checklist

1. Read this file + `README.md` (lifecycle table)
2. Skim `linear-methodology/shared/METHODOLOGY.md` §0
3. Continue next stub pack
4. Dogfood + commit + Linear comment
5. Restate pack status board every turn
