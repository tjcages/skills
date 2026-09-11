# iOS Apple-Quality Harness

Auto-apply Apple-level design for native iOS / SwiftUI work — Liquid Glass, HIG, accessibility, Mobbin taste calibration, and device proof (Coot / Revyl).

Composes open skills (HIG, Liquid Glass, SwiftUI craft) into a **repo bootstrap + path-scoped Cursor skill + AGENTS.md contract** so agents hit the same bar every time.

## Status

**v0.1.0 — Draft.** Public in-repo, not announced. Not on skills.sh yet. Dogfood against a live iOS admin face-lift before publish.

## Skills

| Skill | Job |
|-------|-----|
| `ios-apple-quality` | Enforce Apple-quality UI + tool harness on iOS / SwiftUI work |

## Install (local / later)

Upstream agent skills (once, on the Mac):

```bash
bash ios-apple-quality/scripts/install-skills.sh
```

Drop the harness into a repo:

```bash
bash ios-apple-quality/scripts/bootstrap-repo.sh /path/to/YourIOSApp
```

When ready to announce:

```bash
npx skills add tjcages/skills --skill ios-apple-quality -g --agent cursor
```

## Pack shape

```
ios-apple-quality/
  README.md
  LICENSE
  shared/           # METHODOLOGY.md, RESPONSE.md
  skills/ios-apple-quality/SKILL.md
  scripts/          # install-skills.sh, bootstrap-repo.sh
  templates/        # AGENTS.md snippet
```

## Non-goals (v0)

- Announcing on skills.sh / offbr.co
- Claiming v1 without two solid dogfoods

## License

[MIT](./LICENSE)
