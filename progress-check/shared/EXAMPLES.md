# Progress Check examples

## Useful milestone update

1. The schema migration passed its apply-twice test.
2. API integration is active.
3. Next: verify the deployed read path.

```text
API rollout  [████████████░░░░░░░░] 60%
```

## Actionable blocker

1. Packaging and validation are complete.
2. Publishing is blocked because the registry session is not authenticated.
3. Next: authorize the registry, then rerun the publish command.

```text
Skill release  [████████████████░░░░] 80%
```

## Completion

1. The package is published and installable from both catalog routes.

```text
Skill release  [████████████████████] 100%
```

## Updates to suppress

Do not send any of these when no material state changed:

- “Still working.”
- “The tests are still running.”
- The same percentage and bar as the prior update.
- Separate bars for every subagent or batch.

## Dogfood log

Add dated entries here. Record the target agent, install command, observed
behavior, friction, and the methodology change that resulted.
