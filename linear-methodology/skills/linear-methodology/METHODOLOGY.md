# Linear Tracking Methodology

**Version:** 1.0.0 — see [CHANGELOG.md](../../CHANGELOG.md)

> **What this is.** The methodology behind how an AI agent should set up and maintain Linear tracking for a software project — validated on multiple real builds, then packaged as Agent Skills. This is the source doc the skills follow.
>
> **The differentiator.** Most Linear skills teach an agent *how to call Linear* — CRUD wrappers, auth, GraphQL. Linear MCP already does that. What's missing is *how to track a project well* — the methodology, not the mechanics.
>
> **Target user.** Someone running concurrent projects who wants each one properly tracked without designing the scheme from scratch every time, and without tracking decaying into busywork disconnected from why the project exists.

---

## 0. The core thesis

Tracking infrastructure without a shared theory of the product decays into a pile of tickets nobody trusts. The fix isn't a better ticket template — it's **anchoring the tracking structure to a North Star document**, so every phase, milestone, and issue is a *derivation* of something true about the project, not an invention of the tracking tool.

This is not a new idea invented for Linear — it's what already worked for Obi (`docs/manifesto.md` → `docs/inventory-audit.md` → `docs/migration-roadmap.md`, then Linear mirrors + derives structure from that trio). The methodology generalizes that pattern.

§0–§16 are the core methodology. **§17–§26 (Extended guidance, v1.1 round-out)** turn it into a repeatable system — a project-shape decision tree (§17), a scoreable readiness rubric (§18), a runnable self-audit (§26), plus anti-patterns, cadence, migration, and taxonomy guardrails. Reach for them when you need the operational version of the principle a core section states. Worked before/after transformations live in [EXAMPLES.md](./EXAMPLES.md).

**Automation-first, manual setup is an acceptable one-time cost.** Wherever the API/MCP can do something, it should — the goal is agents managing the tracking day-to-day, not a human re-doing setup steps per project. A handful of one-time manual clicks (creating a Cycle scheme, a label taxonomy, an Initiative) is fine; *recurring* manual burden is the thing to design away.

---

## 1. Step zero — is this project already tracked, and does a North Star document exist?

### 1a. First, always: is a Linear project already connected here?

This check comes **before everything else in this document**, including §1b below. Bootstrapping fresh and extending an already-tracked project are different operations with different risk profiles, and getting this wrong first is how a well-meaning setup pass corrupts someone's real, in-use workflow.

- **Detect before assuming.** Search for an existing Linear project matching this codebase — by repo name, by asking the user directly ("is there already a Linear project for this?"), or both. Never assume a blank slate just because no one mentioned Linear.
- **If nothing exists — proceed to §1b and the rest of the methodology normally.** This is the fresh-bootstrap path everything else in this doc assumes by default.
- **If a Linear project already exists, STOP and shift into discovery mode, not setup mode:**
  1. **Enumerate what's already there** before proposing anything: existing issues (open and closed), milestones/cycles, labels, documents, status-update history. Read it, don't just count it — understand what workflow is already in motion. **Then check the repo itself for what isn't there yet** — a fully-tracked project can still have an entire second track (another plan/roadmap doc in `docs/`) that was never mirrored (§4, backfill algorithm step 7). "Already tracked" describes the project, not necessarily every initiative inside it.
  2. **Present a summary to the user, not a plan of action yet.** "Here's what I found: N open issues, M milestones named X/Y/Z, labels A/B/C, no Documents. Here's my read on how it's currently organized." Let the user correct a wrong read before anything gets written.
  3. **Ask explicit yes/no questions before any write, category by category.** Do not bulk-apply this methodology's conventions on top of an existing structure. At minimum, confirm separately:
     - Should new work extend the *existing* milestone/label structure, or does the user want it reorganized to match this methodology's conventions?
     - Is retroactive backfill (§4) wanted at all, or is the existing issue history already the record of truth?
     - Are there existing issues/milestones that are off-limits — owned by someone else, mid-flight, or otherwise not to be touched?
     - OK to add labels to *existing* issues, or leave them exactly as they are and only label new ones going forward?
     - OK to mirror North Star docs as Linear Documents (§1b), or is that redundant/unwanted here?
  4. **Never bulk-create issues that might duplicate what's already there.** Search before every single create (§4 already states this as a general rule — for an already-tracked project it's not optional, it's the headline risk). When in doubt whether something's a duplicate, ask rather than create.
  5. **Default to the most conservative interpretation of "extend."** If the existing structure conflicts with this methodology's conventions (different label taxonomy, Cycles instead of Milestones, no phase structure at all), the default move is to **adapt to what's already there**, not migrate it to match this doc. Propose a migration only if the user asks for one, and treat that as its own explicitly-confirmed, higher-risk action — not a side effect of routine setup.
- **The failure mode this guards against:** an agent that treats "let's set up Linear tracking" as always meaning "bootstrap from zero," and in doing so duplicates issues, reorganizes milestones somebody was already relying on, or otherwise steps on a live workflow. Being fast here is not a virtue — the fresh-bootstrap path (the rest of this document) can move quickly because there's nothing to break yet. This path has something to break, so it moves in confirmed, reversible steps.

### 1b. Then: does a North Star document exist?

Before touching Linear structure at all (having established in §1a whether that's a fresh setup or an extension), check for a **project constitution** — the doc that states, independent of what's built yet: what this is, who it's for, what's non-negotiable, what "done" philosophically means.

- **If it exists** (a manifesto, a README-as-vision, a strategy doc) — read it fully before designing any Linear structure. It is the thing every later structural decision gets judged against.
- **If it doesn't exist** — this is a fork in the methodology, and the skill needs an opinion here:
  - **Don't silently skip it and jump to ticket-filing.** A tracking scheme built on nothing decays fastest.
  - **Don't force a heavyweight doc-writing exercise on every trivial project either.** Calibrate to project size — a weekend script doesn't need a 12-part manifesto.
  - The right move: **ask a small number of anchoring questions** and write a lightweight North Star doc from the answers if none exists and the project is substantial enough to warrant one. Skip this step outright for genuinely small/disposable projects — use judgment, and say so to the user rather than silently deciding.

**The anchoring questions** (the small set to ask when no North Star doc exists):
1. One-sentence pitch — what is this?
2. Who is this for?
3. 3–5 non-negotiables — what's true regardless of what's built yet?
4. What's explicitly out of scope?
5. **What is the user actually trying to achieve by tracking this** — not the product's goal, the *user's* goal for using Linear at all. (For the reference implementation, the answer was *consistent release cadence* — see §9. This single answer shapes how the whole tracking scheme should behave, not just what it contains.)
6. **Project type** — see §2. This is foundational enough to ask alongside the rest, not decided later.

**Companion docs**, when the project is a migration or has real architectural complexity (mirrors what worked for Obi):
- A **proof/audit doc** — if migrating an existing codebase onto a new model, enumerate what exists and map each piece to its destination, so "nothing is lost" is provable, not just claimed.
- A **roadmap/plan doc** — the phased execution plan. This is what Linear's phase-milestone structure gets derived from 1:1.

These three (constitution / proof / plan) aren't Obi-specific — they're a generalizable pattern: **why → what's true today → what happens next.** Not every project needs all three; the constitution is closest to mandatory (for anything non-trivial), the other two are conditional on the project's shape.

---

## 2. Project type — the decision that predicts most of the rest

Ask this once, at setup, alongside the North Star doc. It maps directly onto the four Project Labels already in use (`Product` / `Tool` / `Drop` / `Marketing`) and predicts most of the downstream structural decisions in §3.

- **Product** — spans multiple platforms/mediums by nature: web, iOS, macOS, Android, others. Structural consequence: **area labels should be platform-based** (`iOS`/`Web`/`macOS`/`Android`/`Backend`, as relevant) because "which platform does this touch" is a real, recurring filter. Milestones are usually **phase-based** (an engineering roadmap), plus — once there's a public launch — a parallel **rollout/content-calendar track** and a **launch-readiness track** (§7, §8).
- **Tool** — typically single-platform (just macOS, just web, just a CLI). Structural consequence: **platform-split area labels are usually noise** — don't force the iOS/Web/Backend taxonomy onto something that only ever runs in one place. A Tool's area labels should reflect its actual internal seams instead (e.g. `parser`/`cli`/`ui`, or whatever modules it actually has).
- **Drop** — a quick, stunty, low-stakes push: a subtle social experiment, a one-off bit, something disposable by design. Structural consequence: **minimal structure on purpose** — likely just a short content-calendar (§8), no engineering-phase milestones, no launch-readiness track (§7). Over-structuring a Drop defeats the point of it — it's supposed to be fast and cheap to run.
- **Marketing** — durable marketing infrastructure and campaigns: a website, an event site (custom-built or not), sustained brand campaigns. Structural consequence: **track it with the same rigor as a Product/Tool**, not as an afterthought just because it's "marketing" — a custom event site is real engineering work and may need its own engineering-phase milestones (§3) plus a content-calendar layered on top (§8), not just the content-calendar alone.

**Rule of thumb (Product vs. Tool):** *does this project's identity require picking a platform, or does it stay whole across many?*

**Rule of thumb (Drop vs. Marketing):** *is this disposable by design — a stunt, an experiment, meant to be quick and low-stakes — or does it need durable infrastructure and sustained tracking, like a real site or an ongoing campaign?* Drop gets minimal structure on purpose; Marketing gets full structure because it's real, ongoing work.

---

## 3. Deriving Linear structure from the North Star (and the project type)

- **Milestones = the roadmap's phases, 1:1** (for Product/Tool projects with an engineering roadmap). Don't invent milestones that aren't in the plan; don't split or merge phases arbitrarily. If the roadmap doc changes, the milestones should be revisited, not left to drift.
- **Every genuinely separate timeline gets its own milestone set, never folded together.** A Product can have up to three concurrent tracks: engineering phases (§3), launch readiness (§7), and rollout content (§8) — conflating any of them makes all of them illegible. A Drop/Marketing project may be *only* the content track.
- **Target dates only with a real date signal.** Don't fabricate precision — a milestone with a made-up date is worse than one with none, because it reads as a commitment nobody made. (See §9 for how this becomes an accountability mechanism, not just metadata.)
- **Cycles vs Milestones:** most workspaces don't have Cycles (sprints) enabled, and the API can't create them. Default to Milestones for phase/theme grouping. If a workspace *does* have Cycles already, they're the right tool for genuinely time-boxed sprints — the two aren't mutually exclusive (Milestones = thematic phases; Cycles = time-boxes within them), but don't try to create Cycles programmatically; that's a manual-setup item (§11).

---

## 4. Breaking work into issues

- **Granularity is a real decision, not a default to assume.** Offer the choice explicitly when setting up tracking for the first time on a project (feature-level vs. changelog-level, similar to how this was asked for Obi) — don't silently pick one.
- **Retroactive backfill matters.** When adopting Linear on an existing codebase, mine what already exists (a roadmap's checkmarks, a changelog, git history) and file completed work as `Done` — starting the record from a blank slate erases real progress and makes the project look less mature than it is. This is a first-class step, not an afterthought.

  **The backfill algorithm (concrete procedure, not just the principle):**
  1. Enumerate every source of "what's already done" for the target project: a roadmap/plan doc with status markers, a CHANGELOG, a progress log, git log / merged PR history, a prior tracker's closed issues if one existed.
  2. Walk the highest-signal source first (usually the roadmap doc — it's already organized by phase) and extract one candidate completed item **per distinct shipped feature, not per commit** (granularity default from the bullet above).
  3. **Only mark something `Done` with real evidence** — a checkmark in a doc, a merged commit, an explicit "shipped" note. Ambiguous or partial items stay open, or get flagged to the user directly — never guess completion.
  4. File each as an issue in the correct phase milestone, `Done`, with a description that preserves the source material's own useful detail rather than paraphrasing it away.
  5. **Cross-check afterward:** the filed `Done` issues plus the open backlog should roughly reconstruct the full roadmap. A roadmap item with no corresponding issue (done or open) is a gap to fix before moving on — not something to skip silently.
  6. This is the single most valuable first pass on any pre-existing project — it turns "zero tracking" into "a full, provable history" in one session. (Reference scale: 24 retroactive `Done` issues from one read of Obi's roadmap doc.)
  7. **Don't assume the mirrored North Star doc(s) are the only roadmap-shaped doc in the repo.** A project can accumulate more than one active engineering track over time (a migration plan *and* a separate rewrite/feature plan living in the same `docs/` folder), and only one of them may have ever been mirrored into Linear. Before considering backfill complete, scan the repo's docs directory (not just the doc(s) already known to Linear) for other plan/status docs with their own phase structure — treat each genuinely separate track as its own milestone set (§3), never folded into an existing one. (Found on the Obi dogfood run, 2026-07-02: a second fully-built track, a native-editor rewrite, had zero Linear presence despite the primary migration-roadmap doc being fully mirrored and up to date.)
  8. **A doc's own "done"/"complete" claim is evidence, not proof — corroborate against the user before backfilling something that contradicts an existing tracked issue.** Docs can be aspirational, stale, or describe a plan that didn't fully land even when they read as confident status notes. If a source doc's claim would mean closing or contradicting an issue that's already open/in-progress in Linear, ask the user directly rather than trusting the doc text over the live tracker — the existing issue may reflect ground truth better than the doc does. (Found on the same run: a second doc claimed a feature was "one-for-one" complete, which would have meant closing an existing `Backlog` issue as `Done`; the user's own knowledge said that work was still in progress, contradicting the doc. Left the existing issue untouched and logged the discrepancy instead of resolving it unilaterally.)

- **Writing style — hard rules (owner feedback, 2026-07-02).** Tickets are for scanning, not reading:
  - **Titles:** plain words, ≤8 words, no codenames the reader must decode.
  - **Descriptions:** ≤3 sentences or ≤5 bullets. What it is, why it matters, evidence as one line (`Evidence: commit abc123`). Don't restate what the milestone, labels, or linked issues already say.
  - **Comments:** ≤3 lines. Link instead of recapping. State the change, not the story of making it.
  - **No marketing voice, no narrative filler.** "Native tasks + arrivals" beats a paragraph explaining both.
  - **Capture images while working, not after.** Anything visual (UI, boards, before/after) gets a screenshot attached at the moment it exists (§10) — an image replaces paragraphs.
- **Search before creating, always.** Check for an existing issue/document/project match before filing anything new.
- **The trivial/non-trivial line:** a real feature, fix, decision, or roadmap item gets an issue. A typo, config tweak, or comment-only change doesn't. When genuinely unsure, err toward filing — an extra issue is cheap; an untracked feature is drift.
- **Every issue gets a milestone.** An issue with no milestone is mis-filed.
- **Labels: minimum viable taxonomy, shaped by project type (§2).** 3–5 area labels is usually enough regardless of type. Resist creating a label for every dimension someone can imagine — an overgrown label taxonomy stops being scannable, which defeats the point.
- **Issue labels are team-scoped — in a many-projects-one-team workspace (§13), namespace a project's module labels under a label group.** A Tool's internal-seam labels (`stamp`/`agent`/`overlay`) are meaningless or actively confusing next to another project's issues in the same team. Linear label groups solve this cleanly and the API can create them (`create_issue_label` with `isGroup`, then `parent` on the children): one group named after the project, children = the module labels. Cross-project labels that genuinely mean the same thing everywhere (`Bug`, area labels like `iOS`/`Web` for Products) stay top-level. (Validated on visual-cursor, 2026-07-02.)
- **Wire real dependencies** (`blockedBy`/`blocks`) for genuine sequencing. This is what lets Linear itself show the critical path instead of it living only in a doc or someone's head — including sequencing *between* separate projects (§12).

---

## 5. Lifecycle discipline (already validated, unchanged from the Obi rollout)

`Backlog` → `In Progress` the moment work starts → `Done` only once actually shipped (merged, checks pass, and — for anything visible — verified running).

- Never skip straight to `Done`.
- Never leave active work sitting in `Backlog`.
- A session that starts something and can't finish it leaves the issue `In Progress` with a comment on what's left — never silently reverts it to `Backlog`.
- **Close the loop before ending a session.** If Linear-tracked work happened, the issue gets updated (state and/or comment) before the session ends. A session that ships something but leaves Linear stale is not done — this is the Linear-equivalent of a visual progress-log discipline, and the two should be thought of as one unit of "did the work AND recorded the work."
- **Bootstrap isn't done until the discipline is installed where future agents will actually read it.** The setup session knows these rules; the next session won't unless they're written into the repo's own always-loaded context — `CLAUDE.md` (Claude Code), `AGENTS.md` (Codex / many agents), `.cursor/rules/` (Cursor), or whichever file(s) this repo's agents load. The reference implementation used a "Linear tracking (non-negotiable)" section in CLAUDE.md, mirrored as a Linear Document. Without it, tracking goes stale the moment a different session ships work — observed on the visual-cursor dogfood run (2026-07-02), where new commits and WIP appeared within the hour of bootstrap from parallel sessions that had no tracking rule to follow, and the human had to notice and ask for a re-scan. Wiring the ruleset into the repo is a first-class bootstrap step, not a nice-to-have — with the team/project names, label set, and milestone scheme filled in per project.

---

## 6. North Star drift audits — staying on track over a long build

The manifesto is the constitution; the roadmap/state-of-the-union doc is current reality. Over a project's life — many phases, many sessions, possibly many agents — there's real risk of drifting from the original intent without anyone noticing: features accrete, scope creeps, the built thing quietly stops matching what was set out to build. **The whole point of writing a North Star doc first is to be able to catch this** — it's useless as a constitution if nobody ever re-reads it.

- **Cadence:** trigger a drift audit at natural checkpoints — the close of each phase/milestone, not an arbitrary calendar date. A phase boundary is a real inflection point; a fixed schedule isn't, and drifts out of sync with actual project rhythm. Long-running projects with infrequent phases may also warrant a longer-interval check (e.g. quarterly) as a backstop.
- **What it produces:** the same move that started the Obi migration, run recursively — reread the North Star doc, walk the shipped work since the last audit, and explicitly answer: does this still serve the thesis? Is there scope creep with no home in the manifesto? Should the manifesto itself deliberately evolve (rare, and should be a conscious edit — never silent drift), or should the built thing be corrected back toward it?
- **Where the output lands:** if it's a genuine health signal, it becomes a Linear project status update (§9); any corrective work identified gets filed as real issues, same as any other work. An audit whose findings don't land as tracked items is just a document nobody acts on.
- **Who triggers it:** the skill should proactively *suggest* a drift audit at milestone-closing time ("Phase N just closed — want a quick check against the North Star before starting Phase N+1?") rather than waiting to be asked.

---

## 7. Launch readiness — assets, infrastructure, and the exit plan

Distinct from both the engineering roadmap (building the thing) and the rollout content calendar (§8, announcing it) — this is the **operational checklist** of what has to exist before a launch can happen at all. Relevant to *any* project type with a public launch ahead of it — the launch goal, not the project type, is what triggers this track. (Validated on the visual-cursor dogfood run, 2026-07-02: a tiny 4-file `Tool` whose tracking meta-goal was "ship to npm and launch" got a full launch-readiness + rollout structure, and that was right — while a large `Product` with no launch ambitions would need none of this. The §1b question-5 answer decides, not the size or type.)

- **Asset inventory.** What needs to be created, and does it already exist: marketing images, video, a landing page or subpage, app-store screenshots/icons, a press kit. Enumerate this explicitly per launch — requirements genuinely differ between "ship a CLI tool," "ship an iOS app," and "ship a consumer web product," so don't assume a template applies unchanged.
- **Infrastructure.** Does a website already exist to hang this off of, or does one need to be built? Does it need a dedicated subdomain, or does it live as a subpage of something existing? Does this require an App Store / Play Store listing (developer accounts, review lead time, compliance forms)? These have **long lead times and hard external dependencies** (App Store review is not instant) — they belong on the roadmap early as real dated milestones, not a last-minute scramble discovered days before launch.
- **Structure this as its own milestone set** (e.g. "Launch Readiness"), sitting between the last engineering phase and the first rollout-content milestone — a third track alongside the engineering phases (§3) and the rollout calendar (§8), the same way Obi's Phase 0–5 track and its `Launch:` rollout track already coexist without being conflated.
- **The exit plan.** What does "launched" actually mean, and what happens after — a defined steady-state (an ongoing maintenance cadence), a defined wind-down, or does launch trigger the start of an entirely new phase? This deserves its own explicit milestone/issue ("Launch & exit plan") rather than staying implicit — a project without an articulated exit condition tends to just continue indefinitely without anyone deciding that on purpose.

---

## 8. Post-launch content & campaign structuring

Once launch-readiness assets exist, the **sequence and cadence of what actually goes out, and when**, needs the same tracked-structure treatment as engineering work. This generalizes what Obi's rollout milestones already do:

- **Model a campaign as a sequence of dated beats.** Launch announcement → +N follow-up (a feature spotlight, a behind-the-scenes) → +N more. The spacing between beats is a real decision (weekly cadence, react-to-metrics, etc.) — make it an explicit milestone-per-beat, don't leave it implicit in someone's head.
- **A repository of assets tied to each beat.** Every campaign-beat issue should carry (via the automatable attachment flow, §10) the actual creative for that beat — the image, the copy draft, the video — so the campaign plan is self-contained evidence rather than a plan that references assets living somewhere else.
- **This is exactly the `Drop`/`Marketing` project-type shape (§2), but the two aren't identical here.** A quick stunt/experiment is a `Drop` — a lightweight Linear project that's *just* this content-calendar, minimal structure, fast to spin up and tear down. A durable campaign with real infrastructure behind it (a custom event site, sustained multi-week brand work) is `Marketing` — it gets the content-calendar *plus* its own engineering-phase milestones (§3) for the infrastructure build, tracked with full rigor. Either way, if the campaign lives inside a Product's own Linear project instead of as its own, keep it a clearly separate milestone set, never merged into the engineering phases.

---

## 9. Accountability & release cadence

Two different audiences, two different channels — don't conflate them:

- **Linear status updates** (project health: onTrack/atRisk/offTrack + summary) are for **async/other-stakeholder visibility** — reserved for real milestone moments: a phase completing, a health change (newly blocked/at-risk — report bad news the moment it's known, don't wait for a checkpoint), a significant scope change. Roughly one per closed milestone, plus ad-hoc ones on health changes. **Not** for routine incremental work — individual issue state already covers that.
- **Talking to the user in chat is not replaced by a Linear status update.** Meaningfully completed work still gets surfaced directly in conversation — Linear is the durable record; chat is the live handoff. A session shouldn't rely on "I posted a Linear update" as the reason to skip telling the user what happened.

**On top of that, real accountability for dates** — this is sharper than plain review cadence:

- **Anchor to the user's actual meta-goal (§1, question 5), not just "ship the roadmap."** For the reference implementation, the goal was *consistent release cadence* — a materially different objective from "eventually finish everything," and it changes what the tracking should optimize for: regular, smaller, dated releases over one eventual big-bang finish.
- **Realistic target dates, set on purpose.** A milestone's target date should come from an actual estimate of the remaining work plus a sanity check against real dependencies (App Store review lead time, asset production time, other milestones' dates) — not an aspirational guess. If a proposed date doesn't survive that sanity check, say so *before* it goes into Linear, not after it's missed.
- **Holding the user to the date.** As a milestone's target date approaches without its issues trending toward `Done`, that's exactly the "health materially changed" trigger for an `atRisk` status update — don't wait for the date to arrive and pass silently. Beyond the Linear-side signal, the skill should be willing to **proactively raise this in conversation** — the point of "holding the user to it" only works if it surfaces where they'll actually see it, not buried in a system they might not be watching.
- **This only works if dates were realistic in the first place.** An accountability mechanism built on fantasy dates just produces alarm fatigue and gets ignored — the sanity-check step above is load-bearing, not optional.

---

## 10. Images in tickets

- **When:** anything visually verifiable — UI screenshots, before/after, mockups, campaign creative (§8). Same test as a "can I show it?" rule, not "is this a big feature?" A visible bug fix counts; a backend/schema change doesn't need one.
- **How (validated, fully automatable):** `prepare_attachment_upload` (issue + filename + contentType + size) → direct PUT of raw bytes to the signed URL → `create_attachment_from_upload` (assetUrl → issue). No manual step. A `create_attachment` (base64) fallback exists for very small files but burns context — prefer the PUT flow.
- **Where:** attach directly to the issue that represents the shipped feature or campaign beat. Linear should be self-sufficient evidence — it shouldn't require cross-referencing another system (like a separate progress log) to see what a "Done" issue actually looked like.

*(End-to-end validated 2026-07-02 on a real issue (traces OFF-79, a 317KB PNG): `prepare_attachment_upload` → `curl` PUT of raw bytes with the signed headers verbatim → `create_attachment_from_upload`. Two practical notes: the signed URL expires in 60 seconds, so prepare → PUT → finalize one file at a time, never batch prepares; and the exact-size `x-goog-content-length-range` header means you need the true byte size before preparing.)*

---

## 11. Manual vs. API — the real split (empirically validated on Obi, 2026-07-02)

This is the checklist to hand the user upfront: *"here's what you need to click before I can automate the rest."* Per §0, this is meant to be a **one-time cost per workspace**, not per project.

**Manual only — no MCP/API tool exists, must be done in Linear's own UI:**
- Creating **Cycles/sprints** (API can only list existing ones)
- Creating **Project Labels** (the cross-project taxonomy, e.g. Product/Tool/Drop/Marketing, §2) — `list_project_labels` reads them, nothing creates them
- Creating **Initiatives** (the cross-project rollup, §12) — same pattern: attachable by name/ID once it exists, not creatable
- Uploading a **custom image as a project icon** — the icon field only accepts a small built-in icon-name allowlist or an emoji code, never an uploaded image
- Connecting the **GitHub integration** (repo-level OAuth/webhook setup)
- **Authorizing the Linear connector itself** (the initial OAuth grant)

**Fully automatable via the MCP:**
- Projects, Milestones, Issues, issue Labels (team-scoped, unlike project labels — **including label groups**, via `isGroup` + `parent`, §4), Documents, Status updates, Relations (`blocks`/`blockedBy`), Comments, **Attachments** (§10)

**API practicalities (learned across 5 real bootstraps, 2026-07):**
- `save_project`'s `icon` rejects most names with no discoverable allowlist — omit it; set icons in the UI.
- Transient failures happen (Linear 502s, harness-side classifier blips) — retry the identical call once before rerouting.
- Parallel `save_issue` calls get non-sequential numbers — cosmetic, but file order-sensitive backfills sequentially if numbering matters to you.
- Initiatives are plan-gated and may be entirely absent from a workspace's UI — check before promising them (§12).

The skill's setup flow should surface this split explicitly and early — tell the user the 4–5 things they need to click, then proceed to automate everything else, rather than discovering these gaps mid-task.

---

## 12. Cross-project sequencing via Initiatives

For someone running many related tools/products, Initiatives are Linear's mechanism for grouping multiple *projects* — the API can attach existing projects, documents, and status updates to an Initiative by name once it exists (created manually, §11).

- **What this is for:** modeling how separate Linear projects — which might be entirely separate repos/tools/products — relate to each other: which feed into which, what the build/release sequencing between them should be, and giving a single rollup view instead of requiring N separate project pages to see the whole picture.
- **When to use it:** when two or more tracked projects have a real relationship — one is a dependency of another, they share a launch window, or they're conceptually part of one larger initiative (e.g. several `Tool` projects that all feed into one `Product`). Don't create an Initiative for unrelated projects that just happen to share an owner.
- **Sequencing lives in relations, not just the Initiative.** The Initiative is the rollup/grouping; the actual enforceable sequencing ("this project must ship before that one can start") still belongs as real `blockedBy`/`blocks` relations on the specific issues/milestones that are actually blocking (§4). The Initiative gives the bird's-eye view; relations give the dependency graph. Don't treat the Initiative as a substitute for real relations.
- **Manual to bootstrap, cheap to maintain** — exactly the acceptable shape described in §0: a one-time UI click to create it, then everything after (attaching projects, posting rollup-relevant documents/status-updates) is API-automatable.

*(Not yet validated end-to-end — flagged in §14.)*

---

## 13. Multi-project conventions (the actual target user)

For someone running many concurrent projects in one Linear workspace:

- **Project Labels are the cross-project taxonomy** (§2) — decide this **once per workspace**, not once per project. When a new project spins up, it gets tagged from the existing set; the set itself is a workspace-level decision, not something to re-litigate per project.
- **Team structure:** one team can hold many projects. Only split into multiple teams for a real ownership boundary (different people/orgs) — not just because the products are different. Splitting teams needlessly fragments issue numbering and search.
- **Naming conventions, held constant across projects:** milestone naming pattern (`Phase N — Theme`), issue-branch convention (use Linear's auto-generated branch name verbatim, e.g. `user/proj-N-slug` — never hand-roll a parallel scheme).
- **Initiatives are the cross-project home base** — see §12 for the full treatment.

---

## 14. Open gaps — validate before packaging

- [x] ~~End-to-end test the attachment flow (§10)~~ — **resolved 2026-07-02**: validated on a real issue (traces OFF-79) with a real 317KB PNG; §10 updated with the two practical caveats (60-second signed-URL expiry → never batch prepares; exact byte size required upfront).
- [ ] Create a test Initiative in Linear's UI and validate the attach-by-name flow from the API side — **deferred, now actionable**: still blocked on the one manual UI click (§11), but the workspace now has three genuinely related projects (Obi, visual-cursor, traces — all heading toward launches), so a real Initiative is worth creating rather than a throwaway test one. Waiting on the owner to create it; the API attach-side validation happens immediately after.
- [x] ~~Decide whether the default label taxonomy (Product/Tool/Drop/Marketing) is generalizable~~ — **resolved 2026-07-02 as "ship as a suggested starting set, not a hardcoded default."** Three dogfood projects all fit cleanly (`Product` ×1, `Tool` ×2), but `Drop`/`Marketing` were never exercised, so the set is validated only where the owner's portfolio exercised it — exactly why it ships as a suggestion.
- [x] ~~Decide how the skill detects "already tracked, extend it" vs. "bootstrap fresh"~~ — resolved in §1a (2026-07-03), **dogfood-validated 2026-07-02 on Obi** (Target 1): detection worked without being told the project name, zero duplicates created, and the run surfaced two §1a/§4 refinements (multi-track blind spot; doc-claims-as-evidence) now folded in.
- [x] ~~Decide whether the manifesto-writing sub-flow (§1) is a separate skill or inline questions~~ — **resolved 2026-07-02: inline questions, no separate skill.** Both fresh-bootstrap runs never needed the writing exercise at all — a good README was accepted as the North Star both times, making README-as-North-Star the *common* case and the anchoring questions the fallback. A separate prerequisite skill would over-weight the rare path.
- [x] ~~Stress-test the granularity choice (§4)~~ — **resolved 2026-07-02: feature-level default confirmed; keep asking anyway.** Asked explicitly on both fresh bootstraps; the owner chose feature-level both times, even for a 4-file package, and the question cost one exchange. No size-inferred default needed — the question is cheaper than the inference being wrong.
- [ ] Decide the concrete trigger mechanics for drift audits (§6) — **deferred with reason**: no milestone closed during any dogfood run, so the trigger was never exercisable. Revisit when a real phase completes (Obi's Phase 3 tail is the nearest candidate).
- [x] ~~Decide default structure/naming for "Launch Readiness" milestones (§7)~~ — **resolved 2026-07-02: one milestone by default; split only when sub-tracks have genuinely different dates/owners.** Both Tool runs fit everything in a single readiness milestone (named for what readiness means there — "Launch readiness" / "Distribution readiness"); Obi's 9-milestone rollout shows the split end of the spectrum. The §1b-question-5 answer, not a template, decides which end applies.
- [x] ~~Decide how proactive at-risk flagging (§9) actually reaches the user~~ — **resolved 2026-07-03, exercised live**: the mechanism is any session noticing date-vs-state divergence during normal work (no scheduler needed). traces' passed target → `offTrack` update + chat flag; the skill's due-today target → `atRisk` with the exact remaining items. The CLAUDE.md protocol is what guarantees a session looks.

---

## 15. Testing protocol — dogfooding before packaging

Before this becomes a distributable skill, it needs to survive being run on real, independent projects — not just be internally consistent on paper.

**The protocol, per dogfood target:**
1. **Don't invoke a packaged skill yet — walk the methodology by hand**, exactly as a fresh agent would: read this doc section by section, in order, and actually do what each section says for the target project. This is the realistic test, because a packaged skill will do exactly this.
2. **Log every point of friction as it happens** — a question the doc didn't anticipate, an ambiguous instruction, a step that needed outside judgment not written down anywhere. Friction found here is exactly what would make a packaged skill behave inconsistently across users; the doc should absorb it.
3. **Log every genuinely new project shape** the doc didn't anticipate (e.g. no discoverable North Star doc and no user appetite to write one; a Tool that's actually two Tools; a Drop that grows into Marketing mid-flight).
4. **Compare the end state against the Obi reference implementation** — does the resulting Linear setup have the same *kind* of structure (milestones, labels, backfilled history, relations) even though the specifics differ? If the shape is unrecognizable, something in the methodology under-specified the outcome.
5. **Update this doc immediately, not at the end of a testing phase** — each dogfood run should leave the methodology measurably better. Same "leave it cleaner than you found it" discipline the methodology itself preaches, applied reflexively.

**Where results live:** a dated log entry per project tested (what worked, what broke, what changed in the methodology). That evidence base is how you know the methodology works across projects — keep it with the methodology source if you're extending it.

**Exit criteria for "ready to package":** every item in §14 (open gaps) is either resolved or deliberately deferred with a stated reason, and at least 2–3 dogfood runs across genuinely different project types (at minimum: one `Tool`, one `Product` with a real launch, ideally one `Drop`/`Marketing`) have each produced a clean run with no undocumented judgment calls.

---

## 16. Distribution — deliberately not decided here

Per the owner: hold on packaging/distribution strategy until this methodology is validated and the open gaps above are closed. This doc is the input to that decision, not the decision itself.

---

# Extended guidance (v1.1 round-out)

These sections round the methodology from "good practice" into a repeatable system with guardrails. Added 2026-07-21; see CHANGELOG.md.

## 17. Project-shape decision tree

Before §2's project *type*, answer a coarser question: **which tracking setup fits this repo at all?** Type (`Product`/`Tool`/…) picks labels and tracks; shape picks how heavy the whole apparatus is. Six shapes, decided by three questions:

1. **Is a Linear project already connected?** Yes → *already-tracked rescue* (§1a, §22a/b). No → continue.
2. **Is there shipped history to backfill (roadmap ✓s, CHANGELOG, git log)?** Yes and it's messy/partial/late → *backfill-first* (§22c). Yes and clean → normal bootstrap. No → *fresh bootstrap*.
3. **What's the tracking meta-goal (§1b Q5)?** Launch/distribute → full multi-track. Durable record → backfill + one forward backlog. Bug-only/parked → maintenance mode (§21).

| Shape | Milestone pattern | Issue granularity | Cadence |
|---|---|---|---|
| Product / app | Engineering phases + launch-readiness + rollout (§3/§7/§8) | Feature-level | Per milestone close + health changes (§20) |
| Dev tool / CLI | 1–3: backfill + readiness + rollout, keyed off launch goal (§7) | Feature-level | Per milestone close; weekly if actively building |
| Library / package (already shipped) | Per-release backfill + one forward track | Per-release (CHANGELOG is the record) | On release + marketing beats |
| Client work | Deliverable-phase milestones + a sign-off/exit milestone (§7) | Feature or deliverable-level | Per deliverable + status to stakeholder |
| Already-tracked rescue | Adapt to existing; add only missing tracks (§1a, §22) | Match what's there | Resume existing rhythm |
| Fresh bootstrap | Derive from North Star 1:1 (§3) | Ask explicitly (§4) | Bootstrap update, then per §20 |

**Rule:** the shape sets the ceiling on structure; the meta-goal (§1b Q5) sets the actual amount. A `Tool` with a launch goal outweighs a `Product` with none — proven on visual-cursor (§7).

## 18. Completeness & readiness rubric

A scoreable check for "is setup actually done?" — not a vibe. Score each dimension **0** (absent), **1** (partial), **2** (solid). Max 20.

| # | Dimension | 2 = |
|---|---|---|
| 1 | Project exists + repo/GitHub linked | Project found, branch names auto-link |
| 2 | North Star exists + referenced | Doc read, structure derived from it (§1b) |
| 3 | Milestones map to real phases | 1:1 with the plan, none invented (§3) |
| 4 | Every issue has a milestone | Zero orphans (§4) |
| 5 | Backfilled history with evidence | Done + backlog reconstructs the roadmap (§4.5) |
| 6 | Lifecycle honored | States match reality, no perpetual-in-progress (§5) |
| 7 | Dependencies wired | Real `blockedBy`/`blocks` on the critical path (§4) |
| 8 | Launch/exit plan present (if launch goal) | Readiness track + defined "done" (§7); N/A → score 2 |
| 9 | Discipline installed in agent instructions | Protocol written where future sessions read it — `CLAUDE.md` / `AGENTS.md` / `.cursor/rules/` (§5) |
| 10 | No live anti-patterns | Clean against the §19 list |

**Threshold:** **≥16/20 and no dimension at 0** = done. **12–15** = functional but soft, name the gaps. **<12** = not set up, keep going. Dimensions 1–6 are load-bearing — a 0 on any of them fails the pass regardless of total. Run this via the §26 self-audit.

## 19. Anti-patterns & failure modes

| Symptom | Why it's bad | Fix |
|---|---|---|
| **Fake-precision dates** — target dates with no estimate behind them | Reads as a commitment nobody made; breeds alarm fatigue (§9) | Dates only with a real signal; else none (§3) |
| **Milestone spam** — 10+ milestones on a small repo | Nothing scans; phases blur | 3–6 outcome milestones (§23) |
| **Status theater** — updates on every increment | Drowns the real health signals | Updates at milestone/health moments only (§20) |
| **Issue soup** — everything one flat backlog, no milestones | Un-navigable; no phase story | Every issue gets a milestone (§4) |
| **Duplicated roadmap layers** — plan in a doc *and* re-typed in issue bodies | Two sources drift out of sync | Milestone = phase; issue points at the doc |
| **Backlog hoarding** — someday-maybes filed as real issues | Buries the actual next work | Keep speculative work out; file when identified |
| **Orphan issues** — no milestone, no labels | Mis-filed, invisible to phase views | Assign or delete (§4) |
| **Perpetual in-progress** — issues `In Progress` for weeks | State stops meaning anything | Close the loop or comment what's left (§5) |

## 20. Update cadence rules

Two kinds of trigger. Don't post on churn.

**Auto-triggered (post without being asked):**
- A milestone closes → status update summarizing what shipped.
- Health changes `onTrack`↔`atRisk`↔`offTrack` → post the moment it's known, bad news first (§9).
- A target date approaches with issues not trending `Done` → `atRisk` + chat flag (§9).
- Pre-launch: one readiness-state update before the launch beat goes out (§7).

**Manual-judgment (post if it's a real signal):**
- Actively-building project with no milestone close for a week → a short "still on track, here's where" beat.
- A significant scope change or drift-audit finding (§6).

**Do NOT post when:** no real change since the last update; mid-task progress that issue state already covers; you just want to show activity. Individual issue state is the incremental record — status updates are for stakeholders, not a work log (§9).

## 21. Maintenance-mode guidance

After launch, the method gets lighter — but doesn't stop. How it changes by post-launch shape:

- **Bugs-only project:** no phase milestones. One rolling `Maintenance` milestone (or none); issues are fixes, filed as they arise, `Done` on merge. Cadence: no periodic updates — post only on a notable fix or regression.
- **Slow-burn tool:** occasional feature waves. Spin a themed milestone per wave (§23), close it, go quiet again. No standing cadence between waves.
- **Parked project:** deliberately paused. Post one `offTrack`/paused status update stating *why* and the resume condition, then stop. Don't leave issues `In Progress` — comment and drop to `Backlog` (§5).
- **Revived project:** re-run the §26 self-audit first — parked projects drift from reality. Backfill anything shipped while parked (§22c), then resume normal cadence.
- **When to archive:** the exit plan (§7) fired and there's no resume condition, or the repo is dead. Post a final update, then archive the Linear project. An archived project with a clean Done history is a better artifact than a live one full of stale `In Progress`.

## 22. Migration & rescue playbooks

Three flows for projects that aren't clean bootstraps. All obey §1a (confirm before writing) and reuse §4's backfill algorithm — don't repeat it, invoke it.

**(a) Messy existing project** (real issues, but disorganized):
1. Enumerate everything (§1a step 1); summarize the current organization back to the user.
2. Score it with the §18 rubric to name the gaps concretely.
3. Get explicit per-category consent (§1a step 3) — reorganizing is higher-risk than extending.
4. Fix in order: assign orphan issues to milestones → collapse milestone spam to 3–6 (§23) → wire missing dependencies → install the agent-instructions discipline (§5).
5. Post one status update recording the cleanup; don't touch off-limits/other-owned issues.

**(b) Half-tracked project** (some tracked, a whole initiative missing — the Obi native-editor case, §4.7):
1. Scan the repo's `docs/` for roadmap-shaped docs with no Linear presence (§4 step 7), not just the mirrored ones.
2. For each untracked track, confirm it's genuinely separate, then give it its own milestone set (§3) — never fold into an existing one.
3. Run §4 backfill on that track only; leave the already-tracked side untouched.
4. Cross-check (§4.5) that the repo's full doc set now has Linear coverage.

**(c) Tracking started too late / backfill** (project ran a while with nothing tracked):
1. Rank the "what's already done" sources (§4 step 1) — CHANGELOG > roadmap ✓s > git log.
2. Run the §4 backfill algorithm end-to-end; `Done` only with evidence (§4 step 3), corroborate doc claims against the user (§4 step 8).
3. Pick granularity by shape (§17): per-release if a CHANGELOG carries the detail, else feature-level.
4. Then bootstrap forward structure normally (§3) — backfill first so the project reads as mature from day one.

## 23. Milestone design guide

- **How many:** **3–6** for most projects. Under 3, milestones aren't earning their keep — use issues. Over ~8 on a single track, they've become a to-do list; collapse. (Obi's 15 is *three* tracks of ~5, not one list of 15 — §3.)
- **Milestone vs. issue:** a milestone is a **phase/outcome** with a beginning and an end; an issue is a **unit of work** inside one. If it has no issues under it, it's an issue, not a milestone.
- **Naming — outcome, not activity.** Name the state the project reaches, not the work done to get there.

  | Bad (activity) | Good (outcome) |
  |---|---|
  | "Work on auth" | "Phase 2 — Accounts & login" |
  | "Do launch stuff" | "Launch readiness" |
  | "Fix bugs" | "1.0 stability" |

- **Description + target date:** description ≤3 sentences saying what "done" means for this phase and how it derives from the North Star. Target date **only with a real signal** (§3) — an estimate plus a dependency sanity-check (§9), never an aspiration.

## 24. Issue taxonomy

Five working categories — a lens for coverage, not labels to create:

- **Foundational** — the core build work; maps to engineering-phase milestones (§3).
- **Launch** — readiness + rollout beats (§7/§8); exists only with a launch goal.
- **Polish** — refinement, a11y, perf; keep as a light backlog, don't let it crowd foundational work.
- **Risk / spike** — investigations and de-riskers; time-box them, and file the *decision* they produce as its own issue.
- **Backfilled-done** — retroactive `Done` with evidence (§4); the provable history.

**Split by milestone, not by inventing labels.** A category is usually already expressed by *which milestone* an issue sits in — don't add a `type:` label that duplicates the milestone. Reserve labels for the orthogonal dimension milestones can't express: **area/module seams** (§2), namespaced in a label group when the team hosts many projects (§4). Rule of thumb: milestone answers *when/what phase*, label answers *what part of the code* — if a proposed label answers "when," it's a milestone.

## 25. Compatibility matrix

How conventions shift across who's running the project:

| Convention | Solo founder | Multi-person team | Reusable tool / library |
|---|---|---|---|
| **Assignment** | Skip / self-assign | Assign every issue; unassigned = unowned | Maintainer or self-assign |
| **Branch naming** | Linear auto-name (`ty/off-N-slug`) | Linear auto-name, non-negotiable (auto-links PRs) | Linear auto-name |
| **Update cadence** | Milestone close + health changes (§20) | Add a weekly team-visible beat | On release + marketing beats |
| **Review** | Optional; CI is the gate | PR review required before `Done` | PR review + green CI required |
| **Milestone granularity** | 3–6, loose dates | 3–6, dates that sync with team commitments | Per-release + one forward track (§17) |

Solo defaults keep overhead near zero; team columns add the coordination surface (ownership, review, shared dates) a second person needs; library columns center on releases over phases.

## 26. Self-audit pass

A repeatable procedure to grade an existing project's Linear hygiene. Operationalizes §18 — it *outputs a gap list + fixes*, it isn't prose. Run it on any project you're asked to audit, revive (§21), or rescue (§22).

**Procedure (ordered — stop-conditions matter):**
1. **Locate & link.** Confirm the Linear project and its repo/GitHub link (§18 #1).
2. **Enumerate.** Pull all issues (open+closed), milestones, labels, documents, status updates (§1a step 1). Don't write yet.
3. **Score.** Walk the §18 rubric, assign each dimension 0/1/2, note the evidence for each score.
4. **Check anti-patterns.** Test against every row of §19; flag each that's live.
5. **Check coverage.** Backfill cross-check (§4.5): does Done + backlog reconstruct the roadmap? Scan `docs/` for unmirrored tracks (§4.7 / §22b).
6. **Compute verdict.** Total the score, apply the §18 threshold (≥16 and no 0; 1–6 load-bearing).
7. **Emit the report** in the template below. Recommend fixes; **do not apply them without consent** (§1a) unless the task explicitly said to.

**Output template:**

```
## Linear self-audit — <project> (<date>)
Score: N/20 — <PASS ≥16 / SOFT 12–15 / FAIL <12>

Rubric (§18):
  1 Project+link .......... 0|1|2  — <evidence>
  ... (all 10 dimensions) ...

Anti-patterns (§19): <none | list each live one>
Coverage (§4.5): <reconstructs roadmap? unmirrored tracks?>

Gaps (ordered by severity):
  - <gap> → <fix + § ref>

Recommended next actions:
  1. <action>
```

An audit that doesn't end in filed/recommended actions is just a document nobody acts on (§6).
