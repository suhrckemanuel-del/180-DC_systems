# 12. Real-deck intake: building the gold set from past deliverables

Session artifact, started 2026-07-04. This is the pipeline that turns the Drive library
of past sanitised deliverables (about 180 unique decks across roughly 60 projects) into
real eval cases with human gold labels. It closes the top gap named in
[effectiveness-review-2026-07-03.md](effectiveness-review-2026-07-03.md): the eval so
far is five short synthetic decks with insider gold and no PDF extraction noise.

Voice rules apply.

---

## A. What this pipeline produces

- Real eval cases in [eval-cases-real/](eval-cases-real/), numbered real-01 onward,
  each built from an actual past deliverable, pseudonymised, with extraction noise kept.
- A blind labeling kit so the team writes gold labels without seeing any AI review or any
  machine quality guess.
- Seeded-flaw variants of one strong deck, where the ground truth is mechanical because
  the flaw was injected on purpose.
- A sealed selection memo recording why each deck was picked, kept away from the
  labelers until labeling is done.

The synthetic set in [eval-cases/](eval-cases/) stays frozen as the regression suite.
Real cases never replace it, they extend it.

## B. Provenance rules (why the gold stays trustworthy)

1. **Gold labels are written by humans only.** The AI orchestrator prepares case files
   and worksheets. It never writes, drafts or suggests a gold label for a real case.
   A machine-drafted gold would let the reviewer grade its own homework.
2. **Machine triage is sampling machinery, not ground truth.** Decks are triaged by AI
   agents into rough quality bands only to pick a spread. The bands live in the sealed
   memo. Labelers must not read them before labeling, so the machine guess cannot
   anchor the human judgment.
3. **Single-pass team labeling, blind, with a calibration round.** The team labels each
   case once using the kit, blind. It starts with a calibration round on four cases done
   together, which surfaces rubric ambiguity the way the old two-reader stop rule did: if
   the team cannot settle the four, fix the rubric before labeling the rest. An AI
   mechanical consistency check runs on every finished gold and flags internal
   contradictions for the humans to resolve, never a label. This replaces the earlier
   two-labeler blind-then-adjudicate design, which the team cannot staff. The trade, the
   loss of an inter-rater agreement number, is recorded and read into the baseline. See the
   2026-07-25 decision-log entry and [eval-cases-real/labeling/PROTOCOL.md](eval-cases-real/labeling/PROTOCOL.md).
4. **Seeded flaws are the exception.** For seeded-flaw variants the ground truth is the
   injected flaw itself, so no human label is needed beyond a sanity pass. They are
   regression tests, not the core eval.

## C. Anonymisation policy

These files stay in a private repo. Anonymisation here is pseudonymisation for prompt
safety and future shareability, not public release.

- Client name becomes a codename (Client R01 for case real-01 and so on), applied
  consistently through the case file.
- Every named person (students, team leads, client staff) becomes a role label
  (Consultant 1, General Manager). Team-introduction slides may be cut entirely.
- Live URLs, social handles and contact details are stripped or genericized.
- Business facts, figures, sector and geography stay. Removing them would make the
  review meaningless. This means a case is not fully de-identifiable; that is accepted
  for private use and re-scrubbed if a case ever leaves the repo.
- The mapping from codename to real client lives only in the sealed selection memo.

## D. Case file format

Mirrors the synthetic cases so the reviewer input template fills the same way:

- Header: case number, client codename, artifact type, client question (from the deck
  or its project brief; marked "not stated" if genuinely absent, which is itself a
  realistic condition the reviewer must handle), draft maturity or deliverable stage.
- No failure-mode line. Real decks are not built around a single known flaw, and the
  blind protocol strips such headers anyway.
- Body: the extracted slide text, segmented per slide where the extraction allows.
  **Extraction noise is kept on purpose** (scrambled multi-column order, floating chart
  values, broken lists). Production inputs will look like this, so the eval must too.
  Only anonymisation edits touch the body.
- Footer: an extraction-notes block recording source file, extraction method, known
  gaps (image-only slides, cut appendices), so a labeler can judge what the reviewer
  could and could not have seen.

## E. Pipeline stages and gates

1. **Inventory and dedupe.** Full Drive listing, non-deliverables and duplicate copies
   removed. Done 2026-07-04: 222 files, 181 unique deliverable candidates.
2. **Triage.** AI agents skim every candidate and produce one row each: extractability,
   language, client, sector, type, stage, rough quality band with rationale. Output is
   the triage catalog (sealed). Gate: catalog covers all candidates or names what it
   skipped and why.
3. **Selection.** Pick 12 to 15 decks spanning the bands (roughly 3 to 4 strong, 5 to 6
   middling, 4 to 5 weak), across sectors and deliverable stages, extractability full
   or partial only. Record reasons in the sealed memo. Gate: spread confirmed against
   the catalog, no project supplies more than two cases.
4. **Case build.** AI agents extract, segment, pseudonymise and write case files plus
   extraction notes. Gate: an anonymisation pass finds no names, no handles and no live
   client identifiers in any case body.
5. **Human gold labeling.** Single pass: the team runs the calibration round then labels
   the rest once, blind, per [eval-cases-real/labeling/PROTOCOL.md](eval-cases-real/labeling/PROTOCOL.md).
   Gate: every case has a gold file in the section C template of
   [05-eval-harness.md](05-eval-harness.md) and the AI consistency check on it is clean.
6. **Baseline run.** The frozen reviewer prompt runs every real case blind under the
   [eval-runs/README.md](eval-runs/README.md) protocol. A fresh-context scorer fills
   the scoring sheet. Gate: this produces the first honest number for how the reviewer
   performs on real work. No prompt changes until the whole set has run.

Kill criterion for the pipeline: if the team cannot reach a stable shared readiness during
the calibration round (two or more of the four unsettled), stop. The rubric, not the
reviewer, is the problem, and prompt tuning against unstable gold is overfitting to noise.

## E2. Gate status (updated 2026-07-07)

1. Inventory and dedupe: **done** 2026-07-04. 222 files, 181 unique candidates.
2. Triage: **done** 2026-07-07. 181 of 181 candidates have exactly one row in the
   sealed catalog (local-mirror Sonnet agents, first 12k chars per file). One corrupted
   batch row was repaired during the merge and the repair is noted in the row itself.
   26 rows are band X (briefs, proposals, contracts, stray files), expected and correct.
3. Selection: **done** 2026-07-07. 14 cases picked, reasons and mapping in the sealed
   memo. Spread confirmed: no client supplies more than one case, stages span D1 to
   final, extractability full or partial only, case numbering shuffled so the sequence
   carries no band signal.
4. Case build: **done** 2026-07-07. All 14 case files written from the local full-text
   mirror, extraction noise and draft artifacts kept. Orchestrator anonymisation pass
   found clean bodies everywhere; one fix applied (seven speaker-note source URLs in
   real-05 stripped, logged in that file's extraction notes). The generic 180DC org
   contact kept in real-02 is documented there and is not client PII.
5. Human gold labeling: **next**, single pass. The team runs the calibration round then
   labels the rest once, blind, per
   [eval-cases-real/labeling/PROTOCOL.md](eval-cases-real/labeling/PROTOCOL.md).
6. Baseline run: blocked until every case has a gold file and a clean consistency check.

## F. What this pipeline refuses to do

- No AI-written or AI-suggested gold labels for real cases (section B).
- No cleaning up deck text beyond anonymisation. A prettified case tests a product that
  does not exist.
- No tuning the reviewer against any real case before the full baseline run exists.
- No public sharing of any case file without a fresh anonymisation review.
