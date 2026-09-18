# Select and adapt a JEV connection

## Selection order

1. The user's explicit method for this task, including a requested override.
2. Their configured JEV default (project/user instructions, documented connection
   settings, or an already available JEV tool).
3. An obvious existing integration that already serves JEV for this workflow.
4. Cloudflare, the recommended fallback when no method is set or evident.

A default is not proof that credentials, funding, or tool access exist. Complete
only the setup authorized by the user, and ask for missing access when required.
Do not overwrite an existing default or persist a new global preference unless
requested. Do not copy one provider's credentials to another endpoint. A different
provider must have its own authorized access and be suitable for the task's data.

## Existing tool, CLI, gateway, or SDK

Use its documented interface. Preserve a working JEV integration instead of
rebuilding it with the Cloudflare client. Providers can have different model IDs,
envelopes, authentication, and input schemas; inspect the installed adapter or
verify official documentation rather than guessing an OpenAI-compatible endpoint.

The logical request remains: a compact observed state, a goal, and a Choice
question whose criteria are the offered action IDs plus `done` and `escalate`.
Map that request to the selected interface. Normalize its response to:

```json
{"action":"open_composer","confidence":0.95,"executed":false,"usage":{"input_tokens":100,"output_tokens":12},"provider":"configured-provider","model":"reported-model","latency_ms":800}
```

Accept only an offered ID (or a reserved exit), a completed response, and finite
numeric confidence from 0.85 through 1. Reject unknown IDs, absent confidence,
malformed data, and incomplete responses. If the integration uses a different
confidence representation, establish its documented semantics before adapting it;
do not invent confidence to bypass this check. Preserve reported usage; missing
usage stays unknown, not zero. A response never grants execution authority.

Keep the same four-call task cap, count attempts before submitting them, reject
repeated observations, and stop after two actions without progress. Maintain a
small task-local receipt ledger if the existing integration lacks one. State the
adapter's real timeout behavior. No automatic provider failover or retry.

## Bundled client boundary

`scripts/decide.py` implements Cloudflare only. Its environment variables and
Wrangler option do not configure other providers. For another method, use the
existing host tool or its documented adapter; an unsupported method needs an
adapter before live execution, not a pretend endpoint switch.

The client exports `payload`, `parse`, and `reserve` for Python integrations.
`payload` produces a Cloudflare-shaped body; adapt its logical question to the
other provider's schema. `parse` accepts a direct JEV result or known Cloudflare
envelopes; normalize other envelopes first. `reserve` records an attempted call
and rejects repeats. Use these helpers when they fit rather than duplicating
validation. Keep provider secrets out of observations and receipts.

Verify a new connection with one non-sensitive decision and an independent
expected answer. Check its failure behavior before delegating a sequence. Record
which transport was actually tested; Cloudflare tests do not certify other hosts.
