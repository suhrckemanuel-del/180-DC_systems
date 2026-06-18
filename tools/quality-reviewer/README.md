# 180DC AI Quality Reviewer. Demo + functional renderer

A single self-contained HTML file. No build step, no dependencies, works offline. Double-click `index.html`.

It runs in two modes from the same intro screen:

- **Scripted demo** (default). Press Enter or click Run review and the Vantage IP sample plays back, overlay and all. Built for recording.
- **Load review JSON** (the real path). Click "Load review JSON from the reviewer" on the intro, paste the JSON a Claude Project returned (see SYSTEM-PROMPT.md) or pick a .json file, click Render review. The template validates it and renders the full UI from it. The [examples/](examples/) folder holds schema-valid anonymized reviews, use one to try the loop.

The model produces JSON, the template produces pixels, and the two only meet through the schema in SYSTEM-PROMPT.md.

## What renders from the JSON

- Team Lead Mode: verdict pills, the five-criteria strip with checks passed per criterion, the per-slide timeline with callouts and contradiction connectors, main issue and critical fixes.
- Student Mode: up to three findings, each with Principle, Diagnosis with the verbatim evidence quotes shown as proof, Why it matters, Reflect and the gated fix.
- Validation runs before render. A missing field or a finding without an evidence quote shows a clear error list, never a half-drawn screen.

## The V1 learning mechanics (anti-offload)

1. **Typed-attempt gate.** Reveal suggested fix stays disabled until the consultant types a real answer to the reflection question. Too short or a restatement of the question is rejected. On reveal, the student answer and the fix render side by side.
2. **Attempt-the-rewrite-first.** An optional second textarea for drafting their own version of the change before seeing the fix.
3. **Self-explanation on reveal.** After the fix unlocks, one required line: why does this fix satisfy the principle. Stored with the session.
4. **No-ghostwrite cap.** After 2 reveals without a drafted rewrite, the rewrite becomes required before the next fix unlocks. A drafted attempt resets the counter.

## Demo flow (what to show on camera)

1. Intro: input pre-filled with `Review this deliverable`. Press Enter or click Run review.
2. Analyzing overlay (~1.7s, scripted), then Team Lead Mode.
3. Click "Coach me through the findings" for Student Mode.
4. Pick a finding, type an answer to the reflection question, reveal, compare.
5. New review returns to the intro. From there you can also show the Load JSON path with `sample-review.json`.

## Testing

`test-harness.js` runs the page script headlessly under Node and checks validation, rendering from `sample-review.json`, the gate, the cap and self-explanation.

```
node test-harness.js
```

The deeper procedure (quote verification, three-run stability, golden set) is in TESTING-GUIDE.md.

## To edit the content

| Want to change | Edit |
|---|---|
| The scripted demo review | `DEMO_REVIEW` object in the `<script>` |
| Gate thresholds (attempt length, rewrite length, reveal cap) | `ATTEMPT_MIN`, `REWRITE_MIN`, `REVEAL_CAP` constants |
| Brand colours | CSS `:root` variables (`--green #16A66A`, `--amber`, `--red`, etc.) |

Everything a real review changes (scores, timeline, findings) comes from the loaded JSON, so there is nothing else to hand-edit.

## Folder map

- `SYSTEM-PROMPT.md` the production prompt and the JSON schema (single source of truth)
- `BUILD-SPEC.md` architecture, reliability upgrades, learning mechanics, build order
- `TESTING-GUIDE.md` acceptance criteria, test procedure, golden-set calibration
- `sample-review.json` schema-valid review of the Vantage IP deck, quotes verified verbatim
- `test-harness.js` headless checks for the renderer and the mechanics
