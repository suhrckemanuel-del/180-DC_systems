# Reviewer Pilot — paste everything below the line into a FRESH Claude Code chat
*Start the chat with working directory `c:\Users\User\Desktop\workflow AI-OS` so project memory auto-loads.*

---

I'm Manuel, Head of AI at 180 Degrees Consulting Amsterdam. I'm piloting my **AI Quality Reviewer** on a real client project. The project has two deliverables: the first one we already used for the demo, and the **final deliverable** is the one I want you to work on. I will give you its file or text at the start. This is a real engagement with a real student team, so client confidentiality and the tool's integrity matter more than speed.

## Load context first (read, confirm back in ~6 lines, do not skip)
1. Memory: `project_180dc_reviewer.md`, `project_180dc_tgt_benchmark.md` (in `C:\Users\User\.claude\projects\c--Users-User-Desktop-workflow-AI-OS\memory\`) and the vault note `Desktop\second-brain\projects\180dc.md`.
2. The methodology source of truth (read fully): `180\reviewer-demo\SYSTEM-PROMPT.md` — the production prompt + the exact JSON schema. This is law. Do not improvise criteria.
3. The renderer + pipeline: `180\reviewer-demo\README.md`, `index.html` (the Load-JSON path), `sample-review.json` (a verified worked example), `check-review.js`, `test-harness.js`, `TESTING-GUIDE.md`.
4. Calibration only (worked reviews on OTHER decks, reference, never the live deck): `180\reviewer-demo\review-livelihoods-plan.json` + `riverside_d3_text.txt`.

In your confirmation, tell me: the five criteria in their diagnostic priority order, the verify command for a review JSON, and the one rule you think is most load-bearing.

## The iron rules (these ARE the product, never weaken them)
- **Quote or abstain.** Every finding carries at least one verbatim quote with its slide number, verified by exact substring search against the deck text (watch for non-breaking spaces U+00A0 in PDF extractions). No quote, no finding.
- **No ghostwriting.** The `fix` field is the directional move plus the principle, never finished slide text the consultant can paste. The tool builds skill, it never replaces it.
- **Max three findings**, severity-sorted. Do not inflate scores or invent problems to fill slots. A strong deck earns a high score and fewer findings.
- **Voice:** no Oxford commas, no em or en dashes in text you author (period, colon or parenthesis instead; plain hyphens only inside compound words). Quotes from the deck keep their own punctuation.
- **Deterministic contract:** the model returns ONE JSON object matching the schema exactly; the static template owns every pixel. Follow the score formula and verdict logic in SYSTEM-PROMPT.md to the decimal.
- **Confidentiality:** anonymize the client in anything that could leave my machine. Nothing from this pilot goes to public channels without VP permission.

## The task — review the final deliverable, produce the team-facing feedback
1. I give you the final deliverable. Extract it to clean per-slide text, one block per slide with slide numbers.
2. Run the SYSTEM-PROMPT methodology and return ONE JSON object. Then VERIFY before showing me anything: `node 180/reviewer-demo/check-review.js <file>.json`, confirm every evidence quote is a verbatim substring of the deck text, confirm no Oxford commas or dashes in authored fields.
3. Render it: load the JSON into `index.html` (Load review JSON path) and confirm it validates and renders.
4. Produce the **shareable PDF** the team receives. The dashboard is currently screen-first with no print stylesheet, so add a clean `@media print` path to `index.html` and export one tidy PDF. The printable shows: a genuine strengths-first opening (what the deck does well, quoted), then the findings in coaching shape (Principle, Diagnosis with the verbatim proof, Why it matters, the Reflect question). The gated fixes stay hidden on paper so the printable cannot become ghostwriting. Keep the verified JSON alongside the PDF.
5. Delivery tone: plain, exact, encouraging. A good senior reviewer leads with what works, then makes the consultant think. The consultant does their own rewrite, that is the point.

**CHECKPOINT:** show me the scorecard, the strengths, the three findings with their quotes, and the PDF before anything goes to the team. Wait for my read.

## Optional, only if I ask after the review — the "what good looks like" reference
I may later want a before/after improved version of one or two slides via the improve-track (`180\tools\mckinsey_transform_prompt.md`, in the real 180DC brand: charcoal `#4b5050`, green `#55b441`, grey `#6e7378`, Lato). Hard boundary if I do: it is an illustrative reference for me and the board, clearly labelled, and is NEVER handed to the consultant as their deliverable. Do not build it unless I ask.

## Guardrails
- Do not modify `SYSTEM-PROMPT.md`'s methodology or the JSON schema without flagging it (changing the contract breaks the renderer and the golden set).
- Do not hard-code answers to make the deck score a certain way. A missed issue is a calibration point, not a reason to cheat.
- Keep `index.html`'s existing scripted demo, Load-JSON path and the four learning mechanics intact. You are ADDING a print path, not refactoring the renderer.
- Honest scoring. If the deliverable is genuinely strong, say so and show fewer findings.

Start with the ~6-line context confirmation, then ask me for the final deliverable.
