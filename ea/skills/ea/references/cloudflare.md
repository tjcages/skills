# Cloudflare decision client

Use this when Cloudflare is selected. EA supports other existing JEV connections;
see [connection selection](connections.md). These credential requirements apply
only to this client.

Requires Python 3.11+ (standard library only), a Cloudflare account with access
and funding for `typesafe/jev`, and an authorized token. Use existing credentials
through the environment:

- `CLOUDFLARE_ACCOUNT_ID`: account ID, 32 hexadecimal characters.
- `CLOUDFLARE_API_TOKEN`: authorized AI token; never put its value in a prompt,
  example, CLI argument, committed file, or log.

An existing Wrangler OAuth session can be reused with explicit `--wrangler-config
/path/to/default.toml`. Only use the owner's existing session; this option reads
its token in memory and refuses expired sessions. Refresh through the installed
Wrangler CLI if needed. It does not create tokens, change funding, or grant scopes.
The account ID is always explicit; nothing defaults to the author's account.

From this skill directory:

```sh
python3 scripts/decide.py examples/navigation.json --scope https://example.com --dry-run
python3 scripts/decide.py examples/navigation.json --scope https://example.com --ledger /tmp/ea-navigation.json
python3 -m unittest discover -s scripts -p 'test_*.py'
```

Use a private task directory instead of /tmp for sensitive work. The ledger stores
hashes, decisions, usage and timing, not observations or tokens. Treat it as a
single-writer task file. `--max-calls` allows 1–8 calls, default 4. Repeated input
and failed HTTP calls consume the task's attempts as described by the receipt.
A rejected repeat observation makes no network call. `--dry-run` validates and
prints the redacted request; it does not require credentials or spend credits.

Observation fields: `scope` (must exactly match the supervisor's `--scope`),
`goal` (1–1000 characters), `state` (1–5000 characters), `actions` (1–24 ID-to-
description entries, 300 characters each). IDs use lowercase letters, digits and
underscores. `done` and `escalate` are reserved. Scope is a label, not a sandbox;
the executor must independently enforce URL/path/action boundaries.

The REST client calls `POST /client/v4/accounts/{id}/ai/run` with model
`typesafe/jev` and a Choice question. It accepts the observed completed envelope
and the documented direct result, rejecting unfinished or malformed responses.
The socket timeout is 20 seconds of network inactivity, not a total wall-clock deadline.
The host should impose a task deadline when running unattended adapters.
HTTP/network errors yield `escalate`; no fallback silently spends elsewhere.

Provider contract: https://developers.cloudflare.com/ai/models/typesafe/jev/
Verify that official source if the provider changes. Model pricing and account
balance are not embedded in this skill. JEV supplies structured judgments, not
screenshots, mouse operations, free-form writing, or code generation.
