# Changelog

Public releases. Newest first.

## v1.0.1 — 2026-07-21

**Contract:** install is complete when skills + always-on + Linear auth work on any Agent Skills harness. **Linear is the default source of truth** every session.

**Changed:** Monitor Automation is optional (Cursor weekly health only) — no longer a completeness gate. ALWAYS_ON / INSTALL / finish-install updated for Cursor, Claude Code, Codex, and other `~/.agents` clients equally.

## v1.0.0 — 2026-07-21

First public release.

**What it is:** a methodology for building and tracking features, projects, and issues in Linear — packed as Agent Skills (`linear-setup`, `linear-sync`, `linear-monitor`, `linear-discipline`, `linear-finish-install`, plus `linear-methodology` alias).

**Install:**
1. `npx skills add tjcages/linear-methodology-skill -g -a '*' -y`
2. In Agent chat: `finish linear-tracking install`

**Includes:** soft nudge for untracked repos, ADHD-shaped Linear chat, always-on discipline. Validated across multiple real builds before ship.

Site: [offbr.co/skills/linear-methodology](https://offbr.co/skills/linear-methodology)
