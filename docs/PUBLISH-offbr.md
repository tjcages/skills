# Publish ✅ v1 skills to offbr.co (testing)

**Ready for testing:** `agent-worktrees` · `constitution-first`  
**Not ready (hold):** `accept-gated-ai` · `lossless-migration` · `behavior-contracts` (v0.x)  
**Already live:** `linear-methodology` → https://offbr.co/skills/linear-methodology

Cloud bot **cannot** create GitHub repos or write private `rust/off-brand` D1. Run locally.

## Progress

| Step | agent-worktrees | constitution-first |
|------|-----------------|-------------------|
| GitHub `*-skill` repo | ✅ | ✅ |
| `npx skills add -g` | ✅ (Eve/PromptScript skip expected) | ✅ |
| offbr.co D1 + page | ❌ 404 | ❌ 404 |

**Do now:** add D1 rows in **rust/off-brand** (mirror `linear-methodology`). Then verify:

- https://offbr.co/skills/agent-worktrees  
- https://offbr.co/skills/constitution-first  
- https://offbr.co/skills lists both

## 2. Add rows on offbr.co (rust/off-brand D1)

Site source: private **rust/off-brand** (per OFF-92). Mirror the `linear-methodology` skill row.

Fields observed on the live page (adapt to your D1 schema):

| Field | agent-worktrees | constitution-first |
|-------|-----------------|-------------------|
| slug | `agent-worktrees` | `constitution-first` |
| name | Agent Worktrees | Constitution-first |
| kind | Skill | Skill |
| version | 1.0.0 | 1.0.0 |
| github | `tjcages/agent-worktrees-skill` | `tjcages/constitution-first-skill` |
| install | `npx skills add tjcages/agent-worktrees-skill -g -a '*' -y` | `npx skills add tjcages/constitution-first-skill -g -a '*' -y` |
| homepage | https://offbr.co/skills/agent-worktrees | https://offbr.co/skills/constitution-first |
| blurb | Isolate parallel AI agents on one git repo — without reseeding, port fights, or silent clobbers. | Give a product a constitution before the feature pile invents one. |

Preview art: reuse Linear skill treatment or drop a temporary placeholder; R2 `preview_key` like OFF-93.

After D1 write + deploy, verify:

- https://offbr.co/skills/agent-worktrees  
- https://offbr.co/skills/constitution-first  
- https://offbr.co/skills (both listed)

## 3. Mark 🚀 in this monorepo

Once URLs resolve, update pack READMEs + root status board to 🚀 and check the open gap on each methodology.
