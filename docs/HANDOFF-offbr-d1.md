# Handoff — add offbr.co D1 skill rows

Paste this whole file to a **local** agent with access to the private **rust/off-brand** repo (and Cloudflare/D1 if needed).

---

## Goal

List two new skills on https://offbr.co/skills next to Linear Methodology:

1. https://offbr.co/skills/agent-worktrees  
2. https://offbr.co/skills/constitution-first  

Both GitHub skill repos + `npx skills add` installs already work. **Only the site D1 rows (and deploy) are missing** — pages currently **404**.

## Context

| Item | Value |
|------|--------|
| Showcase site | https://offbr.co (Cloudflare Worker + D1) |
| Site source | private repo **rust/off-brand** (per Linear OFF-92: “rust/off-brand D1”) |
| Reference skill already live | https://offbr.co/skills/linear-methodology |
| Skills monorepo | https://github.com/tjcages/skills (branch `cursor/keyframe-apply-continue-2b41` / PR #6) |
| Packaged publish notes | `skills/docs/PUBLISH-offbr.md` |

### Skill repos (public, already pushed)

| Pack | GitHub | Install |
|------|--------|---------|
| agent-worktrees | https://github.com/tjcages/agent-worktrees-skill | `npx skills add tjcages/agent-worktrees-skill -g -a '*' -y` |
| constitution-first | https://github.com/tjcages/constitution-first-skill | `npx skills add tjcages/constitution-first-skill -g -a '*' -y` |

### Observed live page fields (linear-methodology)

Mirror this shape in D1 / admin UI — **discover the real table/schema from rust/off-brand**, do not invent column names. Values below are what the SSR HTML exposes:

- `data-slug="linear-methodology"`
- `data-name="Linear Methodology"`
- `data-kind="Skill"`
- `data-handle="@tjcages"`
- version in meta: `1.0.1`
- `codeRepository`: `https://github.com/tjcages/linear-methodology-skill`
- install cmd: `npx skills add tjcages/linear-methodology-skill -g -a '*' -y`
- blurb: from package description
- preview image: R2 under `/media/skills/…` (OFF-93 used `preview_key`)

## Do this (numbered)

1. Open **rust/off-brand** locally. Find how skills are stored (D1 migrations, seed SQL, admin route, wrangler scripts). Prefer copying the existing `linear-methodology` row.
2. Insert **two** skill records with these product values (map onto real columns):

### agent-worktrees

| Field (logical) | Value |
|-----------------|--------|
| slug | `agent-worktrees` |
| name | `Agent Worktrees` |
| kind | `Skill` (same as linear-methodology) |
| version | `1.0.0` |
| handle | `@tjcages` |
| github / codeRepository | `https://github.com/tjcages/agent-worktrees-skill` |
| install command | `npx skills add tjcages/agent-worktrees-skill -g -a '*' -y` |
| homepage / url | `https://offbr.co/skills/agent-worktrees` |
| description / blurb | Isolate parallel AI agents on one git repo — without reseeding, port fights, or silent clobbers. |
| published | yes / listed on `/skills` |
| preview | copy Linear Methodology treatment or a simple placeholder; set R2 `preview_key` if required |

### constitution-first

| Field (logical) | Value |
|-----------------|--------|
| slug | `constitution-first` |
| name | `Constitution-first` |
| kind | `Skill` |
| version | `1.0.0` |
| handle | `@tjcages` |
| github / codeRepository | `https://github.com/tjcages/constitution-first-skill` |
| install command | `npx skills add tjcages/constitution-first-skill -g -a '*' -y` |
| homepage / url | `https://offbr.co/skills/constitution-first` |
| description / blurb | Give a product a constitution before the feature pile invents one. |
| published | yes / listed on `/skills` |
| preview | same approach as above |

3. Deploy rust/off-brand (whatever the repo’s normal path is — wrangler deploy / CI).
4. Verify (must all pass):
   - `curl -sI https://offbr.co/skills/agent-worktrees \| head -1` → **200**
   - `curl -sI https://offbr.co/skills/constitution-first \| head -1` → **200**
   - https://offbr.co/skills lists **both** next to Linear Methodology
   - Detail pages show install command + GitHub link
5. Report back: D1 table name, row ids/slugs, deploy commit/URL, and any schema quirks.
6. Optional follow-up in skills monorepo: mark packs 🚀 in `README.md` / `KICKOFF.md` / `docs/PUBLISH-offbr.md` once URLs are live (PR #6 or a small follow-up commit).

## Do not

- Do not republish or rewrite the skill GitHub repos unless copy is wrong (they’re already installable).
- Do not add accept-gated-ai / lossless-migration / behavior-contracts yet — still **v0.x**, not ready for offbr.
- Do not weaken Linear Methodology’s existing row.

## Done when

https://offbr.co/skills/agent-worktrees and https://offbr.co/skills/constitution-first return **200** and appear on https://offbr.co/skills.
