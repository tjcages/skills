# Optional Monitor Automation (Cursor)

Weekly health digest for Cursor. **Not required** for install to be complete.

Complete install = skills installed + always-on loaded + Linear MCP auth. That gives every session the same Linear skills and the assumption that Linear is the default source of truth.

Use this Automation when you want a scheduled `/linear-monitor` without opening a chat. Non-Cursor harnesses: run `/linear-monitor` manually when you want a health check.

## Plain-language recipe (feed to `/automate`)

| Field | Value |
|-------|--------|
| **Name** | Linear tracking health |
| **Description** | Weekly health check for Linear projects using linear-monitor |
| **Trigger** | Schedule — **weekly at 7:00 AM in the user’s local timezone** (default Monday) |
| **Tools** | Linear MCP |
| **Instructions** | See prompt below |
| **Write policy** | Default: **read + comment on existing issues only**. No mass issue creation. Status updates only on real health signals (§20). |

### Timezone (critical)

Cursor cron is **UTC**. The Automations UI shows times in the viewer’s local zone. Never prefill `0 7 * * 1` and call it “7am local” — that is 7:00 UTC (e.g. 1:00 AM Denver MDT, or worse if the UI mis-labels).

**When drafting / prefilling:**

1. Detect or ask the user’s IANA timezone (e.g. `America/Denver`).
2. Convert **7:00 local** → UTC hour for the cron (account for DST).
3. Prefill that UTC cron, and state in the draft table: “7:00 AM \<Timezone\> (cron UTC = …)”.
4. Prefer letting the user confirm **7:00 AM** in the Automations schedule picker (local) over raw cron when unsure.

**Examples (Monday 7:00 AM local → cron):**

| Timezone | Winter (STD) | Summer (DST) |
|----------|--------------|--------------|
| America/Denver | `0 14 * * 1` (MST UTC−7) | `0 13 * * 1` (MDT UTC−6) |
| America/New_York | `0 12 * * 1` | `0 11 * * 1` |
| America/Los_Angeles | `0 15 * * 1` | `0 14 * * 1` |
| UTC | `0 7 * * 1` | `0 7 * * 1` |

## Automation prompt (paste as instructions)

```
You are running the linear-monitor skill for a scheduled health check.

1. Step 0: confirm Linear MCP auth (AUTH.md). If unauthorized, stop with auth steps — do not invent API calls.
2. Follow RESPONSE.md for any user-visible output (action-first, ≤5 bullets).
3. Scope: team/workspace the user configured, or all teams you can list if unset.
4. Checks (read-only first):
   - Milestones with target dates approaching where open issues are not trending Done → note atRisk candidates
   - Issues In Progress with no comment for >7 days → list them
   - Issues with no milestone (orphans) → list them
   - Do not post status updates unless health actually changed (onTrack↔atRisk↔offTrack)
5. Writes (only if explicitly enabled in this Automation): comment on existing issues with findings; never create a spray of new issues.
6. Output: ADHD-shaped digest — findings first, then ONE next action for the human.
7. Never soft-nudge untracked git repos from an Automation run.
```

## How to create it (Cursor)

1. In Agent chat, invoke `/automate` or offer it at the end of `finish linear-tracking install`.
2. Approve the draft (verify the schedule line says **7:00 AM your timezone**).
3. Finish in the Automations editor — set/confirm **7:00 AM local**, save, enable.

## Verify (optional)

- Automation named **Linear tracking health** (or equivalent) exists and is enabled.
- Next run shows **~7:00 AM in your local timezone**.
- Linear tool is attached.
