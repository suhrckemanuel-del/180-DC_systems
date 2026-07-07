# 09. Roadmap

Sprint 9 artifact. Where v2 goes after the design phase, what is already done, the open
questions and the immediate next actions. Phases follow the build plan on the
`idea/reviewer-v2` branch.

Voice rules apply.

---

## A. Phases

### Phase 0. Concept and rubric (this design phase)
- **Deliverables.** Product definition, the 10-dimension rubric with blocking-issue
  readiness, the output contract, the prompt with three modes, the source register, the
  decision log.
- **Status.** Done. Files 00, 01, 03, 04, 10, 11 in this folder.

### Phase 1. Prompt MVP and evaluation
- **Deliverables.** The system prompt running in a Claude Project, five synthetic cases
  with gold labels, AI reviews for at least three, the eval harness and a first scored
  run. A small v2 validator (check-review-v2) and a scoring script that diffs an AI
  review against a machine-readable gold.
- **Status.** Mostly drafted here (cases, three worked reviews, harness). Remaining: run
  the prompt live in a Claude Project, produce reviews for cases 02 and 04, build the
  validator and scoring script, and score the full set.
- **Exit.** The reviewer clears the acceptance threshold in
  [05-eval-harness.md](05-eval-harness.md) section E.

### Phase 2. Expert calibration
- **Deliverables.** The expert feedback pack sent to an ex-consultant, labelled AI
  outputs, the disagreement log filled, prompt v0.2 and rubric changes, calibration notes.
- **Status.** Pack assembled (file 06 and expert-pack). Remaining: line up the reviewer,
  run the session, apply the changes.
- **Exit.** No systematic expert disagreement on priorities across the samples.

### Phase 3. Small project-lead pilot
- **Deliverables.** A test with two or three real teams (on sanitized material), project
  lead feedback, consultant learning feedback, a false-positive and false-negative log,
  an adoption-burden assessment.
- **Exit.** Leads say it saves time and the false-positive rate is acceptable.

### Phase 4. Operational pilot
- **Deliverables.** Reviewer v1.0, a usage guide, a confidentiality guide, an escalation
  guide, a review archive and an improvement log.
- **Exit.** The tool runs a full project cycle without a stop-condition breach.

### Phase 5. Optional tooling (only if it earns its place)
- **Deliverables.** Considered only if volume demands: a Google Form intake, a Drive
  folder workflow, a lightweight web app, the API or SDK multi-agent orchestration and an
  evaluation dashboard. The trigger to build the multi-agent version is in
  [02-agent-architecture.md](02-agent-architecture.md) section G.

## B. Definition of done for the design phase (recap)

From [00-product-definition.md](00-product-definition.md) section 11. All met in draft:
rubric understandable, prompt produces valid JSON (three worked examples), at least three
cases with AI outputs, expert pack ready, a scoring sheet exists. The one item that needs
a live run rather than a hand-built example is "the prompt reliably produces valid JSON",
which Phase 1 confirms in a Claude Project. The next decision after Phase 1 is explicit:
continue to the expert, revise the prompt heavily, or stop.

## C. Open questions

1. Do all ten dimensions score every time, or does short mode score only the core subset
   (1, 3, 4, 6) as the mode table suggests. Current answer: short scores the core in
   full and the rest light. Confirm in the pilot.
2. Who at Delft-Rotterdam hand-labels new gold cases, and is an ex-consultant lined up
   with a confirmed time budget.
3. When do we introduce sanitized real deliverables, and who agrees the sanitization on
   the first one.
4. Is the printable a board and lead PDF, with the gated coaching view reserved for the
   student. Current lean: yes.
5. Which model holds the rubric most cheaply, and does any dimension regress on a cheaper
   model. Decide when the validator and scoring script exist.

## D. Source verification backlog

From [10-source-register.md](10-source-register.md): re-verify S8 and S9 against primary
sources before the expert pack ships, confirm the S4 quality-lift figure from the
Organization Science version and quote one defensible number, and confirm the CMCE figure
and its sample. This is a Phase 2 gate, not optional, because the pack goes to a
practitioner who will check.

## E. Immediate next 5 actions

1. Paste the SYSTEM-PROMPT from [04-prompt-templates.md](04-prompt-templates.md) into a
   Claude Project, add case 01 as calibration knowledge, and run case 03 blind to confirm
   the live output matches the hand-built review.
2. Produce AI reviews for cases 02 and 04 the same way, so all five have outputs.
3. Build check-review-v2 (extend the v1 validator) and a small scoring script that diffs
   an AI review against a machine-readable version of each gold label.
4. Score the full five-case set on the seven metrics and fill
   [expert-pack/scoring-sheet.md](expert-pack/scoring-sheet.md). Fix the prompt or rubric
   on any cluster, then re-run.
5. Line up an ex-consultant for a 60-minute session and clear the source-verification
   backlog before sending the pack.

## F. Decision log

Every decision that shapes v2 is one line in [11-decision-log.md](11-decision-log.md),
appended per sprint, newest at the bottom. Prompt and rubric changes from calibration go
there too, so the reasoning behind the tool stays legible to the next person.
