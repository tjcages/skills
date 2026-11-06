#!/usr/bin/env python3
"""Survivor: weekly best/worst ranking and bookkeeping for social accounts.

Pulls each account's recent posts with public metrics through the `treg` CLI,
ranks the matured posts from the last week, and keeps Survivor's state in
SURVIVOR_HOME (default ~/.survivor).

Nothing here deletes or hides a post. The agent does that on the platform
after verifying the candidate, then records it with `retire`.

Subcommands:
  rank      Rank last week's posts; save the run and print candidates as JSON.
  archive   Save a candidate's full text and metrics to the graveyard.
  learn     Record a lesson from the best one or two posts.
  queue     Mark a candidate as waiting for the user's confirmation to delete.
  retire    Record a hide, a delete, or a dropped (kept) queued post.
  pending   List queued deletions that are still waiting.
  log       Append one run summary to the ledger.
"""

import argparse
import datetime as dt
import json
import os
import re
import statistics
import subprocess
import sys

# -----------------------------------------------------------------------------
# Entry point
# -----------------------------------------------------------------------------

STATE_DIR = os.path.expanduser(os.environ.get("SURVIVOR_HOME", "~/.survivor"))
CONFIG_PATH = os.path.join(STATE_DIR, "config.json")
LEDGER_PATH = os.path.join(STATE_DIR, "ledger.jsonl")
GRAVEYARD_DIR = os.path.join(STATE_DIR, "graveyard")
RUNS_DIR = os.path.join(STATE_DIR, "runs")
LESSONS_DIR = os.path.join(STATE_DIR, "lessons")
CACHE_PATH = os.path.join(STATE_DIR, "cache.json")
DAY_MS = 24 * 60 * 60 * 1000


def main():
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="command", required=True)

    rank = sub.add_parser("rank")
    rank.add_argument("--account", required=True, help="account key from config.json, or 'all'")
    rank.add_argument("--now", help="ISO time to rank as of (testing only)")

    for name in ("archive", "queue"):
        p = sub.add_parser(name)
        p.add_argument("--account", required=True)
        p.add_argument("--post-id", required=True)
        if name == "queue":
            p.add_argument("--archive", required=True)

    learn = sub.add_parser("learn")
    learn.add_argument("--account", required=True)
    learn.add_argument("--pattern", required=True, help="one-line lesson title")
    learn.add_argument("--reason", required=True, help="why, citing the winning posts and numbers")
    learn.add_argument("--addition", required=True, help="the short rule to follow next time")
    learn.add_argument("--evidence", required=True, help="comma-separated post ids from the run")

    retire = sub.add_parser("retire")
    retire.add_argument("--account", required=True)
    retire.add_argument("--post-id", required=True)
    retire.add_argument("--action", choices=["deleted", "hidden", "dropped"], required=True)
    retire.add_argument("--archive", required=True)

    sub.add_parser("pending")

    log = sub.add_parser("log")
    log.add_argument("--account", required=True)
    log.add_argument("--summary", required=True, help="JSON object describing the run")

    args = parser.parse_args()
    if args.command == "pending":
        out = cmd_pending()
    elif args.command == "rank" and args.account == "all":
        out = [cmd_rank(a, args) for a in load_config()["accounts"]]
    else:
        account = load_account(args.account)
        out = {
            "rank": cmd_rank,
            "archive": cmd_archive,
            "learn": cmd_learn,
            "queue": cmd_queue,
            "retire": cmd_retire,
            "log": cmd_log,
        }[args.command](account, args)
    print(json.dumps(out, indent=2, ensure_ascii=False))


# -----------------------------------------------------------------------------
# Helpers
# -----------------------------------------------------------------------------


def cmd_rank(account, args):
    """Rank one account's matured posts from the last window.

    1. Fetch recent posts (normalized) back to the baseline horizon.
    2. Drop replies, reposts of others, thread continuations, and posts
       Survivor already retired. Thread heads stay rankable but are never
       deleted, because deleting a head strands its replies.
    3. Score the window by mean percentile across the metrics the platform
       exposes; a metric missing on a post counts as the middle.
    4. Offer a candidate only when the pool is big enough, metrics are
       fresh, and the loser is clearly below the account's normal.
    """
    cfg = load_config()
    now_ms = iso_ms(args.now) if getattr(args, "now", None) else now()
    window_end = now_ms - cfg["matureHours"] * 3_600_000
    window_start = window_end - cfg["windowDays"] * DAY_MS
    history_start = now_ms - cfg["baselineDays"] * DAY_MS

    try:
        posts, freshness = FETCHERS[account["source"]](account, history_start, now_ms, cfg)
    except SystemExit as err:
        return {"account": account["key"], "error": str(err)}

    retired = {e["postId"] for e in read_ledger() if e.get("event") in ("deleted", "hidden") and e.get("account") == account["key"]}
    protected = set(account.get("protect", [])) | placement_urls(cfg)
    rankable = [p for p in posts if p["role"] in ("single", "head") and p["id"] not in retired]
    baseline_pool = [p for p in rankable if p["posted_at"] <= window_end]
    window = [p for p in rankable if window_start <= p["posted_at"] <= window_end]
    score(window, account["metrics"])
    base_views = median_nonzero([p["views"] for p in baseline_pool if p["views"] is not None])

    for p in window:
        p["block"] = (
            "thread-head" if p["role"] == "head"
            else "pinned" if p.get("pinned")
            else "paid" if p.get("paid")
            else "protected" if p["url"] in protected or p["id"] in protected
            else None
        )
    by_score = sorted(window, key=lambda p: (p["composite"], p["views"] or 0))
    deletable = [p for p in by_score if p["block"] is None]

    def clear_loser(p):
        below_normal = not base_views or p["views"] is None or p["views"] < base_views
        return p["composite"] <= cfg["maxLoserComposite"] and below_normal

    worst, backup, skip = None, None, None
    if len(window) < cfg["minPoolToDelete"]:
        skip = f"only {len(window)} rankable posts in window (need {cfg['minPoolToDelete']})"
    elif not freshness["fresh"]:
        skip = f"metrics are stale: {freshness['detail']}"
    elif not deletable:
        skip = "no deletable posts in window"
    elif not clear_loser(deletable[0]):
        c = deletable[0]
        skip = f"no clear loser: lowest deletable post scored {c['composite']:.2f} with {c['views']} views vs median {base_views}"
    else:
        worst = deletable[0]
        backup = next((p for p in deletable[1:] if clear_loser(p)), None)

    best = list(reversed(by_score))[:2]
    if len(best) == 2 and best[1]["composite"] < cfg["minSecondBestComposite"]:
        best = best[:1]

    result = {
        "account": account["key"],
        "platform": account["platform"],
        "handle": account["handle"],
        "retire": account["retire"],
        "window": {"start": ms_iso(window_start), "end": ms_iso(window_end)},
        "poolSize": len(window),
        "baselineMedianViews": base_views,
        "metrics": freshness,
        "learnFrom": [public(p) for p in best] if len(window) >= cfg["minPoolToLearn"] else [],
        "candidate": public(worst) if worst else None,
        "backup": public(backup) if backup else None,
        "skipped": skip,
        "ranked": [
            {"id": p["id"], "composite": round(p["composite"], 3), "views": p["views"], "block": p["block"], "text": p["text"][:70]}
            for p in by_score
        ],
    }
    os.makedirs(RUNS_DIR, exist_ok=True)
    with open(run_path(account["key"]), "w") as f:
        json.dump({**result, "posts": {p["id"]: public(p) for p in window}}, f, indent=1, ensure_ascii=False)
    return result


def cmd_archive(account, args):
    """Freeze the full post and its metrics before anything is hidden or deleted."""
    p = run_post(account, args.post_id)
    stamp = dt.date.today().isoformat()
    os.makedirs(GRAVEYARD_DIR, exist_ok=True)
    base = os.path.join(GRAVEYARD_DIR, f"{stamp}-{account['key']}-{p['id']}")
    with open(base + ".md", "w") as f:
        f.write(f"# Survivor graveyard: {account['key']} {stamp}\n\n")
        f.write(f"- URL: {p['url']}\n- Post id: {p['id']}\n- Posted: {p['postedAt']}\n")
        f.write(f"- Score {p['composite']} · views {p['views']} · likes {p['likes']} · replies {p['replies']} · reposts/shares {p['reposts']}\n\n")
        f.write("## Text\n\n" + (p["text"] or "").strip() + "\n")
    return {"archive": base + ".md", "screenshot": base + ".png", "url": p["url"]}


def cmd_learn(account, args):
    """Append one lesson to the account's lesson file, citing the winning posts."""
    ids = [i.strip() for i in args.evidence.split(",") if i.strip()]
    evidence = [run_post(account, i) for i in ids]
    os.makedirs(LESSONS_DIR, exist_ok=True)
    path = os.path.join(LESSONS_DIR, f"{account['key']}.md")
    new = not os.path.exists(path)
    with open(path, "a") as f:
        if new:
            f.write(f"# Survivor lessons: {account['key']}\n\nNewest last. Read before drafting for this account.\n")
        f.write(f"\n## {dt.date.today().isoformat()}: {args.pattern}\n\n{args.addition}\n\nWhy: {args.reason}\n\n")
        for e in evidence:
            f.write(f"- {e['url']} ({e['views']} views, {e['likes']} likes)\n")
    return {"lessons": path}


def cmd_queue(account, args):
    p = run_post(account, args.post_id)
    entry = {"event": "queued", "at": ms_iso(now()), "account": account["key"], "postId": p["id"], "url": p["url"], "archive": args.archive}
    append_ledger(entry)
    return entry


def cmd_retire(account, args):
    p = run_post(account, args.post_id)
    entry = {"event": args.action, "at": ms_iso(now()), "account": account["key"], "postId": p["id"], "url": p["url"], "archive": args.archive}
    append_ledger(entry)
    return entry


def cmd_pending():
    """Queued deletions with no later delete or drop for the same post."""
    entries = read_ledger()
    done = {(e["account"], e["postId"]) for e in entries if e.get("event") in ("deleted", "dropped")}
    return [e for e in entries if e.get("event") == "queued" and (e["account"], e["postId"]) not in done]


def cmd_log(account, args):
    entry = {"event": "run", "at": ms_iso(now()), "account": account["key"], **json.loads(args.summary)}
    append_ledger(entry)
    return entry


# --- Sources ------------------------------------------------------------------
# Each fetcher returns (posts, freshness). A post is a dict with id, url,
# posted_at (ms), text, views/likes/replies/reposts (None when the platform
# hides it), pinned, paid, and role: single | head | continuation | reply | repost.


def fetch_x(account, history_start, now_ms, cfg):
    tweets, cursor = [], None
    for _ in range(cfg["maxPages"]):
        body = {"username": account["handle"]}
        if cursor:
            body["cursor"] = cursor
        data = treg("anyapi.x.user.posts", body)["output"]["data"]
        page = data.get("tweets") or []
        tweets += page
        cursor = data.get("nextCursor")
        if not page or not cursor or min(t["createdUtc"] for t in page) * 1000 < history_start:
            break
    own_ids = {t["id"] for t in tweets}
    posts = []
    for t in tweets:
        text = t.get("text") or ""
        if text.startswith("RT @"):
            role = "repost"
        elif t.get("isReply"):
            # A self-reply that does not open with @mention continues our own thread.
            role = "continuation" if t.get("conversationId") in own_ids and not text.startswith("@") else "reply"
        else:
            role = "single"
        posts.append({
            "id": t["id"], "url": f"https://x.com/{account['handle']}/status/{t['id']}",
            "posted_at": t["createdUtc"] * 1000, "text": text, "views": t.get("views"),
            "likes": t.get("likes"), "replies": t.get("replies"),
            "reposts": (t.get("retweets") or 0) + (t.get("quotes") or 0),
            "pinned": bool(t.get("isPinned")), "role": role, "conv": t.get("conversationId"),
        })
    heads = {p["conv"] for p in posts if p["role"] == "continuation"}
    for p in posts:
        if p["role"] == "single" and p["id"] in heads:
            p["role"] = "head"
    return posts, {"fresh": True, "detail": "live"}


def fetch_instagram(account, history_start, now_ms, cfg):
    items = paged("anyapi.instagram.user.posts", {"username": account["handle"]}, "posts", history_start, cfg)
    reels = paged("anyapi.instagram.user.reels", {"handle": account["handle"]}, "reels", history_start, cfg)
    views = {r["id"]: r.get("views") for r in reels}
    by_id = {i["id"]: i for i in items}
    for r in reels:
        by_id.setdefault(r["id"], r)
    posts = []
    for i in by_id.values():
        code = i.get("shortcode") or i.get("code")
        posts.append({
            "id": i["id"], "url": f"https://www.instagram.com/p/{code}/" if code else None,
            "posted_at": i["createdUtc"] * 1000, "text": i.get("caption") or "",
            "views": views.get(i["id"]), "likes": i.get("likes"), "replies": i.get("comments"),
            "reposts": i.get("reshares"), "pinned": bool(i.get("isPinned")),
            "paid": bool(i.get("paidPartnership")), "role": "single",
        })
    return posts, {"fresh": True, "detail": "live"}


def fetch_tiktok(account, history_start, now_ms, cfg):
    out = treg("treg.tiktok.user.videos", {"sec_uid": account["secUid"], "limit": 35})["output"]
    posts = []
    for v in out.get("videos") or []:
        s = v.get("stats") or {}
        posts.append({
            "id": v["post_id"], "url": v["url"], "posted_at": iso_ms(v["created_at"]),
            "text": v.get("description") or "", "views": s.get("plays"), "likes": s.get("likes"),
            "replies": s.get("comments"), "reposts": (s.get("shares") or 0) + (s.get("saves") or 0),
            "pinned": bool(v.get("is_pinned")), "role": "single",
        })
    return posts, {"fresh": True, "detail": "live"}


def fetch_youtube(account, history_start, now_ms, cfg):
    data = treg_get("scrapecreators.x.v1-youtube-channel-shorts", {"channelId": account["channelId"]})
    cache = read_cache()
    dates = cache.setdefault("youtubePublished", {})
    posts = []
    for s in data.get("shorts") or []:
        # The Shorts list has no publish date; look each one up once and cache it.
        if s["id"] not in dates:
            detail = treg("treg.youtube.video.detail", {"video_id": s["id"]})["output"]
            dates[s["id"]] = detail.get("published")
        if not dates[s["id"]]:
            continue
        posts.append({
            "id": s["id"], "url": s["url"], "posted_at": iso_ms(dates[s["id"]]), "text": s.get("title") or "",
            "views": s.get("viewCountInt") or 0, "likes": s.get("likeCountInt"), "replies": s.get("commentCountInt"),
            "reposts": None, "role": "single",
        })
    write_cache(cache)
    return posts, {"fresh": True, "detail": "live"}


FETCHERS = {"x": fetch_x, "instagram": fetch_instagram, "tiktok": fetch_tiktok, "youtube": fetch_youtube}


def paged(endpoint, body, key, history_start, cfg):
    out, cursor = [], None
    for _ in range(cfg["maxPages"]):
        req = {**body, **({"cursor": cursor} if cursor else {})}
        data = treg(endpoint, req)["output"]["data"]
        page = data.get(key) or []
        out += page
        cursor = data.get("nextCursor")
        if not page or not cursor or min(p["createdUtc"] for p in page) * 1000 < history_start:
            break
    return out


def treg(endpoint, body):
    res = subprocess.run(["treg", "call", endpoint, "--data", json.dumps(body)], capture_output=True, text=True)
    return parse_treg(endpoint, res)


def treg_get(endpoint, query):
    cmd = ["treg", "call", endpoint, "--method", "GET"]
    for k, v in query.items():
        cmd += ["-p", f"{k}={v}"]
    return parse_treg(endpoint, subprocess.run(cmd, capture_output=True, text=True))


def parse_treg(endpoint, res):
    try:
        data = json.loads(res.stdout)
    except json.JSONDecodeError:
        sys.exit(f"treg {endpoint} failed: {res.stderr.strip()[-300:]}")
    if res.returncode != 0 or "detail" in data:
        sys.exit(f"treg {endpoint} failed: {json.dumps(data)[:300]}")
    return data


def score(pool, metrics):
    """Composite = mean percentile across metrics; missing values count as 0.5."""
    for p in pool:
        p["composite"] = 0.5 if len(pool) < 2 else 0.0
    if len(pool) < 2:
        return
    for m in metrics:
        known = [p[m] for p in pool if p.get(m) is not None]
        for p in pool:
            v = p.get(m)
            if v is None or len(known) < 2:
                pct = 0.5
            else:
                below = sum(1 for k in known if k < v)
                equal = sum(1 for k in known if k == v)
                # Mid-rank for ties so a pile of zero-like posts share a score.
                pct = (below + (equal - 1) / 2) / (len(known) - 1)
            p["composite"] += pct / len(metrics)


def placement_urls(cfg):
    """Post URLs listed in an optional placements file; never delete what an ad points at."""
    path = cfg.get("placementsFile")
    if not path:
        return set()
    try:
        text = open(os.path.expanduser(path)).read()
    except OSError:
        return set()
    return set(re.findall(r"https?://(?:www\.)?(?:x\.com|instagram\.com|tiktok\.com|youtube\.com)/[^\s\"']+", text))


def run_path(key):
    return os.path.join(RUNS_DIR, f"{dt.date.today().isoformat()}-{key}.json")


def run_post(account, post_id):
    path = run_path(account["key"])
    if not os.path.exists(path):
        sys.exit(f"no run saved today for {account['key']}; run `rank` first")
    posts = json.load(open(path))["posts"]
    if post_id not in posts:
        sys.exit(f"post {post_id} is not in today's {account['key']} window")
    return posts[post_id]


def median_nonzero(values):
    vals = [v for v in values if v]
    return int(statistics.median(vals)) if vals else 0


def public(p):
    return {
        "id": p["id"], "url": p["url"], "postedAt": ms_iso(p["posted_at"]), "composite": round(p["composite"], 3),
        "views": p["views"], "likes": p["likes"], "replies": p["replies"], "reposts": p["reposts"],
        "role": p["role"], "text": p["text"],
    }


def load_config():
    with open(CONFIG_PATH) as f:
        raw = f.read()
    if "YOUR_" in raw:
        sys.exit(f"{CONFIG_PATH} still has placeholder values (YOUR_...); fill in real accounts first")
    return json.loads(raw)


def load_account(key):
    for a in load_config()["accounts"]:
        if a["key"] == key:
            return a
    sys.exit(f"unknown account {key}; see {CONFIG_PATH}")


def read_cache():
    return json.load(open(CACHE_PATH)) if os.path.exists(CACHE_PATH) else {}


def write_cache(cache):
    os.makedirs(STATE_DIR, exist_ok=True)
    with open(CACHE_PATH, "w") as f:
        json.dump(cache, f, indent=1)


def read_ledger():
    if not os.path.exists(LEDGER_PATH):
        return []
    with open(LEDGER_PATH) as f:
        return [json.loads(line) for line in f if line.strip()]


def append_ledger(entry):
    os.makedirs(STATE_DIR, exist_ok=True)
    with open(LEDGER_PATH, "a") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")


def now():
    return int(dt.datetime.now(dt.timezone.utc).timestamp() * 1000)


def iso_ms(s):
    return int(dt.datetime.fromisoformat(s.replace("Z", "+00:00")).timestamp() * 1000)


def ms_iso(ms):
    return dt.datetime.fromtimestamp(ms / 1000, dt.timezone.utc).isoformat(timespec="minutes")


if __name__ == "__main__":
    main()
