# EXAMPLES — lossless-migration dogfood

## 2026-07-21 — Obi inventory audit as worked example (docs)

**Context:** Socials git private in cloud env. Dogfooded methodology clarity against Linear-mirrored [Step-Zero Inventory Audit](https://linear.app/off-brand-studio/document/step-zero-inventory-audit-b4f1eb4d2943) + [Migration Roadmap](https://linear.app/off-brand-studio/document/migration-roadmap-effbf53b4f6f).

**Does the published audit satisfy §9?**

| # | Score | Note |
|---|---|---|
| 1 Constitution exists | 2 | Manifesto mirrored; doors named |
| 2 Full inventory buckets | 2 | Data, endpoints, engines, components, retires |
| 3 Every row tagged | 2 | Legend applied throughout |
| 4 GAP list explicit | 2 | §5 nine gaps with live status |
| 5 RETIRE list explicit | 2 | board/categories/admin/shadow columns + phases |
| 6 Verdict buckets % | 2 | ~80% reframe / consolidate / GAP / RETIRE |
| 7 Roadmap derives from audit | 2 | Phases 0–5 match invisible→IN→OUT→scrub |
| 8 Phase doctrines written | 2 | Cleaner / no parallel / lossless / platforms / accept-gated |

**Rubric: 16/16** on the reference audit (expected — it’s the extraction source).

**Friction absorbed into methodology same day:**

1. **Headline % upfront** (“~80% reframe”) — fold into §0 + §4.3 as required verdict, not optional color.
2. **Engine table is its own section** — Obi’s ~14→6 collapse is the load-bearing consolidate move → §5 elevated, not buried in endpoints.
3. **GAP status drifts** — audit must allow status annotations (shipped/partial/queued) or it goes stale; noted in §4.4.
4. **Doctrine line “Optimistic everywhere, accept-gated for Obi”** — cross-link `accept-gated-ai` so optimistic UI isn’t misread as ungated AI writes (§6.7).

**Not yet dogfooded:** authoring a *new* inventory for a different repo with this pack (v1 exit criterion).

## 2026-07-21 — Methodology self-check vs Tasks split

Tasks extracted from Obi without a fresh inventory-audit doc in Linear. **Score if we pretended Tasks had no audit: 2/16** (constitution partial, no destination tables).

**Lesson:** product splits inherit loss risk — run a thin audit at split time (which tables/endpoints/UI move vs stay shared) or accept unnamed RETIRE risk. Folded as anti-pattern “parallel new app” reminder in §8.

## 2026-07-21 — visual-cursor module inventory (non-Obi) — 🔁 slice

**Scenario:** prepare a lossless split of `cursorAgent` middleware into a reusable package without losing stamp/overlay behavior. Authored fresh audit rows (not copying Obi).

### Inventory (src + examples)

| Row | Tag | Destination note |
|---|---|---|
| `stamp.ts` + tests | **ENGINE-TOOL** | Stay in visual-cursor; data-loc transform |
| `client.tsx` overlay + ring | **PRIMITIVE** | Stay; ⌘-hover surface |
| `panel.tsx` composer | **PRIMITIVE** | Stay; multi-thread chat UI |
| `theme.ts` | **INFRA** | Kit tokens for overlay |
| `key-setup.tsx` | **INLET** | API key capture UI |
| `agent.ts` middleware | **ENGINE-TOOL** | **Candidate extract** → `@visual-cursor/agent` or shared |
| `index.ts` public API | **VIEW** | Re-export glue; update after split |
| `examples/vite-react` | **VIEW** | Showcase; must keep working |
| CI / changesets / release.yml | **INFRA** | Stay; release both packages if split |
| Loopback/CSRF guards in agent | **INFRA** | Move *with* agent extract — do not drop |
| Undo/redo snap stacks | **FACET** of agent engine | Move with agent; contract: ⌘Z still works from overlay |

**GAP:** none for current product (single package ships). **RETIRE:** none yet — do not delete in-tree agent until extracted package is the only caller.

**Verdict buckets (rough):** ~70% stay / reframe-in-place · ~20% consolidate-into-extract · ~10% INFRA · 0% RETIRE this phase.

### Rubric (slice audit): **12/16**

| # | Score | Note |
|---|---|---|
| 1 Constitution exists | 1 | README-as-North-Star; no full constitution |
| 2 Full inventory buckets | 2 | Modules + example + release infra |
| 3 Every row tagged | 2 | Legend applied |
| 4 GAP list explicit | 2 | Empty GAP = explicit |
| 5 RETIRE list explicit | 2 | Empty until extract live |
| 6 Verdict buckets % | 2 | Stated above |
| 7 Roadmap derives from audit | 1 | Phase sketch only (below) — not a full roadmap doc |
| 8 Phase doctrines written | 0 | Tool slice; doctrines light |

**Phases (sketch):** 0 keep monolith green · 1 extract agent package behind same `cursorAgent()` API · 2 point overlay at package · 3 RETIRE in-tree duplicate only at zero callers.

**Friction:** Tool libraries still benefit from destination tags before “extract middleware” PRs. Rubric #1/#8 stay soft without constitution — don’t invent one mid-audit.
