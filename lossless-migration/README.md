# Lossless migration

**Inventory every behavior → name destination → delete only when replacement is live + zero callers.**

Extracted from Socials/Obi’s inventory-audit + migration-roadmap doctrines. Complements `constitution-first` (destinations need a model) and feeds `linear-setup` (phases → milestones).

## Status

**v0.1.0 — drafting + dogfood.** Not published to skills.sh yet.

Dogfood: re-scored Obi’s published inventory audit via Linear mirror → **16/16** (extraction source). Fresh third-repo audit still open for v1.

## Skills

| Skill | Job |
|-------|-----|
| `lossless-migration` | Author/audit inventory → roadmap for lossless reframes |

## Install (local, while drafting)

```bash
ln -sfn "$(pwd)/lossless-migration/skills/lossless-migration" ~/.claude/skills/lossless-migration
ln -sfn "$(pwd)/lossless-migration/shared/METHODOLOGY.md" ~/.claude/skills/lossless-migration/METHODOLOGY.md
ln -sfn "$(pwd)/lossless-migration/shared/RESPONSE.md" ~/.claude/skills/lossless-migration/RESPONSE.md
```

## License

MIT (intended; LICENSE pending first publish)
