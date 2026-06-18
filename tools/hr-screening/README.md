# 180DC Recruiting — AI Screening Assistant

A tool that helps the recruiting team get through the **first screening stage** faster, without losing the judgment that makes 180DC's process good. It ranks applicants so the team spends its time on the people who matter — and it never rejects anyone on its own.

This folder holds the design. It was hardened with research into how top consulting firms screen, how AI judges can be made reliable, what the law requires, how to write a fair rubric, and how to keep humans in control. See [research-synthesis.md](research-synthesis.md) for the evidence and [pipeline-spec.md](pipeline-spec.md) for the build.

---

## The one-sentence version

It reads every application, removes names so bias can't creep in, drops the few that don't belong (wrong stage, broken resume link), then ranks the rest by comparing them head-to-head against a rubric you control — and hands the team a sorted shortlist with the reasons attached, for humans to make the real call.

## Why this is worth building

A cycle is ~500 applicants across two tracks (Team Lead and Consultant). Reading and roughly ordering 500 resumes by hand takes days, and the quality drifts — resume #400 gets a tired reviewer, not a fresh one. The team ends up screening out the same obvious "not this round" applications it would have anyway, just slowly.

This tool does that tiring, repetitive ordering work in a few hours and gives every applicant the same fresh attention. The team's hours then go where their judgment actually adds value: the borderline cases and the interviews. **It saves time on the part that doesn't need critical thinking, and protects the part that does.**

The core design choice is that it **ranks, it does not reject**. The tool proposes an order. A human always draws the line. That keeps it trustworthy, keeps it legal, and keeps the team in charge.

---

## How it works — each step and why it matters

**1. Read the applications**
Pulls the Google Form CSV, opens each resume link, and pairs it with the applicant's **motivation letter** into one package it can work with. Broken or unreadable links are set aside for a person to chase — never silently dropped.
*The letter matters more than it looks: a CV shows what someone did, but their genuine reason for 180DC — the mission-fit signal the team cares most about — only really shows up in the letter.*
*Role: get every applicant into the system. Why it matters: a silent skip is an applicant who never got a fair look. Nothing disappears quietly.*

**2. Blind the resume**
Strips names, contact details, graduation year, and other signals that hint at someone's background, before any AI looks at it. The identity is kept in a separate table and rejoined only at the very end.
*Role: judge the work, not the person. Why it matters: AI screening tools have a documented history of bias (the Amazon recruiting tool is the textbook case). Blinding is the first and cheapest defence.*

**3. Gate — clear the floor**
A quick, deliberately gentle check that removes only the genuine non-starters: not a student, resume link doesn't work, application left half-empty. That's it — three checks, nothing about GPA, school, or major.
*Role: shrink ~500 down to a real shortlist so the expensive ranking isn't wasted on applications that were never eligible. Why it matters: this is the one place a mistake is permanent, so it's set to be forgiving — when unsure, it lets the applicant through.*

**4. Rank by head-to-head comparison**
Instead of scoring each resume cold (which drifts and is noisy), it compares applicants two at a time — "between these two, who fits the rubric better, and why?" A sorting process turns thousands of these small, reliable judgments into one clean ranked list. Each comparison is a fresh, independent read, and every match is run **both ways** (A-vs-B and B-vs-A) so the order they're shown in can't tip the result.
*Role: produce a trustworthy ranking. Why it matters: people are far more reliable at "is A better than B?" than "rate A out of 10" — and so are AI judges. This is the heart of the system.*

**5. Double-check the top**
Once the list settles, fresh reviewers re-examine the top candidates against the same rubric and **flag anyone who landed higher than they should have** — someone a lucky match floated up, or a strong analyst applying for Team Lead with no actual leadership evidence.
*Role: catch the ranking's own mistakes. Why it matters: it's the self-correction layer. The number of candidates double-checked is adjustable (default top 10).*

**6. Hand over a shortlist, in three buckets**
The team gets **Advance / Borderline / Below the line** — not one long list. Each applicant comes with the rubric points they hit and the one-line reason they won or lost their deciding match. The Borderline band is built wide on purpose: that's where human judgment decides.
*Role: make the output something a person can trust and act on in an afternoon. Why it matters: a number with no reason behind it invites rubber-stamping; evidence invites real review.*

---

## What it deliberately does **not** do

- **It never rejects anyone.** It ranks and flags; a human draws every line and sends every "no."
- **It doesn't touch the case interview** or any later stage that needs real critical thinking.
- **It doesn't filter on prestige** — not school name, not major, not GPA, not years of experience. 180DC recruits across all backgrounds, and the rubric is built to honour that.
- **It doesn't run on autopilot.** The rubric, the thresholds, and how many to advance are all set by the team each cycle, and locked before the run so the process stays consistent and defensible.

---

## What you control each cycle

- **The rubric** — the criteria and weights the comparison uses. Separate ones for Team Lead and Consultant. See [rubrics/consultant.md](rubrics/consultant.md) and [rubrics/team-lead.md](rubrics/team-lead.md).
- **The gate** — how forgiving the floor is (default: let ~80% through).
- **How many to advance**, and how wide the Borderline review band is.
- **How many of the top to double-check.**

Set it, run it, review the shortlist. The tool does the hours of sorting; you keep the judgment.
