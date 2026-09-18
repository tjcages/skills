# Supervised computer use

Use the host's installed browser/native automation tools and their documented
APIs. Prefer API/DOM/accessibility locators over screenshots when available. A
skill cannot create tool access, bypass a runtime restriction, or run a hidden
computer-control loop by itself.

The supervisor observes controls and constructs a literal action map, e.g.
`open_composer -> click the currently observed link named Composer`. Send only
IDs and compact descriptions to JEV. Keep executable locators in the host.

1. Capture the current URL/app identity and relevant controls.
2. Offer safe actions with distinct descriptions and a measurable goal.
3. Ask JEV only if choosing needs semantic judgment; a known link needs no call.
4. Re-observe before execution. If the page changed, a target disappeared, or a
   locator is ambiguous, discard the decision. Never reuse stale coordinates.
5. Execute exactly one mapped action through the authorized runtime. Read back
   the URL, heading, control state, or saved artifact that proves the outcome.

For batches, use a deterministic executor only if the host explicitly supports
it. Supply an allowlist, a fresh observation before every decision, time/call
limits, and independent postconditions. Otherwise use supervised single steps.
Do not call a sequence unattended when the main agent intervened between steps.

For native recordings, reuse the project's capture/Device Hub/XCTest tooling.
JEV may choose a known recovery from compact diagnostics. It cannot assess Liquid
Glass quality from a text status, synthesize native touches, or certify a video.
Keep human physical-device captures and visual acceptance separate from pass/fail.
