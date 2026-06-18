# 180DC AI Quality Reviewer. Testing guide

How to check the reviewer works, what it currently does and what "working" means for v1. Voice rule applies here too: no Oxford commas, no em-dashes.

## 1. What the current demo does (the baseline)

Open `index.html`. It is a single self-contained file, no setup.

- Intro screen. A chat input pre-filled with "Review this deliverable". Press Enter or click Run review.
- Analyzing overlay. About 1.7 seconds, scripted. Four steps tick off (action titles, governing insight, evidence, scoring).
- Team Lead Mode. Verdict pills (Needs revision, 3.2 of 5, 2-3 hrs, High), a 32 tile timeline with amber slides 4 and 5, red slides 13 and 30, the dashed 13 to 30 contradiction bracket, a main issue box and three critical fixes.
- Student Mode. Reached by the mode toggle or the Coach me through the findings button. Three findings in the sidebar, each clickable. Each finding runs Principle, Diagnosis, Why it matters, Reflect, then a gated Reveal suggested fix.
- New review returns to the intro.

Everything is scripted. Nothing calls a model. This is the visual target for the real output.

## 2. What "working" means for v1 (acceptance criteria)

The system is working when, given a real deliverable, it produces output that passes all of these.

1. Valid JSON only. The model returns one JSON object, no prose, no markdown fences. It parses on the first try.
2. Schema complete. Every required field from SYSTEM-PROMPT.md is present. Findings are three or fewer and sorted by severity.
3. Quote or abstain holds. Every finding has at least one evidence quote, and each quote appears verbatim in the deliverable. Zero invented quotes.
4. Renders cleanly. The JSON loaded into the template produces the full UI with no missing or broken elements.
5. Consistent. Run the same deck three times. The verdict and the top finding stay the same. Minor wording can vary.
6. Human voice. No Oxford commas. No em-dashes or en-dashes. Reads like a sharp reviewer.
7. No ghostwriting. No fix contains finished slide text the consultant could paste.
8. Calibrated. The verdict agrees with a human reviewer on the golden set (section 5).

## 3. Test procedure (one deck, end to end)

1. Create the Claude Project and paste SYSTEM-PROMPT.md as the instructions.
2. Pick a real deliverable to test. Good local options already in this repo:
   - `180/claude/deliverable_text.txt`
   - `180/claude/d1_slides1to34.txt` (the Vantage IP deck text)
3. Paste the deck text into the Project chat. Ask for the review.
4. Copy the JSON it returns.
5. Validate it:
   - Does it parse. (paste into any JSON validator)
   - Are all required fields present.
   - Are there three findings or fewer.
   - Does every finding have an evidence quote.
6. Check each quote. For every `evidence.quote`, search the deck text for that exact string. If it is not found verbatim, that is a fail (a hallucinated finding). This is the single most important check.
7. Render. Load the JSON into the template (the Load JSON path from BUILD-SPEC). Confirm the timeline, scorecard and findings all show.
8. Repeat three times from step 3. Confirm the verdict and top finding are stable.
9. Voice scan. Search the output for the em-dash character and for ", and". Both should return nothing.

## 4. Failure cases to probe on purpose

Try to break it. For each, here is what to look for and the likely fix.

- Hallucinated finding. A finding whose quote is not in the deck. Look for it in step 6. Fix: tighten the quote or abstain rule, add the verifier pass.
- Ghostwritten fix. A fix that contains a ready-to-paste new title or bullet. Fix: strengthen the no-ghostwrite rule with another not-allowed example.
- Too many findings. More than three, or all marked critical. Fix: reinforce the max-three and severity-spread rules.
- Score drift. The verdict changes run to run. Fix: move to the three-pass self-consistency aggregate.
- Oxford commas or em-dashes appear. Fix: restate the voice rule near the top and the bottom of the prompt.
- Broken render. A missing field crashes the UI. Fix: validate before render and show a clear error, never a half-drawn screen.
- A deck with no real problems. Feed a strong deck. It should return a high score, a Ready or Minor revision verdict and few findings, not invented ones. A reviewer that always finds three criticals is not trustworthy.

## 5. Calibration with a golden set

This is what makes the scores defensible rather than arbitrary.

1. Gather about ten past 180DC deliverables of mixed quality.
2. Have a human reviewer mark each one pass or fail and note the one biggest issue.
3. Run each through the reviewer.
4. Compare. Count how often the reviewer verdict matches the human, and how often its top finding matches the human's biggest issue.
5. Tune the prompt (the checks, the anchors, the severity definitions) until agreement is high.
6. Lock that prompt version. Re-run the golden set after any future prompt change to catch regressions.

You already have two scored decks to seed this set: the Vantage IP review and the VF benchmark.

## 6. Quick regression checklist (run before any demo)

- [ ] Output parses as JSON on the first try.
- [ ] Three findings or fewer, sorted by severity.
- [ ] Every finding has a verbatim quote that exists in the deck.
- [ ] Verdict and top finding stable across three runs.
- [ ] No Oxford commas, no em-dashes.
- [ ] No fix contains finished slide text.
- [ ] JSON renders fully in the template.
- [ ] A strong deck scores high, a weak deck scores low.

## 7. Handoff note for Fable 5

The prompt and schema are fixed (SYSTEM-PROMPT.md). The build work is: the Load JSON adapter, the V1 learning mechanics (typed-attempt gate, attempt-first, self-explanation, no-ghostwrite cap), then the verifier pass and self-consistency aggregate. Build order is in BUILD-SPEC.md section 7. Keep the rendering engine dumb and the prompt smart. The model produces JSON, the template produces pixels, and the two only meet through the schema.
