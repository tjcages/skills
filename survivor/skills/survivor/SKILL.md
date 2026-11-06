---
name: survivor
description: Weekly Survivor pass across the user's social accounts that ranks each account's last week of posts, queues the clearly worst one for the user's approval, and turns the best one or two into a lesson for future posts. Use for the scheduled weekly run, when the user confirms queued deletions, or when the user asks to run, tune, or review Survivor.
---

# Survivor

Each week, every account votes one post off the island and keeps the lesson from its winners.

State lives in `~/.survivor/` (override with `SURVIVOR_HOME`): `config.json` (accounts, thresholds, protected posts), `ledger.jsonl` (every run, hide, delete, and queue), `graveyard/` (full text, metrics, and a screenshot of everything retired), `lessons/<account>.md` (what wins), and `runs/` (each week's ranking). The helper is `scripts/survivor.py`; run it with `python3`. Metrics come from the `treg` CLI.

## First run

If `~/.survivor/config.json` is missing, copy `config.example.json` from this skill folder there. Ask the user for each account's handle and the IDs the config needs (TikTok `secUid`, YouTube `channelId`), then replace every `YOUR_` placeholder. The helper refuses to run while any placeholder remains.

## Weekly run

1. Run `survivor.py rank --account all`. Each account returns `learnFrom` (best one or two), `candidate` and `backup` (clear losers), or `skipped` with the reason. Accounts that error or skip still get reported.
2. **Learn.** For each account with `learnFrom`, compare the winners' full text against the bottom of `ranked`: hook, format, topic, media, length, posting time. If a concrete pattern explains the gap and is not already in `lessons/<account>.md`, record exactly one lesson with `survivor.py learn --account <key> --pattern "..." --reason "..." --addition "..." --evidence <ids>`. Keep `--addition` to one or two actionable sentences in the account's voice. Skip learning when the winner is explained by something unrepeatable (a news spike, a big account's repost).
3. **Verify the candidate** in the browser, signed in as the owning account. Read [references/platforms.md](references/platforms.md) for each platform's controls. Confirm it is the account's own post, the text matches, and it is not pinned, boosted, promoted, an ad, a collab, or the start of a thread. If any check fails, add its URL to that account's `protect` list in `config.json` and verify `backup` instead. If both fail, retire nothing for that account.
4. **Archive** with `survivor.py archive --account <key> --post-id <id>`, then save a screenshot of the post to the returned `screenshot` path.
5. **Queue, never retire.** Every account uses `confirm-delete`, so run `survivor.py queue --account <key> --post-id <id> --archive <archive>` and leave the post live. Do not hide, delete, or change any post during the weekly run, on any platform. The user approves each deletion before anything happens.
6. Run `survivor.py log --account <key> --summary '<json>'` once per account with the pool size, winners, lesson title, and what was retired or why nothing was.
7. **Report** in the run's chat: one short block per account with the winner (link and numbers) and the lesson. For each queued post, show its screenshot as an inline image of the archived `.png`, plus its text, views, likes, and link. Ask the user to approve the deletions by replying `delete`, or to name the posts to keep. Nothing is deleted until that reply.

Retire at most one post per account per week. Never post, reply, like, schedule, or edit post text.

## Confirming queued deletions

When the user replies `delete` (or names specific posts), run `survivor.py pending`. For each approved post, open it, check that it is still the same post, delete it permanently, and record `retire --action deleted --archive <archive>`. For posts the user wants to keep, record `retire --action dropped`. Posts nobody approved stay live and are listed again in the next weekly report.

## Accounts and tuning

Accounts are defined in `config.json`. Each account picks a source (`x`, `instagram`, `tiktok`, or `youtube`), which the helper reads through `treg`. To add an account, copy a similar entry and set its handle and IDs. A post is a clear loser only when at least `minPoolToDelete` matured posts (older than `matureHours`) are in the window, metrics are fresh, its composite score is at most `maxLoserComposite`, and it has fewer views than the account's median. Replies, reposts of others, thread continuations and heads, pinned and paid posts, `protect` entries, and URLs in the optional `placementsFile` are never candidates. Change thresholds only when the user asks.

If a sign-in is missing, a source fails, or the browser cannot reach the platform, skip that account, say which and why in the report, and continue with the rest.
