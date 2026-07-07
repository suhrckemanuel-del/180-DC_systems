# Red-Team CEO

Stress-test a finished deliverable by generating the 10 hardest, quote-anchored questions the client's toughest stakeholder would ask — before the client does.

## Critique passes

### Pass 1 — usefulness critique
**Critique:** Ten hard questions are only useful if the team can do something with them. A list of brutal questions three days before the presentation is anxiety, not quality. Also, "hardest questions" drifts toward generic MBA-interview toughness ("what's your Plan B?") that any deck would struggle with — that tests nothing about *this* deck.
**Changes made:** (a) Every question must be anchored to a verbatim deck quote or it is discarded — a question that could be asked of any deck is a defect. (b) The tool ships as a two-round loop, not a list: round 1 generates questions, the team writes answers, round 2 grades each answer *holds / weak / exposed* and states what evidence would fix "exposed." The unit of value is the fixed slide, not the scary question. (c) Output includes a "strongest ground" section: the 3 claims the deck defends best — so the team also learns what to lead with.

### Pass 2 — adoption critique
**Critique:** Teams in final-week crunch will not volunteer for an extra gauntlet, and TLs may fear it demoralizes the team or exposes them to leadership. If it's optional and scary, usage will be zero after the demo buzz fades.
**Changes made:** (a) Position it inside an existing ritual: the branch already does a pre-final internal review — the murder board becomes the agenda of that meeting, replacing nothing-added review theater. (b) Results are team-private by default; leadership sees only *that* it ran, never the questions or grades. (c) Run at week n−2, never the final week, framed as sparring ("you get to fail here first"). (d) A 15-minute cap: 10 questions max, the noise-budget discipline — this is a sparring session, not an audit.

### Pass 3 — implementation critique
**Critique:** Long decks blow context or dilute question quality; persona realism is hand-waved ("skeptical CFO" produces stock questions); grading your own generated questions risks self-agreement bias; pptx text extraction loses charts, where many weaknesses live.
**Changes made:** (a) Reuse Deck Transform's pptx extraction; exhibits go in as images (vision) so chart-based contradictions are askable. (b) Persona is built from a 5-field client-context form the TL fills (role, what they opposed, what they fear, how they measure success, meeting format) — not a free-text vibe. (c) Question generation and answer grading run as separate calls with separate prompts; the grader sees only deck + question + answer, not the generation rationale (independent-verifier pattern from Reviewer V2). (d) Deterministic contract: one JSON schema (`questions[]` with `quote`, `slide`, `question`, `danger`, later `verdict`, `fix_hint`), rendered by a static template like the Quality Reviewer.

## Prototype spec

- **Input:** deck (pptx/pdf), client-context form (5 fields), optional SOW for promised-scope questions.
- **Pipeline:** extract (Deck Transform code) → persona build → question pass (Claude, JSON out, max 10, quote-or-abstain enforced by schema validation: reject any question whose `quote` is not a verbatim substring of the extracted text) → human answer round (plain doc) → grading pass (independent prompt) → static HTML render (reviewer's renderer pattern).
- **Build estimate:** 1–2 days on existing branch code. No new infrastructure.
- **Cost:** ~2 long-context calls per deck.
- **Non-goals:** rewriting slides (teach-don't-ghostwrite), scoring the team, running without a human answer round.

## Demo script (7 minutes)

1. *(30s)* "This deck is finished. The team feels great. In five days the client's board sees it. One person in that room didn't want this project to happen."
2. *(60s)* Show the 5-field client-context form, fill it live for the anonymized real deck on screen.
3. *(2m)* Run the question pass. Read questions aloud as they render — each with its slide quote highlighted. Pause on the nastiest one.
4. *(2m)* Ask the room: "Who can answer question 4?" Let the silence happen. That silence is the product.
5. *(60s)* Show the grading round from a pre-run: one answer graded *exposed*, with the fix hint ("this holds only if you can source the 40% figure — slide 12's appendix doesn't").
6. *(30s)* Close: "Fifteen minutes, two days of fixes, and the team walks into the real room having already survived the worst version of it."

## Workshop exercise (45 min)

- **Setup:** teams of 3–4, each brings any past deck (or uses the provided anonymized one).
- **Round 1 (10m):** *Humans first* — each team writes the 5 hardest questions they think a hostile reader would ask of their own deck.
- **Round 2 (5m):** Run Red-Team CEO. Compare: which machine questions did no human predict? Which human questions did the machine miss? (Teaches both the tool's value and its blind spots.)
- **Round 3 (15m):** Teams pick their 3 most dangerous questions and draft answers.
- **Round 4 (10m):** Cross-examination — teams swap and grill each other using the question sheets, then see the AI grader's verdicts.
- **Exit check (5m):** each person writes the one slide they'd now change and why.

## Consultant prompt pack

1. **Persona builder:** "From this client context form, write a 1-paragraph stakeholder persona: what they protect, what they fear, what evidence standard they hold. No adjectives without a behavioral basis."
2. **Question pass:** "You are [persona]. Read the deck. Generate up to 10 questions you would actually ask. RULES: every question must quote the deck verbatim and cite the slide; discard any question that could be asked of a generic deck; rank by danger to the recommendation; if the deck gives you fewer than 10 genuine openings, return fewer (finding nothing is a valid finding)."
3. **Strongest-ground pass:** "List the 3 claims in this deck best supported by its own evidence, each with the quote. These are what the team should lead with."
4. **Grader:** "Here is a deck, a question, and the team's written answer. Verdict: HOLDS (answer is supported by deck or stated evidence), WEAK (answer plausible but unsupported), EXPOSED (answer contradicts the deck or dodges). One sentence of reasoning + one fix hint. Do not soften."
5. **Self-run for consultants:** "I'm presenting [topic] to [audience]. Before I show you my summary, ask me the three questions you'd need answered to trust it." (The habit version — no tool required.)

## Quality rubric (for the tool itself)

| Dimension | Pass bar |
|---|---|
| Anchoring | 10/10 questions contain a verbatim deck quote with correct slide ref |
| Specificity | ≥8/10 questions could not be asked of a different deck |
| Danger ranking | A TL agrees the top-3 are genuinely the most dangerous |
| Prediction | ≥3/10 questions later actually asked (or near-variants) by the real client |
| Noise | Zero questions a TL rates "no real client would ask this" |
| Grading honesty | Grader marks at least one answer HOLDS on a strong deck (no manufactured toughness) |

## Rollout plan

1. **Week 1:** build on one anonymized past deck; validate rubric with 2 TLs.
2. **Week 2:** pilot on one live project at week n−2, TL-invited, team-private. Collect the "which questions came true" data after the real presentation.
3. **Week 3–4:** second pilot with a different project type; write the one-page how-to; hand operation to a non-AI-team member (the litmus test from the branch's operating guide).
4. **Semester point:** fold into the standard pre-final review ritual; report only usage counts and prediction hit-rate to exec.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Demoralizes team near deadline | Week n−2 only; strongest-ground section always included; team-private results |
| Generic tough-guy questions | Quote-or-abstain schema validation; specificity rubric line; discard rule in prompt |
| Grader self-agreement bias | Separate grading call, no shared rationale (verifier pattern) |
| Leadership turns it into surveillance | Hard norm: exec sees usage, never content; written into the how-to |
| Confidential decks in prompts | Runs only on branch-controlled accounts; anonymization step for demo use |
| Team "wins" the murder board and overtrusts the deck | Output footer: "passing sparring ≠ client sign-off; this tests the argument, not the facts — run Evidence Auditor for facts" |
