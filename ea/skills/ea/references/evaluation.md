# Evidence and release status

Version 0.2.1 is a supervised decision assistant. It is not a proven unattended
computer operator and has no measured net Astra savings.

Retained pilot evidence (before packaging):
- Native capture: one injected recording failure recovered; one JEV call,
  454 input / 50 output tokens, 1269 ms. Native tooling executed the actions.
- Catalog navigation: three JEV calls, 1496 input / 187 output tokens, 2913 ms
  total provider latency. One ambiguous step escalated and the supervisor used
  deterministic search. Final URL and heading independently verified.

These demonstrate bounded decisions on two tasks, not general reliability.
Do not present historical pilot results as tests of changed code.

For each new adapter, test: successful choice, low confidence, unknown action,
malformed result, provider error, exhausted calls, repeated observation, stale
target, and independently verified success. Negative tests should demonstrate
that no unauthorized action executes. The bundled tests cover the decision
client; host execution and visual quality need their own evidence.

Before claiming savings, run comparable tasks with and without delegation:
record task success, primary-model tokens (including observation preparation and
verification), JEV tokens, tool round trips, elapsed time, retries, interventions,
and actual priced cost if available. Keep raw task data private. Report a measured
comparison; cheap provider calls alone do not demonstrate overall savings.

Provider selection is portable guidance. The bundled executable transport and live
provider tests cover Cloudflare only. Verify any other connection independently
before claiming it works; the skill does not bundle a Vercel or direct TypeSafe client.
