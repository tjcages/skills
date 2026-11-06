# Survivor

A weekly pass across your social accounts. It ranks each account's last week of posts, retires the clearly worst one, and writes one lesson from the best one or two.

## Status

**v0.1 — drafted.** The helper ran end to end against canned post data in a scratch state folder. It has not yet run on live accounts.

## What it does

- Ranks matured posts by an average percentile across views, likes, replies, and reposts.
- Skips a week when the pool is too small, the metrics are stale, or no post is a clear loser.
- Archives the full text and a screenshot before anything changes.
- Never posts, replies, likes, schedules, or edits text.
- Waits for the user's reply before any permanent deletion.

## Requirements

- The `treg` CLI, which supplies public metrics for X, Instagram, TikTok, and YouTube sources.
- A browser session signed in to each account, for the verify and retire steps.
- Python 3.

## Install

```bash
npx skills add tjcages/skills --skill survivor --global --agent '*' --yes
```

Then copy `config.example.json` from the installed `survivor` skill folder to `~/.survivor/config.json`, and replace every `YOUR_` placeholder with your real accounts. The helper refuses to run while any placeholder remains.

## Schedule it

Run the weekly pass with any scheduler your agent supports. Ask it to run `$survivor` once a week, for example Sundays at 8:00 PM local time.

## Source

- Skill: [`skills/survivor/SKILL.md`](./skills/survivor/SKILL.md)
- Helper: [`skills/survivor/scripts/survivor.py`](./skills/survivor/scripts/survivor.py)
- Platform controls: [`skills/survivor/references/platforms.md`](./skills/survivor/references/platforms.md)

## License

[MIT](./LICENSE)
