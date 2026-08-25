# Progress Check methodology

**Version:** 1.0.1 — 2026-08-25

## 0. Core thesis

Progress updates are decision signals, not proof that an agent is busy. A good
update helps the user understand what became true, what remains uncertain, and
whether intervention is needed. Reassurance without changed evidence is noise.

## 1. When progress reporting applies

Use this method when work is expected to exceed 15 minutes, spans multiple
milestones, coordinates multiple agents, or has meaningful blockers between
start and completion. Skip it for short answers, one-command changes, or work
whose only honest states are started and finished.

## 2. Establish the denominator

Before showing a percentage, identify 3–7 observable milestones. A milestone
is complete only when its evidence exists: a passing check, committed artifact,
accepted review, accessible deployment, or another task-specific gate.

Weight milestones by expected work and risk. Do not divide them equally when
one milestone clearly dominates the task. Never derive progress from elapsed
time, tool-call count, token use, or confidence.

Rebaseline only when scope materially changes. State the scope change in the
same update; do not silently move the percentage backward or inflate it.

## 3. Cadence

Send one baseline update after the scope and denominator are understood.

Routine updates require both:

1. At least 30 minutes since the previous routine update.
2. A completed milestone, at least 10 percentage points of verified progress,
   or a materially different next action.

New actionable blockers and final completion bypass the time gate. Waiting,
unchanged checks, agent polling, and repeated test runs do not.

## 4. Format

Each update contains no more than three concise items:

1. What completed, with concrete evidence.
2. What is active now.
3. The next step or blocker.

End with one 20-cell overall bar styled as inline code on its own line:

`Performance rollout  [██████████████████░░] 90%`

Use one pair of backticks for inline-code styling. Do not indent the line by
four spaces and do not use a fenced code block. Those forms create a separate
code block that interfaces may label or make copyable.

Use `█` for completed cells and `░` for remaining cells. Each cell represents
5%. Round down to avoid overstating progress. Use 100% only when every required
gate is complete.

Replace the label with a short task-specific label. Keep one overall bar even
when the work has batches or subagents. Subtask bars appear only when the user
asks for them. In coordinated work, the root agent owns the bar.

The progress line is the final content. End immediately after it; do not add a
note, recap, disclaimer, or closer beneath it.

## 5. Global installation

The portable default is a global Agent Skills installation:

```bash
npx skills add tjcages/skills --skill progress-check -g --agent '*'
```

This lets compatible agents discover the same skill without maintaining copies
of the rules in several products.

If the user explicitly wants native always-on rules, detect each product's
documented user-level mechanism at execution time. Preserve existing content,
add one identifiable section, make repeated runs idempotent, and avoid project
files when a user-global mechanism exists. For UI-only products, report the
exact settings location and provide the block; do not invent a filesystem path.

## 6. Anti-patterns

| Pattern | Failure | Correction |
|---|---|---|
| Activity percentage | Measures motion, not completion | Tie each increase to evidence |
| Update spam | Hides meaningful changes | Apply both cadence gates |
| Frozen repeated bar | Pretends to inform | Stay silent until state changes |
| Batch bar collection | Makes the user aggregate status | Show one overall bar |
| Optimistic rounding | Overstates readiness | Round down to 5% |
| Instant 90% | Leaves the risky tail invisible | Weight validation and delivery gates |
| Silent rebaseline | Breaks trust in the denominator | Name the scope change |

## 7. Readiness rubric

Score each item 0, 1, or 2. A usable implementation scores at least 10/12 with
no zero.

1. Eligibility: the method activates only for qualifying work.
2. Denominator: milestones are observable and evidence-based.
3. Honesty: percentages follow completed work and round down.
4. Cadence: routine updates satisfy both gates.
5. Clarity: one bar and at most three concise items.
6. Persistence: global installation preserves unrelated configuration.

## 8. Open gaps

- Validate native always-on installation against new agent products as their
  documented global configuration mechanisms change.
- Revisit the 30-minute and 10-point defaults only after real usage shows that
  they are too sparse or still noisy.
