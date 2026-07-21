# Constitution-first

**Give a product a constitution before the feature pile invents one.**

Extracted from Socials/Obi's manifesto governance (constitution → SCOPE → roadmap; constitution wins conflicts). Complements `linear-methodology` (which *consumes* a North Star) by teaching how to *author and govern* one.

## Status

**✅ v1.0.0** — ready for testing publish to offbr.co.  
Install (once GitHub repo exists): `npx skills add tjcages/constitution-first-skill -g -a '*' -y`  
Owner publish steps: [`../docs/PUBLISH-offbr.md`](../docs/PUBLISH-offbr.md)

| Target | Score |
|--------|-------|
| keyframe (Tool write) | 12/14 |
| skills monorepo (Tool install) | 13/14 |
| Obi (Product manifesto + re-anchor + Cursor enrichment) | 14/14 |

## Skills

| Skill | Job |
|-------|-----|
| `constitution-first` | Detect / write / audit a product North Star |

## Install (from monorepo, while drafting)

```bash
ln -sfn "$(pwd)/constitution-first/skills/constitution-first" ~/.claude/skills/constitution-first
ln -sfn "$(pwd)/constitution-first/shared/METHODOLOGY.md" ~/.claude/skills/constitution-first/METHODOLOGY.md
ln -sfn "$(pwd)/constitution-first/shared/RESPONSE.md" ~/.claude/skills/constitution-first/RESPONSE.md
```

Template: `shared/north-star.template.md`

## License

MIT — see [LICENSE](./LICENSE)
