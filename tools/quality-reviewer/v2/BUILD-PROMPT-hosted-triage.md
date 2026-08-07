# Paste-ready build prompt: host the renderer, then build the triage loop

<!-- check-docs: historical -->

**Dated record, not a status report. Ran 2026-08-05. The tool is live at https://180dc-reviewer.pages.dev.** For current state read [STATUS.md](STATUS.md).

Paste everything below the line into a fresh chat. It is self-contained.

This is **product work, not measurement**. No prompt, rubric, contract or eval sprint is
touched. Read [18-evidence-base.md](18-evidence-base.md) section C first: those five points
are settled and should not be relitigated.

---

Working in `c:\Users\User\Desktop\180dc-ai`, branch `idea/reviewer-v2`. Everything below
lives under `tools/quality-reviewer/v2/`. **Build and ship. Do not write design documents,
do not run evals, do not edit the reviewer prompt.**

## The goal

Today a team lead cannot use this tool. The flow is: paste a system prompt into Claude, get
JSON back, find a local HTML file, open it, paste the JSON in. Nobody does that twice.

By the end of this sprint a lead opens a **link**, loads a review, works through the deck,
decides what the team actually sees, and exports a note. Two phases, in order.

## Confirm the layout before building

Build **direction A, the v1 Team Lead Mode layout**: the four-tile row (Verdict, Score,
Estimated effort, Confidence), the criteria chip row, and the deck timeline with numbered
page tiles, colour-coded pass/partial/critical, with callouts pinned above the pages they
belong to and the connector lines listed underneath. Reference implementations:

- The original: `tools/quality-reviewer/index.html` (v1, June demo). Open it and click
  through, it is the shape being restored.
- The port onto the v2 contract, plus three alternatives, is in the published mockups at
  https://180dc-reviewer-mockups.pages.dev (fabricated data).

Two known issues carried from the port, fix both: the criteria row is ten chips now rather
than five and wraps to two lines, and callouts collide on short decks unless staggered onto
two rows.

**If the owner has supplied a different design reference, use that instead and say so in your
first message.** The rest of this prompt is layout-independent.

---

# Phase 1. Host the renderer

`index.html` is already a single self-contained file with no build step, no external requests
and an inline contract validator. Hosting it is mostly a safety check plus a deploy.

## The safety check, do this first

`index.html` carries a `<script id="bundled-reviews">` block populated by `bundle-reviews.js`.
Its manifest currently points at `eval-runs/case-01` through `case-05`, which are the
**synthetic** cases and are safe to publish.

**Verify, do not assume.** Before deploying, grep the built file for real-case markers
(`Client R`, `real-0`, `real-1`) and confirm zero hits. The real reviews live under
`eval-runs/real-baseline/`, which is gitignored, and none of them may ever enter a bundled
build. If you add a review-picker feature, it loads from the bundle or from user-supplied
files only, never from a path under `real-baseline/`.

## Deploy

Cloudflare Pages, already authenticated as `suhrckemanuel@gmail.com`. A separate project
`180dc-reviewer-mockups` already exists for the design mockups; do not overwrite it.

```
npx wrangler pages project create 180dc-reviewer --production-branch=main
npx wrangler pages deploy <dir> --project-name=180dc-reviewer --branch=main
```

Put the deployable file in its own directory so the deploy has a clean root. Confirm the live
URL returns 200 and renders before reporting done, and check what is actually served rather
than what you uploaded.

## Phase 1 definition of done

- A live URL that loads a review and renders it.
- Zero real-case content in the served file, verified by grep against the live page.
- The inline validator still refuses to draw an invalid review.

---

# Phase 2. The triage loop

Build what [17-override-log.md](17-override-log.md) specifies. That document is the contract
for this phase; read it before writing code.

## Why this shape, so you do not redesign it

From [18-evidence-base.md](18-evidence-base.md):

- **A4.** The readiness verdict returns R0 and R2 on identical input. It cannot ship as a
  judgment. It ships as a suggestion the lead overrides.
- **A5.** The tool escalated six of six strong decks. The lead is the filter, not a reviewer
  of the filter.
- **C4.** Lead overrides replace thirty-hour gold labelling as the calibration source. The
  record is the point, not a nicety.

## What to build

**1. Lead triage.** Each finding gets keep / turn into a question / cut. Default keep. The
counts update live.

**2. The lead's readiness picker.** Four levels, the lead chooses. The AI's answer is shown
beside its option, labelled as a suggestion, never preselected as authoritative. When the
lead differs from it, show the delta and record it.

**3. The note back to the team.** Builds live from kept findings, with each finding's evidence
quote and page. Questions render in their own section. Editable before export.

**4. Export, two files.** The note (markdown, for pasting wherever the team lives) and the
override record (JSON, per the 17-override-log spec). Browser download, no backend.

**5. The student view renders only what the lead kept.** This is a change to current
behaviour and it is the reason the loop exists. A student must never see the readiness level
at all, and must never see a finding the lead cut.

## Hard constraints

- **No backend, no API key, no database.** Self-contained file, works from `file://` and from
  `https://`. State persists in `localStorage`; export is a download.
- **The contract validator stays.** A review that fails it does not render.
- **The no-ghostwriting gate stays** in the student view. The typed attempt before the fix
  unlocks is the pedagogy, not friction.
- **Evidence quotes always render with their page number.** Quote-or-abstain is the property
  that makes a finding trustworthy.
- **Do not touch** `04-prompt-templates.md`, `01-rubric-v1.md`, `03-output-contract.md`, or
  anything under `eval-runs/`.

## The dependency to solve, not discover later

If students only see lead-approved findings, the student view now depends on a lead doing
triage first. If the lead is busy the team gets nothing, which is worse than today.

Build for four minutes a deck: keyboard-navigable, sensible defaults, no field required
before export. If you conclude that is not achievable, say so rather than shipping a loop
that quietly starves the student view.

## Phase 2 definition of done

- A lead can load a review, triage every finding, set readiness, and export both files.
- The student view shows only kept findings and no readiness level.
- The override record matches the 17-override-log spec and round-trips.
- Deployed and working at the live URL.
- One paragraph in `STATUS.md` on what a lead now does, end to end.

---

## What not to do

- No prompt, rubric or contract edits. This sprint changes the surface, not the reviewer.
- No eval runs, no scoring, no new measurement.
- No real-case content in anything deployed.
- Do not build The Rounds or The Practice. Both need cross-deliverable history that is not
  stored, and both are deferred by owner decision.
- Do not add a backend "because it would be easier". Free and self-contained is a product
  requirement, not a constraint to route around.
