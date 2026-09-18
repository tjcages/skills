# JEV catalogue — reviewed 2026-09-17 (America/Denver)

20 entries: 17 repositories and three official implementation patterns. This is a
launch-week shortlist, not proof of universal superiority or exhaustive coverage.
Machine-readable provenance, exact commits, release dates, readiness and caveats:
[jev-catalogue.json](jev-catalogue.json). Repository creation dates are not release
dates. A missing tagged release is recorded as unknown, not guessed.

## Recommended order for this EA

| Priority | Resource | Apply it to | Readiness |
| --- | --- | --- | --- |
| 1 | [Official TypeSafe skill](https://github.com/typesafe-ai/skills) | Better state, typed questions, provider integration | Reviewed; installed locally at pinned commit |
| 2 | [Skill suggestion](https://docs.typesafe.ai/cookbooks/skill_suggestion) | Load only relevant skill instructions | Official pattern; adapt selectively, measure overhead |
| 3 | [Jev MCP — Node](https://github.com/jkudish/jev-mcp) | Evidence checks, candidate ranking, screening | Best companion trial; Cloudflare implementation inspected, not runtime-tested |
| 4 | [Jev Browser — Vlad Terin](https://github.com/vlad-terin/jev-browser) | Repeated bounded browser journeys | Best skill-shaped browser candidate; host compatibility trial needed |
| 5 | [Jev Logs](https://github.com/reachjalil/jevlogs) | Large volumes of repetitive diagnostic logs | Vercel-based; recall/cost trial needed |
| 6 | [Skillbox](https://github.com/kitze/skillbox) | Versioned, remotely retrievable skills | Architecture reference; separate service, not installed |

The official skill is the strongest general starting point. For this workflow,
Jev MCP is the most promising executable addition because it exposes focused
judgments and already implements multiple providers, including Cloudflare.
These are fit judgments based on inspected sources, not measured rankings.

## Use without loading the whole catalogue

Run `python3 scripts/catalog.py --query browser` to return up to five compact
matches, or `--id jev-mcp-node` for one complete record. Query deterministically
first. Fetch only that entry's pinned skill/reference when relevant; inspect
updates before using a different revision. A catalogue hit does not install a tool.

For ambiguous selection among a few eligible entries, offer their IDs and compact
use/limitation descriptions to EA's existing decision client. Include a no-match
path. Verify the selection against the full chosen entry before loading it. JEV
selects skills; the host agent reads the skill and executes its workflow. Do not
send every SKILL.md to JEV or require a model call on every user turn.

Keep metadata separate from activation: source-reviewed, installed, locally tested,
live-tested, and user-accepted are different states. Only the official skill is
newly installed by this research pass. No community MCP, browser runtime, model
router, compaction hook, or remote service has been activated.

## What stays on hold

- **Fast Jev Compaction:** Claude Code hook with transcript exposure and information
  retention tradeoffs. No access to Codex's internal compaction is implied.
- **Jev routers:** require a different CLI launch/configuration path. Do not change
  this task's model or credentials merely because a router recommends it.
- **Jev Review:** scoring can guide investigation, but its repeated-review mandate
  risks extra calls and optimizing scores instead of correctness.
- **Mobile Jev:** Android/Mobilerun; not an iPad or Device Hub solution.

Browser Use's Jev Ultrafast is a useful loop-design reference, not an iOS primitive
or a proven drop-in runtime. Other MCP alternatives and browser-specific projects
remain searchable in the JSON catalogue without bloating this entry point.

## Evaluation before promotion

For a selected candidate, inspect its pinned entry point, dependencies, credential
handling, data sent to providers, retry limits, and host-tool compatibility. Test
on a non-sensitive representative fixture; retain raw receipts and independent
success checks. Measure total supervisor plus JEV tokens and latency against the
same task without delegation. Promote only based on observed task quality and cost.

No third-party performance claim has been reproduced in this catalogue. Do not
translate stars, documentation quality, or an upstream demo into verified savings.
Refresh the selected entry's source/release before installation; avoid broad update
polling or bulk loading. Actual transport selection still follows connections.md.
