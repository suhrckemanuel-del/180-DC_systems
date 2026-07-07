# Branch Brain

A retrieval system over the branch's entire document memory — past deliverables, proposals, handovers, decisions — that answers questions with verbatim quotes or an honest "I don't have that." The structural fix for an organization that loses 100% of its memory every three years.

## Critique passes

### Pass 1 — usefulness critique
**Critique:** A chat-over-documents demo is easy; a *useful* memory is hard. If the corpus is thin (it will be, at first), the brain answers "nothing found" so often that people stop asking. And retrieval over student decks risks amplifying past mediocrity — the brain will confidently serve a 2023 deck's framework as branch wisdom even if that deck was weak.
**Changes made:** (a) Launch scoped to the **three question types with existing corpus density**: "what did we promise?" (proposals/SOWs), "have we done X before?" (project index), "how do we do Y here?" (docs/, templates, operating guides) — not open-ended everything-chat. (b) Every indexed document carries a **quality tier** (gold: leadership-endorsed / normal / caution: superseded or known-weak) set at ingestion; answers state the tier ("from a *caution*-tier 2023 deck — treat as example, not standard"). (c) The monthly "unanswerable questions" report is a first-class output: it converts every miss into a to-write list, so thinness becomes a roadmap instead of a disappointment.

### Pass 2 — adoption critique
**Critique:** Knowledge bases die the same death every time: ingestion is a chore nobody owns, the index rots, trust drops, usage drops, rot accelerates. A student org with semester turnover is the worst-case environment for this. Also, if asking the brain is slower than asking the group chat, the group chat wins.
**Changes made:** (a) Ingestion is attached to **existing mandatory rituals**, not goodwill: project close already requires a handover — the 20-minute structured handover interview (the brain asks, the TL answers, the transcript is indexed) *replaces* the handover doc rather than adding to it. Less work than the status quo, not more. (b) The brain lives **where questions already happen** (the group chat, via a bot account or a pinned "ask the brain" flow), not in a separate portal. (c) Ownership is a named exec role ("memory keeper") with a 30-minute monthly maintenance ritual defined in the how-to — a role survives turnover; a volunteer doesn't. (d) Seed corpus is built in one "archive day" event, making launch state useful rather than empty.

### Pass 3 — implementation critique
**Critique:** Client confidentiality is the landmine: past deliverables contain client financials and names; one cross-team leak poisons trust permanently. Naive RAG hallucination breaks the whole value proposition (a memory that lies is worse than no memory). Embedding infrastructure is over-engineering for a corpus of a few hundred documents.
**Changes made:** (a) **Two-tier corpus by construction:** tier 1 (open: templates, guides, anonymized case studies, decisions) available to all; tier 2 (client work) ingested only after an anonymization pass with human sign-off, or access-restricted to exec. Nothing enters the index by default — ingestion review is the gate. (b) Quote-or-abstain enforced mechanically: the answer template renders only retrieved verbatim passages + the model's one-line synthesis; if retrieval returns nothing above threshold, the template renders the honest miss + "closest documents" list. The model never freewheels. (c) Right-sized infrastructure: at launch this is a Claude Project (or file-search over a folder) — a few hundred docs fit context/file-search fine; embeddings only if the corpus outgrows it. The 20-question benchmark decides, not architecture taste.

## Prototype spec

- **Corpus v0 (archive day output):** docs/, templates, all proposals/SOWs (anonymized), project one-pagers (one per past project: client type, problem, approach, outcome), exec decision log, 3 gold-tier deliverables.
- **Query path:** question → retrieval → answer template: quoted passages (with doc name, date, tier) + one-line synthesis + confidence note; miss path: honest "not in the corpus" + 3 nearest documents + auto-log to the unanswerable report.
- **Write path:** project-close handover interview (10 structured questions, answered in chat, transcript auto-indexed); monthly memory-keeper ritual (review unanswerables, ingest 2–3 docs, retire stale ones).
- **Build estimate:** 2 days engineering + 1 archive day (the real cost). Benchmark: 20 questions with known answers, target 0 hallucinations.
- **Non-goals:** open-ended chat assistant, automatic ingestion without review, cross-tier answers.

## Demo script (7 minutes)

1. *(45s)* "Everyone who knew why we stopped doing corporate clients graduated. Every branch is Memento — new tattoos every semester, no memory. Watch."
2. *(90s)* Ask question 1 live: "Have we ever done a pricing project for a non-profit?" → answer with the quoted project one-pager, date, outcome.
3. *(90s)* Question 2: "What exactly did we promise in the [anonymized] proposal?" → verbatim SOW clause, with tier and date stamped.
4. *(90s)* Question 3 — the honesty demo: ask something the corpus doesn't contain. Show the miss: "Nothing in the corpus. Closest: these three. Logged to the gap report." Say it explicitly: "It doesn't guess. That's the whole product."
5. *(60s)* Show the write path: a 60-second excerpt of a handover interview and the question it later answers.
6. *(45s)* Close: "The demo took four minutes. The alternative was three Slack messages to people who graduated."

## Workshop exercise (45 min)

- **Scavenger hunt (15m):** teams get 8 branch-history questions; round 1 without the brain (folders + group chat allowed). Score answers found.
- **Round 2 (10m):** same questions with the brain. Compare time and accuracy; note which questions *neither* could answer.
- **Ingestion lab (15m):** each team takes one real document, runs the ingestion review (anonymization check, tier assignment, one-pager summary), and watches a previously-unanswerable question become answerable — the compounding loop made visible.
- **Exit (5m):** each attendee submits one question they wish the brain could answer; the pile seeds the memory keeper's next month.

## Consultant prompt pack

1. **Ask pattern:** "Answer only from the retrieved documents. Quote verbatim, cite document + date + tier. If the documents don't contain the answer, say 'not in the corpus' and list the three closest documents. Never bridge gaps with general knowledge."
2. **Handover interviewer:** "You are closing project [X]. Ask me these ten questions one at a time, pushing for specifics on: the problem as finally understood (vs as pitched), what worked, what you'd warn the next team about, where every artefact lives, client relationship notes, and the one thing that will be forgotten if not written down. Rephrase vague answers back to me until they're concrete."
3. **One-pager generator:** "From this deliverable + proposal, write the project one-pager: client type (anonymized), problem, approach, outcome, 2 reusable artefacts, 1 warning. Every claim must trace to the documents."
4. **Anonymization pass:** "Rewrite this document replacing all identifying details (names, places, unique numbers, sector-role combinations). Then adversarial check: could a reader of the original branch's city guess the client? List remaining risks."
5. **Gap report:** "Here are this month's unanswered questions. Cluster them, rank clusters by frequency, and for each name the document that would answer it and who likely could write it."

## Quality rubric

| Dimension | Pass bar |
|---|---|
| Hallucination | 0/20 benchmark questions answered with invented content — hard fail otherwise |
| Honest abstention | 100% of out-of-corpus benchmark questions get the miss template |
| Retrieval quality | ≥16/20 in-corpus questions answered with the correct quoted passage |
| Provenance | Every answer carries doc name, date, tier — no exceptions |
| Confidentiality | Red-team session: 0 tier-2 leaks to a tier-1 user across 10 adversarial queries |
| Freshness honesty | Answers from >12-month-old docs state the age unprompted |

## Rollout plan

1. **Week 1–2:** archive day (exec + volunteers, pizza, one afternoon: gather, anonymize, tier, one-pager each past project). Build query path. Write the 20-question benchmark first — it defines done.
2. **Week 3:** exec-only pilot; run the benchmark; fix retrieval until 0 hallucinations.
3. **Week 4:** open tier-1 to all members in the group chat; first handover interview on the next closing project.
4. **Month 2:** appoint the memory keeper role with the written 30-minute monthly ritual; first gap report to exec.
5. **Semester point:** measure: questions asked/week, hit rate, and the strongest metric — handover interviews completed vs projects closed (target 100%, since it replaces the old handover doc).

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Client-confidential leak | Nothing indexed by default; anonymization + human sign-off gate; two tiers; adversarial red-team before launch |
| Hallucinated institutional memory | Template renders only retrieved quotes; benchmark hard-fails on a single hallucination |
| Index rot after handover of ownership | Named exec role + written monthly ritual; ingestion attached to mandatory project-close, not goodwill |
| Empty-corpus disappointment | Scoped launch to dense question types; archive day before launch; gap report reframes misses as roadmap |
| Amplifying weak past work | Quality tiers at ingestion; caution-tier warnings in answers |
| Over-engineering | Claude Project / file-search first; embeddings only when the benchmark says retrieval is the bottleneck |
