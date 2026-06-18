# Pipeline Spec — Build Reference

The buildable version of the system, stage by stage. Stack: Claude Agent SDK — a deterministic Python orchestrator holds the bracket and state; comparison and verification agents are spawned subagents. Every design choice here traces to [research-synthesis.md](research-synthesis.md).

```
Google Form CSV (~500 applicants, 2 tracks)
        │
   [0] INGEST & PARSE      resume links → text, cache to disk
        │
   [1] BLIND              strip identity → blinded text + id lookup table
        │
   [2] GATE               pointwise pass/fail, 3 knockouts, ~80% pass
        │
   ── split by track ──   Team Lead pool   |   Consultant pool
        │
   [3] TOURNAMENT         merge sort; each match = fresh comparison agent,
        │                 run both orderings; store every result
   [4] CROSS-CHECK        Bradley-Terry over all results + cycle scan
        │
   [5] VERIFY             fresh agents re-check top N (default 10, configurable)
        │
   [6] OUTPUT             3 buckets + evidence cards + audit log
        ↓
   HUMAN REVIEW (draws every cutoff, sends every rejection)
```

---

## [0] Ingest & parse
- Read CSV: `candidate_id`, `name`, `track`, `resume_url`, `motivation_letter` (form text field), plus any other fields.
- Fetch each resume; extract to text; **cache to disk** keyed by id (never re-fetch; enables resume-after-crash). The motivation letter usually arrives as text in the CSV — pair it with the resume into one **candidate package**.
- Broken/unreadable link → `needs_manual_review` list with reason. Never silently drop.
- **Checkpointing:** all state on disk. A run this long must survive a crash and resume.

## [1] Blind
- Blind **both the resume and the motivation letter** — letters often open with "My name is…" and name schools/identity, so they need the same scrub.
- Remove: name, email, phone, graduation year, photos, gender/ethnicity-coded org names (replace with sanitized descriptors).
- Keep: outcomes, skills, experience, institution name (merit signal, not stripped).
- Store identity in an id→identity table; rejoin only at [6].

## [2] Gate — pointwise, forgiving
One absolute pass/fail check per resume. Three knockouts **only**:

| # | Knockout | Test |
|---|----------|------|
| G1 | Current student / grad within ~12 months | from form field |
| G2 | Resume link accessible + has ≥1 meaningful entry | from [0] |
| G3 | Application complete — track, **motivation letter present (not blank/placeholder)**, availability | field check |

- **No** GPA / school / major / experience floor.
- Default threshold passes ~80–85%. Config-exposed. When unsure, pass.
- Output: viable pool (~150–200/track) + gated-out list with reasons (still human-visible).

## [3] Tournament — merge-sort pairwise (per pool)
- Deterministic merge sort in the orchestrator. Only the current sub-array order + a results log live in context; everything else on disk.
- **Comparator = fresh comparison agent.** Input: two blinded **candidate packages (resume + motivation letter)** + the track rubric + 3–5 calibrated anchor examples. The resume carries the *what they did* evidence; the letter carries the *why they're here* evidence (mission fit) and is a live writing sample (communication). Output (structured):
  ```
  winner: A | B
  per_criterion: {C1: {A:1-4, B:1-4}, ...}
  confidence: high | medium | low
  rationale: 2-3 sentences citing specific resume evidence
  ```
- **Order-swap guard (required):** run A-vs-B and B-vs-A as two fresh calls.
  - agree → record winner.
  - disagree → record **tie**, flag "contested match", route both to review band.
- **Store every result** `(a_id, b_id, winner, confidence, both_orderings)` — do not discard merge-sort intermediates.
- Parallelize independent matches within a merge level.

## [4] Cross-check (zero extra model calls)
- Fit a **Bradley-Terry** model over all stored results → BT ranking.
- Flag any candidate whose BT rank diverges from the merge-sort rank by > ~10 places.
- Scan the top group's comparison graph for cycles (A>B>C>A); flag anyone caught in one.
- (Bradley-Terry, not Elo — Elo is unstable to match order.)

## [5] Verification pass (fresh agents)
- Re-check the top N against the same rubric — independent reads, not trusting the bracket. **N default 10, configurable.** Pull a wider net (e.g. top ~35–40 if advancing ~20) to catch subtree-buried strong candidates.
- Flag for human review (do not auto-reject):
  - top-tier candidate with motivation/fit averaging < 2.0 (strong-but-mercenary)
  - top-tier candidate with > 50% low-confidence/contested matches (ranking may be noise)
  - **Team-Lead-track** top candidate with no leadership evidence (misranked Consultant)
  - anyone flagged by [4]

## [6] Output — three buckets + evidence + audit
- **Advance** (~top 25%) / **Borderline review band** (~next 25%, tune wide) / **Below the line** (~bottom 50%). All cutoffs config-exposed.
- Per-candidate card: rubric hits with cited resume text · deciding head-to-head rationale · flags. Identity rejoined here.
- **Anti-rubber-stamp:** rank hidden until evidence read; every Borderline requires explicit Advance/Hold/Exclude + one-line reason; a random spot-check sample from the below-the-line pile must be confirmed/reversed.
- **Audit log** (first-class): per candidate — timestamps, rubric version, model version, gate outcome, both orderings of each match + agreement, all flags, every human decision + reason.
- Header on every artifact: *AI-assisted ranking — advisory only. Humans make all final decisions.*

---

## Cycle config (frozen before each run)
```
track:                Team Lead | Consultant   (separate rubric each)
gate_pass_target:     0.80
advance_count:        e.g. 60
borderline_band:      e.g. 40
verify_top_n:         10
rubric_version:       locked, with one-line change note
model_version:        locked for the cycle
```

## Cross-cutting
- **Resumable + checkpointed** (state on disk).
- **Cost:** ~2,200 model calls/pool with order-swap ≈ $6–7/pool/cycle; cross-check and storage add zero calls.
- **Compliance hooks:** ranks-not-rejects architecture (GDPR Art. 22), audit log (EU AI Act / GDPR right to explanation), candidate disclosure + appeal address, rubric frozen pre-cycle. A Data Processing Agreement with the model provider is required before processing real applicant data.
- **Calibration:** periodically check judge agreement against human-labelled pairs; never change the model mid-cycle.
