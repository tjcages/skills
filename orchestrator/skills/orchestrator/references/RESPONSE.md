# Orchestrator response contract

Keep the user oriented to accepted progress, not agent activity. Derive counts and gates from the validated target ledger.

## Every progress update

```text
🔌 <branch/environment> · <critical path> · <preview/artifact or n/a>

State: <verified>/<required>; <active> active, <submitted> submitted, <blocked> blocked
Root: <what the orchestrator is integrating, deciding, or verifying>
Agents: <only material worker state or intervention>
Evidence: <newly accepted proof since the last update>
Next gate: <single observable condition>
```

## Rules

1. Lead with current state or the next gate.
2. Number user actions when any are required.
3. Call worker work **Submitted** until root challenge completes.
4. Distinguish a path blocker from a program blocker.
5. Report interventions: rejected evidence, stopped drift, resolved overlap.
6. Restate target changes and their effect on active work.
7. Never use agent count, messages, or elapsed effort as proof of progress.
8. Never say done if an active worker can alter the readiness claim.
9. State limitations and owner-only gates without softening them.
10. End with the next gate, not a generic offer to help.

## Final delivery

```text
State: Ready | Ready for review | Blocked
Delivered: <artifacts and authoritative locations>
Verified: <checks and actual workflow exercised>
Accepted work: <important integrated workstreams>
Deferred / blocked: <explicit user decisions or external gates>
Readiness basis: <completion-gate evidence>
```

The final response must be self-contained; commentary may be collapsed.
