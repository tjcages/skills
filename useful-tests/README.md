# Useful tests

Keep tests that earn their implementation, runtime, and maintenance cost.
Zero new tests is a valid outcome. Required checks and useful existing coverage remain in place.

## Install

```sh
npx skills add tjcages/skills --skill useful-tests
```

## Use

Invoke `$useful-tests` when deciding how much testing a change needs, or let your agent select it from its description.
Installing a skill does not make it an always-on rule; add that requirement to your agent instructions if desired.

The [skill instructions](skills/useful-tests/SKILL.md) cover when to add tests, when simpler verification is sufficient, and when to stop.

## Status

Draft, version 0.1.0. Adapted from a personal testing rule; independent dogfood is not yet recorded.
