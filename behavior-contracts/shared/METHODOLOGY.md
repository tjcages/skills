# Behavior Contracts Methodology

**Version:** 0.1.0 — extracted from Socials/Obi manifesto Part IX (Primitive Law) + web↔iOS/macOS parity practice (lightbox, group picker, Tasks-macOS), 2026-07-21

> **What this is.** How multi-platform products stay *behaviorally* one product: write a **platform-neutral behavior contract** per form/primitive, let each kit satisfy it natively, and audit **contract drift** — not screenshot sameness or code diff.
>
> **The differentiator.** Most “parity” work means “make it look the same” or “share more code.” What’s missing is the *promise*: what a user can *do* with an asset / to-do / composer on every surface. Kits may look different; they may never behave differently.
>
> **Target user.** Anyone shipping the same product on ≥2 of web / iOS / macOS / Android with separate presentation kits.

---

## 0. Core thesis

**Behavior is part of the definition.** An asset is not “bytes.” An asset *is* `{bytes + how it opens + the lightbox + the long-press + the menus + how it's shared}`. A to-do *is* `{data + the check + date/reminder affordances}` — identical capability on every page, forever.

Two registries stack:

| Floor | Owns | Lives where |
|---|---|---|
| **WHAT** | Domain model (forms, fields, relations, agent tools) | Constitution / domain docs |
| **HOW** | Presentation + interaction per platform | iOS kit / web design system / macOS shell |

They compose: the form says *what*; the kit says *how it shows up*. Neither duplicates the other.

**Behavior contracts** sit at the WHAT layer as platform-neutral promises. Each HOW kit must satisfy them. Drift is a contract failure, not a “nice-to-have polish” ticket.

---

## 1. Step zero — do you need this?

| Signal | Move |
|---|---|
| Single platform forever | Skip. Say so. Kit docs are enough. |
| Second surface starting (web+iOS, iOS+macOS, …) | **This pack** — write contracts *before* the second kit invents behavior. |
| “Parity” tickets already piling up | Audit with §7; you are late but salvageable. |
| Want one shared React Native / Compose codebase | Orthogonal — shared code ≠ contract; still write promises. |

If no manifesto names forms/primitives, run `manifesto` first (or a thin WHAT registry). Contracts need nouns to hang on.

---

## 2. What a contract is (and isn’t)

**Is:** a short, testable list of user-capable verbs for one form or primitive.

Example — **asset / lightbox:**

> An asset can be: opened · zoomed · dismissed · copied · saved · shared. Long-press exposes the same action set everywhere the asset appears.

Example — **to-do row:**

> A to-do can be: created · completed/uncompleted · rescheduled · filed to a folder · archived · undone. Composer entry exists on every shell that shows the board.

**Isn’t:**

- Pixel-identical UI
- Shared component source (helpful, not the contract)
- A vibe (“feels native”) without verbs
- Platform API laundry lists (`UISwipeActionsConfiguration`, …)

**Look different, behave the same.** Native materials and layout are encouraged. Missing verbs are bugs.

---

## 3. Where contracts live

Prefer one of:

1. **In the manifesto** — Part IX-style: each form gets a one-line contract (Obi pattern).
2. **`docs/behavior-contracts.md`** — table of form → verbs → owning kit files → drift notes.
3. **Per-primitive doc** next to the kit — only if the index in (1) or (2) still lists them.

Always link from agent instructions. An unlinked contract is decoration.

---

## 4. Authoring procedure

For each form / load-bearing primitive:

1. **Name it** (asset, to-do, capture commit, morning proposal card, …).
2. **List verbs** the user must always be able to perform (≤12; split if more).
3. **Note invariants** (e.g. “committed thought is changelog-immutable”; “accept shows diff”).
4. **Point to kit owners** — iOS file(s), web file(s), macOS shell mount points.
5. **Mark 90/10** — which verbs are system-standard vs product “sparkle” (still built from kit tokens).
6. **Write one parity check** — how an agent/human verifies (manual script or E2E name).

Do **not** invent verbs the product doesn’t want. Contracts describe *promised* behavior, not a competitor’s feature list.

---

## 5. Satisfaction rules (per kit)

Each platform kit must:

1. Implement every verb (or document an **explicit carve-out** with owner + date — rare).
2. Reuse one primitive — **generalize, never fork** a second lightbox/composer.
3. Evolve centrally — improve once, everywhere.
4. Keep sparkle *on top of* tokens/springs/materials — never a parallel design language.
5. Ship multi-platform in the same phase when the contract is new (`lossless-migration` doctrine).

**macOS / iPad traps:** iPhone-shaped shells that forget to *mount* the composer/bar (Tasks OFF-176) are contract failures even when shared views exist.

---

## 6. Drift audit protocol

Cadence: when adding a surface, before a multi-platform release, at phase boundaries.

1. Pick the contract list (or author missing ones — §4).
2. For each verb × platform: **present / partial / missing**.
3. Score §8. Missing verbs on a shipped platform = load-bearing zeros.
4. File gaps (search-before-create). Prefer “satisfy contract: lightbox share on web” over vague “parity.”
5. Log friction in EXAMPLES.md same day.

**Audit contract drift, not code diff.** Two kits can share zero lines and still pass.

---

## 7. Known failure modes (from Obi / Tasks)

| Failure | Example | Fix |
|---|---|---|
| Two lightboxes | `archive/lightbox.tsx` vs `Lightbox.swift` diverge | One contract; each kit implements; delete the worse path |
| Shared views, missing shell mount | Tasks-macOS never mounts `TasksBarView` → cannot create | Contract includes “composer entry on every board shell” |
| Web-only or iOS-only phase | Feature lands one side | Phase doctrine: platforms together |
| Parity = screenshot match | Wastes time; misses verbs | Verb checklist (§4) |
| Forked “temporary” primitive | Second group picker | Generalize the first; forbid the second |
| Carve-outs without dates | Silent permanent holes | Time-box or reject |

---

## 8. Readiness rubric

Score 0 / 1 / 2. Max 16. **≥12 and no load-bearing 0 on #1–#5** = contract-ready for multi-platform work.

| # | Dimension | 2 = |
|---|---|---|
| 1 | WHAT/HOW split stated | Constitution or kit docs name both floors |
| 2 | Contracts exist for load-bearing forms | Asset, to-do, and primary composer at minimum |
| 3 | Verbs are testable | Checklist an agent can run |
| 4 | Kit owners linked | Path per platform |
| 5 | No silent forks | One primitive per job per kit |
| 6 | Drift audit run this phase | §6 table exists |
| 7 | Multi-platform ship rule | Same-phase or explicit sequenced carve-out |
| 8 | Sparkle rule understood | Magic uses kit tokens; not a second language |

---

## 9. Dogfood protocol

1. Prefer a product with ≥2 surfaces and known pain (Obi web↔iOS, Tasks iOS↔macOS).
2. Author or extract 2–3 contracts; score §8 against live behavior (or issue evidence if tree private).
3. Log EXAMPLES.md same day.
4. v1 exit: one full drift audit that filed real gaps + contracts installed in-repo.

---

## 10. Open gaps

- [x] Template `shared/behavior-contracts.template.md` — 2026-07-21
- [ ] Machine-checkable E2E mapping (verb → test id)
- [ ] Android / second mobile toolkit examples
- [ ] Live Socials kit file paths when tree mounted
- [ ] Relationship to design-system tokens packs — compose, don’t replace
- [x] In-repo contracts draft (visual-cursor dogfood) — still need product-tree install + ≥2 kits for v1

---

## 11. Relationship to other skills

- **manifesto** — owns WHAT registry / where contracts may live.
- **lossless-migration** — Phase “platforms together” + primitive mapping tags.
- **accept-gated-ai** — accept/diff/undo are verbs that belong on AI-proposal contracts.
- **behavior-contracts** (this) — HOW parity promises; not visual QA.
- **agent-worktrees** — orthogonal (repo isolation).
