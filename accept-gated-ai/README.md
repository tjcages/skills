# Accept-gated AI

**Write-access AI is only trustworthy if every edit is diffed, accept-gated, reversible, proportional, and willing to do nothing.**

Extracted from Socials/Obi manifesto Parts VI + XI + XII (Creed) and the `atom_proposals` / EditProposal substrate. Complements `constitution-first` (where the creed lives) by teaching how to **enforce write-trust** when an agent can mutate user data.

## Status

**v0.2.0 — drafting + dogfood.** Not published to skills.sh yet.

Dogfood:

1. Tasks agent rules → **9/16** (gaps on create lanes + exceptions)
2. Obi Phase 3 accept-gated path (inventory/roadmap) → **14/16**
3. visual-cursor live Tool → **10/16** (apply+undo; zeros on pre-diff + stale)
4. skills monorepo → `docs/agent-trust.md` installed (coding-agent boundary)
## Skills

| Skill | Job |
|-------|-----|
| `accept-gated-ai` | Audit / design accept-gated write paths for product AI |

## Install (local, while drafting)

```bash
ln -sfn "$(pwd)/accept-gated-ai/skills/accept-gated-ai" ~/.claude/skills/accept-gated-ai
ln -sfn "$(pwd)/accept-gated-ai/shared/METHODOLOGY.md" ~/.claude/skills/accept-gated-ai/METHODOLOGY.md
ln -sfn "$(pwd)/accept-gated-ai/shared/RESPONSE.md" ~/.claude/skills/accept-gated-ai/RESPONSE.md
ln -sfn "$(pwd)/accept-gated-ai/shared/agent-trust.template.md" ~/.claude/skills/accept-gated-ai/agent-trust.template.md
```

Copy `shared/agent-trust.template.md` → product `docs/agent-trust.md` when installing into an app.

## License

MIT (intended; LICENSE pending first publish)
