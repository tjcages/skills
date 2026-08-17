# Readiness contract

Readiness belongs to the root orchestrator. Workers contribute evidence; they do not score or declare the program ready.

Use the machine-readable structure and validator in `LEDGER.md`. The template below remains the compact human view; it does not replace the JSON ledger during a multi-agent run.

## Target ledger template

```text
Target:
Outcome:
Definition of done:
Non-negotiables:
In scope:
Out of scope:
Authority / owner-only gates:

Current evidence:
Known gaps:
Risks:
Critical path:
Next gate:
Delivery artifacts:

Workstreams
ID | Objective | Dependencies | Owner | Write claim | State | Evidence | Next action
```

## Readiness states

- **Not ready** — required outcomes or evidence are missing.
- **In progress** — work can advance within current authority.
- **Blocked** — a required path needs user authority or external state; independent paths are exhausted.
- **Ready for review** — implementation and checks exist, but a user-owned review gate remains.
- **Ready / done** — every completion condition passes and delivery is complete.

Never use “mostly done” to conceal an unmet required gate. Name the missing gate.

## Completion checklist

- [ ] Required outcomes are Verified or user-deferred.
- [ ] Relied-on submissions were challenged by the root.
- [ ] Combined authoritative state matches the target.
- [ ] Integrated checks pass proportionally to risk.
- [ ] Real workflow/delivery path was exercised where possible.
- [ ] Required artifacts, links, previews, or handoffs exist.
- [ ] No active worker can invalidate readiness.
- [ ] Limitations and owner-only gates are explicit.

## Skill release scorecard

Score each 0 or 1. The skill may advance toward v1 only at **10/10** across two independent live dogfoods.

| # | Dimension | Pass condition |
|---|---|---|
| 1 | Root identity | Only the user-facing root orchestrates |
| 2 | Target ledger | Definition of done and next gate stay current |
| 3 | Dependency graph | Parallel work is independent and useful |
| 4 | Worker contracts | Every assignment is bounded and evidence-bearing |
| 5 | Write ownership | No overlapping active writers |
| 6 | Challenge | Every relied-on submission is questioned |
| 7 | Integration | Root verifies authoritative combined state |
| 8 | Blocker behavior | Independent authorized paths continue |
| 9 | Authority | No action exceeds user permission |
| 10 | Completion | Final claim passes every required gate |

Release-blocking failures regardless of total score:

- a worker recursively orchestrates;
- overlapping writers are allowed to continue;
- the root accepts an unchallenged result;
- readiness is claimed before integration verification;
- persistence is used to justify authority creep.
