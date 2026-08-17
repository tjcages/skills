# Orchestrator skill quality bar

**Snapshot:** 2026-08-17

**Reference:** [dmmulroy/anti-slop](https://github.com/dmmulroy/anti-slop)

**Purpose:** Preserve the architectural benchmark used to harden orchestrator v0.1.

## Finding

Anti-slop's quality comes from the complete delivery system around its skill, not from prompt length. Its agent instructions sit beside canonical implementation source, bundled runtime assets, a safe deterministic installer, focused positive and negative tests, asset-drift checks, one verification command, CI, and explicit installation and maintenance documentation.

The orchestrator skill is behavioral rather than an Oxlint installer, so the domain mechanics do not transfer directly. The quality standard does.

## Adopted standard

| Anti-slop trait | Orchestrator equivalent |
|---|---|
| Canonical `src/` | Canonical `shared/`, `src/`, and `examples/` |
| Bundled skill assets | Self-contained `skills/orchestrator/` |
| Asset sync check | `scripts/sync-skill-assets.mjs --check` |
| Deterministic rules | Machine-readable target ledger validator |
| Valid/invalid RuleTester cases | Positive and negative conformance fixtures |
| `pnpm check` | `node orchestrator/scripts/verify.mjs` |
| Path-scoped CI | `.github/workflows/orchestrator.yml` |
| Install/migration README | Install, upgrade, source-of-truth, and lifecycle guidance |

## Non-transferable parts

- Oxlint implementation and TypeScript-specific rules
- Plugin vendoring into application repositories
- Dependency version discovery for Oxlint packages
- Lint-configuration merging

Orchestrator instead validates the state that can be represented mechanically: identity, ownership, transitions, evidence fields, dependency integrity, write claims, authority gates, blockers, integration checks, and completion conditions.

## Proof boundary

The conformance harness can prove that a ledger is internally consistent. It cannot prove that:

1. a worker's evidence is true;
2. the root reproduced the right real-world workflow;
3. the decomposition was strategically good;
4. user intent was interpreted correctly;
5. multi-agent behavior survives real latency, failure, and context compaction.

Those remain live-dogfood requirements. The pack stays at ✍️ draft until two independent runs pass the release rubric.

## Acceptance checklist for future skill changes

- [ ] Installed skill contains no links outside its own directory.
- [ ] Canonical and installed assets match exactly.
- [ ] Every enforceable invariant has a negative conformance case.
- [ ] Every allowed recovery path has a positive conformance case.
- [ ] One command validates metadata, links, assets, fixtures, and example ledger.
- [ ] CI runs that command for every relevant change.
- [ ] README states install, upgrade, authority, proof, and lifecycle boundaries.
- [ ] Live dogfood remains separate from structural conformance.
