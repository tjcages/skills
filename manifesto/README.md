# Manifesto

**Give a product a manifesto before the feature pile invents one.**

Extracted from Socials/Obi's manifesto governance (manifesto → SCOPE → roadmap; manifesto wins conflicts). Complements `linear-methodology` (which *consumes* a North Star) by teaching how to *author and govern* one.

## Status

**✅ v1.0.0** — listed on offbr.co.  
Install: `npx skills add tjcages/manifesto-skill -g -a '*' -y`  
Site: https://offbr.co/skills/manifesto

| Target | Score |
|--------|-------|
| keyframe (Tool write) | 12/14 |
| skills monorepo (Tool install) | 13/14 |
| Obi (Product manifesto + re-anchor + Cursor enrichment) | 14/14 |

## Skills

| Skill | Job |
|-------|-----|
| `manifesto` | Detect / write / audit a product North Star |

## Install (from monorepo, while drafting)

```bash
ln -sfn "$(pwd)/manifesto/skills/manifesto" ~/.claude/skills/manifesto
ln -sfn "$(pwd)/manifesto/shared/METHODOLOGY.md" ~/.claude/skills/manifesto/METHODOLOGY.md
ln -sfn "$(pwd)/manifesto/shared/RESPONSE.md" ~/.claude/skills/manifesto/RESPONSE.md
```

Template: `shared/north-star.template.md`

## License

MIT — see [LICENSE](./LICENSE)
