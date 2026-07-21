# Linear Methodology

**A proven methodology for building and tracking features, projects, and issues across numerous builds.**

## Install (2 steps)

**1.** Paste:

```bash
npx skills add tjcages/linear-methodology-skill -g -a '*' -y
```

**2.** In Agent chat:

```text
finish linear-tracking install
```

That writes always-on rules (Linear = default source of truth) and checks Linear auth. Details: [INSTALL.md](./INSTALL.md).

## Skills

| Skill | Job |
|-------|-----|
| `linear-methodology` | Alias → setup (also the pack name on skills.sh) |
| `linear-setup` | Bootstrap / extend tracking |
| `linear-sync` | Audit / rescue existing boards |
| `linear-monitor` | Health check + Automation recipe |
| `linear-discipline` | Always-on protocol + one-time setup nudge |
| `linear-finish-install` | Post-install: always-on + auth + Automation |

## Use

```text
/linear-setup
/linear-sync
/linear-monitor
/linear-finish-install
```

Or say: “Set up Linear tracking for this project.” · “Sync Linear” · “Linear health check” · “finish linear-tracking install”

`linear-discipline` is always-on (user rule) — no slash needed.

## More

- Site: [offbr.co/skills/linear-methodology](https://offbr.co/skills/linear-methodology)
- [INSTALL.md](./INSTALL.md) · [CHANGELOG.md](./CHANGELOG.md)

## License

MIT
