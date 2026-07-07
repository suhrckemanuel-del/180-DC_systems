# 06. Expert feedback pack

Sprint 6 artifact. A clean package for an ex-McKinsey, tech or VC reviewer. The expert
is scarce, so the pack is built to force useful, specific feedback rather than vague
praise. This document explains the pack and how to run the session. The pack itself is
assembled in [expert-pack/](expert-pack/).

Voice rules apply.

---

## A. What we are asking the expert

One question, framed plainly: does the AI reviewer find the issues that matter and give
feedback that would improve the deliverable's usefulness to the client. We are not
asking whether the output sounds professional. We are asking whether a senior
practitioner would agree with its priorities.

## B. What is in the pack

Assembled in [expert-pack/](expert-pack/) and drawing on the cases in
[eval-cases/](eval-cases/):

1. **One-pager** ([expert-pack/one-pager.md](expert-pack/one-pager.md)): what the tool
   is, the objective and non-objectives, and the ten-dimension rubric in brief.
2. **Three samples**, each a deliverable plus the AI review it produced:
   - Case 01, a broken deck (vague recommendation on an unsourced number).
   - Case 03, a structurally weak deck (findings dump, no answer).
   - Case 05, a strong deck (tests whether the AI shows restraint).
   The decks are the `case-NN-*.md` files and the reviews are the `case-NN.review.json`
   files, rendered to the readable report shape for the expert.
3. **The feedback form** ([expert-pack/feedback-form.md](expert-pack/feedback-form.md)):
   the structured questions below.
4. **The scoring sheet** ([expert-pack/scoring-sheet.md](expert-pack/scoring-sheet.md)):
   optional, if the expert wants to score against the seven metrics.

The three samples are deliberately a broken, a weak and a strong deck so the expert can
see whether the reviewer discriminates rather than always finding three criticals.

## C. Two session formats

**30-minute version.** One-pager plus one sample (case 01, the broken deck) with its AI
review, and the six sharp questions in section D. Enough to get a signal on
prioritization and whether the feedback is useful.

**60-minute version.** All three samples with their reviews, the rubric in full and the
complete feedback form. This is the primary version, and it contains the 30-minute
version inside it, so we build once. If the expert has only 30 minutes, hand them the
case-01 sample and the six questions.

## D. The questions (built to force useful answers)

Framed to be answerable and comparative, not "what do you think":

1. What did the AI catch that genuinely matters for the client's decision.
2. What did it miss that you would have raised.
3. What did it get wrong.
4. What was technically true but low-value, the kind of comment a senior would cut.
5. Where would a senior consultant prioritize differently, and why.
6. Which rubric dimensions are missing, overweighted or underweighted.
7. On the strong deck (case 05), did the AI show appropriate restraint, or did it invent
   problems.
8. Would this help a project lead review faster or better, or would it add noise.
9. Which failure mode worries you most if we put this in front of student teams.

Questions 1 to 6 are the 30-minute set (question 7 applies only if the strong sample is
included). Questions 7 to 9 are added for the 60-minute session.

## E. How we use the feedback

Every expert answer is logged as a true positive, a false positive, a false negative or
a low-value note in the disagreement log in [05-eval-harness.md](05-eval-harness.md),
then converted into the smallest prompt or rubric change that addresses it, with a line
in [11-decision-log.md](11-decision-log.md). We do not change the tool on a single
offhand remark. We change it on a pattern the expert names and the cases confirm.

## F. Honesty in the pack

The one-pager states the limits plainly, including the null result from the
FeedbackWriter study (AI feedback improved revisions but did not, in that study, move
durable learning scores) and the fact that the reviewer advises and never signs off. An
expert trusts a pack that names its own weak points. See
[10-source-register.md](10-source-register.md) S10.
