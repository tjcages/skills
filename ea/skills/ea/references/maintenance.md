# Maintaining the catalogue

Monitoring is opt-in. Installing EA does not schedule anything.

Run `python3 scripts/watch.py --state /path/to/private/ea-watch.json` once a day
when a user requests monitoring. It needs GitHub CLI (`gh`) and network access;
it fetches only repository metadata, executes no third-party code, and makes no
model calls. Use a single scheduler per state file. Missing or malformed state
must be investigated, not silently discarded.

The report contains newly observed revisions and source errors. An unchanged
revision costs no JEV call. The local state records observations, not approval;
the packaged catalogue remains the last reviewed snapshot. Preserve a pending
review list before starting another check, since unchanged pending revisions will
not reappear as new changes.

For changed sources, fetch the relevant release notes and diff. Use the selected
JEV connection to classify compact, redacted evidence into `review`, `ignore`, or
`escalate`, batching independent choices when supported. Keep the normal four-call
budget. JEV cannot fetch sources or establish compatibility itself. The supervisor
reviews meaningful changes before updating source pins or recommendations.
Never upgrade an installed runtime, execute an installer, change providers, or
claim fresh testing merely because a source changed.

Weekly, check skills.sh search for JEV and TypeSafe plus the official TypeSafe
repository. Popularity helps discovery; rank by task fit, provenance, compatibility,
and evidence. Do not scrape an authenticated API without credentials or interpret
an inaccessible leaderboard as an empty result. Record unavailable sources.

Notify only for a useful new candidate, a material change, a broken integration,
or required user action. Stay quiet otherwise. Set an end date; the user's current
monitoring request is limited to three months. Updates to this skill are pulled
with `npx skills update`; new installations receive the current published version.
