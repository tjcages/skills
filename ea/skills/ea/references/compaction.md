# Comment selection and context compaction

Use JEV to select relevant records for a host-owned packet when semantic relevance
is the expensive step. Known duplicates, exact status filters, and short comment
lists do not need a model call. Selection does not summarize or resolve a comment.

## Current Codex task

EA cannot replace Codex's internal conversation compaction. No such hook is
exposed by this skill or the tools available in this task. Do not install a Claude
Code hook and report Codex compaction as enabled.

For comments or handoff material that the host can read and write:

1. Keep the original export. Assign stable IDs and retain links to each source.
2. Keep user instructions, approvals, unresolved actions, conflicting feedback,
   acceptance status, and recent decisions outside JEV's optional selection pool.
3. Send only task-relevant, redacted candidate excerpts to the selected connection.
   Present a small menu of candidate groups, including keeping all candidates.
4. Use the existing bounded decision client. Verify the selected originals before
   assembling a packet; retain verbatim content and an omitted-ID index.
5. On uncertainty, failure, or insufficient savings, retain the originals. Never
   treat omitted material as resolved or authorized for deletion.

The supervisor writes any necessary summary. JEV selects IDs; it does not generate
free-form summaries. Original records remain available for later retrieval.

### Try a non-sensitive example

From the installed EA directory:

```sh
python3 scripts/decide.py examples/comment-selection.json \
  --scope comment-selection-demo --dry-run
```

For the configured Cloudflare connection, add a task-local ledger and remove
`--dry-run`; use [connection setup](cloudflare.md) for credentials. Other configured
connections use the same bounded action contract. Expected choice: `include_c2`.
The host still verifies C2 and includes the pinned C1 and C4. Nothing writes or
resolves comments. This small fixture tests routing; it does not establish savings.

## Existing third-party compaction integration

[Fast Jev Compaction](https://github.com/tamaratran/fast-jev-compaction/tree/e3f262a7f4d42bd8dd32ced30d26176f7cb545b0)
is already catalogued as `fast-jev-compaction`. It is an MIT-licensed npm library
and Claude Code plugin, not a standalone SKILL.md. The inspected revision is
`e3f262a7f4d42bd8dd32ced30d26176f7cb545b0`.

The library scores tool-call/result retention. The Claude adapter uses
`session.compact` and early-access function hooks. Its default transport is
TypeSafe direct; the library exposes `JevAsker` for custom transport. The inspected
Claude adapter does not expose a Cloudflare connection setting. An existing
Cloudflare preference is not permission to silently use direct TypeSafe.

Before activating it in a compatible host, verify that host's hook support,
inspect the pinned source, and test on a non-sensitive transcript. The default
plugin sends conversation text and tool inputs; tool outputs are represented by
size/status notes. Requests may split into concurrent batches, repeating the
state. This differs from EA's four-call cap and compact redacted observations.
Do not activate it for private transcripts until those differences are addressed.

Keep source review, fixture testing, host integration, and live acceptance separate.
The catalogue entry remains on hold for automatic hook installation. No hook was
installed, no real transcript was sent, and no Codex compaction behavior changed.

## Local evidence — 2026-09-18

The synthetic comment fixture returned `include_c2` through the existing
Cloudflare connection: JEV 1.13.0, confidence 0.9, 609 input tokens, 63 output
tokens, 1,664 ms client latency. The supervisor checked that C2 is the only optional
comment about disabled-button contrast. C1 and C4 remain pinned by the host.
No comments were modified. This verifies one relevance choice, not transcript
retention quality, upstream plugin integration, or comparative cost savings.
