# How the Agents Work — and Why They're Different

The system isn't one big AI doing everything. It's a small cast, each member with one narrow job, plus a non-AI conductor that keeps order. The power of the design is that **no single agent is ever asked to do too much** — and that's easiest to see by looking at how differently each one works.

---

## The cast

### The Conductor — *not an AI*
Plain code. It holds the running order, decides which two candidates face off next, and files away every result. It makes **no judgments about people** — it only does bookkeeping.
- **Sees:** the whole field, but only as a list of IDs and scores.
- **Decides:** who's next, what the current order is.
- **Why it's code, not AI:** it has to be perfectly reliable and repeatable. A computer can't get tired, can't drift, can't invent a ranking. The math stays trustworthy; the AI is reserved for the part that actually needs judgment.

### The Comparison Agents — *the judges* (many, brief)
The workhorses. Thousands of them across a run. Each one wakes up, sees exactly **two candidate packages** (resume + motivation letter) and the rubric, answers **one question** — *"who fits better, and why?"* — with a confidence level and written reasons, then disappears.
- **Sees:** two people. Never the whole field, never the last match.
- **Decides:** a single head-to-head winner.
- **How it works differently:** it makes a **relative** judgment ("A or B?"), which is the kind of question AI answers reliably — far more so than "rate this person out of ten." It's **stateless**: a fresh one for every match means applicant #400 gets the same undistracted read as applicant #1.

### The Reviewer Agents — *the auditors* (few, at the end)
After the order settles, these check the top of the list. A reviewer doesn't compare two people — it takes **one top-ranked candidate alone**, re-examines them against the rubric, checks whether the ranking holds together, and raises a flag if someone was floated higher than they deserve.
- **Sees:** one candidate (plus the ranking's consistency).
- **Decides:** "does this placement hold up — yes, or flag for a human?"
- **How it works differently:** it makes an **absolute** judgment, not a relative one, and — this is the key — it is a **different agent from the one that made the original call.** That separation of powers is why it catches mistakes. A model checking its own work just repeats its own errors; a fresh reviewer doesn't.

---

## Side by side

| | Conductor | Comparison agent | Reviewer agent |
|---|---|---|---|
| **AI or code?** | Code | AI | AI |
| **How many?** | One, always running | Thousands, brief | A handful, at the end |
| **Sees** | The whole field (as data) | Two candidates | One candidate |
| **Its question** | "What's the order? Who's next?" | "A or B — who fits better?" | "Does this hold up?" |
| **Judgment type** | None (bookkeeping) | Relative | Absolute + scrutiny |
| **Memory** | The only memory in the system | None (fresh each time) | None (fresh each time) |

---

## Why splitting the work this way is the whole point

- **Each agent stays in its lane**, so each does its one job well. Nothing is asked to hold 500 resumes in its head at once — a task models do badly. The system is built entirely out of small questions models do *well*.
- **Judging and checking are separated.** The reviewer isn't the judge. That's how errors get caught instead of confirmed.
- **The reliable part is handled by reliable tooling.** Code holds the ranking; AI only supplies judgment. Neither does the other's job.
- **Everything is traceable.** Every comparison is a self-contained decision with a written reason, so any final ranking can be explained — not "the AI said so."

The pitch line: **it's trustworthy because the work is divided — every judgment is small, and nothing any agent decides goes unchecked.**

---

## Prompt — generate the agent showcase visual

Paste into any diagramming AI (or an LLM that outputs a diagram / slide):

```
Create a clean "cast of agents" diagram for a recruiting-screening AI system.
Audience: non-technical. Goal: show that the system is several small specialized
agents, each working DIFFERENTLY, not one big AI. Modern, flat, lots of whitespace.

Layout: a central conductor with three agent types around it.

CENTER — "The Conductor (plain code, not AI)"
  Icon: gear / sliders. Caption: "Holds the running order and decides who's next.
  Makes no judgments about people. Reliable and repeatable by design."

LEFT — "Comparison Agents — the judges" (draw 3 small identical figures to show there are many)
  Icon: balance scale. Caption: "Each sees just TWO candidates (resume + motivation
  letter) and answers one question: 'Who fits better, and why?' Fresh every time —
  no memory, no fatigue. Thousands per run."

RIGHT — "Reviewer Agents — the auditors" (draw 1-2 figures to show there are few)
  Icon: magnifying glass / checkmark. Caption: "After the ranking settles, each checks
  ONE top candidate against the rubric and flags anyone ranked too high. A different
  agent from the one that judged — so mistakes get caught, not confirmed."

Show arrows: Conductor sends pairs to the Comparison Agents and receives winners back;
once sorted, Conductor sends the top to the Reviewer Agents and receives flags back.

Add a comparison strip along the bottom with three mini-columns:
  Conductor: sees the whole field · question "who's next?" · no judgment
  Comparison: sees two · question "A or B?" · relative judgment · stateless
  Reviewer:  sees one · question "does this hold up?" · absolute judgment · independent

Caption at the bottom: "Trustworthy because the work is divided — every judgment is
small, and nothing any agent decides goes unchecked."
Use a robot icon for AI agents and a gear icon for the code conductor.
```
