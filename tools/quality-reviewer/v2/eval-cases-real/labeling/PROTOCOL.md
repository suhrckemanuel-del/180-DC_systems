# Blind labeling protocol for real cases

Two human labelers (the two builders for now, an expert later if one is available)
produce the gold labels for every case in [../](../). Follow this exactly. The gold is
only as good as the discipline here.

**The easy way to do this.** Open [labeling-workstation.html](labeling-workstation.html)
in a browser (double-click it, no server needed). Open one case file, fill the worksheet
beside it, and it will not let you download until every required part is filled and exactly
one must-catch is marked. It exports the correctly named worksheet in the right shape and
autosaves as you go. It loads only the case file you open, so it cannot show you an AI
review or a triage band by accident. Filling the worksheet template by hand is still fine if
you prefer, the shape is identical.

## Before you start

1. Do not read the sealed selection memo, any AI review, any triage band or any
   reviewer output for these cases. If you have accidentally seen one for a case, say
   so in the worksheet header for that case.
2. Read [../../01-rubric-v1.md](../../01-rubric-v1.md) and
   [../../05-eval-harness.md](../../05-eval-harness.md) section C once, fresh, before
   your first case.
3. Agree a time budget per case up front. Suggested: 30 to 40 minutes. The gold should
   reflect a careful senior read, not an afternoon of forensics.

## Labeling (each labeler, independently)

1. Work alone. No discussing a case with the other labeler until both worksheets for
   it exist.
2. Read the case file top to bottom, including the extraction-notes footer, so you know
   what the reviewer could not have seen.
3. Fill one copy of [worksheet-template.md](worksheet-template.md) per case. Name it
   `real-NN.worksheet.<initials>.md` and keep it out of the shared folder until both
   are done (swap by another channel or commit both at the same sitting).
4. Judge the deck as it stood, not what the project became. If you personally worked
   on the project, flag it in the header and label anyway; the adjudication weighs it.
5. Severity rule, same as the reviewer's calibration: an issue is critical or major
   only if closing it could change the client's decision. Style and polish are minor.

## Adjudication (both labelers together)

**The easy way to do this.** Open [adjudication-workstation.html](adjudication-workstation.html)
in a browser, open both worksheets for one case, and it does the mechanical parts: it computes
the readiness delta, shows the two sheets side by side, writes the `real-NN.gold.md` in the
section C shape once you fill the resolved label, generates the agreement-log row, and tracks
the stop rule across the set for you. It never proposes a label. The resolved gold is yours,
the `use A` / `use B` buttons only copy a labeler's own words in as a starting point. Doing
this by hand against the template below is still fine.

1. Compare worksheets case by case. For each case record: readiness agreement
   (exact / one level apart / worse), top-issue agreement (same must-catch or not).
2. Where you disagree, argue to a resolution on the merits and write the resolved
   label. If you cannot resolve, park the case as `contested` rather than averaging.
   An averaged label is gold for nobody.
3. Write the adjudicated result into `real-NN.gold.md` using the section C template in
   [../../05-eval-harness.md](../../05-eval-harness.md). Keep both worksheets; they
   are the audit trail.
4. Log per-case agreement in [agreement-log.md](agreement-log.md).

## Stop rule

If a third or more of the set ends up with readiness disagreement of two levels or
more, or contested, stop labeling. The rubric is not carrying two trained readers to
the same answer, so it cannot carry the reviewer either. Fix the rubric, then relabel
the contested cases fresh.

## After adjudication

Only now open the sealed selection memo if you need it. Machine triage bands never
override an adjudicated gold. If the memo's band and your gold differ wildly, note it
in the agreement log; it is information about the triage, not about your label.
