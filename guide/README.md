# The AI Workflow Lab Guide

How a future 180DC member — with no AI team left in the room — can reproduce the lab that produced [lab/](../lab/): 25 demo-able workflow ideas, a ranked shortlist, and build-ready specs for the best of them. This is the method, not the output. Run it once a year; the output should look different every time because the branch's problems will.

## What the lab is

The lab is a repeatable pipeline: **problem inventory → idea generation → ranking → critique passes → build packs → pilot**. Its product is not tools — it's *decisions about which tools deserve to exist*, made cheaply on paper before anything is built. One person can run it in a focused week; a pair is better.

## The five principles (non-negotiable)

Inherited from [docs/overview.md](../docs/overview.md); every idea the lab produces must pass all five, or it gets fixed in critique or cut:

1. **Quote or abstain.** Any tool that makes claims about a document, a person, or an org must anchor every claim to verbatim evidence or say it found nothing. This is the single biggest difference between a demo that survives a skeptical room and one that gets embarrassed.
2. **Teach, do not ghostwrite.** Tools surface gaps and principles; the human does the rewrite, has the conversation, makes the call. If a tool's output can be forwarded unedited, add a blocking marker (`[ADAPT]`, `[PERSONAL]`, `[CONFIRM]`) until it can't.
3. **Rank, do not reject.** Anywhere people are evaluated (recruitment, staffing, feedback), the tool orders and annotates; a human draws every cutoff. No pass/fail verdicts about humans, ever.
4. **Deterministic contract.** The model returns one structured object (JSON); a static template owns every pixel of output. This makes tools auditable, testable, and demo-stable.
5. **Honest calibration.** A tool that always finds three problems is lying somewhere. Every tool needs a "nothing notable" path and a noise budget (max findings per run), and gets tested on known-good input.

## Step 1 — Problem inventory (half a day)

Do not start from AI capabilities. Start from the branch's pain:

- Interview 4–6 people across roles (president, VP consulting, a TL, a first-semester consultant, HR/recruitment, external relations). One question dominates: *"what went wrong this year that will go wrong again next year?"*
- Write the problem list in plain words ("people join but don't get much value", "scope creep", "we forget everything every semester"). Aim for 8–12 problems.
- For each, note the *moment* it happens (week 1 of a project? the first client call? review season?). Tools attach to moments, not to abstractions.

## Step 2 — Generate 25 ideas (one day)

Quantity first, with structure. Use an AI assistant as the generator and yourself as the editor — the inverse ratio of most AI use.

- **Fix the card format before generating.** Ours has 13 fields: name, problem solved, user, workflow, first demo, tools needed, data needed, output looks like, why consultants care, why leadership care, risks, how to test, how to teach it. The fields are the quality control: an idea that can't fill "first demo" or "how to test" concretely is not an idea yet.
- **Force category coverage** (client acquisition, recruitment, training, PM, TL support, quality, engagement, partnerships, workshops, knowledge base). Without the quota, everything clusters on deliverable review, because that's the easiest to imagine.
- **The anti-generic test:** every idea must be a *demo Manuel could show someone* — a specific artefact appearing on a screen and someone in the room going "oh." "Use ChatGPT to write emails better" fails; "watch this messy voice memo become a follow-up pipeline with `[PERSONAL TOUCH]` markers" passes.
- Prompt pattern that worked: give the AI the problem inventory, the five principles, the card format, the category quota, and the existing tools (so it builds around them, not over them). Generate in batches of 5–8, edit each batch before the next — quality degrades if you ask for 25 at once.

## Step 3 — Rank (half a day)

Four axes, 1–5 each, equal weight: **impact** (moves a top branch problem), **feasibility** (buildable in days with data the branch actually has), **credibility** (survives a skeptical room; obeys the principles), **wow** (the demo produces a visible reaction).

Two rules beyond the arithmetic:

- **Portfolio-adjust the cut:** the top 7 should span problem categories. If two ideas overlap, keep one and write down where the other's best parts went (see "near misses" in [lab/ranking.md](../lab/ranking.md)).
- **Check for lens ideas:** some high scorers aren't tools, they're *features of an existing tool* (our Evidence Auditor and Chart Doctor are Reviewer V2 lenses). Folding them in beats building them twice.

## Step 4 — Three critique passes (one day for 7 ideas)

This is where the lab earns its keep. For each shortlisted idea, run three adversarial passes — and **every critique must produce a design change**, written as "Critique: … / Changes made: …". A critique that changes nothing was either wrong or ignored.

1. **Usefulness critique:** assume it works perfectly — is the output actually valuable? Common finding: the impressive output is the wrong artefact (a proposal skeleton when the unknowns checklist is the value; scary questions without a fix loop).
2. **Adoption critique:** assume it's valuable — will busy students actually use it in week 6? Common findings: friction kills habit (attach to existing rituals and calendars, not willpower); fear kills usage (make results private, announce transparency policies); the people who need it most self-select out (put it in onboarding, not in an app catalog).
3. **Implementation critique:** assume people want it — what breaks when you build it? Common findings: single long generations degrade (fan-out/fan-in per artefact); models grading their own output self-agree (independent verifier call — the Reviewer V2 pattern, which we ended up reusing in four of seven specs); state across weeks needs a home (a running file in the project folder beats a database); personal/client data needs structural answers (sanitize passes, retention tied to project close, ingestion gates), not policy promises.

## Step 5 — Build packs (one day for 7 ideas)

Each surviving idea gets seven artefacts — the full set is what makes an idea *handed-off-able*:

| Artefact | The question it answers |
|---|---|
| Prototype spec | What exactly gets built, in/out, cost, and explicit non-goals |
| Demo script | The 6–8 minute room performance, beat by beat, with the "oh" moment named |
| Workshop exercise | How a room learns it hands-on — always humans-attempt-first, then the tool |
| Consultant prompt pack | 5 prompts so the *pattern* works for anyone even without the tool |
| Quality rubric | Pass bars the tool must hit before anyone demos it (include a known-good-input test) |
| Rollout plan | Weeks 1–4 plus the institutional hook (which existing ritual it attaches to) |
| Risks & mitigations | Table; every mitigation must be structural (a gate, a schema, a policy in the how-to) — "we'll be careful" doesn't count |

See [lab/top7/](../lab/top7/) for seven worked examples.

## Step 6 — Pilot discipline

- Build the flagship (highest wow ÷ build-cost — for us, Red-Team CEO) first; a working demo buys permission for everything else.
- Pilot on one real project with a volunteer TL. Write the quality rubric *before* building and test against it.
- The handoff test from the branch's operating guide is the bar: **a tool isn't shipped until someone outside the AI team runs it without you in the room.**
- Kill fast and in writing: a parked idea with a one-line reason ("credibility risk too early — revisit after trust established") is a gift to next year's lab.

## Repo conventions

- Ideas live as cards in [ideas/cards/](../ideas/cards/), one row each in [ideas/backlog.md](../ideas/backlog.md) with a stage (spark → shaping → ready → building → shipped → parked).
- Lab output lives in `lab/` (dated or versioned if run again: `lab/2027/`).
- Tools that get built graduate to `tools/<name>/` with a README and, per the operating guide, a one-page how-to a non-AI-team member can follow.
- Update the CHANGELOG when a lab run lands.

## What to do differently next time

- **Collect real usage data first.** This run ranked on judgment. Next year, the Miner's failure patterns, pulse data, and tool usage counts should feed Step 1 directly.
- **Involve skeptics in Step 4.** The critique passes are better run live with the branch's most AI-skeptical senior member in the room; their objections are the adoption critique, from source.
- **Budget for the boring asset.** In almost every spec, the moat wasn't the AI — it was a written artefact nobody had made (the reality file, the case library, the scenario war stories, the 20-question benchmark). Schedule those interviews first; they're the critical path every time.
