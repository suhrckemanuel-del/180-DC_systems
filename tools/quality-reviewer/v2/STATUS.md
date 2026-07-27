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
- Known weak spot, much reduced: on strong work it over-flags. Under the frozen package
  (1.5i + 1.5j, 2026-07-26) the restraint case landed Nearly ready in all five re-runs, down
  from 3 of 5 on the old package. The owner accepted the residual risk (up to about 1 in 5)
  rather than chase it with a source-side severity change, since the student view already
  gates readiness out. The real-case baseline is the true calibration test.
- It has never run on a real client deliverable. Not once. That is the whole point and it has
  not happened yet.
- The prompt is frozen (freeze tag frozen-2026-07-26) on a nine-run blind regression:
  readiness match 9 of 9 on the synthetic five, every run valid under the new contract. The
  scoring machinery is complete, the gold consistency checker (check-gold.js) is built and the
  full loop to build the answer key exists end to end.
- The confidentiality gate exists (plan item 3a, 2026-07-26): [SANITIZATION.md](SANITIZATION.md)
  is the ten-minute checklist and [check-sanitized.js](check-sanitized.js) is its machine
  backstop, the local scanner that blocks any deck carrying a high-confidence client
  identifier and is the proxy's pre-API step. Owner sign-off (3b) is the remaining people task.

## What still needs to happen, in order

1. ~~Decide the over-flagging problem.~~ **Done 2026-07-25.** Path B (the student readiness
   gate) shipped, and the owner accepted the residual 1-in-5 over-escalation rather than apply
   Path A. The pre-freeze pass ran 1.5i and 1.5j only. Both are in and the prompt is frozen.
2. Build the answer key, the golden set. Single human pass (team constraint, decided
   2026-07-25): the team labels each of the 14 real cases once, blind, starting with a
   calibration round on four cases done together, then the AI mechanical consistency check
   ([check-gold.js](check-gold.js), built 2026-07-25) on each finished gold. People-gated, the
   AI never writes a label. This is the long pole. Start with
   [eval-cases-real/labeling/calibration-batch.md](eval-cases-real/labeling/calibration-batch.md)
   and [eval-cases-real/labeling/PROTOCOL.md](eval-cases-real/labeling/PROTOCOL.md).
   **Progress 2026-07-27: 8 of 14 cases labeled by the owner** (real-01, real-02, real-03,
   real-04, real-05, real-08, real-12, real-13). Seven are written to gold shape and pass
   check-gold.js clean. real-02 is held as `real-02.gold.DRAFT.md` pending one owner
   decision, the readiness level, which the labeler left between two levels. The remaining
   six (real-06, real-07, real-09, real-10, real-11, real-14) are with the team and the
   ex-consultant reviewer. Readiness spread so far: two R0, one R1, four R2, one undecided.
   Gold files stay local and gitignored, they carry real client deck text.
3. ~~Freeze the tool.~~ **Done 2026-07-26** (freeze tag frozen-2026-07-26). Next, once the
   gold exists, run it on the 14 real cases for the first honest number on real work. HARD
   RULE: no reviewer run on any real case before its gold exists.
4. ~~Recruit an ex-consultant to sanity-check its judgment.~~ **Done.** An ex-consultant is
   secured and is helping review the golden set alongside the team.
5. Build it for everyone from the start, both the student coaching view and the lead view, not
   a lead-only pilot (decided 2026-07-26, reversing the earlier lead-mode-first staging). The
   student view is wanted out of the gate. Path B (the `?role=student` readiness gate, already
   shipped) is what makes this safe: a false not-ready never reaches a student, so the over-
   flagging residual is contained on the student side by construction. Building is to be
   completed before the next cycle starts.

## One-line status

The tool is built, the review machinery is complete, and the prompt is frozen on a clean
nine-run synthetic regression. It has not been tested on real work. The next real milestone is
the human answer key, which unlocks the first honest measurement.

## The golden-set loop (single pass, 2026-07-25)

Blind labeling (labeling-workstation.html) produces one gold worksheet per case, enforcing
the shape before export. The team runs a calibration round on four cases together first (the
rubric-health check), then labels the rest once each. An AI mechanical consistency check
([check-gold.js](check-gold.js), built and tested 2026-07-25) flags internal contradictions
on each finished gold, never a label: run `node ../../check-gold.js real-NN.gold.md` from
the labeling dir. It mirrors check-review-v2.js rules 8a-8d and is exercised by two
fabricated real-00 fixtures under [eval-cases-real/labeling/fixtures/](eval-cases-real/labeling/fixtures/).
The two-worksheet adjudication-workstation.html is not used in a single-pass run, kept for
reference. Nothing in the tooling writes or suggests a gold label. All of it lives in
[eval-cases-real/labeling/](eval-cases-real/labeling/).
