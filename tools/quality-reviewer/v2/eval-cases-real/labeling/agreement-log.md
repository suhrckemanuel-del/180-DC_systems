# Gold log (single pass)

One row per labeled case, tracking the gold as it is built and recording any optional
expert spot-check divergence. Under the single-pass protocol there is no second labeler and
so no inter-rater agreement column: the calibration round ([PROTOCOL.md](PROTOCOL.md) step
1) is the rubric-health check, and the AI consistency check (step 4) is the per-case
integrity check.

| Case | Readiness (gold) | Must-catch | Labeled by | Consistency check (clean / flags resolved) | Expert spot-check (if any) | Notes |
|---|---|---|---|---|---|---|
