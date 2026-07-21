# Skills monorepo — publish / layout inventory

**Scenario:** move from “drafting in monorepo” → 🚀 selective skills.sh publish without losing pack shape or Linear trail. Authored 2026-07-21 (`lossless-migration` dogfood).

## Headline

~85% **reframe-in-place** (already the target pack model) · ~10% **GAP** (LICENSE, skills.sh install URLs) · ~5% **RETIRE** (absolute symlink leftovers, stale sibling Workspace paths in docs).

## Inventory

| Row | Tag | Destination note | Status |
|---|---|---|---|
| `linear-methodology/` | ENTITY | Already 🚀 — keep as reference pack shape | live |
| `agent-worktrees/` | ENTITY | ✅ v1 — publish when install paths announced | ready |
| `manifesto/` | ENTITY | Hold 🚀 until Product 🔁 write | drafting |
| `accept-gated-ai/` | ENTITY | Hold until Product dogfood outside Obi/Tasks | drafting |
| `lossless-migration/` | ENTITY | Hold until deeper Product audit | drafting |
| `behavior-contracts/` | ENTITY | Hold until multi-kit install | drafting |
| `docs/north-star.md` | FACET | Monorepo North Star | live |
| `docs/agent-trust.md` | FACET | Coding-agent boundary | live |
| `KICKOFF.md` / `README.md` | VIEW | Agent entry + status board | live |
| `scripts/worktree.sh` | INFRA | Worktree helper | live |
| `worktree.share` | INFRA | Empty intentional | live |
| `*/shared/*.template.md` | VIEW | Installable slices for target products | live |
| `*/dogfood/` | VIEW | Evidence; not published as skills | stay |
| Absolute `/Users/ty/...` symlink leftovers | RETIRE | Replaced with `../../shared/` | done 2026-07-21 |
| Sibling Workspace skill folders | RETIRE | After installs point at this monorepo | queued |
| Per-pack LICENSE | GAP | MIT intended; add at first 🚀 | open |
| skills.sh listing + install URLs | GAP | After ≥2 packs ✅ v1 beyond linear-methodology | open |
| Socials as SoT | RETIRE | Already doctrine — never land SoT there | policy |

## RETIRE rules

- Do **not** delete sibling folders until `~/.claude/skills` / `~/.cursor/skills` symlinks target this monorepo.
- Do **not** RETIRE dogfood evidence.

## Phase sketch

0. Keep Linear + dogfood cadence  
1. ✅ more packs to v1  
2. LICENSE + skills.sh for ready packs  
3. RETIRE old sibling installs  

## Rubric: **14/16**

| # | Score | Note |
|---|---|---|
| 1 Constitution | 2 | `docs/north-star.md` |
| 2 Full buckets | 2 | Packs + docs + infra + gaps |
| 3 Every row tagged | 2 | |
| 4 GAP explicit | 2 | LICENSE + skills.sh |
| 5 RETIRE explicit | 2 | Symlinks done; siblings queued |
| 6 Verdict % | 2 | Headline |
| 7 Roadmap derives | 1 | Phase sketch only |
| 8 Phase doctrines | 1 | Light Tool publish; not Product migration doctrines |
