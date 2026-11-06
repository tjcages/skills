# Survivor — agent instructions

## Product rules

- `skills/survivor/SKILL.md` is the operating order. Keep it under about 100 lines.
- `skills/survivor/scripts/survivor.py` owns all state changes. Never add a path that posts, replies, likes, schedules, or edits text.
- Keep the account and platform examples generic. Personal handles, channel IDs, and private paths do not belong in this pack.
- Permanent deletion always waits for the user's reply.

## Linear tracking

**Team:** Off-brand (`OFF`)
**Project:** [Survivor](https://linear.app/off-brand-studio/project/survivor-d27cb7121e66)

1. Search before creating issues.
2. Move work to `In Progress` when it starts and `Done` only after it ships.
3. Close the loop with concise evidence before ending a session.
