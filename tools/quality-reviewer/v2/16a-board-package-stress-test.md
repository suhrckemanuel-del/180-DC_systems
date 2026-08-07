# 16a. Board package stress test

<!-- check-docs: historical -->

**This is a dated audit, run 2026-07-22 against the repo as it stood that day. It is a record,
not a status report, and its verdicts are not re-checked as the repo moves.** Read it to see
what was true then and what the package overclaimed. For current state read
[STATUS.md](STATUS.md).

**Note added 2026-08-07.** Most of the "not done" rows this audit VERIFIED have since been
done, and section 0 of [16-board-package.md](16-board-package.md) now carries the corrections.
Two of this audit's findings were never acted on until 2026-08-07 and are now folded into 16:
the section D overclaims in C2 and C3, and the missing stop condition for a miss on real work
in section B. One thing this audit could not have caught, because nobody suspected it: it
traced every claim to the file that substantiates it, and took the scoring instrument behind
those files as sound. It was not
([21-scorer-refit-sprint.md](21-scorer-refit-sprint.md)). A citation audit cannot find a
measurement error, which is worth knowing before the next one is commissioned.

An adversarial verification of [16-board-package.md](16-board-package.md) against the actual
repo state, not against its own text. Every substantive claim was traced to the file that
would substantiate it. The package is unusually honest for a document of its kind. It is also
not yet board-ready, for reasons that are concentrated in three places.

Voice rules apply. No Oxford commas. No em or en dashes.

---

## A. Claim-by-claim verification

Verdicts: VERIFIED (a file substantiates it), OVERSTATED (true in part, stronger than the
file), UNSUPPORTED (no file substantiates it), CONTRADICTED (a file says otherwise).

### A1. Section A, the ask

| # | Claim in 16 | Checked against | Verdict | Note |
|---|---|---|---|---|
| 1 | 14 real cases already built | [eval-cases-real/](eval-cases-real/) | VERIFIED | real-01 to real-14 present on disk. |
| 2 | Estimated 40 to 55 person-hours | 16 section F table | CONTRADICTED | The table sums to 39 to 53, not 40 to 55. See fix 1. |
| 3 | Marginal money cost effectively zero, runs inside a Claude Project on an existing subscription | [11-decision-log.md](11-decision-log.md) 2026-07-01 | OVERSTATED | The decision log records the intent. No file confirms a Claude Project is deployed. Every live run on file was produced by fresh-context agents in the build harness ([eval-runs/README.md](eval-runs/README.md), [progress.md](progress.md) sessions 4 and 5). |
| 4 | The reviewer has never been run on a real deliverable | [eval-cases-real/README.md](eval-cases-real/README.md), [12-real-deck-intake.md](12-real-deck-intake.md) E2 gate 6 | VERIFIED | Both state it plainly. Baseline column is "not run" on all 14. |
| 5 | Today there is no honest number for whether the tool helps on real work | [effectiveness-review-2026-07-03.md](effectiveness-review-2026-07-03.md) section 4 | VERIFIED | "This is a smoke test, not a validation." |

### A2. Section B, what it is

| # | Claim in 16 | Checked against | Verdict | Note |
|---|---|---|---|---|
| 6 | Names top 3 to 5 quality risks with a verbatim quote each, one reusable habit | [00-product-definition.md](00-product-definition.md) sections 1 and 3 | VERIFIED | Section 3 items 1 to 5, section 5 "quote or abstain". |
| 7 | Never approves or certifies. A named project lead signs off and the sign-off is recorded | [00-product-definition.md](00-product-definition.md) section 4, [07-workflow.md](07-workflow.md) section C | VERIFIED | Workflow C step 3: "The sign-off is recorded". |
| 8 | Does not write slide content, the fix is a direction plus a principle | [03-output-contract.md](03-output-contract.md) section B, [07-workflow.md](07-workflow.md) D | VERIFIED | Contract: "never pasteable slide text". |
| 9 | Does not evaluate, rank or comment on individual members | [00-product-definition.md](00-product-definition.md) section 4 | VERIFIED | Also red team mode 9. |

### A3. Section C, why it matters

| # | Claim in 16 | Checked against | Verdict | Note |
|---|---|---|---|---|
| 10 | The blocking rules are built around unsupported recommendations, ungrounded headline numbers and answering the wrong question | [01-rubric-v1.md](01-rubric-v1.md) section B | VERIFIED | Rules 1 to 4 map exactly. |
| 11 | Every review separates delivery-critical from minor from a learning note, lead reads two minutes | [00-product-definition.md](00-product-definition.md) section 7 | VERIFIED | Section 7 is written in those words. |
| 12 | The coaching gate means the consultant must attempt the reflect question before the fix unlocks | [07-workflow.md](07-workflow.md) sections B and D, [03-output-contract.md](03-output-contract.md) section C, [13-usage-guide.md](13-usage-guide.md) section G | CONTRADICTED as a present-tense capability | The gate is specified, not built for v2. 13 states: "There is no v2 renderer. The coaching view, the lead view and the printable are specified in 03-output-contract.md and are not built." The gate ships only in the v1 renderer (`../index.html`), which reads the v1 five-criteria schema, not v2. See fix 4. |
| 13 | Project lead review capacity is the scarce good and it is uneven across projects | no file | UNSUPPORTED | Plausible and probably true, but nothing in the repo measures lead capacity or its variance. It is an assertion about the branch, not a repo claim. Label it as the author's judgment. |

### A4. Section D, what is done

| # | Claim in 16 | Checked against | Verdict | Note |
|---|---|---|---|---|
| 14 | 10-dimension rubric, 5 blocking rules, 4 readiness levels | [01-rubric-v1.md](01-rubric-v1.md) sections B and D | VERIFIED | Ten dimensions at lines 110 to 407, five blocking rules, four levels. |
| 15 | Output contract, structured JSON schema | [03-output-contract.md](03-output-contract.md) | VERIFIED | Full schema in section A. |
| 16 | System prompt, three modes | [04-prompt-templates.md](04-prompt-templates.md), [11-decision-log.md](11-decision-log.md) 2026-07-01 | VERIFIED | Short, deep, lead. |
| 17 | Eval harness with 7 metrics and an acceptance threshold | [05-eval-harness.md](05-eval-harness.md) sections B and E | VERIFIED | Seven metrics in B, six acceptance criteria in E. |
| 18 | Working validator, checks structure and verbatim quotes | `check-review-v2.js`, [03-output-contract.md](03-output-contract.md) section D | VERIFIED | Present, 10kB, seven documented checks. |
| 19 | Expert feedback pack, assembled and **ready to send** | [09-roadmap.md](09-roadmap.md) sections A phase 2 and D, [progress.md](progress.md) Next actions item 3 | OVERSTATED | "Assembled" is verified. "Ready to send" is not: roadmap D makes the source-verification backlog "a Phase 2 gate, not optional, because the pack goes to a practitioner who will check", and progress item 3 leaves S4 open. Also expert-pack/README requires each JSON to be rendered by hand first, since no renderer exists. See fix 5. |
| 20 | Red team: 15 failure modes with stop conditions | [08-red-team.md](08-red-team.md) | VERIFIED | Fifteen numbered modes, each with a stop condition, plus three cross-cutting. |
| 21 | Five synthetic cases with gold labels written before any AI review | [eval-cases/README.md](eval-cases/README.md), [11-decision-log.md](11-decision-log.md) 2026-07-01 | VERIFIED | Both state gold before review. Case 05 gold carries a dated adjudication note appended above the intact pre-registered gold. |
| 22 | All five have live blind runs **under the frozen prompt** | [eval-runs/README.md](eval-runs/README.md), [progress.md](progress.md) Green caveats | CONTRADICTED | There is no prompt version under which all five ran. Cases 01 to 04 ran under "revised", case 05 r2 under "revised + severity fix". The Green caveats say so directly. 16's own section E admits it, so 16 contradicts itself. See fix 2. |
| 23 | All five pass the validator including the verbatim-quote check | [progress.md](progress.md) sessions 2 and 3, [eval-runs/README.md](eval-runs/README.md) | VERIFIED | Validator column is pass on every run. |
| 24 | An independent fresh-context scorer scored the set against the acceptance threshold in harness section E | [eval-runs/scoring-2026-07-03.md](eval-runs/scoring-2026-07-03.md) | CONTRADICTED as cited | That sheet is the only independent scoring artifact against section E in the repo and its section 6 concludes "NOT GREEN", failing criteria 1 and 4. No independent scorer has ever scored the currently green five. See fix 3. |
| 25 | Readiness matched gold on all five, every must-catch found, restraint 3 on every case, safety clean, cited to `eval-runs/scoring-2026-07-03.md` | same file | CONTRADICTED as cited | The cited sheet records case 05 at readiness N, prioritization 1, restraint 1, precision 0.80, "fail". The green table exists only as prose in [progress.md](progress.md) session 3. The second re-score of case 05 r2 has no file in [eval-runs/](eval-runs/) at all. See fix 3. |
| 26 | 181 past deliverable candidates triaged into a sealed catalog | [progress.md](progress.md) session 5, [12-real-deck-intake.md](12-real-deck-intake.md) E2.2 | VERIFIED | 181 of 181, one repaired row noted. |
| 27 | 14 cases across quality bands and project stages, one case per client | [12-real-deck-intake.md](12-real-deck-intake.md) E2.3, [11-decision-log.md](11-decision-log.md) 2026-07-07 | VERIFIED | 4 strong, 5 middling, 5 weak, no client twice, numbering shuffled. |
| 28 | Case files written from local full text, extraction noise and draft artifacts kept on purpose | [12-real-deck-intake.md](12-real-deck-intake.md) section D and E2.4 | VERIFIED | Policy and gate both recorded. |
| 29 | Orchestrator-level anonymisation sweep over every case body, one fix applied and logged | [progress.md](progress.md) session 5, [12-real-deck-intake.md](12-real-deck-intake.md) E2.4 | VERIFIED but incomplete as reported | Both true. 16 omits the second documented exception, a generic org contact deliberately kept in one case. Sweep was grep-based by the same orchestrator that built the cases, with no second pair of eyes. See fix 6. |

### A5. Section E, what is not done

| # | Claim in 16 | Checked against | Verdict | Note |
|---|---|---|---|---|
| 30 | No gold labels for the 14 real cases, labeling not started | [eval-cases-real/README.md](eval-cases-real/README.md), [eval-cases-real/labeling/agreement-log.md](eval-cases-real/labeling/agreement-log.md) | VERIFIED | Agreement log is an empty table. |
| 31 | Zero runs on a real deck, blocked by design until adjudicated gold exists | [12-real-deck-intake.md](12-real-deck-intake.md) E2.6, section F | VERIFIED | |
| 32 | Expert session not held, no ex-consultant lined up | [09-roadmap.md](09-roadmap.md) phase 2 and open question 2 | VERIFIED | |
| 33 | Run-to-run stability unmeasured, one run per case per prompt version | [effectiveness-review-2026-07-03.md](effectiveness-review-2026-07-03.md) section 3, [progress.md](progress.md) Next actions 1 | VERIFIED | |
| 34 | Cases 01 to 04 not re-run, green rests on a static regression argument | [progress.md](progress.md) Green caveats | VERIFIED | Quoted almost exactly. This is the package at its best. |
| 35 | Inter-rater check on the synthetic gold required by rubric section F, does not exist | [01-rubric-v1.md](01-rubric-v1.md) section F, [effectiveness-review-2026-07-03.md](effectiveness-review-2026-07-03.md) section 4 | VERIFIED | Rubric F sets the two-scorer exit test. Nothing implements it. |
| 36 | Renderer for the v2 output not built, "Phase 5, only if it earns its place" | [09-roadmap.md](09-roadmap.md) phase 5, [03-output-contract.md](03-output-contract.md) section C, [13-usage-guide.md](13-usage-guide.md) section G | OVERSTATED downward, and the Phase 5 attribution is UNSUPPORTED | "Not built" is right. But roadmap phase 5 is a web app and a dashboard, not the renderer. The three contract views (student coaching view, lead view, printable) are core spec, [07-workflow.md](07-workflow.md) D asserts "The tool produces the review and the printable", and [00-product-definition.md](00-product-definition.md) section 3 item 10 makes rendering a must-do. Filing all of it under optional phase 5 understates the gap. See fix 4. |

### A6. Section F, cost

| # | Claim in 16 | Checked against | Verdict | Note |
|---|---|---|---|---|
| 37 | Zero marginal cost was a deliberate design decision, 2026-07-01 | [11-decision-log.md](11-decision-log.md) | VERIFIED | "Zero marginal cost, fastest path to a testable review." |
| 38 | Multi-agent API or SDK build is phase 5 and per-token | [09-roadmap.md](09-roadmap.md) phase 5, [02-agent-architecture.md](02-agent-architecture.md) section G | VERIFIED | |
| 39 | Intake sessions hit account session limits twice and killed running agents | [progress.md](progress.md) sessions 4 and 5, [11-decision-log.md](11-decision-log.md) 2026-07-05 | VERIFIED | Both events logged, plus the local-mirror pivot that followed. |
| 40 | Blind labeling 16 to 19 person-hours, from the 30 to 40 min per case budget in PROTOCOL.md | [eval-cases-real/labeling/PROTOCOL.md](eval-cases-real/labeling/PROTOCOL.md) | CONTRADICTED by its own assumption | 14 cases x 2 labelers x 30 to 40 min is 14.0 to 18.7 hours. The stated assumption does not produce the stated number. See fix 1. |
| 41 | Adjudication 8 to 10 hours, stability 4 to 6, baseline 6 to 10, expert 5 to 8, each labeled as an estimate | [09-roadmap.md](09-roadmap.md) E5, [progress.md](progress.md) Next actions | VERIFIED as honestly labeled | The estimates are flagged as estimates and the anchors are real. No file validates the magnitudes and 16 says so. |
| 42 | Gold labels for real cases are human-only by decision, 2026-07-04 | [11-decision-log.md](11-decision-log.md), [12-real-deck-intake.md](12-real-deck-intake.md) section B | VERIFIED | |
| 43 | "These are volunteer hours from people who would otherwise be on client projects" | [eval-cases-real/labeling/PROTOCOL.md](eval-cases-real/labeling/PROTOCOL.md) | CONTRADICTED in substance | The protocol names the labelers: "the two builders for now, an expert later if one is available". The default plan is that the builders label their own eval set, which reproduces the insider-gold problem the effectiveness review names as a construct-validity hole for the synthetic set. 16 asks the board for two labelers without disclosing this. See fix 7. |

### A7. Section G, risks

| # | Claim in 16 | Checked against | Verdict | Note |
|---|---|---|---|---|
| 44 | Fitness verdict "expert-reviewer companion, not yet a direct student-facing tool" | [effectiveness-review-2026-07-03.md](effectiveness-review-2026-07-03.md) section 6 | VERIFIED | Verbatim. |
| 45 | Its reasoning: over-escalates on good work, finding set and confidence not demonstrated reproducible, scorecard mean not comparable | same, section 6 | VERIFIED | Verbatim in substance. |
| 46 | Stability is flagged in the repo as the single most important pre-pilot fix | [effectiveness-review-2026-07-03.md](effectiveness-review-2026-07-03.md) section 6, [progress.md](progress.md) session 3 | VERIFIED | Progress: "Single most important pre-pilot fix now that severity is calibrated". |
| 47 | Untested edge case: two blocking rules at different ceilings, only one fires, readiness flips | [effectiveness-review-2026-07-03.md](effectiveness-review-2026-07-03.md) section 5 | VERIFIED | |
| 48 | Case 05 failed before the fix: three minors graded major, no-blocker deck dragged R3 to R2 | [effectiveness-review-2026-07-03.md](effectiveness-review-2026-07-03.md) section 2, [eval-runs/scoring-2026-07-03.md](eval-runs/scoring-2026-07-03.md) section 5 | VERIFIED | |
| 49 | Severity block plus a floor against demoting a strong deck, decision log 2026-07-03 | [11-decision-log.md](11-decision-log.md), [01-rubric-v1.md](01-rubric-v1.md) section B | VERIFIED | The rubric carries the same definition. |
| 50 | The blind re-run landed R3 with two minor findings | [eval-runs/case-05-review-v2-live-r2.json](eval-runs/case-05-review-v2-live-r2.json), [progress.md](progress.md) session 3 | VERIFIED | |
| 51 | The fix rests on a single post-fix run and was driven by one case, which the harness warns against | [progress.md](progress.md) Green caveats, [effectiveness-review-2026-07-03.md](effectiveness-review-2026-07-03.md) section 4, [05-eval-harness.md](05-eval-harness.md) section E | VERIFIED | Strongest paragraph in the package. |
| 52 | Red team mode 8 confidentiality, Medium likelihood, High severity | [08-red-team.md](08-red-team.md) | VERIFIED | |
| 53 | Sanitization protocol contents (label, roles, logos, banded figures, describe rather than paste) | [07-workflow.md](07-workflow.md) section E | VERIFIED | Item for item. |
| 54 | Real cases are pseudonymised, not de-identified, because business facts and geography stay | [12-real-deck-intake.md](12-real-deck-intake.md) section C | VERIFIED | The package volunteers this. Good. |
| 55 | Red team mode 11 over-reliance, Medium and Medium, mitigation unproven, repeat-flag tracking only planned | [08-red-team.md](08-red-team.md) mode 11 | VERIFIED | "the FeedbackWriter null result reminds us this is unproven". |
| 56 | The eval is five short synthetic single-flaw decks, 9 to 10 slides, insider gold, no inter-rater check, file names announce the flaw | [effectiveness-review-2026-07-03.md](effectiveness-review-2026-07-03.md) section 4, [eval-cases/](eval-cases/) | VERIFIED | File names literally announce the flaw. |
| 57 | "This is a smoke test, not a validation. It should be labeled as one" | same, section 4 | VERIFIED | Verbatim. |
| 58 | The verbatim-quote rule has never been tested against garbled multi-column text | [effectiveness-review-2026-07-03.md](effectiveness-review-2026-07-03.md) section 4 | VERIFIED | Note the validator does normalize whitespace and non-breaking spaces ([03-output-contract.md](03-output-contract.md) D3), so the mechanism is partly prepared. Untested is still correct. |

### A8. Sections H, I and J

| # | Claim in 16 | Checked against | Verdict | Note |
|---|---|---|---|---|
| 59 | Sanitization approver is open question 3, "a board call, not a builder call" | [09-roadmap.md](09-roadmap.md) C3 | VERIFIED for the question, UNSUPPORTED for "board call" | The roadmap asks who agrees the first sanitization. It does not say the board decides. Fine as a proposal, not as a citation. |
| 60 | Stop conditions 1 to 3 are cross-cutting and pull the tool from any real use | [08-red-team.md](08-red-team.md) cross-cutting section | VERIFIED | Modes 8, 9 and 15. |
| 61 | Kill criterion: readiness disagreement of two levels or more, or contested, on a third or more, cited to 12 | [eval-cases-real/labeling/PROTOCOL.md](eval-cases-real/labeling/PROTOCOL.md) stop rule | VERIFIED but miscited | The exact wording is PROTOCOL's stop rule. [12-real-deck-intake.md](12-real-deck-intake.md) states a looser version ("no agreement on readiness level"). Cite PROTOCOL. |
| 62 | Stop condition: stability shows readiness flipping between runs, pause | no file | UNSUPPORTED | Sensible and new. It is not in [08-red-team.md](08-red-team.md) or anywhere else. Mark it as newly proposed so the board knows which conditions are pre-existing. |
| 63 | Baseline run "falls materially short of the acceptance threshold in 05 section E" | [05-eval-harness.md](05-eval-harness.md) section E | UNSUPPORTED as applied | Section E is a binary six-criterion gate written for the five synthetic cases. Criterion 4 names case 05 by name. Criterion 1 demands an exact readiness match on every case. No acceptance threshold for real cases exists anywhere in the repo. See fix 8, and section D gap 1. |
| 64 | "The decision after the baseline is explicitly one of continue, revise heavily or stop" | [09-roadmap.md](09-roadmap.md) section B, [00-product-definition.md](00-product-definition.md) section 11 | UNSUPPORTED as attributed | That trichotomy is defined for the decision after Phase 1, not after the real-deck baseline. Nothing defines the post-baseline decision. |
| 65 | Leads report an unacceptable false-positive rate, pause the pilot, phase 3 exit | [09-roadmap.md](09-roadmap.md) phase 3 | VERIFIED | Inverted from the exit criterion, fairly. |
| 66 | J: "Five synthetic cases pass the acceptance threshold on independent blind scoring" | [eval-runs/scoring-2026-07-03.md](eval-runs/scoring-2026-07-03.md) | CONTRADICTED | The compressed slide loses every caveat the body carries and states as fact the thing the only independent scoring sheet denies. This is the single line most likely to be quoted back later. See fix 3. |
| 67 | J: "A 14-case real-deck gold set is built" | [eval-cases-real/README.md](eval-cases-real/README.md) | CONTRADICTED by word choice | There is no gold set. There are 14 case files and zero gold labels. "Gold set" is the term the repo reserves for adjudicated human labels. See fix 9. |

### A9. Against 15-implementation-plan.md

[15-implementation-plan.md](15-implementation-plan.md) landed while this audit was running, as
did `check-stability.js`. Both change the picture. 15 is materially more rigorous on cost than
16 and the two documents do not agree. If both circulate, a board member will read the
mismatch as carelessness.

| # | Claim in 16 | Checked against | Verdict | Note |
|---|---|---|---|---|
| 68 | Labeling plus adjudication is 24 to 29 person-hours (16 to 19 plus 8 to 10) | [15-implementation-plan.md](15-implementation-plan.md) sections B and F Q2 | CONTRADICTED | 15 puts the labeling round at **32 to 40 person-hours**: 18 to 24 independent reading, 7 to 9 adjudication and 4 to 5 gold-file writing. 16 understates the largest block by 8 to 11 hours. |
| 69 | Total pre-pilot 40 to 55 person-hours (table sums to 39 to 53) | [15-implementation-plan.md](15-implementation-plan.md) section F Q2 | CONTRADICTED | 15 budgets **42 to 56 person-hours for the labeling round alone** once the stop-rule contingency is included. 16's figure for the entire package is smaller than 15's figure for one block of it. |
| 70 | The section F table is the full cost of the package | [15-implementation-plan.md](15-implementation-plan.md) section F Q2 | UNSUPPORTED | 16 has no line for writing the 14 gold files into the harness section C template. 15 costs it at 15 to 20 minutes per case, 4 to 5 hours. It is a required output of the round, not overhead. |
| 71 | 30 to 40 min per case per labeler, flat, from PROTOCOL.md | [15-implementation-plan.md](15-implementation-plan.md) section F Q2 | CONTRADICTED | 15 measured the case files: they run from 141 lines to 1405 lines. It calls a flat 35 minutes "defensible for the short half and optimistic for the long half" and bands it 25 to 30 / 35 to 45 / 45 to 60 by length. 16 applies the unrevised flat budget. |
| 72 | Risk 2 mitigation: "None yet." | `check-stability.js` | OVERSTATED, now stale | A stability measurement script now exists in the folder. It reports rather than passes or fails, and its header states there is no agreed threshold yet, but "none yet" is no longer accurate. |
| 73 | The estimates cover the pre-pilot package | [15-implementation-plan.md](15-implementation-plan.md) sections C and F Q2 | OVERSTATED | 16 carries no contingency for the PROTOCOL stop rule firing, which would force a rubric fix and a relabel. 15 budgets 30 to 40 percent on top for exactly that, and adds an owner-capacity assumption (6 to 8 focused hours a week) that 16 does not state. |
| 74 | Section H item 5 sequencing: stability first, then labeling and adjudication as one block | [15-implementation-plan.md](15-implementation-plan.md) sections B and F Q2 | CONTRADICTED | 15 recommends option B: a staged 4-case calibration batch first so the stop rule surfaces in week 2 rather than week 5, with stability measurement and prompt-freeze prep running **in parallel** with labeling, not before it. Same cost, much cheaper failure. 15's sequencing is better and 16 should adopt it. |

**Tally.** 74 claims checked: 44 VERIFIED, 10 OVERSTATED, 8 UNSUPPORTED, 12 CONTRADICTED.

Two further points from 15 that 16 needs. First, 15 confirms finding 43 independently: "A
second labeler exists and has 3 to 4 hours a week. This is currently an assumption, not a
fact", and its capacity option A notes that two builders labeling "the insider-gold criticism
from the effectiveness review carries straight over to the real set". Second, 15 names three
known prompt defects that must be fixed before the prompt is frozen for the baseline (the
light-touch dimension denominator, blockingIssues listing non-binding rules and the timeline
tile vocabulary clash), and warns that leaving them means "the first real number measures a
prompt we have already decided to change". None of this is in 16.

One place 15 agrees with 16 against my reading: 15 calls the renderer "Roadmap Phase 5,
correctly parked". The roadmap still does not name a renderer anywhere, so the attribution
remains unsupported, but two authors now share it. Finding 36 stands on the substance, that
filing all three contract views under optional tooling understates the gap, not on the label.

Note also that 16 skips file 15 in its numbering. That is now simply wrong: 15 exists, and 16
section F still asserts "There is no implementation plan file in this folder yet, so these are
derived from the protocols and roadmap." That sentence must go.

---

## B. The three hardest questions

### B1. "You are asking for 40-plus volunteer hours to find out whether it works at all. If the answer is no, what did the branch buy?"

**Why it is hard.** It is not a question about the tool. It is a question about expected
value under a real chance of a null result, asked by someone who has watched a keen member
build something that then sat unused. The package's own risk section says the eval so far
proves little, which means the board is being asked to spend a quarter of a member's semester
on a coin flip it cannot price.

**What 16 answers now.** Section A: "What it unblocks. The first honest number for whether
this tool helps on real work. Today there is none." And section F: "If the branch cannot fund
those hours, the honest answer is to pause, not to shortcut the gold."

**Would it survive follow-up.** No. It answers what the branch learns, not what the branch
gets if the answer is negative, and the honesty of the closing line does not price the
downside. The follow-up lands immediately: "so 40 hours to possibly learn we should stop."

**Better answer, grounded in the repo.** Three parts. First, unbundle: the stability
measurement is 4 to 6 hours and is mostly machine time ([progress.md](progress.md) Next
actions 1). It can flip the whole decision on its own, before any labeling hour is spent, and
16 already sequences it first. Ask the board to approve that block alone and to see the
variance number before releasing the labeling hours. Second, name the non-tool residual: the
14 adjudicated gold labels are branch training assets whatever happens to the reviewer, and
the adjudication round is a direct test of whether two trained readers can apply the rubric
([01-rubric-v1.md](01-rubric-v1.md) section F exit test, still unmet). If the rubric fails
that, the branch has learned something about its own review standard, not about an AI. Third,
state the kill point in hours: the PROTOCOL stop rule fires during labeling, not after it, so
the downside is bounded well below 40 hours.

### B2. "The paper says it is not fit for students to see. Who exactly is the user, and does that person have a problem?"

**Why it is hard.** It exposes the load-bearing gap. 16 asks for lead-companion mode only,
which means the user is the project lead. But 16 section C argues the value from member
learning and lead capacity, and the coaching gate it cites is the student-facing mechanism.
Strip out student use and what remains is a tool that hands a busy lead a raw JSON blob,
because [13-usage-guide.md](13-usage-guide.md) confirms there is no v2 renderer, no lead view
and no printable. A board member who asks "so what does the lead actually receive on Monday
morning" gets an unsatisfying answer.

**What 16 answers now.** Section G risk 1 mitigation: "Pilot it as an assistant to a human
who owns severity and readiness. The lead sign-off gate is designed in." And section H item 4
asks for agreement that it is used "only in expert or lead companion mode".

**Would it survive follow-up.** No. "Designed in" is doing the work that "built" would need
to do, and the package never says what the lead sees. Worse, the effectiveness review records
a defect that hits the lead view specifically: on cases 01 and 02 the `blockingIssues` layer
mis-ranks the primary diagnosis relative to the findings layer
([effectiveness-review-2026-07-03.md](effectiveness-review-2026-07-03.md) section 1). Lead
mode is exactly the view built on `blockingIssues`. 16 never mentions this.

**Better answer, grounded in the repo.** Say the user is the project lead and that today the
lead reads the JSON or a hand-rendered report, per
[expert-pack/README.md](expert-pack/README.md) assembly note. Add the blockingIssues
mis-ranking to section E as a known defect in the lead view, with the fix already named in
[effectiveness-review-2026-07-03.md](effectiveness-review-2026-07-03.md) section 5 (report the
binding blocker as primary, others as secondary). Then either scope a minimal lead view into
the ask or state explicitly that the pre-pilot package produces evidence only and that no lead
is asked to use the tool on a live project until a view exists.

### B3. "What happens the first time it tells a team a deck is fine and the client is unhappy?"

**Why it is hard.** It is the liability question, and it is the one that ends the pilot rather
than pausing it. The branch's exposure is reputational with a nonprofit client, and the
failure mode is silent: nobody logs the review that said nothing. 16 has a stop condition for
almost every loud failure and none for this quiet one.

**What 16 answers now.** Section G risk 3: "a review that reads authoritative and misses the
issue is worse than no review, because a team walks into a client meeting reassured." The
mitigation offered is the severity block, "the blind re-run landed R3 with two minor findings"
and "Every review states what it did not assess".

**Would it survive follow-up.** No, and it is the weakest mitigation in the package. It
answers a false-negative risk with evidence from a false-positive fix. The calibration change
made the tool grade *down*, which by construction moves it toward more Nearly-ready verdicts,
which is the direction of this risk. And its supporting evidence is one run on one deck. There
is no false-negative measurement anywhere in the repo: no seeded-flaw variants have been built
([eval-cases-real/seeded/](eval-cases-real/seeded/) is a spec with an empty variant table) and
the harness recall metric has only ever been scored against five insider golds.

**Better answer, grounded in the repo.** Three moves. First, name the accountability answer
plainly: the lead signs off, the AI does not, and a Nearly ready verdict is not a defence
([07-workflow.md](07-workflow.md) section C, which already says a readiness level is "a strong
signal, not a veto"). Second, add the missing measurement to the ask: build the seeded-flaw
variants specified in [eval-cases-real/seeded/README.md](eval-cases-real/seeded/README.md).
They are the cheapest false-negative test in the repo, need no labeling round because the
ground truth is mechanical and directly answer "does it miss a planted blocker". Third, add
the missing stop condition to section I: any real deliverable that the tool rated Nearly ready
and that a lead or a client later found to have a delivery-critical flaw is a case fail and
pauses lead-companion use pending review. There is currently no stop condition for a miss on
real work.

---

## C. Overclaiming audit

**C1. "Five synthetic cases pass the acceptance threshold on independent blind scoring."**
(section J)
Why it overclaims: the only independent scoring artifact against section E,
[eval-runs/scoring-2026-07-03.md](eval-runs/scoring-2026-07-03.md), concludes "NOT GREEN" and
fails case 05 on criteria 1 and 4. The five that are now green were never scored by one
independent scorer in one pass: four were scored pre-fix and the fifth by a separate re-scorer
whose sheet is not in the repo. On a one-slide summary with no caveats, this reads as
third-party validation.
Replacement:
> **Done.** Full design set, rubric, output contract, working validator. Five synthetic cases
> now meet the harness acceptance threshold, with a caveat: the four flawed cases were scored
> independently under the earlier prompt and the strong case under the current one, so no
> single independent scoring pass covers the green set. A 14-case real-deck eval set is built
> and anonymisation-swept. No human gold labels exist for it.

**C2. "all five have live blind runs under the frozen prompt"** (section D)
Why it overclaims: "frozen prompt" implies one prompt version across the set. No such run
exists, and 16 section E says the opposite four rows later.
Replacement:
> All five have live blind runs, though not all under the same prompt version: cases 01 to 04
> ran under the revised prompt and case 05 under the revised prompt plus the later severity
> fix.

**C3. "an independent fresh-context scorer scored the set against the acceptance threshold in
harness section E. Readiness matched gold on all five, every must-catch was found, restraint 3
on every case, safety clean ([progress.md](progress.md) session 3,
`eval-runs/scoring-2026-07-03.md`)."** (section D)
Why it overclaims: the second citation says the reverse. Restraint on case 05 in that sheet is
1, not 3. The green figures come from [progress.md](progress.md) prose, and the confirming
re-score of case 05 r2 has no artifact in [eval-runs/](eval-runs/).
Replacement:
> An independent fresh-context scorer scored the five live outputs and failed the set on case
> 05, for over-escalation ([eval-runs/scoring-2026-07-03.md](eval-runs/scoring-2026-07-03.md)).
> A severity-calibration fix followed, case 05 was re-run blind and a second independent
> scorer confirmed it passes section E points 1 and 4 ([progress.md](progress.md) session 3).
> The composite set now reads readiness matched on all five, every must-catch found, restraint
> 3 throughout and safety clean. The second re-score is recorded in progress.md prose and does
> not yet have its own scoring sheet in [eval-runs/](eval-runs/).

**C4. "The synthetic eval, green."** (section D heading)
Why it overclaims: "green" is a harness term of art that a board reader will hear as
"validated". The repo's own most senior assessment of the same result is "a smoke test, not a
validation". 16 does say this in section G risk 5, but 40 lines later.
Replacement heading and opening:
> **The synthetic eval, green against the harness, and only that.** Green here means the five
> synthetic cases clear the six criteria in [05-eval-harness.md](05-eval-harness.md) section
> E. Our own effectiveness review calls that a smoke test, not a validation. Read this row
> with section G risk 5.

**C5. "A 14-case real-deck gold set is built and anonymisation-QA'd."** (section J) and "The
real-deck gold set, built." (section D heading)
Why it overclaims: no gold exists. The repo uses "gold" strictly for adjudicated human labels
([12-real-deck-intake.md](12-real-deck-intake.md) section B). Calling the case set a gold set
in the one-slide summary, next to "No gold labels on the real cases" in the next block, will
read to a skimmer as work already done.
Replacement (both places):
> A 14-case real-deck eval set is built and anonymisation-swept. It has no gold labels yet.

**C6. "an orchestrator-level anonymisation sweep run over every case body ... One fix was
applied and logged."** (section D)
Why it overclaims: a grep sweep by the same orchestrator that wrote the cases is a self-check,
not QA. It catches patterns it thought to search for. [12-real-deck-intake.md](12-real-deck-intake.md)
E2.4 also records a second deliberate exception that 16 omits, and section C concedes the files
stay re-identifiable by business facts.
Replacement:
> a pattern sweep of every case body for client names, person names, emails, phone numbers,
> handles and live URLs, run by the same orchestrator that built the cases. One fix was
> applied and one generic org contact was kept deliberately and documented. This is a
> self-check, not an independent review, and by policy the case bodies remain
> re-identifiable from business facts, sector and geography.

**C7. "A severity block now defines critical, major and minor ... The blind re-run landed R3
with two minor findings."** (section G risk 3 mitigation)
Why it overclaims by adjacency: the mitigation paragraph reads as though the over-escalation
risk is closed. The residual paragraph beneath it is honest, but the mitigation sentence is
what gets quoted. The effectiveness review is explicit that the fix "is improved not solved"
and that it "still rests on the model's judgment".
Replacement (append to the mitigation, before the residual):
> This narrows the failure, it does not close it. The definition still rests on the model's
> judgment of whether the client's decision changes, and the whole R2-to-R3 boundary sits on
> that judgment ([effectiveness-review-2026-07-03.md](effectiveness-review-2026-07-03.md)
> section 5).

**C8. "The coaching gate means the consultant must attempt the reflect question before the fix
unlocks."** (section C)
Why it overclaims: present tense for an unbuilt feature. The gate ships in the v1 renderer for
the v1 schema. There is no v2 view of any kind ([13-usage-guide.md](13-usage-guide.md) section
G).
Replacement:
> The design puts a coaching gate in the student view: the fix stays locked until the
> consultant answers the reflect question. That gate runs today in the v1 renderer. The v2
> student view, lead view and printable are specified in
> [03-output-contract.md](03-output-contract.md) and are not built, so v2 output today is JSON.

**C9. "Estimated 40 to 55 person-hours"** (sections A, F total and J)
Why it overclaims: the table sums to 39 to 53, and the labeling line does not follow from its
own stated assumption (14 to 18.7 hours, not 16 to 19). A rounded-up total presented three
times reads as a measurement. Since 16 was written,
[15-implementation-plan.md](15-implementation-plan.md) has costed the same work properly
against the actual case-file lengths and lands at 32 to 40 person-hours for the labeling round
alone, plus a stop-rule contingency. 16's number is not just imprecise, it is low.
Replacement: see fix 1.

**C10. "an orchestrator-level ... Files are `eval-cases-real/real-01` through `real-14`"**
paired with **"Every row below is checkable against a file on the `idea/reviewer-v2` branch."**
(section D intro)
Why it overclaims: two rows in that table are not checkable as stated (claims 19 and 22 above),
and one cites a file that says the opposite (claim 25). The intro line raises the standard the
table then misses.
Replacement: keep the intro line and fix the rows. It is a good promise. Make it true.

---

## D. Gaps

1. **No acceptance threshold for the real cases.** Section I stops on a baseline that "falls
   materially short of the acceptance threshold in [05-eval-harness.md](05-eval-harness.md)
   section E". Section E is a six-criterion binary gate written for five synthetic cases, one
   criterion of which names case 05 by name, and another of which requires an exact readiness
   match on every case. On 14 messy multi-flaw real decks an exact match on all 14 is a bar
   nobody expects to clear. The board is being asked to approve a stop condition that cannot
   be evaluated. This needs a written real-case threshold before the baseline runs, not after.

2. **The blockingIssues mis-ranking defect is absent.** [effectiveness-review-2026-07-03.md](effectiveness-review-2026-07-03.md)
   section 1 finds that on cases 01 and 02 the blockingIssues layer ranks the primary
   diagnosis differently from the findings layer, and calls it "a real defect even when the
   readiness lands right". The package asks for lead-companion mode, and lead mode is the view
   built on blockingIssues. This belongs in section E and section G.

3. **No mention of v1.** [00-product-definition.md](00-product-definition.md) section 10
   describes v1 as a working single-pass reviewer with a shipped renderer, a typed-attempt
   gate and zero marginal cost. The board will ask what v2 buys over the tool that already
   exists and whether v1 is in use today. 16 never names v1.

4. **Who the labelers are.** Section H asks for "two labelers" with no names, no source and no
   disclosure that [eval-cases-real/labeling/PROTOCOL.md](eval-cases-real/labeling/PROTOCOL.md)
   defaults to the two builders. A board approving 24 to 29 hours of labeling needs to know
   whether it is approving other people's time or ratifying the builders labeling their own
   eval.

5. **No false-negative measurement and no seeded variants.** Risk 3 names false negatives as
   the worse failure and offers no measurement. [eval-cases-real/seeded/README.md](eval-cases-real/seeded/README.md)
   specifies exactly the cheap mechanical test for this and no variants have been built. It is
   not in the ask, not in the cost table and not in section E.

6. **No legal or client-consent basis for reusing past deliverables.** Section H item 3 asks
   the board's permission to use past deliverables. It never asks whether the branch's client
   agreements permit reuse of engagement material for internal tool development, nor whether
   any client would need to be told. The anonymisation policy explicitly keeps the material
   re-identifiable ([12-real-deck-intake.md](12-real-deck-intake.md) section C). A board with
   any governance instinct asks this first.

7. **No owner, no dates and no review point.** Section H item 5 sequences by dependency and
   deliberately gives no dates, which is defensible for volunteer work. But there is no named
   owner for any block, no expiry on the approval and no scheduled point at which the board
   sees progress. "Sequenced by dependency" plus no date plus no owner is how work quietly
   stops.

8. **Nothing about what happens to the material afterwards.** Retention, deletion and who may
   read the real case files are covered for reviews in [07-workflow.md](07-workflow.md) section
   E but not for the 14 real case files, which are the more sensitive artifact and live
   indefinitely in a private repo.

9. **No comparison to the do-nothing option.** The package compares the tool to nothing. A
   board weighing 40-plus hours will want the alternative use of the same hours named, for
   instance a lead-review checklist or a training session, and a reason to prefer this.

10. **The prompt-freeze problem is absent.** [15-implementation-plan.md](15-implementation-plan.md)
    section B makes the point 16 needs and does not make: three known prompt defects are on
    record and unfixed, and both [05-eval-harness.md](05-eval-harness.md) section G and
    [12-real-deck-intake.md](12-real-deck-intake.md) gate 6 forbid prompt changes mid-baseline.
    So the baseline the board is being asked to fund would measure a prompt already known to
    need changing, unless the defects are fixed first. That is a real cost item and a real
    sequencing constraint, and 16 mentions neither.

---

## E. Fix list

1. `[FIX]` **Replace the whole cost table with 15's numbers.** 15 did this work properly
   against the actual case files, so 16 should defer to it rather than re-derive. In section
   F, delete the sentence "There is no implementation plan file in this folder yet, so these
   are derived from the protocols and roadmap" and replace it with "Figures are taken from
   [15-implementation-plan.md](15-implementation-plan.md) section F, which derives them from
   the protocols and from the actual case-file lengths." Then replace the first two table rows
   with these three:
   > | Blind labeling, 14 cases, 2 labelers | 18 to 24 person-hours | 25 to 30 min per case under 400 lines, 35 to 45 in the middle, 45 to 60 over 800. Case files run 141 to 1405 lines ([15-implementation-plan.md](15-implementation-plan.md) F Q2). |
   > | Adjudication of the 14 cases | 7 to 9 person-hours | 15 to 20 min per case with both labelers present, and it must be synchronous. |
   > | Writing the 14 gold files | 4 to 5 person-hours | 15 to 20 min per case into the [05-eval-harness.md](05-eval-harness.md) section C template. |

   Keeping 16's existing rows for stability (4 to 6), the baseline run (6 to 10) and the
   expert session (5 to 8), the total row becomes "**44 to 62**". Check the arithmetic before
   publishing: 18+7+4+4+6+5 = 44 and 24+9+5+6+10+8 = 62. Add a row beneath the total:
   "| Stop-rule contingency | plus 30 to 40 percent on the labeling block | If 5 or more of 14
   cases land two readiness levels apart or contested, the rubric is fixed and the contested
   cases are relabeled ([eval-cases-real/labeling/PROTOCOL.md](eval-cases-real/labeling/PROTOCOL.md)
   stop rule). |" Then change section A and section J to "Estimated 44 to 62 person-hours, plus
   a stop-rule contingency of 30 to 40 percent on the labeling block." Do not present a single
   number without the contingency. Note this is a materially larger ask than the 40 to 55 the
   board would otherwise have approved, and it is the correct one.

2. `[FIX]` **Remove "frozen prompt" from section D.** Apply the C2 replacement text.

3. `[FIX]` **Repair the scoring citation.** Apply the C3 replacement text in section D and the
   C1 replacement text in section J. These two are the highest-priority fixes in this audit.

4. `[FIX]` **Tell the truth about the renderer in three places.** (a) Section C: apply the C8
   replacement. (b) Section E, replace the renderer row with: "| Any v2 view of the output |
   None built. The student coaching view, the lead view and the printable are specified in
   [03-output-contract.md](03-output-contract.md) section C and do not exist. Today the output
   is raw JSON, read directly or rendered by hand ([13-usage-guide.md](13-usage-guide.md)
   section G). |" (c) Section H item 4, append: "Note that lead-companion mode today means a
   lead reading the JSON or a hand-rendered report. No lead view is built."

5. `[FIX]` **Downgrade "ready to send".** Section D, change the expert pack row's Item cell to
   "Expert feedback pack, assembled" and its Evidence cell to
   "[06-expert-feedback-pack.md](06-expert-feedback-pack.md), `expert-pack/`. One source-
   verification item remains open and is a stated gate before the pack ships
   ([09-roadmap.md](09-roadmap.md) section D, [progress.md](progress.md) Next actions 3)."

6. `[FIX]` **Qualify the anonymisation sweep.** Apply the C6 replacement text in section D.

7. `[OWNER DECISION]` **Name the labelers, and decide whether builders may label.**
   [eval-cases-real/labeling/PROTOCOL.md](eval-cases-real/labeling/PROTOCOL.md) defaults to the
   two builders. Whether that is acceptable, whether the branch can supply two non-builder
   labelers and whether an ex-consultant can take one seat is a people question the repo cannot
   answer. Whatever is decided, disclose it in section H item 2 and add one line to section G
   risk 5 residual noting that builder-written gold carries the same insider-gold limitation
   the effectiveness review names for the synthetic set.

8. `[OWNER DECISION]` **Write a real-case acceptance threshold, or say the board sets one
   later.** Section E of the harness does not transfer to 14 real decks. Either draft a real-
   case threshold before the baseline runs, or change the section I row to: "Baseline run on
   real cases falls short of a real-case acceptance threshold, which does not yet exist and
   must be written and agreed before the baseline runs. The harness section E threshold was
   written for the five synthetic cases and does not transfer." This is an owner decision
   because it sets the bar the project will be judged against.

9. `[FIX]` **Stop calling the real case set a gold set.** Apply the C5 replacement in section J
   and change the section D heading "The real-deck gold set, built." to "The real-deck eval
   set, built. No gold labels yet."

10. `[FIX]` **Add the blockingIssues defect to section E.** Insert a row: "| Correct ranking
    inside the lead view | Known defect. On cases 01 and 02 the blockingIssues layer ranks the
    primary diagnosis differently from the findings layer, so a lead reading blockingIssues
    order can misread which issue caps the deck. Fix named, not applied
    ([effectiveness-review-2026-07-03.md](effectiveness-review-2026-07-03.md) sections 1 and
    5). |"

11. `[FIX]` **Add the diagnosticMean comparability defect to section E.** Insert a row: "|
    Comparable scorecard mean across cases | Not achieved. The light-touch dimension
    denominator is chosen by the model on the fly, so diagnosticMean is not comparable across
    cases or reviewers ([effectiveness-review-2026-07-03.md](effectiveness-review-2026-07-03.md)
    section 3a). Do not present it as an objective number. |"

12. `[FIX]` **Add the missing stop condition for a real-work miss.** Section I, add a row: "|
    A deliverable the tool rated Nearly ready is later found by a lead or a client to have a
    delivery-critical flaw | Case fail. Pause lead-companion use and review before further use.
    |" Also mark the stability stop condition as newly proposed rather than drawn from
    [08-red-team.md](08-red-team.md).

13. `[FIX]` **Fix the two miscitations.** Section I, change the labeler-disagreement row
    citation from "[12-real-deck-intake.md](12-real-deck-intake.md) kill criterion" to
    "[eval-cases-real/labeling/PROTOCOL.md](eval-cases-real/labeling/PROTOCOL.md) stop rule".
    Section I, delete "The decision after the baseline is explicitly one of continue, revise
    heavily or stop", which is the post-Phase-1 decision in [09-roadmap.md](09-roadmap.md)
    section B, not the post-baseline one.

14. `[FIX]` **Add a v1 paragraph to section B.** Insert after the opening paragraph: "This is
    v2. v1 is a working single-pass reviewer with five criteria, a maximum of three findings, a
    shipped renderer with the typed-attempt gate and zero marginal cost
    ([00-product-definition.md](00-product-definition.md) section 10). v2 keeps all of it and
    adds ten dimensions, blocking-issue readiness, a noise budget, an evidence base and an
    evaluation harness. v1 stays untouched and shippable
    ([11-decision-log.md](11-decision-log.md), 2026-07-01)."

15. `[OWNER DECISION]` **Answer the client-consent question in section H item 3.** Whether past
    engagement material may be reused for internal tool development, whether any client needs
    to be told and who in the branch owns that call are governance facts the repo does not
    hold. Add the answer to the ask, because the board will not approve item 3 without it.

16. `[OWNER DECISION]` **Name owners and a review point in section H item 5.** Add a named
    owner per block and one line: "The board sees the stability variance number and the
    labeler agreement log before the baseline run is commissioned." Owners and appetite are
    outside the repo.

17. `[FIX]` **Add the seeded variants to the ask, or say why not.** Section F cost table, add
    a row: "| Build and run the seeded-flaw variants | 3 to 5 person-hours | One strong deck
    copied per injected flaw, ground truth mechanical, no labeling round needed
    ([eval-cases-real/seeded/README.md](eval-cases-real/seeded/README.md)). My estimate. |" and
    reference it in section G risk 3 as the false-negative measurement that does not yet exist.
    If it is deliberately out of scope, say so in section E instead.

18. `[FIX]` **Soften the calibration mitigation.** Apply the C7 replacement in section G risk 3.

19. `[FIX]` **Label the two unsourced branch assertions.** Section C, change "Project lead
    review capacity is the scarce good in a student branch and it is uneven across projects" to
    "Project lead review capacity is, in our judgment, the scarce good in a student branch and
    it is uneven across projects. This is an observation, not a measured claim." Section H item
    3, change "This is open question 3 in [09-roadmap.md](09-roadmap.md) and it is a board
    call, not a builder call" to "This is open question 3 in [09-roadmap.md](09-roadmap.md).
    We propose it is a board call, not a builder call."

20. `[FIX]` **Link 15 and adopt its sequencing.** 15 now exists, so 16's intro should point at
    it: append to the intro paragraph "The sequenced plan behind this ask is
    [15-implementation-plan.md](15-implementation-plan.md)." Then replace section H item 5
    with: "**Timeline.** Sequenced by dependency, not by date, because these are volunteer
    hours. Labeling starts with a 4-case calibration batch picked for stage spread, so the
    rubric stop rule surfaces in week 2 rather than week 5. The remaining 10 cases follow only
    if the agreement check holds. Stability measurement and the known prompt-defect fixes run
    in parallel with labeling and must finish before the prompt is frozen. Then the baseline
    run on all 14 with independent scoring, then the expert session with real-case evidence in
    hand. The board sees the agreement log and the stability number before the baseline is
    commissioned ([15-implementation-plan.md](15-implementation-plan.md) sections B and F Q2)."

21. `[FIX]` **Update the risk 2 mitigation.** Section G risk 2, replace "*Mitigation.* None
    yet." with "*Mitigation.* Partial. `check-stability.js` now exists and measures how far
    the finding set, confidence and blocking-rule accounting move across repeated runs. It
    reports a number, it does not pass or fail, and no threshold has been agreed. The
    measurement itself has not been run."

22. `[FIX]` **Add the prompt-freeze constraint to section E and the ask.** Section E, add a
    row: "| Three known prompt defects fixed | Open. The light-touch dimension denominator,
    blockingIssues listing non-binding rules and the timeline tile vocabulary clash are all on
    record and unfixed ([effectiveness-review-2026-07-03.md](effectiveness-review-2026-07-03.md)
    section 3). [05-eval-harness.md](05-eval-harness.md) section G and
    [12-real-deck-intake.md](12-real-deck-intake.md) gate 6 forbid prompt changes mid-baseline,
    so these must close before the prompt is frozen or the first real number measures a prompt
    we have already decided to change ([15-implementation-plan.md](15-implementation-plan.md)
    section B). |"

23. `[OWNER DECISION]` **Reconcile 16 and 15 before either circulates.** They disagree on the
    single number the board will remember. Decide which document owns the cost figure, make
    the other cite it and check the arithmetic in both. If 16 goes to the board and 15 stays
    internal, 16 must still carry 15's numbers.

---

## F. Verdict

**Not board-ready as written.** It is close, and it is a genuinely good paper. The risk
section does what almost no internal tech proposal does: it argues against itself with
citations. Forty-four of seventy-four checked claims verify cleanly and several of the honest
admissions in section E are quoted almost verbatim from the repo's own caveats.

But four things would fail in the room. The first is new since the paper was written:
[15-implementation-plan.md](15-implementation-plan.md) now exists and puts the labeling round
alone at 32 to 40 person-hours before contingency, against 16's 24 to 29 for labeling plus
adjudication and 40 to 55 for everything. Two documents in the same folder giving the board
different numbers for the same work is the fastest way to lose a vote. Second, section D cites
[eval-runs/scoring-2026-07-03.md](eval-runs/scoring-2026-07-03.md) for a result that file
explicitly denies, and section J then states that result as unqualified validation. One board
member who opens the file loses the paper's credibility on everything else, including the
honest parts. Second, the package leans on a coaching gate and implies a usable lead output
while [13-usage-guide.md](13-usage-guide.md) states there is no v2 view of any kind. Third,
the stop condition that is supposed to end the project points at an acceptance threshold that
does not exist for real cases.

**Shortest path to board-ready.** Apply fixes 1, 2, 3, 4, 5, 6 and 9 first: they are pure text
edits, they take under an hour and they remove every CONTRADICTED claim in this audit. Then get
owner answers on fixes 7, 8 and 15, which are the three the board will actually interrogate.
Fixes 10 to 14 and 17 to 20 sharpen the paper and can follow. Do not present it with C1 and C3
unfixed.
