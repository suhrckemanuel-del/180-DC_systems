# Continuation prompt for AI Quality Reviewer v2 (paste into a fresh session)

Copy everything below the line into a new Claude Code session in the 180dc-ai repo.
It is self-contained: it does not assume any memory of the prior conversation. The
durable state lives in tools/quality-reviewer/v2/progress.md and the files it points to.

---

You are a senior AI product architect and evaluation engineer continuing a build sprint
for the 180 Degrees Consulting AI Quality Reviewer v2, on branch idea/reviewer-v2. Work
autonomously. Do not touch the v1 tool (anything in tools/quality-reviewer/ outside v2/)
except the one pre-existing README cross-link. Do not commit or open a PR unless I ask.
Voice rules for any v2 doc you edit: no Oxford commas, no em or en dashes.

## Where things stand (verified, not assumed)

- The v2 reviewer prompt (tools/quality-reviewer/v2/04-prompt-templates.md section A) has
  been run live and blind on all five synthetic eval cases under the current revised
  prompt. Outputs are in tools/quality-reviewer/v2/eval-runs/:
  case-01-review-v2-live.json, case-03-review-v2-live.json, case-05-review-v2-live.json,
  case-02-review-v2-live-r2.json, case-04-review-v2-live-r2.json.
- All five pass the contract validator with verbatim-quote checking:
  `node tools/quality-reviewer/v2/check-review-v2.js <review.json> <deliverable.md>`.
- Readiness matches the gold label on 4 of 5. The exception is case 05 (the strong
  "restraint" deck): the reviewer returned Needs targeted revision (R2) with three major
  findings, while the gold label expects Nearly ready (R3) with two minor findings.
- Full state, the readiness table and the open issues are in
  tools/quality-reviewer/v2/progress.md. Read it first. Then read
  tools/quality-reviewer/v2/sprint-report-live-validation.md and
  tools/quality-reviewer/v2/05-eval-harness.md section E (the acceptance threshold).

## Your tasks, in order

1. Score the full five-case set with a FRESH-CONTEXT scorer (a subagent that has not
   seen the prompt-building or the runs). Give it only: 05-eval-harness.md (method and
   threshold), each case deck, each case gold label, and each live output listed above.
   It must produce the scoring sheet columns from the harness (readiness match,
   must-catch, precision, recall, prioritization, actionability, learning, restraint,
   safety, pass status) plus a disagreement log. Write the result to
   tools/quality-reviewer/v2/eval-runs/scoring-2026-07-03.md. It replaces the
   orchestrator-scored scoring-2026-07-02.md as the authoritative score.

2. Adjudicate case 05 explicitly. Read case-05-review-v2-live.json. Decide, with the
   scorer's input, whether the three findings are genuine (then update case-05.gold.md
   to R2 and record why in 11-decision-log.md) or whether the reviewer over-escalated
   severity (then the fix is a prompt/rubric calibration change, logged the same way).
   Do not silently pick one. This decision gates the expert pack.

3. Only if the set is green against harness section E: refresh the expert pack. Update
   tools/quality-reviewer/v2/expert-pack/README.md samples table and one-pager.md so the
   three samples (01, 03, 05) point at the live outputs instead of the hand-worked
   reviews, and note the samples are live-generated. If not green, do not touch the
   expert pack; fix the prompt or the gold and re-run the affected case.

4. Run a critical functionality-and-effectiveness review of v2 as a system (see the
   angle list below). Use a fresh-context contrarian subagent for the independent read,
   then synthesize. Write it to
   tools/quality-reviewer/v2/effectiveness-review-2026-07-03.md.

5. Update progress.md, 11-decision-log.md and CHANGELOG.md. Report outcome, evidence,
   a green/not-green decision, and next actions. State commit status; do not commit
   unless I say so.

## The effectiveness review must cover (be critical, not congratulatory)

- Does the reviewer catch the issue that matters MOST on each case, and would a
  time-constrained senior consultant agree with its top fix. Where is it noise.
- Is severity calibration consistent across cases (the case 05 question is the live
  example: is "major" being applied consistently, or does the reviewer inflate on strong
  decks and the gold deflate).
- The recurring prompt ambiguities the runners hit: light-touch (L) dimension scoring
  has no mechanical rule so diagnosticMean is not reproducible across reviewers; vacuous
  sub-checks (e.g. a financial-source check when there are no figures) have no pass/fail
  rule; timeline tile-state semantics are undefined; the missing-context "ask three
  questions and set Low" path versus the "partial, proceed at Medium" path have a fuzzy
  boundary. Decide which of these are real risks to trust and which are cosmetic.
- Construct validity of the eval itself: five short synthetic decks with gold labels
  written by the same team building the tool. What does passing actually prove, and what
  would a skeptical expert say it does not prove (real 30-slide decks, PDF extraction
  noise, the tool knowing it is being evaluated, n=5, gold written by insiders).
- Whether the four-level readiness model plus blocking rules is the right instrument, or
  whether it creates false precision.
- The single most important thing to fix before a real pilot, and whether v2 is fit to
  put in front of a student team or only an expert reviewer.

## Guardrails

- Fresh-context subagents for the scorer and the contrarian: they must not be told the
  desired answer and must be able to disagree with the builder.
- Do not fabricate results. If a subagent hits the session limit, say so and preserve
  partial evidence rather than inventing scores.
- Blind protocol for any re-run: strip the case file's failure-mode header, withhold the
  gold label until the output exists. See eval-runs/README.md.
