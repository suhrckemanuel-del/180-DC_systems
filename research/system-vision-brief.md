# AI Quality Reviewer — System Vision Brief
**Date:** 2026-06-05
**Based on:** 4 independent research agents covering evaluation architecture, learning loop design, workflow integration, and technical build

---

## The Core Vision (One Paragraph)

The 180DC AI Quality Reviewer is an embedded expert that holds every consultant to McKinsey senior reviewer standards — not by replacing human judgment, but by making expert reasoning visible at the moments it's needed. It fires at three points in a project cycle, serves two distinct user types with distinct output modes, and is designed so each interaction builds the mental model that makes the next interaction less necessary. The goal is not a tool consultants rely on — it is a tool that accelerates the transition from student to practitioner.

---

## System Architecture (3-Layer)

```
LAYER 1 — Document Ingestion
  PDF → Claude native PDF API (base64, no text extraction needed)
  Full document fits in 200K context for 30–80 pages
  Prompt caching on document block = 90% cost reduction on repeat reviews

LAYER 2 — Criterion Evaluation (Demo: single-pass | Production: parallel per-criterion)
  Demo:      One API call, all criteria in system prompt, structured JSON output
  Production: One API call per criterion, run in parallel, one aggregation call

LAYER 3 — Output Rendering
  Student mode:  PRINCIPLE → DIAGNOSIS → WHY IT MATTERS → QUESTION → [gated fix]
  Team lead mode: Severity-sorted triage list, pass/fail per criterion, dismissal audit trail
```

---

## The Two Architectural Decisions You Need to Make

### Decision 1: Single-pass (demo) vs. multi-pass (production)

**Single-pass:** One API call, all 5–10 criteria evaluated simultaneously. Faster to build (80 lines, 2–4 hours), sufficient for a pitch demo. Risk: "criterion collision" — model satisfices across criteria rather than applying each rigorously.

**Multi-pass:** One API call per criterion, run in parallel (not sequentially). 5–10× API calls per document but costs ~$0.30–0.80 per review. Backed by arXiv 2601.22386 ("Specialists or Generalists?"): criterion-specialist approaches outperform generalist single-call on rubric adherence. Requires a synthesis/aggregation call to merge.

**Recommendation:** Build single-pass for the demo. Commit to multi-pass as the production architecture. The demo proves the concept; multi-pass is the right long-run design.

### Decision 2: Gated fix vs. immediate fix

**Gated:** Fix is present but collapsed behind a "Show suggested fix ▼" toggle. Consultant must engage with the question before seeing the answer. Backed by automation bias research — even trivial friction reduces passive acceptance and increases deliberation.

**Immediate:** Fix is visible alongside the finding. Simpler UX, easier to demo.

**Recommendation:** Implement gating from V1. It is the single design decision most likely to determine whether this tool builds skill or creates dependency. The "click to reveal" is trivial to implement and has outsized pedagogical effect.

---

## The Output Format (Per Finding)

Research-backed format that teaches rather than corrects:

```
[PRINCIPLE]    Pyramid Principle: Action Titles
[DIAGNOSIS]    Slide 7 title "Market Analysis" is a topic label, not an insight.
[WHY]          A partner reading only titles would not understand your argument.
               Action titles carry the weight of the deck's narrative logic.
[QUESTION]     What is the single claim this slide is making?
               ▼ Show suggested fix
                  → "Dutch catering market is underserved: 3 of 5 top distributors
                     lack plant-based options"
```

**Key design rules:**
- The principle name is the transfer mechanism — consultants carry a vocabulary of named standards
- The question comes BEFORE the fix — generation effect (retrieving before receiving) produces stronger retention
- Suggested fix is gated — trivial click, but forces a conscious decision to look at the answer
- Maximum 3 findings per review session surfaced proactively; deeper findings available on request (reduces overwhelm)

---

## The Learning Loop (Anti-Dependency Design)

### Graduated fading by track record
Track which principles a consultant has been flagged for before. First exposure: full output (principle + explanation + question + gated fix). Third exposure to same principle: question only, no explanation. This is Vygotsky's ZPD operationalized — reduce scaffolding as competence builds.

### Seniority modes
- **Junior consultants:** Full output (proactive, all criteria)
- **Project leads:** Flags + questions only, explanations on demand (reactive)
- **Team leads (QA pass):** Severity-sorted triage list, pass/fail per criterion, no pedagogy

### Multi-turn hard limit
If a consultant asks the system to rewrite a slide for them: redirect. "Here's the principle — what would a fix look like if you applied it?" SafeTutors (arXiv 2603.17373) found pedagogical harm rates jump from 17.7% → 77.8% as AI conversations extend into rewriting territory. The reviewer is not a ghostwriter. This must be enforced in the system prompt.

### Pre-submission self-assessment
Before the review output is revealed (at the Week 2 and pre-submission trigger points), ask 2 short questions: "What is the governing insight of this deliverable?" and "How confident are you in the evidence behind the main recommendation?" The reviewer then shows where its assessment matches or diverges. Activates the retrieval process that makes feedback stick.

---

## Workflow Integration

### Three trigger points

| Trigger | Timing | Mode | Who |
|---|---|---|---|
| Mid-cycle draft | Week 2 of 4, after first synthesis | Student/learning mode | Student consultants |
| Pre-submission QA | 48 hours before client delivery | Team lead/triage mode | Team lead |
| On-demand | Anytime | Student/learning mode | Student consultants |

### The adoption rule (non-negotiable)
**Team leads must visibly use the tool for QA before students adopt it.** If the team lead bypasses it, student usage collapses within 4–6 weeks. Structure the pilot so the team lead's QA pass runs through the tool first, then discusses the output with the team. This is the single highest-leverage adoption action.

### Inline vs. separate report
Inline annotations (on the actual slide/section) outperform separate reports on user engagement. However, inline integration requires Google Slides/Docs API work. For the demo and V1: use a structured separate report. For V2: integrate inline via Google Slides Add-on.

### Embed where students already work
Context-switching is the primary adoption killer. The tool must be triggerable from within Google Slides or Docs, not require a separate login. For the pilot, this can be a simple shared link that accepts a PDF upload. For production: a Google Workspace Add-on.

---

## Evaluation Architecture (How to Make the Rubric Reliable)

### Criteria must be observable text properties, not judgment calls
**Wrong:** "Is the recommendation specific enough?"
**Right:** "Does each recommendation include: (a) a named action, (b) a responsible party or team, (c) a timeframe, and (d) a measurable outcome?"

Every criterion must pass this test before being built into the reviewer.

### Anchor examples are non-negotiable
Without score anchor examples (real document excerpts showing what score 1, 3, and 5 looks like per criterion), the model defaults to 3 for everything. Write 3 anchors per criterion using real or constructed examples. This is the highest-ROI design work before the first calibration run.

### The sandwich pattern for long documents
Rubric criterion and output schema at the TOP and BOTTOM of the prompt. Document in the middle. The "lost in the middle" effect degrades performance by 30%+ when instructions are buried in the middle of a long context.

### G-Eval evaluation steps
For each criterion, write 4–6 manually specified evaluation sub-steps (not auto-generated). Example for "Action Titles":
1. List all slide titles in the document
2. For each, assess: does it state an insight/claim, or describe a topic?
3. Quote the three worst offenders verbatim
4. Count total violations
5. Score 1–5 using the anchor definitions

### Multi-perspective critique (V2 upgrade)
CritiqueCrew (CHI 2026) found that running separate specialist reviewers (logical structure / evidence quality / slide craft) and surfacing their conflicts significantly outperforms a unified-model reviewer. When the structure reviewer says "simplify this" and the evidence reviewer says "this needs more depth," surfacing that tension forces the consultant to make a strategic judgment — exactly the thinking the tool should develop. Consider for V2.

---

## Technical Stack (MVP → Production)

### MVP (Demo-ready, 2–4 hours)
```python
# Stack: Python + anthropic SDK + pydantic + streamlit
# Data flow:
PDF upload → base64 encode → Claude API (document block)
  + system prompt (rubric, persona, all criteria)
  + output_format=ReviewOutput (Pydantic schema)
→ structured findings → Streamlit card display

# Cost: ~$0.30–0.80 per 60-page document (Claude Sonnet 4.6)
# Output guarantee: constrained decoding via Pydantic = no malformed JSON
```

### Production architecture
```
One API call per criterion (parallel)
  + prompt caching on document block (90% cost reduction on repeat)
  + synthesis aggregation call
  + student vs. team lead mode branching
  + per-consultant history for graduated fading
  + Google Workspace Add-on for inline integration
```

### Key Anthropic API patterns
- **Native PDF document block** — handles text + visual layout simultaneously, no extraction code needed
- **Prompt caching** — `cache_control: {type: "ephemeral"}` on document block; subsequent passes reuse at $0.30/MTok vs $3.00/MTok
- **Structured output** — `output_format=ReviewOutput` with Pydantic schema; constrained decoding guarantees valid JSON
- **Extended thinking OFF** — cannot be combined with structured output; use CoT-in-prompt approach instead

---

## Demo Plan (For the Pitch)

1. Upload VF deliverable (known-good benchmark)
2. Show findings — demonstrate the tool has discernment (finds real issues even in a strong deliverable)
3. Show the output format: principle → diagnosis → why → question → [gated fix]
4. Upload a weaker second deliverable — show the gap and the value of the review
5. Narrate: "Every 180DC deliverable gets this before the client sees it"

**What makes the demo land:**
- Pre-calibrate the rubric against the VF deliverable so findings are accurate and recognizable
- Make sure at least one finding is something the branch director will immediately think "yes, that's a real problem we have"
- Keep demo to 3–4 findings max — depth over breadth

---

## Open Design Questions (For Your Critical Thinking)

1. **Gated fix UX:** Will 180DC students engage with the question before clicking reveal, or will they all just click immediately? The research supports gating, but you know the 180DC student behavior better. If they'll all click immediately, the gating still adds value (forced pause) but the question needs to be very short and concrete.

2. **Criteria calibration:** The 5 V1 criteria from session-01 (action titles, governing insight, recommendation specificity, evidence sourcing, actionability) are a strong start. But anchor examples for each need to be written against real 180DC deliverables, not generic consulting examples. Who does this calibration work? One senior 180DC member reviewing 10 past deliverables would produce the anchor set.

3. **The dependency argument in the pitch:** The branch director will ask "won't consultants just copy whatever the AI says?" The answer is: (a) the gated fix design prevents passive copying, (b) the tool explicitly asks questions rather than just providing answers, (c) over time, flagging frequency drops as consultants internalize standards — you can show this with before/after data from the pilot. Have this answer ready.

4. **Multi-perspective critique (CritiqueCrew):** Running separate specialist reviewers (logical structure / evidence / slide craft) and surfacing their conflicts would be a differentiating feature for V2. But it triples the number of API calls. Worth flagging as the upgrade path, not the starting point.

5. **Institutional memory layer (V3):** McKinsey's Lilli works because it retrieves from decades of prior work. A 180DC knowledge base of past exemplary deliverables — fed into the reviewer as RAG context — would allow findings like "the best 180DC deliverables on similar projects used approach X." This is the long-term moat if the tool succeeds.

---

## Summary: What to Build, In Order

| Stage | What | Why |
|---|---|---|
| Demo | Single-pass reviewer, Streamlit, VF + second deliverable | Proves the concept, wins the pilot |
| V1 | Multi-pass per criterion, gated fix, student + team lead modes | Correct production architecture |
| V2 | Google Slides inline integration, graduated fading, multi-perspective | Drives adoption, builds skill over time |
| V3 | RAG over 180DC exemplary deliverables, per-consultant history, branch knowledge base | Institutional memory, long-term moat |
