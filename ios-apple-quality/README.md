# ios-apple-quality

Agent skill pack: measured iOS craft encyclopedia + visual gate so designs/code match Apple-quality admin UI (Linear / Totem-class).

**Version:** 0.2.0-draft (post 2026-09-11 Figma verification failure).

## Layout

```
skills/ios-apple-quality/   # thin router SKILL.md + METHODOLOGY + RESPONSE
shared/CRAFT_SPEC.md        # R1–R110 measured rules
shared/VISUAL_GATE.md       # R100–R110 quick load
shared/IPAD_CRAFT.md
shared/CORPUS.md
shared/GAPS.md
shared/STRATEGY.md
shared/RECIPES/             # list, detail, floating-tab, composer, inset-grouped
templates/AGENTS.md
scripts/
```

## Install

```bash
./scripts/install-skills.sh
./scripts/bootstrap-repo.sh /path/to/app
```

Agents must load CRAFT_SPEC + VISUAL_GATE before inventing or showing UI. Hard forbids: emoji chrome, vertical docks, title-only sparse rows.
