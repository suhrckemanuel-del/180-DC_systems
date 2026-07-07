# Discovery-to-Proposal Copilot

Turn a messy first client call into a rigorous problem statement, an unknowns checklist, and a draft SOW — fixing engagements at the moment of maximum leverage. Matures the "client intake assistant" spark already on the [backlog](../../ideas/backlog.md).

## Critique passes

### Pass 1 — usefulness critique
**Critique:** A proposal skeleton is the least valuable output — templates already exist. The real failure isn't formatting the proposal, it's that students don't *notice* what the client never said (no success metric, no data access, no decision-maker). Also, a transcript-in/proposal-out tool tempts users to skip the second discovery call that good scoping requires.
**Changes made:** (a) Reorder the outputs: the **unknowns checklist is the primary artefact**, severity-ranked, with the exact follow-up question to ask for each; the SOW skeleton is secondary and refuses to render sections whose inputs are unknown (it prints `BLOCKED: no success metric agreed` instead of inventing one). (b) Added the "reframe" step: 2–3 candidate problem statements including at least one that challenges the client's own framing — the highest-value consulting move, systematized. (c) The tool explicitly recommends call 2 when unknowns above severity threshold remain — it schedules more discovery, never papers over it.

### Pass 2 — adoption critique
**Critique:** Recording client calls is legally and socially fraught (consent, two-party jurisdictions, nervous non-profits); pitch leads may see the tool as questioning their competence; and there are only ~5 discovery calls a semester, so habit never forms.
**Changes made:** (a) Notes-mode is the default path: a structured 10-field debrief form the pitch lead fills within an hour of the call — transcripts are the upgrade, not the requirement. (b) Reframed as the branch's *scoping standard*, not a personal aid: every engagement gets a copilot-generated scoping memo attached before exec approves it — low frequency becomes a strength (it's a checkpoint, not a habit). (c) The follow-up questions output is phrased for forwarding: a ready "great speaking today — a few clarifying questions" email draft, which is the part pitch leads already dread writing.

### Pass 3 — implementation critique
**Critique:** Discovery calls ramble; extraction will over-structure vague statements into false precision ("client wants 20% growth" when they said "we'd like to grow"). Past proposals used as style anchors may encode past scoping mistakes. `[CONFIRM]` markers get deleted rather than resolved.
**Changes made:** (a) Every extracted fact carries its verbatim source line from notes/transcript; anything paraphrased is tagged `INFERRED` and lands in the unknowns list, not the facts list — quote-or-abstain applied to scoping. (b) Style anchors limited to the 2 proposals leadership considers the best-scoped ever, chosen deliberately, not "all past proposals." (c) The SOW draft is delivered as a checklist-gated doc: it exports only after each `[CONFIRM]` is toggled with a one-line resolution — the gate is the deterministic-contract idea applied to a document.

## Prototype spec

- **Input:** call notes (structured form) or transcript; branch proposal template; 2 gold-standard past proposals.
- **Pipeline:** extraction pass (facts with quotes / inferences / silences) → reframe pass (3 problem statements, one contrarian) → unknowns ranker (severity = how badly the engagement breaks if unresolved) → follow-up email draft → gated SOW skeleton. One JSON contract; static render to a one-page scoping memo.
- **Build estimate:** 2–3 days: form + prompts + renderer reuse.
- **Cost:** 2 calls per engagement; ~5 engagements/semester — negligible.
- **Non-goals:** sending anything to a client unedited; replacing discovery call 2; pricing/legal terms.

## Demo script (8 minutes)

1. *(60s)* "Every failed project I've seen was lost before it started — in the first call. Here's a real-ish one." Play/read 90 seconds of a rambling mock discovery call (pre-scripted, a director who talks fundraising but never names a decision-maker).
2. *(60s)* Fill the 10-field debrief form live with what the room remembers.
3. *(2m)* Run it. Walk the scoping memo top to bottom: facts (each with its quote), then the unknowns list — "notice #1: *nobody in this call can approve the project.* Severity: fatal."
4. *(90s)* Show the three problem statements, dwelling on the contrarian one ("the stated problem is donor acquisition; the transcript suggests donor *retention* — here's the quoted line").
5. *(90s)* Show the SOW skeleton with its `BLOCKED` sections and the ready-to-send follow-up email.
6. *(60s)* Close: "The tool didn't write a proposal. It made a first-semester student ask the questions a senior consultant would ask. That's the product."

## Workshop exercise (50 min)

- **Setup:** pairs; one plays the client from a persona card (with deliberately buried gaps: no budget owner, vague success criteria), one plays the pitch lead taking notes.
- **Round 1 (12m):** run the mock discovery call.
- **Round 2 (8m):** pitch lead fills the debrief form and writes their *own* list of what's missing — humans first.
- **Round 3 (5m):** run the copilot; diff its unknowns list against the human's.
- **Round 4 (15m):** call 2 — pitch lead asks the copilot's top-3 follow-ups; client card tells the client how to answer. Watch the SOW's `BLOCKED` sections unlock.
- **Debrief (10m):** the persona cards are revealed; count which buried gaps each pair caught at each stage.

## Consultant prompt pack

1. **Extraction:** "From these call notes, produce three lists. FACTS: things the client stated, each with the verbatim line. INFERRED: things I'm tempted to conclude but weren't stated — flag each. SILENCES: things a scoping conversation must cover that never came up (decision-maker, success metric, data access, timeline, budget reality, prior attempts)."
2. **Reframe:** "Given the facts, write 3 one-sentence problem statements this engagement could tackle. One should challenge the client's own framing, with the quote that justifies the challenge. For each: what the deliverable would be and what could make it the wrong choice."
3. **Unknowns ranker:** "Rank the silences and inferences by damage-if-unresolved. For each of the top 5: the single question to ask, phrased so a nervous non-profit director answers openly."
4. **Follow-up email:** "Draft a warm 120-word follow-up email that thanks them, plays back the problem in their language, and asks the top-3 questions. Mark `[PERSONAL]` where I must add something human. Do not promise scope."
5. **SOW gate:** "Fill the SOW template using only FACTS. Any section requiring an unknown prints `BLOCKED:` and the reason. Never invent a number, date, or metric."

## Quality rubric

| Dimension | Pass bar |
|---|---|
| Extraction fidelity | Every FACT has a verbatim source line; zero paraphrases in the facts list |
| Silence detection | Catches ≥4/5 gaps deliberately buried in a test transcript |
| Reframe quality | A senior member rates ≥1 of 3 problem statements "better than the client's own framing" |
| False precision | Zero invented numbers/dates across 5 test runs |
| Gate integrity | SOW never renders a blocked section as filled |
| Email usability | Pitch lead sends the draft with <25% edits |

## Rollout plan

1. **Week 1:** build the debrief form and prompts; back-test on 2 past engagements (one that went well, one that crept) — the memo for the crept one should have predicted the creep.
2. **Week 2:** live pilot on the next real discovery call, copilot running in notes-mode alongside the normal process.
3. **Week 3:** exec adopts the scoping memo as an attachment to engagement approval — the institutional hook.
4. **Next semester:** pair with Scope Sentry (demo #12): the SOW this tool produces becomes the sentry's baseline; the two tools close the loop from scoping to delivery.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Recording consent / jurisdiction issues | Notes-mode default; recording only with written consent; consent line in the how-to |
| False precision in extraction | Quote-or-abstain fact list; INFERRED tag; false-precision rubric line tested per release |
| Tool papers over thin discovery | `BLOCKED` sections + explicit "schedule call 2" recommendation above severity threshold |
| Client data sensitivity | Scoping memos stored in the engagement folder with the same access as the proposal itself |
| Pitch leads feel audited | Memo owned and presented by the pitch lead; exec sees the memo, not a score |
| Contrarian reframe annoys a client if repeated verbatim | Reframes are internal-only by default; the email prompt never includes them |
