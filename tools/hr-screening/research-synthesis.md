# Research Synthesis — Hardening the Screening System

Five parallel research agents each took one angle: (1) how elite consulting and 180DC actually screen, (2) the science of LLM-as-judge ranking, (3) fairness/bias/law, (4) rubric design, (5) human-in-the-loop workflow. This is the fan-in: what they agreed on, and the design changes it drove.

The original design was a sound skeleton: blind → coarse gate → merge-sort pairwise tournament → top-N verification → ranked output. The research changed *how* each stage works and added the safeguards that make it trustworthy and defensible. Below, every decision is tagged with the stage it touches.

---

## The 12 decisions that came out of the research

### 1. The gate scores each resume on its own (pointwise), not head-to-head — and it's forgiving
**Stage: Gate.** Pairwise is the right tool for *ranking*, but the wrong tool for a *floor*. Research (Agent 2/4) shows absolute scoring is 3–4× more robust against distractor features for a simple pass/fail. The gate has **three knockouts only**: current student/recent grad, resume link works, application complete. Default: pass ~80% through. Rationale: this is the one place a mistake is permanent, so it errs toward letting people in. **No GPA, school, major, or experience floor** — those are exactly what 180DC says it does *not* filter on.

### 2. Blind before any model sees a resume
**Stage: Pre-processing.** Strip name, contact info, graduation year, photos, and gender/ethnicity-coded club names ("Women in Finance" → "[professional society]"). Keep merit signals (outcomes, skills, experience). The Amazon 2018 tool and a 2024 Stanford/UW study (White-associated names favoured in 85% of cases) are why this is non-negotiable. **Caveat the research is blunt about:** blinding is necessary but *not sufficient* — vocabulary and positional bias survive it, which is why the next two items exist.

### 3. Run every comparison twice with the order swapped — the single most important technical addition
**Stage: Pairwise tournament.** LLM judges favour whichever resume is shown first; position-consistency is only 0.57–0.83 even for strong models, and it's worst on close calls — exactly the matches that decide a ranking. **Protocol:** call A-vs-B and B-vs-A as two fresh agents. Agree → record the winner. Disagree → record a **tie** and route both to human review. This doubles calls but is the consensus must-do across four of the five agents.

### 4. Decompose the rubric; never ask "who's better overall?"
**Stage: Comparison agent.** A holistic prompt invites halo effects and verbosity bias. Instead the judge scores 4–6 named criteria (1–4 scale, no midpoint), each with a behaviour-anchored definition, then gives a verdict + **confidence** + a 2–3 sentence rationale citing the specific resume evidence. The rationale is what makes every ranking auditable later.

### 5. Anchor every judge prompt with 3–5 calibrated, verdict-balanced examples
**Stage: Comparison agent.** Worked "A beats B because…" examples are load-bearing, not optional — without them the model drifts toward its own priors about "good consulting resumes," which aren't 180DC's. Lock them before the run; update only between cycles. (Hand-labelled by chapter leaders.)

### 6. Store every comparison; cross-check the sort with Bradley-Terry; detect cycles
**Stage: Sort → Verification.** Merge sort assumes a consistent comparator, but LLM judgments aren't perfectly transitive (A>B>C>A happens ~4–15% of the time). The danger is a strong candidate eliminated in a "losing" subtree and never seen again. **Cheapest fix, zero extra model calls:** keep every (winner, loser, confidence) result merge sort would normally throw away. Then (a) fit a Bradley-Terry model over all results and flag anyone whose BT rank diverges from the sort rank by more than ~10 places; (b) scan the top group for cycles and flag anyone caught in one. Use Bradley-Terry, **not Elo** — Elo is unstable to match order.

### 7. Broaden the verification net
**Stage: Verification.** If you want a top-20, double-check the top ~35–40. The extra cost is human attention on a few more interviews, not model calls — and it's the catch-net for anyone a bad subtree match buried. The verification pass specifically flags: top candidates with low motivation-fit (strong-but-mercenary), top candidates with many low-confidence/contested matches (ranking is noise), and Team-Lead-track top candidates with **no leadership evidence** (a misranked Consultant).

### 8. Three buckets out, not one ranked list
**Stage: Output.** Advance (~top 25%) / Borderline review band (~next 25%) / Below the line (~bottom 50%) — tune after cycle one. The **Borderline band is the product**: set it wide enough that humans, not the algorithm, decide the margin. This is industry-standard practice and the highest-ROI false-negative reducer (a ~15% review band cuts false negatives 35–45%).

### 9. The system ranks; humans reject. Always.
**Stage: Architecture.** GDPR Article 22 gives candidates the right not to be subject to a *solely automated* decision that significantly affects them — a rejection qualifies. So the tool only proposes an order; a human draws the cutoff and every "no" is a logged human act. This is both the legal line and the trust line. (EU/Netherlands branches make GDPR and the EU AI Act — employment = high-risk — directly relevant.)

### 10. Surface evidence, not scores — and design against rubber-stamping
**Stage: Output / reviewer workflow.** Each candidate card shows rubric hits with cited resume text, the deciding head-to-head rationale, and any flags. Anti-automation-bias measures that actually work (per a controlled study): don't show rank until the evidence is read; require an explicit Advance/Hold/Exclude action with a one-line reason on every Borderline; and surface a **random spot-check sample from the rejected pile** that reviewers must confirm or reverse. Telling humans "you're responsible" does nothing; making them encounter the exclusions does.

### 11. Audit log as a first-class output
**Stage: System-wide.** Log per candidate: timestamps, rubric version, model version, gate outcome, both orderings of each match and whether they agreed, verification flags, and every human decision + reason. This answers "why was X below the line?" with evidence instead of "the model said so" — required under GDPR (right to meaningful information) and the EU AI Act, and it's how you spot rubric drift between cycles.

### 12. Freeze the rubric and thresholds before each run; disclose AI use; offer appeal
**Stage: Cycle setup + candidate comms.** The rubric and cutoffs are agreed and locked before any application is processed (changing them mid-cycle destroys consistency and defensibility), with a one-line change log per cycle. Add one sentence to the application and to outcome emails that AI assists the ranking and a human makes every decision, plus an appeal address. Few will use the appeal — its value is trust and legal defensibility.

---

## Cost and scale (reality check)

- ~500 applicants → gate cuts to ~150–200 viable per track.
- Merge sort ≈ 150 × ~7–8 ≈ ~1,100 comparisons; the order-swap doubles it to ~2,200 model calls per pool.
- At Sonnet-class pricing that's roughly **$6–7 per pool per cycle** — affordable. Independent matches run in parallel, so wall-clock is minutes, not hours.
- Storing all comparisons and the BT cross-check add **zero** model calls.

---

## What the research said NOT to do (avoid being too harsh)

Do not filter or down-rank on: school name or ranking, business/economics major, GPA, years of experience, resume length/formatting, or absence of prior consulting experience. 180DC explicitly recruits across all majors, levels (including freshmen), and backgrounds. An over-gated system would contradict the org's own values and quietly produce a prestige-skewed cohort no matter how good the rubric is. Keep knockouts to three; keep the gate forgiving; let the rubric and the humans do the real discrimination between strong candidates.

---

## Source map

Full sourced reference lists from each of the five research agents are preserved in the agents' findings (consulting screening practice; LLM-as-judge position bias and transitivity — arXiv 2406.07791, TrustJudge 2509.21117, pairwise-vs-pointwise 2504.14716, ranking recipes 2411.14483; GDPR Art. 22 / EU AI Act / Amazon tool / Stanford-UW name-bias study; Google re:Work structured hiring and BARS; human-in-the-loop and automation-bias research incl. PMC10113449). Key load-bearing claims above are each traceable to those.
