# EXAMPLES — behavior-contracts dogfood

## 2026-07-21 — Obi web↔iOS drift + Tasks macOS (issue evidence)

**Context:** Socials tree private. Dogfooded against Linear evidence + manifesto Part IX.

### Contracts drafted from evidence

**1. Asset / lightbox** (inventory audit warning + OFF-17)

| Verb | iOS | Web |
|---|---|---|
| Open | present (Lightbox.swift) | present (archive/lightbox.tsx) |
| Zoom / drag dismiss | present | **partial / drift risk** |
| Copy / save / share | present | **audit needed** |

**Contract one-liner:** *An asset can be opened, zoomed, dismissed, copied, saved, shared — same action set everywhere it appears.*

**2. Board composer entry** (Tasks OFF-176 / OFF-170)

| Verb | iPhone Tasks | macOS Tasks |
|---|---|---|
| Create to-do from board shell | present (`TasksBarView`) | **missing** — bar never mounted |
| Create folder | present | present (rail ＋ only) |

**Contract one-liner:** *Every shell that shows the to-do board mounts a composer entry that can create a to-do (not only a folder).*

**3. Space view** (OFF-34 shipped)

| Verb | iOS GroupView | Web space view |
|---|---|---|
| See synthesis + pins + IN/OUT | present | present (rebuilt) |

Safer reference — parity work that *did* follow a shared shape.

### Rubric (Obi/Tasks multi-platform today): **8/16**

| # | Score | Note |
|---|---|---|
| 1 WHAT/HOW split | 2 | Manifesto Part IX explicit |
| 2 Contracts for load-bearing forms | 1 | Implied in manifesto; not a checklist doc |
| 3 Verbs testable | 1 | Auditable from issues, not installed |
| 4 Kit owners linked | 1 | Known paths in audit; not centralized |
| 5 No silent forks | 0 | Dual lightboxes called out; macOS mount hole |
| 6 Drift audit this phase | 1 | This EXAMPLES pass; not in-product ritual |
| 7 Multi-platform ship rule | 1 | Roadmap says ship together; Tasks-macOS lagged |
| 8 Sparkle rule | 1 | Stated in Part IX; not operationalized |

**Load-bearing zero:** #5 forks/mount holes → not contract-ready until lightbox convergence + composer mount are filed/fixed.

**Friction → methodology same day:**

1. **Shared SwiftUI views ≠ satisfied contract** if the shell forgets to mount them (OFF-176) → §5 macOS trap.
2. **OFF-17 “formalize contracts”** is exactly this pack’s install step — Phase 4 shouldn’t invent a different format.
3. Screenshot parity would have missed “cannot create a task at all.”

**Next dogfood:** live kit path walk when Socials is mounted; or install `docs/behavior-contracts.md` on Tasks with composer + row verbs.

## 2026-07-21 — visual-cursor in-repo contracts draft (🔁 prep)

**Context:** Single-kit Tool today. Authored contracts *before* a hypothetical second surface (webview). File: `behavior-contracts/dogfood/visual-cursor-contracts.md`.

**Contracts:** stamp/locate · composer · agent turn · key setup — verbs testable from README + source.

**Rubric (prep / single kit): 10/16**

| # | Score | Note |
|---|---|---|
| 1 WHAT/HOW split | 2 | Stated in dogfood doc |
| 2 Contracts for load-bearing forms | 2 | Four contracts |
| 3 Verbs testable | 2 | Checklist form |
| 4 Kit owners linked | 1 | Vite/React paths named; not in product tree |
| 5 No silent forks | 2 | One kit only |
| 6 Drift audit this phase | 1 | Table in dogfood doc |
| 7 Multi-platform ship rule | 0 | N/A until surface #2 — scored 0 load-bearing for multi-platform claim |
| 8 Sparkle rule | 1 | Theme tokens exist; not contract-linked |

**Load-bearing for multi-platform v1:** still need contracts **installed in a product repo** + ≥2 kits. This pass proves the pack can author installable contracts from a live Tool tree.

**Friction:** Don’t force multi-platform ship rule on single-kit Tools — §1 skip still wins; contracts are optional prep.
