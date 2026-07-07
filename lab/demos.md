# 25 AI Workflow Demos for a 180DC Branch

Each card is a demo Manuel could show to a real person, not a "use ChatGPT better" tip. Fields are identical across all 25 so they can be compared and ranked (see [ranking.md](ranking.md)).

Categories covered: client acquisition (1–3), recruitment (4–6), consultant training (7–10), project management (11–13), team lead support (14–15), deliverable quality (16–18), engagement (19–21), partnerships & career fairs (22–23), workshop materials (24), knowledge base (25).

---

## 1. Lead Scout

- **Problem solved:** The branch pitches to whoever answers email instead of the non-profits that most need strategy help. Client acquisition is reactive and low-yield.
- **User:** Client acquisition / external relations lead.
- **Workflow:** Feed a list of local non-profits (registry export, council directories, grant databases). An agent researches each org's site, annual report and recent news, scores "strategy-shaped pain" (funding shift, leadership change, expansion, merger), and drafts a one-paragraph tailored hook per org citing the specific trigger it found.
- **First demo:** Pick 10 real local non-profits live in the room; show the ranked list with a verbatim-quoted trigger for each ("their 2025 annual report says core grant ends in 2026").
- **Tools needed:** Claude with web search, a spreadsheet in/out script; optionally the repo's renderer pattern for a clean output page.
- **Data needed:** Public: charity registry export, org websites, annual reports. Nothing internal.
- **Output looks like:** A ranked table — org, trigger quote, source link, suggested engagement type, draft hook sentence — plus a "do not contact" list with reasons.
- **Why consultants would care:** Projects sourced this way are real strategy problems, not made-up scope. Better projects, better CV lines.
- **Why leadership would care:** Pipeline stops depending on one person's network; the pitch hit-rate becomes measurable.
- **Risks:** Hallucinated triggers (mitigate: quote-or-abstain, every trigger needs a source link); outreach feeling automated if the hook is sent unedited.
- **How to test it:** Run on last semester's 10 successful and 10 failed pitches; check the tool ranks the orgs that actually converted higher.
- **Workshop teaching:** Each attendee brings one org; the room builds the scoring rubric together, then runs the agent and fact-checks its triggers against the source.

## 2. Discovery-to-Proposal Copilot

- **Problem solved:** The gap between a promising first client call and a signed scope is where engagements die or get scoped badly (root cause of later scope creep and weak deliverables).
- **User:** Engagement/pitch lead running discovery calls.
- **Workflow:** Record or take structured notes on the discovery call. The copilot extracts the client's stated problem, reframes it as 2–3 candidate problem statements, flags what was *not* asked (budget, decision-maker, success metric, data access), generates the follow-up question list, then drafts a scoped proposal skeleton (objectives, workstreams, out-of-scope list, timeline) for human editing.
- **First demo:** Play a 5-minute mock discovery call recording; live-produce the "questions you forgot to ask" list and the proposal skeleton.
- **Tools needed:** Claude; transcription (phone voice memo + Whisper or meeting-tool transcript); proposal template.
- **Data needed:** One call transcript or notes; the branch's proposal template and 2–3 past signed proposals as style anchors.
- **Output looks like:** One page: problem statement options, unknowns checklist with severity, out-of-scope candidates, draft SOW skeleton with `[CONFIRM]` markers on every assumption.
- **Why consultants would care:** They inherit projects with a real problem statement and data access already negotiated, instead of discovering in week 4 that the client wanted something else.
- **Why leadership would care:** Scoping quality is the single biggest predictor of engagement success; this makes junior members able to scope like seniors.
- **Risks:** Client consent for recording (mitigate: notes-mode works too); over-trusting the draft SOW (mitigate: `[CONFIRM]` markers, human sends nothing unedited).
- **How to test it:** Back-test on transcripts/notes of past engagements; check whether the unknowns it flags match what actually blew up later.
- **Workshop teaching:** Pair exercise — one plays a rambling client, one takes notes, the copilot processes both; compare what the human missed vs the machine.

## 3. Case Study Forge

- **Problem solved:** Finished engagements vanish into archives; the branch has no compounding portfolio for pitching clients, sponsors, or recruits.
- **User:** Marketing/external relations; indirectly every future pitch.
- **Workflow:** Feed a final deliverable plus the engagement letter. The agent produces an anonymized case study (situation, approach, impact) in three lengths (LinkedIn post, one-pager, portfolio page), flags every sentence that could identify the client for human sign-off, and outputs to the repo's static renderer.
- **First demo:** Take one real finished deck and produce the three artefacts in front of the audience, including the "identification risk" flag list.
- **Tools needed:** Claude; the existing renderer pattern from the Quality Reviewer; a consent checklist.
- **Data needed:** Final deliverables, engagement letters, client consent status.
- **Output looks like:** A portfolio page per project with anonymized context, method, and quantified outcome; a redaction report listing what was removed and why.
- **Why consultants would care:** Their work becomes visible and shareable ("here's the published case study of my project") — direct CV and LinkedIn value.
- **Why leadership would care:** A living portfolio raises pitch conversion and sponsor credibility; anonymization discipline reduces confidentiality risk vs the current ad-hoc bragging.
- **Risks:** De-anonymization by combination of details (mitigate: adversarial "can you guess the client?" pass); overstating impact (mitigate: impact claims need a source in the deliverable).
- **How to test it:** Give the output to someone outside the project and ask them to identify the client; ask the client to approve one.
- **Workshop teaching:** Everyone forges a case study from their own past project, then the room plays "guess the client" against each other's outputs.

## 4. Case Interview Gym

- **Problem solved:** Applicants and new consultants have no way to practice case thinking; interviews measure prior exposure to case prep, not potential — which skews recruitment toward people who already had access.
- **User:** Applicants pre-interview; new consultants in training.
- **Workflow:** An AI interviewer runs a 20-minute mini-case tuned to 180DC-style problems (non-profit growth, funding strategy). It gives the prompt, drip-feeds data on request, pushes back on unstructured answers, and produces a structured debrief: framework quality, hypothesis discipline, quant comfort, communication — each with a verbatim moment from the session as evidence.
- **First demo:** A volunteer does a live 10-minute case with the AI on speaker/screen; the audience watches the debrief generate with quoted moments.
- **Tools needed:** Claude (voice mode or chat); a case library (3–5 branch-written cases); debrief schema.
- **Data needed:** Case materials with facts-to-release; the branch's interview rubric.
- **Output looks like:** A session transcript plus a one-page debrief: 4 dimensions scored with a quoted moment each, 2 drills to do next, no overall pass/fail.
- **Why consultants would care:** Unlimited realistic practice before real interviews and real client meetings; the debrief tells them exactly what to drill.
- **Why leadership would care:** Levels the recruitment playing field, raises the floor of interview performance, and doubles as pre-onboarding training at zero marginal cost.
- **Risks:** People treating the AI's score as a verdict (mitigate: no pass/fail, drills only — rank-don't-reject spirit); case leakage (rotate cases).
- **How to test it:** Have 3 experienced members take the same session; check their debriefs rank them the way senior members would rank them.
- **Workshop teaching:** Speed-dating format — everyone does a 10-minute AI case simultaneously, then pairs swap debriefs and discuss whether the quoted evidence is fair.

## 5. Recruitment Funnel Analyzer

- **Problem solved:** The branch doesn't know where it loses good applicants — messaging, form length, interview scheduling — so each semester repeats the same funnel.
- **User:** HR/recruitment lead.
- **Workflow:** Feed anonymized funnel data (applications per channel, drop-off per stage, offer acceptance) plus the actual outreach copy per channel. The agent identifies the biggest leak, correlates copy variants with conversion, and drafts 3 alternative messages per weak segment with an explicit hypothesis each ("hypothesis: engineering students bounce because the form reads business-only").
- **First demo:** Run on one real semester's funnel numbers; show the leak diagnosis and the three rewrites with hypotheses.
- **Tools needed:** Claude; a spreadsheet; the past semester's posts/emails.
- **Data needed:** Stage counts per channel (anonymized, no names needed), the message copy used.
- **Output looks like:** A one-page funnel diagram with the leak highlighted, ranked fix hypotheses, and A/B-ready message drafts.
- **Why consultants would care:** Indirectly — better intake means stronger teammates.
- **Why leadership would care:** Recruitment is the branch's lifeblood and currently unmeasured; this turns it into an experiment loop.
- **Risks:** Small-n false confidence (mitigate: agent must state sample sizes and refuse conclusions under n=30); privacy (aggregate counts only).
- **How to test it:** Run the suggested A/B on one channel next cycle and compare conversion against the untouched channel.
- **Workshop teaching:** Give teams the same funnel data; each proposes a leak hypothesis, then compare with the agent's — teaches both funnel thinking and hypothesis discipline.

## 6. Onboarding Concierge

- **Problem solved:** New members join, get a folder link and a kickoff meeting, then drift — "people joining but not getting much value" starts in week 1.
- **User:** New consultants in their first month; HR lead as operator.
- **Workflow:** New member fills a 5-minute intake (background, goals, hours, interests). The concierge generates a personal 4-week ramp plan pulling from the branch's actual materials (which docs to read, which tool demo to try, which person to meet and why), and sends a weekly check-in that adapts the plan based on what they actually did.
- **First demo:** Fill the intake live as a fictional "2nd-year economics student who wants data skills"; show the personalized plan referencing real branch docs and people.
- **Tools needed:** Claude; a form; the branch knowledge base (even just the current docs folder); optional email/Slack automation.
- **Data needed:** Branch onboarding materials, project list, member directory with roles (with consent).
- **Output looks like:** A personal one-page ramp plan with links, one named buddy suggestion with the reason, and week-by-week goals; a weekly nudge message.
- **Why consultants would care:** They get a path instead of a folder dump; first month feels designed.
- **Why leadership would care:** Early-drift attrition is the most expensive kind — you paid the full recruitment cost for zero output.
- **Risks:** Plans referencing stale docs (mitigate: link-check pass); feeling surveilled by check-ins (opt-in, member-controlled).
- **How to test it:** Onboard half the new cohort with it, half without; compare 6-week activity and self-reported clarity.
- **Workshop teaching:** New members build their own plan in-session and critique the concierge's suggestions — meta-onboarding.

## 7. Consulting Dojo

- **Problem solved:** Consultants only get feedback on live client work, where mistakes are expensive; there is no safe deliberate-practice environment.
- **User:** Any consultant, especially first-project members.
- **Workflow:** A drill engine holds a library of flawed slides/paragraphs (synthesized from real, anonymized reviewer findings). It shows one, asks the consultant to diagnose the flaw and attempt a fix, then reveals the principle and an expert fix — the same "attempt before answer" lock the Quality Reviewer uses. Difficulty adapts to hit ~70% success.
- **First demo:** Put one flawed slide on screen, let the audience diagnose, then show the dojo's reveal: the principle, the expert fix, and where this exact flaw appeared (anonymized) in branch history.
- **Tools needed:** Claude; a drill bank generated from Quality Reviewer findings; simple web UI or even chat.
- **Data needed:** Anonymized findings from past reviews (already produced by the shipped reviewer).
- **Output looks like:** A drill session: flawed artefact → your diagnosis → your fix → principle card → expert fix → next drill. A streak/level indicator per skill dimension.
- **Why consultants would care:** Ten minutes a day makes them measurably better before the client sees anything; it's the only place to fail safely.
- **Why leadership would care:** Training scales without senior time; the drill bank compounds automatically from every review the branch runs.
- **Risks:** Drills feeling artificial (mitigate: all drills derive from real branch findings); gamification crowding out depth (cap streak mechanics).
- **How to test it:** Pre/post: run the same flawed-slide diagnostic on members before and after two weeks of dojo use.
- **Workshop teaching:** The dojo *is* the workshop — run a live tournament round, then show attendees how each drill was generated from a real review finding.

## 8. Storyline Trainer

- **Problem solved:** Decks are built slide-first instead of argument-first; the pyramid principle is taught once in a lecture and never practiced.
- **User:** Consultants at the storyboard stage of any deliverable.
- **Workflow:** The consultant pastes their findings/evidence list. The trainer forces the sequence: governing thought first (it refuses to proceed without one), then key-line arguments, then checks each finding supports exactly one branch. It critiques with named tests ("vertical logic: does slide 4's title answer 'why?' from slide 3?") and never writes the storyline itself.
- **First demo:** Take a real (anonymized) branch deck's slide titles, paste them in, and watch the trainer reconstruct — and expose — the missing governing thought.
- **Tools needed:** Claude with a strict tutoring prompt; nothing else.
- **Data needed:** The consultant's own findings; optionally past branch decks as counter-examples.
- **Output looks like:** A dialogue transcript ending in the consultant's own one-page storyline: governing thought, 3 key lines, evidence mapped, orphan findings flagged.
- **Why consultants would care:** Storylining is the highest-leverage consulting skill and the hardest to self-teach; this gives Socratic reps on their real project.
- **Why leadership would care:** Directly upstream of deliverable quality — a good storyline makes the Quality Reviewer's job easy.
- **Risks:** Consultants pasting client-confidential data into ad-hoc chats (mitigate: sanctioned tool + anonymization habit taught in workshop); trainer drifting into ghostwriting (hard rule in prompt, spot-audited).
- **How to test it:** Give two matched teams the same evidence pack; one uses the trainer. Blind-compare storyline quality with the reviewer rubric.
- **Workshop teaching:** Everyone brings 5 findings from any past project; 30 minutes with the trainer; volunteers present before/after storylines.

## 9. Client Meeting Simulator

- **Problem solved:** Consultants' first hard client conversation (skeptical ED, scope-creep request, data they can't get) happens live, with a real client, unrehearsed.
- **User:** Any consultant or TL before a client touchpoint; training cohorts.
- **Workflow:** Pick a scenario (mid-project update to a skeptical director; pushing back on scope creep; presenting bad news). The AI plays the client with a persona brief and hidden objectives. Afterward it produces a debrief: what the client was actually probing for, quoted moments where the consultant lost or won ground, and one technique to drill.
- **First demo:** A volunteer defends a project delay to the AI playing an impatient executive director — live, on speaker. The room hears the pushback; then the debrief appears with quoted moments.
- **Tools needed:** Claude (voice ideal, chat works); scenario/persona pack; debrief schema.
- **Data needed:** None sensitive — scenarios are fictional but modeled on real branch situations collected from TLs.
- **Output looks like:** A transcript plus a debrief card: hidden objective reveal, 2 quoted turning points, 1 technique with a drill, self-rating prompt.
- **Why consultants would care:** Client-facing confidence is the scariest gap for students; rehearsal with real pushback is otherwise impossible to get.
- **Why leadership would care:** Client experience improves immediately; bad meetings are how engagements and references die.
- **Risks:** AI client too easy or too cartoonish (mitigate: persona briefs written from real TL war stories, hidden-objective design); over-scripting people (debrief pushes technique, not lines).
- **How to test it:** Have TLs who've faced the real scenario rate the simulation's realism; track self-reported confidence before real client meetings.
- **Workshop teaching:** Fishbowl: one volunteer, room watches, pause-button moments where the room votes on the next move before the volunteer answers.

## 10. Findings-to-Curriculum Miner

- **Problem solved:** The same mistakes recur across teams and semesters because review findings die inside each project; training content is generic instead of branch-specific.
- **User:** Training lead / AI team.
- **Workflow:** Aggregate all Quality Reviewer findings across projects. The miner clusters them into recurring failure patterns, ranks by frequency × severity, and drafts a micro-lesson per pattern (principle, real anonymized example, exercise) — feeding both the Dojo (#7) and workshop content.
- **First demo:** Run on the pilot's review findings plus synthetic ones; show the cluster map ("41% of findings are unsupported quantitative claims") and one auto-drafted micro-lesson.
- **Tools needed:** Claude; the reviewer's JSON outputs (deterministic contract makes this trivial); clustering prompt.
- **Data needed:** Accumulated review JSONs, anonymized.
- **Output looks like:** A "state of quality" report: top 5 failure patterns with frequency, trend vs last semester, one micro-lesson per pattern ready to teach.
- **Why consultants would care:** Training targets what people here actually get wrong, not generic slide tips.
- **Why leadership would care:** It's a quality dashboard for the whole branch and proof the reviewer investment compounds; also a killer alumni/sponsor story.
- **Risks:** Small corpus early on (mitigate: report confidence bands, refuse patterns under 5 instances); findings traced back to teams (strict anonymization before aggregation).
- **How to test it:** Show the pattern ranking to 3 TLs blind — do they recognize the branch in it?
- **Workshop teaching:** Reveal the branch's own top-5 failure patterns as the workshop's spine; each pattern gets 10 minutes of principle + drill.

## 11. Engagement Health Monitor

- **Problem solved:** Leadership discovers a struggling project team in week 8, when it's unfixable. Signals (missed check-ins, vague updates, silent members) were visible in week 3.
- **User:** VP Consulting / project portfolio owner; TLs as contributors.
- **Workflow:** TLs file a 3-minute weekly update (structured form: progress vs plan, blockers, team mood 1–5, client responsiveness). The monitor compares against the workplan, tracks trajectory across weeks, and produces a portfolio digest that flags at-risk projects with the evidence and a suggested intervention.
- **First demo:** Seed 4 fictional projects × 5 weeks of updates (one silently degrading); show the monitor catching the degradation at week 3 with the exact quoted signals.
- **Tools needed:** Claude; a form (Google Forms/Tally); weekly script.
- **Data needed:** Weekly TL updates; project workplans.
- **Output looks like:** A one-page Monday digest: green/amber/red per project, each amber/red backed by quoted update text and a trend arrow, one suggested action each.
- **Why consultants would care:** Struggling teams get help in week 3 instead of blame in week 10.
- **Why leadership would care:** Portfolio visibility without sitting in every meeting; intervention becomes early and cheap.
- **Risks:** TLs gaming updates once they know the flags (mitigate: frame as help-routing, not grading; no league table); alert fatigue (strict noise budget, max 2 flags per digest — same discipline as the reviewer).
- **How to test it:** Backfill last semester's known-failed project from memory/messages; check the monitor would have flagged it early.
- **Workshop teaching:** TLs write updates for a fictional troubled project; compare which humans vs the monitor caught the buried signal.

## 12. Scope Sentry

- **Problem solved:** Scope creep — the classic student-consulting failure mode — happens gradually and is only noticed after the team is committed.
- **User:** TLs; VP Consulting.
- **Workflow:** The signed SOW is registered at kickoff. Each week, the current workplan/minutes get diffed against it. The sentry lists every activity not traceable to the SOW, classifies it (client request / team gold-plating / drift), and drafts the polite scope-conversation script for the TL.
- **First demo:** Show a real (anonymized) SOW next to a week-6 workplan; the sentry highlights three untraceable workstreams and generates the client conversation script.
- **Tools needed:** Claude; document diffing prompt; the SOW template from #2.
- **Data needed:** SOW plus current workplan or meeting minutes.
- **Output looks like:** A traceability table (workplan item → SOW clause or ⚠︎), creep classification, and a ready-to-adapt "let's talk about scope" email/talking points.
- **Why consultants would care:** It gives them permission and language to say no — the hardest thing for a student facing a client.
- **Why leadership would care:** Scope creep is the top cause of burned-out teams and late, thin deliverables.
- **Risks:** Over-rigid reading of the SOW blocking sensible flexing (mitigate: classify, don't forbid — human decides); needing SOWs to exist (pairs with #2).
- **How to test it:** Run on 2 past projects known to have crept; check it catches the creep and doesn't flag legitimate agreed changes.
- **Workshop teaching:** Give teams a SOW and a creeping client email thread; they negotiate, then compare their response with the sentry's script.

## 13. Kickoff-in-a-Box

- **Problem solved:** Week 1–2 of every project is reinvented from scratch: workplan format, roles, interview guides, folder structure. Quality of setup depends entirely on the TL's prior exposure.
- **User:** TLs at project start.
- **Workflow:** Feed the signed proposal/SOW. The box generates the full kickoff kit: workplan with phases mapped to the SOW, RACI draft, risk register seeded with this project type's classic failures (from #10's patterns), client kickoff agenda, stakeholder interview guide, and folder skeleton — every item marked `[ADAPT]` where team judgment is required.
- **First demo:** Paste a one-page proposal; 90 seconds later show the complete kit, then zoom in on the risk register pre-seeded with "this is a market-entry study for a non-profit; here are the 3 ways those historically go wrong here."
- **Tools needed:** Claude; templates; SOW from #2; failure patterns from #10.
- **Data needed:** The proposal/SOW; branch templates; historical failure patterns.
- **Output looks like:** A kickoff pack (6 artefacts) in the branch's format, each with `[ADAPT]` markers and a 15-minute team review checklist.
- **Why consultants would care:** Week 1 becomes momentum instead of formatting; everyone knows their role by day 3.
- **Why leadership would care:** Baseline project hygiene stops depending on TL experience; every project starts at the standard of the best TL.
- **Risks:** Teams rubber-stamping without adapting (mitigate: `[ADAPT]` markers plus the review checklist as a mandatory team exercise); template staleness.
- **How to test it:** Give it last semester's proposals; have the actual TLs rate the generated kit against what they built by hand, and what they wish they'd had.
- **Workshop teaching:** TL training session: generate a kit live, then teams spend 20 minutes doing the `[ADAPT]` pass — the adaptation *is* the lesson in project setup.

## 14. TL Meeting Copilot

- **Problem solved:** Team leads are students managing peers for the first time; weekly meetings are status readouts instead of leadership, and "people disliking team leads" is mostly untrained TLs.
- **User:** Team leads, 15 minutes before each weekly meeting.
- **Workflow:** The TL pastes last meeting's notes and this week's status. The copilot drafts an agenda that leads with decisions (not status), flags each member who has been quiet/blocked with a suggested check-in question, proposes one coaching moment ("Sarah's analysis was strong — have her present it"), and after the meeting turns rough notes into actions with owners.
- **First demo:** Realistic messy meeting notes go in; out comes the agenda with the "Alex hasn't spoken in two meetings — here's how to bring him in" nudge. The room sees the difference between the status-meeting they run and this.
- **Tools needed:** Claude with a strong TL-coaching prompt; nothing else. Genuinely a same-day build.
- **Data needed:** Meeting notes and status updates (team-internal, no client data required).
- **Output looks like:** A pre-meeting card: 3-item decision-led agenda, per-member note, one coaching move, one risk to raise; post-meeting: action list with owners and dates.
- **Why consultants would care:** Meetings stop wasting their time; quiet members get pulled in instead of left behind — this is the direct fix for "disliking project teams."
- **Why leadership would care:** TL quality is the branch's biggest variance source and the top driver of retention; this raises the floor for every team at once.
- **Risks:** Members feeling managed-by-AI if the TL reads nudges verbatim (mitigate: copilot outputs intent, TL owns words — teach-don't-ghostwrite applied to leadership); notes containing personal remarks (retention off, team-internal only).
- **How to test it:** 3 TLs use it for 4 weeks; anonymous team pulse (#19) before/after on "meetings are useful" and "I feel heard."
- **Workshop teaching:** TLs bring real (sanitized) notes from their worst recent meeting; regenerate it with the copilot; discuss which nudges they'd actually use.

## 15. Feedback Phrasebook

- **Problem solved:** Peer feedback in student teams is either absent or blunt-to-hurtful; TLs avoid hard conversations until review season, when it's too late.
- **User:** TLs and any consultant giving feedback.
- **Workflow:** The user writes the unvarnished observation ("his slides are always late and sloppy"). The phrasebook extracts the behavior, impact, and ask; checks it against SBI (situation-behavior-impact) structure; returns 2 phrasings plus a delivery plan (when, where, opening line) — and refuses to proceed if the input is a character judgment with no observable behavior.
- **First demo:** Live-transform three real-feeling blunt observations into deliverable feedback; show the refusal case ("'she's just not smart enough' — I can't find a behavior here; what did you observe?").
- **Tools needed:** Claude with an SBI-coach prompt. Same-day build.
- **Data needed:** None stored; ephemeral input.
- **Output looks like:** A feedback card: behavior/impact/ask extraction, two phrasings (direct, gentle), delivery plan, and a "what they might say back" prep.
- **Why consultants would care:** Hard conversations are the #1 skill students avoid; this makes attempting them safe.
- **Why leadership would care:** Festering feedback is why teams sour; also directly develops the branch's leadership pipeline.
- **Risks:** Outsourcing courage — people sending AI words they don't mean (mitigate: output is prep, tool ends with "now say it in your own words"); sensitive inputs (no retention, no logging).
- **How to test it:** Role-play sessions: recipients rate feedback prepared with vs without the phrasebook on fairness and actionability, blind.
- **Workshop teaching:** Pairs write blunt observations about a fictional teammate, run them through, then deliver the feedback live to their partner who scores it.

## 16. Chart Doctor

- **Problem solved:** Charts are the weakest part of branch decks — mismatched titles, wrong chart types, unreadable labels, occasional integrity issues (truncated axes) — and the general reviewer only catches some of this.
- **User:** Consultants before submitting any deck with exhibits.
- **Workflow:** Feed the deck; every exhibit gets extracted and examined by a vision pass: does the chart show what the title claims (message-title match), is the chart type right for the comparison, is the axis honest, can it be read from 3 meters? Findings follow quote-or-abstain (the "quote" is a crop of the offending chart region).
- **First demo:** A slide with a subtly dishonest truncated-axis bar chart; the doctor flags it, shows the crop, names the principle, and shows what an honest version would emphasize instead.
- **Tools needed:** Claude vision; the existing pptx extraction from Deck Transform; the reviewer's finding schema.
- **Data needed:** The deck itself; a small library of chart principles (Zelazny-style "match chart to comparison").
- **Output looks like:** Per-exhibit findings card: cropped image, issue, principle, severity — max 3 findings per deck (noise budget), rendered like the Quality Reviewer's output.
- **Why consultants would care:** Chart skills are never taught anywhere; each finding is a permanent lesson.
- **Why leadership would care:** Exhibits are what clients screenshot and share; a dishonest axis in front of a board is a reputation event.
- **Risks:** Vision-model false positives on unusual-but-valid charts (mitigate: verifier pass, human accepts/rejects each finding); cost per deck (batch exhibits).
- **How to test it:** Seed 10 decks with 15 known chart flaws plus clean decks; measure catch rate and false-positive rate — same eval-harness discipline as Reviewer V2.
- **Workshop teaching:** "Chart crimes" gallery: the room diagnoses each exhibit before the doctor's verdict is revealed; keeps score, human vs machine.

## 17. Evidence Auditor

- **Problem solved:** Claims travel from a Google search into a client recommendation with no citation trail; the branch can't answer "where did this number come from?" — the exact failure the pilot caught by luck.
- **User:** Consultants pre-submission; reviewers.
- **Workflow:** Extract every factual claim from the deliverable. For each: find the citation in the doc, check the citation actually supports the claim as stated (not a stronger version), and classify — supported / miscited / unsupported / internally contradictory. The contradiction check generalizes what the pilot's independent reviewer caught (the anchor figure stated two ways).
- **First demo:** Run on a deck seeded with one miscited stat and one internal contradiction; watch it produce the claims table with both caught, each with the two verbatim conflicting quotes side by side.
- **Tools needed:** Claude long-context; claim-extraction prompt; the reviewer's rendering.
- **Data needed:** The deliverable and its sources/appendix.
- **Output looks like:** A claims register: claim (verbatim) → source (verbatim) → verdict → severity. Internal contradictions get a red paired-quote box.
- **Why consultants would care:** "Where's this from?" is the question that kills you in a final presentation; this is armor.
- **Why leadership would care:** This is the branch's core promise — work a non-profit can take to its board. It automates the exact class of miss the pilot proved matters.
- **Risks:** Claim extraction missing implicit claims (mitigate: recall-tuned extraction, human skim of the register); pedantry on obviously-fine claims (severity tiers, noise budget).
- **How to test it:** The Reviewer V2 eval harness pattern: seeded-defect decks, measure catch rate on miscitations and contradictions specifically.
- **Workshop teaching:** Hand out a one-pager with 8 claims, 3 flawed; teams audit by hand, then the auditor's register is revealed — teaches citation hygiene viscerally.

## 18. Red-Team CEO

- **Problem solved:** Deliverables are polished for the team's own eyes; the first genuinely skeptical reader is the client's board. Nobody stress-tests the argument before it ships.
- **User:** Project teams in the final week; TLs before client presentations.
- **Workflow:** Feed the final deck. The AI takes the persona of the client's toughest stakeholder (configurable: skeptical CFO, overworked ED, board member who opposed the project) and generates the 10 hardest questions it would ask — each anchored to a verbatim quote from the deck ("Slide 7 says X — but slide 12 says Y; which is it?"). Team writes answers; a second pass grades which answers actually hold.
- **First demo:** Run live on a real (anonymized) branch deck. The room watches 10 brutal, specific, quote-anchored questions appear — typically 2–3 the team genuinely cannot answer. That silence is the demo.
- **Tools needed:** Claude long-context; persona pack; quote-or-abstain question schema. Near-same-day build.
- **Data needed:** The deliverable; one paragraph of client context (who's in the room).
- **Output looks like:** A "murder board" sheet: 10 questions ranked by danger, each with the deck quote that triggers it; after the team answers, a readiness verdict per question (holds / weak / exposed).
- **Why consultants would care:** Walking into the final presentation having already survived the worst questions is the best feeling in consulting.
- **Why leadership would care:** Final presentations are where the branch's reputation is made or lost; this is cheap insurance on every engagement. It's also the reviewer's perfect complement: the reviewer checks the document, this checks the argument.
- **Risks:** Demoralizing a team days before presenting (mitigate: run it in week n−2, frame as sparring, include "your strongest slides" section); questions a real client would never ask (persona grounded in the actual client context).
- **How to test it:** After real presentations, ask TLs which client questions the red team predicted — measure prediction hit rate.
- **Workshop teaching:** Teams bring any past deck; generate the murder board; teams have 15 minutes to prep answers, then defend live in front of the room.

## 19. Pulse Synthesizer

- **Problem solved:** Leadership finds out people are unhappy at exit interviews. Anonymous surveys exist but nobody synthesizes free-text answers, so they're skimmed and shelved.
- **User:** Branch president / HR lead; anonymously, everyone.
- **Workflow:** A monthly 3-question anonymous pulse (energy 1–5, "what's dragging?", "what's working?"). The synthesizer clusters free text into themes with representative verbatim quotes (quote-or-abstain applied to sentiment), tracks theme trajectory month over month, and drafts one suggested action plus one recognition shout-out sourced from the "what's working" answers.
- **First demo:** Feed 25 realistic synthetic pulse responses; show the theme map ("meeting overload: 8 mentions, rising"), the quoted evidence, and the drafted shout-out.
- **Tools needed:** Claude; an anonymous form; monthly script.
- **Data needed:** Pulse responses (anonymous by design, aggregate-only reporting).
- **Output looks like:** A one-page monthly read: 3 themes with trend arrows and quotes, 1 recommended action, 1 recognition draft, response-rate health.
- **Why consultants would care:** Their anonymous comment visibly becomes a theme leadership acts on — the loop closes.
- **Why leadership would care:** Attrition prediction and a monthly heartbeat for the "keeping consultants engaged" problem, at 3 questions of survey fatigue.
- **Risks:** De-anonymization in small teams (mitigate: report only at branch level, suppress themes under 4 mentions); synthesizer smoothing over minority-but-serious signals (dedicated "low-frequency, high-severity" section).
- **How to test it:** Run two months; check themes against what leadership independently believes, and whether any action got taken (the real success metric).
- **Workshop teaching:** Leadership workshop: hand-cluster the same responses first, compare with the synthesizer, discuss what each missed.

## 20. Skill Passport

- **Problem solved:** "I did 180DC" is an empty CV line; members can't articulate what they can actually do, and the branch can't see its own capability map.
- **User:** Individual consultants; VP Consulting for staffing.
- **Workflow:** Per member, aggregate evidence of demonstrated skills: reviewer findings resolved, dojo drills passed, deliverable contributions, roles held. The passport states each skill with its evidence ("built the cost model in project X; resolved 3 quant-integrity findings") and drafts CV bullets and interview stories from it — never inventing, only citing.
- **First demo:** Build one member's passport live from their real project trail; show the auto-drafted CV bullet next to its evidence chain.
- **Tools needed:** Claude; data from reviewer JSONs, dojo logs, project records.
- **Data needed:** Per-member activity records (consent-based, member owns and can hide anything).
- **Output looks like:** A one-page passport: skills with evidence citations, growth over time, 3 CV bullets, 2 interview stories (STAR format), suggested next stretch role.
- **Why consultants would care:** This converts branch work into job-market ammunition — the single strongest retention and recruitment pitch available.
- **Why leadership would care:** Staffing decisions get a capability map; recruitment gets "join and leave with this document" as a pitch.
- **Risks:** Feeling like surveillance/grading (mitigate: member-owned, opt-in, private by default); inflated claims (evidence-citation rule, no evidence → no claim).
- **How to test it:** Members rate their passport's accuracy; a recruiter friend rates the CV bullets against typical student CVs.
- **Workshop teaching:** CV clinic: everyone generates their passport, then pairs verify each other's evidence chains before anyone copies a bullet.

## 21. Team Matchmaker

- **Problem solved:** Project teams are assembled by availability and gut feel; mismatched teams are the root of "people disliking project teams."
- **User:** VP Consulting at staffing time.
- **Workflow:** Members submit preferences (project interest, growth goals, working style, availability); projects have requirement profiles. The matchmaker proposes 2–3 alternative full-portfolio staffings, each with explicit trade-off notes ("Option A maximizes preference match but puts two first-timers on the hardest project"), plus a per-team risk note. Human makes the call — rank, don't decide.
- **First demo:** 12 fictional members, 3 fictional projects; show two alternative staffings with visibly different trade-offs and the risk note that a human allocator would have missed.
- **Tools needed:** Claude; two forms; matching prompt with hard constraints.
- **Data needed:** Preference forms, project profiles, skill data (from #20 if it exists).
- **Output looks like:** Side-by-side staffing options with trade-off annotations, per-team composition risk notes, and a "who got their 3rd choice" fairness ledger.
- **Why consultants would care:** Preferences visibly enter the process; the fairness ledger means nobody silently gets last pick twice.
- **Why leadership would care:** Team composition is the highest-leverage retention decision made each semester, currently made in 30 minutes on vibes.
- **Risks:** Optimization mystique — treating an option as objective (mitigate: trade-offs stated in plain language, human choice mandatory); preference data sensitivity ("don't put me with X" handled out-of-band, never in the tool).
- **How to test it:** Shadow-run against last semester's manual staffing; compare predicted-risk teams with which teams actually struggled.
- **Workshop teaching:** Give exec the fictional dataset; they staff by hand, then see the options and the fairness ledger — a lesson in their own allocation biases.

## 22. Partner Radar

- **Problem solved:** Sponsorship and partnership outreach is generic ("we're a student consultancy, please sponsor us") and mostly ignored; career-fair prep is last-minute.
- **User:** External relations / partnerships lead.
- **Workflow:** Feed the target list (career-fair exhibitor list, local firms). For each, the radar researches what the firm actually recruits for and cares about, finds the specific overlap with the branch ("they hired 3 grads into strategy roles; our alumni X works there"), scores partnership fit, and drafts a one-paragraph opener plus a tailored one-page partnership case.
- **First demo:** Take a real upcoming career-fair exhibitor list; produce the ranked fit list live, with each opener citing something true and specific about the firm.
- **Tools needed:** Claude with web search; exhibitor list; alumni list (consent).
- **Data needed:** Public firm info; branch facts sheet (member count, projects delivered, alumni placements).
- **Output looks like:** A ranked partner table: fit score, the specific hook with source, draft opener, suggested ask tier (coffee chat / workshop / sponsorship).
- **Why consultants would care:** Partnerships become career pipelines — the firms show up at branch events and know the branch by name.
- **Why leadership would care:** Sponsorship revenue and employer-brand partnerships are how the branch funds itself; hit rate on cold outreach is the constraint.
- **Risks:** Hallucinated firm facts torching credibility (mitigate: every hook needs a source link, human verifies before send); alumni name-dropping without consent (explicit opt-in list only).
- **How to test it:** Send 10 radar-tailored vs 10 standard openers; compare reply rate.
- **Workshop teaching:** Before the next fair, the partnerships team runs the radar together; each member takes 3 firms, verifies the hooks, and owns those conversations at the fair.

## 23. Fair Follow-Up Engine

- **Problem solved:** Career-fair and event conversations die in pockets — notes on phones, business cards in bags, follow-ups sent late and generic or never.
- **User:** Anyone who worked a booth or attended a fair; partnerships lead as owner.
- **Workflow:** Right after the event, each member voice-dumps their conversations ("talked to Anna from FirmX, they might host a case workshop, she asked about our non-profit projects"). The engine transcribes, structures into contact records, drafts a personalized follow-up per contact referencing the actual conversation, and builds the pipeline board with next actions and owners.
- **First demo:** Record a 60-second messy voice memo live; show it become a structured contact record plus a ready-to-edit follow-up email that references the workshop idea by name.
- **Tools needed:** Whisper/voice transcription; Claude; a shared sheet or the branch's task board.
- **Data needed:** Voice memos/notes; branch facts sheet for the drafts.
- **Output looks like:** A pipeline table (contact, org, interest, next step, owner, deadline) plus a drafted follow-up per contact with `[PERSONAL TOUCH]` markers where the human must add something.
- **Why consultants would care:** Their fair conversations turn into real relationships and events they get credit for, with 2 minutes of voice memo instead of an evening of admin.
- **Why leadership would care:** The fair investment (fees, hours) finally converts; institutional memory of contacts survives member turnover.
- **Risks:** Contact data protection (store minimal fields, branch-controlled sheet, GDPR-aware retention); follow-ups sent unedited feeling robotic (`[PERSONAL TOUCH]` markers are blocking).
- **How to test it:** At the next event, half the team uses it; compare follow-up send rate and reply rate against the other half.
- **Workshop teaching:** Simulated fair: attendees roleplay 3 booth conversations, voice-dump, run the engine, and send one real follow-up before leaving the room.

## 24. Workshop Forge

- **Problem solved:** Every AI/consulting workshop is built from scratch by whoever runs it; quality varies wildly and materials die with the presenter — the "AI workshop curriculum" idea's scaling problem.
- **User:** AI team / training leads; any member asked to run a session.
- **Workflow:** Feed any tool, prompt pattern, or skill ("teach the Evidence Auditor" / "teach storylining"). The forge outputs a complete 60-minute workshop: learning objective, hook demo script, 2 hands-on exercises with datasets, common-stumble notes for the facilitator, a slide skeleton, and a 5-question exit check. All exercises follow attempt-before-answer.
- **First demo:** Meta-demo: forge a workshop for the Red-Team CEO tool live, then actually run its first exercise on the audience. The forge demos itself.
- **Tools needed:** Claude; the branch's workshop template; exercise-dataset generator.
- **Data needed:** The tool/skill being taught; past workshop feedback if it exists.
- **Output looks like:** A facilitator pack: timing table, script beats, exercise handouts, datasets, stumble guide, exit quiz — rendered as one printable page-set.
- **Why consultants would care:** Anyone can confidently run a session, which is itself a career skill; workshops stop being lectures.
- **Why leadership would care:** Training capacity stops being bottlenecked on 2 people; every new tool ships with its own teaching material — the lab becomes self-propagating.
- **Risks:** Generic-feeling exercises (mitigate: exercises must use branch-real artefacts and failure patterns from #10); facilitators reading scripts robotically (stumble guide trains judgment, not lines).
- **How to test it:** Two workshops on the same topic — one forged, one hand-built; compare exit-quiz scores and session ratings.
- **Workshop teaching:** Recursive: the workshop about the forge has attendees each forge a mini-workshop and run its hook on a neighbor.

## 25. Branch Brain

- **Problem solved:** Every semester the branch forgets itself: past deliverables, decisions, templates, and "have we worked with a food bank before?" live in folder archaeology and departed members' heads.
- **User:** Everyone; heaviest use by new TLs and pitch leads.
- **Workflow:** Index the branch's document corpus (past deliverables, proposals, handover docs, exec decisions) into a retrieval system. Members ask questions in natural language; the brain answers with verbatim-quoted passages and document links — quote-or-abstain as a hard rule, "I don't have that" instead of guessing. Write path: at project close, a structured handover interview feeds the index.
- **First demo:** Ask three real questions live: "have we done a pricing project before?", "what did we promise in the FoodBank proposal?", "why did we stop doing X?" — each answered with the quoted source or an honest "nothing in the corpus."
- **Tools needed:** Claude with file/RAG search (Projects, or a simple embeddings index); document store; access controls.
- **Data needed:** The document archive, cleaned of client-confidential material or access-tiered; handover interviews going forward.
- **Output looks like:** A chat answer with quoted passages, document links, and a confidence note; a monthly "unanswerable questions" report showing where the corpus has holes.
- **Why consultants would care:** Ten minutes of search becomes ten seconds; new members stop feeling stupid for not knowing tribal history.
- **Why leadership would care:** Institutional memory is the deepest structural problem of a student org with 100% turnover every 3 years — this is the fix, and every other tool here gets smarter sitting on top of it.
- **Risks:** Confidential client data leaking across teams (access tiers, ingestion review); stale answers presented confidently (documents carry dates, answers must state them); index rot (handover interview is the maintenance ritual, owned by a role not a person).
- **How to test it:** A 20-question benchmark written by senior members (with known answers); measure answered-correctly / correctly-abstained / hallucinated. Hallucinated must be zero.
- **Workshop teaching:** Scavenger hunt: teams race to answer branch-history questions with and without the brain; then each team ingests one document and watches an unanswerable question become answerable.
