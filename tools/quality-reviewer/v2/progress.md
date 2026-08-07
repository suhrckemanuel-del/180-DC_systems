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

## Next actions (session 7, superseded by session 8 below)

1. **Decide the case 05 question, now sharper.** The restraint case over-escalates 3 of 5.
   Either take another pass at the severity test before the freeze (the escalation floor plus
   the major-versus-minor rule are the two levers), or accept the restraint case as unstable
   and design the pilot so a lead always sees a strong deck's readiness, never a student. This
   is an owner judgment. The sheet still sets no numeric threshold.
2. Fix the `issueType` enum omission and the two known prompt defects (plan items 1.5i and
   1.5j) in the same pre-freeze pass, then regression-run the synthetic five. Any prompt edit
   invalidates the seventeen stability runs, so batch every prompt change into one pass and
   re-measure once.
3. The labeling track can start: the workstation is ready, the protocol and worksheet exist,
   two labelers are secured per the owner decisions. Nothing in the tooling blocks it now.
4. Still open from the source register: confirm the S4 journal tables match the working
   paper figures.

See [eval-runs/NEXT-SESSION-PROMPT.md](eval-runs/NEXT-SESSION-PROMPT.md) for the earlier
paste-ready continuation prompt (now largely superseded by this session).

## Session 8 (2026-08-02): the real-deck baseline exists

The first honest measurement of the reviewer on real client work. Run folder
`eval-runs/real-baseline/2026-07-29T16-29-44-subagent-packs/` (gitignored). Prompt
`frozen-2026-07-26` sha256 `20cc7e4add709427`, matcher `mc-match-1`, no prompt edits made
during the run.

- **7 pending cases reviewed blind and collected**, joining the 2 already done. Batches of 4
  then 3, one Claude Code subagent per case, each seeing only its own `<case>.input.md` plus
  `03-output-contract.md`. No agent touched a gold, a worksheet or another case's review. All
  9 reviews are contract-valid on `check-review-v2.js`, with two non-fatal warns (real-02
  reuses a quote across findings 1 and 4, real-08 has a scorecard dimension result that does
  not match its own check count).
- **The set is 9, not 11.** `real-10` and `real-11` carry REVIEW-NEEDED banners and fail
  `check-gold.js` with the same contradiction: readiness at R1 and R0 respectively, with the
  single must-catch issue marked critical, but the blocking-rule field left as `none`. The
  eligibility gate skips both, which is why they never had input packs. This needs a human
  call, not a labeling pass: cite the rule that fires, lower the issue to major, or raise
  readiness. Resolving it takes the set from 9 to 11.

### Headline (n=9)

| metric | value |
| --- | --- |
| readiness exact | 22.2% |
| readiness within one level | 55.6% |
| must-catch recall | 22.2% (66.7% counting the 4 near misses) |
| over-flag rate | 66.7% |
| restraint violations | 1 of 1 |
| severity exact where matched | 100% (n=2) |
| blocking false positives | 66.7% |
| blocking rules missed | 0% |
| gold issue coverage | 21.6% |
| mean findings per review | 4.9 |

Holdout (real-05, real-08, real-13) vs tuning: within-one 66.7% vs 50%, exact 0% vs 33.3%,
must-catch 33.3% vs 16.7%, over-flag 66.7% in both. The holdout is not better than the tuning
set, so the over-flagging is not an artifact of tuning.

### The owner question, answered with numbers

Does the tool over-flag strong decks on real work the way it does on synthetic case 05? **Yes,
and worse.** The failure is not spread across the set. It is entirely concentrated on strong
decks and it is unanimous there.

Strong-deck cases are the 6 golds at R2 "Needs targeted revision", the highest readiness any
real gold reached. `real-05` is additionally an explicit restraint case: its gold says in as
many words that it is a strong deck and that manufacturing criticals to justify a lower
readiness would be a calibration failure. The tool did exactly that.

| case | gold | tool | delta |
| --- | --- | --- | --- |
| real-01 | R2 | R0 | -2 |
| real-02 | R2 | R0 | -2 |
| real-03 | R2 | R0 | -2 |
| real-05 (restraint) | R2 | R1 | -1 |
| real-13 | R2 | R0 | -2 |
| real-14 | R2 | R1 | -1 |

**6 of 6 escalated. 0 exact. 4 of the 6 by two full levels**, landing on "Not ready for client
review" for decks a human called ready with targeted fixes. Synthetic case 05 over-escalated 3
of 5. On real strong decks it is 6 of 6.

The contrast is the useful part. On the 3 weak and mid decks the tool is dependable: real-04
R0 exact, real-12 R1 exact, real-08 R0 called R1, which errs soft, the direction the rubric
intends. Blocking rules missed is 0% across the whole set, so it does not let real problems
through. It invents blockers on good work instead: on the 6 strong decks it cited 1 to 3
blocking issues each where the gold cited none.

Read that as a competence boundary, not a general accuracy problem. The readiness verdict is
trustworthy when the deck is weak and untrustworthy when the deck is nearly good. That is
backwards for a pilot, since near-ready decks are most of what students would submit.

**This is the owner's call and it is not made here.** The two options from session 7 stand,
now with evidence: recalibrate the readiness rules and re-measure all 9, or pilot lead-mode
only so a student never sees a readiness level. Nothing was changed in the prompt, the rubric
or the output contract this session.

Caveats worth stating: 9 cases is small and one case moves a headline metric by 11.1 points.
Must-catch matching is deliberately conservative (text overlap plus two of three supporting
signals), so 22.2% is a floor and the 4 near misses (real-02, real-08, real-12, real-14) are
where a human call decides. Severity exact is 100% but on n=2, which is too thin to lean on.

### Also this session

- **Stability on a weak deck confirmed.** real-04 was reviewed twice under the frozen prompt by
  independent sessions, 2026-07-29 and 2026-08-02, and the two runs are identical: same 5
  findings in the same order, same severities, same R0, same 4 blocking rules, same
  diagnosticMean 1.7, same score on all four axes. That is the stability floor for a weak deck
  where the blocking rules fire unambiguously. It says nothing about strong decks, which is
  where the variance lives. Both files preserved, plus a short-mode review of the same deck for
  the Track B renderer.
- **Harness committed** (`867d0bb`): `run-reviews.js`, `score-review.js`, `scorecard.js`,
  `check-gold.js`, `package.json`, `package-lock.json` and the fabricated `real-00` fixtures.
  Confirmed before staging that decks, golds, worksheets and `eval-runs/real-baseline/` are all
  gitignored. No real-case material is in the repo.
- **Harness defect worth knowing.** `run-reviews.js` does not recognise `--help` and treats any
  unknown flag as the real API run. An accidental `--help` this session started a live run over
  all 9 cases. Every request failed with a 400 (`compiled grammar is too large`) so nothing was
  written and nothing was spent, and the empty run folder it created was deleted. Two things to
  fix later: add a `--help` guard, and note that the API path is currently broken by that
  grammar error, which is why the subagent path is the working one.
- **STATUS.md rewritten.** It had claimed the tool had never run on a real deliverable and that
  human labeling was the long pole. Both are now false.

## Session 9 (2026-08-02): the calibration sprint, measured

Three prompt edits in one pass, then a full blind re-run of the same 9 cases. Run folder
`eval-runs/real-baseline/2026-08-02T20-40-19-subagent-packs/`, prompt `frozen-2026-08-03`
(sha256 `39c18fbca9e5d218`). The full write-up with both tables is `RESULT.md` in that folder.

- **The old prompt was archived first**, verbatim, to `eval-runs/prompt-archive/frozen-2026-07-26.txt`.
  It re-hashes to `20cc7e4add709427`, which is the hash the baseline run recorded, so the
  before/after is reproducible and the revert path is proven rather than assumed.
- **The success test was written before the first case ran**, as `EXPECTATIONS.md` in the run
  folder. Primary test, regression guard and secondary metrics were all fixed in advance,
  because a result you can rationalise afterwards is not a measurement.
- **The three edits.** Extraction awareness appended to the evidence rule, naming the
  "Extraction notes" section explicitly (its heading says "for labelers, not part of the
  deliverable", which invites the reviewer to ignore it). A two-part decision-change test on
  blocking rule 1, replacing the "walks into" loophole. Severity no longer inherits from
  readiness, appended to the severity section.
- **The nine input packs are byte-identical to the baseline's**, verified by hashing each pack
  from its `<!-- USER INPUT` marker down. The prompt was the only variable.
- **Primary test passed at the low end.** real-13 came back R2 and exact. That is the first
  time the tool has used either of its top two readiness levels on real work. The bar for a
  fixed instrument was three or four of six. This was one of six.
- **The regression guard held on all three.** real-04 exact at R0 and still firing rule 1,
  real-12 exact at R1, real-08 unchanged at R1. The over-flag improvement was not bought by
  going soft on genuinely bad decks, which was the failure mode most worth watching for.
- **Every headline moved the right way**: readiness exact 22.2 to 33.3, within one 55.6 to
  77.8, over-flag 66.7 to 55.6, strong-deck over-flag 6 of 6 to 5 of 6, must-catch recall
  22.2 to 33.3, gold issue coverage 21.6 to 32.4. Blocking rules missed stayed 0%. Severity
  exact fell from 100% (n=2) to 66.7% (n=3), which is one review disagreeing on a base too
  small to read.
- **Rule 1 is no longer the ceiling, rule 2 is.** Rule 1 stopped firing on real-01 and kept
  firing where the gold agrees. Six of nine cases now sit at R1 on rule 2, and rule 2 has no
  decision-change test. That is the obvious next edit if the owner picks iterate.
- **Extraction awareness is visibly working.** Every subagent independently reported routing
  flagged-table values into `questionsForLead` and `notAssessed` instead of building findings
  on them. That was the exact real-01 failure the sprint targeted.
- **Variance is real and unmeasured, and it lands on the behaviour under test.** real-03's
  first attempt failed the contract (a minor finding marked deliveryCritical) and was re-run
  per the sprint rule. That attempt had assigned R1 and explicitly declined rule 1. The re-run
  assigned R0 and fired rule 1. Same prompt, same input, two levels apart. Only the valid
  re-run is scored. `check-stability.js` is the tool for sizing this band and it has not been
  run on real cases.
- **The `--help` trap is closed.** `run-reviews.js` now prints usage and exits 0 on `--help`,
  and exits 2 on any unrecognised flag, on the `--flag=value` form that `arg()` cannot see,
  and on any stray positional. Previously all of those fell through into a live run over all
  9 cases. The header usage comment carries the same warning.
- One harness wrinkle worth knowing: `--collect` only processes manifest rows still marked
  `pending`, so a case that failed the contract stays `invalid` and its re-run is silently
  skipped until the row is reset. Reset the status before re-collecting.

## Next actions (session 9, superseded by sessions 10 to 12 below)

1. **Owner decides ship, iterate or revert** on the 08-03 result, target Wednesday 2026-08-05.
   Read `RESULT.md` in the 08-03 run folder. Revert is intact: the archived prompt reproduces
   the baseline exactly and the 07-29 run folder is untouched. Any further prompt edit
   invalidates the 08-03 run and forces another full re-run of all 9.
2. **Run `check-stability.js` on two or three cases before deciding.** real-03 disagreed with
   itself by two levels this session. Until that band is sized, a one-case improvement cannot
   be told apart from noise, and it is cheap to find out.
3. **If the call is iterate: blocking rule 2 gets the same surgery rule 1 just got.** It is
   the binding ceiling now, it holds six of nine cases at R1, and the precedent is in
   [11-decision-log.md](11-decision-log.md).
4. **Resolve the real-10 and real-11 gold contradictions.** A human decision, roughly minutes of
   work, and it is the cheapest available improvement to the sample: 9 cases to 11.
5. **Have the ex-consultant adjudicate the near misses** (real-08 and real-14 this run). The
   matcher is conservative by design and these are the band where must-catch recall could move
   from 33.3% to as high as 55.6% without any change to the tool.
6. **Investigate the API-path grammar error** (`compiled grammar is too large`). The subagent
   path is the working one, so this is not blocking, but the API path stays broken until it
   is looked at.
7. **Track B, the visual**: port the v1 Team Lead Mode renderer onto the v2 contract. The
   short-mode real-04 review is sitting in the run folder as its input. Has its own build prompt.
8. Still open from the source register: confirm the S4 journal tables match the working paper
   figures.

## Session 10 (2026-08-03): stability on real cases, and the gate stop

The single most important pre-pilot number, and it came back badly. Full conclusions in
[18-evidence-base.md](18-evidence-base.md) A3, A4 and A9.

- **Findings repeat. The verdict does not.** Under a frozen prompt on byte-identical input,
  one case repeated four of its five findings across all three draws and another repeated its
  top critical finding in all three. The readiness level on one case returned R0, R0 and R2,
  with blocking rules firing `1,4`, then `1,2`, then none. Readiness is compared as an exact
  level match and never touches the finding matcher, so this is not a scoring artifact.
- **The reviewer reads consistently and grades inconsistently.** That sentence is the central
  result of the whole programme and it is what the live product is built around.
- **Single-draw evaluation is invalid from here on.** Every metric produced before today is
  one sample from a distribution now known to span two readiness levels, which includes the
  baseline headline and the calibration sprint's apparent improvement. The difference between
  them may be nothing. Every future experiment runs N draws and costs roughly three times as
  much.
- **The critique-quality sprint stopped at its own preregistered gate, unedited.** The gate
  asked whether the scorer could resolve the change the sprint proposed. It cannot: the
  must-catch verdict flips between `miss` and `near` on three of four stability cases, one
  flip decided by 0.005 of match score and another by 0.010. Record in
  [GATE-STOP-critique-quality.md](GATE-STOP-critique-quality.md). Stopping on a gate you wrote
  in advance is cheap. Ignoring it is what costs.
- **[17-override-log.md](17-override-log.md) written**, specifying the lead override record
  that becomes the calibration source once hand-labelling stops paying for itself.

## Session 11 (2026-08-05): the Triage Desk goes live, and the prompt changes

- **Live at https://180dc-reviewer.pages.dev.** A lead does the whole loop from a link: read
  the status board, triage every finding as keep, question or cut with a reason, set their own
  readiness level, release a note. About four minutes on a five-finding deck. Two deliberate
  refusals: the desk does not start pre-agreed with the reviewer, because one that starts fully
  kept manufactures the agreement it exists to measure, and no readiness level ever reaches a
  student.
- **The prompt changed on the two-axis thesis.** An ex-McKinsey consultant, asked independently
  where a consultant's return sits, put roughly 60% of it on clarity of communication, which
  corroborates A6 from outside the data, and named interrogating numbers as the other half. Four
  edits: the rule that cut communication findings first is deleted, a reader test added,
  readability given a slot in the priority order, and a comparator test (compared to what, so is
  that good, and if not what is it a symptom of). Plus a lead-with-the-point rule. Now
  `frozen-2026-08-05c`, sha `80983d7179eb950f`. Full record in
  [19-prompt-change-2026-08-05.md](19-prompt-change-2026-08-05.md).
- **Archive discipline broke once and is recorded rather than hidden.** Revision `b` was edited
  into `c` without being archived first, so `b` cannot be restored byte-exact. Nothing was
  measured on it and both revert points that matter re-hash correctly.
- **The cheapest quality check found seven ambiguities in two rounds.** Hand the prompt to blind
  reviewers on a real case and ask which instructions were ambiguous to execute. Round two found
  that three of round one's four patches had narrowed the ambiguity rather than closed it. This
  should be routine after every prompt edit.
- **A8b: every subagent pack back to the 07-29 baseline was incomplete.** `--emit-packs`
  extracted only section A of the prompt document, so packs carried no noise budget, no scope
  matrix and no output contract. Runs came back contract-valid because the operator supplied the
  missing pieces in the subagent brief, unrecorded and unhashed. Fixed, and the manifest now
  records a `contextSha256`. Not retro-fixable, and it matters most for restraint, which was
  scored against a budget the reviewer was never shown.

## Session 12 (2026-08-05): the scorer measured, and it failed

The sprint that changed what every earlier number means. Method and decision rules were written
before any result was seen. Full record in
[21-scorer-refit-sprint.md](21-scorer-refit-sprint.md).

- **178 gold-issue and finding pairs, adjudicated blind by two independent agents.** They agreed
  with each other at 98.9%, kappa 0.971, so the judgement is stable and answerable. The matcher
  agreed with them at AUC 0.718.
- **The decisive figure.** At its single best possible cut point the match score classifies 88%
  of pairs correctly. Calling every pair not-caught, with no model at all, gets 85%. The whole
  discriminative power of the instrument is three points over a constant that ignores the input.
- **Thresholds were re-fitted anyway.** `T_HIT` 0.45 to 0.39, `T_NEAR` 0.28 to 0.24,
  `MATCHER_VERSION` now `mc-match-2`. F1 improved by about a third on both and precision at the
  new `T_HIT` is still 46%, so more than half of everything called a hit is not one. One of three
  unstable stability cases stabilised. Two still flip. Scores are not comparable across
  `MATCHER_VERSION`.
- **The cause is known.** It scores vocabulary overlap. The judgement that matters is whether two
  texts describe the same problem. Both adjudicators independently reported the two failure
  shapes: real catches are same-complaint-different-vocabulary, false positives are
  same-slides-different-problem. Overlap scoring gets both backwards.
- **Both baselines re-scored under `mc-match-2`, and two published numbers moved.** Must-catch
  recall reads 22.2% to 44.4%, not 33.3%, so that gain was understated and is twice what was
  claimed. Gold issue coverage reads 35.1% to 37.8%, not 21.6% to 32.4%, so a reported +10.8
  points is really +2.7 and was largely an artifact. Every direction survives re-scoring. One
  magnitude does not.
- **The ship, iterate or revert call was resolved: iterate.** Next build is `mc-match-3`, an LLM
  judge, validated against the 178-pair set that now exists. No prompt is re-run until it lands.
  The sprint incidentally proved the approach: two LLM adjudicators agreed with each other at
  kappa 0.971 on exactly this call.
- **Standing rule from this session.** No recall, coverage or must-catch percentage from this
  project goes into any external communication until the matcher is replaced. The honest
  statement is that we have not yet measured this reliably, not a number.

## Session 13 (2026-08-07): documentation integrity

Nothing measured. A sweep of every tracked document against the code and against
[18-evidence-base.md](18-evidence-base.md), after an audit found STATUS.md describing a sprint
that had already run as not started, and a decision reported as taken at the top of the file and
open at the bottom.

- **Version drift was the small half and it was nearly clean.** Two dead links, no stale prompt
  hash or threshold asserted as current anywhere. The hash discipline in the prompt worked.
- **Stale claims of state were the large half.** Around a dozen documents still said the tool had
  never run on a real deliverable, that no gold labels existed, that stability was unmeasured or
  that no renderer was built. All four have been false since 2026-08-05 at the latest. The worst
  were the outward-facing ones.
- **`check-docs.js` built.** Reads prompt version, prompt sha, matcher version and thresholds
  from the code and flags any document asserting a different value in the present tense, plus
  dead links and anchors. No network. Tuned to under-flag: it cannot catch a stale claim of
  state, which is the half that actually bit.
- **The decision log had stopped on 2026-07-23** and was missing every decision from the real
  baseline onward, including the iterate call. Fifteen entries appended from the primary records.

## Next actions (current)

Superseding every earlier list in this file. The ordered version lives in
[STATUS.md](STATUS.md) and this is the same sequence.

1. **Build `mc-match-3` as an LLM judge.** Everything waits on this. Validation set exists.
   The design problem is determinism: fixed prompt, low temperature, N draws with a majority
   vote, cached by pair hash.
2. **Then re-run all nine cases on `frozen-2026-08-05c`**, N draws per case. Not before. At 46%
   precision the numbers would move and nobody could attribute the movement.
3. **Resolve the real-10 and real-11 gold contradictions.** A human cites the rule that fires,
   lowers the issue to major, or raises readiness. Minutes of work, and it takes the set from 9
   to 11.
4. **Get the ex-consultant to sanity-check the tool's judgment on a real deck**, especially the
   near misses. This is the Phase 2 calibration that has never happened. The 2026-08-05
   conversation changed the prompt but he has never seen the output.
5. **Blocking rule 2 gets the same decision-change test rule 1 got.** It is the binding ceiling
   now. After the matcher lands, not before.
6. **Small pilot**, scoped once 1 and 2 have run.
7. **Investigate the API-path grammar error** (`compiled grammar is too large`). Not blocking,
   the subagent path works.
8. Still open from the source register: confirm the S4 journal tables match the working paper
   figures.
