# 180DC AI Quality Reviewer. Build spec (demo to v1)

This is the handoff for building the real version. It explains what changes from the current scripted demo, why each change matters and how to achieve it. The voice rule applies to this document too: no Oxford commas, no em-dashes.

## 1. Architecture (the one idea that makes it cheap and reliable)

Separate judgment from rendering.

```
deliverable (text)
      |
      v
 [ Claude + SYSTEM-PROMPT.md ]   <- the judgment engine
      |
      v
   small JSON object (~1 KB)      <- the contract
      |
      v
 [ static HTML template ]         <- the rendering engine, owns all pixels
      |
      v
  filled reviewer UI
```

The model never writes HTML. It writes about 1 KB of JSON. The template turns that JSON into the visual. Generating full HTML each time would be 10 to 20 times more output tokens and far less reliable (broken tags, drifting class names). JSON validated against a schema renders the same way every time.

For the demo this whole loop runs inside a Claude Project at zero marginal cost. You move to the paid API only when manual paste becomes the bottleneck. See section 6.

## 2. The JSON contract

The canonical schema lives in SYSTEM-PROMPT.md under OUTPUT. Treat that as the single source of truth. The template must read from it. Today the demo hardcodes its data (the FINDINGS array, the TILE_STATE map). V1 replaces those with this object.

Key objects:
- scorecard: overall, verdict, effort, confidence, and the five criteria each with result and checksPassed of checksTotal.
- timeline: sections, tiles (one per slide), callouts, connectors.
- mainIssue and criticalFixes: the Team Lead summary.
- findings: max three, each with principle, diagnosis, evidence quotes, why, reflect, fix, tags, severity.

## 3. What changes from demo to v1

### 3a. Review reliability (good demo to industry grade)
The rubric and the coaching format are already strong. The gap is evaluation reliability. Ranked by impact.

1. Quote or abstain. Every finding carries a verbatim quote with a slide number, or it is dropped.
   How: the `evidence` array is required and non-empty. The prompt forbids any finding without a real quote. In the UI, render the quote inside the Diagnosis row so the reviewer can see the proof.

2. Binary sub-checks instead of a single 1 to 5 guess. Each criterion is 4 to 6 yes or no checks. The score is the count of passes.
   How: already written into SYSTEM-PROMPT.md. Surface "4 of 6 checks passed" in a criterion breakdown view.

3. Self-consistency. Run the review three times and keep the majority verdict per check. Disagreement becomes an uncertain item, shown as a question not an assertion.
   How: demo and Project phase can do one pass. The API phase runs three passes at low temperature and aggregates. Build the aggregator as a small function over three JSON objects.

4. Calibration against a golden set. Score about ten past 180DC decks, compare the verdict to a human reviewer, tune the prompt until they agree. Re-run on every prompt change to catch drift.
   How: store the ten decks plus human pass or fail labels. See TESTING-GUIDE.md.

5. Verifier pass. A second cheap call checks each finding: is the quote real and does it actually support the claim. Drop the ones that fail.
   How: feed the findings plus the deck back to Claude, return keep or drop with a reason.

6. Severity weighting and abstention. Sort findings by severity. Suppress low-confidence items from the proactive three but keep them available on demand.
   How: the `severity` field plus sorting in the Team Lead view.

### 3b. Learning, not offload (the mechanics over v1)
These are the anti-offload features. They are mostly front-end behaviors that the prompt already supports by giving a reflection question and a directional fix. Build order is V1 first.

V1 (system prompt plus simple UI gating, highest pedagogical yield):

1. Typed-attempt gate. The Reveal suggested fix button does nothing until the consultant types a real answer to the reflection question. Require a minimum length and reject an answer that just copies the question. Then show the fix next to their answer and name where they converge.
   Principle: productive failure and the generation effect. This is the single highest-leverage change.
   How: add a textarea above the reveal button. Disable reveal until the textarea passes the check. On reveal, render the student answer and the fix side by side.

2. Attempt-the-rewrite-first. For a title or recommendation finding, the consultant writes their own rewrite before the model fix appears, shown diff style.
   Principle: worked example as feedback, not as a shortcut.
   How: a second optional textarea. The model fix stays a directional move, so it never becomes copy and paste.

3. Self-explanation on reveal. After the fix unlocks, one required line: "In one line, why does this fix satisfy the principle." 
   Principle: self-explanation effect.
   How: a single input shown after reveal. Store the answer with the session.

4. No-ghostwrite limit. The prompt already refuses to write finished slide text. Add a UI cap on consecutive reveals. After N reveals without an attempt, require an attempt before continuing.
   Principle: anti-offload guardrail.
   How: prompt rule plus a session counter.

V2 (needs per-consultant history):

5. Graduated fading by track record. First time a principle is flagged: full coaching with a gated worked example. Fourth time: a flag only, no fix offered ("Action title issue on slide 7, you know this one").
   Principle: expertise-reversal effect and the zone of proximal development.
   How: store per-consultant counts per principle. Adjust how much of the finding renders.

6. Repeat-mistake tracker. Count violations per principle across deliverables. If the same principle is flagged in three or more cycles, surface it first next time and ask the consultant to self-check it before the AI reviews.
   Principle: spaced retrieval practice. Doubles as the pitch metric. A falling flag rate is visible proof of learning.
   How: a per-consultant table of principle to count and last-seen cycle.

## 4. Wiring JSON into the current template

The template already renders from data. To make it load real output, add a small adapter.

- Add a "Load JSON" affordance to the demo (a textarea plus a Render button, or a file picker).
- On render, parse the JSON, then drive the existing functions: build the scorecard from `scorecard`, build the timeline from `timeline` (sections, tiles, callouts, connectors), build the findings list and coach card from `findings`.
- Replace the hardcoded `FINDINGS`, `TILE_STATE` and `SECTIONS` with reads from the loaded object. Keep the scripted intro as an optional demo mode.
- Validate before render. If a field is missing or a finding has no evidence quote, show a clear error rather than a broken UI.

This is the only code change that turns the scripted demo into a functional renderer. Everything upstream is the prompt.

## 5. Voice and human output (applies everywhere)

The prompt enforces the voice rules for the model output. Apply the same rules to any copy in the UI and in these docs. No Oxford commas. No em-dashes or en-dashes. Plain hyphens only inside compound words. This is what makes the output read as human rather than AI generated.

## 6. Run modes and cost

| Mode | When | Cost | Notes |
|---|---|---|---|
| Inside a Claude Project | demo, low volume, one reviewer | zero marginal, rides the subscription | paste deck, get JSON, render locally. This is the recommended demo path. |
| Paid API pipeline | recurring or multi-user, automated | per token, kept tiny by the techniques below | move here only when manual paste is the bottleneck. |

API cost controls for later, confirm exact Claude model and caching syntax against the live docs when you wire it:
- Cache the long system prompt and rubric. The deck is the only part that changes per call.
- Constrain the response with structured output or strict tool use so the JSON is always valid.
- Minimize output tokens. JSON not HTML is the main win. Output is the expensive side.
- Use the cheapest model that holds quality on the rubric, escalate only the criteria that regress.
- Batch non-urgent runs.

## 7. Build order

1. Lock SYSTEM-PROMPT.md and the JSON schema. (done, this folder)
2. Add the Load JSON adapter to the template. (small front-end task)
3. Run the prompt inside a Claude Project against a real deck, render the output, confirm it matches. (the live proof)
4. Add the V1 learning mechanics: typed-attempt gate, attempt-first, self-explanation, no-ghostwrite cap.
5. Build the golden set and calibrate. (TESTING-GUIDE.md)
6. Add the verifier pass and self-consistency.
7. Add per-consultant history for the V2 fading and repeat-mistake tracker.
8. Only if volume demands it, move steps 3 and 6 to the paid API with caching.
