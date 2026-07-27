# v2 live-validation sprint progress

Factual log of the 2026-07-02 validation sprint. Synthesis in
[sprint-report-live-validation.md](sprint-report-live-validation.md).

## Sprint objective

Produce evidence that the v2 reviewer prompt works: live blind runs on the synthetic
cases (02 and 04 first, both missing reviews), validate outputs against the contract,
score against gold labels, change prompt or rubric only where scoring shows a real
failure pattern, leave the repo commit-ready with v1 untouched.

## State discovery (done)

- Branch idea/reviewer-v2, one commit on main (5b64d21).
- v2 docs 00 to 11 present. Prompt in 04 section A, contract in 03, rubric in 01,
  harness in 05. All five cases with gold labels. Worked reviews for 01, 03, 05 only.
  No v2 validator existed.
- v1 untouched except the intended one-line README cross-link (verified by git diff).

## Blindness protocol

Runs use fresh-context instances receiving the deployed prompt package plus the team
input template filled from case metadata with the failure-mode header stripped. Gold
labels unread by runner and orchestrator until the output exists. Full protocol in
[eval-runs/README.md](eval-runs/README.md).

## Cases run

| Case | Run | JSON valid | Validator | Scored |
|---|---|---|---|---|
| 02 | live blind 2026-07-02 | yes (parsed) | pass incl verbatim quotes | pass |
| 04 | live blind 2026-07-02 | yes (parsed) | pass incl verbatim quotes | pass |
| 01 | live run blocked by session limit, worked review exists and passes validator | | pass | not tonight |
| 03 | same | | pass | not tonight |
| 05 | same | | pass | not tonight |

## Scores

See [eval-runs/scoring-2026-07-02.md](eval-runs/scoring-2026-07-02.md). Both cases
pass: readiness exact match, must-catch as top finding, prioritization 3, safety 3,
precision at or above two thirds, restraint 2 (the weak metric, both cases).

## Changes made

- check-review-v2.js built, all five reviews pass it.
- 04-prompt-templates.md: mootness pruning in the synthesis protocol, line-wrap rule
  in the evidence rule, partial-input confidence rule in missing context.
- 03-output-contract.md: validator section updated to the built validator and
  whitespace-normalized quote comparison.
- 10-source-register.md: S4, S7, S8, S9, S10 corrected after a verification pass.
  expert-pack/one-pager.md: S10 scope clause fixed.
- 11-decision-log.md: seven new entries. eval-cases/README.md status table updated.
- eval-runs/ created with both live outputs, scoring sheet and README.
- CHANGELOG.md: sprint entry added.

## Session 2 (2026-07-03): full five-case set run live under the revised prompt

All five cases now have live blind outputs under the revised prompt. All five pass
check-review-v2.js with the verbatim-quote check. Files in eval-runs/:
case-01-review-v2-live.json, case-03-review-v2-live.json, case-05-review-v2-live.json,
and the re-runs case-02-review-v2-live-r2.json, case-04-review-v2-live-r2.json.
(The original pre-revision 02 and 04 outputs are kept as case-02/04-review-v2-live.json
for comparison.)

Readiness vs gold:

| Case | Live readiness | Gold | Match | Findings/comments |
|---|---|---|---|---|
| 01 | Needs substantial revision | R1 | yes | 5 / 1 |
| 02 r2 | Needs substantial revision | R1 | yes | 4 / 2 |
| 03 | Needs substantial revision | R1 | yes | 3 / 3 |
| 04 r2 | Not ready for client review | R0 | yes | 3 / 2 |
| 05 | Needs targeted revision (R2) | Nearly ready (R3) | NO | 3 / 2 |

Noise cluster: fixed on the broken decks. Case 02 dropped from 5 to 4 findings and lost
its title comment. Case 04 dropped from 5 to 3 findings. Mootness pruning fired as
designed and each runner reported what it cut.

The one divergence, case 05: the live reviewer landed R2 with three major findings where
the gold and the hand-worked review sit at R3 with two minor ones. Inspection of the
three findings (launch gate at 5% sits below the 8% assumption it must validate and is
tested on the most engaged 200 contacts; the 5,000 pounds is never sized against total
income; the conservative label leans on an attendance rate that does not measure
willingness to pay) suggests they are genuine senior-level catches, not manufactured
criticals. Provisional read: the reviewer out-performed the gold and the gold is too
lenient. This must be adjudicated by the fresh-context scorer before the expert pack
ships, because harness section E requires an exact readiness match on every case and
restraint on case 05.

Source items closed: S9 confirmed (CMCE Jan 2021, n=161, top-three nuance), S6
corrected (guest post by Sam Smith on Tom Spencer's blog, verbatim quote confirmed,
rebuttal noted). Register and rubric tag (Omachonu) updated.

## Open issues (for the next session)

- Fresh-context scorer has not yet run on the five live outputs. This is the gate.
- Case 05 readiness mismatch needs adjudication: fix the gold to R2, or treat as a
  reviewer severity-calibration issue. Do not silently pick one.
- Recurring prompt ambiguities the runners flagged, candidates for the decision log if
  they recur: light-touch (L) dimension scoring has no mechanical rule, vacuous
  sub-checks (a financial-source check with no figures) have no pass/fail rule, and
  timeline tile-state semantics are undefined. None block validation.
- Expert-pack refresh (swap hand-worked samples for live outputs) waits on a green scorer.
- Critical functionality and effectiveness review still to run (the user asked for it).
- Still open from the source register: confirm the S4 journal tables match the working
  paper figures.

## Session 3 (2026-07-03): independent scoring, case 05 adjudication, calibration fix, green

Fresh-context work this session. Two independent subagents (a scorer and a contrarian) ran
blind, then a fresh-context runner re-ran case 05 under the revised prompt and a second
independent scorer confirmed it.

Independent scoring of the five live outputs is in
[eval-runs/scoring-2026-07-03.md](eval-runs/scoring-2026-07-03.md), which replaces the
orchestrator-scored 07-02 sheet as authoritative. Result: readiness matched on 4 of 5,
every must-catch found, precision 1.00 on 01 to 04 and 0.80 on 05, safety clean
throughout. The one miss was case 05, R2 against gold R3.

Case 05 adjudicated: over-escalation, not genuine criticals. The independent scorer and the
contrarian both read the three major findings on the merits and agreed they are real
observations graded too high. The deck frames year one as a deliberately small pilot, so
sizing the 5,000 pounds against total income is a minor not a blocker. Gold stays R3, with
a dated adjudication note added to [eval-cases/case-05.gold.md](eval-cases/case-05.gold.md)
that keeps the pre-registered gold intact.

Calibration fix (prompt and rubric): a SEVERITY block that defines critical, major and
minor by whether closing the finding changes the client's decision, a deliveryCritical
invariant for no-blocker decks and a floor against demoting a strong no-blocker deck below
Nearly ready. Provably a no-op on the four decks that fired a blocking rule.

Case 05 re-run blind under the revised prompt landed Nearly ready (R3) with two minor
findings, no invented criticals, and passes check-review-v2.js
([eval-runs/case-05-review-v2-live-r2.json](eval-runs/case-05-review-v2-live-r2.json)). An
independent re-score confirmed section E points 1 and 4. One arithmetic slip (diagnosticMean
4.4 for 4.7) was caught by the validator and corrected.

Updated readiness table:

| Case | Live readiness | Gold | Match | Restraint | Pass |
|---|---|---|---|---|---|
| 01 | Needs substantial revision | R1 | yes | 3 | pass |
| 02 r2 | Needs substantial revision | R1 | yes | 3 | pass |
| 03 | Needs substantial revision | R1 | yes | 3 | pass |
| 04 r2 | Not ready for client review | R0 | yes | 3 | pass |
| 05 r2 | Nearly ready with minor edits | R3 | yes | 3 | pass |

Green against harness section E: all six criteria pass. Expert pack refreshed to point at
the live outputs (01, 03 live, 05 the revised-prompt re-run), marked live-generated.

Critical effectiveness review written:
[effectiveness-review-2026-07-03.md](effectiveness-review-2026-07-03.md). Fitness verdict:
expert or lead companion, not yet direct student-facing. Single most important pre-pilot
fix now that severity is calibrated: measure run-to-run stability (three to five runs per
case under the frozen prompt) so finding-set and confidence variance is a number, not an
assumption.

## Green caveats (read before booking expert time)

- The set is green, but 01 to 04 were not re-run under the revised prompt. The calibration
  change binds only when blockingIssues is empty, so it is a no-op on those four (each fired
  a blocking rule). This is a static regression argument, not a fresh run.
- Case 05 green rests on a single post-fix blind run, independently re-scored. Stability
  across repeated runs is unmeasured.
- The eval is five short single-flaw synthetic decks with insider-written gold and no PDF
  extraction noise. Passing is a smoke test, not a pilot validation. See the effectiveness
  review sections 3 and 4.

## Session 4 (2026-07-04): real-deck gold-set pipeline started

Strategy decision with the user: two modes confirmed (one engine, two views, the
readiness verdict lives only in lead mode), and the next brick is a gold set built from
real past deliverables, not polished exemplars. Full pipeline design in
[12-real-deck-intake.md](12-real-deck-intake.md).

Done this session:

- Drive library inventoried: 222 unique files, 181 unique deliverable candidates
  (matches the "about 180" estimate). Extraction test on a real deck confirmed usable
  text with realistic PDF noise (scrambled columns, floating chart values), which the
  eval keeps on purpose.
- eval-cases-real/ stood up: README with folder rules, blind labeling kit
  (labeling/PROTOCOL.md with a stop rule, worksheet template, agreement log),
  seeded-flaw variant spec (seeded/README.md), intake machinery and batch files
  (intake-work/).
- Provenance rules locked: humans write all gold for real cases, machine triage bands
  are sealed sampling machinery, no reviewer runs on real cases before adjudicated
  gold exists.
- Triage fleet: pilot agent validated the loop (Drive MCP works from subagents), then
  the 8-agent first wave hit the account session limit (resets 4am Europe/Berlin) and
  died. 3 of 181 triage rows exist. Instructions patched to append-per-file so a killed
  agent loses at most one file.

Resume from [eval-cases-real/intake-work/NEXT-SESSION-PROMPT.md](eval-cases-real/intake-work/NEXT-SESSION-PROMPT.md).

## Session 5 (2026-07-05 to 2026-07-07): local-mirror pivot, triage complete, 14 real cases built

- Local-mirror pivot: the full Drive folder was downloaded to disk and extract-local.py
  pulled text from 218 files with zero errors (full text plus a 12k-char head per file,
  MANIFEST.tsv mapping). The Drive connector is out of the pipeline entirely. Local-text
  Sonnet agents cost roughly a quarter of the Fable-on-MCP fleet that burned the 07-04
  session window.
- Triage complete: 181 of 181 candidates, merged and deduped by fileId into the sealed
  catalog. One corrupted batch row (two records glued, one field lost) was repaired
  during the merge with the repair noted in the row. Aggregates: 76 A, 70 B, 9 C, 26 X;
  extractability 156 full, 13 partial, 1 poor, 11 n/a. Per-deck bands stay sealed.
- Selection: 14 cases (4 A, 5 B, 5 C), every client used once, BCI and the Hartige
  Samaritaan and The Good News families excluded entirely, stages 5 D1, 4 D2, 1 D3 and
  4 finals, C band weighted toward decks with genuine draft artifacts (placeholder
  slides, embedded reviewer comments, an annotated feedback copy). Reasons and the
  codename mapping live in the sealed selection memo. Case numbering shuffled so the
  sequence carries no band signal.
- Case build: five Sonnet agents wrote real-01 to real-14 from the full local text,
  extraction noise and draft artifacts kept verbatim, pseudonymised per policy. Session
  limits killed three agents mid-wave but write-per-case discipline meant zero rework:
  nine files were already complete on disk and two relaunched agents built the
  remaining five.
- Anonymisation QA at orchestrator level: grep sweep of every case body for real client
  names, person names, emails, phone numbers, handles and live URLs. One fix applied
  (seven speaker-note source URLs in real-05 stripped, logged in its extraction notes).
  The generic 180DC org contact kept in real-02 is documented there. Sweep clean
  everywhere after the fix.
- Handoff: the set is ready for blind labeling per labeling/PROTOCOL.md. No gold
  exists, the reviewer has not run on any real case and the baseline run waits for
  adjudicated gold.

## Session 6 (2026-07-22): the renderer exists, the audit gap is closed, stability is measured

Three things that were missing are now on disk. No new design documents were written.

**1. The v2 renderer.** [index.html](index.html), one self-contained file, no build step
and no server needed. Three views off the same JSON: a student coaching view, a project
lead view and a printable. It ports the contract validator from check-review-v2.js and
refuses to draw a review that fails it, exactly as v1 does. Verified in a browser against
all six bundled reviews, with the browser validator returning byte-identical errors to the
CLI on the one failing review. The coaching gate genuinely gates: a restatement of the
reflect question is rejected, the fix is absent from the rendered DOM until unlock, and
after two reveals without a drafted rewrite the rewrite becomes mandatory. Readiness
surfaces in lead mode only, per the session 4 two-modes decision. The printable carries
strengths first and the reflect question but never the fix, so it cannot become
ghostwriting. [bundle-reviews.js](bundle-reviews.js) inlines the eval-runs outputs into the
file, because a page opened from file:// cannot fetch a sibling JSON.

**2. The audit gap is closed.** A fresh-context scorer re-scored the five post-fix outputs
without reading either prior scoring sheet, then compared. Sheet committed at
[eval-runs/scoring-2026-07-22.md](eval-runs/scoring-2026-07-22.md). Verdict: GREEN, all six
section E criteria, independently derived. The green claim no longer rests on a prose line
in this file. The sheet also records that check-review-v2.js had uncommitted local
modifications when it ran, so its validator results come from the working tree.

**3. Run-to-run stability is measured.** Seventeen runs, five cases, frozen prompt,
byte-identical input packs, all on Opus 4.8. Cases 01 to 04 three runs each, case 05 taken to
five on 2026-07-23. Full sheet at [eval-runs/stability/README.md](eval-runs/stability/README.md).

| Case | Runs | Stable core | Readiness |
|---|---|---|---|
| 01 | 3 | 58% | stable, R1 |
| 02 | 3 | 50% | stable, R1 |
| 03 | 3 | 45% | stable, R1 |
| 04 | 3 | 78% | stable, R0 |
| 05 | 5 | 9% | **VARIES: R2, R3, R3, R2, R2** |

The verdict is stable on the four cases that fire a blocking rule and unstable on the one
that does not. The important result got worse when measured properly: **the strong-deck
over-escalation is not fixed, it is the majority outcome.** Across five runs case 05 lands R2
three times and the correct R3 twice, so the reviewer returns the right readiness on the
restraint deck about two times in five. Extending from three runs to five is what surfaced
this: the three-run sample read as "about one in three", the five-run reality is "more often
than not". This does not make the 2026-07-22 scoring sheet wrong, it scored a real R3 run,
but the set's green on case 05 depends on which run is scored, and on a distribution the
exact-match requirement fails for case 05 more often than it passes. Readiness is robust
wherever a blocking rule fires and fragile only where none does, which is structural: the
blocking ladder is mechanical, the severity test under it is a judgment call.

Also surfaced: the system prompt never lists the `issueType` enum, so 2 of 15 runs invented
`analysis`. Mechanical fix, deliberately not applied yet because changing the prompt would
invalidate these fifteen runs. It belongs with the other pre-freeze fixes in plan item 1.5i.

Session note: the 16-agent wave hit the account session limit and every agent was killed
mid-task. Write-per-item discipline meant all 15 runs and the scoring sheet were already on
disk, so nothing was lost. Third session in a row this has happened. Treat the limit as a
planning constant, not an incident.

## Session 7 (2026-07-23): case 05 extended, labeling tooling built

- **Case 05 stability extended to five runs.** The two extra runs (d, e) both landed R2, so
  the five-run readiness is R2, R3, R3, R2, R2. The strong-deck over-escalation is the
  majority outcome, not one in three. The stability sheet and its section C point 1 are
  rewritten to this. This is the single most consequential change since the green: the
  restraint case is a coin-flip that lands wrong more often than right, and the set's green
  on case 05 depends on which run gets scored.
- **Blind labeling workstation built.** [eval-cases-real/labeling/labeling-workstation.html](eval-cases-real/labeling/labeling-workstation.html),
  build priority 4. One self-contained file, no server. A labeler opens a real-NN case file,
  it renders read only on the left, the worksheet form is on the right, and it enforces the
  protocol by construction: every required section filled and exactly one must-catch (or the
  restraint-case box) before the download unlocks. It exports `real-NN.worksheet.<initials>.md`
  in the harness section C shape and autosaves to localStorage so a 35-minute read is not
  lost. Blindness is structural: the page loads only the case file the labeler opens and has
  no path to any AI review, triage band or the other labeler's sheet. Tested in a browser
  against real-01: enforcement, autosave and export all verified.
- **Expert heuristics intake form committed.** reviewer-heuristics-intake.html, an eight
  question serverless form that captures how an experienced reviewer reads a deck, blind,
  before seeing the rubric. Feeds the expert-calibration track (plan Q2). It was already
  built and orphaned, so it is now tracked.

## Session 8 (2026-07-24): Path B readiness gate made real and verified, S4 closed, Path A drafted

Two working improvements landed and one owner decision is teed up. No new design document.

**1. Path B: the renderer readiness gate now actually gates.** The over-flagging problem
(next action 1, previous session) has two paths. Path B was on record as already satisfied
because "readiness surfaces in lead mode only", but the renderer only separated readiness
into the lead *view*, it did not gate it: [index.html](index.html) `load()` enabled every
tab unconditionally, so the Project lead tab (which carries the readiness verdict) was one
click from any student holding the file. That is now a real gate. A student build is reached
with `?role=student` on the URL: the lead and printable views are never rendered into the
DOM, their tabs are removed, and any forced `setView` to them bounces to coaching. The
default (no param) is byte-identical to before, so the board demo keeps both modes open as
decided and the risk stays accepted. Verified headless with Playwright (six checks pass):
default shows three tabs with populated readiness, `?role=student` shows only coaching with
`#readiness` empty in the DOM and the forced-navigation bounce holding, coaching content
still renders. Decision-log entry added. This does not fix the over-escalation, it contains
it: a false not-ready can no longer reach a student. The lead-mode coin-flip is untouched,
which is what Path A is for.

**2. S4 closed, the source-register backlog is clear.** The last open source item (next
action 4) was to confirm the S4 journal tables match the working paper figures. The
published Organization Science version (DOI 10.1287/orsc.2025.21838, online 11 March 2026,
22 pages) was read directly. 12.2 percent more tasks, 25.1 percent faster and 19 percentage
points less likely outside the frontier are confirmed verbatim. The more-than-40-percent
quality and the about-43-percent below-average figures are **not** carried as percentages in
the journal: they are 2023 working paper abstract numbers, restated qualitatively
(significantly improved quality, lower-skilled individuals gained the most). The register
cited the journal DOI while quoting those two working-paper-only percentages, breaking its
own never-a-blend rule and exactly what an ex-consultant who knows this paper would flag. S4
claim and status corrected to attribute them to the working paper. Blast radius checked: the
two figures were a source claim only in S4. This clears plan item 2a, the gate on expert
recruitment (next action, plan D2).

**3. Path A drafted, not applied, pending the owner call.** Mechanism pinned from the run
files: on a no-blocker deck readiness is a deterministic function of one variable, any
finding graded major gives Needs targeted revision and zero majors gives Nearly ready (case
05 runs a/d/e have exactly one major and land R2, runs b/c have zero and land R3). So the
wobble is entirely the major-versus-minor call on one borderline finding, upstream of the
readiness ladder, which is itself mechanical. The drafted fix is a severity-consistency
clause for the no-blocker paragraph of the SEVERITY block: because no blocking rule fired,
rules 1 to 5 have already certified a clear decision, a supported core recommendation, sound
framing, no ungrounded decision-driving number and no safety breach, so a finding cannot be
major on the grounds that the core is under-supported, under-validated, under-sized or
under-benchmarked (that is a refinement, graded minor), and genuine uncertainty resolves to
minor, mirroring the readiness block's own tie-break. It is a pure addition, reversible,
binds only when blockingIssues is empty so it is a no-op on cases 01 to 04 by construction,
and needs no contract change (the renderer already enforces all-minor plus no-blocker equals
Nearly ready). It is deliberately not applied: any prompt edit invalidates the seventeen
stability runs, and plan items 1.5i (issueType enum) and 1.5j (blockingIssues primary) must
batch into the same single pre-freeze pass with one re-measurement. Awaiting the owner A/B
decision before touching the frozen-candidate prompt.

**4. Prompt and rubric drift found, and the stale number re-measured.** Setting up Path A
surfaced that the prompt on disk had already drifted from the seventeen stability runs.
Commit 54171e5 (2026-07-24, a bulk sync) had applied an unmeasured readiness rewrite and the
issueType enum to 04 section A, and the rubric's 2026-07-23 redesign had already decoupled
no-blocker readiness from the major count. None of it was decision-logged and the log still
read issueType as not yet fixed. So the case 05 three-of-five over-escalation was stale. The
stale sheet now carries a SUPERSEDED banner, the decision log records the drift, and the
rubric's dangling See-decision-log reference is resolved. The owner chose to measure the
current package before changing anything. Re-measurement on synthetic case 05, blind,
byte-identical pack, current package, Opus 4.8, five runs:
[eval-runs/stability/current-2026-07-25/README.md](eval-runs/stability/current-2026-07-25/README.md).
Result: readiness R3, R3, R2, R3, R3, correct in four of five and over-escalated in one, down
from the superseded package's R2 in three of five. **The over-escalation is reduced, not
eliminated.** An interim reading after the first three runs (all R3, the other two killed by
the session limit) said it was fixed and retired Path A. The fourth run reproduced it, the
same three-run trap the earlier case 05 measurement fell into, so that interim call is
reversed. The one R2 (run h) promotes the 5-versus-8 percent launch-gate finding to major,
the finding adjudicated on 2026-07-03 as a real observation graded too high on a deliberate
pilot deck, and run h is also contract-invalid (deliveryCritical with no blocking issue). So
Path A is back in play: the residual is a severity wobble on one borderline finding, which is
exactly what the clause targets. Applying it or accepting one in five is an owner call, teed
up with the real number. The contract prose (03 section B) was also corrected this session to
match the redesigned rubric (it had still said empty blockingIssues plus any major means R2).

## Next actions

1. **Over-flagging: reduced to one in five, owner call re-opened.** Path B (readiness gate) is
   done and verified, so no student sees the false R2 regardless. The current package cut
   over-escalation from three in five to one in five but did not remove it. Owner decision:
   apply Path A (tighten the major test, then re-measure) to push toward zero, or accept one in
   five as within the rubric's stated err-toward-R3 tolerance and let the real-case baseline be
   the judge. Recommendation leans accept-and-proceed, because the improvement is already large,
   the residual is a genuine borderline judgment, and Path B contains the student-facing risk,
   but it is the owner's call.
2. **Remaining pre-freeze prompt work, still open.** Plan item 1.5i's L-dimension denominator
   rule (a fixed sub-check count per dimension, vacuous sub-checks resolve to na) and 1.5j
   (blockingIssues reports the binding blocker as primary) are not yet in the prompt or rubric.
   The issueType half of 1.5i is done (confirmed by the re-measurement: no invented values).
   Do 1.5i and 1.5j (and Path A if the owner chooses it), regression-run the synthetic five on
   the current package, then freeze. One prompt pass, one re-measurement.
3. The labeling track can start, and the tooling is now verified end to end (2026-07-25). The
   labeling workstation's export format matches the adjudication parser exactly (by inspection),
   and the adjudication workstation was runtime-tested with fabricated fixtures: it parses both
   R-levels, computes the readiness delta, gates the gold download until the human fills it, and
   never pre-selects a label, with the different-case and same-labeler guards both firing. The
   protocol and worksheet exist, two labelers are secured per the owner decisions. Nothing in
   the tooling blocks it. This is the long pole (plan item 1.5c, the four-case calibration batch
   first).

See [eval-runs/NEXT-SESSION-PROMPT.md](eval-runs/NEXT-SESSION-PROMPT.md) for the earlier
paste-ready continuation prompt (now largely superseded by this session).

## Session 9 (2026-07-25 to 26): gold checker built, over-flagging decided, 1.5i + 1.5j done, prompt frozen

Four things landed, all verified, no new design document.

**1. The AI gold consistency checker exists.** [check-gold.js](check-gold.js) is the
compensating control single-pass labeling was missing (PROTOCOL step 4). It parses the
labeling-workstation gold shape and reports only internal contradictions for a human to
resolve, never a label: one must-catch or a restraint case, valid readiness, readiness at or
below any cited ceiling, a blocking rule for R0 or R1, no critical issue under an R3, valid
severities, dimensions and issue types, every section filled. It mirrors check-review-v2.js
8a to 8d. Verified against two fabricated real-00 fixtures and a 17-assertion per-rule harness
(all pass), covering both the blocking-present and blocking-absent branches. PROTOCOL step 4
now points to the real command. No real case was touched.

**2. The over-flagging decision closed.** The owner accepted the 1-in-5 case 05
over-escalation and declined Path A (the drafted severity-consistency clause). Path B already
gates readiness out of the student view, and the real-case baseline is the true calibration
test. The pre-freeze prompt pass therefore carried only 1.5i and 1.5j.

**3. 1.5i and 1.5j implemented and verified.** 1.5i, the scorecard denominator fix: every
dimension carries a scope (full, light, na) from the artifact-type matrix; checksTotal is
pinned to the four enumerated sub-checks and shrinks only as sub-checks resolve to na;
diagnosticMean averages full-scope dimensions only, so a light dimension's non-comparable
denominator can no longer corrupt the one objective number (the 2026-07-03 effectiveness
review's bug a and b). 1.5j, the blocking fix: with multiple blockers, exactly one is primary,
the binding lowest-ceiling one, the rest secondary and mainReason names it. Enforced in
check-review-v2.js and the renderer, both presence-gated so pre-1.5i reviews still validate
and the board demo's embedded legacy review is untouched. Contract, prompt, rubric and the
three canonical fixtures updated. Verified: validator 9 of 9 new-format plus 3 of 3 legacy,
renderer 10 of 10 headless Playwright.

**4. Nine-run blind regression, then freeze.** The frozen candidate was run blind on the five
synthetic cases (Opus 4.8, byte-identical stability packs, fresh-context runners each reading
one self-contained pack, case 05 five times). Result: readiness match 9 of 9 (01 R1, 02 R1,
03 R1, 04 R0, 05 R3 in all five), every run valid under the new contract with verbatim quotes,
case 05 over-escalation did not reproduce (5 of 5 R3, mean stable 4.5 to 4.8). The live runs
exercised both mechanics: case 01 marked exactly Feasibility light per the draft-deck matrix,
case 04 marked its Not-ready rule 1 primary among three blockers. Sheet at
[eval-runs/regression-1.5ij-2026-07-25/README.md](eval-runs/regression-1.5ij-2026-07-25/README.md).
The prompt is now frozen (freeze tag frozen-2026-07-26, banner in 04 section A, decision-log
entry), no edits until plan item 1.5o.

## Session 10 (2026-07-26): confidentiality and sanitization gate built

Build-track item 3 landed, off the critical path of the gold. The hard rule is that no real
client material touches the tool until a sanitization gate exists, and it did not. Now it does.

- [SANITIZATION.md](SANITIZATION.md) is the one-page ten-minute checklist a lead applies
  before any real deck: client name to a label, people to roles, contact details out, logos
  and client confidentiality markings out, figures banded, places generalised, un-sanitizable
  slides described not pasted. Drawn from 07-workflow.md section E and 12-real-deck-intake Q3.
- [check-sanitized.js](check-sanitized.js) is the machine backstop, a local no-dependency
  scanner in the check-review-v2.js idiom. It blocks (exit 1) on seven high-confidence
  identifier classes (email, URL, domain, handle, named org by legal suffix, named person by
  honorific, phone) and surfaces without blocking three review-tier classes (confidentiality
  markings, logo references, precise currency figures). It ignores sanitized placeholders,
  redaction tokens, banded figures, plain data numbers and safe domains, so a scrubbed deck
  passes clean. It never edits the file and never certifies a deck safe.
- Verified: fixtures-sanitize/check-sanitized.test.sh, 19 per-category assertions all pass,
  plus a clean and a dirty committed fixture. Banded ranges are correctly not flagged, precise
  amounts are. No real case touched.
- This is also the proxy's pre-API sanitization step: when build-track item 2 is built, the
  proxy runs this logic first and rejects an exit-1 deck before any API call.
- Remaining: 3b, the confidentiality-owner sign-off, is a people task and stays open.

## Next actions (Session 9)

1. **The gold, the long pole.** The team labels the 14 real cases single-pass, blind, per
   PROTOCOL. Calibration round on four first. Run check-gold.js on each finished gold. The AI
   supports mechanics only and never writes or suggests a label.
2. **Baseline, gated on the gold.** Once a case has its gold AND the prompt is frozen (it is),
   run the frozen reviewer blind on that case and score against the human gold: readiness
   match, must-catch recall, precision, restraint. No reviewer run on any real case before its
   gold exists.
3. **Expert recruitment.** The source backlog is clear (plan item 2a done), so start the
   ex-consultant recruitment, the longest lead time.

## Session 10 (2026-07-25 to 2026-07-27): owner labeling round, 8 of 14 golds

Human labeling work, single pass per the 2026-07-25 decision. The AI acted as scribe and
reading aid only, it wrote no label and suggested no readiness level.

- **A local case reader was built** to make the raw extractions readable. It parses the real
  case files directly and splits them per slide or page, strips repeated chrome (the running
  header, page numerals, the repeated breadcrumb nav), surfaces speaker notes and internal
  comments in their own block, flags image-only slides, and lets the labeler attach a
  screenshot per slide so a diagram is not judged blind. It is gitignored, it renders real
  client decks.
- **8 cases labeled by the owner:** real-01, real-02, real-03, real-04, real-05, real-08,
  real-12, real-13. Spoken assessments were captured to worksheets, then written to gold
  shape. All eight pass check-gold.js clean, 8 of 8. real-02 was held as a draft because the
  labeler placed it between two readiness levels, and the owner resolved it to R2 on
  2026-07-27, which matches MF's independent second read exactly.
- **Readiness spread:** R0 on real-04 and real-08, R1 on real-12, R2 on real-01, real-02,
  real-03, real-05 and real-13. Not clustered, which is what a usable gold needs.
- **real-05 is the restraint case of the real set.** The owner rated it R2 and explicitly
  called it almost R3, the strongest deliverable reviewed. Its gold names restraint in the
  unacceptable-feedback section, so an over-escalating run on it is a scored failure. This is
  the real-data analogue of synthetic case 05.
- **A recurring standard emerged across the labeled cases,** unprompted and consistent: the
  deliverable names what to do but never shows how, so the client cannot act (real-01,
  real-02, real-03, real-05, real-12, real-13); no governing executive summary a busy reader
  can lift in one pass (real-01, real-03, real-04, real-05, real-08, real-13); and competitor
  or market depth is thin when that outside read is a large part of what a client is paying
  for (real-01, real-08). Every must-catch selected lands on whether the client gets a
  decision, not on style. That is a coherent and testable target for the baseline.
- **One second read exists,** MF on real-02, from before the single-pass decision. Kept as a
  bonus cross-check, not required. Both reads overlap at R2.
- Note for the baseline: several labeled cases carry artifacts the labeler did not raise but
  which are in the decks, recorded as observations inside the gold files rather than as
  findings, so they neither inflate nor hide the human label.

## Next actions (Session 10)

1. ~~Owner decision on real-02.~~ **Done 2026-07-27**, resolved to R2, gold written and
   check-gold.js clean. The eight owner-labeled golds are complete.
2. **Team finishes the remaining six:** real-06, real-07, real-09, real-10, real-11,
   real-14. That is the gate for plan item 1.5g.
3. **Then the baseline (1.5m),** the first honest number on real work. The prompt is already
   frozen, so this is unblocked the moment the golds exist.
