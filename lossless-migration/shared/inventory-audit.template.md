# Inventory audit template

> Copy to `docs/inventory-audit.md`. Run `lossless-migration` before rewriting.
> Every row needs **exactly one** primary destination tag.

## Headline verdict

_~X% reframe / consolidate / GAP / RETIRE — say it upfront._

## Legend

| Tag | Meaning |
|---|---|
| ENTITY | Canonical record |
| FACET | Property on that record |
| FORM | Shape discriminator |
| RELATION | Wire between records |
| ENGINE-TOOL | Collapses into one tool registry |
| INLET | Capture / ingestion |
| VIEW | Projection |
| OUTLET | Publish / export |
| PRIMITIVE | Presentation with behavior |
| INFRA | Auth, queues, OAuth, CI |
| GAP | Constitution needs it; missing |
| RETIRE | Drop when replacement live + zero callers |

## Tables / data

| Row | Tag | Destination note | Status |
|---|---|---|---|
| | | | |

## Endpoints / APIs

| Row | Tag | Destination note | Status |
|---|---|---|---|
| | | | |

## Engines / agents

| Row | Tag | Destination note | Status |
|---|---|---|---|
| | | | |

## Components / UI primitives

| Row | Tag | Destination note | Status |
|---|---|---|---|
| | | | |

## GAP list

| Gap | Why manifesto needs it | Status |
|---|---|---|
| | | |

## RETIRE list

| Thing | Replacement | Zero-callers check | Phase |
|---|---|---|---|
| | | | |

## Verdict buckets (%)

| Bucket | % | Notes |
|---|---|---|
| Reframe | | |
| Consolidate | | |
| GAP | | |
| RETIRE | | |

## Phase doctrines _(short)_

1. Cleaner each phase
2. No parallel systems past the cutover
3. Lossless — RETIRE only after live replacement
4. Platforms together when multi-kit
5. Accept-gated for AI writes (see `accept-gated-ai`)
