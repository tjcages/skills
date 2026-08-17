# Worker contract

Use this contract for every delegated task. Omit no field; write `none` when a field truly does not apply.

## Assignment

```text
Workstream ID:
Role:
Objective:
Why this matters to the target:
Inputs and authoritative sources:
Dependencies and assumptions:
Owned files/systems:
Write claim: read-only | explicit paths/systems
Forbidden seams and actions:
Expected output:
Required evidence and checks:
Stop and escalate conditions:
Report format: use Worker report below

You own this bounded deliverable, not overall readiness. Do not merge, publish,
redefine scope, spawn subagents, or claim the program is done. Return evidence
to the root for acceptance.
```

## Worker report

```text
Workstream ID:
Result:
Evidence:
Changed:
Checks performed and outcomes:
Uncertainty / untested assumptions:
Conflicts, drift, or shared-seam impact:
Remaining work:
Recommendation to the root:
```

## Root acceptance record

The worker does not fill this section.

```text
Scope: pass | fail — evidence
Truth: pass | fail — evidence
Evidence quality: pass | fail — evidence
Interaction safety: pass | fail — evidence
Residual risk: acceptable | unacceptable — reason
Decision: accept | reject | revise | supersede
Ledger update:
```

## Follow-up patterns

- Missing evidence: “Your result is still Submitted. Provide `<specific proof>`; do not broaden scope.”
- Scope drift: “Stop work on `<drift>`. Return only `<contracted output>` and list any artifacts already changed.”
- Shared seam: “Pause writes to `<seam>`. Report current diff/state; the root will serialize integration.”
- Root-owned decision: “Hold this path. State the decision needed, options, and consequences; do not choose on behalf of the root.”
