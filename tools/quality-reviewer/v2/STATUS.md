# STATUS: reviewer v2

The one-page orientation. Start here, then go to [progress.md](progress.md) for the detailed
log and [15-implementation-plan.md](15-implementation-plan.md) for the full sequence. Updated
2026-07-24.

## What it is

An AI tool that reviews a team's draft consulting deliverables and says how close to
client-ready the work is, plus what to fix. Two views: a coaching view for students, a lead
view for project leads.

## Where it stands

- The tool works on test cases. It runs, and a renderer now turns its output into something a
  human can read.
- It passed a narrow first test: five short synthetic decks, each built around one flaw. Green,
  but this is a smoke test not a validation.
- Known, measured weak spot: on strong work it over-flags. The restraint case gets called not
  ready in 3 of 5 runs. It cries wolf on good decks more often than not.
- It has never run on a real client deliverable. Not once. That is the whole point and it has
  not happened yet.
- The scoring machinery is complete. 14 real anonymised cases are ready, the blind labeling
  site exists, and the adjudication tool was built 2026-07-24 and its parser tested. The full
  loop to build the answer key now exists end to end.

## What still needs to happen, in order

1. Decide the over-flagging problem (owner call). Path B is built and verified 2026-07-24: the
   renderer now genuinely gates readiness out of a student build (`?role=student`), so a false
   not-ready cannot reach a student, and the default demo path is unchanged. The remaining call
   is whether to also run Path A, a source-side severity fix, in the pre-freeze prompt pass. It
   is drafted and reversible, not yet applied. See progress.md Session 8.
2. Build the answer key, the golden set. Single human pass (team constraint, decided
   2026-07-25): the team labels each of the 14 real cases once, blind, starting with a
   calibration round on four cases done together, then an AI mechanical consistency check on
   each finished gold. People-gated, the AI never writes a label. This is the long pole. Start
   with [eval-cases-real/labeling/calibration-batch.md](eval-cases-real/labeling/calibration-batch.md)
   and [eval-cases-real/labeling/PROTOCOL.md](eval-cases-real/labeling/PROTOCOL.md).
3. Freeze the tool, then run it on the 14 real cases for the first honest number on real work.
4. Get an ex-consultant to sanity-check its judgment. Start recruitment now, it is the longest
   lead time.
5. Small pilot next cycle, lead-mode only, on real projects.

## One-line status

The tool is built and the review machinery is complete. It has not been tested on real work
and it over-flags strong decks. The next real milestone is the human answer key, which unlocks
the first honest measurement.

## The golden-set loop (single pass, 2026-07-25)

Blind labeling (labeling-workstation.html) produces one gold worksheet per case, enforcing
the shape before export. The team runs a calibration round on four cases together first (the
rubric-health check), then labels the rest once each. An AI mechanical consistency check
(to be built, see the handoff) flags internal contradictions on each finished gold, never a
label. The two-worksheet adjudication-workstation.html is not used in a single-pass run,
kept for reference. Nothing in the tooling writes or suggests a gold label. All of it lives
in [eval-cases-real/labeling/](eval-cases-real/labeling/).
